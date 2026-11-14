// split_build.js PAGE.html SECTION OUT.html [--date YYYY-MM-DD] [--stubs FILE.js] [--manual-name NAME.md]
//   run: node --expose-internals split_build.js ...
// Builds one standalone page for a module (section id) of the single-file compendium page, the way the two
// existing standalone pages (VI, VIII) were made: the full shared CSS, a small header, the section markup, the
// footer, and a script made of only the statements that module needs (the dependency closure of its own
// statements, plus neutral wiring). Names declared by other modules are not copied; they are listed so that a
// stub can be supplied with --stubs. Read-only on the page; writes only OUT.html.
process.env.SPLIT_QUIET = '1';
const fs = require('fs');
const L = require('./split_analyze.js');
const { html, js, markup, regions, stmts, info } = L;
const walk = require('internal/deps/acorn/acorn-walk/dist/walk');

const args = process.argv.slice(2);
const opt = (name, def) => (args.includes(name) ? args[args.indexOf(name) + 1] : def);
const section = args[1];
const outFile = args[2];
const date = opt('--date', new Date().toISOString().slice(0, 10));
const stubsFile = opt('--stubs', null);
if (!section || !outFile) { console.error('usage: split_build.js PAGE.html SECTION OUT.html'); process.exit(2); }
const reg = regions.find(r => r.name === section);
if (!reg) { console.error('no such section: ' + section); process.exit(2); }

// ---- section markup and its names
let sec = markup.slice(reg.start, reg.end + '</section>'.length);
const roman = (/<span class="rn">([^<]+)<\/span>/.exec(sec) || [])[1] || '?';
const eyebrow = ((/<div class="eyebrow">([\s\S]*?)<\/div>/.exec(sec) || [])[1] || '').replace(/<span class="rn">[^<]*<\/span>/, '').replace(/<[^>]+>/g, '').trim();
const h2 = ((/<h2>([\s\S]*?)<\/h2>/.exec(sec) || [])[1] || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const manualName = opt('--manual-name', 'Module_' + roman + '_Manual.md');
sec = sec.replace(/href="Manual\.md"/g, 'href="' + manualName + '"');
// links to other modules: point them at the module repositories (or the compendium repository) when a map is given
const linkmapFile = opt('--linkmap', null);
const linkmap = linkmapFile ? JSON.parse(fs.readFileSync(linkmapFile, 'utf8')) : {};
const rewritten = [];
sec = sec.replace(/href="#([^"]+)"/g, (m, id) => {
  if (new RegExp('id="' + id + '"').test(sec)) return m;
  if (linkmap[id]) { rewritten.push(id); return 'href="' + linkmap[id] + '"'; }
  return m;
});

// ---- statement selection
const seed = info.filter(s => s.kind === 'mod:' + section).map(s => s.i);
const inc = new Set(seed), blocked = new Map(); // name -> kind
const queue = [...seed];
const isNeutral = i => info[i].kind === 'neutral';
function add(i) { if (!inc.has(i)) { inc.add(i); queue.push(i); } }
function drain() {
  while (queue.length) {
    const x = queue.pop();
    info[x].deps.forEach(d => {
      const k = info[d].kind;
      if (k === 'neutral' || k === 'mod:' + section) add(d);
      else info[d].declares.filter(n => info[x].refs.has(n)).forEach(n => blocked.set(n, k));
    });
  }
}
drain();
// neutral wiring that has no declaration (so nothing depends on it by name): take it when it needs nothing foreign
const deny = /classList\.add\("js"\)|revealIO|spyIO|navMap/;
for (let changed = true; changed;) {
  changed = false;
  info.forEach(s => {
    if (inc.has(s.i) || s.kind !== 'neutral' || s.declares.length) return;
    if (stmts[s.i].directive || deny.test(js.slice(s.start, s.end))) return;
    const ok = [...s.deps].every(d => info[d].kind === 'neutral' || inc.has(d));
    if (ok) { inc.add(s.i); queue.push(s.i); drain(); changed = true; }
  });
}
const order = [...inc].sort((a, b) => a - b).filter(i => !(stmts[i].directive) && !deny.test(js.slice(info[i].start, info[i].end)));
const body = order.map(i => js.slice(info[i].start, info[i].end)).join('\n');

// ---- members that other modules add to shared objects and that the included statements read (e.g. hl.soundRung)
const usedPairs = new Set();
order.forEach(i => walk.simple(stmts[i], { MemberExpression(n) { if (n.object.type === 'Identifier' && !n.computed) usedPairs.add(n.object.name + '.' + n.property.name); } }));
const needMembers = new Map();
order.forEach(i => info[i].deps.forEach(d => {
  const a = info[d];
  if (inc.has(d) || !a.augments || !a.augMember) return;
  if (usedPairs.has(a.augments + '.' + a.augMember)) needMembers.set(a.augments + '.' + a.augMember, a.kind + ' L' + a.l1);
}));

// ---- head, header wrap, footer
const headEnd = html.indexOf('</head>') + '</head>'.length;
let head = html.slice(0, headEnd);
const title = (eyebrow || h2) + ' — Module ' + roman + ' | Chronowave Dynamics';
head = head.replace(/<title>[\s\S]*?<\/title>/, '<title>' + title + '</title>');
head = head.replace(/<meta name="description" content="[^"]*"/, '<meta name="description" content="Module ' + roman + ' of the Chronowave Dynamics Temporal Engine: ' + h2.replace(/"/g, '&quot;') + '."');
const wrapHeader = '<div class="wrap" style="padding-top:28px">\n  <div style="font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ivory-faint)">Chronowave Dynamics &middot; Temporal Engine &middot; standalone module extract</div>\n</div>\n';
let footer = /<footer[\s\S]*?<\/footer>/.exec(html)[0];
footer = footer.replace(/<div class="disc">[\s\S]*?<\/div>/, '<div class="disc">Module ' + roman + ' &middot; ' + eyebrow + ', extracted standalone from the full Temporal Engine compendium on ' + date + '. A speculative theoretical framework, presented as proposed in the source papers and prototypes.</div>');
const stubs = stubsFile ? fs.readFileSync(stubsFile, 'utf8').trimEnd() + '\n' : '';
const page = head + '\n<body>\n' + wrapHeader + sec + '\n\n' + footer + '\n\n<script>\n(function(){\n"use strict";\n' + stubs + body + '\n\n})();\n</script>\n</body>\n</html>\n';
fs.writeFileSync(outFile, page);

// ---- report
const dangling = [...new Set([...sec.matchAll(/href="#([^"]+)"/g)].map(m => m[1]))].filter(id => !new RegExp('id="' + id + '"').test(sec));
const bytes = order.reduce((a, i) => a + info[i].bytes, 0);
const stubbed = new Set(); if (stubs) for (const m of stubs.matchAll(/\b(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/g)) stubbed.add(m[1]);
const missing = [...blocked.keys()].filter(n => !stubbed.has(n));
const missingMembers = [...needMembers.keys()].filter(k => !(stubs && new RegExp('\\b' + k.split('.')[1] + '\\b').test(stubs)));
console.log(JSON.stringify({ section, roman, title, eyebrow, h2, out: outFile, bytes: Buffer.byteLength(page), statements: order.length, scriptBytes: bytes,
  blocked: Object.fromEntries(blocked), stubbed: [...stubbed], missingStubs: missing, missingMembers, neededMembers: Object.fromEntries(needMembers), danglingLinks: dangling, rewrittenLinks: rewritten, manual: manualName }));
