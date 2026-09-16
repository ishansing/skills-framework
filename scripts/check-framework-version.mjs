#!/usr/bin/env node
// Compare a local framework version with the latest GitHub release.
//
// Usage: node scripts/check-framework-version.mjs [local-version]
// Exit codes: 0 compared (current or newer available); 2 could not reach GitHub.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const local = (process.argv[2] || readFileSync(join(ROOT, "VERSION"), "utf8")).trim();

let response;
try {
  response = await fetch("https://api.github.com/repos/ishansing/skills-framework/releases/latest", {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "idea-to-production-version-check" },
  });
} catch (err) {
  console.error(`could not reach GitHub: ${err.message}`);
  process.exit(2);
}

if (response.status === 404) {
  console.log(`installed ${local}; no releases published yet`);
  process.exit(0);
}
if (!response.ok) {
  console.error(`GitHub returned ${response.status} ${response.statusText}`);
  process.exit(2);
}

const latest = ((await response.json()).tag_name ?? "").replace(/^v/, "");
if (!latest) {
  console.error("latest release has no tag name");
  process.exit(2);
}

if (latest === local) {
  console.log(`up to date (${local})`);
} else {
  console.log(`installed ${local}; newer release available: v${latest} - pull this repo and re-run install.sh`);
}
