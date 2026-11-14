/* STUB of FRAME (Module I) for the standalone extract: provides only the strain factor FRAME.g that the "gamma_D -> mesh" button writes; fixed at the 2pi-normalised baseline g = 1 until that button is pressed, and nothing reads it back here. */
const FRAME = { g: 1 };

/* STUB of mesh (Module II) for the standalone extract: provides only mesh.el.v, the source-velocity (beta) control that the "gamma_D -> mesh" button writes to; starts at the real default 0.29 (the slider's initial value), and its input event reaches no listener, so no wave mesh is drawn. */
const mesh = {
  el: {
    v: {
      value: "0.29",
      _l: [],
      addEventListener(t, f){ this._l.push([t, f]); },
      dispatchEvent(ev){ this._l.forEach(([t, f]) => { if (t === ev.type) f.call(this, ev); }); return true; }
    }
  }
};

/* STUB of hl (Module XV) for the standalone extract: provides the harmonic-leg state that the lattice writes to (th, sync, azFree, el.pt) with the real initial values (th = 0, sync = false, azFree = false, pt slider = 0); upd and soundRung are no-ops, so a lattice collapse or a "Walk leg" click updates this stub's angle but moves no leg and plays no rung sound. */
const hl = {
  th: 0, ph: 0, sync: false, azFree: false,
  el: {
    pt: {
      value: "0",
      _l: [],
      addEventListener(t, f){ this._l.push([t, f]); },
      dispatchEvent(ev){ this._l.forEach(([t, f]) => { if (t === ev.type) f.call(this, ev); }); return true; }
    }
  },
  upd(){},
  soundRung(){}
};
