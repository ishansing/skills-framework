# Golden Case: greenfield-bootstrap

Third golden run: a brand-new repository (framework installed, no application code).
Sandbox: `~/itp-greenfield-app` created with `setup-sandbox.sh --empty`.

```yaml
case: greenfield-bootstrap
scale: standard
goal: "Build a small CLI that records expenses and reports totals by category, from scratch."
expected_required:
  - itp-align
  - itp-spec
  - itp-architecture
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
  - scale-small-before-tooling-exists
artifacts_expected:
  - docs/product/spec.md
  - docs/product/acceptance-criteria.md
  - docs/architecture/architecture.md
  - docs/work/ISSUE-<n>.md
  - docs/work/review.md
  - docs/work/verification.md
  - .itp/run.md
```

## Trace checks

- Root classifies `scale: standard` (never `small` for greenfield) and records it.
- Architecture designs the initial structure and records stack/tooling choices as ADRs.
- Slice 1 is the bootstrap slice: tooling, CI, and one smoke test as its validation strategy.
- `tdd` enters its red -> green loop only after a test runner exists; bootstrap work is
  verified by running the smoke test.
- Research appears only if stack questions were genuinely open; provenance is recorded when it
  does.
- Review and verify run; verify exercises the bootstrap acceptance criteria and the smoke test
  fresh.
Result:
