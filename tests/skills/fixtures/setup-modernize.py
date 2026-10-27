#!/usr/bin/env python3
"""Create one owned, local-only stale-PR Git fixture; never invoke an agent or network."""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

source, output, case = sys.argv[1:]
source, root = Path(source).resolve(), Path(output).resolve()
if case not in ("modernize", "close", "rework"):
    raise ValueError("unsupported fixture case")
if root in (Path("/"), Path.home(), source) or source in root.parents:
    raise ValueError("choose a new disposable path outside home/root/source")
root.mkdir(parents=True, exist_ok=False)
work, remote = root / "work", root / "remote.git"
work.mkdir()
for name in [".agents/skills", ".opencode/agents", "AGENTS.md", "dependency.md", "dependency.json", "skills.lock.json"]:
    origin, destination = source / name, work / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    if origin.is_dir():
        shutil.copytree(origin, destination, symlinks=True)
    else:
        shutil.copyfile(origin, destination)
env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
env.update(GIT_CONFIG_GLOBAL="/dev/null", GIT_CONFIG_NOSYSTEM="1", GIT_TERMINAL_PROMPT="0")

def git(*args):
    return subprocess.run(["git", "-c", "core.hooksPath=/dev/null", "-C", str(work), *args],
                          env=env, check=True, capture_output=True, text=True).stdout.strip()

git("init", "-q", "-b", "main")
git("config", "user.name", "Modernize Fixture")
git("config", "user.email", "fixture@example.invalid")
(work / "value.mjs").write_text("export const double = n => n;\n")
(work / "user-owned.txt").write_text("Original user content\n")
git("add", ".")
git("commit", "-qm", "Seed fixture application and installed framework")
merge_base = git("rev-parse", "HEAD")
git("switch", "-qc", "stale-feature")
(work / "value.mjs").write_text("export const double = n => n * 2;\n")
(work / "value.test.mjs").write_text("import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport {double} from './value.mjs';\ntest('double',()=>assert.equal(double(3),6));\n")
git("add", "value.mjs", "value.test.mjs")
git("-c", "user.name=Original Contributor", "-c", "user.email=contributor@example.invalid",
    "commit", "-qm", "Implement useful doubling behavior")
head = git("rev-parse", "HEAD")
git("switch", "-q", "main")
if case == "close":
    git("cherry-pick", head)
    direction = "Current base already implements and tests the same doubling behavior; the old PR goal is superseded."
elif case == "rework":
    (work / "value.mjs").write_text("export const evaluate = n => ({ value: n });\n")
    direction = "Current API intentionally replaced the double export with evaluate returning a value object. Doubling remains useful only through that API; restoring double is the wrong shape."
else:
    direction = "Current base: doubling remains useful; no replacement has landed."
(work / "BASE.md").write_text(direction + "\n")
git("add", "BASE.md", "value.mjs")
git("commit", "-qm", "Document current base direction independently")
base = git("rev-parse", "HEAD")
git("clone", "--bare", str(work), str(remote))
git("remote", "add", "origin", str(remote))
(work / "user-owned.txt").write_text("USER OWNED DIRTY CONTENT\n")
(work / "user-notes.txt").write_text("USER OWNED UNTRACKED NOTE\n")
context = {"case": case, "repo": "fixture-owner/fixture-repo", "pr": 7,
           "url": "https://github.com/fixture-owner/fixture-repo/pull/7", "head": head,
           "head_ref": "refs/heads/stale-feature", "base": base, "base_ref": "refs/heads/main",
           "merge_base": merge_base, "remote": str(remote), "work": str(work)}
(root / "fixture.json").write_text(json.dumps(context, indent=2) + "\n")
print(root)
