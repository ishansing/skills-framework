# Verification: Matt v1.3 validation follow-up

Scope and pass bar: `docs/work/ISSUE-MATT-V13.md`, AC-1 through AC-4.
Implementation diff: committed v1.3 integration plus approved local setup and evidence
follow-up. Review: `docs/work/review.md`, independent Standards and Spec approvals
after the ADR-pointer correction. The current on-disk `itp-verify` instructions were
read directly; `verification-before-completion` was loaded before fresh checks.

## Fresh evidence

- `node tests/skills/check-contracts.mjs`: 62 checks pass, 25 consistent pins.
- `node --test tests/scripts/*.test.mjs`: 30 pass, 0 fail, exit 0.
- `bash -n install.sh`: exit 0.
- `git diff --check`: exit 0.
- Isolated `install.sh --init ... --strict`: exit 0 with 62 target contract checks.
- Parent rechecks of the isolated glossary, merge, routing, PR test, and retro
  fixtures are recorded with exact outcomes in
  `tests/skills/results/2026-10-08-matt-v1.3-behavior.md`. Expected negative-case
  exits (failed clamp test and forbidden debug output) are not success claims.

## Acceptance mapping

- AC-1: approved tracker and default-label files inspected; AGENTS pointers match;
  domain ADR path corrected and re-reviewed. No GitHub mutation was performed.
- AC-2: both independent axes approve the corrected contracts, with evidence limits
  stated rather than converted to full runtime approval.
- AC-3: all five file-driven cases have inspected reports; actual fixture checks were
  independently rerun. Synthetic requests/approval inputs and unexercised branches
  are explicit. Primary temporary fixture locations are documented.
- AC-4: fresh repository checks above all pass.
- Documentation impact: setup pointers, case result links, review and verification
  evidence are present and consistent with the inspected results.

## Verdict

**Pass for the scoped local follow-up.** This does not close full migration acceptance:
native skill discovery/dispatch, upstream parallel scheduler execution, MIG-01 live
ambiguity, and MIG-03 successful integration review/verify remain untested. The previous
§25 closure is not reasserted for those changed paths. No PR-body close-out was requested
for this change, so `pr` is not triggered here.

Next runtime validation requires refreshed skill discovery in a fresh session and real
integration-branch evidence; no release readiness or deployment approval is implied.

## Subsequent native runtime evidence

The follow-up in `tests/skills/results/2026-10-08-matt-v1.3-native.md` records actual
Skill/Task dispatch after pin refresh, live human glossary answers, an actual integration
branch with independent review and fresh verification, and native PR-body/retro calls.
Those previously unexercised positive runtime paths now have evidence. The earlier
scoped verdict remains dated evidence; full upstream conformance is still not asserted:
non-fast-forward merges, exact grilling recommendation formatting, and repeatability
remain explicit limitations. No release or production approval follows from these probes.

## Strict conformance follow-up

`tests/skills/results/2026-10-08-matt-v1.3-conformance.md` records a second actual native
parallel run with all integration landings strictly `--ff-only`, fresh worker syncs,
ancestry checks, independent review and 7/7 fresh tests. That integration gap is closed
for the constrained protocol. The grilling-format omission recurred despite correct
Skill loading; that criterion remains failed. Stop retries and obtain the user's
decision on diagnosis versus explicit deviation acceptance before release readiness.
