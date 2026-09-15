---
name: web-design-guidelines
description: >-
  Review UI code against the pinned Web Interface Guidelines snapshot. Local pinned
  replacement for the upstream vercel-labs web-design-guidelines skill, which fetches mutable
  rules from `main`. Use when UI is changed or reviewed.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: pinned-specialist
  invocation-class: model
---

# Pinned Web Interface Guidelines

This skill is the framework's pinned replacement for the upstream
`vercel-labs/agent-skills` `web-design-guidelines` skill. The upstream skill fetches its
rules from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`,
which is mutable and therefore not reproducible. Never fetch that URL; use the snapshot
vendored next to this file.

Snapshot: `vercel-labs/web-interface-guidelines@e3d624baaf29dc1fc645aff3e38f03e564d2d6b1`
(file `command.md`, MIT, see `LICENSE`).

## Procedure

1. Read `command.md` in this skill directory: it contains all the rules and the required
   output format.
2. Apply every rule to the changed UI files and report findings using that output format.
3. Cite file and line for each finding. Do not invent rules beyond the snapshot.
