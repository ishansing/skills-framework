# Small-Tier Golden Result - 2026-09-16

Case: `small-localized-change.md` in `~/itp-small-app` (framework installed by
`setup-sandbox.sh`). Verdict: **pass**.

Goal: normalize emails in `src/members.js` (trim/lowercase on add and lookup, reject
non-string input).

| Expectation | Observed |
|---|---|
| scale classification | `scale: small` recorded in `.itp/run.md` |
| phases | spec-lite, slice, implement, review, verify; align and architecture skipped with a recorded reason (no open decision, no boundary moved); no research |
| adapter budget | four adapters: `itp-slice`, `itp-implement`, `itp-review`, `itp-verify`; spec-lite authored by the root (38 lines, 4 `REQ-` IDs) |
| artifacts | `docs/product/spec.md`, `docs/work/ISSUE-001.md` (5 `AC-` refs), `review.md`, `spec-review-report.md`, `standards-report.md`, `verification.md`, `.itp/run.md`; no `acceptance-criteria.md`, no `architecture.md`/ADR, no `decisions.md` |
| review | first verdict **changes-requested** with a blocking Spec finding, routed to `itp-implement`; after the fix, re-review verdict **approved** -> `itp-verify`. This exercises the review -> implementation loop |
| verification | fresh in-session evidence with red -> green cycles visible (cycle 1 and 2 each show a failing assertion before the fix); `npm test` re-run here: 5 tests, 5 pass, exit 0 |
| forbidden | none observed (no runtime skill install, no recursive user-entry skill) |

## Metrics vs the standard golden

| | standard run | small run |
|---|---|---|
| phases | 8 | 5 |
| adapters/child skills loaded | 9 | 8 (incl. root) |
| artifacts | 14 | 7 |
| doc lines | 554 | 205 |
| code + test lines changed | 120 | 34 |
| doc:code ratio (advisory) | ~4.6 | ~6.0 |

Absolute ceremony dropped sharply; the ratio stays high because review emits its own axis
reports regardless of diff size. Guidance updated: artifact count and adapter loads are the
budget controls; the ratio is advisory.

## Findings fixed

1. `spec-lite` ownership was implicit; `lifecycle.md` now states the root may author it for
   small runs and `itp-spec` is not loaded.
2. The old "doc-to-code near 1" target was unrealistic for tiny diffs; `artifacts.md` and the
   fixture now say the ratio is advisory.
