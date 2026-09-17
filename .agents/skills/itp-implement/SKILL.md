---
name: itp-implement
description: >-
  Lifecycle adapter for the implementation phase. Use when the idea-to-production root is at
  implement, or when an approved slice/spec must be built test-first. Requires `tdd`; loads
  diagnosis and stack specialists only on their trigger.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: implementation
  invocation-class: model
---

# ITP Implement

```yaml
adapter_contract:
  id: itp-implement
  role: lifecycle-adapter
  phase: implementation
  consumes: [slice, acceptance-criteria, relevant-design-context]
  required_children: [tdd]
  conditional_children: [codebase-design, diagnosing-bugs, vercel-react-best-practices, frontend-design, webapp-testing, playwright-generate-test, resolving-merge-conflicts]
  produces: [implementation-diff, validation-evidence, unresolved-findings]
  exits: [completed, blocked, needs-human, needs-review]
```

## Inputs

The slice (`docs/work/ISSUE-<n>.md`), its acceptance criteria, and relevant architecture/ADRs.

## Required child

Load `tdd` and follow its red -> green -> refactor loop for the slice. Do not load a second
TDD methodology.

## Conditional children

- `codebase-design` as needed when the interface/seam is in question (reference, not a session).
- `diagnosing-bugs` only when a failure is not understood: require a concrete diagnosis and a
  regression case, then resume `tdd`. Bound this loop (max 2); same failure without new
  evidence -> `needs-human`.
- `vercel-react-best-practices` for React/Next.js work.
- `frontend-design` for new UI or visual redesign.
- `webapp-testing` when a browser flow must be exercised; `playwright-generate-test` when a
  durable Playwright test is required.
- `resolving-merge-conflicts` for an in-progress conflict; resolve by intent, never `--abort`.

## Procedure

1. Work one vertical slice at a time. A bootstrap slice may add the test runner and tooling
   first; once a runner exists, the normal red -> green loop applies.
2. Run the project's checks after each cycle (tests, typecheck, lint, build as applicable).
3. Record the exact commands and observed results as evidence.
4. List any unresolved findings explicitly; do not silently widen scope.
5. Make the slice's declared documentation impact part of the deliverable: update the named
   docs with the behavior change, or record a waiver with a reason. Count a docs build or lint
   in the evidence when the project has one.

## Output

Return a `skill_result` with summary, artifacts, evidence, unresolved findings, and
`recommended_next: itp-review`.
