#!/usr/bin/env python3
"""verify_modules.py REPOS_DIR PAGE MANUAL   (run with: python3 -I verify_modules.py ...)

Mechanical checks of the packaged module repositories before anything is published. For every repository listed in
REPOS_DIR/_index.json it checks that
  - the tracked files are exactly the page, the manual extract, README.md and .gitignore;
  - the <style> block equals the compendium page's;
  - the section markup equals the compendium page's section after only the two intended rewrites (the Manual link and the
    links to other modules);
  - every line of the script body (outside the stubs block) occurs verbatim in the compendium page's script (a statement that
    shared a source line with another one is checked as the fragment it is);
  - the stubs block equals the stubs file that was used (when there is one);
  - the manual extract's body equals the text of Manual.md for that module;
  - there is one commit with exactly one Co-Authored-By trailer and no remote, no e-mail-shaped string, no claude.ai link,
    no UUID and no absolute home or temp path in any tracked file.
Prints one line per repository and a final PASS/FAIL line. Read-only."""
import json
import os
import re
import subprocess
import sys

SHARE = re.compile(r"claude\.ai/(share|chat|code|artifact)/")
EMAIL = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
UUID = re.compile(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")
ABS = re.compile("/" + "home/|/" + "Users/|/tmp/" + "claude|C:" + chr(92) * 2 + "Users")   # built from pieces so that this file itself holds no such path
OWNER = "Ajuntanaga"


def main(argv):
    repos_dir, page_path, manual_path = argv[1:4]
    stubs_dir = os.path.join(os.path.dirname(repos_dir.rstrip("/")), "stubs")
    index = json.load(open(os.path.join(repos_dir, "_index.json")))
    main_html = open(page_path, encoding="utf-8").read()
    manual = open(manual_path, encoding="utf-8").read()
    main_css = re.search(r"<style>[\s\S]*?</style>", main_html).group(0)
    sIdx = main_html.rfind("<script>")
    main_js = main_html[sIdx + 8:main_html.find("</script>", sIdx)]
    linkmap = json.load(open(os.path.join(os.path.dirname(repos_dir.rstrip("/")), "linkmap.json")))
    fails = 0
    for key, meta in index.items():
        d = os.path.join(repos_dir, meta["repo"])
        problems = []
        files = sorted(subprocess.run(["git", "-C", d, "ls-files"], capture_output=True, text=True).stdout.split())
        want = sorted([meta["file"], meta["manual"], "README.md", ".gitignore"])
        if files != want:
            problems.append("tracked files %s != %s" % (files, want))
        page = open(os.path.join(d, meta["file"]), encoding="utf-8").read()
        css = re.search(r"<style>[\s\S]*?</style>", page).group(0)
        if css != main_css:
            problems.append("style block differs")
        sec_main = re.search(r'<section\b[^>]*id="%s"[\s\S]*?</section>' % re.escape(key), main_html).group(0)
        sec_page = re.search(r'<section\b[^>]*id="%s"[\s\S]*?</section>' % re.escape(key), page).group(0)
        exp = sec_main.replace('href="Manual.md"', 'href="%s"' % meta["manual"])
        exp = re.sub(r'href="#([^"]+)"', lambda m: m.group(0) if ('id="%s"' % m.group(1)) in sec_main else ('href="%s"' % linkmap[m.group(1)] if m.group(1) in linkmap else m.group(0)), exp)
        if sec_page != exp:
            problems.append("section markup differs beyond the intended rewrites")
        # script body
        s0 = page.rfind("<script>")
        body = page[s0 + len("<script>"):page.find("</script>", s0)]
        m = re.match(r'\n\(function\(\)\{\n"use strict";\n([\s\S]*)\n\n\}\)\(\);\n$', body)
        if not m:
            problems.append("script wrapper not as expected")
        else:
            inner = m.group(1)
            sf = os.path.join(stubs_dir, key + ".stubs.js")
            stub_text = ""
            if os.path.exists(sf):
                stub_text = open(sf, encoding="utf-8").read().rstrip() + "\n"
                if not inner.startswith(stub_text):
                    problems.append("stubs block differs from the stubs file")
                    stub_text = ""
            rest = inner[len(stub_text):]
            missing = [l for l in rest.split("\n") if l.strip() and l.strip() not in main_js]
            if missing:
                problems.append("%d script lines not found verbatim in the page, e.g. %r" % (len(missing), missing[0][:80]))
        # manual
        roman = meta["roman"]
        lines = manual.split("\n")
        st = next(i for i, l in enumerate(lines) if l.startswith("## Module %s \u2014 " % roman))
        en = len(lines) if key == "compendium" else next((i for i in range(st + 1, len(lines)) if lines[i].startswith("## ")), len(lines))
        mtext = "\n".join(lines[st:en]).rstrip("\n") + "\n"
        mfile = open(os.path.join(d, meta["manual"]), encoding="utf-8").read()
        if not mfile.endswith(mtext):
            problems.append("manual extract body differs from Manual.md")
        # hygiene
        for f in files:
            t = open(os.path.join(d, f), encoding="utf-8", errors="replace").read()
            for name, rx in (("email", EMAIL), ("claude.ai link", SHARE), ("uuid", UUID), ("absolute path", ABS)):
                if rx.search(t):
                    problems.append("%s in %s" % (name, f))
        log = subprocess.run(["git", "-C", d, "log", "--format=%B"], capture_output=True, text=True).stdout
        n = int(subprocess.run(["git", "-C", d, "rev-list", "--count", "HEAD"], capture_output=True, text=True).stdout.strip())
        if n != 1 or log.count("Co-Authored-By: Claude Sonnet 5.5 <noreply@" + "anthropic.com>") != 1:
            problems.append("commits %d, trailers %d" % (n, log.count("Co-Authored-By:")))
        if subprocess.run(["git", "-C", d, "remote"], capture_output=True, text=True).stdout.strip():
            problems.append("has a remote")
        print("%-11s %-40s %s" % (key, meta["repo"], "ok" if not problems else "FAIL: " + "; ".join(problems)))
        fails += bool(problems)
    print("PASS" if not fails else "FAIL (%d repositories)" % fails)
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
