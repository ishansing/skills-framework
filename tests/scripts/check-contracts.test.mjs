import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { buildRegistry } from "../../scripts/generate-dependency-json.mjs";

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

test("contract checker enforces installed-local location", () => {
  const fixture = mkdtempSync(join(tmpdir(), "itp-contract-local-"));
  try {
    for (const path of [".agents", "dependency.md", "dependency.json", "skills.lock.json"]) {
      cpSync(join(root, path), join(fixture, path), { recursive: true });
    }
    const depPath = join(fixture, "dependency.md");
    const depText = () => readFileSync(depPath, "utf8");
    const resync = () => writeFileSync(join(fixture, "dependency.json"),
      JSON.stringify(buildRegistry(depText()), null, 2) + "\n");
    // Flip prototype (a conditional child; stays pinned, lock entry untouched).
    writeFileSync(depPath, depText().replace(
      "| prototype | mattpocock/skills | model | installed-global | itp-spec |",
      "| prototype | mattpocock/skills | model | installed-local | itp-spec |"));
    resync();
    const check = () => spawnSync(process.execPath,
      [join(root, "tests/skills/check-contracts.mjs"), fixture], { encoding: "utf8" });

    // Missing directory fails with the location message.
    const missing = check();
    assert.equal(missing.status, 1);
    assert.match(missing.stderr, /installed-local "prototype" missing at/);

    // Present directory with mismatched frontmatter name still fails.
    const dir = join(fixture, ".agents", "skills", "prototype");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "SKILL.md"),
      "---\nname: not-prototype\ndescription: Fixture skill.\n---\n");
    const mismatch = check();
    assert.equal(mismatch.status, 1);
    assert.match(mismatch.stderr, /installed-local "prototype" SKILL.md name/);

    // Correct name passes the whole suite.
    writeFileSync(join(dir, "SKILL.md"),
      "---\nname: prototype\ndescription: Fixture skill.\n---\n");
    const passing = check();
    assert.equal(passing.status, 0);
    assert.match(passing.stdout, /installed-local "prototype" present with matching name/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
