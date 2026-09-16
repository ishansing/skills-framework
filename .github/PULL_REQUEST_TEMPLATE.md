## What

<!-- Summary of the change. For upstream re-pins, link the automation PR report. -->

## Validation

### Automated (required)

- [ ] `node tests/skills/check-contracts.mjs` passes
- [ ] For upstream re-pins or installer changes: fresh install smoke passes
      (`HOME=$(mktemp -d) bash install.sh --init "$(mktemp -d)" --strict`)

### Behavioral (required for upstream re-pins and lifecycle/contract changes)

- [ ] Golden case (`tests/skills/golden/`) run against this change; result and model below
- [ ] Affected capability cases (`tests/skills/`) run; results below

Model / session date:

## Release

- [ ] `VERSION` bump included if this change should ship (releases are dispatched manually)
