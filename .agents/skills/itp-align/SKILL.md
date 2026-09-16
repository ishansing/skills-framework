---
name: itp-align
description: >-
  Lifecycle adapter for the alignment phase. Use when the idea-to-production root is at
  align, or when high-impact product decisions must be pressure-tested before a spec is
  written. Coordinates `grilling` (and `domain-modeling` when the ambiguity is domain
  language); does not reimplement them.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: align
  invocation-class: model
---

# ITP Align

```yaml
adapter_contract:
  id: itp-align
  role: lifecycle-adapter
  phase: align
  consumes: [user-goal, research-artifact, open-questions]
  required_children: [grilling]
  conditional_children: [domain-modeling]
  produces: [decisions, open-questions]
  exits: [completed, blocked, needs-human]
```

## Inputs

The user goal plus `docs/product/research.md`, `assumptions.md`, and `unknowns.md` when they
exist.

## Required child

Load `grilling` to pressure-test the high-impact decisions until each branch is resolved or
explicitly deferred. Skip it when no high-impact decision is open (common in `scale: small`
with clear requirements) and record `grilling: skipped - no open high-impact decisions`; do
not skip when a decision has no defensible default.

## Conditional child

Load `domain-modeling` when the ambiguity is really about domain language, business
invariants, actors, scenarios, or bounded contexts.

## Procedure

1. Identify the decisions that block specification.
2. Run the children against those decisions only; keep unrelated topics out.
3. Record resolved decisions and remaining open questions in `docs/product/decisions.md`
   (facts, decisions, and open questions kept distinct).
4. Exit only when high-impact decisions are resolved or explicitly handed to the human.

## Output

Return a `skill_result` with `recommended_next: itp-spec`, or `needs-human` with a `handoff`
block when a decision has no defensible default.
