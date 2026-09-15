---
name: itp-verify
description: >-
  Lifecycle adapter for the verification phase. Use when the idea-to-production root is about
  to claim completion. Requires fresh evidence from `verification-before-completion`; no
  completion claim is valid without it.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: verification
  invocation-class: model
---

# ITP Verify

```yaml
adapter_contract:
  id: itp-verify
  role: lifecycle-adapter
  phase: verification
  consumes: [implementation-diff, validation-evidence, review-verdict, acceptance-criteria]
  required_children: [verification-before-completion]
  conditional_children: []
  produces: [verification-evidence, completion-verdict]
  exits: [pass, fail, blocked, needs-human]
```

## Inputs

The implementation diff and tests, `docs/product/acceptance-criteria.md`, and
`docs/work/review.md`.

## Required child

Load `verification-before-completion` and follow its iron law: no completion claim without
fresh verification evidence produced in this session.

## Procedure

1. Run the checks now, and capture the commands with their observed output: tests, build,
   typecheck, lint, browser checks, migration checks, as applicable to the diff.
2. Confirm each acceptance criterion is actually satisfied by the evidence, not by assertion.
3. Confirm triggered specialist reviews completed and blocking findings are resolved or
   explicitly handed off.
4. Write `docs/work/verification.md` with the evidence and the verdict.
5. `pass` only when every criterion has fresh evidence. Otherwise `fail` with the missing or
   failing evidence named.

## Output

Return a `skill_result` with status `pass` or `fail`, the evidence, remaining findings, and
`recommended_next`: none on pass; `itp-implement` or `itp-incident` on fail.
