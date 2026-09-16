#!/usr/bin/env node
// Static contract check for the idea-to-production skill graph.
// Behavioral tests live in the sibling fixture files; this only checks the graph is coherent.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirHash } from "../../scripts/skill-hash.mjs";

const defaultRoot = fileURLToPath(new URL("../../", import.meta.url));
const root = process.argv[2] ? resolve(process.argv[2]) : defaultRoot;
const skillsDir = join(root, ".agents", "skills");
const failures = [];
const checks = [];

const ok = (msg) => checks.push(`ok   ${msg}`);
const fail = (msg) => failures.push(`FAIL ${msg}`);

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : "";
}

function inventory() {
  const dep = readFileSync(join(root, "dependency.md"), "utf8");
  const rows = new Map();
  for (const line of dep.split("\n")) {
    if (!line.startsWith("|")) continue;
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 6) continue;
    const [, id, source, invocationClass, status] = cells;
    if (!id || id === "Skill ID" || id.startsWith("---")) continue;
    rows.set(id, { source, invocationClass, status });
  }
  return rows;
}

const deps = inventory();
if (deps.size === 0) fail("dependency.md inventory table parsed empty");

const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

const seenNames = new Map();
for (const dir of skillDirs) {
  const file = join(skillsDir, dir, "SKILL.md");
  if (!existsSync(file)) {
    fail(`${dir}: missing SKILL.md`);
    continue;
  }
  const text = readFileSync(file, "utf8");
  const fm = frontmatter(text);
  const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (!name) fail(`${dir}: frontmatter missing name`);
  else if (name !== dir) fail(`${dir}: frontmatter name "${name}" != directory name`);
  else ok(`${dir}: name matches directory`);
  if (name) {
    if (seenNames.has(name)) fail(`duplicate skill name "${name}" in ${dir} and ${seenNames.get(name)}`);
    else seenNames.set(name, dir);
  }
  if (!/^description:/m.test(fm)) fail(`${dir}: frontmatter missing description`);

  if (!dir.startsWith("itp-")) continue;

  const contract = text.match(/adapter_contract:[\s\S]*?```/);
  if (!contract) {
    fail(`${dir}: no adapter_contract block`);
    continue;
  }
  const c = contract[0];
  const id = c.match(/^\s*id:\s*(\S+)/m)?.[1];
  if (id !== name) fail(`${dir}: contract id "${id}" != name "${name}"`);

  for (const [key, required] of [
    ["required_children", true],
    ["conditional_children", false],
  ]) {
    const list = c.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`))?.[1] ?? "";
    for (const child of list.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (child.startsWith("itp-")) {
        fail(`${dir}: ${key} entry "${child}" is an adapter, not an upstream skill`);
        continue;
      }
      const entry = deps.get(child);
      if (!entry) {
        fail(`${dir}: unknown ${key} entry "${child}" (not in dependency.md)`);
        continue;
      }
      if (entry.invocationClass === "user") {
        fail(`${dir}: ${key} entry "${child}" is user-entry and must never load recursively`);
        continue;
      }
      const pinned = entry.status === "installed-global" || entry.status === "vendored-pinned";
      if (required && !pinned) {
        fail(`${dir}: required child "${child}" is ${entry.status}`);
      } else {
        ok(`${dir}: ${key} "${child}" (${entry.status})`);
      }
    }
  }
}

const lock = JSON.parse(readFileSync(join(root, "skills.lock.json"), "utf8"));
const locked = new Map(lock.skills.map((s) => [s.id, s]));
for (const s of lock.skills) {
  if (!/^[0-9a-f]{40}$/.test(s.commit)) fail(`lock: ${s.id} commit is not a 40-char sha`);
  if (!/^[0-9a-f]{64}$/.test(s.contentSha256)) fail(`lock: ${s.id} contentSha256 is not sha256`);
  if (!deps.has(s.id)) fail(`lock: ${s.id} not in dependency.md inventory`);
}
for (const [id, entry] of deps) {
  const pinned = entry.status === "installed-global" || entry.status === "vendored-pinned";
  if (pinned && !locked.has(id)) fail(`dependency "${id}" is ${entry.status} but not in skills.lock.json`);
  if (!pinned && locked.has(id)) fail(`dependency "${id}" is ${entry.status} but has a lock entry`);
}
ok(`lockfile: ${lock.skills.length} pinned skills consistent with dependency.md`);

for (const [id, lockEntry] of locked) {
  if (!lockEntry.vendored) continue;
  const dir = join(root, ".agents", "skills", id);
  if (!existsSync(dir)) fail(`vendored "${id}" missing at ${dir}`);
  else if (dirHash(dir) !== lockEntry.contentSha256) {
    fail(`vendored "${id}" content hash differs from skills.lock.json`);
  } else {
    ok(`vendored "${id}" hash verified`);
  }
}

const rootSkill = readFileSync(join(skillsDir, "idea-to-production", "SKILL.md"), "utf8");
if (!/invocation-class:\s*user/.test(frontmatter(rootSkill))) fail("root skill is not invocation-class: user");
else ok("root skill is user-entry");

console.log(checks.join("\n"));
if (failures.length) {
  console.error(`\n${failures.join("\n")}\n\n${failures.length} contract failure(s)`);
  process.exit(1);
}
console.log(`\nAll contract checks passed (${checks.length}).`);
