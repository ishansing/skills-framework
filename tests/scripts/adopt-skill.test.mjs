import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync, renameSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { preparePreview, checkPreview, writePreview } from "../../scripts/adopt-skill.mjs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

const git = (dir, ...args) => execFileSync("git", ["-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false", "-C", dir, ...args], {
  encoding: "utf8", env: { ...process.env, GIT_AUTHOR_NAME: "Preview Test", GIT_AUTHOR_EMAIL: "preview@example.invalid", GIT_COMMITTER_NAME: "Preview Test", GIT_COMMITTER_EMAIL: "preview@example.invalid" },
});

function fixture() {
  const base = mkdtempSync(join(tmpdir(), "adopt-preview-"));
  const source = join(base, "source"), framework = join(base, "framework");
  mkdirSync(join(source, "skills", "test-helper"), { recursive: true }); mkdirSync(framework);
  writeFileSync(join(source, "skills/test-helper/SKILL.md"), "---\nname: test-helper\ndescription: Inspect test evidence\n---\nUse [reference](guide.md).\n");
  writeFileSync(join(source, "skills/test-helper/guide.md"), "# Reference\nInspection only.\n");
  writeFileSync(join(source, "outside.txt"), "Unrelated repository file\n");
  for (const dir of [source, framework]) git(dir, "init", "-b", "main");
  git(source, "remote", "add", "origin", "https://github.com/acme/skills");
  git(source, "add", "."); git(source, "commit", "-m", "source fixture");
  writeFileSync(join(framework, "dependency.md"), "# Dependencies\n\n## Upstream inventory\n\n| Skill ID | Source | Invocation class | Status | Used by |\n|---|---|---|---|---|\n| tdd | mattpocock/skills | model | installed-global | itp-implement |\n\n## User-entry skills (never load recursively)\n\n`retro`.\n");
  writeFileSync(join(framework, "skills.lock.json"), '{"skills":[]}\n');
  git(framework, "add", "."); git(framework, "commit", "-m", "framework fixture");
  const revision = git(source, "rev-parse", "HEAD").trim();
  const record = { verified: true, repo: "acme/skills", path: "skills/test-helper/SKILL.md", revision, name: "test-helper", invocation: "model" };
  const state = { version: 1, sources: { "discovery:test": { entries: { "42:skills/test-helper/SKILL.md": record } } } };
  return { base, source, framework, record, state, revision, key: "42:skills/test-helper/SKILL.md" };
}

function apiRoutes(f) {
  const refs = [f.revision, git(f.source, "rev-parse", `${f.revision}:skills`).trim(), git(f.source, "rev-parse", `${f.revision}:skills/test-helper`).trim()];
  const routes = { "/repos/acme/skills": { id: 42, full_name: "acme/skills", private: false }, [`/repos/acme/skills/commits/${f.revision}`]: { sha: f.revision } };
  for (const ref of refs) for (const recursive of [false, true]) {
    const args = ["ls-tree", "-z", ...(recursive ? ["-r"] : []), ref];
    const tree = git(f.source, ...args).split("\0").filter(Boolean).map((row) => {
      const tab = row.indexOf("\t"), [mode, type, sha] = row.slice(0, tab).split(" ");
      return { path: row.slice(tab + 1), mode, type, sha, ...(type === "blob" ? { size: Number(git(f.source, "cat-file", "-s", sha).trim()) } : {}) };
    });
    routes[`/repos/acme/skills/git/trees/${ref}${recursive ? "?recursive=1" : ""}`] = { tree, truncated: false };
  }
  return routes;
}
const options = (f) => {
  const routes = apiRoutes(f);
  return { state: f.state, candidate: f.key, root: f.framework,
    fetchRepository: () => f.source, api: async (path) => {
      const result = routes[path]; if (!result) throw new Error(`unexpected API ${path}`); return result;
    }, globalSkills: join(f.base, "globals") };
};
function commitSource(f) {
  git(f.source, "add", "."); git(f.source, "commit", "-m", "update source fixture");
  f.revision = git(f.source, "rev-parse", "HEAD").trim(); f.record.revision = f.revision;
}

test("preview binds committed bundle and framework without applying adoption", async () => {
  const f = fixture();
  try {
    const before = readFileSync(join(f.framework, "dependency.md"), "utf8");
    const preview = await preparePreview(options(f));
    assert.equal(preview.lockEntry.id, "test-helper");
    assert.equal(preview.lockEntry.commit, f.revision);
    assert.match(preview.lockEntry.contentSha256, /^[a-f0-9]{64}$/);
    assert.match(preview.binding, /^[a-f0-9]{64}$/);
    assert.equal(preview.readiness, "needs-human");
    assert.equal(preview.bundle.files.length, 2);
    assert.equal(readFileSync(join(f.framework, "dependency.md"), "utf8"), before);
    assert.equal(git(f.source, "status", "--porcelain").trim(), "");
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("commit association is revalidated, not assumed from cached HEAD", async () => {
  const f = fixture();
  try {
    const args = options(f);
    args.api = async (path) => path.includes("/commits/") ? { sha: "0".repeat(40) } : { id: 42, full_name: "acme/skills", private: false };
    await assert.rejects(preparePreview(args), /commit.*repository|revision.*source/);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("oversized or incomplete bundles stop before materialization", async () => {
  const f = fixture();
  try {
    const routes = apiRoutes(f);
    const subtree = Object.keys(routes).find(k => k.endsWith("?recursive=1") && routes[k].tree.some(e => e.path === "SKILL.md"));
    routes[subtree].tree.find(e => e.path === "SKILL.md").size = 11_000_000;
    let fetches = 0;
    const args = { ...options(f), api: async p => routes[p], fetchRepository: () => { fetches++; return f.source; } };
    await assert.rejects(preparePreview(args), /budget|materialization/);
    assert.equal(fetches, 0);
    routes[subtree].tree.find(e => e.path === "SKILL.md").size = 100;
    routes[subtree].truncated = true;
    await assert.rejects(preparePreview(args), /incomplete|truncated/);
    assert.equal(fetches, 0);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("dirty, untracked and ignored cache files cannot be pinned as committed content", async () => {
  for (const kind of ["tracked", "extra", "ignored"]) {
    const f = fixture();
    try {
      if (kind === "ignored") { writeFileSync(join(f.source, ".gitignore"), "*.secret\n"); commitSource(f); }
      const file = join(f.source, "skills/test-helper", kind === "tracked" ? "guide.md" : kind === "extra" ? "extra.md" : "extra.secret");
      writeFileSync(file, "uncommitted data\n");
      await assert.rejects(preparePreview(options(f)), /dirty|extra/);
      assert.equal(readFileSync(file, "utf8"), "uncommitted data\n");
    } finally { rmSync(f.base, { recursive: true, force: true }); }
  }
});

test("existing dirty cache is rejected before fetching or force checkout", async () => {
  const f = fixture();
  try {
    const cache = join(f.base, "cache"), cached = join(cache, `acme__skills@${f.revision}`);
    mkdirSync(cache); renameSync(f.source, cached); f.source = cached;
    writeFileSync(join(cached, "skills/test-helper/guide.md"), "keep user edits\n");
    let fetches = 0;
    await assert.rejects(preparePreview({ ...options(f), cache, fetchRepository: () => { fetches++; return cached; } }), /dirty/);
    assert.equal(fetches, 0);
    assert.equal(readFileSync(join(cached, "skills/test-helper/guide.md"), "utf8"), "keep user edits\n");
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("occupied non-Git cache directories are preserved before fetching", async () => {
  const f = fixture();
  try {
    const cache = join(f.base, "cache"), cached = join(cache, `acme__skills@${f.revision}`);
    mkdirSync(cached, { recursive: true }); writeFileSync(join(cached, "user-data.txt"), "preserve me\n");
    let fetches = 0;
    await assert.rejects(preparePreview({ ...options(f), cache, fetchRepository: () => { fetches++; return f.source; } }), /occupied|non-Git/);
    assert.equal(fetches, 0); assert.equal(readFileSync(join(cached, "user-data.txt"), "utf8"), "preserve me\n");
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("committed symlinks and traversing candidate paths stop without outside reads", async () => {
  const f = fixture();
  try {
    const outside = join(f.base, "outside.md"); writeFileSync(outside, "outside\n");
    symlinkSync(outside, join(f.source, "skills/test-helper/link.md")); commitSource(f);
    await assert.rejects(preparePreview(options(f)), /symlink/);
    f.record.path = "../outside/SKILL.md"; f.key = `42:${f.record.path}`;
    f.state.sources["discovery:test"].entries = { [f.key]: f.record };
    await assert.rejects(preparePreview(options(f)), /contained/);
    assert.equal(readFileSync(outside, "utf8"), "outside\n");
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("LFS pointers, filesystem-root caches, and framework symlinks stop early", async () => {
  const f = fixture();
  try {
    writeFileSync(join(f.source, "skills/test-helper/asset.bin"), "version https://git-lfs.github.com/spec/v1\noid sha256:abc\n");
    commitSource(f);
    await assert.rejects(preparePreview(options(f)), /LFS pointer/);
    await assert.rejects(preparePreview({ ...options(f), cache: "/" }), /filesystem root/);
    mkdirSync(join(f.framework, "agent-work"), { recursive: true });
    symlinkSync(join(f.framework, "dependency.md"), join(f.framework, "agent-work", "link.md"));
    await assert.rejects(preparePreview(options(f)), /symlink/);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("local include and credential helpers are rejected in inspection caches", async () => {
  const f = fixture();
  try {
    git(f.source, "config", "include.path", "../other.conf");
    await assert.rejects(preparePreview(options(f)), /not permitted/);
    git(f.source, "config", "--unset", "include.path");
    git(f.source, "config", "credential.helper", "store");
    await assert.rejects(preparePreview(options(f)), /not permitted/);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});
test("source Git filesystem hooks are not executed during inspection", async () => {
  const f = fixture();
  try {
    const marker = join(f.base, "hook-ran"), probe = join(f.base, "probe.sh");
    writeFileSync(probe, `#!/bin/sh\nprintf ran > '${marker}'\n`, { mode: 0o755 });
    git(f.source, "config", "core.fsmonitor", probe);
    await preparePreview(options(f));
    assert.equal(existsSync(marker), false);
    git(f.source, "config", "filter.probe.clean", probe);
    await assert.rejects(preparePreview(options(f)), /not permitted/);
    assert.equal(existsSync(marker), false);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("manifest revalidation catches changed policy, registry, and edited preview rows", async () => {
  const f = fixture();
  try {
    const first = await preparePreview(options(f)), unchanged = await preparePreview(options(f));
    assert.equal(checkPreview(unchanged, first), true);
    const edited = structuredClone(first); edited.inventoryRow = "malicious row";
    assert.throws(() => checkPreview(first, edited), /modified/);
    assert.throws(() => checkPreview(first, first, "0".repeat(64)), /stale/);
    const differentPolicy = await preparePreview({ ...options(f), proposal: { capability: "new decision" } });
    assert.throws(() => checkPreview(differentPolicy, first), /stale/);
    writeFileSync(join(f.framework, "dependency.md"), readFileSync(join(f.framework, "dependency.md"), "utf8") + "\nChanged registry convention\n");
    const changed = await preparePreview(options(f));
    assert.throws(() => checkPreview(changed, first), /stale/);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("agent index and referenced work instructions are bound even without a commit", async () => {
  const f = fixture();
  try {
    mkdirSync(join(f.framework, "agent-work/prompts"), { recursive: true });
    writeFileSync(join(f.framework, "agent-work/INDEX.md"), "Read prompts/task.md\n");
    writeFileSync(join(f.framework, "agent-work/prompts/task.md"), "Original scope\n");
    const first = await preparePreview(options(f));
    writeFileSync(join(f.framework, "agent-work/INDEX.md"), "New routing rule\n");
    const indexChanged = await preparePreview(options(f));
    assert.throws(() => checkPreview(indexChanged, first), /stale/);
    writeFileSync(join(f.framework, "agent-work/INDEX.md"), "Read prompts/task.md\n");
    writeFileSync(join(f.framework, "agent-work/prompts/task.md"), "Changed instruction\n");
    const promptChanged = await preparePreview(options(f));
    assert.throws(() => checkPreview(promptChanged, first), /stale/);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("registered IDs, unavailable children and global collisions stay unresolved", async () => {
  const f = fixture();
  try {
    const md = readFileSync(join(f.framework, "dependency.md"), "utf8").replace("| tdd |", "| test-helper |");
    writeFileSync(join(f.framework, "dependency.md"), md);
    mkdirSync(join(f.base, "globals/test-helper"), { recursive: true });
    const preview = await preparePreview({ ...options(f), proposal: { requiredChildren: ["missing-child"] } });
    assert.ok(preview.blockers.some(s => s.includes("already registered")));
    assert.ok(preview.blockers.some(s => s.includes("Global skill directory")));
    assert.ok(preview.blockers.some(s => s.includes("missing-child")));
    assert.equal(preview.readiness, "needs-human");
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("user-only runtime metadata cannot be turned into an adapter child", async () => {
  const f = fixture();
  try {
    writeFileSync(join(f.source, "skills/test-helper/SKILL.md"), "---\nname: test-helper\ndescription: User workflow\ndisable-model-invocation: true\n---\n");
    commitSource(f); f.record.invocation = "user";
    mkdirSync(join(f.framework, ".agents/skills/itp-implement"), { recursive: true });
    writeFileSync(join(f.framework, ".agents/skills/itp-implement/SKILL.md"), "# Existing fixture adapter\n");
    const preview = await preparePreview({ ...options(f), proposal: { role: "specialist", capability: "new capability", adapter: "itp-implement" } });
    assert.equal(preview.lockEntry.invocationClass, "user");
    assert.ok(preview.blockers.some(s => s.includes("cannot become an adapter child")));
    assert.equal(preview.inventoryRow, null);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("an explicit complete proposal prepares a row for review, never adoption", async () => {
  const f = fixture();
  try {
    mkdirSync(join(f.framework, ".agents/skills/itp-implement"), { recursive: true });
    writeFileSync(join(f.framework, ".agents/skills/itp-implement/SKILL.md"), "# Existing fixture adapter\n");
    const proposal = { capability: "new inspection capability", role: "primary", adapter: "itp-implement", requiredChildren: [], dependencyReviewConfirmed: true, licenseReviewConfirmed: true };
    const preview = await preparePreview({ ...options(f), proposal });
    assert.equal(preview.readiness, "ready-for-review");
    assert.equal(preview.inventoryRow, "| test-helper | acme/skills | model | installed-global | itp-implement |");
    assert.equal(JSON.parse(readFileSync(join(f.framework, "skills.lock.json"), "utf8")).skills.length, 0);
    assert.equal(existsSync(join(f.base, "globals/test-helper")), false);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("malformed policy types and incomplete user handoffs cannot be review-ready", async () => {
  const f = fixture();
  try {
    const malformed = { capability: "test", role: "specialist", adapter: ["itp-implement"], trigger: {}, nonTrigger: 4, licenseReviewConfirmed: true, dependencyReviewConfirmed: true };
    await assert.rejects(preparePreview({ ...options(f), proposal: malformed }), /proposal/);
    const modelUserRole = await preparePreview({ ...options(f), proposal: { capability: "test", role: "user-entry", licenseReviewConfirmed: true, dependencyReviewConfirmed: true } });
    assert.equal(modelUserRole.readiness, "needs-human");
    assert.ok(modelUserRole.blockers.some(s => s.includes("handoff")));
    assert.equal(modelUserRole.inventoryRow, null);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("preview outputs do not overwrite existing artifacts", async () => {
  const f = fixture();
  try {
    const preview = await preparePreview(options(f)), output = join(f.base, "output");
    writePreview(preview, output, f.framework);
    const before = readFileSync(join(output, "manifest.json"), "utf8");
    assert.throws(() => writePreview(preview, output, f.framework), /not overwritten/);
    assert.equal(readFileSync(join(output, "manifest.json"), "utf8"), before);
    assert.throws(() => writePreview(preview, join(f.framework, ".agents/previews"), f.framework), /protected/);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("CLI writes and rechecks a preview using cached fixture data and simulated GitHub HTTP", () => {
  const f = fixture();
  try {
    const cache = join(f.base, "cache"), cached = join(cache, `acme__skills@${f.revision}`), output = join(f.base, "cli-output");
    mkdirSync(cache); renameSync(f.source, cached); f.source = cached;
    const state = join(f.base, "state.json"), preload = join(f.base, "http.mjs");
    writeFileSync(state, JSON.stringify(f.state));
    writeFileSync(preload, `const routes=${JSON.stringify(apiRoutes(f))};globalThis.fetch=async(url)=>{const u=new URL(url);if(u.hostname!=='api.github.com'||!routes[u.pathname+u.search])throw new Error('unexpected network');return new Response(JSON.stringify(routes[u.pathname+u.search]),{headers:{'content-type':'application/json'}})};`);
    const run = (...args) => execFileSync(process.execPath, ["--import", preload, "scripts/adopt-skill.mjs", "--state", state, "--candidate", f.key, "--cache", cache, ...args], {
      cwd: ROOT, encoding: "utf8", env: { ...process.env, GH_TOKEN: "fixture-token", GITHUB_TOKEN: "fixture-token" },
    });
    assert.match(run("--output", output), /Registry\/global skills unchanged/);
    const manifestPath = join(output, "manifest.json"), manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    assert.match(run("--check-preview", manifestPath, "--expected-binding", manifest.binding), /binding matches/);
    assert.equal(existsSync(join(cached, "outside.txt")), false);
    assert.equal(git(f.source, "status", "--porcelain").trim(), "");
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});
