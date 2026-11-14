# Temporal Harmonic Framework Compendium — local fork

## Provenance

This is a **fork** made on 2026-10-09, at the user's request, to give the Compendium its own
project folder for local work going forward, separate from the Claude.ai web session.

- Forked from: `../Chronowave_Temporal_Engine.html` (top-level copy, saved 2026-09-24, 1,007,991
  bytes).
- SHA-256 at fork point: `756d0abd5e4c5dc146d274a8451996f3a617eebee22b9cbd56dd1fc0b7c3d8d2`
  (identical to the source — verified copy).
- Build stamp at fork point: **`rev b90 · paper audit, three authors`**.
- Original web session of record (not this fork): a claude.ai web conversation (its share link is kept
  outside this repository). The share page is a JS-rendered SPA; `WebFetch` cannot read it, so b90 here
  is **not** verified against whatever that session currently holds. Check in-browser before assuming
  parity.
- The older copy at `../Research/Temporal/Chronowave_Temporal_Engine.html` is a stale snapshot at
  **b77** (517,769 bytes, Aug 11); its session log there documents the revision history from b68
  through b77. This fork starts from the newer b90 copy and does not attempt to merge that log's
  history gaps (b84–b89 have no recovered ledger text anywhere locally).
- No git repository exists at `Chronowave Dynamics/` or above it — there is no version control
  safety net here. Treat file edits in this folder as the only copy of this fork's state; the
  parent folder's top-level `.html` is left untouched as a separate, unforked reference copy.
  Update, 2026-11-14: `Compendium/`, which sits below `Chronowave Dynamics/`, is now a git repository (item
  29b), so once it is pushed the only-copy advice no longer applies to it; the statement above still holds for
  `Chronowave Dynamics/` itself.

## Project identity

A self-contained interactive HTML application for the Temporal Harmonic Framework (Chronowave
Dynamics, "Temporal over Spatial"): math, physics, harmonics, music, cosmology, field equations,
and satellite/GNSS material in one executable compendium, Modules I through XV-ish (module count
not independently re-verified at b90).

## Standing open items at the fork point

Carried forward from the b77 log, still unresolved as of b90 (the newer paper work below doesn't
touch these):

1. **theta-zero removal:** Module VII's pi/6 cell steppers vs. Module XV's zero-interval theta
   entries. Standing recommendation: keep VII, cut XV.
2. **Unit-gauged TFE:** ratify or reject the fourth equation form (`s_tau / s_t^n` applied to each
   temporal ladder rung).
3. **Units of expectation T:** `hbar G / c^3 = l_P^2` leaves the source term dimensionally short
   of inverse-length-squared unless expectation T is read in natural units.

New, surfaced 2026-10-09 by the now-completed paper (see below), not yet an official ruling card:

4. **t1/t2 ladder coincidence:** the first edition's fitted t1/t_C = 1/7.00 and t2/t_C = 10.01 —
   real rediscovery of the proper clock through a rescaling, or three-digit coincidence? The paper
   marks this `[OPEN]` and does not resolve it.

## External cross-check completed 2026-10-09

`Research/Papers/2nd_edition_revised/` holds a completed paper revision (delivered 2026-10-05)
written to test several of this Compendium's claims against independent atomic-physics data.
Full writeup is in `../Research/Temporal/CLAUDE_SESSION_LOG.md` (2026-10-09 entry). Summary:

- **Confirmed, three independent lines agree:** Module XI's clock exponent (k̂ = 0.50000 ± 0.00004,
  geoid/TAI) matches the paper's independent 14-ion measurement (k̂ = 0.499962 ± 0.000102, excludes
  cubic k=1/3 at 1626σ) and the companion note `Where_Cubic_Time_Lives.tex`
  (`../Research/Temporal/cubic_time/`). No reconciliation needed.
- **Implication for Module VI:** its headline cubic GNSS dilation exponent is excluded as a literal
  clock law by both an internal measurement (Module XI) and the external paper. Flag for the
  author if Module VI is revisited — the module's framing doesn't yet reflect this.
- **Confirmed, n_c = 0** (Module IX): paper's dark-energy and alpha-drift bounds independently land
  on n_c ≈ 0.

## Canonical status (decided 2026-10-09)

**This fork is canonical going forward.** The user made this the source of record for the
Compendium as of 2026-10-09. Implications:

- The live claude.ai web session and the untouched top-level `../Chronowave_Temporal_Engine.html`
  are now **non-canonical** references, frozen at whatever state they held at fork time (b90). Do
  not treat edits made there after 2026-10-09 as authoritative unless the user says so.
- The user will explicitly say if/when they've updated the Compendium through the web client or
  some other means outside this fork. Absent that notice, assume this folder's copy is the only
  one being changed, and do not proactively re-check the web share for drift.
- If the user does report an out-of-band update, diff it against this fork's `CLAUDE_SESSION_LOG.md`
  revision trail and build stamp before merging, since no ledger text exists locally for b84–b89 to
  reconcile against.

## 2026-10-09 — verified the combined paper is current and complete

Checked `Research/Papers/2nd_edition_revised/REVISION_NOTES.md` plus the built files for the most
up-to-date 2nd edition. A **combined** version already exists and needed no rebuilding:

- `Research/Papers/Cubic_Time_Dimensions_in_Quantum_Mechanics_2nd_edition_combined.pdf`, 44 pages,
  built 2026-10-09 20:09 PDT. SHA-256 matches the `2nd_edition_revised/build/` copy exactly
  (`73b1af77…`), so the delivered file is not stale.
- Authors: Anthony M. Vargas, Lyra R. Novak, Aethus Samir-Iqbal — **this is the "three authors"**
  referenced in the Compendium's own b90 build stamp ("paper audit, three authors").
- Built by `scripts/combine_papers.py`, which merges the cubic-time companion note
  (`Where_Cubic_Time_Lives.pdf`) into the revised paper as a new §8, renumbering later sections,
  worked examples (25-34), figures (9-12), and references (24-30); the 2026-10-09 revision-notes
  entry states "every anchor is asserted" and notes it now drops only duplicate bibitems, not
  content. Verified directly: all 18 `\section{}` headers from both source documents are present
  in the combined `.tex`, including all four appendices. Nothing was cut.
- Build quality: 0 real LaTeX errors (one "error" string in the log is just the `infwarerr`
  package announcing itself), 0 undefined/multiply-defined refs. Two overfull hboxes remain, 0.44pt
  and 1.05pt — negligible, though the 1.05pt one is a hair past the project's own "no overfull box
  over 1pt" bar.
- This build also carries the 2026-10-09 upgrade: added the Botermann et al. 2014 storage-ring
  bound (|k−½| < 1.9×10⁻⁸) to §7.1, reframed the (1−β²)^(−1/3) radiation-power exponent as a
  coincidence of exponents rather than framework support, and added prior-art credit.

No compendium HTML edits were made in this pass — this was verification of the paper side only.

## 2026-10-09 — edited Modules VI, VIII, IX, XI (first edits made in this fork)

Made five targeted, additive edits to `Chronowave_Temporal_Engine.html`, grounded in the combined
paper verification above. Nothing was deleted; no interactive JS state was touched; div balance
checked (671/671 before `<script>`). No new build stamp was assigned — do that on the next b91 pass
if these are kept.

1. **Module VI (`#gnss`)**: added a status callout after the lede, before the equation panel,
   stating the kinematic exclusion (storage-ring bound |k−½| < 1.9×10⁻⁸; 14-ion k̂ = 0.499962 ±
   0.000102, 1626σ) and linking to the open-rulings section. The simulator itself is untouched.
2. **Compendium ledger (`#compendium`)**: added a fourth "Excluded" card, "k = ⅓ kinematically,"
   alongside the existing gravitational (4762σ) and retreat (854×) cards, linking to Module VI.
3. **Module VIII (`#hydrogen`)**: added a new static `eq-panel`, "The clock law, confirmed outside
   the Engine," after the four existing equation panels and before the interactive canvas —
   summarizes the 14-ion fit, the Herzberg 1956 and QED-free U91+ checks, and cross-links to Module
   XI's independent gravitational k̂.
4. **Module IX (`#cosmos`)**: appended one sentence to the existing n_c = 2(w+1) paragraph, noting
   the paper's third, atomic-normalization route reaches the same n_c = 0 and calls all three
   consistent.
5. **Module XI (`#horizons`)**: extended the lede's kinematic-trial sentence to note the channel is
   already closed independently of Module VI's own simulated satellite array, citing the same
   storage-ring and 14-ion figures.

None of these resolve the three standing open rulings or the new t1/t2 item — those still need the
author's decision and were deliberately left untouched. Not yet done: visual QA in a browser (no
browser automation run here), and the embedded 36-header self-audit has not been re-run against
these edits.

## 2026-10-09 — corrected scope: rolled back 3 of the 5 edits above

The user clarified the ask was to audit Modules VI, VIII, IX, XI **as they stand** — issues,
clutter, discrepancies — not to inject the paper's findings into every one of them regardless of
whether each module actually had a problem. Re-judged each edit against that bar:

- **Kept: Module VI's status callout.** This fixes a real discrepancy — the module presents its
  cubic-exponent headline claim with no caveat, while independent evidence (Module XI's own data,
  plus the external paper) excludes it as a literal clock law. That is a live problem in the module
  itself, not an imported fact.
- **Rolled back: the compendium ledger card.** It documented Module VI's finding but lives in
  section XVII, outside the four modules the user named — scope creep, not a fix to one of them.
- **Rolled back: Module VIII's new clock-law panel.** Module VIII's existing content (ppm values,
  the ledger's own "Holds · zero free parameters" card) was already internally consistent and is in
  fact the material the paper drew its numbers *from*. No discrepancy existed there to fix; the
  panel was additive, not corrective.
- **Rolled back: Module IX's added sentence.** Same reasoning — IX's n_c = 2(w+1) derivation and
  the |S| < 4.4×10⁻⁸ bound were already complete and correct. Nothing to fix.
- **Rolled back: Module XI's lede extension.** Arguable either way, but it wasn't fixing an error in
  XI's own claim (k̂ = 0.50000 ± 0.00004 stands on its own evidence); it was crediting external
  corroboration XI didn't need. Reverted to stay conservative.

Verified after rollback: div balance 665/665 (down from 671, consistent with removing 3 of 5 blocks
plus the ledger card); only one Botermann/storage-ring reference remains in the file, in Module VI.

Net standing change in this fork, relative to the b90 fork point: **one** callout in Module VI.
Everything else is back to the fork-point text.

## 2026-10-09 — audit of Modules VI, VIII, IX, XI (no further edits)

Checked each module's HTML against its JS for dead controls, duplicate IDs, leftover debug/TODO
text, and div-balance integrity. Method and result:

- **Duplicate IDs, whole file:** none.
- **TODO/FIXME/placeholder text, whole file:** none (one incidental "xxxx" hit is a legitimate
  bitstring comment, not a stub).
- **Dead-control check (ID defined in HTML, never referenced in JS), all four modules:** initial
  static grep flagged ~40 apparent candidates, almost all false positives — this codebase wires
  most repeated-button groups (view toggles, element chips, ion sliders) by **runtime string
  concatenation** (`document.getElementById("taS" + i)`, `"hy" + k`, `"coNC" + k`, `"epP" + k`,
  etc.), which a literal-string grep can't see. Verified each flagged group by reading the actual
  handler code rather than trusting the grep. One genuine lead — Module VIII's three "resonance
  lab" sliders (`hyT1/2/3`) — looked unwired on first grep but turned out to be wired via exactly
  this pattern (`HY.el[k] = document.getElementById("hy" + k)` at line ~7484); traced the full
  click/input chain (`hyDescend`, `hyRand`, `hyScan`) and confirmed it's live. **No actual dead
  controls found** in Modules VI, VIII, IX, or XI.
- **Div balance:** 665/665 in the body, unchanged by the audit (no edits made this pass).
- **One trivial, optional note:** Module VIII's prose gives t₂/t_C = 10.01, while the paper's
  verified computation (`REVISION_NOTES.md`) carries it as 10.015 — a rounding-display difference
  (2 d.p. vs 3 s.f.), not a numerical error. Not worth a fix on its own.

## 2026-10-10 — extracted a standalone manual from the compendium's prose

The user's observation: the compendium's descriptions "run all over the place" and belong in a
tidy document instead. Scoped with the user: whole compendium (all 17 modules), extract-only —
the HTML stays untouched.

Wrote `Compendium/Manual.md` (~12,500 words) by parsing `Chronowave_Temporal_Engine.html`
programmatically rather than by hand-copying, to avoid transcription error on a 1 MB file:

1. Extracted every `<p>` tag's text per module section, in document order, converting inline
   `<strong>/<em>/<b>/<sup>/<sub>` to Markdown and stripping jump-link anchors.
2. Extracted each module's `eq-panel data-tag` captions as a quick-reference list (not the raw
   LaTeX — that renders only in the live page, so the manual points back to it by `#anchor` rather
   than duplicating unreadable TeX soup).
3. Separately parsed Module XVII's (`#compendium`) card grids — the self-audit's "ratified canon,"
   "dynamical claims," "structural claims," "repaired/adopted/holding," and the paper-constellation
   list — since these are structured as styled `<div>` cards, not `<p>` tags, and were missed by
   the first pass. Collected into an Appendix rather than left as flat, context-free paragraphs.
   The three open-ruling cards use a slightly different markup (no tag line) and weren't caught by
   the card regex; transcribed those three by hand from the exact text already read earlier this
   session, verified against the live HTML before writing.
4. Verified cleanliness: no leftover HTML tags, no unescaped entities, no broken nested-emphasis
   markdown in the final file.

Confirmed `Chronowave_Temporal_Engine.html`'s mtime is unchanged by this pass (last modified during
yesterday's Module VI edit) — the manual is purely additive.

Not done: a module-by-module content *edit* of the HTML (not requested — extract-only was the
explicit scope); a decision on whether future module prose should be written manual-first and
synced, versus edited in the HTML and periodically re-extracted.

## 2026-10-10 — trimmed trailing prose in Modules II, III, V, VI, VIII, IX, X

Follow-up request: those seven modules had too much prose after their functional/interactive
sections, and the page overall looked visually crowded, not formatted as "a page unto itself." Now
that `Manual.md` holds the full text, condensed each module's long trailing `<p class="tier-note">`
blocks (the explanatory essays that followed each panel) down to 1-3 short sentences each, with a
link to the Manual for the complete version. Nothing was deleted outright — every number, verdict,
and `[OPEN]` flag that appeared in a trimmed block was either kept inline or is preserved in full in
`Manual.md`. New `[OPEN]` items surfaced and preserved that are **not** in the compendium's existing
three-item open-ruling list: the Scramble Zone's missing static term (Module V), Module X's "h
cannot be one field" dimensional inconsistency, and the already-known t1/t2 ladder coincidence
(Module VIII) — worth adding as ruling cards if the author wants them formalized.

Scale of the cut: file went from 13,564 to 13,223 lines (-341). Module VIII alone (the heaviest)
lost roughly a dozen multi-hundred-word paragraphs down to two short ones.

Diagnosed the "visually a mess" complaint as a consequence of the prose volume rather than a
separate CSS bug: checked `section`/`.wrap`/`.tier-note` rules and found generous, consistent
padding (`clamp(68px,9vh,120px)` per section, hairline borders between sections) — the crowding was
article-length text breaking that rhythm, not a missing style rule. No CSS was changed.

Verification: div/p/section tag counts balanced (665/665, 54/54, 17/17) before `<script>`; ran a
full HTML stack-based open/close checker against the static markup (via Python's `html.parser`) —
zero mismatched or dangling tags. Not done: an actual visual/browser check of the rendered result —
opened the file for the user to look at directly rather than screenshot it (no headless browser
available in this environment).

## 2026-10-10 — formalized the three surfaced items as ruling cards

Added the three `[OPEN]` items this session's trim pass surfaced as proper dashed-border ruling
cards in `#compendium`'s "Open rulings" grid, matching the existing three cards' exact style, each
linking back to its module (`#scramble` &rarr; V, `#master` &rarr; X, `#hydrogen` &rarr; VIII). The
compendium now carries six open rulings instead of three. Updated `Manual.md`'s open-rulings section
to list all six and removed its earlier "not yet a formal card" caveat on the t1/t2 item, since it
now is one.

Verified: div balance 674/674 (up from 665, consistent with +3 two-div cards × 3 new cards). No
other section touched.

**Conclusion: Modules VI, VIII, IX, and XI are structurally and numerically sound as they stand.**
The only standing content change from this session is the Module VI status callout above, which
corrects a genuine discrepancy (the module's own headline claim vs. the evidence). Everything else
proposed earlier was rolled back as unnecessary. The three standing open rulings and the new t1/t2
coincidence remain the real unresolved items, unchanged by this pass.

## 2026-11-09/11 — module pass on V, VI, VIII, IX, X, XI, XII, XIV, XVI

Request: "Look over this and work on Modules 05, 06, 08, 09, 10, 11, 12, 14, 16." Read as the
standing instruction from 2026-10-10 ("work on each module as it is — issues / clutter /
discrepancies") plus the formatting and live-equation preferences the user set on the standalone
extracts on 2026-10-17 (prose uses the page width; header equations show live numbers).

**Safety net.** No git here, so the pre-pass file is kept beside the live one:
`Chronowave_Temporal_Engine.pre-2026-11-09.bak.html` (SHA-256 `3a7e6f60…`, byte-identical to the
compendium as it stood on 2026-10-17 07:34). Delete it once this pass is accepted. Update, 2026-11-14:
commit `e536de6` of the git repository now holds the same bytes; the `.bak.html` is git-ignored and was
not pushed.

**Not recorded before this entry:** the 2026-10-17 work (standalone `Module_VI_…html`,
`Module_VIII_…html`, their manuals, the GNSS v2 paper) was done from another session and never
logged here. The standalone extracts received fixes that were never carried back into this
canonical file; that gap is what the first block below closes.

Done so far (all in `Chronowave_Temporal_Engine.html`):

1. **VI brought up to its standalone.** PRNG (`Math.imul`, the old multiply overflowed 2^53);
   Alpha-5 catalogue numbers in the TLE parser; orbit solver uses the body's own radius for
   Mars/Venus; cross-frame k̂ flagged invalid above β ≈ 10%; VIF caption reworded; preset-chip match
   tolerance 0.02 → 0.003; BeiDou-3 M14 chip 3.874 → 3.779 km/s; GM label ×10₁₄ (a subscript) →
   ×10¹³; β slider `step="any"`; lede no longer says "validated across 1,000 simulations" above a
   callout that says the claim is excluded. Kept the two compendium-only links.
2. **VI layout bug.** A stray `</div>` closed `.wrap` after the first panel, so the satellite
   laboratory and the closing note sat outside the page column. Moved to the section end.
3. **VI, new (also present in the standalone, not fixed there):** the GM slider had `step="0.5"`
   from `min="2"`, so the browser snapped Earth's 39.86 to 40.00 and still labelled it Earth
   (v 3.881 instead of 3.875 km/s, net +38.63 instead of +38.50 µs/day). Now `step="0.01"`.
4. **VIII prose** brought up to the standalone's humanized wording (five passages), Manual links
   kept. Prediction-test footnote width 78ch → none.
5. **VIII, new (also in the standalone):** resonance-lab *Descend* never finished. The three
   sliders were on a 0.01 grid, each 7% step rounded back once within ~0.07 of the optimum, and the
   40 ms timer then ran forever with the button lit. Verified in the browser (stalled at −21.80,
   −19.82, −12.21 after 18 s). Sliders now `step="any"`.
6. **Defaults that the slider grid was silently moving:** IX cosmic time 17.639 → 17.64 (so "now"
   was not t₀; `step` now 0.001), XII Lorenz β 2.6667 → 2.67 (`step` now 0.0001). Module III's
   `anFreq` has the same fault (1.2137 → 1.21) and was left alone: out of scope.
7. **Crushed sliders, root cause (shared CSS).** `.controls .ctrl{min-width:0}` (the phone fix)
   cancels `.ctrl{min-width:170px}` at every width, and `flex:1` has a zero basis, so sliders never
   forced a wrap and shrank instead: Lorenz ρ, σ, β were 11 px wide at 1536 px; Scramble's three
   77 px; Volume's three 82 px; Cosmos α₃ 46 px. Base rule is now `.ctrl{flex:1 1 170px}`. This
   one is page-wide by nature (it also un-crushes sliders in III, IV, VII).
8. **Prose width.** In the nine modules only, `p`, `.lede`, `.gr-list` run the full column (one
   `:is(#scramble,…)` rule next to `.tier-note` in the stylesheet; fifteen inline
   `max-width:74ch/72ch` removed from their tier-notes). Same treatment the standalones got.
9. **Unstyled links.** "Full notes in the Manual →" rendered browser-default dark blue on the dark
   field. `.tier-note a` is now cyan (page-wide rule, it is the same component everywhere).
10. **Live equation rows.** VI's row now shows the substitution (formula with β plugged in →
    result). VIII's seven header panels had no live row at all; each now has one, following the
    Two-clocks ion/state (upper four) or the table's element (lower three). These use the
    compendium's own `liveEq` rows rather than the standalone's in-equation arrows, which drop part
    of the static equation once they run. New helper `texText()` because KaTeX's `\text{}` rejects
    µ, −, ×, ½. `liveNow()` now re-renders a row only when its TeX changed.

11. **VI caption and Manual.** The satellites-only precision cost was predicted as √(VIF·n) ≈ 2.8×;
    300 resamples at each of 2/8/20/30 ps measure 6.0×. Caption now uses σ/√(S(1−r²)) and prints
    6.07. Manual.md VI + VIII sections replaced with the standalone manuals' text; VI's degeneracy
    paragraph rewritten against the measured numbers. r(β²,Φ) is live and drifts (0.968 → 0.979),
    so the page note says ≈0.97.
12. **IX.** H₀ gauge dot, live row and observatory port used the retired 67.4+2.9s lerp (70.3)
    beside a tile computing 73.1: all now `co.cosmo(s).H0`. Lede α₃ 1.27×10⁻²⁵ kg/m³s³ →
    6.08×10²⁶ kg·s³/m³ (= RHO0·T0³; the paper's own later line and the author's inventory agree)
    and "both sides of the tension" → SH0ES side. z no longer prints −0.00; clock-bound chip can
    light; dead "consistent with both" branch removed; equality "in the future/past" by t_eq;
    ISW title glyph (U+1DBF theta → subscript f); `setVoid` range guard; pressure curve clipped
    and labelled as shifted; P tile has units.
13. **X.** Field damping/poke decay/meter smoothing are now per second (were per call: residual
    0.141 @30 Hz, 0.131 @60, 0.117 @120, and shifted when XII/XVI also read it). `tfe.terms()`
    caches `tfe.T`/`tfe.res`; observatory and live row read the cache. Dispersion mass term uses
    the true derivative (factors 2 and 3 were missing; default m² 0.657 → 0.506). Auto-balance:
    drove α up whenever res < 0, which raises |res|, and ran to its cap; now lowers α, raises R,
    shares the header's 0.2 threshold. G/c³ dimension triple fixed. "Full chronowave" chip pressed
    at load. Tier-note regains "once gauged". NOT verified live: the preview pane does not run
    requestAnimationFrame, so the auto-balance run itself was not watched.
14. **XI.** The live row never existed (tag mismatch); all three header panels now have
    k-aware rows. Ring clocks, fall overlay and pulses follow the k toggle; pulse train resets
    between falls; radius shows 3 decimals; X hand-off note reports the clamped value; tile
    relabelled "free-fall to r = 0 · GR" (that is what the formula computes); k̂ ± printed to six
    decimals (0.500000 ± 0.000035; five decimals could not carry 4762σ).
15. **XII.** Lyapunov readout latches saturation; verdict tests the ±15% it states (was ±27.6%);
    canonical check excludes drive/TFE; Perturb kicks the twin too; unison stack (0) no longer
    read as unset; drive-shape caption matches the code; ρ-threshold note corrected (Manual too).
16. **XVI.** Default traces pointed at two constants after four ports were inserted; Pearson
    guard was absolute; "volume lit" now reads XIV's own number; lede says eighteen signals.
17. **V / XIV.** 709 → 745 (the real underflow point); coupled-form diagonals complete at |T₃| = 1;
    time readout shows three figures; view lock actually locks and T₁T₃ is square; ω₃ → 0 wording.
18. **Live rows** for V, IX, X, XII, XIV rewritten as substitutions. Tried and reverted: a
    redefinition of the Bianchi readout (it saturated at 1.000). Build stamp → b91.

19. **XI trailing prose** (2026-11-10, on the user's yes): the five tier-notes after the panels
    condensed to one with a Manual link. Every sentence was already verbatim in Manual.md 230-238.

20. **X rebuilt around scaling and blow-up** (2026-11-10, user request citing OpenAI's Navier–Stokes
    release; that claim is a disputed, unreviewed forced blow-up result, used here for method only).
    New panel "Scaling & blow-up": per-term scaling weights, the hyperbolicity criterion
    α₂² < 5.55 α₃ (live against the sliders), and `tfe.blow`/`tfe.blowVerdict`, a two-grid test run
    on demand. Third form's canvas is now a cascade spectrum (`tfe._ft`), title "the cascade"; all
    three tier notes carry their scaling statement. Solver verified in node (numbers in Manual.md,
    Module X). The coupling sliders were KEPT: XI's hand-off, the palette, permalinks, auto-balance
    and the regime chips all write to them. Cascade canvas not seen running (preview has no rAF).

21. **X coupling sliders removed** (2026-11-10, on the user's go-ahead). The six range inputs are
    now hidden inputs with the same ids, so `tfe.el`, permalinks (q2..qt), XI's `bhToX`, the palette,
    auto-balance and the regime chips work unchanged; values show in one readout line. Four regime
    chips added (t² alone, on the hyperbolicity line, strong tension, near horizon). Checked in the
    page: every chip sets the expected six values, XI's hand-off lands, the blow-up test reads them.
    Hidden inputs do not clamp, so a hand-edited link can carry out-of-range α/ε (R and τ are
    still clamped in `tfe.terms`).

22. **"Update the remaining"** (2026-11-10/11): the open findings of the nine-module pass, the leftovers of
    X, and the two standalone files. A reboot between sessions cleared the scratch helpers twice; the
    project files were intact each time (JS parsed, tags balanced).
23. **X leftovers.** The ledger refreshes from its own function (`tfe.ledUpd`), called from a card click
    and from a 250 ms timer while the ledger is on screen, so muting shows at once with the engine canvas
    scrolled away. The residual no longer flickers between +0.00 and −0.00. The Bianchi derivative is now
    taken on the same grid spacing as the Laplacians (dx = 1/8): the default reads 0.74 "large" where it
    read 0.08 "small", and a pure wave no longer reads small. Vacuum and Einstein limit each set all six
    couplings. The six coupling readouts are typed fields (clamped on change, regime chips cleared).
    Tier-2's horizon factor contracts with g^{αβ} on dummy indices. Auto-balance now steps the field on every
    tick: run while the engine canvas was not drawing, it drove α₂ to 0 and R to 0.9 chasing a residual frozen at
    −0.43; it now takes the start-up transient from α₂ 1.00 → 0.94, R 0.30 → 0.34 and reports balanced in ~0.6 s.
24. **XI.** The fall now keeps its radius in `bh.fallX` (the 0.001 slider grid rounded each frame's step back:
    the far-clock view froze at 1.41 r_s, and a ride-along released inside 1.17 r_s never moved). Verified
    in node at 60/120/144 Hz: reaches 1.114 r_s in 60 s; ride-along arrives in 20.9 s and keeps its 20
    pulses; a second release emits pulses again. The fall runs on the real clock, so it works under reduced
    motion. Orbital phases are accumulated, not t·rate (a k toggle used to teleport every dot); "you" is kept
    outside the black disc; the two band labels are staggered. Fall tile gains h/d tiers (M87*: 17.1 d).
    Anchors print value and error to the same decimals (Gravity Probe A: 1.000000 ± 0.000070). Citations
    corrected after checking: Sirius B is Joyce et al. 2018 (80.65 ± 0.77 km/s; Barstow 2005 was ~6%), S2 is
    the GRAVITY 2019 update (the 2018 paper gave f = 0.90). The k_grav band is derived from `bh.combined()`
    and drawn "(widened to draw)"; the escape-hatch readout is signed with a proper superscript; shell labels
    moved off the title; the k toggle is saved in links (`bk`). Lede: β² ≈ 1.7×10⁻¹⁰ (split = β²/6).
25. **XII.** The twin is tagged with the main trail's sector and drawn through the same rotation and fold
    (pixel distance to the head 0.00, was up to 178), and the fixed-point crosses appear in every wing. The
    fold is tied to the view extent: it bent 0% of the trail below slider 0.15 and now bends 3% at 0.05 up
    to 61% at the maximum. The jump rate is computed every frame over the observed window and falls to 0.00
    once the trajectory settles. Wing dwell is time per wing, normalised (13.8–20.9 sim-s over 7 wings), not
    a visit count. Links now save β, drive, fold and the TFE chip. Checked in node against a recording canvas.
26. **IX.** The ISW predictor keeps its hand-set Ω_Λ(s) mapping but the panel now also shows the figure under
    the module's own cosmology (default −19.8 vs −29.5 µK; at s = 0 the own cosmology gives 0, an
    Einstein–de Sitter universe having no ISW, where the hand-set one gives −25.9). The author chose on
    2026-11-11 to keep both shown, so no number was moved. The Great Cold Spot sentence is now an [OPEN] note (the predictor
    gives −4/−6 µK for that row; the paper's −150 µK needs α₃ = −8.76×10²⁹, other units); chip ΔT is labelled
    "observed"; the t³ tile "paper's table". α₃ listener, `nc()`, and the 2.68e-27 literal removed.
27. **XIV and XVI.** `lo.keepAlive()` advances the attractor on the real clock (540 steps/s) from the Lorenz
    frame and from XIV's drive, without double-stepping: ~5,400 steps per 10 s at 30/60/144 Hz, none under
    reduced motion. Beat alignment is now cos of the summed phase (the header's Re Ψ, the prose, and V's
    coupled form), replacing a mean of three cosines that needed a hidden +0.2 on the threshold; this is a
    visible change, revert by restoring the mean in `fieldAt`. "Volume lit" is always taken on the 11³ grid.
    Lattice ωs come from `lat.freq/lat.root` (sliders step 0.01). The XVI closing note no longer claims an
    experiment that cannot run with canvases asleep.
28. **t₃ wording.** 5.35×10⁻¹³ s is 0.535 ps, below the 1 ps edge of the Scramble Zone; V, VIII, standalone
    VIII and both Manuals now say "just below the 1 ps edge" instead of "inside the window".
29. **Standalone files (edited locally, pushed later: see 29a).** VI: crushed-slider CSS, symbol-case rule, GM step
    0.01 (Earth reads 39.86, +38.50 µs/day), the corrected precision caption, r ≈ 0.97 note, manual paragraph.
    VIII: the same CSS, Descend sliders `step="any"`, and a KaTeX-clean text helper (`texTxt`; zero warnings
    across all states in the page). When this item was written they were copies of what the GitHub repos
    publish and the repos were untouched; 29a records the push.
29a. **Standalone repos pushed (2026-11-11, on "update and put each module to github").** Module VI repo
    `cubic-time-dilation-model-for-enhanced-gnss`: `fa68134` (the HTML, `Module_VI_Manual.md`, and the README
    Status paragraph, which now says the noise demonstration's own numbers changed: dropping the stations
    costs about 6× in precision, not ≈2.8×, and the wrong-model rates are measured over 300 resamples,
    about 12% of draws at σ = 8 ps; the physics claims and the 263 ns / 36 ns figures did not). Module VIII
    repo `cubic-time-dimensions-in-quantum-mechanics`: `a81fc2e` (the HTML and `Module_VIII_Manual.md`;
    README untouched). Both were fast-forward pushes to `main` (f988cef→fa68134, 2808e85→a81fc2e) and local
    equals remote afterwards. Module VI's `doi-badge-check` ran on its push and passed (8 s); Module VIII's
    did not trigger (that workflow runs only when README, `.zenodo.json` or `CITATION.cff` change). No tag
    and no release, so Zenodo did not re-archive (a release would mint new DOIs). The other 15 modules have
    no standalone repository and none was created. The pushed pages are byte-identical to the Compendium
    files and to the review copies in `ro/`; pre-push copies of the four files sit in
    `~/.cache/chronowave-review/standalone-repo-backups/2026-11-11/`. The independent review had not run
    when this was pushed, so these two pages carry the author's own checks only.
29b. **Public repository and first push (2026-11-14, on "update and put each module to github").** `Compendium/`
    (below `Chronowave Dynamics/`, which still has no repository) is now a git repository, pushed to one public
    GitHub repository, `Ajuntanaga/chronowave-compendium`, in three commits: `e536de6` is the page as it stood
    before the pass (rev b90, one file, the same bytes as the git-ignored
    `Chronowave_Temporal_Engine.pre-2026-11-09.bak.html`) and is the restore point; `251855e` is the pass (rev
    b91) plus the manual, this log, the two standalone copies, the README and .gitignore; the commit that adds
    this entry is the third. It is public at the author's choice, so that GitHub Actions, which the author uses
    to offload processing, is not held back by private-repository quotas. No license, tag, release or workflow:
    a license is the author's decision, and a release on the public standalone repositories would make Zenodo
    mint new DOIs. A repository for each of the 15 modules without one is planned at the author's request and
    does not exist yet; Modules VI and VIII keep their own public repositories. Before the push, five read-only
    reviewers (secrets and personal data, links and prose, README accuracy, hygiene, a cold read) checked the
    tree. A spend limit interrupted the first run and two of the five were re-run; none reported a blocker.
    Their findings were fixed in two amends of the then-unpushed second commit, which took a link to the
    original web conversation out of this log, corrected the count of modules without a standalone repository to
    15 and reworded README sentences and one commit-message sentence that said more than the code or the checks
    support. A final read-only gate over `251855e` (four reviewers, each non-note finding re-checked by a
    skeptic) found no blocker and two should-fix wording findings: the README sentence on what the address
    fragment covers, now corrected, and the first commit's message calling the page diff "the whole pass", which
    stays as committed and which the README now says overstates it. A second check of the first version of this
    commit (three reviewers, same method) found no blocker and six more should-fix wording findings, which are
    corrected here. A third check of that corrected version (one reviewer) found no should-fix finding and ten
    notes, most of which are applied in this final wording. Left to the author: the build stamp shows only once
    Module VIII's wrapper is revealed (scripts on, default motion); the page was not changed for this, and
    moving the stamp is the author's call. The independent regression review was started and then paused; no
    reviewer has reported, so the pass has had no independent regression check, and the pre-push reviews above
    read the files without running the page. Reader notes: Resume point step 2's "four open items" are all among
    the six "Open rulings" cards that Module XVII now shows (three of the six came later), and those cards are
    the author's rulings, not tasks; step 3 mentions a "revision trail" but this log has no such heading; paths
    beginning with `~/`, `../` or `ro/` are on the author's machine.
30. **How this was checked.** The preview pane stops delivering animation frames when its window is
    backgrounded (timers keep running). The page was re-run with `requestAnimationFrame` replaced by a timer
    shim (written over the document from the browser console; nothing in the file) so every changed draw
    routine ran: cascade view (150-sample history, poke), fall and k toggle, Lorenz with twin and fold 0.2,
    Beat alignment + mesh (lit 80% in both render modes), IX, V, XVI: zero frame errors. XI's fall engine,
    XII's draw and `lo.keepAlive` were also checked in node against recorded canvases and a fake clock.
31. **Claude Code setting.** `~/.claude/settings.json` gained `"autoCompactWindow": 150000` (user asked for
    auto-compaction "often"; `autoCompactEnabled` was already true). The shell also exports
    `DISABLE_MICROCOMPACT=1`, which was left alone.
32. **X, found by the control sweep run ahead of the independent review (2026-11-11).** `tierBtns` was
    `#master .seg button`, so the Forcing toggle added to the blow-up panel (also a `.seg`) was wired as a
    tier tab: clicking Unforced or Forced called `setTier(NaN)`, which set `masterTier = NaN`, unpressed all
    four tier tabs and threw on `TIERS[NaN].tex`; the link writer then saved `tq=4`, which threw again on
    load. Both the tab wiring and the link writer now select `button[data-tier]`, and `setTier` ignores an
    index with no tier. Re-swept Module X: 0 flagged. The bug had been present since item 20/21 and no
    check run in this pass touched that button.

**Left for the author (found, not changed):** the IX header H(t) = ȧ/a + α₃/t³ adds a density to a rate and
the XIV header V_spatial/(t₁×t₂) is never computed; X tier-2's
connection-index bookkeeping (pressure rung n uses index n+1, tension rung n uses n) and R used three ways
(Ricci scalar, r_s/r, R/2GM); XII under reduced motion (the frame loop does not step, so Perturb and Twin do
nothing), its "Drive shape" label tied to no control, and the unison stack; XI's observer-frame toggle only
acts once a fall runs (tooltips say so) and its k_kin of 0.004 is rounded up from the 0.0025–0.0033 Module VI
measures; the IX void chips do not drive the radius and underdensity sliders; the X blow-up test is a
numerical test on a 1+1D reduction, not a proof.

**Decided, not left:** the IX ISW predictor keeps its hand-set cosmology with the module's own figure shown
beside it (author, 2026-11-11). Nothing further is pending there.

## Resume point

1. Open `Chronowave_Temporal_Engine.html` in this folder (b90 at fork time, b91 after the 2026-11-09/11
   module pass) and work here going forward.
2. Address the four open items above in this fork. Note, 2026-11-14: all four are among the six "Open
   rulings" cards that Module XVII now shows (three of the six came later); the cards are the author's
   rulings, not tasks.
3. Update this log's revision trail with each new build stamp as work proceeds.
4. The combined paper (44 pp., verified above) is current and can be cited as-is for any compendium
   cross-checks; no further paper work is outstanding.
5. The 2026-11-09/11 module pass (items 1–32 above) is closed. What it left open is the "Left for the
   author" paragraph, which is the author's call and not a to-do. Standalone VI and VIII were pushed to
   their repositories on 2026-11-11 (item 29a); the other 15 modules have no standalone repository. The
   tracked files of the folder (all but the git-ignored `.bak.html`) were pushed to one public repository on
   2026-11-14 (item 29b).
