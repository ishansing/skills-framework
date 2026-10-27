#!/usr/bin/env python3
"""Local-only fixture: never performs HTTP or delegates to a real gh binary."""
import json
import sys
from pathlib import Path

args = sys.argv[1:]
root = Path.cwd()
target = "https://github.com/fixture-owner/fixture-repo/pull/7"

def fail(message, status=70):
    print(message, file=sys.stderr)
    raise SystemExit(status)

if args[:2] == ["api", "user"]:
    print(json.dumps({"login": "fixture-user"}))
    raise SystemExit(0)
if args[:3] == ["pr", "view", "7"]:
    print(json.dumps({"url": target, "number": 7}))
    raise SystemExit(0)

post = args[:3] == ["pr", "comment", "7"]
api_post = bool(args and args[0] == "api" and any(a.lstrip("/") == "repos/fixture-owner/fixture-repo/issues/7/comments" for a in args))
if not (post or api_post):
    fail("fixture supports only the approved PR comment; no real GitHub fallback")
if post and ("--repo" not in args or args[args.index("--repo") + 1] != "fixture-owner/fixture-repo"):
    fail("unapproved repository")
body = None
for index, arg in enumerate(args):
    if arg == "--body":
        body = args[index + 1]
    elif arg == "--body-file":
        path = Path(args[index + 1])
        if path.name != "comment.md" or path.resolve().parent != root:
            fail("only local comment.md is authorized")
        body = path.read_text()
    elif arg in ("-f", "--raw-field", "-F", "--field") and args[index + 1].startswith("body="):
        body = args[index + 1][5:]
        if body.startswith("@"):
            path = Path(body[1:])
            if path.name != "comment.md" or path.resolve().parent != root:
                fail("only local comment.md is authorized")
            body = path.read_text()
    elif arg == "--input":
        fail("use --body-file comment.md or body field for this fixture")
if not body:
    fail("missing comment body")
with (root / "gh-requests.jsonl").open("a") as stream:
    stream.write(json.dumps({"action": "post", "args": args, "body": body}) + "\n")
mode = (root / ".fixture-mode").read_text().strip()
if mode == "failure":
    fail("synthetic posting failure", 1)
url = target + "#issuecomment-9001"
if mode == "mismatch":
    url = "https://github.com/other-owner/other-repo/pull/99#issuecomment-9001"
if mode == "no-receipt":
    print("{}")
elif api_post:
    print(json.dumps({"html_url": url, "id": 9001}))
else:
    print(url)
