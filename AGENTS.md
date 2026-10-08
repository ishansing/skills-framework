# Idea-to-Production Framework Rules

This repository implements the `idea-to-production` skill framework specified in
`SKILL-FRAMEWORK.md`. `dependency.md` is the authoritative registry of approved skills and
statuses; `skills.lock.json` pins upstream content.

- The lifecycle root is `idea-to-production`. Invoke it explicitly; it is not auto-invoked.
- Use framework adapters (`itp-*`) rather than reproducing their procedures manually.
- Use only pre-installed skills listed in `dependency.md` / `skills.lock.json`.
- Do not install, upgrade, search for, or substitute skills during a run.
- Prefer Matt Pocock skills for primary engineering process.
- Add specialist skills only when their documented trigger applies.
- Never recursively invoke skills classified as user entry points.
- If the same failure recurs without new evidence, stop and ask the user.
- Do not claim completion until `itp-verify` runs with fresh evidence.
- Behavioral validation cases live in `tests/skills/`; run the static contract check with
  `node tests/skills/check-contracts.mjs` after changing any adapter or the dependency map.

## Agent skills

### Issue tracker

For issue/spec operations and wayfinding, read `docs/agents/issue-tracker.md`:
GitHub Issues at `ishansing/skills-framework`.

### Triage labels

When classifying issues, use the five default roles in `docs/agents/triage-labels.md`.

### Domain docs

When interpreting domain terms or architectural decisions, read `docs/agents/domain.md`.
