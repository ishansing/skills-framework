#!/usr/bin/env node
// Re-pin pinned skills to newer upstream commits.
//
// Usage:
//   node scripts/repin.mjs --all [--dry-run]
//   node scripts/repin.mjs --id <skill> --commit <sha> [--dry-run]
//
// Exit codes: 0 done (or nothing to do); 1 validation/drift error, nothing written.
//
// All targets are fetched and validated before anything is written (all-or-nothing).
// Refuses renames: if an upstream skill's frontmatter name no longer matches its ID, stop.

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { checkAll } from "./check-upstream.mjs";
import { fetchSkill } from "./fetch-skill.mjs";
import { dirHash, readSkillName } from "./skill-hash.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const LOCAL_SKILLS = join(ROOT, ".agents", "skills");

function usage() {
  console.error("usage: repin.mjs --all | --id <skill> --commit <sha> [--dry-run]");
}

function parseArgs(argv) {
  const opts = { all: false, id: null, commit: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--all") opts.all = true;
    else if (arg === "--id") opts.id = argv[++i];
    else if (arg === "--commit") opts.commit = argv[++i];
    else if (arg === "--dry-run") opts.dryRun = true;
    else {
      console.error(`unknown option: ${arg}`);
      process.exit(2);
    }
  }
  if (!opts.all && !(opts.id && opts.commit)) {
    usage();
    process.exit(2);
  }
  return opts;
}

function statuses(root) {
  const dep = readFileSync(join(root, "dependency.md"), "utf8");
  const map = new Map();
  for (const line of dep.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 6) continue;
    const [, id, , , status] = cells;
    if (!id || id === "Skill ID" || id.startsWith("---")) continue;
    map.set(id, status);
  }
  return map;
}

export function assertSkillIdentity(entry, source) {
  if (entry.updateMode === "vendor-file") {
    if (!existsSync(source)) throw new Error(`${entry.id}: source has no ${entry.sourcePath}`);
    return;
  }
  const name = readSkillName(join(source, "SKILL.md"));
  if (name !== entry.id) {
    throw new Error(`${entry.id}: upstream skill name is "${name}"; rename/adaptation needed`);
  }
}

function stage(entry, commit) {
  const cacheDir = fetchSkill(entry.repo, commit);
  const source = entry.updateMode === "vendor-file"
    ? join(cacheDir, entry.sourcePath)
    : join(cacheDir, entry.path);
  if (!existsSync(source)) {
    const what = entry.updateMode === "vendor-file" ? entry.sourcePath : entry.path;
    throw new Error(`${entry.id}: ${entry.repo}@${commit.slice(0, 12)} has no ${what}`);
  }
  assertSkillIdentity(entry, source);
  return source;
}

function apply(entry, commit, source) {
  let hash;
  if (entry.updateMode === "vendor-file") {
    const localDir = join(ROOT, entry.path);
    mkdirSync(localDir, { recursive: true });
    cpSync(source, join(localDir, basename(entry.sourcePath)));
    hash = dirHash(localDir);
  } else if (entry.vendored) {
    const localDir = join(LOCAL_SKILLS, entry.id);
    rmSync(localDir, { recursive: true, force: true });
    cpSync(source, localDir, { recursive: true });
    hash = dirHash(localDir);
  } else {
    hash = dirHash(source);
  }
  return hash;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const lockPath = join(ROOT, "skills.lock.json");
  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  const deps = statuses(ROOT);
  const byId = new Map(lock.skills.map((s) => [s.id, s]));

  let targets;
  if (opts.all) {
    const results = await checkAll(ROOT);
    const blocking = results.filter((r) => ["drift", "unverifiable", "error"].includes(r.status));
    if (blocking.length) {
      console.error("Cannot re-pin; manual adaptation needed:");
      for (const b of blocking) console.error(`  ${b.id}: ${b.status}${b.note ? ` - ${b.note}` : ""}`);
      process.exit(1);
    }
    targets = results
      .filter((r) => r.status === "updated")
      .map((r) => ({ entry: byId.get(r.id), commit: r.latest }));
    if (targets.length === 0) {
      console.log("All pinned skills are current; nothing to re-pin.");
      return;
    }
  } else {
    const entry = byId.get(opts.id);
    if (!entry) {
      console.error(`unknown skill id: ${opts.id}`);
      process.exit(1);
    }
    targets = [{ entry, commit: opts.commit }];
  }

  const changes = [];
  for (const { entry, commit } of targets) {
    const status = deps.get(entry.id);
    if (status !== "installed-global" && status !== "vendored-pinned") {
      console.error(`${entry.id}: dependency.md status is "${status ?? "missing"}", refusing to re-pin`);
      process.exit(1);
    }
    if (commit === entry.commit) {
      console.log(`${entry.id}: already at ${commit.slice(0, 12)}`);
      continue;
    }
    changes.push({ entry, commit, source: stage(entry, commit) });
  }

  if (changes.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  for (const { entry, commit, source } of changes) {
    if (opts.dryRun) {
      console.log(`[dry-run] ${entry.id}: ${entry.commit.slice(0, 12)} -> ${commit.slice(0, 12)}`);
      continue;
    }
    const previous = { commit: entry.commit, hash: entry.contentSha256 };
    const hash = apply(entry, commit, source);
    entry.commit = commit;
    entry.contentSha256 = hash;
    console.log(
      `${entry.id}: ${previous.commit.slice(0, 12)} -> ${commit.slice(0, 12)} ` +
        `(${previous.hash.slice(0, 12)} -> ${hash.slice(0, 12)})`
    );
  }

  if (!opts.dryRun) {
    writeFileSync(lockPath, JSON.stringify(lock, null, 2) + "\n");
    console.log("\nskills.lock.json updated. Run `bash install.sh --refresh-upstream` to materialize global installs.");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(`repin: ${err.message}`);
    process.exit(1);
  });
}
