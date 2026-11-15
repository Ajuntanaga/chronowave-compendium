# tools/split

Scripts that cut the single-file compendium page (`Chronowave_Temporal_Engine.html`, rev b91) into one standalone page per module and test each page in a real browser. They were written for the 2026-11-14 split and are kept so that the module pages can be rebuilt.

## What is here

| Path | What it does |
|---|---|
| `split_analyze.js` | Parses the page's big script into its top-level statements and assigns each one to a module: by the DOM ids it mentions, by the names it depends on (with a scope-aware free-variable analysis), and by the members it adds to shared objects (`obj.member = …`). Prints, per module, what it needs from the rest. |
| `split_build.js` | `split_build.js PAGE SECTION OUT.html [--stubs FILE] [--linkmap FILE] [--date YYYY-MM-DD]` builds one standalone page: the shared CSS, a small header, the section markup, the footer, and only the script statements that module needs. Names declared by other modules are not copied; they are listed, and a stubs file can supply small stand-ins. |
| `split_test.js`, `split_test_locked.sh` | Drive headless Chromium over the DevTools protocol (node's built-in WebSocket, no packages): load a page, move every slider, select and checkbox, click every button, send pointer, wheel and key events to every canvas, and collect uncaught exceptions and console errors. The locked wrapper runs one browser at a time. |
| `split_package.py` | Builds and tests every module and makes a local git repository for each one (nothing is pushed). It exits 1 if a selected module could not be packaged (a missing stub, a failed build or test). |
| `verify_modules.py` | Compares every built module page and its manual extract with the compendium page: styles, section markup, script lines and manual text. |
| `stubs/` | Small stand-ins for the parts of other modules that five modules read (see the notes). |
| `notes/` | The limitation notes that `split_package.py` copies into each module's README. |

## Run it

Needs node 22 or later (written on 24; the analysis uses the acorn parser bundled in node, hence `--expose-internals`), python 3, git, and a Chromium headless shell under `~/.cache/ms-playwright` (the browser that Playwright's installer fetches; the Playwright package itself is not used).

```bash
node --expose-internals tools/split/split_analyze.js Chronowave_Temporal_Engine.html
node --expose-internals tools/split/split_build.js Chronowave_Temporal_Engine.html ladder out.html
bash tools/split/split_test_locked.sh out.html
python3 -I tools/split/split_package.py --only ladder,mesh   # writes ./split-out/repos/<repo>/
```

## On GitHub

`.github/workflows/split-modules.yml` runs the same build, test and comparison on a GitHub-hosted runner: start it from the Actions tab (the optional input limits the module list) and read the result there. It needs no secrets. `CHROME_BIN` names the browser binary when the Playwright headless shell is not installed (a full Chrome is started with `--headless=new`), and `split_package.py` builds the fourteen buildable modules by default. A run is green only if every selected module was packaged; a module with a missing stub or a failed test fails the run.

## What it does not do

- The analysis is a heuristic. A dependency that is created at run time (an id built by joining strings, a member added through a loop) is not seen; the browser test is the only check on that.
- The browser test is a smoke test. It finds pages that throw or draw nothing; it does not show that a module behaves exactly as it does in the full page.
- Module XVI (the telemetry board) reads the state of every other module and is not split. Modules VI and VIII already had hand-made standalone pages and repositories.
- Where a module reads another module's live state, the page uses a fixed default from `stubs/`; the notes in `notes/` say which.
