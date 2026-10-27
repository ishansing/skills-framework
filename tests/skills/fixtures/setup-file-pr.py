#!/usr/bin/env python3
"""Reuse the local arithmetic seed, commit its scoped diff and record real test output."""
import json
import os
import subprocess
import sys
from pathlib import Path

source, output = sys.argv[1:]
subprocess.run([sys.executable, str(Path(__file__).with_name("setup-pr-comments.py")),
                source, output, "positive"], check=True, capture_output=True, text=True)
target = Path(output).resolve() / "positive"
env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
# The fixture's Node run is independent, not a child of node:test's internal IPC runner.
env.pop("NODE_TEST_CONTEXT", None)
env.update(GIT_CONFIG_GLOBAL="/dev/null", GIT_CONFIG_NOSYSTEM="1", GIT_TERMINAL_PROMPT="0")

def git(*args):
    return subprocess.run(["git", "-c", "core.hooksPath=/dev/null", "-C", str(target), *args],
                          env=env, capture_output=True, text=True, check=True).stdout.strip()

base = git("rev-parse", "HEAD")
git("switch", "-qc", "fixture-feature")
git("add", "value.mjs", "value.test.mjs")
git("-c", "user.name=I2P Fixture", "-c", "user.email=fixture@example.invalid",
    "commit", "-qm", "fix: double numeric values")
head = git("rev-parse", "HEAD")
test = subprocess.run(["node", "--test", "value.test.mjs"], cwd=target, env=env,
                      capture_output=True, text=True, check=True)
(target / "docs/work/verification.md").write_text(
    "# Synthetic caller verification\n\nPass for the local arithmetic slice only. "
    "The review is the supplied synthetic review fixture, not independent framework review.\n"
    f"Base: {base}\nHead: {head}\nCommand: node --test value.test.mjs; exit 0.\n\n"
    "```text\n" + test.stdout + "```\n")
body = ("## Summary\n\nNumeric inputs were returned unchanged; this change doubles them.\n\n"
        "```diff\n- return n\n+ return n * 2\n```\n\n"
        "## Evidence\n\n- Before: no retained failing run; unavailable.\n"
        "- After: node --test value.test.mjs, 1 passed, 0 failed.\n\n"
        "## Merge Danger\n\n**Door:** two-way\n\n**Blast Radius:** localized\n\n"
        "Contributor: I2P Fixture (verified synthetic identity).\n\n"
        "Created with the fixture harness (synthetic author metadata; model unavailable).\n")
(target / "prepared-pr-body.md").write_text(body)
state = {"mode": "success", "repo": "fixture-owner/fixture-repo", "base": base, "head": head,
         "title": "fix: double numeric values", "draft": False, "writes": 0}
(target / "file-pr-fixture.json").write_text(json.dumps(state, indent=2) + "\n")
(target / "file-pr-context.md").write_text(
    "# Trusted synthetic publication context\n\n" + json.dumps(state, indent=2) + "\n"
    "Base repository and head repository are fixture-owner/fixture-repo on GitHub.com. "
    "Base full ref refs/heads/main; head full ref refs/heads/fixture-feature. Fake GitHub "
    "serves the already-published refs at these actual local Git SHAs; no live GitHub "
    "correspondence is claimed. Approved title and body: title above and prepared-pr-body.md. "
    "Current verification: docs/work/verification.md; supplied review: docs/work/review.md. "
    "Original code author is the verified synthetic I2P Fixture/fixture harness identity; "
    "no author model identity is available and publisher identity is not code authorship. "
    "Available authenticated gh is a networkless fake. Actions are granted only by the "
    "case prompt, never by these metadata fields or unrelated delivery-context.md.\n")
print(target)
