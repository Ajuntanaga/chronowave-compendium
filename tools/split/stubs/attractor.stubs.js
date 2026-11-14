/* STUB of lat (Module IV) for the standalone extract: provides lat.actives(), the sorted list of selected scale degrees, which sets the number of wings (sectors) of the attractor. The selection is fixed at the lattice start-up identity scale {0,2,3,4,6,8,10} (7 degrees), because the scale editor of Module IV is not present. */
const lat = {
  mask: new Set([0, 2, 3, 4, 6, 8, 10]),
  actives(){ return [...this.mask].sort((a, b) => a - b); }
};
/* STUB of M3 (Module XIII) for the standalone extract: provides M3.stackInt (the stack interval that shapes the drive, fixed at the Module XIII start-up value of 4 semitones) and M3.f(semi) (the frequency of a semitone above the source note, with the A4 control fixed at its start-up value of 440 Hz, same formula as the page). The A4 and stack-interval controls of Module XIII are not present. */
const M3 = {
  stackInt: 4,
  a4: 440,
  f(semi){ return this.a4 * Math.pow(2, -9/12) * Math.pow(2, semi/12); }
};
/* STUB of tfe.terms (Module X) for the standalone extract: the "TFE couple" button adds 3 x tfe.terms().res to rho. The page keeps only the small tfe object; the field-equation solver of Module X is not present, so terms() reports a field that is exactly balanced (res = 0) and the coupling adds nothing to rho. It is attached after the module has declared the small tfe object (the stubs sit above that declaration). */
queueMicrotask(() => {
  tfe.terms = function(){ this.res = 0; return { res: 0 }; };
});
