// split_analyze.js PAGE.html [--json OUT.json]    (run: node --expose-internals split_analyze.js ...)
// Read-only analysis of the single-file compendium page: which top-level statements of the big IIFE belong to
// which module (by the DOM ids they mention), and what each module needs from the rest.
const fs = require('fs');
const say = (...a) => { if (!process.env.SPLIT_QUIET) console.log(...a); };
const acorn = require('internal/deps/acorn/acorn/dist/acorn');
const walk = require('internal/deps/acorn/acorn-walk/dist/walk');

const file = process.argv[2];
const jsonOut = process.argv.includes('--json') ? process.argv[process.argv.indexOf('--json') + 1] : null;
const html = fs.readFileSync(file, 'utf8');

// ---- id -> region map from the markup (everything before the big script)
const sIdx = html.lastIndexOf('<script>');
const sEnd = html.indexOf('</script>', sIdx);
const markup = html.slice(0, sIdx);
const regions = []; // {name, start, end}
for (const m of markup.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
  const end = markup.indexOf('</section>', m.index);
  regions.push({ name: m[1], start: m.index, end });
}
const named = [['nav', /<nav\b[^>]*>/, '</nav>'], ['hero', /<header\b[^>]*id="hero"[^>]*>/, '</header>'], ['footer', /<footer\b[^>]*>/, '</footer>']];
for (const [name, re, close] of named) {
  const m = re.exec(markup);
  if (m) regions.push({ name: 'shell:' + name, start: m.index, end: markup.indexOf(close, m.index) });
}
const idMap = new Map();
for (const m of markup.matchAll(/\bid="([^"]+)"/g)) {
  const r = regions.find(r => m.index >= r.start && m.index <= r.end);
  idMap.set(m[1], r ? r.name : 'shell:other');
}

// ---- parse the script
const js = html.slice(sIdx + 8, sEnd);
const ast = acorn.parse(js, { ecmaVersion: 'latest', sourceType: 'script' });
const iife = ast.body[0].expression.callee;
const stmts = iife.body.body;
const baseLine = html.slice(0, sIdx + 8).split('\n').length; // line of '<script>' in the HTML
const lineOf = off => baseLine + js.slice(0, off).split('\n').length - 1;

function patNames(p, out) {
  if (!p) return;
  if (p.type === 'Identifier') out.push(p.name);
  else if (p.type === 'ObjectPattern') p.properties.forEach(q => patNames(q.type === 'RestElement' ? q.argument : q.value, out));
  else if (p.type === 'ArrayPattern') p.elements.forEach(q => patNames(q, out));
  else if (p.type === 'AssignmentPattern') patNames(p.left, out);
  else if (p.type === 'RestElement') patNames(p.argument, out);
}


// ---- scope-aware free variables of a statement (declarations anywhere inside a function count as that
// function's own; block scoping is deliberately simplified)
function hoistInto(node, sc) {
  if (!node || typeof node.type !== 'string') return;
  switch (node.type) {
    case 'VariableDeclaration': node.declarations.forEach(d => { const o = []; patNames(d.id, o); o.forEach(n => sc.add(n)); hoistInto(d.init, sc); }); return;
    case 'FunctionDeclaration': sc.add(node.id.name); return;
    case 'ClassDeclaration': sc.add(node.id.name); return;
    case 'FunctionExpression': case 'ArrowFunctionExpression': case 'ClassExpression': return;
    case 'CatchClause': if (node.param) { const o = []; patNames(node.param, o); o.forEach(n => sc.add(n)); } hoistInto(node.body, sc); return;
  }
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (Array.isArray(v)) v.forEach(c => hoistInto(c, sc));
    else if (v && typeof v.type === 'string') hoistInto(v, sc);
  }
}
function freeVars(root) {
  const free = new Map();
  const isBound = (n, scopes) => scopes.some(sc => sc.has(n));
  function visit(node, scopes, parent, pkey) {
    if (!node || typeof node.type !== 'string') return;
    switch (node.type) {
      case 'Identifier': {
        if (parent) {
          if (parent.type === 'MemberExpression' && pkey === 'property' && !parent.computed) return;
          if ((parent.type === 'Property' || parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') && pkey === 'key' && !parent.computed && !(parent.type === 'Property' && parent.shorthand)) return;
          if ((parent.type === 'LabeledStatement' || parent.type === 'BreakStatement' || parent.type === 'ContinueStatement') && pkey === 'label') return;
        }
        if (!isBound(node.name, scopes)) free.set(node.name, (free.get(node.name) || 0) + 1);
        return;
      }
      case 'FunctionDeclaration': case 'FunctionExpression': case 'ArrowFunctionExpression': {
        const sc = new Set();
        if (node.id && node.type === 'FunctionExpression') sc.add(node.id.name);
        node.params.forEach(p => { const o = []; patNames(p, o); o.forEach(n => sc.add(n)); });
        hoistInto(node.body, sc);
        scopes.push(sc);
        node.params.forEach(p => visit(p, scopes, node, 'params'));
        visit(node.body, scopes, node, 'body');
        scopes.pop();
        return;
      }
      case 'ClassExpression': case 'ClassDeclaration': {
        const sc = new Set(); if (node.id) sc.add(node.id.name);
        scopes.push(sc); visit(node.superClass, scopes, node, 'superClass'); visit(node.body, scopes, node, 'body'); scopes.pop();
        return;
      }
    }
    for (const k of Object.keys(node)) {
      if (k === 'type' || k === 'start' || k === 'end') continue;
      const v = node[k];
      if (Array.isArray(v)) v.forEach(c => visit(c, scopes, node, k));
      else if (v && typeof v.type === 'string') visit(v, scopes, node, k);
    }
  }
  const top = new Set(); hoistInto(root, top);
  visit(root, [top], null, null);
  return free;
}

const info = stmts.map((s, i) => {
  const declares = [];
  if (s.type === 'VariableDeclaration') s.declarations.forEach(d => patNames(d.id, declares));
  else if (s.type === 'FunctionDeclaration' || s.type === 'ClassDeclaration') declares.push(s.id.name);
  const refCount = freeVars(s), ids = new Set(), idCount = new Map();
  declares.forEach(n => refCount.delete(n));
  const refs = new Set(refCount.keys());
  walk.ancestor(s, {
    Literal(node) { if (typeof node.value === 'string') scan(node.value); },
    TemplateElement(node) { scan(node.value.cooked || ''); },
  });
  function scan(str) {
    const hit = x => { ids.add(x); const sec = idMap.get(x); idCount.set(sec, (idCount.get(sec) || 0) + 1); };
    if (idMap.has(str)) hit(str);
    for (const m of str.matchAll(/#([A-Za-z_][\w-]*)/g)) if (idMap.has(m[1])) hit(m[1]);
  }
  const secs = new Set([...ids].map(x => idMap.get(x)));
  return { i, type: s.type, start: s.start, end: s.end, l1: lineOf(s.start), l2: lineOf(s.end), bytes: s.end - s.start,
    declares, refs, refCount, ids, secs, idCount, head: js.slice(s.start, s.start + 70).replace(/\s+/g, ' ') };
});

const declBy = new Map();
info.forEach(s => s.declares.forEach(n => { if (!declBy.has(n)) declBy.set(n, []); declBy.get(n).push(s.i); }));
// statements that assign into a top-level object (X.y = ..., X.y.z = ...) define members of X: whoever uses X needs them too
const augment = new Map();
info.forEach(s => {
  const st = stmts[s.i];
  if (st.type !== 'ExpressionStatement' || st.expression.type !== 'AssignmentExpression') return;
  let cur = st.expression.left;
  if (cur.type !== 'MemberExpression') return;
  while (cur.type === 'MemberExpression') cur = cur.object;
  if (cur.type === 'Identifier' && declBy.has(cur.name)) {
    if (!augment.has(cur.name)) augment.set(cur.name, []); augment.get(cur.name).push(s.i);
    s.augments = cur.name;
    let m = st.expression.left; while (m.object.type === 'MemberExpression') m = m.object;
    s.augMember = m.computed ? null : m.property.name;
  }
});
info.forEach(s => {
  s.deps = new Set();
  s.refs.forEach(n => {
    (declBy.get(n) || []).forEach(j => { if (j !== s.i) s.deps.add(j); });
    (augment.get(n) || []).forEach(j => { if (j !== s.i) s.deps.add(j); });
  });
});

const mods = regions.filter(r => !r.name.startsWith('shell:')).map(r => r.name);
const kindOf = s => {
  const m = [...s.secs].filter(x => !x.startsWith('shell:'));
  const sh = [...s.secs].filter(x => x.startsWith('shell:'));
  if (m.length === 1 && sh.length === 0) return 'mod:' + m[0];
  if (m.length === 0 && sh.length > 0) return 'shell';
  if (m.length === 0) return 'neutral';
  return 'cross';
};
info.forEach(s => { s.kind = kindOf(s); });
// refinement 1: telemetry hooks (anything that uses the observatory's `obs`) belong to the observatory
const OBS = declBy.get('obs') || [];
info.forEach(s => { if (OBS.includes(s.i) || s.refs.has('obs')) s.kind = 'mod:observatory'; });
// refinement 2: a large or declaring cross statement goes to the module holding >= 65% of its id mentions
info.forEach(s => {
  if (s.kind !== 'cross') return;
  const total = [...s.idCount.values()].reduce((a, b) => a + b, 0);
  const top = [...s.idCount.entries()].filter(([k]) => !k.startsWith('shell:')).sort((a, b) => b[1] - a[1])[0];
  if (top && (s.bytes > 1000 || s.declares.length) && top[1] / total >= 0.65) { s.kind = 'mod:' + top[0]; s.reassigned = true; }
});

// refinement 3: neutral statements that depend on exactly one module's statements belong to that module
// (wiring such as mesh.el.v.addEventListener has no id literal but is that module's code); on several modules -> cross
for (let changed = true, guard = 0; changed && guard < 50; guard++) {
  changed = false;
  info.forEach(s => {
    if (s.kind !== 'neutral') return;
    const ms = new Set();
    s.deps.forEach(d => { const k = info[d].kind; if (k.startsWith('mod:')) ms.add(k); });
    if (ms.size === 1) { s.kind = [...ms][0]; s.byDeps = true; changed = true; }
    else if (ms.size > 1) { s.kind = 'cross'; s.byDeps = true; changed = true; }
  });
}
// refinement 3b: a statement made 'cross' only by name dependencies goes to the module whose names it mostly uses (>= 60% of its references)
info.forEach(s => {
  if (s.kind !== 'cross' || !s.byDeps) return;
  const own = new Map();
  s.refCount.forEach((cnt, n) => (declBy.get(n) || []).concat(augment.get(n) || []).forEach(j => { const k = info[j].kind; if (k.startsWith('mod:')) own.set(k, (own.get(k) || 0) + cnt); }));
  const total = [...own.values()].reduce((a, b) => a + b, 0);
  const top = [...own.entries()].sort((a, b) => b[1] - a[1])[0];
  if (top && total && top[1] / total >= 0.6) { s.kind = top[0]; s.reassigned3b = true; }
});
say('statements in the IIFE:', info.length, '| ids in markup:', idMap.size, '| modules:', mods.length);
const sum = {};
info.forEach(s => { const k = s.kind.startsWith('mod:') ? s.kind : s.kind; sum[k] = sum[k] || { n: 0, b: 0 }; sum[k].n++; sum[k].b += s.bytes; });
for (const k of Object.keys(sum).sort()) say('  ' + k.padEnd(16) + String(sum[k].n).padStart(4) + ' statements ' + String(sum[k].b).padStart(8) + ' bytes');

say('\nper module: exclusive | closure (neutral, shell, cross, FOREIGN-module statements it needs)');
const report = {};
for (const m of mods) {
  const seed = info.filter(s => s.kind === 'mod:' + m).map(s => s.i);
  const seen = new Set(seed), q = [...seed];
  const cut = new Set();
  while (q.length) { const x = q.pop(); info[x].deps.forEach(d => { if (info[d].kind === 'cross') { cut.add(info[d].declares[0] || ('L' + info[d].l1)); return; } if (!seen.has(d)) { seen.add(d); q.push(d); } }); }
  const cnt = { neutral: 0, shell: 0, cross: 0, foreign: 0 }, foreign = new Map(), cross = [];
  [...seen].forEach(i => {
    const s = info[i];
    if (s.kind === 'mod:' + m) return;
    if (s.kind === 'neutral') cnt.neutral++;
    else if (s.kind === 'shell') cnt.shell++;
    else if (s.kind === 'cross') { cnt.cross++; cross.push(s.declares[0] || s.head.slice(0, 30)); }
    else { cnt.foreign++; const f = s.kind.slice(4); foreign.set(f, (foreign.get(f) || 0) + 1); }
  });
  const bytes = [...seen].reduce((a, i) => a + info[i].bytes, 0);
  report[m] = { exclusive: seed.length, closure: seen.size, bytes, cnt, foreign: Object.fromEntries(foreign), cross, cut: [...cut] };
  const fnames = [...seen].filter(i => info[i].kind.startsWith('mod:') && info[i].kind !== 'mod:' + m).map(i => info[i].kind.slice(4) + ':' + (info[i].declares[0] || ('L' + info[i].l1))).slice(0, 8);
  say('  ' + m.padEnd(12) + ' excl ' + String(seed.length).padStart(3) + ' | closure ' + String(seen.size).padStart(3) + ' (' + String(bytes).padStart(7) + ' B) | neutral ' + String(cnt.neutral).padStart(3) + ' cross ' + cnt.cross + ' FOREIGN ' + cnt.foreign + (fnames.length ? ' ' + fnames.join(',') : '') + (cut.size ? '  CUT->stub: ' + [...cut].join(',') : ''));
}
say('\ncross-module statements (touch ids of several sections):');
info.filter(s => s.kind === 'cross').forEach(s => say('  L' + s.l1 + '-' + s.l2 + ' ' + (s.declares[0] || s.type).slice(0, 22) + ' idcounts=' + JSON.stringify(Object.fromEntries(s.idCount)).slice(0, 220)));
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ report, statements: info.map(s => ({ i: s.i, kind: s.kind, l1: s.l1, l2: s.l2, bytes: s.bytes, declares: s.declares, secs: [...s.secs], deps: [...s.deps] })) }));
module.exports = { html, js, markup, sIdx, sEnd, regions, idMap, stmts, info, declBy, augment, mods, lineOf, patNames, freeVars };
