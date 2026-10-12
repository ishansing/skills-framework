# Agent work artifacts

For implementation planning, read the relevant file under `plans/`:

- `plans/SKILL-WATCH-PLAN.md`: discovery/monitoring implementation and rollout limits.
- `plans/SKILL-INTEGRATION-PLAN.md`: adoption-preview milestone and later ITP integration.
- `plans/CUSTOM-HARNESS.md`: harness design inputs, not an implemented enforcement layer.
- `plans/UPGRADES.md`: ECC-sourced upgrade backlog and status.
- `plans/INSTALL-PLAN.md`: curl distribution/menu design and rollout status; acceptance
  criteria and approved test seams are in `docs/work/ISSUE-CURL-INSTALL.md`.

Task-specific handoffs live under `context/` when recorded; reusable prompts belong under
`prompts/` when actually needed. Create them on first use. Generated adoption previews
default to `previews/` (gitignored), not the approved dependency registry.

Current task: `plans/INSTALL-PLAN.md`. Adoption handoff: `context/skill-adoption-preview.md`;
reusable preview request: `prompts/adoption-preview.md`.

Root runtime instructions, normative framework specification, dependency registry, README,
`docs/`, `.agents/skills/`, and behavioral test documentation keep their established roles.
Dated evidence records can mention former root filenames as historical observations.
