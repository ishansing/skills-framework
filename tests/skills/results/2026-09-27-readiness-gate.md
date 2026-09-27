# §25 Readiness Gate Assessment - 2026-09-27

Assessment of the framework against each SKILL-FRAMEWORK.md §25 exit criterion, from
recorded evidence only. Statuses: met / partial / open / deferred (by prior decision).

## Per-bullet assessment

| # | §25 bullet | Status | Evidence |
|---|---|---|---|
| 1 | root routes common task types correctly | met | ROUTE-01, ROUTE-03, ROUTE-04, T2 bug-fix routing, R3 spec-first routing, incident-first e2e; research-only stops, spec-first skips, bug→implement routing all observed |
| 2 | each adapter works in isolation | met | all 9 adapters exercised: research (ROUTE-01), align + spec + architecture (campaign 4 + COMP-03), slice (T3 standalone), implement (T4 standalone), review (COMP-05, ROUTE-04), verify (ISO-VERIFY), incident (FAIL-01) |
| 3 | required child skills are consistently selected | met | observed in every run; enforced statically by `check-contracts.mjs` (49 checks) |
| 4 | conditional specialist triggers are understandable | met | `differential-review` fired twice on auth surface and correctly not fired elsewhere; all six review specialists evaluated with per-trigger reasons (campaign 4); triggers documented in `dependency.md` |
| 5 | user-entry skills are not recursively invoked | met | FAIL-08 (`to-spec` refused with handoff); ROUTE-04 setup-skill handoff; checker bans it statically |
| 6 | missing dependencies produce clear handoffs | met | FAIL-01: hidden skill → install recommendation + regression case + resume point, no substitution |
| 7 | debugging/TDD loops terminate | met | REC-01 full `tdd → diagnosing-bugs → tdd` loop ended with new evidence; REC-02 bound honored (documented N=0 variant) |
| 8 | review failures route back to implementation cleanly | met | observed 3×: small golden and greenfield `changes-requested` loops, e2e re-review cycle |
| 9 | verification prevents unsupported completion claims | met | ISO-VERIFY `fail` verdict with evidence and no claim; e2e JUSTIFIED STOP instead of false `pass` |
| 10 | end-to-end golden tasks are repeatable | partial | small golden ran 3× with stable shape; standard, greenfield, and e2e ran once each |
| 11 | artifacts are sufficient to resume work in a fresh session | met | RESUME-01, checkpoint resumes (`awaiting: user`), slice resume — all from ledger + artifacts, no history needed |
| 12 | dependency graph has no unexplained cycles | met | checker 49/49; REC-03 partial: numeric bounds (depth 5 / repeat 2 / children 6) are contract text, the checker enforces structure + the user-entry ban, and no recorded run exceeded bounds |
| 13 | skill IDs and contracts are stable enough to encode in software | met | 23/23 lockfile hashes verify; checker enforces IDs, children, and invocation classes; one upstream rename absorbed (`vercel-react-best-practices`) |

## Explicitly out of scope for this assessment

- **Human-run outcomes** (`HUMAN-RUNS.md`): full grilling interviews, standard/greenfield/e2e repeats, browser-gated FAIL-07. Require a person and, for FAIL-07, a Playwright-capable environment.
- **Deferred to the harness by prior decision**: CHKPT-02/04 deterministic assertions, deterministic bound checks, `resolving-merge-conflicts` invocation proof (resolution observed correct; skill-load line unconfirmed).
- **Unproven automation**: the monthly upstream-check has only ever reported "no updates"; the re-pin PR and drift-issue paths have never fired live.

## Judgment

**READY (conditional).** Ten bullets met outright; three partials, all bounded and documented:
repeat the standard and greenfield goldens once each, run one full grilling interview, and
either run FAIL-07 somewhere with a browser or record it permanently blocked. Nothing in the
evidence suggests the skill graph would misbehave under those runs; they are confirmation,
not discovery. The deferred items are harness work by definition and do not block.

On those conditions, `CUSTOM-HARNESS.md` may proceed as an enforcement and scaling layer:
leases, sandboxing, budgets, immutable audit log, atomic state, deployment authorization,
kill switches — with the contracts in `dependency.md` + `skills.lock.json` as the encoded
source of truth.
