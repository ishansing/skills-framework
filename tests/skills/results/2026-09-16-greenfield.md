# Greenfield Support - 2026-09-16

Added after the question "what about starting a project from scratch?": the lifecycle had no
bootstrap concept, and the scale rule could misclassify an empty repository.

## Changes

- `references/lifecycle.md`: Greenfield section - never `small` until structure and tooling
  exist; research covers stack options; align records stack/scope/tooling decisions;
  architecture designs the initial structure and records stack ADRs; the first slice is the
  bootstrap slice; scale may drop to `small` only after tooling exists.
- `itp-research`: stack/library questions in a greenfield repo are researched with primary
  sources.
- `itp-architecture`: designs the initial structure instead of anchoring on existing modules.
- `itp-slice`: with no runner or build yet, slice 1 is `project bootstrap` with a smoke test
  as its validation strategy.
- `itp-implement`: bootstrap slices may add tooling first; red -> green applies once a runner
  exists.
- Golden `greenfield-bootstrap.md`; `setup-sandbox.sh --empty`; run steps in README.

## Verification

- `setup-sandbox.sh --empty` creates `~/itp-greenfield-app` (installer exit 0, one commit).
- Static checks and CI run with the commit that added these files.
- Pending: the greenfield golden run in a fresh session, then scoring against
  `greenfield-bootstrap.md`.
