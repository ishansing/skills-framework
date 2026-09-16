#!/usr/bin/env node
// Report upstream drift for every pinned skill in skills.lock.json.
//
// Usage: node scripts/check-upstream.mjs [--json] [--report-dir DIR]
// Exit codes: 0 all current; 3 updates or drift detected; 1 fatal (API/file error).

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));

export function loadLock(root = ROOT) {
  return JSON.parse(readFileSync(join(root, "skills.lock.json"), "utf8"));
}

function githubToken() {
  for (const key of ["GITHUB_TOKEN", "GH_TOKEN"]) {
    if (process.env[key]) return process.env[key];
  }
  try {
    return execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const TOKEN = githubToken();

async function api(path) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "idea-to-production-upstream-check",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (res.status === 404) return { notFound: true };
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path}`);
  return res.json();
}

const branches = new Map();

async function defaultBranch(repo) {
  if (!branches.has(repo)) {
    const info = await api(`/repos/${repo}`);
    branches.set(repo, info.default_branch);
  }
  return branches.get(repo);
}

function sourcePath(entry) {
  return entry.updateMode === "vendor-file" ? entry.sourcePath : entry.path;
}

function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function checkEntry(entry) {
  const base = { id: entry.id, repo: entry.repo, pinned: entry.commit, latest: null };
  try {
    const branch = await defaultBranch(entry.repo);
    const path = sourcePath(entry);
    const commits = await api(
      `/repos/${entry.repo}/commits?path=${encodeURIComponent(path)}&sha=${branch}&per_page=1`
    );
    if (!Array.isArray(commits)) throw new Error(`unexpected commits response for ${entry.id}`);
    const latest = commits[0]?.sha ?? null;
    base.latest = latest;
    if (!latest) {
      return { ...base, status: "drift", note: "path has no commits on the default branch" };
    }
    if (latest === entry.commit) return { ...base, status: "current" };

    const compare = await api(`/repos/${entry.repo}/compare/${entry.commit}...${latest}`);
    if (compare.notFound) {
      return { ...base, status: "unverifiable", note: "pinned commit not found upstream (history rewrite?)" };
    }
    const aheadBy = compare.ahead_by ?? 0;
    if (aheadBy === 0) {
      // The pin already contains the latest change to this path (the pin is a newer
      // repo-wide commit), so the skill content is current.
      return { ...base, status: "current", note: "pin already contains the latest path change" };
    }
    const contents = await api(`/repos/${entry.repo}/contents/${encodePath(path)}?ref=${branch}`);
    if (contents.notFound) {
      return { ...base, status: "drift", note: "path missing at HEAD (renamed or removed)" };
    }
    const lastCommit = compare.commits?.[compare.commits.length - 1];
    return {
      ...base,
      status: "updated",
      aheadBy,
      changedFiles: Array.isArray(compare.files) ? compare.files.length : null,
      note: lastCommit?.commit?.message?.split("\n")[0] ?? "",
    };
  } catch (err) {
    return { ...base, status: "error", note: err.message };
  }
}

export async function checkAll(root = ROOT) {
  const lock = loadLock(root);
  const results = [];
  for (const entry of lock.skills) results.push(await checkEntry(entry));
  return results;
}

function markdown(results) {
  const lines = [
    "| Skill | Status | Pinned | Latest | Ahead | Note |",
    "|---|---|---|---|---|---|",
  ];
  for (const r of results) {
    lines.push(
      `| ${r.id} | ${r.status} | ${r.pinned.slice(0, 12)} | ${r.latest ? r.latest.slice(0, 12) : "-"} | ${r.aheadBy ?? "-"} | ${r.note ?? ""} |`
    );
  }
  const counts = results.reduce((acc, r) => ((acc[r.status] = (acc[r.status] ?? 0) + 1), acc), {});
  lines.push("", Object.entries(counts).map(([status, n]) => `${n} ${status}`).join(", "));
  return lines.join("\n");
}

function exitCode(results) {
  if (results.some((r) => r.status === "error")) return 1;
  return results.every((r) => r.status === "current") ? 0 : 3;
}

async function main() {
  const args = process.argv.slice(2);
  let reportDir = null;
  let json = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--json") json = true;
    else if (args[i] === "--report-dir") reportDir = args[++i];
    else {
      console.error(`unknown option: ${args[i]}`);
      process.exit(2);
    }
  }
  const results = await checkAll();
  const code = exitCode(results);
  if (reportDir) {
    writeFileSync(join(reportDir, "report.json"), JSON.stringify({ results, exitCode: code }, null, 2) + "\n");
    writeFileSync(join(reportDir, "report.md"), markdown(results) + "\n");
  } else if (json) {
    console.log(JSON.stringify({ results, exitCode: code }, null, 2));
  } else {
    console.log(markdown(results));
  }
  process.exit(code);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(`check-upstream: ${err.message}`);
    process.exit(1);
  });
}
