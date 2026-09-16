#!/usr/bin/env node
// Fetch a repo at an exact commit into the shared cache used by install.sh and repin.
// Prints the cache directory (absolute) on success.
// Cache layout: <XDG_CACHE_HOME|~/.cache>/idea-to-production/<owner>__<repo>@<commit>

import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export function cacheRoot() {
  return join(process.env.XDG_CACHE_HOME || join(homedir(), ".cache"), "idea-to-production");
}

export function fetchSkill(repo, commit) {
  if (!repo || !commit) throw new Error("fetchSkill: repo and commit are required");
  const dir = join(cacheRoot(), `${repo.replaceAll("/", "__")}@${commit}`);
  const git = (...args) =>
    execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  try {
    if (!existsSync(join(dir, ".git"))) {
      mkdirSync(dir, { recursive: true });
      execFileSync("git", ["-C", dir, "init", "-q"]);
      git("remote", "add", "origin", `https://github.com/${repo}`);
      git("config", "remote.origin.promisor", "true");
      git("config", "remote.origin.partialclonefilter", "blob:none");
    }
    let head = "";
    try {
      head = git("rev-parse", "HEAD").trim();
    } catch {
      // fresh repository, no HEAD yet
    }
    if (head !== commit) {
      git("fetch", "-q", "--depth", "1", "--filter=blob:none", "origin", commit);
      git("checkout", "-q", "--force", "FETCH_HEAD");
    }
    return dir;
  } catch (err) {
    const detail = (err.stderr || "").toString().trim() || err.message;
    throw new Error(`fetch ${repo}@${commit} failed: ${detail}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [repo, commit] = process.argv.slice(2);
  if (!repo || !commit) {
    console.error("usage: fetch-skill.mjs <owner/repo> <commit>");
    process.exit(2);
  }
  try {
    process.stdout.write(fetchSkill(repo, commit));
  } catch (err) {
    console.error(`fetch-skill: ${err.message}`);
    process.exit(1);
  }
}
