---
name: itp-slice
description: >-
  Lifecycle adapter for vertical slicing. Use when the idea-to-production root is at slice, or
  when approved spec + architecture must become independently testable vertical slices. Owns
  the local tracer-bullet procedure; loads only optional helpers.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: slicing
  invocation-class: model
---

# ITP Slice

```yaml
adapter_contract:
  id: itp-slice
  role: lifecycle-adapter
  phase: slicing
  consumes: [spec, acceptance-criteria, architecture-artifact]
  required_children: []
  conditional_children: [codebase-design, poka-yoke]
  produces: [slices]
  exits: [completed, blocked, needs-human]
```

## Procedure (local tracer-bullet)

1. Cut the work into slices that each deliver one thin end-to-end behavior, not horizontal
   component tasks. Each slice must be independently testable.
2. Write one `docs/work/ISSUE-<n>.md` per slice containing:
   - objective;
   - linked requirement IDs;
   - acceptance criteria (testable);
   - relevant files/modules;
   - dependencies on other slices;
   - out-of-scope behavior;
   - validation strategy;
   - documentation impact: the user-facing docs that change (file + what), or `none` for
     invisible changes; follow the project's existing docs layout, README fallback;
   - conditional specialist triggers.
3. Order slices so dependencies come first; keep each small enough for one implement cycle.
4. Consult `codebase-design` when slice boundaries are unclear; load `poka-yoke` for
   high-consequence slices.
5. When `scale: small`, produce one terse ISSUE; its acceptance criteria list is the
   authoritative source `itp-verify` reads.
6. When no test runner or build exists yet, the first slice is `project bootstrap`: install
   the chosen tooling and CI, with one smoke test as its validation strategy. Feature slices
   follow.

## Output

Return a `skill_result` listing the slices, their order, and
`recommended_next: itp-implement` with the first slice path.
