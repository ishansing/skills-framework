import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const script = fileURLToPath(new URL("../skills/fixtures/file-pr-gh.py", import.meta.url));
const setup = fileURLToPath(new URL("../skills/fixtures/setup-file-pr.py", import.meta.url));
const framework = fileURLToPath(new URL("../../", import.meta.url));
function fixture(mode = "success") {
  const root = mkdtempSync(join(tmpdir(), "itp-file-pr-"));
  const file = join(root, "file-pr-fixture.json");
  writeFileSync(file, JSON.stringify({ mode, repo: "fixture-owner/fixture-repo", head: "a".repeat(40), base: "b".repeat(40) }));
  writeFileSync(join(root, "body.md"), "Safe prepared PR body.\n");
  return { root, file, run(args) { return spawnSync("python3", [script, ...args], { cwd: root, env: { ...process.env, FILE_PR_FIXTURE: file }, encoding: "utf8" }); } };
}
const target = ["--repo", "fixture-owner/fixture-repo"];
const create = ["pr", "create", ...target, "--head", "fixture-owner:fixture-feature", "--base", "main", "--title", "Double values", "--body-file", "body.md"];
test("fake PR publication creates one target-bound receipt and rejects duplicate/unrelated writes", () => {
  const f = fixture();
  try {
    const listed = f.run(["pr", "list", ...target, "--state", "open", "--json", "url"]);
    assert.equal(listed.status, 0, listed.stdout + listed.stderr);
    assert.deepEqual(JSON.parse(listed.stdout), []);
    const made = f.run(create);
    assert.equal(made.status, 0, made.stdout + made.stderr);
    assert.equal(made.stdout.trim(), "https://github.com/fixture-owner/fixture-repo/pull/7");
    const viewed = f.run(["pr", "view", "7", ...target, "--json", "url,headRefOid,isDraft,body"]);
    assert.equal(viewed.status, 0, viewed.stdout + viewed.stderr);
    const pr = JSON.parse(viewed.stdout);
    assert.equal(pr.headRefOid, "a".repeat(40));
    assert.equal(pr.isDraft, false);
    assert.equal(pr.body, "Safe prepared PR body.\n");
    assert.deepEqual(JSON.parse(f.run(["pr", "list", ...target, "--state", "merged"]).stdout), []);
    assert.equal(f.run(create).status, 1);
    assert.equal(f.run(["pr", "close", "7", ...target]).status, 70);
    assert.equal(f.run(["pr", "create", "--repo", "other-owner/other-repo"]).status, 70);
    assert.equal(JSON.parse(readFileSync(f.file, "utf8")).writes, 1);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("fake GitHub reads published refs and applies only explicit update fields", () => {
  const f = fixture();
  try {
    const ref = f.run(["api", "repos/fixture-owner/fixture-repo/git/ref/heads/fixture-feature"]);
    assert.equal(ref.status, 0, ref.stdout + ref.stderr);
    assert.equal(JSON.parse(ref.stdout).object.sha, "a".repeat(40));
    assert.equal(f.run(create).status, 0);
    writeFileSync(join(f.root, "updated.md"), "Updated approved body.\n");
    const changed = f.run(["pr", "edit", "7", ...target, "--body-file", "updated.md"]);
    assert.equal(changed.status, 0, changed.stdout + changed.stderr);
    const state = JSON.parse(readFileSync(f.file, "utf8"));
    assert.equal(state.pr.title, "Double values");
    assert.equal(state.pr.isDraft, false);
    assert.equal(state.pr.body, "Updated approved body.\n");
    assert.equal(state.writes, 2);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("fake create failures distinguish definite no-write rejection from uncertain committed writes", () => {
  const quota = fixture("graphql-quota");
  const uncertain = fixture("ambiguous");
  try {
    assert.equal(quota.run(create).status, 1);
    assert.equal(JSON.parse(readFileSync(quota.file, "utf8")).writes || 0, 0);
    const fallback = quota.run(["api", "repos/fixture-owner/fixture-repo/pulls", "--method", "POST", "-f", "title=Double values", "-f", "head=fixture-owner:fixture-feature", "-f", "base=main", "-F", "body=@body.md", "-F", "draft=false"]);
    assert.equal(fallback.status, 0, fallback.stdout + fallback.stderr);
    assert.equal(JSON.parse(fallback.stdout).html_url, "https://github.com/fixture-owner/fixture-repo/pull/7");
    assert.equal(JSON.parse(readFileSync(quota.file, "utf8")).writes, 1);
    assert.equal(uncertain.run(create).status, 1);
    assert.equal(JSON.parse(readFileSync(uncertain.file, "utf8")).writes, 1);
    assert.equal(uncertain.run(["pr", "view", "7", ...target]).status, 0);
    assert.equal(uncertain.run(create).status, 1);
    assert.equal(JSON.parse(readFileSync(uncertain.file, "utf8")).writes, 1);
  } finally {
    rmSync(quota.root, { recursive: true, force: true });
    rmSync(uncertain.root, { recursive: true, force: true });
  }
});

test("fake receipts and refs expose wrong-target and pre/post-write drift", () => {
  for (const mode of ["wrong-receipt", "pre-drift", "post-drift"]) {
    const f = fixture(mode);
    try {
      const before = JSON.parse(f.run(["api", "repos/fixture-owner/fixture-repo/git/ref/heads/fixture-feature"]).stdout);
      assert.equal(before.object.sha, (mode === "pre-drift" ? "c" : "a").repeat(40));
      const receipt = f.run(create);
      assert.equal(receipt.status, 0, receipt.stdout + receipt.stderr);
      if (mode === "wrong-receipt") assert.match(receipt.stdout, /other-owner\/other-repo/);
      const observed = JSON.parse(f.run(["pr", "view", "7", ...target]).stdout);
      assert.equal(observed.headRefOid, (mode === "post-drift" || mode === "pre-drift" ? "c" : "a").repeat(40));
      assert.equal(JSON.parse(readFileSync(f.file, "utf8")).writes, 1);
    } finally { rmSync(f.root, { recursive: true, force: true }); }
  }
});

test("publication setup binds actual committed Git head to fresh local evidence and refuses overwrite", () => {
  const root = mkdtempSync(join(tmpdir(), "itp-file-pr-setup-"));
  try {
    const made = spawnSync("python3", [setup, framework, join(root, "cases")], { encoding: "utf8" });
    assert.equal(made.status, 0, made.stdout + made.stderr);
    const project = join(root, "cases/positive");
    const fixture = JSON.parse(readFileSync(join(project, "file-pr-fixture.json"), "utf8"));
    const head = spawnSync("git", ["rev-parse", "HEAD"], { cwd: project, encoding: "utf8" });
    assert.equal(head.status, 0);
    assert.equal(fixture.head, head.stdout.trim());
    assert.notEqual(fixture.head, fixture.base);
    assert.match(readFileSync(join(project, "docs/work/verification.md"), "utf8"), /tests 1[\s\S]*pass 1[\s\S]*fail 0/);
    assert.match(readFileSync(join(project, "prepared-pr-body.md"), "utf8"), /## Summary[\s\S]*## Evidence[\s\S]*## Merge Danger/);
    const repeat = spawnSync("python3", [setup, framework, join(root, "cases")], { encoding: "utf8" });
    assert.notEqual(repeat.status, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("fake writes reject unsupported fields and duplicate target flags instead of hiding attempts", () => {
  const f = fixture();
  try {
    assert.equal(f.run([...create, "-R", "other-owner/other-repo"]).status, 70);
    assert.equal(f.run([...create, "--label", "ungranted"]).status, 70);
    assert.equal(f.run([...create, "--draft"]).status, 0);
    assert.equal(JSON.parse(readFileSync(f.file, "utf8")).pr.isDraft, true);
    const changed = f.run(["pr", "edit", "7", ...target, "--body-file", "body.md", "--base", "other-base"]);
    assert.equal(changed.status, 70);
    assert.equal(JSON.parse(readFileSync(f.file, "utf8")).writes, 1);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});
