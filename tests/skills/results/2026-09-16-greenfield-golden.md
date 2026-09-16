# Greenfield Golden Result - 2026-09-16

Case: `greenfield-bootstrap.md` in `~/itp-greenfield-app` (framework installed by
`setup-sandbox.sh --empty`; no application code at start). Verdict: **pass**.

Goal: build a small CLI that records expenses and reports totals by category, from scratch.

| Expectation | Observed |
|---|---|
| scale | `standard` recorded (greenfield is never `small`) |
| phases | align, spec, architecture, slice, implement, review, verify; research skipped with a recorded reason (stack/scope are align decisions) |
| architecture | `architecture.md` plus three stack/structure ADRs (Go stdlib single binary; JSON store with atomic rewrite; single package, no storage abstraction) |
| bootstrap slice | `ISSUE-001 - Project bootstrap`: `go.mod`, CLI skeleton, green smoke test; feature slices in ISSUE-002..004 |
| tdd | tests exist per package and the runner predates feature work |
| review | round 1 `changes-requested` (B1, B2) -> routed to `itp-implement` -> round 2 **approved** |
| verification | **pass**, fresh evidence; `go test -count=1 ./...` re-run here: exit 0, `ok expenses` |
| forbidden | none: sandbox still has exactly the 12 framework skills (no runtime install), no recursive `to-spec`, scale never dropped to small |
| artifacts | `spec.md`, `acceptance-criteria.md`, `decisions.md`, `architecture.md`, `ADR/0001..0003`, `ISSUE-001..004`, `review.md`, `verification.md`, `.itp/run.md` |

## Metrics

| | value |
|---|---|
| phases | 7 |
| skills loaded | 14 (root + 13 adapters/children) |
| artifacts | 15 markdown files |
| doc lines | 770 |
| code lines (Go, incl. tests) | 1096 |
| doc:code ratio | ~0.7 |
| duration | not recorded by the session |

This is the first run with docs below code size, and it exercised the full chain including the
review -> implementation loop on a from-scratch project.

## Notes

- `docs/agents/issue-tracker.md` was not configured; the spec was supplied by path, and the
  setup suggestion was recorded in `review.md` rather than blocking the run.
- The forbidden `scale-small-before-tooling-exists` case did not occur.
