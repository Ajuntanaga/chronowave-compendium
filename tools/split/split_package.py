#!/usr/bin/env python3
"""split_package.py [--commit SHA] [--date YYYY-MM-DD] [--only key,key] [--no-test]   (run with: python3 -I split_package.py ...)

Packages the standalone module pages as local git repositories under $SPLIT_OUT/repos/<repo>/ (default ./split-out;
nothing is pushed): builds each page with split_build.js (with the link map and, where present, the stubs file from
stubs/), tests it with split_test_locked.sh (a page that does not pass is not packaged), cuts the module's section out
of Manual.md, writes a README from the test numbers and the limitation notes in notes/, and makes one commit.
Environment: SPLIT_OUT (output folder), SPLIT_OWNER (GitHub account for the links), SPLIT_TRAILER (optional commit
trailer line). Prints names, sizes and counts only. Needs node with --expose-internals and a headless Chromium."""
import json
import os
import re
import shutil
import subprocess
import sys

T = os.path.dirname(os.path.abspath(__file__))
COMP = os.path.abspath(os.path.join(T, "..", ".."))
PAGE = COMP + "/Chronowave_Temporal_Engine.html"
BASE = os.environ.get("SPLIT_OUT") or (COMP + "/split-out")
OWNER = os.environ.get("SPLIT_OWNER", "Ajuntanaga")
COMBINED = "chronowave-compendium"
TRAILER = os.environ.get("SPLIT_TRAILER", "")

# key: (roman, title as on the page, repo name, file base)
MODULES = {
    "ladder": ("I", "The dimensional ladder", "chronowave-dimensional-ladder", "Module_I_Dimensional_Ladder"),
    "mesh": ("II", "Geodesic time mesh", "chronowave-geodesic-time-mesh", "Module_II_Geodesic_Time_Mesh"),
    "analyzer": ("III", "Orthogonal-time analyzer", "chronowave-orthogonal-time-analyzer", "Module_III_Orthogonal_Time_Analyzer"),
    "lattice": ("IV", "The harmonic lattice", "chronowave-harmonic-lattice", "Module_IV_Harmonic_Lattice"),
    "scramble": ("V", "The scramble zone", "chronowave-scramble-zone", "Module_V_Scramble_Zone"),
    "spin": ("VII", "Spin in temporal dimensions", "chronowave-spin-in-temporal-dimensions", "Module_VII_Spin_In_Temporal_Dimensions"),
    "cosmos": ("IX", "Dark energy & the cold sky", "chronowave-dark-energy-cold-sky", "Module_IX_Dark_Energy_Cold_Sky"),
    "master": ("X", "The temporal field equation", "chronowave-temporal-field-equation", "Module_X_Temporal_Field_Equation"),
    "horizons": ("XI", "Temporal horizons", "chronowave-temporal-horizons", "Module_XI_Temporal_Horizons"),
    "attractor": ("XII", "The attractor", "chronowave-attractor", "Module_XII_Attractor"),
    "m3lattice": ("XIII", "The M3 source lattice", "chronowave-m3-source-lattice", "Module_XIII_M3_Source_Lattice"),
    "volume": ("XIV", "The temporal volume", "chronowave-temporal-volume", "Module_XIV_Temporal_Volume"),
    "harmonicleg": ("XV", "The harmonic leg", "chronowave-harmonic-leg", "Module_XV_Harmonic_Leg"),
    "observatory": ("XVI", "The observatory", "chronowave-observatory", "Module_XVI_Observatory"),
    "compendium": ("XVII", "The compendium", "chronowave-verdicts-and-rulings", "Module_XVII_The_Compendium"),
}
EXISTING = {"gnss": "cubic-time-dilation-model-for-enhanced-gnss", "hydrogen": "cubic-time-dimensions-in-quantum-mechanics"}

SHARE = re.compile(r"(claude\.ai/share/)[^\s\]\[)(>`\"']+")
EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def say(*a):
    print(EMAIL.sub("<email hidden>", SHARE.sub(r"\1<id>", " ".join(str(x) for x in a))))


def manual_section(manual, roman, with_appendix):
    lines = manual.split("\n")
    start = next(i for i, l in enumerate(lines) if l.startswith("## Module %s — " % roman))
    end = next((i for i in range(start + 1, len(lines)) if lines[i].startswith("## ") and not (with_appendix and lines[i].startswith("## Appendix"))), len(lines))
    if with_appendix:
        end = len(lines)
    return "\n".join(lines[start:end]).rstrip("\n") + "\n"


def main(argv):
    commit = argv[argv.index("--commit") + 1] if "--commit" in argv else "6cf22d4"
    date = argv[argv.index("--date") + 1] if "--date" in argv else "2026-11-14"
    only = set(argv[argv.index("--only") + 1].split(",")) if "--only" in argv else set(MODULES)
    do_test = "--no-test" not in argv
    os.makedirs(BASE + "/repos", exist_ok=True)
    linkmap = {k: "https://github.com/%s/%s" % (OWNER, v[2]) for k, v in MODULES.items()}
    linkmap.update({k: "https://github.com/%s/%s" % (OWNER, v) for k, v in EXISTING.items()})
    linkmap["compendium"] = "https://github.com/%s/%s" % (OWNER, COMBINED)
    lm = BASE + "/linkmap.json"
    json.dump(linkmap, open(lm, "w"))
    manual = open(COMP + "/Manual.md", encoding="utf-8").read()
    index = {}
    for key in MODULES:
        if key not in only:
            continue
        roman, title, repo, fbase = MODULES[key]
        d = BASE + "/repos/" + repo
        assert d.startswith(BASE + "/repos/") and repo and "/" not in repo
        if os.path.exists(d):
            shutil.rmtree(d)
        os.makedirs(d)
        html_path = d + "/" + fbase + ".html"
        stubs = T + "/stubs/" + key + ".stubs.js"
        cmd = ["node", "--expose-internals", T + "/split_build.js", PAGE, key, html_path, "--date", date, "--linkmap", lm,
               "--manual-name", "Module_%s_Manual.md" % roman]
        if os.path.exists(stubs):
            cmd += ["--stubs", stubs]
        b = run(cmd)
        try:
            info = json.loads(b.stdout.strip().splitlines()[-1])
        except Exception:
            say("BUILD FAILED", key, b.stderr[:200]); continue
        if info["missingStubs"] or info.get("missingMembers"):
            say("MISSING STUBS", key, info["missingStubs"], info.get("missingMembers")); continue
        res = {"pass": None, "canvases": 0, "interactions": 0, "blankCanvases": [], "problems": []}
        if do_test:
            t = run([T + "/split_test_locked.sh", html_path, "--json"], timeout=900)
            try:
                res = json.loads(t.stdout.strip().splitlines()[-1])
            except Exception:
                say("TEST DID NOT RUN", key, t.stdout[-200:], t.stderr[-200:]); continue
            if not res["pass"]:
                say("TEST FAILED", key, [p["text"][:100] for p in res["problems"][:3]]); continue
        with_appendix = key == "compendium"
        mtxt = manual_section(manual, roman, with_appendix)
        mfile = "Module_%s_Manual.md" % roman
        open(d + "/" + mfile, "w", encoding="utf-8").write(
            "# %s — Module %s Manual\n\nA plain-text companion to `%s.html`, the standalone extract of Module %s from the Chronowave Dynamics "
            "Temporal Engine. The text below is this module's part of the compendium's `Manual.md` (the rev-b90 extraction of 2026-10-10, "
            "hand-patched since; see the README of [%s](https://github.com/%s/%s) for its limits), copied without change.\n\n%s"
            % (title, roman, fbase, roman, COMBINED, OWNER, COMBINED, mtxt))
        notes = T + "/notes/" + key + ".md"
        note_text = open(notes, encoding="utf-8").read().strip() if os.path.exists(notes) else ""
        stub_clause = ", and small stand-ins for the parts of other modules that this module reads (see the limits below)" if os.path.exists(stubs) else ""
        blank = res["blankCanvases"]
        readme = (
            "# %(title)s — Module %(roman)s\n\n"
            "Standalone interactive extract of Module %(roman)s, \"%(title)s\", from the Chronowave Dynamics Temporal Engine: a single-file compendium of 17 interactive modules about the author's temporal framework. "
            "The full compendium, its manual and its edit log are in [%(comb)s](https://github.com/%(owner)s/%(comb)s).\n\n"
            "## Use it\n\n"
            "Download or clone this repository, then open [`%(fbase)s.html`](%(fbase)s.html) from disk in a current browser (GitHub only shows its source). "
            "There is no build step and nothing to install. Math (KaTeX 0.16.9) and fonts load from cdnjs and Google Fonts, so equations and typography need a connection.\n\n"
            "## Files\n\n"
            "| File | What it is |\n|---|---|\n"
            "| [`%(fbase)s.html`](%(fbase)s.html) | The module: one page with the shared styles, this module's section and the script statements it needs. |\n"
            "| [`%(mfile)s`](%(mfile)s) | This module's part of the compendium's plain-text manual. |\n\n"
            "## Where it comes from\n\n"
            "Made on %(date)s from rev b91 of the compendium page (commit `%(commit)s` of %(comb)s) by the scripts in that repository's `tools/split` folder. "
            "The section markup, the styles and the script statements are copied from the page without change. What differs is the page title and description, a short header and footer line, "
            "the link to the manual, links to other modules (now pointing at their repositories)%(stubclause)s.\n\n"
            "## Checks and limits\n\n"
            "- A scripted headless-Chromium test loaded the page, moved every slider, select and checkbox, clicked every button and sent pointer, wheel and key events to every canvas: "
            "%(inter)d actions, %(canv)d canvas%(canvpl)s%(blank)s, no uncaught exception and no console error. It is a smoke test: this extract was not compared with the original module for identical behaviour, "
            "and nothing here has had an independent review.\n"
            "%(notes)s"
            "%(framework)s\n"
            "- No license: all rights are reserved by default, beyond viewing and forking on GitHub; a license is the author's decision.\n"
        ) % dict(framework=("- The framework is the author's own and still in progress. This module is the page's own set of verdicts, open rulings and build ledger: they are the page's own statements, not an independent assessment." if key == "compendium" else "- The framework is the author's own and still in progress; Module XVII of the compendium carries the page's own verdicts and open rulings."), title=title, roman=roman, comb=COMBINED, owner=OWNER, fbase=fbase, mfile=mfile, date=date, commit=commit, stubclause=stub_clause,
                 inter=res["interactions"], canv=res["canvases"], canvpl="" if res["canvases"] == 1 else "es", blank=(" (%s drawn only on demand or left blank)" % ", ".join(blank)) if blank else "",
                 notes=("\n".join(("- " + l.lstrip("-* ").strip()) for l in note_text.splitlines() if l.strip() and not l.lstrip().startswith("Standalone extract") and "headless" not in l.lower()) + "\n") if note_text else "")
        open(d + "/README.md", "w", encoding="utf-8").write(readme)
        open(d + "/.gitignore", "w").write(".DS_Store\nThumbs.db\n*.swp\n*.swo\n*~\n.vscode/\n.idea/\n")
        env = dict(os.environ, GIT_OPTIONAL_LOCKS="0")
        for args in (["init", "-q", "-b", "main"], ["add", "--", "."], ["commit", "-q", "-m",
                     "%s: standalone extract of Module %s (rev b91)\n\nBuilt from %s commit %s with tools/split (%s).\n" % (title, roman, COMBINED, commit, date) + (("\n" + TRAILER + "\n") if TRAILER else "")]):
            r = subprocess.run(["git", "-C", d] + args, capture_output=True, text=True, env=env)
            if r.returncode != 0:
                say("GIT FAILED", key, args[0], r.stderr[:200]); break
        head = subprocess.run(["git", "-C", d, "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
        index[key] = dict(roman=roman, title=title, repo=repo, file=fbase + ".html", manual=mfile, head=head, bytes=os.path.getsize(html_path),
                          interactions=res["interactions"], canvases=res["canvases"], stubs=os.path.exists(stubs))
        say("%-11s %-5s %-40s %7d B  head %s  tests: %d actions, %d canvases%s" % (key, roman, repo, os.path.getsize(html_path), head, res["interactions"], res["canvases"], "  [stubs]" if os.path.exists(stubs) else ""))
    json.dump(index, open(BASE + "/repos/_index.json", "w"), indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
