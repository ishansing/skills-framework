#!/usr/bin/env python3
"""Local-only PR publication fixture; never invokes real GitHub or another CLI."""
import json
import os
import sys
from pathlib import Path

path = Path(os.environ["FILE_PR_FIXTURE"]).resolve()
state = json.loads(path.read_text())
args = sys.argv[1:]
repo = state["repo"]

def value(*flags, default=None):
    for flag in flags:
        if flag in args and args.index(flag) + 1 < len(args):
            return args[args.index(flag) + 1]
    return default

def fail(message="unapproved fixture operation", code=70):
    print(message, file=sys.stderr)
    raise SystemExit(code)

def body_file(name):
    file = Path(name).resolve()
    if not file.is_relative_to(path.parent):
        fail("body must remain inside the disposable fixture")
    return file.read_text()

def supported_write_args(kind):
    values = {
        "create": {"--repo", "-R", "--head", "--base", "--title", "--body-file"},
        "edit": {"--repo", "-R", "--title", "--body-file"},
        "create-rest": {"--method", "-X", "--input", "-f", "-F", "--raw-field", "--field"},
    }[kind]
    aliases = {"-R": "--repo", "-X": "--method", "-f": "--raw-field", "-F": "--field"}
    seen = set()
    index = 3 if kind == "edit" else 2
    while index < len(args):
        flag = args[index]
        canonical = aliases.get(flag, flag)
        if canonical in seen and canonical not in ("--raw-field", "--field"):
            return False
        seen.add(canonical)
        if kind == "create" and flag == "--draft":
            index += 1
        elif flag in values and index + 1 < len(args):
            index += 2
        else:
            return False
    return True

kind = args[1] if len(args) > 1 and args[0] == "pr" else "unsupported"
allowed = (kind in ("list", "view", "create", "edit") and value("--repo", "-R") == repo)
if len(args) > 1 and args[0] == "api" and value("--method", "-X", default="GET") == "GET":
    allowed = args[1] in [f"repos/{repo}/{part}/{ref}" for part in ("git/ref/heads", "branches", "commits") for ref in ("main", "fixture-feature")]
    if allowed:
        kind = "ref"
if len(args) > 1 and args[:2] == ["api", f"repos/{repo}/pulls"] and value("--method", "-X") == "POST":
    allowed, kind = True, "create-rest"
if args[:2] == ["repo", "view"]:
    allowed = (value("--repo", "-R") == repo or (len(args) > 2 and args[2] == repo))
    if allowed:
        kind = "repository"
if allowed and kind in ("create", "edit", "create-rest"):
    allowed = supported_write_args(kind)
with (path.parent / "gh-requests.jsonl").open("a") as stream:
    stream.write(json.dumps({"kind": kind, "allowed": allowed,
                             "flags": [arg for arg in args if arg.startswith("-")]}) + "\n")
if not allowed:
    fail()

url = f"https://github.com/{repo}/pull/7"
head = "c" * 40 if state.get("mode") == "pre-drift" or (state.get("mode") == "post-drift" and state.get("pr")) else state["head"]
if kind == "ref":
    name = args[1].rsplit("/", 1)[1]
    sha = state["base"] if name == "main" else head
    print(json.dumps({"ref": f"refs/heads/{name}", "name": name, "object": {"sha": sha}, "commit": {"sha": sha}, "sha": sha}))
    raise SystemExit(0)
if kind == "repository":
    print(json.dumps({"nameWithOwner": repo, "url": f"https://github.com/{repo}", "defaultBranchRef": {"name": "main"}}))
    raise SystemExit(0)
if kind == "edit":
    if not state.get("pr") or args[2] not in ("7", url) or not (value("--body-file") or value("--title")):
        fail("missing or mismatched update target")
    if value("--body-file"):
        state["pr"]["body"] = body_file(value("--body-file"))
    if value("--title"):
        state["pr"]["title"] = value("--title")
    state["writes"] = state.get("writes", 0) + 1
    path.write_text(json.dumps(state) + "\n")
    print(url)
    raise SystemExit(0)
if kind in ("create", "create-rest"):
    if state.get("pr"):
        fail("a PR already exists", 1)
    if kind == "create" and state.get("mode") == "graphql-quota":
        fail("HTTP 429 GraphQL quota: operation definitely rejected before any write", 1)
    if kind == "create-rest":
        if value("--input") and any(arg in args for arg in ("-f", "-F", "--raw-field", "--field")):
            fail("do not mix JSON input with query fields")
        payload = json.loads(body_file(value("--input"))) if value("--input") else {}
        for index, arg in enumerate(args[:-1]):
            if arg in ("-f", "-F", "--raw-field", "--field"):
                key, field = args[index + 1].split("=", 1)
                if key in payload:
                    fail("duplicate payload field")
                if arg in ("-F", "--field"):
                    if field.startswith("@"):
                        field = body_file(field[1:])
                    elif field in ("true", "false"):
                        field = field == "true"
                payload[key] = field
    else:
        if not value("--body-file"):
            fail("a prepared body file is required")
        payload = {"head": value("--head"), "base": value("--base"), "title": value("--title"),
                   "body": body_file(value("--body-file")), "draft": "--draft" in args}
    if (set(payload) - {"head", "base", "title", "body", "draft"}
            or payload.get("head") not in ("fixture-feature", "fixture-owner:fixture-feature")
            or payload.get("base") != "main" or not isinstance(payload.get("title"), str)
            or not payload["title"] or not isinstance(payload.get("body"), str)
            or not isinstance(payload.get("draft", False), bool)):
        fail("missing or mismatched PR payload")
    state["pr"] = {"title": payload["title"], "body": payload["body"], "isDraft": payload.get("draft", False)}
    state["writes"] = state.get("writes", 0) + 1
    path.write_text(json.dumps(state) + "\n")
    if state.get("mode") == "ambiguous":
        fail("connection lost; write outcome unknown", 1)
    receipt = "https://github.com/other-owner/other-repo/pull/99" if state.get("mode") == "wrong-receipt" else url
    print(json.dumps({"number": 7, "html_url": receipt}) if kind == "create-rest" else receipt)
else:
    pr = state.get("pr")
    if kind == "list" and value("--state", default="open") not in ("open", "all"):
        print("[]")
        raise SystemExit(0)
    if kind == "view" and (not pr or args[2] not in ("7", "fixture-feature", url)):
        fail("no matching PR", 1)
    if pr:
        pr = {**pr, "number": 7, "url": url, "state": "OPEN", "headRefName": "fixture-feature",
              "baseRefName": "main", "headRefOid": head, "baseRefOid": state["base"],
              "headRepository": {"name": "fixture-repo", "nameWithOwner": repo, "url": f"https://github.com/{repo}"},
              "headRepositoryOwner": {"login": "fixture-owner"},
              "baseRepository": {"nameWithOwner": repo}, "author": {"login": "fixture-user"}}
    print(json.dumps(([pr] if pr else []) if kind == "list" else pr))
