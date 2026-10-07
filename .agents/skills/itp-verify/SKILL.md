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
  conditional_children: [pr]
  produces: [verification-evidence, completion-verdict]
  exits: [pass, fail, blocked, needs-human]
```

## Inputs

The implementation diff and tests, the acceptance criteria (`docs/product/acceptance-criteria.md`,
or the slice's acceptance criteria list when `scale: small`), and `docs/work/review.md`.

Validate inputs before acting: the diff, tests, acceptance criteria (or slice list), and review
verdict must exist; otherwise return `fail` naming the missing input — never claim pass on
inputs you could not check.

## Required child

Load `verification-before-completion` and follow its iron law: no completion claim without
fresh verification evidence produced in this session.

## Procedure

1. Run the checks now, and capture the commands with their observed output: the
   acceptance-criteria tests plus the project's suite; add build, typecheck, lint, browser, or
   migration checks only when the diff touches them.
2. Confirm each acceptance criterion is actually satisfied by the evidence — measured
   against the slice's stated pass bar — not by assertion.
3. Confirm the declared documentation impact is satisfied (each item updated or explicitly
   waived) and that updated docs do not contradict the verified behavior.
4. Confirm triggered specialist reviews completed and blocking findings are resolved or
   explicitly handed off.
5. Write `docs/work/verification.md` with the evidence and the verdict.
6. `pass` only when every criterion has fresh evidence. Otherwise `fail` with the missing or
   failing evidence named.
7. After `pass`, call the skill tool with `pr` only for a requested PR body or an explicitly
   authorized PR delivery workflow. Pass the verified diff, evidence, and domain glossary
   pointers; keep missing before-evidence explicit rather than inventing it. Draft Summary,
   Evidence, and Merge Danger sections. Formatting a body does not authorize creating,
   publishing, merging, or deploying a PR. Record close-out separately from the pass verdict.
   If `pr` is unavailable, hand off the requested close-out as `needs-human`, naming the
   missing skill and preserving the verification evidence; do not install or substitute it.

## Output

Return a `skill_result` with status `pass` or `fail`, the evidence, remaining findings, and
`recommended_next`: none on pass; `itp-implement` or `itp-incident` on fail.
For a blocked requested close-out, return `needs-human` with the passed verification
artifact as resume context and the PR-formatting handoff kept distinct.
