import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../../", import.meta.url));

test("contract checker rejects recursive user entries and lock class drift", () => {
  const fixture = mkdtempSync(join(tmpdir(), "itp-contract-"));
  try {
    for (const path of [".agents", "dependency.md", "dependency.json", "skills.lock.json"]) {
      cpSync(join(root, path), join(fixture, path), { recursive: true });
    }
    const check = () => spawnSync(process.execPath,
      [join(root, "tests/skills/check-contracts.mjs"), fixture], { encoding: "utf8" });
    assert.equal(check().status, 0);

    const adapter = join(fixture, ".agents/skills/itp-implement/SKILL.md");
    const original = readFileSync(adapter, "utf8");
    writeFileSync(adapter, original.replace(/conditional_children: \[/,
      "conditional_children: [implement-spec, retro, "));
    const recursive = check();
    assert.equal(recursive.status, 1);
    for (const id of ["implement-spec", "retro"]) {
      assert.match(recursive.stderr, new RegExp(`"${id}" is user-entry`));
    }
    writeFileSync(adapter, original);

    const lockPath = join(fixture, "skills.lock.json");
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    lock.skills.find((s) => s.id === "implement-spec").invocationClass = "model";
    writeFileSync(lockPath, JSON.stringify(lock));
    const drift = check();
    assert.equal(drift.status, 1);
    assert.match(drift.stderr, /implement-spec invocation class differs/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
