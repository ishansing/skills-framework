---
name: itp-review
description: >-
  Lifecycle adapter for the review phase. Use when the idea-to-production root is at review,
  or to review a diff against its spec and standards. Requires `code-review`; loads
  conditional specialist reviewers only on their trigger.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: adapter
  phase: review
  invocation-class: model
---

# ITP Review

```yaml
adapter_contract:
  id: itp-review
  role: lifecycle-adapter
  phase: review
  consumes: [implementation-diff, spec, acceptance-criteria, slice]
  required_children: [code-review]
  conditional_children: [differential-review, postgresql-code-review, web-design-guidelines, agentic-eval, agent-owasp-compliance, agentic-actions-auditor]
  produces: [review-report, unresolved-findings]
  exits: [completed, changes-requested, blocked, needs-human]
```

## Inputs

The diff under review is `<fixed-point>...<branch-or-commit-under-review>`, the linked
`docs/product/spec.md` + `docs/product/acceptance-criteria.md`, the slice, and project rules.
Read the diff fresh; do not accept the implementation narrative. If the branch under review is
not checked out, check it out or pass that explicit range to `code-review`; never silently
review `master...HEAD`.

## Required child

Load `code-review` with the fixed point and the spec/issue as its Spec source; it runs the
Standards + Spec axes.

## Conditional children (load only on trigger)

- `differential-review` for medium/high-risk or security-sensitive diffs.
- `postgresql-code-review` when PostgreSQL behavior or schema changed.
- `web-design-guidelines` when UI changed (use the pinned adapter when available).
- `agentic-eval` when agent/harness behavior changed.
- `agent-owasp-compliance` when agent/tool/prompt trust boundaries changed.
- `agentic-actions-auditor` when an AI GitHub Actions workflow changed.

`code-review` is not the only bug or security signal; a triggered specialist is additional,
not optional.

## Procedure

1. If `code-review` reports the issue tracker is unconfigured, return `needs-human` with
   `recommended_user_skill: setup-matt-pocock-skills` and the spec/slice as resume context.
2. Group findings by source skill; separate blocking from non-blocking.
3. Write `docs/work/review.md` with verdict, spec/acceptance coverage, and findings.
4. Do not fix findings here; route them to `itp-implement`.

## Output

Return a `skill_result` with verdict and findings, and `recommended_next: itp-verify` when
approved or `itp-implement` when changes are requested.
