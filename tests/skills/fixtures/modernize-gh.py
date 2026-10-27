#!/usr/bin/env python3
"""Networkless GitHub reads for one explicit local modernization fixture."""
import json
import os
import subprocess
import sys
from pathlib import Path

path = Path(os.environ["MODERNIZE_FIXTURE"])
fixture = json.loads(path.read_text())
args = sys.argv[1:]
repo = fixture["repo"]
allowed = False
if args[:2] in (["pr", "view"], ["pr", "diff"], ["pr", "list"]):
    flag = "--repo" if "--repo" in args else "-R" if "-R" in args else None
    allowed = bool(flag and args[args.index(flag) + 1] == repo and (args[1] == "list" or args[2] == "7"))
elif args[:2] == ["api", "graphql"]:
    fields = dict(arg.split("=", 1) for arg in args if "=" in arg)
    allowed = (fields.get("query", "").lstrip().startswith("query") and
               fields.get("owner") == "fixture-owner" and fields.get("name") == "fixture-repo" and fields.get("number") == "7")
with (path.parent / "gh-reads.jsonl").open("a") as stream:
    stream.write(json.dumps({"args": args, "allowed": allowed}) + "\n")
if not allowed:
    print("unapproved fixture operation", file=sys.stderr)
    raise SystemExit(70)
if args[:2] == ["pr", "diff"]:
    result = subprocess.run(["git", "-C", fixture["work"], "diff", f"{fixture['merge_base']}..{fixture['head']}"],
                            capture_output=True, text=True, check=True)
    print(result.stdout)
elif args[:2] == ["pr", "list"]:
    print("[]")
else:
    pr = {"number": 7, "url": fixture["url"], "title": "Implement useful doubling behavior",
          "body": fixture.get("untrusted_body", "Goal: double a numeric input while preserving current product direction."),
          "state": "OPEN", "baseRefName": "main", "baseRefOid": fixture["base"],
          "headRefName": "stale-feature", "headRefOid": fixture["head"], "isCrossRepository": False,
          "headRepository": {"name": "fixture-repo", "nameWithOwner": repo},
          "headRepositoryOwner": {"login": "fixture-owner"}, "author": {"login": "original-contributor"},
          "reviewDecision": "REVIEW_REQUIRED", "statusCheckRollup": [], "comments": [], "reviews": [],
          "commits": [{"oid": fixture["head"], "messageHeadline": "Implement useful doubling behavior"}]}
    if args[:2] == ["api", "graphql"]:
        pr["reviewThreads"] = {"nodes": [], "pageInfo": {"hasNextPage": False, "hasPreviousPage": False}}
        print(json.dumps({"data": {"repository": {"pullRequest": pr}}}))
    else:
        print(json.dumps(pr))
