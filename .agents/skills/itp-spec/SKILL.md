---
name: itp-spec
description: >-
  Lifecycle adapter for the specification phase. Use when the idea-to-production root is at
  spec, or when an approved direction must become an agent-readable specification with
  testable acceptance criteria. Coordinates `writing-for-agents`; does not reimplement it.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: spec
  invocation-class: model
---

# ITP Spec

```yaml
adapter_contract:
  id: itp-spec
  role: lifecycle-adapter
  phase: spec
  consumes: [user-goal, decisions, research-artifact]
  required_children: [writing-for-agents]
  conditional_children: [domain-modeling, codebase-design, prototype]
  produces: [spec, acceptance-criteria]
  exits: [completed, blocked, needs-human]
```

## Inputs

`docs/product/decisions.md`, `docs/product/research.md`, and any existing spec.

## Required child

Load `writing-for-agents` and write `docs/product/spec.md` for an agent reader.

## Conditional children

- Load `domain-modeling` when terms or invariants are still ambiguous.
- Consult `codebase-design` as a reference when the spec's shape is constrained by an existing
  module interface; it is a reference, not a session.
- Load `prototype` only when feasibility is genuinely uncertain and a throwaway experiment
  would answer it.

## Procedure

1. Give requirements stable IDs (`REQ-<n>`) in `spec.md`; keep scope and non-goals explicit.
2. Write testable acceptance criteria in `docs/product/acceptance-criteria.md`, each linked to
   its requirement ID. When `scale: small`, keep the spec to one page and put the acceptance
   criteria in the slice (`docs/work/ISSUE-<n>.md`) instead of a separate file.
3. Mark assumptions and open questions rather than silently choosing.

## Output

Return a `skill_result` with `recommended_next: itp-architecture` (or `itp-slice` when the
root can show architecture is already decided).
