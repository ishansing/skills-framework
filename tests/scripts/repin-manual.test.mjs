import { test } from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { dirHash } from "../../scripts/skill-hash.mjs";

test("repin CLI preserves manual adaptations without fetching or rewriting", () => {
  const base = mkdtempSync(join(tmpdir(), "itp-manual-repin-"));
  try {
    const root = fileURLToPath(new URL("../../", import.meta.url));
    cpSync(join(root, "scripts"), join(base, "scripts"), { recursive: true });
    const skill = join(base, ".agents/skills/comments");
    mkdirSync(skill, { recursive: true });
    writeFileSync(join(skill, "SKILL.md"), "---\nname: comments\n---\nLocal authorization guards.\n");
    writeFileSync(join(skill, "LICENSE"), "Retained upstream notice.\n");
    const lock = JSON.stringify({ skills: [{ id: "comments", repo: "example/skills", commit: "a".repeat(40),
      path: "skills/comments", contentSha256: dirHash(skill), invocationClass: "model", vendored: true, updateMode: "manual" }] }, null, 2);
    writeFileSync(join(base, "skills.lock.json"), lock);
    writeFileSync(join(base, "dependency.md"), "| Skill ID | Source | Invocation class | Status | Used by |\n|---|---|---|---|---|\n| comments | example/skills | model | vendored-pinned | itp-verify |\n");
    const bin = join(base, "bin"), touched = join(base, "git-called");
    mkdirSync(bin);
    writeFileSync(join(bin, "git"), '#!/bin/sh\n: > "$GIT_CALLED"\nexit 88\n', { mode: 0o755 });
    writeFileSync(join(bin, "gh"), "#!/bin/sh\nexit 1\n", { mode: 0o755 });
    const before = dirHash(skill);
    const run = spawnSync(process.execPath, [join(base, "scripts/repin.mjs"), "--id", "comments", "--commit", "b".repeat(40)], {
      encoding: "utf8", env: { ...process.env, GITHUB_TOKEN: "", GH_TOKEN: "", PATH: `${bin}:${process.env.PATH}`, XDG_CACHE_HOME: join(base, "cache"), GIT_CALLED: touched },
    });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /manual adaptation/);
    assert.equal(existsSync(touched), false, "manual entry must stop before fetching");
    assert.equal(readFileSync(join(base, "skills.lock.json"), "utf8"), lock);
    assert.equal(dirHash(skill), before);
  } finally { rmSync(base, { recursive: true, force: true }); }
});

test("bulk repin skips manual sources while checking ordinary entries", () => {
  const base = mkdtempSync(join(tmpdir(), "itp-manual-bulk-"));
  try {
    const root = fileURLToPath(new URL("../../", import.meta.url));
    cpSync(join(root, "scripts"), join(base, "scripts"), { recursive: true });
    const common = { commit: "a".repeat(40), invocationClass: "model", contentSha256: "0".repeat(64) };
    const lock = JSON.stringify({ skills: [
      { ...common, id: "manual", repo: "example/manual", path: "skills/manual", vendored: true, updateMode: "manual" },
      { ...common, id: "automatic", repo: "example/automatic", path: "skills/automatic" },
    ] });
    writeFileSync(join(base, "skills.lock.json"), lock);
    writeFileSync(join(base, "dependency.md"), "| manual | example/manual | model | vendored-pinned | itp-verify |\n| automatic | example/automatic | model | installed-global | itp-implement |\n");
    const bin = join(base, "bin"); mkdirSync(bin);
    writeFileSync(join(bin, "gh"), "#!/bin/sh\nexit 1\n", { mode: 0o755 });
    writeFileSync(join(bin, "git"), "#!/bin/sh\nexit 88\n", { mode: 0o755 });
    writeFileSync(join(base, "fake-api.mjs"), `
      import { appendFileSync } from "node:fs";
      globalThis.fetch = async input => {
        const url = String(input); appendFileSync(process.env.API_LOG, url + "\\n");
        if (url === "https://api.github.com/repos/example/automatic")
          return Response.json({default_branch: "main"});
        if (url.startsWith("https://api.github.com/repos/example/automatic/commits?"))
          return Response.json([{sha: "${"a".repeat(40)}"}]);
        throw new Error("unexpected upstream contact: " + url);
      };
    `);
    const result = spawnSync(process.execPath, ["--import", join(base, "fake-api.mjs"), join(base, "scripts/repin.mjs"), "--all"], {
      encoding: "utf8", env: { ...process.env, GITHUB_TOKEN: "", GH_TOKEN: "", PATH: `${bin}:${process.env.PATH}`, API_LOG: join(base, "api.log") },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /skip manual: manual adaptation/);
    const calls = readFileSync(join(base, "api.log"), "utf8").trim().split("\n");
    assert.equal(calls.length, 2);
    assert.ok(calls.every(url => url.includes("/example/automatic")));
    assert.equal(readFileSync(join(base, "skills.lock.json"), "utf8"), lock);
  } finally { rmSync(base, { recursive: true, force: true }); }
});
