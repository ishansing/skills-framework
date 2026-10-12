#!/usr/bin/env node
import { cpSync, existsSync, lstatSync, readdirSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fetchSkill } from "./fetch-skill.mjs";
import { dirHash } from "./skill-hash.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const sha = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");
function files(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name), info = lstatSync(path);
    if (info.isSymbolicLink() || !info.isFile() && !info.isDirectory()) throw new Error(`unsupported distribution entry: ${path}`);
    return info.isDirectory() ? files(path) : [path];
  });
}
export function verifyDistribution(root) {
  const present = files(root);
  const manifest = JSON.parse(readFileSync(join(root, "distribution.json"), "utf8"));
  if (manifest.version !== 1 || !manifest.files || manifest.frameworkVersion !== readFileSync(join(root, "VERSION"), "utf8").trim()) throw new Error("invalid distribution manifest");
  for (const [path, expected] of Object.entries(manifest.files)) {
    if (path.startsWith("/") || path.split("/").some(p => !p || p === ".." || p === ".")) throw new Error("unsafe distribution path");
    if (!existsSync(join(root, path)) || sha(join(root, path)) !== expected) throw new Error(`distribution integrity mismatch: ${path}`);
  }
  for (const path of present) if (relative(root, path) !== "distribution.json" && !manifest.files[relative(root, path)]) throw new Error("unexpected distribution file");
  return manifest;
}
export async function buildDistribution({ root = ROOT, output, fetchRepository = fetchSkill }) {
  const version = readFileSync(join(root, "VERSION"), "utf8").trim();
  if (!/^\d+\.\d+\.\d+$/.test(version) || !output) throw new Error("valid VERSION and output directory required");
  const archiveName = `idea-to-production-v${version}.tar.gz`;
  mkdirSync(output, { recursive: true });
  for (const name of [archiveName, "SHA256SUMS", "bootstrap.sh"]) if (existsSync(join(output, name))) throw new Error(`release asset already exists: ${name}`);
  const stage = mkdtempSync(join(tmpdir(), "itp-release-")), bundle = join(stage, "idea-to-production");
  mkdirSync(bundle);
  try {
    const scripts = ["skill-hash.mjs", "generate-dependency-json.mjs", "fetch-skill.mjs", "check-framework-version.mjs", "install-config.mjs", "build-install-bundle.mjs"];
    const paths = ["install.sh", "VERSION", "LICENSE", "README.md", "dependency.md", "dependency.json", "skills.lock.json", ".agents/skills", "tests/skills/check-contracts.mjs", ...scripts.map(s => `scripts/${s}`)];
    if (existsSync(join(root, ".opencode/agents"))) paths.push(".opencode/agents");
    for (const path of paths) {
      const source = join(root, path);
      if (lstatSync(source).isDirectory()) files(source);
      else if (!lstatSync(source).isFile()) throw new Error(`invalid release source ${path}`);
      cpSync(source, join(bundle, path), { recursive: true });
    }
    const lock = JSON.parse(readFileSync(join(root, "skills.lock.json"), "utf8"));
    for (const entry of lock.skills) {
      if (entry.vendored) {
        if (dirHash(join(bundle, ".agents/skills", entry.id)) !== entry.contentSha256) throw new Error(`vendored hash mismatch: ${entry.id}`);
        continue;
      }
      if (!/^[a-z0-9-]+$/.test(entry.id) || !/^[\w.-]+\/[\w.-]+$/.test(entry.repo) || !/^[a-f0-9]{40}$/.test(entry.commit) || entry.path.startsWith("/") || entry.path.split("/").some(p => !p || p === "..")) throw new Error("invalid lock entry for packaging");
      const cache = await fetchRepository(entry.repo, entry.commit), source = join(cache, entry.path);
      files(source);
      if (dirHash(source) !== entry.contentSha256) throw new Error(`upstream hash mismatch: ${entry.id}`);
      cpSync(source, join(bundle, "upstream", entry.id), { recursive: true });
    }
    const manifest = { version: 1, frameworkVersion: version, files: Object.fromEntries(files(bundle).sort().map(path => [relative(bundle, path), sha(path)])) };
    writeFileSync(join(bundle, "distribution.json"), JSON.stringify(manifest, null, 2) + "\n");
    verifyDistribution(bundle);
    execFileSync("tar", ["czf", join(resolve(output), archiveName), "-C", stage, "idea-to-production"], { timeout: 120_000 });
    cpSync(join(root, "bootstrap.sh"), join(output, "bootstrap.sh"));
    writeFileSync(join(output, "SHA256SUMS"), `${sha(join(output, archiveName))}  ${archiveName}\n${sha(join(output, "bootstrap.sh"))}  bootstrap.sh\n`);
    return { version, archive: join(resolve(output), archiveName), skills: lock.skills.length };
  } finally { rmSync(stage, { recursive: true, force: true }); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv[2] === "--verify") { verifyDistribution(resolve(process.argv[3])); console.log("Distribution integrity verified."); }
  else buildDistribution({ output: process.argv[2] && resolve(process.argv[2]) }).then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
