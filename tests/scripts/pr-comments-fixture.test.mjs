import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

test("fake PR-comment CLI supplies receipts/errors locally and rejects unrelated actions", () => {
  const base = mkdtempSync(join(tmpdir(), "itp-comment-gh-"));
  try {
    const script = fileURLToPath(new URL("../skills/fixtures/pr-comments-gh.py", import.meta.url));
    const post = ["pr", "comment", "7", "--repo", "fixture-owner/fixture-repo", "--body-file", "comment.md"];
    const run = args => spawnSync("python3", [script, ...args], { cwd: base, encoding: "utf8" });
    writeFileSync(join(base, "comment.md"), "Safe synthetic comment.\n");
    for (const [mode, status, output] of [
      ["success", 0, /fixture-owner\/fixture-repo\/pull\/7#issuecomment-9001/],
      ["failure", 1, /synthetic posting failure/],
      ["mismatch", 0, /other-owner\/other-repo\/pull\/99/],
      ["no-receipt", 0, /\{\}/],
    ]) {
      writeFileSync(join(base, ".fixture-mode"), mode);
      const result = run(post);
      assert.equal(result.status, status, result.stderr);
      assert.match(result.stdout + result.stderr, output);
    }
    assert.equal(run(["pr", "merge", "7"]).status, 70);
    const calls = readFileSync(join(base, "gh-requests.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
    assert.equal(calls.length, 4);
    assert.ok(calls.every(call => call.action === "post" && call.body === "Safe synthetic comment.\n"));
  } finally { rmSync(base, { recursive: true, force: true }); }
});

test("native fixture setup retains declared inputs and refuses an existing destination", () => {
  const base = mkdtempSync(join(tmpdir(), "itp-comment-setup-"));
  try {
    const source = fileURLToPath(new URL("../../", import.meta.url));
    const script = fileURLToPath(new URL("../skills/fixtures/setup-pr-comments.py", import.meta.url));
    const data = JSON.parse(readFileSync(new URL("../skills/fixtures/pr-comments-inputs.json", import.meta.url), "utf8"));
    const args = [script, source, base, "positive"];
    const foreign = join(base, "foreign"); mkdirSync(foreign);
    writeFileSync(join(foreign, "user-note.txt"), "Preserve this unrelated work.\n");
    const setup = spawnSync("python3", args, { encoding: "utf8", env: { ...process.env,
      GIT_DIR: join(base, "foreign.git"), GIT_WORK_TREE: foreign, GIT_INDEX_FILE: join(base, "foreign.index") } });
    assert.equal(setup.status, 0, setup.stderr);
    assert.equal(existsSync(join(base, "foreign.git")), false);
    assert.equal(existsSync(join(base, "foreign.index")), false);
    assert.equal(readFileSync(join(foreign, "user-note.txt"), "utf8"), "Preserve this unrelated work.\n");
    for (const [path, text] of Object.entries(data.after)) assert.equal(readFileSync(join(base, "positive", path), "utf8"), text);
    assert.equal(readFileSync(join(base, "positive/prompt.txt"), "utf8"), data.cases.positive.prompt);
    assert.deepEqual(JSON.parse(readFileSync(join(base, "positive/opencode.json"))), data.config);
    const before = spawnSync("git", ["-C", join(base, "positive"), "show", "HEAD:value.mjs"], { encoding: "utf8" });
    assert.equal(before.status, 0, before.stderr);
    assert.equal(before.stdout, data.before["value.mjs"]);
    assert.notEqual(spawnSync("python3", args, { encoding: "utf8" }).status, 0);
    const unsafe = spawnSync("python3", [script, source, join(source, ".agents/skills/replay"), "positive"], { encoding: "utf8" });
    assert.notEqual(unsafe.status, 0);
    assert.match(unsafe.stderr, /disposable fixture parent/);
    assert.equal(readFileSync(join(base, "positive/value.mjs"), "utf8"), data.after["value.mjs"]);
  } finally { rmSync(base, { recursive: true, force: true }); }
});
