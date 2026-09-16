#!/usr/bin/env node
// Markdown release notes: framework version plus the pinned upstream table.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const lock = JSON.parse(readFileSync(join(ROOT, "skills.lock.json"), "utf8"));
const version = readFileSync(join(ROOT, "VERSION"), "utf8").trim();

console.log(`Idea-to-Production framework v${version}`);
console.log("");
console.log(`Pinned upstream content (${lock.skills.length} skills) at release time:`);
console.log("");
console.log("| Skill | Repo | Commit |");
console.log("|---|---|---|");
for (const skill of lock.skills) {
  console.log(`| ${skill.id} | ${skill.repo} | \`${skill.commit.slice(0, 12)}\` |`);
}
console.log("");
console.log("Install or upgrade a project with `bash install.sh <project>` (see README).");
