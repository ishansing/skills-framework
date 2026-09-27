# Human-Run Checklist

Cases that need a human in a fresh session. For each: start a fresh session in the stated
repo, paste the prompt, answer as the product owner, and record the outcome in
`tests/skills/results/` with the date.

## Grilling-driven cases (any repo with the framework installed)

### ISO-02 grilling finds real ambiguity
Prompt: "Load `itp-align`, then let it load `grilling`. Pressure-test my plan to add team
workspaces."
Expect: high-impact decisions identified and queried, no invented answers, unresolved items
listed. Record the questions asked and whether any answer was invented.

### COMP-01 research -> grilling
Setup: a `docs/product/research.md` from a prior research run.
Prompt: "Load `itp-align` with this research artifact as context."
Expect: grilling challenges decisions rather than re-asking settled facts; record whether the
research artifact was actually used.

### COMP-02 grilling -> domain-modeling
Setup: an alignment session that surfaces inconsistent domain terms.
Expect: `domain-modeling` triggers on the terms and records them; record the trigger.

## Repeat golden runs (regression signals, not proofs)

- Standard: fresh `~/itp-golden-app` via `setup-sandbox.sh`, prompt from
  `tests/skills/golden/README-run.md`.
- Greenfield: fresh `~/itp-greenfield-app --empty`, same runbook.
- Small: fresh `~/itp-small-app`, same runbook.
- For each: compare scale, phases, skills, artifacts, and metrics against the recorded runs;
  note variance, not just pass/fail.

## Environment-gated

- FAIL-07 UI without browser: only meaningful where a browser/Playwright runtime exists;
  `webapp-testing` is installed, the capability is not. Run only in a browser-capable
  environment.
