// split_test.js PAGE.html [--offline] [--reduced] [--wait MS] [--json]     (run: node split_test.js ...)
// Real-browser check of one page: loads it in headless Chromium over CDP (node's global WebSocket, no packages),
// collects uncaught exceptions and console errors, probes canvases and equations, then moves every slider,
// select and checkbox and clicks every button (except network fetches) and collects again.
// Exit code 0 = no exception and no console error; 1 = something failed.
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const args = process.argv.slice(2);
const file = path.resolve(args[0]);
const offline = args.includes('--offline'), reduced = args.includes('--reduced'), asJson = args.includes('--json');
const waitMs = +(args.includes('--wait') ? args[args.indexOf('--wait') + 1] : 1500);

function findChrome() {
  const base = path.join(os.homedir(), '.cache', 'ms-playwright');
  for (const d of fs.readdirSync(base).sort().reverse()) {
    if (!d.startsWith('chromium_headless_shell-')) continue;
    const p = path.join(base, d, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (fs.existsSync(p)) return p;
  }
  throw new Error('no chrome-headless-shell under ' + base);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'splittest-'));
  const chrome = spawn(findChrome(), ['--remote-debugging-port=0', '--user-data-dir=' + dir, '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
  let done = false;
  const cleanup = () => { if (done) return; done = true; try { chrome.kill('SIGKILL'); } catch (e) {} try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} };
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { cleanup(); process.exit(130); });
  process.on('exit', cleanup);
  const hard = setTimeout(() => { console.error('HARD TIMEOUT'); cleanup(); process.exit(3); }, 150000);

  let port, wsPath;
  for (let i = 0; i < 100; i++) {
    try { const t = fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n'); port = t[0]; wsPath = t[1]; if (port && wsPath) break; } catch (e) {}
    await sleep(100);
  }
  if (!port) throw new Error('chrome did not start');
  const ws = new WebSocket('ws://127.0.0.1:' + port + wsPath);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let nextId = 0; const pending = new Map(); let session = null; const events = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id) { const p = pending.get(m.id); if (p) { pending.delete(m.id); m.error ? p.rej(new Error(p.method + ': ' + m.error.message)) : p.res(m.result); } }
    else events.push(m);
  };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const id = ++nextId; pending.set(id, { res, rej, method }); ws.send(JSON.stringify({ id, method, params, sessionId })); });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  session = (await send('Target.attachToTarget', { targetId, flatten: true })).sessionId;
  const S = (m, p) => send(m, p, session);
  await S('Page.enable'); await S('Runtime.enable'); await S('Log.enable'); await S('Network.enable');
  if (reduced) await S('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  if (offline) await S('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });

  const problems = [], warnings = [];
  const seen = new Set();
  function drain(phase) {
    while (events.length) {
      const m = events.shift();
      if (m.sessionId !== session) continue;
      if (m.method === 'Inspector.targetCrashed') problems.push({ phase, kind: 'crash', text: 'renderer crashed' });
      else if (m.method === 'Page.javascriptDialogOpening') S('Page.handleJavaScriptDialog', { accept: false }).catch(() => {});
      else if (m.method === 'Runtime.exceptionThrown') {
        const d = m.params.exceptionDetails;
        const txt = ((d.exception && d.exception.description) || d.text || '').split('\n')[0].slice(0, 220);
        if (/setPointerCapture|releasePointerCapture|No active pointer|hasPointerCapture/.test(txt)) { warnings.push({ phase, kind: 'synthetic-pointer', text: txt }); continue; }
        const key = 'E|' + txt + '|' + d.lineNumber; if (!seen.has(key)) { seen.add(key); problems.push({ phase, kind: 'exception', text: txt, line: d.lineNumber, col: d.columnNumber }); }
      } else if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning')) {
        const txt = m.params.args.map(a => (a.value !== undefined ? String(a.value) : (a.description || ''))).join(' ').slice(0, 220);
        const key = 'C|' + m.params.type + '|' + txt; if (seen.has(key)) continue; seen.add(key);
        (m.params.type === 'error' ? problems : warnings).push({ phase, kind: 'console.' + m.params.type, text: txt });
      } else if (m.method === 'Log.entryAdded' && (m.params.entry.level === 'error')) {
        const e = m.params.entry; const key = 'L|' + e.text + '|' + e.url; if (seen.has(key)) continue; seen.add(key);
        const net = e.source === 'network';
        (net && offline ? warnings : problems).push({ phase, kind: 'log.' + e.source, text: (e.text + ' ' + (e.url || '')).slice(0, 200) });
      }
    }
  };

  const nav = await S('Page.navigate', { url: 'file://' + file });
  if (nav.errorText) problems.push({ phase: 'load', kind: 'navigate', text: nav.errorText });
  const t0 = Date.now();
  for (let i = 0; i < 300; i++) {                       // wait for the document (a blocking CDN script can take seconds)
    try { const r = await S('Runtime.evaluate', { returnByValue: true, expression: 'document.readyState' }); if (r.result && r.result.value === 'complete') break; } catch (e) {}
    drain('load'); await sleep(100);
  }
  const loadMs = Date.now() - t0;
  const t1 = Date.now();
  for (;;) { drain('load'); if (events.length === 0 && Date.now() - t1 > waitMs) break; await sleep(100); if (Date.now() - t1 > 40000) break; }
  await sleep(200); drain('load');

  const probe = await S('Runtime.evaluate', { returnByValue: true, expression: `(() => {
    const out = { title: document.title, sections: document.querySelectorAll('section').length, canvases: [], katex: document.querySelectorAll('.katex').length, katexFallback: document.querySelectorAll('.katex-fallback').length,
      ranges: document.querySelectorAll('input[type=range]').length, buttons: document.querySelectorAll('button').length, selects: document.querySelectorAll('select').length, textLen: document.body.innerText.length };
    document.querySelectorAll('canvas').forEach(c => {
      const r = { id: c.id || '(no id)', w: c.width, h: c.height, kind: 'n/a', distinct: -1 };
      try { const g = c.getContext('2d'); if (g && c.width * c.height > 0) { r.kind = '2d'; const W = c.width, H = c.height; const set = new Set();
        for (let k = 0; k < 400; k++) { const x = Math.floor((k * 7919) % W), y = Math.floor((k * 104729) % H); const d = g.getImageData(x, y, 1, 1).data; set.add(d[0] + ',' + d[1] + ',' + d[2] + ',' + d[3]); } r.distinct = set.size; } else if (!g) r.kind = 'webgl-or-none'; } catch (e) { r.kind = 'err ' + e.message; }
      out.canvases.push(r);
    });
    return out; })()` });
  const info = probe.result && probe.result.value;
  if (!info) {
    drain('probe');
    problems.push({ phase: 'probe', kind: 'probe', text: JSON.stringify(probe).slice(0, 300) });
    console.log('FAIL ' + path.basename(file) + ' | probe returned nothing');
    problems.slice(0, 12).forEach(p => console.log('  PROBLEM [' + p.phase + '] ' + p.kind + ': ' + p.text));
    cleanup(); process.exit(1);
  }

  const interact = await S('Runtime.evaluate', { returnByValue: true, awaitPromise: true, expression: `(async () => {
    const nap = ms => new Promise(r => setTimeout(r, ms)); let n = 0; const errs = [];
    const fire = (el, ev) => { try { el.dispatchEvent(new Event(ev, { bubbles: true })); } catch (e) { errs.push(String(e).slice(0, 160)); } };
    for (const el of document.querySelectorAll('input[type=range]')) { const lo = el.min === '' ? 0 : +el.min, hi = el.max === '' ? 100 : +el.max, was = el.value;
      for (const v of [lo, hi, (lo + hi) / 2, was]) { el.value = v; fire(el, 'input'); fire(el, 'change'); n++; } await nap(10); }
    for (const el of document.querySelectorAll('select')) { const was = el.selectedIndex; for (let i = 0; i < el.options.length; i++) { el.selectedIndex = i; fire(el, 'input'); fire(el, 'change'); n++; } el.selectedIndex = was; fire(el, 'change'); await nap(10); }
    for (const el of document.querySelectorAll('input[type=checkbox]')) { el.click(); n++; el.click(); n++; await nap(10); }
    for (const el of document.querySelectorAll('input[type=text], input[type=number], textarea')) { const was = el.value; el.value = was; fire(el, 'input'); fire(el, 'change'); n++; }
    const skip = /fetch|live almanac|download|copy/i;
    for (const el of document.querySelectorAll('button:not([disabled])')) { const label = (el.id + ' ' + el.textContent).slice(0, 80); if (skip.test(label)) continue; try { el.click(); n++; } catch (e) { errs.push(String(e).slice(0, 160)); } await nap(15); }
    // canvas gestures: pointer, mouse, wheel (synthetic events; setPointerCapture on a fake pointer is ignored below)
    for (const c of document.querySelectorAll('canvas')) {
      const r = c.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
      const at = (fx, fy, extra) => Object.assign({ clientX: r.left + r.width * fx, clientY: r.top + r.height * fy, bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, buttons: 1 }, extra || {});
      const seq = [['PointerEvent', 'pointerover', .5, .5], ['MouseEvent', 'mouseover', .5, .5], ['PointerEvent', 'pointerdown', .3, .4], ['MouseEvent', 'mousedown', .3, .4],
        ['PointerEvent', 'pointermove', .5, .45], ['MouseEvent', 'mousemove', .5, .45], ['PointerEvent', 'pointermove', .75, .6], ['MouseEvent', 'mousemove', .75, .6],
        ['PointerEvent', 'pointerup', .75, .6], ['MouseEvent', 'mouseup', .75, .6], ['MouseEvent', 'click', .75, .6], ['MouseEvent', 'dblclick', .75, .6],
        ['WheelEvent', 'wheel', .5, .5, { deltaY: 120 }], ['WheelEvent', 'wheel', .5, .5, { deltaY: -240 }], ['PointerEvent', 'pointerleave', .5, .5], ['MouseEvent', 'mouseleave', .5, .5]];
      for (const [cls, type, fx, fy, extra] of seq) { try { c.dispatchEvent(new window[cls](type, at(fx, fy, extra))); n++; } catch (e) { errs.push(type + ': ' + String(e).slice(0, 140)); } }
      await nap(10);
    }
    for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Enter', 'Escape', '+', '-']) {
      for (const tgt of [document, document.activeElement || document.body]) { try { tgt.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true })); tgt.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true })); n += 2; } catch (e) { errs.push('key ' + key + ': ' + String(e).slice(0, 120)); } }
    }
    window.dispatchEvent(new Event('resize')); document.dispatchEvent(new Event('visibilitychange')); n += 2;
    await nap(400);
    return { interactions: n, syncErrors: errs };
  })()` });
  drain('interact'); await sleep(500); drain('interact');
  const act = interact.result.value || { interactions: 0, syncErrors: [String((interact.exceptionDetails || {}).text)] };
  act.syncErrors.forEach(t => (/setPointerCapture|releasePointerCapture|No active pointer/.test(t) ? warnings : problems).push({ phase: 'interact', kind: 'sync', text: t }));

  clearTimeout(hard);
  const blank = info.canvases.filter(c => c.kind === '2d' && c.distinct <= 1);
  // canvases the full page also leaves empty at load (drawn on demand or when scrolled into view)
  const KNOWN_BLANK = new Set(['tfeBlowCanvas', 'tnsCanvas']);
  blank.filter(c => !KNOWN_BLANK.has(c.id) && !args.includes('--allow-blank')).forEach(c => problems.push({ phase: 'probe', kind: 'blank-canvas', text: 'canvas ' + c.id + ' is blank after load and the interactions (the full page draws it)' }));
  const result = { file: path.basename(file), offline, reduced, title: info.title, loadMs, sections: info.sections, textLen: info.textLen, katex: info.katex, katexFallback: info.katexFallback,
    controls: { ranges: info.ranges, selects: info.selects, buttons: info.buttons }, canvases: info.canvases.length, blankCanvases: blank.map(c => c.id), interactions: act.interactions,
    problems, warnings, pass: problems.length === 0 };
  if (asJson) console.log(JSON.stringify(result));
  else {
    console.log('load ' + loadMs + ' ms');
    console.log((result.pass ? 'PASS ' : 'FAIL ') + result.file + (offline ? ' [offline]' : '') + (reduced ? ' [reduced-motion]' : '') + ' | sections ' + result.sections + ', canvases ' + result.canvases + ' (blank: ' + (result.blankCanvases.join(',') || 'none') + '), katex ' + result.katex + ' (fallback ' + result.katexFallback + '), controls r/s/b ' + info.ranges + '/' + info.selects + '/' + info.buttons + ', interactions ' + act.interactions);
    problems.slice(0, 12).forEach(p => console.log('  PROBLEM [' + p.phase + '] ' + p.kind + ': ' + p.text + (p.line !== undefined ? ' (line ' + p.line + ')' : '')));
    if (problems.length > 12) console.log('  ... ' + (problems.length - 12) + ' more problems');
    warnings.slice(0, 4).forEach(p => console.log('  warn: ' + p.text.slice(0, 140)));
  }
  cleanup();
  process.exit(result.pass ? 0 : 1);
})().catch(e => { console.error('HARNESS ERROR', e && e.stack || e); process.exit(2); });
