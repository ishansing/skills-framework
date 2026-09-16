---
name: itp-architecture
description: >-
  Lifecycle adapter for the architecture phase. Use when the idea-to-production root is at
  architecture, or when an approved spec needs module boundaries, interfaces, and recorded
  decisions. Coordinates `codebase-design`; the adapter owns the architecture artifact.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: architecture
  invocation-class: model
---

# ITP Architecture

```yaml
adapter_contract:
  id: itp-architecture
  role: lifecycle-adapter
  phase: architecture
  consumes: [spec, acceptance-criteria]
  required_children: [codebase-design]
  conditional_children: [domain-modeling, grilling, poka-yoke]
  produces: [architecture-artifact, adrs]
  exits: [completed, blocked, needs-human]
```

## Inputs

`docs/product/spec.md` and `docs/product/acceptance-criteria.md`, plus the relevant existing
code and `CONTEXT.md`/ADRs when present.

## Required child

Load `codebase-design` for module, interface, seam, and depth vocabulary. The adapter - not
`codebase-design` alone - owns production of the architecture artifact.

## Conditional children

- `domain-modeling` when bounded contexts or invariants shape the boundaries.
- `grilling` when a high-impact architecture decision is unresolved.
- `poka-yoke` when the design is high-consequence and mistakes are costly.

## Procedure

1. Decide module boundaries, their interfaces, and where seams go; prefer deep modules.
2. Record each significant decision as an ADR in `docs/architecture/ADR/NNNN-<slug>.md`.
3. Write `docs/architecture/architecture.md`: structure, boundaries, key interfaces,
   trade-offs, rejected alternatives, and links to the ADRs.
4. Keep it traceable to requirement IDs from the spec.
5. When `scale: small` and no module boundary or interface changes, complete with `no
   architectural change` recorded and skip both the ADRs and `architecture.md`; escalate to
   `standard` if a boundary is actually moving.

## Output

Return a `skill_result` with artifacts and `recommended_next: itp-slice`.
