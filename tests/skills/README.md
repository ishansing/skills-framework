# Framework Validation Tests

Behavioral fixtures for `SKILL-FRAMEWORK.md` section 19. They run in a session on an
Agent-Skills-compatible runtime (OpenCode primary), not in CI. Model behavior is not fully
deterministic, so treat outcomes as regression signals, not proofs.

| Directory | Covers |
|---|---|
| `isolation/` | each capability and each adapter works alone; root routing (19.1, 19.5) |
| `composition/` | pair and short-chain composition (19.2) |
| `recursion/` | bounded recursion terminates with new evidence (19.3) |
| `failure/` | missing/ambiguous/failing scenarios produce fallback or `needs-human` (19.4) |
| `golden/` | representative end-to-end trace expectations (19.6) |

## Running a case

1. Start a fresh session in this repository.
2. Give the session the case prompt and load the named skill.
3. Follow the adapter without adding outside instructions.
4. Record pass/fail and the observed trace in the case's `Result` line, or in a dated note.

## Static check

```sh
node tests/skills/check-contracts.mjs
```

Checks the skill graph: every child ID resolves in `dependency.md`, required children are
pinned, no user-entry skill is a recursive child, adapter IDs match directory names, and the
lockfile covers every installed or vendored skill. Run after changing any adapter, the
dependency map, or the lockfile.

## Automated upstream re-pins

`.github/workflows/upstream-check.yml` runs monthly (and on demand). Clean re-pins are
validated by the contract check and a strict fresh install before a PR is opened; renamed or
deleted upstream paths open a drift issue instead. Behavioral cases stay manual: run the
affected cases before merging a re-pin PR (see `.github/PULL_REQUEST_TEMPLATE.md`).
