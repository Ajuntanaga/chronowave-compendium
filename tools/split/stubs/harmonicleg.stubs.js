/* STUB of lat (Module IV) for the standalone extract: the lattice state this module reads. It provides lat.mask (the active-scale set; fixed to the identity scale {0,2,3,4,6,8,10}, the lattice's start-up state), lat.root() (the root frequency; fixed at the lattice start-up value 261.63 Hz, middle C, through a small rootEl stand-in) and lat.zeroPulse (the flash counter this module sets on Ground flip; nothing reads it here). Scale editing and the root slider of Module IV are not present. */
const lat = {
  mask: new Set([0, 2, 3, 4, 6, 8, 10]),
  zeroPulse: 0,
  rootEl: { value: "261.63", min: "130.81", max: "523.25", step: "0.01", addEventListener(){}, removeEventListener(){} },
  root(){ return +this.rootEl.value; }
};
/* STUB of azSets (Module IV) for the standalone extract: the two interval sets that az1 and az2 may land on (MI = modal-invariant set, AS = anti-scale), computed from lat.mask by the same rule as the real helper, so they follow the fixed identity scale of the lat stand-in. */
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
/* STUB of hl.soundRung (Module XV, assigned by a page statement that sounds the rung through the lattice voice, Module IV) for the standalone extract: the step buttons call hl.soundRung() after every move. In the page it returns at once unless hl.sync is on, and hl.sync is only switched on by the lattice when a scale is selected there, so here it is a no-op that keeps the same guard. It is attached after the module has created hl (the stubs sit above that declaration). */
queueMicrotask(() => {
  hl.soundRung = function(){
    if (!this.sync) return;   /* hl.sync stays false in the standalone: no lattice to sound through */
  };
});
