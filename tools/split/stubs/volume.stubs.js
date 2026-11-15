/* STUB of ladderTitle (Module I) for the standalone extract: a plain object with a textContent member, so the dimension buttons' wiring (present but inert here, since this page has no dimension buttons) has something to write to; there is no Module I title bar here and nothing is displayed. */
const ladderTitle = { textContent: "Dimension · coordinate time" };
/* STUB of FRAME (Module I) for the standalone extract: the same order, combo, COMBOS and last members with the real initial values (order 0, frame "t"); set() only records the chosen frame and announces "framechange", it does not redraw any Module I readout or page classes. Fixed at order 0, frame "t". */
const FRAME = {
  order: 0, combo: "t", last: undefined,
  COMBOS: [
    ["t", "τ"],
    ["t²", "τ²", "t·τ", "τ·t",
     "B_T·t", "B_T·τ", "B_T²"],
    ["t³", "τ³", "t²·τ", "τ²·t",
     "B_T·t·τ", "B_T·t²", "B_T·τ²",
     "B_T²·t", "B_T²·τ"]
  ],
  set(c){
    this.combo = c;
    (this.last = this.last || {})[this.order] = c;
    document.dispatchEvent(new CustomEvent("framechange"));
  }
};
/* STUB of lat (Module IV) for the standalone extract: only the three members the "Lattice ωs" chip uses. The real scale, root and tuning are fixed at their start-up values: scale {0,2,3,4,6,8,10} semitones (the identity scale), root 261.63 Hz, equal temperament. freq() keeps the real equal-temperament formula; actives() returns the fixed scale; root() returns the fixed root. */
const lat = {
  mask: new Set([0, 2, 3, 4, 6, 8, 10]),
  rootEl: { value: "261.63", addEventListener(){} },
  freq(semi){ return this.root() * Math.pow(2, semi / 12); },
  root(){ return +this.rootEl.value; },
  actives(){ return [...this.mask].sort((a, b) => a - b); }
};
/* STUB of lo (Module XII) for the standalone extract: the attractor's x coordinate and its keep-alive and peek steps (peek is the silent step that the Observatory's ports take; nothing calls it in this page), fixed at x = 0, so the "Lorenz drive" button only slows the phase animation to a quarter here (there is no attractor term). */
const lo = { x: 0, keepAlive(){}, peek(){} };
/* STUB of sz (Module V) for the standalone extract: the scramble zone's damping factor D, fixed at 1 (no damping), so the "Scramble damping" button changes nothing here. */
const sz = { params(){ return { D: 1 }; } };
