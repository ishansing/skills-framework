# Golden Case: small-localized-change

Second golden run, exercising the `small` tier. Sandbox: `~/itp-small-app` (see
`README-run.md`).

```yaml
case: small-localized-change
scale: small
goal: "Normalize emails in members.js: trim and lowercase on add and lookup, and reject non-string input."
expected_required:
  - itp-slice
  - itp-implement
  - tdd
  - itp-review
  - code-review
  - itp-verify
  - verification-before-completion
expected_conditional: []
forbidden:
  - runtime-skill-installation
  - recursive-to-spec
  - architecture-artifact-without-boundary-change
  - separate-acceptance-criteria-file
artifacts_expected:
  - docs/product/spec.md
  - docs/work/ISSUE-<n>.md
  - docs/work/review.md
  - docs/work/verification.md
  - .itp/run.md
```

## Trace checks

- Root classifies `scale: small` and records it in `.itp/run.md`.
- `itp-align` completes without `grilling` (no open high-impact decision), with the skip
  recorded; no `decisions.md`.
- `itp-architecture` completes as `no architectural change`; no ADR and no
  `architecture.md`.
- `itp-slice` writes the acceptance criteria inline in the ISSUE; no
  `docs/product/acceptance-criteria.md`.
- Review loads `code-review` only (no specialist triggers on this diff).
- `itp-verify` reads the acceptance criteria from the ISSUE, runs the suite fresh, and writes
  `verification.md`.
- Budget: one session, at most four adapter loads, doc-to-code ratio near or below 1.
Result:
