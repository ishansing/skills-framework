#!/usr/bin/env node
// Generate dependency.json from dependency.md (single source of truth stays human-readable).
// Usage: node scripts/generate-dependency-json.mjs
// check-contracts.mjs fails when the committed file drifts from this output.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function sectionLines(text, header) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.trim() === header);
  if (start === -1) return [];
  const out = [];
  let inTable = false;
  for (const line of lines.slice(start + 1)) {
    if (!line.startsWith("|")) {
      if (line.trim() === "" && !inTable) continue;
      break;
    }
    inTable = true;
    out.push(line);
  }
  return out;
}

function tableRows(text, header) {
  const rows = sectionLines(text, header)
    .map((l) => l.split("|").map((c) => c.trim()));
  // Drop markdown header + separator rows; keep data rows.
  return rows.filter((cells, i) => {
    if (cells.length < 3 || !cells[1]) return false;
    if (/^:?-+:?$/.test(cells[1])) return false; // separator row
    const next = rows[i + 1];
    if (next && next.length > 1 && /^:?-+:?$/.test(next[1] || "")) return false; // header row
    return true;
  });
}

function backticks(s) {
  return [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
}

export function buildRegistry(depText) {
  const capabilities = {};
  for (const cells of tableRows(depText, "## Capability map")) {
    capabilities[cells[1]] = backticks(cells[2]);
  }

  const skills = {};
  for (const cells of tableRows(depText, "## Upstream inventory")) {
    const [, id, source, invocationClass, status, usedBy] = cells;
    skills[id] = {
      source,
      invocation_class: invocationClass,
      status,
      used_by: usedBy.split(",").map((s) => s.trim()).filter(Boolean),
    };
  }

  const triggers = {};
  for (const cells of tableRows(depText, "## Conditional specialist triggers")) {
    triggers[cells[1]] = cells[2];
  }

  const lines = depText.split("\n");
  const start = lines.findIndex((l) => l.trim() === "## User-entry skills (never load recursively)");
  const userEntry = [];
  for (const line of lines.slice(start + 1)) {
    const t = line.trim();
    if (!t) continue;
    if (!t.startsWith("`")) break;
    userEntry.push(...backticks(t));
  }

  const sortObj = (o) => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
  return {
    framework: "idea-to-production@2",
    generated_from: "dependency.md",
    capabilities: sortObj(capabilities),
    skills: sortObj(skills),
    triggers: sortObj(triggers),
    user_entry: userEntry,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const depText = readFileSync(join(ROOT, "dependency.md"), "utf8");
  writeFileSync(join(ROOT, "dependency.json"), JSON.stringify(buildRegistry(depText), null, 2) + "\n");
  console.log("wrote dependency.json");
}
