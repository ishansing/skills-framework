import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dirHash, readSkillName } from "../../scripts/skill-hash.mjs";
import { assertSkillIdentity } from "../../scripts/repin.mjs";

test("dirHash is order independent and sensitive to content", () => {
  const a = mkdtempSync(join(tmpdir(), "itp-hash-a-"));
  writeFileSync(join(a, "b.txt"), "b");
  mkdirSync(join(a, "sub"));
  writeFileSync(join(a, "sub", "a.txt"), "a");

  const b = mkdtempSync(join(tmpdir(), "itp-hash-b-"));
  mkdirSync(join(b, "sub"));
  writeFileSync(join(b, "sub", "a.txt"), "a");
  writeFileSync(join(b, "b.txt"), "b");

  assert.equal(dirHash(a), dirHash(b));
  assert.match(dirHash(a), /^[0-9a-f]{64}$/);

  writeFileSync(join(b, "b.txt"), "changed");
  assert.notEqual(dirHash(a), dirHash(b));
});

test("readSkillName reads the frontmatter name", () => {
  const dir = mkdtempSync(join(tmpdir(), "itp-name-"));
  const file = join(dir, "SKILL.md");
  writeFileSync(file, "---\nname: tdd\ndescription: x\n---\n\n# body\n");
  assert.equal(readSkillName(file), "tdd");
});

test("assertSkillIdentity accepts a matching skill directory", () => {
  const dir = mkdtempSync(join(tmpdir(), "itp-identity-"));
  writeFileSync(join(dir, "SKILL.md"), "---\nname: tdd\ndescription: x\n---\n");
  assert.doesNotThrow(() =>
    assertSkillIdentity({ id: "tdd", path: "skills/tdd", updateMode: undefined }, dir)
  );
});

test("assertSkillIdentity refuses a renamed upstream skill", () => {
  const dir = mkdtempSync(join(tmpdir(), "itp-identity-rename-"));
  writeFileSync(join(dir, "SKILL.md"), "---\nname: research\ndescription: x\n---\n");
  assert.throws(
    () => assertSkillIdentity({ id: "tdd", path: "skills/tdd" }, dir),
    /rename\/adaptation needed/
  );
});

test("assertSkillIdentity refuses a missing vendor-file", () => {
  const dir = mkdtempSync(join(tmpdir(), "itp-identity-vendor-"));
  assert.throws(
    () =>
      assertSkillIdentity(
        { id: "web-design-guidelines", updateMode: "vendor-file", sourcePath: "command.md" },
        join(dir, "command.md")
      ),
    /no command\.md/
  );
});
