#!/usr/bin/env node
// Checks rendered question/recommendation shape, not the validity of product advice.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export function checkGrillingOutput(events) {
  const blocks = events.filter((e) => e.type === "text")
    .flatMap((e) => e.part.text.split(/(?=❓\s*\*\*Q\d)/u))
    .filter((block) => /^❓\s*\*\*Q\d/u.test(block));
  const missing = blocks.filter((block) => !/^➡️[ \t]*\S/mu.test(block))
    .map((block) => block.match(/Q\d+/u)[0]);
  return { questions: blocks.length, missing, pass: blocks.length > 0 && !missing.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) {
    console.error("usage: node tests/skills/check-grilling-output.mjs <opencode-jsonl>");
    process.exit(2);
  }
  const events = readFileSync(process.argv[2], "utf8").trim().split("\n").map(JSON.parse);
  const result = checkGrillingOutput(events);
  console.log(JSON.stringify(result));
  process.exit(result.pass ? 0 : 1);
}
