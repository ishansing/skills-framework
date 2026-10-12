#!/usr/bin/env node
// Maintenance preview only: inspect committed data; never invoke/install/adopt a skill.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { resolve, join, dirname, relative, parse as parsePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse as parseYAML } from "yaml";
import { fetchSkill, cacheRoot } from "./fetch-skill.mjs";
import { dirHash } from "./skill-hash.mjs";
import { buildRegistry } from "./generate-dependency-json.mjs";
import { createClient } from "./skill-watch.mjs";
import { githubToken } from "./check-upstream.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => Array.isArray(value) ? value.map(canonical) : value && typeof value === "object" ?
  Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical(value[k])])) : value;
const fingerprint = (value) => hash(JSON.stringify(canonical(value)));
const safeText = (value) => String(value ?? "").replace(/@/g, "&#64;").replace(/[\\`*_{}\[\]()<>!|#]/g, "\\$&").replace(/[\r\n]+/g, " ").slice(0, 1500);

function inspectionEnv() {
  const env = Object.fromEntries(["PATH", "LANG", "LC_ALL", "HTTPS_PROXY", "HTTP_PROXY", "NO_PROXY", "SSL_CERT_FILE", "SSL_CERT_DIR"].filter((k) => process.env[k]).map((k) => [k, process.env[k]]));
  const settings = { "core.hooksPath": "/dev/null", "core.fsmonitor": "false", "core.attributesFile": "/dev/null", "credential.helper": "", "protocol.ext.allow": "never", "protocol.file.allow": "never", "submodule.recurse": "false" };
  Object.assign(env, { HOME: tmpdir(), GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null", GIT_TERMINAL_PROMPT: "0", GIT_LFS_SKIP_SMUDGE: "1", GIT_CONFIG_COUNT: String(Object.keys(settings).length) });
  Object.entries(settings).forEach(([key, value], i) => { env[`GIT_CONFIG_KEY_${i}`] = key; env[`GIT_CONFIG_VALUE_${i}`] = value; });
  return env;
}
const git = (dir, args, binary = false) => execFileSync("git", ["-C", dir, ...args], {
  env: inspectionEnv(), timeout: 60_000, encoding: binary ? undefined : "utf8", maxBuffer: 12_000_000, stdio: ["ignore", "pipe", "pipe"],
});
function noSymlinks(path) {
  const absolute = resolve(path), parts = relative(parsePath(absolute).root, absolute).split("/");
  let current = parsePath(absolute).root;
  for (const part of parts) {
    current = join(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new Error("symlinked inspection/output path rejected");
  }
}
function repositoryClean(dir, repo, revision, allowUnborn = false) {
  noSymlinks(dir);
  if (!lstatSync(join(dir, ".git")).isDirectory()) throw new Error("inspection cache must be a standalone Git repository");
  const origin = git(dir, ["remote", "get-url", "origin"]).trim().replace(/\.git$/, "").replace(/\/$/, "");
  if (origin.toLowerCase() !== `https://github.com/${repo}`.toLowerCase()) throw new Error("cached repository origin differs from candidate");
  if (git(dir, ["remote"]).trim() !== "origin") throw new Error("inspection cache has unexpected additional remotes");
  try {
    git(dir, ["config", "--local", "--includes", "--name-only", "--get-regexp", "^(filter\\.|include\\.|core\\.hookspath$|core\\.sshcommand$|credential\\.|protocol\\.)"]);
    throw new Error("local Git execution/credential/protocol configuration is not permitted during inspection");
  } catch (error) { if (error.status !== 1) throw error; }
  if (git(dir, ["status", "--porcelain=v1", "--untracked-files=all", "--ignored", "--ignore-submodules=all"]).trim()) throw new Error("dirty or extra cache files; refusing to reset user content");
  let head;
  try { head = git(dir, ["rev-parse", "--verify", "HEAD"]).trim(); }
  catch (error) { if (!allowUnborn) throw error; }
  if (head && head !== revision) throw new Error("cache HEAD differs from selected revision");
}
function selectedRecord(state, key) {
  if (state.state) state = state.state; // Accept full report.json as well as next-state.json.
  if (state.version !== 1 || !state.sources) throw new Error("invalid watch snapshot");
  const records = Object.values(state.sources).map((s) => s.entries?.[key]).filter(Boolean);
  if (!records.length || records.some((r) => r.verified !== true)) throw new Error("candidate must be explicitly selected and primary verified");
  const project = (r) => ({ repo: r.repo, path: r.path, revision: r.revision, name: r.name, invocation: r.invocation, contentSha256: r.contentSha256 || null });
  if (new Set(records.map((r) => fingerprint(project(r)))).size !== 1) throw new Error("conflicting candidate observations; select a consistent snapshot");
  const record = project(records[0]), match = key.match(/^([1-9]\d*):(.+)$/);
  if (!match || match[2] !== record.path || !/^[\w.-]+\/[\w.-]+$/.test(record.repo) || record.repo.length > 255 ||
      !/^[a-f0-9]{40}$/.test(record.revision || "") || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.name || "") || record.name.length > 64 ||
      !["model", "user"].includes(record.invocation)) throw new Error("invalid candidate identity/revision");
  if (!/^[\w./-]+$/.test(record.path) || record.path.length > 1024 || record.path.split("/").some((p) => !p || p === "." || p === ".." || p === ".git") || !record.path.endsWith("/SKILL.md")) throw new Error("contained non-root literal SKILL.md bundle path required");
  return { ...record, repositoryId: Number(match[1]), key };
}
function frameworkBasis(root) {
  const files = ["dependency.md", "dependency.json", "skills.lock.json", "AGENTS.md", "SKILL-FRAMEWORK.md"];
  function routing(directory) {
    if (!existsSync(directory)) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name), rel = relative(root, path);
      if (rel === "agent-work/previews") continue;
      if (entry.isSymbolicLink()) throw new Error("framework routing symlink cannot be bound implicitly");
      if (entry.isDirectory()) routing(path);
      else if (entry.isFile()) files.push(rel);
    }
  }
  for (const folder of [".agents/skills", "agent-work", "docs/agents"]) routing(join(root, folder));
  return { head: git(root, ["rev-parse", "HEAD"]).trim(), files: Object.fromEntries([...new Set(files)].sort().map((f) => [f, existsSync(join(root, f)) ? hash(readFileSync(join(root, f))) : null])) };
}
function validateProposal(proposal) {
  if (!proposal || Array.isArray(proposal) || typeof proposal !== "object") throw new Error("proposal must be a JSON object");
  for (const field of ["capability", "role", "adapter", "trigger", "nonTrigger", "handoff", "resumeWith"]) {
    if (proposal[field] != null && (typeof proposal[field] !== "string" || !proposal[field].trim() || proposal[field].length > 2000)) throw new Error(`invalid proposal field ${field}`);
  }
  for (const field of ["dependencyReviewConfirmed", "licenseReviewConfirmed"]) if (proposal[field] != null && typeof proposal[field] !== "boolean") throw new Error(`invalid proposal field ${field}`);
  if (proposal.requiredChildren != null && (!Array.isArray(proposal.requiredChildren) || proposal.requiredChildren.length > 100 || proposal.requiredChildren.some(id => typeof id !== "string" || !/^[a-z0-9-]{1,64}$/.test(id)))) throw new Error("invalid proposal requiredChildren");
}
function inspectBundle(dir, record) {
  const bundlePath = dirname(record.path), bundle = join(dir, bundlePath);
  noSymlinks(bundle);
  const tree = git(dir, ["ls-tree", "-r", "-z", record.revision, "--", bundlePath]).split("\0").filter(Boolean).map((row) => {
    const [metadata, path] = row.split("\t");
    const [mode, type, sha] = metadata.split(" ");
    if (type !== "blob" || !["100644", "100755"].includes(mode) || !path.startsWith(`${bundlePath}/`)) throw new Error("symlink/submodule/special bundle entry rejected");
    return { mode, sha, path: path.slice(bundlePath.length + 1) };
  });
  if (!tree.length || tree.length > 500) throw new Error("bundle missing or file count exceeds inspection budget");
  const expected = new Set(tree.map((f) => f.path)), contents = new Map();
  let size = 0;
  function walk(current) {
    for (const file of readdirSync(current)) {
      const path = join(current, file), info = lstatSync(path);
      if (info.isSymbolicLink() || !info.isFile() && !info.isDirectory()) throw new Error("symlink/special file in bundle rejected");
      if (info.isDirectory()) walk(path);
      else if (!expected.has(relative(bundle, path))) throw new Error("extra/untracked bundle file rejected");
    }
  }
  walk(bundle);
  const snapshot = mkdtempSync(join(tmpdir(), "adopt-committed-"));
  try {
    for (const file of tree) {
      const bytes = git(dir, ["cat-file", "blob", file.sha], true);
      const objectHash = createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
      if (objectHash !== file.sha) throw new Error("cached Git blob does not match committed object identity");
      size += bytes.length;
      if (bytes.length > 2_000_000 || size > 10_000_000) throw new Error("bundle bytes exceed inspection budget");
      // LFS pointers are rejected before hashing: without smudge filters the pointer
      // bytes are not the real content, so they must never enter the directory hash.
      if (bytes.subarray(0, 60).toString("utf8").startsWith("version https://git-lfs.github.com/spec/v1\n")) throw new Error(`LFS pointer requires reviewed packaging: ${file.path}`);
      const path = join(bundle, file.path), info = lstatSync(path);
      if (!info.isFile() || !bytes.equals(readFileSync(path)) || !!(info.mode & 0o111) !== (file.mode === "100755")) throw new Error("cache bundle differs from committed bytes/mode");
      contents.set(file.path, bytes);
      const target = join(snapshot, file.path); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, bytes);
    }
    const directoryHash = dirHash(snapshot);
    if (dirHash(bundle) !== directoryHash) throw new Error("bundle changed while inspecting");
    return { directoryHash, files: tree, bytes: size, contents };
  } finally { rmSync(snapshot, { recursive: true, force: true }); }
}

async function materializationBudget(api, repo, record) {
  let tree = record.revision;
  for (const part of dirname(record.path).split("/")) {
    const response = await api(`/repos/${repo}/git/trees/${tree}`);
    if (response.truncated || !Array.isArray(response.tree)) throw new Error("incomplete primary tree; materialization not authorized");
    const folder = response.tree.find((e) => e.path === part && e.type === "tree");
    if (!folder || !/^[a-f0-9]{40}$/.test(folder.sha)) throw new Error("bundle directory is not a committed tree");
    tree = folder.sha;
  }
  const response = await api(`/repos/${repo}/git/trees/${tree}?recursive=1`);
  if (response.truncated || !Array.isArray(response.tree)) throw new Error("incomplete primary bundle tree");
  const files = response.tree.filter((e) => e.type !== "tree");
  if (!files.length || files.length > 500 || files.some((e) => e.type !== "blob" || !["100644", "100755"].includes(e.mode))) throw new Error("symlink/submodule or bundle file budget rejected before materialization");
  if (files.some((e) => !Number.isSafeInteger(e.size) || e.size < 0 || e.size > 2_000_000) || files.reduce((n, e) => n + e.size, 0) > 10_000_000) throw new Error("bundle materialization bytes exceed inspection budget");
  return files.map(({ path, mode, sha }) => ({ path, mode, sha }));
}

export async function preparePreview({ state, candidate, proposal = {}, root = ROOT, fetchRepository = fetchSkill,
  api = createClient({ token: githubToken() }).api, globalSkills = join(homedir(), ".agents/skills"), cache = join(cacheRoot(), "adoption-preview") }) {
  validateProposal(proposal);
  const record = selectedRecord(state, candidate), basis = frameworkBasis(root);
  const info = await api(`/repos/${record.repo}`);
  if (info.private !== false || info.id !== record.repositoryId || !/^[\w.-]+\/[\w.-]+$/.test(info.full_name || "")) throw new Error("candidate public repository identity mismatch");
  const association = await api(`/repos/${info.full_name}/commits/${record.revision}`);
  if (association.sha !== record.revision) throw new Error("selected commit is not verified in the source repository");
  const repo = info.full_name, cacheDir = join(cache, `${repo.replaceAll("/", "__")}@${record.revision}`);
  if (resolve(cache) === parsePath(resolve(cache)).root) throw new Error("inspection cache must not be a filesystem root");
  for (const protectedPath of [join(root, ".git"), join(root, ".agents"), join(root, ".opencode"), join(homedir(), ".agents")]) {
    if (within(cache, protectedPath)) throw new Error("inspection cache overlaps protected Git/skills content");
  }
  noSymlinks(cacheDir);
  if (existsSync(cacheDir)) {
    if (!lstatSync(cacheDir).isDirectory()) throw new Error("occupied non-Git cache path rejected");
    if (existsSync(join(cacheDir, ".git"))) repositoryClean(cacheDir, repo, record.revision, true);
    else if (readdirSync(cacheDir).length) throw new Error("occupied non-Git cache directory preserved; choose a clean cache");
  }
  const expectedFiles = await materializationBudget(api, repo, record);
  noSymlinks(join(cacheDir, ".git/info/sparse-checkout"));
  const dir = await fetchRepository(repo, record.revision, { env: inspectionEnv(), root: cache, sparsePath: dirname(record.path), timeout: 60_000 });
  repositoryClean(dir, repo, record.revision);
  const bundle = inspectBundle(dir, record), skill = bundle.contents.get("SKILL.md");
  const ordered = (files) => files.map(({ path, mode, sha }) => ({ path, mode, sha })).sort((a, b) => a.path.localeCompare(b.path));
  if (fingerprint(ordered(bundle.files)) !== fingerprint(ordered(expectedFiles))) throw new Error("materialized bundle differs from verified primary tree");
  if (!skill || skill.length > 150_000) throw new Error("SKILL.md missing or too large");
  const match = skill.toString("utf8").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("skill frontmatter missing");
  const fm = parseYAML(match[1], { maxAliasCount: 10, merge: false });
  if (fm?.name !== record.name || typeof fm.description !== "string") throw new Error("skill identity differs from watch record");
  if (record.contentSha256 && hash(skill) !== record.contentSha256) throw new Error("SKILL.md differs from observed content hash");
  const blockers = [], flags = [];
  if (fm["disable-model-invocation"] != null) {
    if (typeof fm["disable-model-invocation"] !== "boolean") throw new Error("invalid invocation metadata");
    flags.push(fm["disable-model-invocation"] ? "user" : "model");
  }
  const declaredClass = fm.metadata?.["invocation-class"];
  if (declaredClass) { if (!["model", "user"].includes(declaredClass)) throw new Error("invalid invocation class"); flags.push(declaredClass); }
  const codex = bundle.contents.get("agents/openai.yaml");
  if (codex) {
    const implicit = parseYAML(codex.toString("utf8"), { maxAliasCount: 10 })?.policy?.allow_implicit_invocation;
    if (implicit != null) { if (typeof implicit !== "boolean") throw new Error("invalid Codex invocation policy"); flags.push(implicit ? "model" : "user"); }
  }
  const invocation = flags.includes("user") ? "user" : "model";
  if (new Set(flags).size > 1 || invocation !== record.invocation) blockers.push("Invocation metadata conflicts with runtime/watch classification; resolve before adoption.");
  const registry = buildRegistry(readFileSync(join(root, "dependency.md"), "utf8"));
  const lock = JSON.parse(readFileSync(join(root, "skills.lock.json"), "utf8"));
  if (registry.skills[fm.name] || registry.user_entry.includes(fm.name) || lock.skills.some((s) => s.id === fm.name)) blockers.push("Skill ID already registered; use explicit update/replacement workflow.");
  if (existsSync(join(globalSkills, fm.name))) blockers.push("Global skill directory already exists; do not overwrite unrelated content.");
  if (fm.dependencies != null && !Array.isArray(fm.dependencies) || proposal.requiredChildren != null && !Array.isArray(proposal.requiredChildren)) throw new Error("child dependencies must be arrays");
  const required = [...new Set([...(fm.dependencies || []), ...(proposal.requiredChildren || [])])];
  if (required.some((id) => typeof id !== "string" || !/^[a-z0-9-]{1,64}$/.test(id))) throw new Error("invalid declared child dependency");
  for (const child of required) {
    const approved = registry.skills[child];
    if (!approved || !["installed-global", "vendored-pinned"].includes(approved.status) || !lock.skills.some((s) => s.id === child)) blockers.push(`Required child not approved/pinned: ${child}`);
    else if (approved.invocation_class === "user") blockers.push(`Required child is user-entry and cannot be invoked recursively: ${child}`);
  }
  if (!proposal.capability || typeof proposal.capability !== "string") blockers.push("Capability fit requires a reviewed proposal.");
  if (!["primary", "specialist", "user-entry"].includes(proposal.role)) blockers.push("Integration role requires a reviewed proposal.");
  if (invocation === "user" && proposal.role && proposal.role !== "user-entry") blockers.push("User-entry skill cannot become an adapter child.");
  if (proposal.role === "user-entry") {
    if (invocation !== "user") blockers.push("Model-invoked source is not a user-only workflow; role/class adaptation requires review.");
    if (!proposal.handoff || !/^itp-[a-z-]+$/.test(proposal.resumeWith || "") || !existsSync(join(root, `.agents/skills/${proposal.resumeWith}/SKILL.md`))) blockers.push("User-entry handoff and existing resume adapter must be explicitly supplied.");
  }
  if (proposal.role !== "user-entry" && (!/^itp-[a-z-]+$/.test(proposal.adapter || "") || !existsSync(join(root, `.agents/skills/${proposal.adapter}/SKILL.md`)))) blockers.push("Owning adapter must be explicitly selected and present.");
  if (proposal.role === "specialist" && (!proposal.trigger || !proposal.nonTrigger)) blockers.push("Specialist needs a positive trigger and non-trigger.");
  if (proposal.dependencyReviewConfirmed !== true) blockers.push("Whole-bundle child/tool dependency review remains required.");
  if (proposal.licenseReviewConfirmed !== true) blockers.push("License and redistribution packaging review remains required.");
  const references = [];
  for (const [file, bytes] of bundle.contents) {
    if (!file.endsWith(".md")) continue;
    for (const [, link] of bytes.toString("utf8").matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
      if (link.startsWith("#") || /^(?:https?|mailto):/i.test(link)) continue;
      let target;
      try { target = /^[a-z][a-z0-9+.-]*:/i.test(link) ? "invalid" : relative(join(dir, dirname(record.path)), resolve(join(dir, dirname(record.path), dirname(file)), decodeURIComponent(link.split("#")[0]))); }
      catch { target = "invalid"; }
      if (target.startsWith("../") || target === ".." || !bundle.contents.has(target)) references.push({ from: file, link, unresolved: true });
    }
  }
  if (references.length) blockers.push("Unresolved/outside-bundle inline file references require reviewed adaptation.");
  repositoryClean(dir, repo, record.revision);
  if (fingerprint(frameworkBasis(root)) !== fingerprint(basis)) throw new Error("framework changed while preparing preview");
  const lockEntry = { id: fm.name, repo, commit: record.revision, path: dirname(record.path), contentSha256: bundle.directoryHash, invocationClass: invocation };
  const manifest = { version: 1, candidate: record, proposal, framework: basis, lockEntry,
    readiness: blockers.length ? "needs-human" : "ready-for-review", blockers, bundle: { files: bundle.files, bytes: bundle.bytes, references },
    licenseDeclaration: typeof fm.license === "string" ? fm.license.slice(0, 512) : null,
    invocationEvidence: flags,
    inspection: "Committed regular-file bytes verified; inline Markdown reference inspection only. No skill instructions/scripts executed; not dependency or security approval.",
    inventoryRow: ["primary", "specialist", "user-entry"].includes(proposal.role) && typeof proposal.capability === "string" &&
      (invocation !== "user" || proposal.role === "user-entry") &&
      (proposal.role !== "user-entry" || invocation === "user" && proposal.handoff && /^itp-[a-z-]+$/.test(proposal.resumeWith || "") && existsSync(join(root, `.agents/skills/${proposal.resumeWith}/SKILL.md`))) &&
      (proposal.role === "user-entry" || /^itp-[a-z-]+$/.test(proposal.adapter || "") && existsSync(join(root, `.agents/skills/${proposal.adapter}/SKILL.md`))) ?
      `| ${fm.name} | ${repo} | ${invocation} | installed-global | ${proposal.role === "user-entry" ? "user entry only" : proposal.adapter || "pending owner"} |` : null };
  return { ...manifest, binding: fingerprint(manifest) };
}

export function checkPreview(current, recorded, expectedBinding = recorded.binding) {
  const { binding, ...payload } = recorded;
  if (!/^[a-f0-9]{64}$/.test(binding || "") || binding !== fingerprint(payload)) throw new Error("recorded preview was modified or is invalid");
  if (expectedBinding !== binding || current.binding !== binding) throw new Error("preview binding is stale; source/proposal/framework changed, review again");
  return true;
}

function inputJSON(path) {
  const bytes = readFileSync(path);
  if (bytes.length > 4_000_000) throw new Error("input JSON exceeds inspection budget");
  return JSON.parse(bytes.toString("utf8"));
}
function within(path, parent) { const rel = relative(resolve(parent), resolve(path)); return !rel || rel !== ".." && !rel.startsWith("../") && !rel.startsWith("/"); }
export function writePreview(preview, output, root = ROOT) {
  const target = resolve(output);
  noSymlinks(target);
  for (const protectedPath of [join(root, ".git"), join(root, ".agents"), join(root, ".opencode"), join(homedir(), ".agents"), cacheRoot()]) {
    if (within(target, protectedPath)) throw new Error("preview output overlaps protected Git/skills/cache content");
  }
  if (existsSync(target) && (!lstatSync(target).isDirectory() || readdirSync(target).length)) throw new Error("preview output must be a new or empty directory; existing artifacts are not overwritten");
  mkdirSync(target, { recursive: true });
  const markdown = [
    `# Adoption preview: ${safeText(preview.lockEntry.id)}`, "",
    "Inspection data only. This is not approval, installation, or executable agent instructions.", "",
    `Readiness: **${preview.readiness}**`, `Binding: \`${preview.binding}\``,
    `Source: ${safeText(preview.lockEntry.repo)} at \`${preview.lockEntry.commit}\``,
    `Bundle: \`${safeText(preview.lockEntry.path)}\`; ${preview.bundle.files.length} committed files, ${preview.bundle.bytes} bytes.`,
    "", "## Review required", ...preview.blockers.map((s) => `- ${safeText(s)}`),
    "", "## Proposed lock entry (not applied)", "```json", JSON.stringify(preview.lockEntry, null, 2), "```",
    "", "## Proposed inventory row (not applied)", preview.inventoryRow || "No row proposed until capability/role/owner are supplied.",
    "", "Source invocation/license evidence and policy proposal are in manifest.json; whole-bundle manual dependency and packaging review remain necessary.",
  ].join("\n") + "\n";
  writeFileSync(join(target, "manifest.json"), JSON.stringify(preview, null, 2) + "\n", { flag: "wx" });
  writeFileSync(join(target, "preview.md"), markdown, { flag: "wx" });
}

async function main() {
  const args = process.argv.slice(2), options = {};
  if (args.includes("--help")) {
    console.log("Usage: node scripts/adopt-skill.mjs --state PATH --candidate KEY [--proposal JSON] [--output DIR] [--cache DIR]\nRecheck: same inputs plus --check-preview MANIFEST [--expected-binding DIGEST]. Preview only; no install or registry edits.");
    return;
  }
  for (let i = 0; i < args.length; i++) {
    if (!["--state", "--candidate", "--proposal", "--output", "--cache", "--check-preview", "--expected-binding"].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith("--")) throw new Error(`invalid option/value: ${args[i]}`);
    options[args[i].slice(2)] = args[++i];
  }
  if (!options.state || !options.candidate) throw new Error("--state and --candidate are required; use --help");
  if (options["expected-binding"] && !options["check-preview"] || options.output && options["check-preview"]) throw new Error("conflicting preview/revalidation options");
  const preview = await preparePreview({ state: inputJSON(options.state), candidate: options.candidate,
    proposal: options.proposal ? inputJSON(options.proposal) : {}, ...(options.cache ? { cache: resolve(options.cache) } : {}) });
  if (options["check-preview"]) {
    checkPreview(preview, inputJSON(options["check-preview"]), options["expected-binding"]);
    console.log(`Preview binding matches: ${preview.binding}. No approval or installation performed.`);
  } else {
    const output = options.output || join(ROOT, "agent-work/previews", `${preview.lockEntry.id}-${preview.lockEntry.commit.slice(0, 12)}`);
    writePreview(preview, output);
    console.log(`Preview: ${output}\nBinding: ${preview.binding}\nReadiness: ${preview.readiness}; ${preview.blockers.length} unresolved inputs. Registry/global skills unchanged.`);
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(`adopt-skill: ${error.message}`); process.exitCode = 1; });
}
