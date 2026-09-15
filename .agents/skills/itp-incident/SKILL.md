---
name: itp-incident
description: >-
  Lifecycle adapter for failures and regressions. Use when the idea-to-production root faces
  an incident, a production failure, or a regression with unknown cause. Requires
  `diagnosing-bugs`; coordinates security and human-ops specialists on trigger.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: incident
  invocation-class: model
---

# ITP Incident

```yaml
adapter_contract:
  id: itp-incident
  role: lifecycle-adapter
  phase: incident
  consumes: [failure-report, reproduction, logs]
  required_children: [diagnosing-bugs]
  conditional_children: [differential-review, agentic-actions-auditor, wizard]
  produces: [diagnosis, regression-case]
  exits: [completed, blocked, needs-human]
```

## Inputs

The failure report, reproduction steps, logs, and the diff/last known good state.

## Required child

Load `diagnosing-bugs`: build a feedback loop that goes red on this failure, minimise it,
then produce a concrete diagnosis and a regression case.

## Conditional children

- `differential-review` when the failure is a security regression.
- `agentic-actions-auditor` when an AI GitHub Actions workflow is implicated.
- `wizard` when remediation includes steps only the human can perform.

## Procedure

1. Diagnose before changing code; do not guess-fix.
2. Route the fix to `itp-implement` (tdd) with the diagnosis and regression case as context.
3. Write `docs/work/INCIDENT-<n>.md` only when the incident spans sessions or involves a
   handoff; otherwise carry the diagnosis in the result.
4. If remediation requires production-changing or destructive action, stop and hand off.

## Output

Return a `skill_result` with the diagnosis, regression case, and
`recommended_next: itp-implement` (or `needs-human`).
