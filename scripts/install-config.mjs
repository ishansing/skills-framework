#!/usr/bin/env node
// Project metadata/defaults shared by menu and scripted installs. No npm dependency.
import { readFileSync, writeFileSync, existsSync, lstatSync, readdirSync, mkdirSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join, dirname, relative, parse as parsePath } from "node:path";
import { homedir } from "node:os";
import { pathToFileURL } from "node:url";
import { buildRegistry } from "./generate-dependency-json.mjs";
import { dirHash } from "./skill-hash.mjs";

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
export function safePath(path) {
  const absolute = resolve(path); let part = parsePath(absolute).root;
  for (const name of relative(part, absolute).split("/")) {
    part = join(part, name);
    try { if (lstatSync(part).isSymbolicLink()) throw new Error(`symlink install path rejected: ${part}`); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
  }
}
export function verifySkill(directory, expected) {
  safePath(directory);
  function walk(path) {
    const info = lstatSync(path);
    if (info.isSymbolicLink() || !info.isDirectory() && !info.isFile()) throw new Error("skill links/special entries rejected");
    if (info.isDirectory()) for (const name of readdirSync(path)) walk(join(path, name));
  }
  walk(directory);
  if (dirHash(directory) !== expected) throw new Error("skill content hash differs from pin/staging expectation");
}
export function projectConfig(source, target, scope, checkpoints = "", apply = false) {
  source = resolve(source); target = resolve(target);
  if (!["global", "repo"].includes(scope) || !["", "off", "phase", "slice"].includes(checkpoints)) throw new Error("invalid installation defaults");
  if (target === parsePath(target).root || target === homedir()) throw new Error("select a project directory, not filesystem/home root");
  if (source === target) { if (scope === "repo") throw new Error("repo scope cannot rewrite the framework checkout's authoritative registry"); return; }
  for (const path of [target, join(target, ".agents/skills"), join(target, ".opencode/agents"), join(target, ".itp/run.md"), join(target, ".itp/install.json"), join(target, "AGENTS.md"), join(homedir(), ".agents/skills")]) safePath(path);
  const lock = JSON.parse(readFileSync(join(source, "skills.lock.json"), "utf8"));
  const managedSkills = { ...Object.fromEntries(readdirSync(join(source, ".agents/skills"), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => [e.name, dirHash(join(source, ".agents/skills", e.name))])),
    ...Object.fromEntries(lock.skills.filter(s => !s.vendored).map(s => [s.id, s.contentSha256])) };
  for (const id of Object.keys(managedSkills)) {
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error("unsafe managed skill ID");
    safePath(join(target, ".agents/skills", id));
    safePath(join(homedir(), ".agents/skills", id));
  }
  const recordPath = join(target, ".itp/install.json");
  let previous = {};
  if (existsSync(recordPath)) { previous = JSON.parse(readFileSync(recordPath)); if (previous.version !== 1) throw new Error("unknown installation record format"); }
  const removeLocal = [];
  if (scope === "global") for (const entry of lock.skills.filter(s => !s.vendored)) {
    const directory = join(target, ".agents/skills", entry.id);
    if (!existsSync(directory)) continue;
    if (previous.scope !== "repo" || !previous.managedSkills?.[entry.id]) throw new Error(`repo-local ${entry.id} has no managed ownership; review the duplicate before global install`);
    verifySkill(directory, previous.managedSkills[entry.id]);
    removeLocal.push(entry);
  }
  const locked = new Set(lock.skills.filter(s => !s.vendored).map(s => s.id));
  const dep = readFileSync(join(source, "dependency.md"), "utf8").split("\n").map(line => {
    if (!line.startsWith("|")) return line;
    const cells = line.split("|");
    if (locked.has(cells[1]?.trim()) && ["installed-global", "installed-local"].includes(cells[4]?.trim())) cells[4] = ` ${scope === "repo" ? "installed-local" : "installed-global"} `;
    return cells.join("|");
  }).join("\n");
  const desired = { "dependency.md": dep, "dependency.json": JSON.stringify(buildRegistry(dep), null, 2) + "\n", "skills.lock.json": readFileSync(join(source, "skills.lock.json"), "utf8") };
  const agent = ".opencode/agents/adversarial-modeler.md";
  if (existsSync(join(source, agent))) desired[agent] = readFileSync(join(source, agent), "utf8");
  for (const [name, contents] of Object.entries(desired)) {
    const path = join(target, name); safePath(path);
    if (existsSync(path)) {
      const actual = hash(readFileSync(path));
      if (actual !== hash(contents) && actual !== previous.managedFiles?.[name]) throw new Error(`existing ${name} differs from managed/package content; back it up before proceeding`);
    }
  }
  const agents = join(target, "AGENTS.md");
  if (existsSync(agents)) {
    const text = readFileSync(agents, "utf8"), begin = "<!-- idea-to-production:begin -->", end = "<!-- idea-to-production:end -->";
    const count = token => text.split(token).length - 1;
    if (count(begin) || count(end)) if (count(begin) !== 1 || count(end) !== 1 || text.indexOf(end) < text.indexOf(begin) || !text.split(/\r?\n/).includes(begin) || !text.split(/\r?\n/).includes(end)) throw new Error("malformed managed AGENTS block; refusing to drop user content");
  }
  if (!apply) return;
  for (const entry of removeLocal) verifySkill(join(homedir(), ".agents/skills", entry.id), entry.contentSha256);
  for (const entry of removeLocal) rmSync(join(target, ".agents/skills", entry.id), { recursive: true });
  mkdirSync(join(target, ".itp"), { recursive: true });
  for (const [name, contents] of Object.entries(desired)) { mkdirSync(dirname(join(target, name)), { recursive: true }); writeFileSync(join(target, name), contents); }
  const ledger = join(target, ".itp/run.md");
  if (checkpoints && !existsSync(ledger)) writeFileSync(ledger, `# Installation preference, not a completed lifecycle. Root sets goal and scale.\nrun:\n  goal: null\n  checkpoints: ${checkpoints === "off" ? "false" : checkpoints}\n  next_phase: research\n  completed: []\n  artifacts: {}\n  loaded_skills: []\n  open_questions: []\n`, { flag: "wx" });
  for (const dir of readdirSync(join(source, ".agents/skills"), { withFileTypes: true }).filter(e => e.isDirectory())) managedSkills[dir.name] = dirHash(join(target, ".agents/skills", dir.name));
  writeFileSync(recordPath, JSON.stringify({ version: 1, frameworkVersion: readFileSync(join(source, "VERSION"), "utf8").trim(), scope,
    managedSkills, managedFiles: Object.fromEntries(Object.entries(desired).map(([name, bytes]) => [name, hash(bytes)])) }, null, 2) + "\n");
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [mode, source, target, scope, checkpoints = ""] = process.argv.slice(2);
    if (!["--preflight", "--apply", "--safe-path", "--verify-skill"].includes(mode)) throw new Error("invalid metadata command");
    if (mode === "--safe-path") safePath(source);
    else if (mode === "--verify-skill") verifySkill(source, target);
    else projectConfig(source, target, scope, checkpoints, mode === "--apply");
  } catch (error) { console.error(`install metadata: ${error.message}`); process.exitCode = 1; }
}
