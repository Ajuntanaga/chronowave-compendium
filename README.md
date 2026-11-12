# Chronowave Dynamics — Temporal Engine (compendium)

**Private repository.** The working copy of the compendium page, its manual, the log of the latest edit pass, and standalone copies of two of its modules.

The compendium is a single-file interactive page of 17 modules, from "The dimensional ladder" (I) to "The compendium" (XVII). Module N is the Nth section on the page.

**Build:** `rev b91 · module pass V–XVI`, shown by the build stamp: a small label fixed at the bottom-right of the window. It sits inside Module VIII's (Hydrogen's) reveal wrapper, so with scripts running and the default motion setting it only appears once that module has scrolled into view (observed in headless Chromium). With reduced motion, or with scripts off, the page's CSS leaves that wrapper visible and the stamp shows from load (read from the CSS, not run). Phone widths were not checked.

## Contents

| File | What it is |
|---|---|
| [`Chronowave_Temporal_Engine.html`](Chronowave_Temporal_Engine.html) | The compendium: one page, 17 modules. Open it in a browser. |
| [`Manual.md`](Manual.md) | A plain-text manual extracted from the page's prose: one section per module (I–XVII) and an appendix of the compendium's own verdicts. **Behind the page:** generated 2026-10-10 from rev b90, not regenerated for b91 (hand-patched during the pass: log items 11, 15, 20, 28). |
| [`CLAUDE_SESSION_LOG.md`](CLAUDE_SESSION_LOG.md) | Working log: provenance, canonical decisions, the numbered items of the 2026-11-09/11 module pass (1–32 plus 29a) with the checks it records (item 30 records re-running the changed draw routines with a timer shim in place of `requestAnimationFrame`; items 13 and 20 say what was not seen running), what was left for the author, and a resume point. Read it before editing the page. |
| [`Module_VI_Cubic_Time_Dilation.html`](Module_VI_Cubic_Time_Dilation.html), [`Module_VI_Manual.md`](Module_VI_Manual.md) | Standalone Module VI and its manual. |
| [`Module_VIII_Temporal_Hydrogen.html`](Module_VIII_Temporal_Hydrogen.html), [`Module_VIII_Manual.md`](Module_VIII_Manual.md) | Standalone Module VIII and its manual. |
| [`.gitignore`](.gitignore) | Keeps working backups (`*.bak.html`, `*.bak`) and OS or editor debris (`.DS_Store`, `Thumbs.db`, `node_modules/`, `__pycache__/`, swap files, `.vscode/`, `.idea/`, `.claude/settings.local.json`) out of the tree. |

## The 17 modules

"In the b91 pass" is the scope recorded in the log. It is not a claim that the other modules are byte-for-byte unchanged. The stamp's "V–XVI" is a range that also spans Modules VII, XIII and XV, which the pass did not list. The pass also changed page-wide CSS (log items 7 and 9: slider layout and the tier-note link colour), so modules whose section markup is unchanged can still look different; the log names III, IV and VII for the sliders.

| # | Nav label | Module | In the b91 pass |
|---|---|---|---|
| I | Dimensions | The dimensional ladder | |
| II | Time Mesh | Geodesic time mesh | |
| III | Analyzer | Orthogonal-time analyzer | |
| IV | Lattice | The harmonic lattice | |
| V | Scramble Zone | The scramble zone | yes |
| VI | GNSS | Cubic time dilation | yes |
| VII | Spin | Spin in temporal dimensions | |
| VIII | Hydrogen | Temporal hydrogen → two-clock periodic table | yes |
| IX | Cosmos | Dark energy & the cold sky | yes |
| X | Field Eq. | The temporal field equation | yes |
| XI | Horizons | Temporal horizons | yes |
| XII | Attractor | The attractor | yes |
| XIII | M3 Source | The M3 source lattice | |
| XIV | t³ Volume | The temporal volume | yes |
| XV | Harmonic Leg | The harmonic leg | |
| XVI | Observatory | The observatory | yes |
| XVII | Compendium | The compendium | |

## Standalone copies

Modules VI and VIII also have their own public repositories. The copies here are byte-identical (sha256, checked 2026-11-11) to the files in those repositories at the commits named below. The repositories also carry a README, citation metadata, a license, PDFs and a DOI-badge workflow (the Module VI repository adds a satellite data file and a Python model with tests); none of that is mirrored here. No other module has a standalone repository.

| Module | Repository | Commit |
|---|---|---|
| VI | [`Ajuntanaga/cubic-time-dilation-model-for-enhanced-gnss`](https://github.com/Ajuntanaga/cubic-time-dilation-model-for-enhanced-gnss) | `fa68134` |
| VIII | [`Ajuntanaga/cubic-time-dimensions-in-quantum-mechanics`](https://github.com/Ajuntanaga/cubic-time-dimensions-in-quantum-mechanics) | `a81fc2e` |

## Running it

Open `Chronowave_Temporal_Engine.html` in a current browser. There is no build step and nothing to install. Opened from a `file://` path (a double-click) the page runs, but Module VI's live almanac fetch is blocked; see "The one data fetch" below.

- **Network.** Math (KaTeX 0.16.9) and fonts (STIX Two Text, Space Grotesk, IBM Plex Mono) load from cdnjs and Google Fonts, so equations and typography need a connection.
- **The one data fetch.** Module VI's "Fetch live almanac" button requests a GNSS almanac from CelesTrak when you click it; nothing polls. One click can make two requests to `celestrak.org`: JSON first, then a TLE fallback. The page itself blocks the request only when opened from a `file://` path or when the browser reports no network (it then says so and keeps the snapshot); any other failure, CORS included, is reported after the attempt. A successful live fetch over http has not been tested here. Until an almanac is loaded (fetched, pasted or read from a file), the page uses an embedded satellite snapshot (epoch 2026-08-11T19:55:09Z) and labels the phases ASSUMED. Once a loaded almanac matches satellites, the source line reads LIVE and the matched satellites' phases are labelled MEASURED, however it was loaded. "Paste almanac" works offline.
- **Storage.** The page stores nothing in the browser (no cookies, localStorage or sessionStorage). Control state can be shared through URL permalinks of the form `#s=k=v;…`. The address fragment follows the controls automatically (`history.replaceState` after a 0.6 s pause; read from the code, not run), so a copied address carries the current state.

## Status and caveats

- **The b91 module pass is closed.** Its numbered items are in the log.
- **No independent check yet.** An independent regression review of the pass was started and paused; no reviewer has reported. The checks recorded in the log were made in the sessions that made the edits.
- **`Manual.md` is hand-maintained and behind the page.** It is the rev-b90 extraction of 2026-10-10 plus hand edits from the b91 pass (log items 11, 15, 20, 28). The page's condensed notes link to it for their full text, and no extraction script is kept in this repository, so do not regenerate it from the HTML: that would drop those edits.
- **Open items are the author's call, not tasks.** The log's "Left for the author" paragraph lists findings that were found and not changed; the log marks them as the author's call, not a to-do. The open rulings are cards in Module XVII (`#compendium`). The log's Resume point step 2 ("Address the four open items above in this fork") predates three of those cards; the four items it means are the fork-point list of standing open items, all four of them among the six cards.
- **The log predates this repository.** Where it says there is no git repository, that is out of date.
- **No license, tags or releases.** A license is the author's decision. For the two public standalone repositories, Zenodo archives a new version on each GitHub release, so cut releases there only on purpose.

## History

This tree was forked on 2026-10-09 from the top-level copy of the page in the parent folder (rev b90); the log's Provenance section has the details. That fork-point page (the top-level copy, sha256 `756d0abd…`, 1,007,991 bytes) is not in this history. `e536de6` below is the page as it stood later (the log dates it 2026-10-17), and it carries the same "rev b90" stamp because the stamp was not bumped for the edits in between, so the stamp alone does not identify a version.

The history opens with a restore point. `e536de6` is the page as it stood before the pass (`rev b90 · paper audit, three authors`, sha256 `3a7e6f60…5944`), committed under the live file name. The next commit carries the pass (rev b91) and the rest of the tree as it stood then, so the page's diff between the two shows the pass's changes to the page. It is not the whole pass: the hand patches to `Manual.md`, the standalone copies and a tool-setting change are recorded in the log, not in that diff:

```bash
git log --oneline --reverse
git diff e536de6 <second-commit> -- Chronowave_Temporal_Engine.html
```

## Not in this repository

Working backups (`*.bak.html`; the pre-pass backup is the first commit instead), and the parent `Chronowave Dynamics/` folder's other material: an older top-level copy of the page, LaTeX sources, a Research folder and tool settings. Paths in the log that begin with `~/` or `../`, and its `ro/` review copies, are on the author's machine and are not in this repository.
