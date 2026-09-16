# Golden Case: add-collaborator-invitations

End-to-end regression signal. Rerun periodically; expect some variance across model versions.

```yaml
case: add-collaborator-invitations
scale: standard   # access-control surface keeps this out of the small tier despite the size
goal: "An owner can invite a collaborator by email; the invitee accepts and becomes a member."
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
expected_conditional:
  - differential-review
forbidden:
  - runtime-skill-installation
  - recursive-to-spec
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

- Root starts at the earliest incomplete phase and does not re-run settled phases.
- Each adapter returns a structured `skill_result`; the root validates `recommended_next`.
- `itp-review` verdict `approve` precedes `itp-verify`; verification evidence is fresh (run in
  that session), not quoted from implementation.
- Conditional `differential-review` is evaluated (invitation tokens are security-sensitive)
  and triggered; its findings appear in the review report.
- No phase duplicates another phase's procedure.
Result: pass - see results/2026-09-16-golden.md
