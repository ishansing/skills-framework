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

## Grilling diagnosis follow-up

The user authorized diagnosis rather than a deviation waiver. Controlled native
contrasts in `docs/work/INCIDENT-GRILLING-FORMAT.md` isolate a conflicting validation
prompt clause. MIG-07 now distinguishes provisional recommendations from product
decisions; the original full scenario produced four recommendation-bearing questions
and waited for the user. Historical failed traces remain failed. No upstream patch
or global configuration change was needed. This closes the observed prompt-conflict
probe defect, without asserting a general model reliability or release-readiness result.

Fresh diagnosis/checker checks: 62 contract checks, 32 script tests, and
`git diff --check` passed. Replaying all six frozen traces with the retained checker
produced the expected verdicts: original/minimal/add-back exit 1; removed-clause,
clarified-minimal, and clarified-original exit 0. Two independent review axes approved
the checker, probe correction, and evidence. An empty recommendation followed by a
separator was first shown to fail the checker unit test, then fixed using horizontal
whitespace matching; focused tests subsequently passed 2/2. No historical failure was
waived, upstream skill modified, or configuration changed to produce the green probes.

## Skill Watch feature verification — 2026-10-11

Scope: `SKILL-WATCH-PLAN.md` and AC-1–AC-5 in `docs/work/ISSUE-SKILL-WATCH.md`;
user-approved working-tree baseline `6230ad0` on `feature/skill-watch`. Final Standards,
Spec and differential-security verdicts approve after blockers were fixed (review record
and `docs/work/skill-watch-security.md`). `itp-verify` and its required verification child
were loaded before the following fresh checks.

### Fresh evidence

- `npm ci --ignore-scripts`: reproducible install, 0 reported vulnerabilities.
- `npm test`: 61 tests pass, 0 failures.
- `node tests/skills/check-contracts.mjs`: 62 checks pass.
- `bash -n install.sh`, script syntax checks, and `git diff --check`: exit 0.
- Pinned actionlint v1.7.12 tarball SHA-256 verified against the CI pin; actionlint
  completed with exit 0 after downloading the missing temporary binary.
- `node scripts/skill-watch.mjs --dry-run --output /tmp/opencode/skill-watch/final-review`:
  exit 0; usable scan, 8 pending pin updates, one unavailable source. All seven approved
  upstream repositories plus AwesomeSkill, Skills.sh, and VoltAgent were collected.
  SkillsMP returned `fetch failed` and was explicitly reported unavailable rather than
  presented as an empty successful inventory. Earlier live runs covered all four sites;
  captured SkillsMP fields and fake-HTTP tests remain runnable.

### Acceptance mapping

- AC-1: baseline, source failure, incomplete inventory, recent identity history, moved
  paths, simultaneous contracts and human dispositions covered by passing scan/comparison
  tests. Pin checker reused with a tested per-client branch-cache correction.
- AC-2: four extractors tested; captured public card fields exercised; primary identity,
  exact revision/hash, ambiguous leads and bounded verification explicit. Latest live
  source failure is visible; marketplace/query coverage is partial, not comprehensive.
- AC-3: host/authentication boundaries, private redirects, robots rules, bounded wildcard
  processing, YAML aliases/fields, oversized headings and duplicate observations tested.
  External report text is escaped. No discovered skill or source script executed.
- AC-4: fake GitHub tests cover publisher ownership, forged markers, stale state, state
  failure/retry deduplication, one weekly digest, continued high-priority alerts, and
  GitHub issue-body limits. No live issue or state branch was created during validation.
- AC-5: daily/manual workflow lint passes; CLI mode guards and config inspection tested;
  docs and read-only scan verified. Publication remains disabled and scheduled collection
  paused as requested, pending an authorized live publication proof.

### Verdict

**Pass for implementation/pre-commit acceptance.** No remaining blocking reviewed defect.
This is not approval to enable publication or proof of remote CI. SkillsMP category breadth,
unsupported new source adapters, semantic reference analysis, bounded recent history and
multiple independent CLI publisher concurrency are recorded limitations. Tests do not
claim complete catalogs or cross-process atomic delivery. No PR body requested; `pr` is
not triggered. Next: commit the intended feature files, then separately authorize rollout.
