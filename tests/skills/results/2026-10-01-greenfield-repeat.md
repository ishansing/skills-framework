# Greenfield Repeat Result - 2026-10-01

Case: `greenfield-bootstrap.md` in a fresh `~/itp-greenfield-app`
(`setup-sandbox.sh --empty`; framework v2.1.0, 62/62 contract checks at install).
One human answered the align interview (stack: Go, store: JSON atomic rewrite,
scope: add + totals + list).

Verdict: **pass**.

| Expectation | Observed |
|---|---|
| scale | `standard` recorded (greenfield never `small`); never dropped |
| phases | align, spec, architecture, slice, implement (4 slices), review, verify; research skipped with a recorded reason (stack/scope are align decisions) |
| architecture | `architecture.md` + 3 ADRs (Go stdlib single binary; JSON atomic rewrite; single package + minor-unit money) |
| bootstrap slice | `ISSUE-001`: `go.mod`, CLI skeleton, green smoke test; `ISSUE-002..004`: add+store, totals, list+README |
| tdd | red → green per slice (4 reds observed: missing symbols ×3, build failure ×1); runner predates all feature work |
| review | round 1 `changes-requested` (B1 amount-parser bug, B2 arg rejection, B3 store-unchanged proof) → `itp-implement` fixes + regression tests → round 2 **approved** |
| verification | **pass**, fresh evidence: `go build` + `go vet` + `gofmt` clean, `go test -count=1 ./...` 16/16 exit 0, plus live CLI probes (totals math, order, empty message, exit codes) |
| forbidden | none: exactly the 12 framework skills, no recursive `to-spec`, scale never small |
| artifacts | `decisions.md`, `spec.md` (REQ-1..REQ-6), `acceptance-criteria.md` (AC-1..AC-8), `architecture.md`, `ADR/0001..0003`, `ISSUE-001..004`, `review.md`, `verification.md`, `.itp/run.md`, `README.md` usage section |

## Notable: review caught a real bug
Round 1 Spec review found `ParseAmount(".")`/`"12."` accepted as valid money, plus
unrejected extra args on `totals`/`list` and an unproven store-unchanged claim.
All three fixed with regression tests before approval. Second consecutive run
where review earned its keep (standard repeat caught the `addMember` bypass).

## Variance vs 2026-09-16
- Same stack and store by interview (Go stdlib, JSON atomic rewrite) — decisions
  reproduced, not assumed.
- Scope is add + totals + list (original had 4 feature slices; this run folds the
  surface into 3 + bootstrap with identical coverage).
- No `docs/agents/issue-tracker.md` setup; suggestion recorded in `review.md`
  rather than blocking — same handling as the original.
- Standards axis fired 3 minor judgement calls (all advisory or fixed inline);
  original reported none. Depth is comparable.

## Metrics (per artifacts.md)
- scale: standard; phases completed: 7 (research skipped with reason).
- skills loaded (13): idea-to-production, itp-align, grilling, itp-spec,
  writing-for-agents, itp-architecture, codebase-design, itp-slice, itp-implement,
  tdd, itp-review, code-review, itp-verify, verification-before-completion.
  (`domain-modeling`, `poka-yoke`, specialists evaluated, not triggered.)
- artifacts written: 15 markdown files + README. Code: 533 Go lines (incl.
  tests); docs: 445 lines → doc:code ≈ 0.8 (original: ~0.7).
- duration: single session, checkpoints off.

## Still open for section 25
One full grilling interview (both repeats used scoped interviews), FAIL-07 or a
permanently-blocked record.

Sandbox history (`~/itp-greenfield-app`, keep or delete): `58fca77` install →
`8d4a168` bootstrap → `d72ac83` add → `dcebb37` totals → `6e47081` list+README →
`7a29b69` review+fixes → `a17b17a` verify.
