#!/usr/bin/env node
// Content hash for a skill directory, matching skills.lock.json's contentHashMethod:
// sha256 over sorted (relative path + NUL + file bytes + NUL) for every file in the directory.
// Also used by install.sh, repin.mjs, and check-contracts consumers.

import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

export function dirHash(dir) {
  const files = [];
  (function walk(d) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile()) files.push(p);
    }
  })(dir);
  files.sort((a, b) => relative(dir, a).localeCompare(relative(dir, b)));
  const h = createHash("sha256");
  for (const f of files) {
    h.update(relative(dir, f));
    h.update("\0");
    h.update(readFileSync(f));
    h.update("\0");
  }
  return h.digest("hex");
}

export function skillName(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] || "";
  const value = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (!value) return null;
  if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1);
  return value.replace(/\s+#.*$/, "").trim();
}
export function readSkillName(skillFile) {
  return skillName(readFileSync(skillFile, "utf8"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dir = process.argv[2];
  if (!dir) {
    console.error("usage: skill-hash.mjs <skill-dir>");
    process.exit(2);
  }
  process.stdout.write(dirHash(dir));
}
