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
3. Load exactly one adapter by ID with the runtime's skill tool.
4. Require the adapter's structured `skill_result` (see `references/artifacts.md`).
5. Validate `recommended_next` against `dependency.md`. Follow, skip, or loop back only with
   a stated reason.
6. Continue to the next adapter, or stop for the human (`needs-human`).
7. Update `.itp/run.md` (create it from the template in `references/artifacts.md`); set
   `next_phase` to where a fresh session should resume.
8. Before claiming completion: load `itp-verify`. No completion claim without its fresh
   evidence.

## Hard rules

- Never install, upgrade, search for, or substitute a skill at runtime. A missing
  dependency stops the phase with `needs-human` and an install recommendation.
- Never load a user-entry skill recursively (list in `dependency.md`). If one is preferable,
  return `needs-human` with `recommended_user_skill`, reason, and `resume_with`.
- Recursion bounds: framework depth 5, same skill max 2 loads, children per adapter max 6.
  The same failure without new evidence stops the loop and asks the human.
- Pass the smallest useful context to each adapter: artifact paths, target slice/requirement,
  current diff, reproduction, or specific question. Do not replay the conversation when
  artifacts exist.
- Do not duplicate adapter procedures here.
