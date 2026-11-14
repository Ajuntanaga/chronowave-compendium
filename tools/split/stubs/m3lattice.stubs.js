/* STUB of lat (Module IV) for the standalone extract: provides the scale mask (fixed at the identity scale 0,2,3,4,6,8,10), the root pitch (fixed at 261.63 Hz, held in a small hidden range input so this module's wiring has a real element), and the register list (seqList, ket, ketOf, ketWidth, actives, tally) used to build the eigenstate bins; playSemi and playZero (they only sound a note and update Module IV's readout) are no-ops, renderBins is installed by this module itself, and nothing here ever changes the scale or the root. */
const lat = {
  mask: new Set([0, 2, 3, 4, 6, 8, 10]),
  tuning: 0, tally: {},
  /* hidden stand-ins for the Module IV controls this module's wiring looks up by id (root slider, bins button and box, Equal/Just buttons); the section of Module IV is not part of this page */
  rootEl: null,
  root(){ return +this.rootEl.value; },
  actives(){ return [...this.mask].sort((a, b) => a - b); },
  ketWidth(){ return Math.max(1, Math.ceil(Math.log2(this.actives().length + 4))); },
  ket(i){ return "|" + i.toString(2).padStart(this.ketWidth(), "0") + "⟩"; },
  ketOf(entry){
    if (entry.semi === 12) return this.ket(0).replace("⟩", "⟩′");
    const list = this.seqList();
    let idx = 0;
    for (const en of list){
      if (en.semi === 12) continue;
      if ((entry.zero !== undefined && en.zero === entry.zero) ||
          (entry.semi !== undefined && en.semi === entry.semi)) return this.ket(idx);
      idx++;
    }
    return this.ket(0);
  },
  seqList(){
    const acts = this.actives();
    const list = [];
    const anchors = [0, 4, 8];
    let zi = 0;
    acts.forEach(a => {
      while (zi < anchors.length && a >= anchors[zi]){ list.push({zero: zi}); zi++; }
      list.push({semi: a, idx: acts.indexOf(a)});
    });
    while (zi < 3){ list.push({zero: zi}); zi++; }
    list.push({zero: 3});
    list.push({semi: 12, idx: acts.length});
    return list;
  },
  playSemi(){},
  playZero(){},
  renderBins(){}
};
{
  const host = document.createElement("div");
  host.hidden = true;
  host.setAttribute("aria-hidden", "true");
  const mk = (tag, id) => { const e = document.createElement(tag); e.id = id; host.appendChild(e); return e; };
  const r = mk("input", "latRoot");
  r.type = "range"; r.min = "130.81"; r.max = "523.25"; r.step = "0.01"; r.value = "261.63";
  mk("button", "latBinsBtn");
  mk("div", "latBins");
  mk("button", "latTunA");
  mk("button", "latTunB");
  document.body.appendChild(host);
  lat.rootEl = r;
}

/* STUB of azSets (Module IV) for the standalone extract: the real small computation of the two lattice-membership sets (MI, AS) from lat.mask, so the MI/AS markers use the identity scale; the scale never changes here. */
const azSets = () => {
  const noScale = !lat.mask || lat.mask.size <= 1;
  const MI9 = [], AS9 = [];
  for (let s9 = 0; s9 < 12; s9++){
    const inC = s9 !== 0 && !lat.mask.has(s9);
    if (noScale){ if (s9 !== 0) MI9.push(s9); AS9.push(s9); }
    else { if (inC) MI9.push(s9); if (inC || s9 === 0 || s9 === 6) AS9.push(s9); }
  }
  return { MI: MI9, AS: AS9.sort((a9, b9) => a9 - b9) };
};

/* STUB of bh (Module XI) for the standalone extract: this module only re-publishes it on window if it exists, so it is left undefined. */
const bh = undefined;
/* STUB of coW (Module IX) for the standalone extract: only re-published on window if it exists, so it is left undefined. */
const coW = undefined;
/* STUB of co (Module IX) for the standalone extract: only re-published on window if it exists, so it is left undefined. */
const co = undefined;
/* STUB of an (Module III) for the standalone extract: only re-published on window if it exists, so it is left undefined. */
const an = undefined;
/* STUB of sz (Module V) for the standalone extract: only re-published on window if it exists, so it is left undefined. */
const sz = undefined;
