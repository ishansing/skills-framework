---
name: itp-research
description: >-
  Lifecycle adapter for the research phase. Use when the idea-to-production root is at
  research, or when a specific external question needs provenance-backed evidence before
  specification. Coordinates the `research` skill; does not reimplement it.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: research
  invocation-class: model
---

# ITP Research

```yaml
adapter_contract:
  id: itp-research
  role: lifecycle-adapter
  phase: research
  consumes: [user-goal, existing-artifacts]
  required_children: [research]
  conditional_children: []
  produces: [research-artifact, assumptions, unknowns]
  exits: [completed, blocked, needs-human]
```

## Inputs

The user goal, current repo context, and any existing `docs/product/` artifacts.

## Procedure

1. Separate what the repo already answers from what needs outside evidence.
2. If outside evidence is needed, load `research` with: the specific question(s), the target
   artifact `docs/product/research.md`, and the requirement to cite primary sources.
3. Record, never invent: assumptions in `docs/product/assumptions.md`, open unknowns in
   `docs/product/unknowns.md`. Omit files that would be empty.
4. Preserve sources/provenance in the research artifact.

## Output

Return a `skill_result` (schema: `.agents/skills/idea-to-production/references/artifacts.md`)
with status, summary, artifacts, findings, open questions, and `recommended_next: itp-align`.
