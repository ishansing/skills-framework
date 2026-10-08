import { test } from "node:test";
import assert from "node:assert/strict";
import { checkGrillingOutput } from "../skills/check-grilling-output.mjs";

const text = (value) => ({ type: "text", part: { text: value } });

test("each question needs its own non-empty recommendation", () => {
  assert.deepEqual(checkGrillingOutput([text(
    "❓ **Q1 — Authority:** Who approves?\n\n---\n\n❓ **Q2 — Recovery:** Who recovers?\n\n➡️ Ask the current owner.")]),
  { questions: 2, missing: ["Q1"], pass: false });
  assert.equal(checkGrillingOutput([text("❓ **Q1** - **Authority**: Who?\n\n➡️   \n")]).pass, false);
  assert.equal(checkGrillingOutput([text("❓ **Q1** - **Authority**: Who?\n\n➡️   \n\n---\n")]).pass, false);
  assert.deepEqual(checkGrillingOutput([text(
    "❓ **Q1 — Authority:** Who approves?\n\n➡️ Current owner, provisionally.\n\n---\n\n❓ **Q2** - **Recovery**: Who recovers?\n\n➡️ Decide recovery separately.")]),
  { questions: 2, missing: [], pass: true });
});

test("skill-template tool output cannot substitute for rendered questions", () => {
  const tool = { type: "tool_use", part: { text: "❓ **Q1** question\n➡️ answer" } };
  assert.deepEqual(checkGrillingOutput([tool, text("Awaiting input.")]),
    { questions: 0, missing: [], pass: false });
});
