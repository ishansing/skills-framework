---
name: idea-to-production
description: >-
  Drive an engineering idea through research, alignment, specification,
  architecture, vertical slicing, implementation, review, and verification
  by composing the installed idea-to-production framework skills. Invoke
  explicitly for a full lifecycle; do not auto-select for ordinary coding
  requests.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: root
  invocation-class: user
  opencode/autoinvoke: "false"
  opencode/slash: "true"
---

# Idea to Production

Invocation class: **user entry**. If the runtime does not honor `opencode/*` metadata, this
line is authoritative: do not auto-invoke this skill for ordinary coding requests.

Thin lifecycle router. Procedures live in the `itp-*` adapters and the upstream skills they
load; this skill only routes, bounds recursion, and keeps the run ledger.

Read before starting:

- `references/lifecycle.md` - phase order, routing shortcuts, DoR/DoD, recursion, handoffs;
- `references/artifacts.md` - artifact paths, `skill_result` schema, run ledger template;
- `dependency.md` (repo root) - approved skills, statuses, user-entry list.

## Procedure

1. Inspect the user's goal and existing artifacts (`.itp/run.md`, `docs/`).
2. Determine the earliest incomplete lifecycle phase. This is a router, not a waterfall:
   skip phases whose artifacts exist and are not stale (see routing shortcuts).
3. Classify the run's scale (`small`, `standard`, `full`) with the right-sizing rule in
   `references/lifecycle.md`; when unsure, use `standard`. Record `scale` in `.itp/run.md`.
4. Load exactly one adapter by ID with the runtime's skill tool; pass `scale` in the child
   request context. In small runs the root authors `spec-lite` directly.
5. Require the adapter's structured `skill_result` (see `references/artifacts.md`).
6. Validate `recommended_next` against `dependency.md`. Follow, skip, or loop back only with
   a stated reason.
7. Update `.itp/run.md` (create it from the template in `references/artifacts.md`); set
   `next_phase` to where a fresh session should resume.
8. Continue to the next phase, or stop for the human (`needs-human`). When `checkpoints: true`
   is recorded (or the user asked to review each phase), report a **phase checkpoint** (see
   `references/artifacts.md`) at every phase boundary - including root-authored `spec-lite` and
   phases completed as no-ops - then set `awaiting: user` and wait. A `needs-human` stop takes
   precedence: emit one merged report (handoff plus what exists and the next phase).
9. On the user's go-ahead, clear `awaiting` and continue. On "turn checkpoints off", set
   `checkpoints: false`, clear `awaiting`, and resume auto-advance.
10. Before claiming completion: load `itp-verify`. No completion claim without its fresh
    evidence.

## Hard rules

- Never install, upgrade, search for, or substitute a skill at runtime. A missing
  dependency stops the phase with `needs-human` and an install recommendation.
- Never load a user-entry skill recursively (list in `dependency.md`). If one is preferable,
  return `needs-human` with `recommended_user_skill`, reason, and `resume_with`.
- Recursion bounds: framework depth 5, same skill max 2 loads, children per adapter max 6.
  The same failure without new evidence stops the loop and asks the human.
- Scale guardrails: review and verify always run; a security, data, destructive, or migration
  surface upgrades a `small` run to at least `standard` (record why). Scale may rise mid-run;
  it never drops without a recorded reason.
- Checkpoints: when the user asks to review phase by phase, set `checkpoints: true` in
  `.itp/run.md`. Record a checkpoint at every phase boundary (set `awaiting: user`), clear it
  on the user's go-ahead, and honor "turn checkpoints off" by clearing the flag.
- Pass the smallest useful context to each adapter: artifact paths, target slice/requirement,
  current diff, reproduction, or specific question. Do not replay the conversation when
  artifacts exist.
- Do not duplicate adapter procedures here.
