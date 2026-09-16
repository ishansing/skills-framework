# Right-Sizing Change - 2026-09-16

Motivated by the standard golden run: 14 artifacts / 554 doc lines for 120 code+test lines,
eight phases, nine child skills loaded.

## Calibration (SCALE-01, fresh-context subagent, read-only)

| Case | Scale | Deciding factor | Skipped |
|---|---|---|---|
| normalize emails in one module | `small` | one module, clear requirements, no boundary or security surface | research, align interview, architecture |
| collaborator invitations (access control) | `standard` | new interface plus authorization surface | research only |
| schema migration + row-level security | `full` | migration and security/data surface | none |

The probe also reported the artifact minimums and guardrails correctly (review and verify at
every scale; scale rises but never silently drops; small budget = one session, <=4 adapter
loads).

## What changed

- Root classifies and records `scale`; passes it to adapters; guardrails in hard rules.
- `references/lifecycle.md`: right-sizing table, upgrade triggers, small-run budget.
- `references/artifacts.md`: per-tier artifact minimums, ledger `scale`, run metrics.
- `itp-align`: may complete without `grilling` when no high-impact decision is open.
- `itp-spec` / `itp-architecture` / `itp-slice`: small-tier behavior (one-page spec, AC in the
  ISSUE, architecture skipped unless a boundary moves).
- `itp-review`: changed-file scope and proportionate depth for `differential-review`; small
  tier loads specialists only on hard triggers and upgrades the scale when one fires.
- `itp-verify`: acceptance criteria read from the ISSUE when small; checks scoped to AC tests
  plus the suite.
- Goldens: `add-collaborator-invitations` marked `scale: standard` (access-control surface);
  new `small-localized-change.md` fixture; `setup-sandbox.sh` creates either sandbox.
- Docs: README right-sizing section and troubleshooting row for tool-output compression that
  mangles `skill`/`task` results.

## Verification so far

- `check-contracts.mjs` 49 checks, `node --test tests/scripts/*.test.mjs` 14/14, actionlint,
  CI.
- `setup-sandbox.sh` creates and seeds `~/itp-small-app` (installer exit 0, app tests pass).
- SCALE-01 classification probe passed (table above).

## Pending

Small-tier golden run in `~/itp-small-app` (prompt in `golden/README-run.md`); record metrics
and compare against the standard baseline above.
