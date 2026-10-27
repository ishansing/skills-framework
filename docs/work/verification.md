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

## Curl installation verification — 2026-10-12

Scope: AC-1–AC-6 in `docs/work/ISSUE-CURL-INSTALL.md`, baseline `86750bc`, uncommitted
`feature/curl-install-menu` work. Approved refinements use a controlled HTTPS fixture
instead of publishing a draft release. Independent Standards, Spec and differential
security re-reviews approve; findings and limits are recorded in the review/security
artifacts. `itp-verify` and `verification-before-completion` loaded before fresh checks.

### Fresh evidence

- `node --test tests/scripts/*.test.mjs`: **89 pass, 0 fail**, exit 0, including eight
  distribution tests and real HTTPS/PTY subprocesses.
- `node tests/skills/check-contracts.mjs`: **63 checks pass**, 26 consistent pins.
- `bash -n install.sh bootstrap.sh`; `node --check` for `scripts/*.mjs` and
  `tests/skills/*.mjs`; `git diff --check`: exit 0.
- actionlint v1.7.12: downloaded archive SHA-256 matched pinned
  `8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8`;
  `/tmp/opencode/actionlint -color`: exit 0.
- `XDG_CACHE_HOME=/tmp/opencode/install-cache node scripts/build-install-bundle.mjs
  /tmp/opencode/install-assets-final`: exit 0, v3.0.0 local smoke bundle, 26 pinned
  entries (24 upstream directories, two vendored). This is not a published v3 release.
- `sha256sum -c SHA256SUMS` in that output directory: archive and bootstrap **OK**.
- Extracted full bundle, installed into separate temporary homes/projects using
  `--skills-scope global|repo --checkpoints phase --strict`: exit 0; target checker
  reports **63 global / 111 repo checks**. Independent reviewer repeated these with
  Git blocked and verified source/asset integrity.
- Source-checkout `install.sh --init <temporary target> --strict` with isolated HOME
  and cache: exit 0; **63 target checks**. Existing scripted source install remains usable.

### Acceptance mapping

- AC-1: actual curl against local trusted HTTPS fixture resolves latest/pinned releases,
  rejects wrong checksums and checksum-valid unsafe archives, reports missing assets,
  and cleans temporary directories on success/failure.
- AC-2: production lock build verifies every directory; offline bundle fixture disables
  Git and still installs. Git runs only for explicit new-project initialization or source
  fetching, not normal extracted-bundle installation.
- AC-3: real controlling-terminal curl pipes cover automatic and explicit `--menu`;
  scripted menu cancellation/dry-run mapping and flags-only installs pass.
- AC-4: both target scopes pass; quoted/large upstream skill frontmatter accepted;
  tampered distributions and unsafe destination paths rejected before activation.
- AC-5: existing ledger/AGENTS/unrelated skills preserved; repeat installs, managed local
  upgrades, scope cleanup, edited skill/subagent/registry refusal and forged global
  ownership records tested. New-project PTY install creates Git and seeds phase mode;
  off/false and slice seeding, preserving an existing slice ledger, invalid menu input,
  `--yes`, and replacing a CRLF managed AGENTS block are also covered.
- AC-6: release workflow builds and uploads all three assets from the exact merged
  commit; workflows lint, full production bundle builds, both scope smokes and suite pass
  locally. GitHub publication/remote CI are explicitly outside this authorized pass bar.
- Documentation impact: README usage/requirements/troubleshooting, plan refinements,
  agent-work index and review/verification artifacts updated.

### Verdict

**Pass for local implementation acceptance.** No blocking reviewed defect remains.
Changes remain uncommitted. Public one-line install needs a separately authorized first
asset-bearing release; no live release/remote CI success is claimed. Operational limits
are documented in `docs/work/curl-install-security.md`. No PR body requested; `pr` not
triggered. `recommended_next: none` for implementation; rollout requires authorization.

## GitHub presentation refresh verification

Scope: `docs/work/ISSUE-GITHUB-PRESENTATION.md`, AC-1–AC-6; uncommitted presentation
diff against `5b3c992` on `feature/github-presentation`. Independent Standards and Spec
reviews approve after the mobile typography fix. `itp-verify` and its verification child
were loaded before final checks. This slice changes documentation/assets/forms only.

### Fresh evidence

- `node /tmp/opencode/check-presentation.mjs`: **37 documentation links/anchors verified**
  against local intended paths (including absolute repository URLs), **two issue forms
  parsed and validated**, SVG accessibility/source checks passed, GitHub GFM API render
  returned successfully. This is a one-off session check, not a new repository test runner.
- The same check used installed Chromium via CDP to load rendered-Markdown previews at
  **1200px, 390px and 320px**, in both light and dark themes: banner loaded, expected
  content present and no page-level horizontal overflow in all six views.
- Preview images: `/tmp/opencode/presentation-{light,dark}-{1200,390,320}.png`. Parent
  inspected desktop light and mobile dark; the independent re-review inspected final
  desktop/mobile images. Styling approximates GitHub Markdown; badges are labeled
  stand-ins and the new SVG is loaded locally. No live GitHub screenshot is claimed.
- Python XML parse and mobile font-floor check: exit 0. The original diagram failed
  the floor before simplification; final minimum 42 × 280 / 960 = **12.25px** at the
  narrowest preview's image width. Browser-measured SVG text stays within the viewBox.
- `node --test tests/scripts/*.test.mjs`: **89 pass, zero fail**.
- `node tests/skills/check-contracts.mjs`: **63 checks pass**.
- `git diff --check`: exit 0. Changed/new documentation and forms also checked for whitespace.
- `gh repo view ishansing/skills-framework --json description,repositoryTopics` confirms
  the approved benefit-led description and eight relevant topics are live. No homepage,
  repository name, release, runtime configuration or dependency pin changed.

### Acceptance mapping

- AC-1: short benefit-led README includes live install, first task, navigation and a
  simplified diagram. Obsolete pre-v4 wording corrected in the preserved reference.
- AC-2: original detailed guidance remains in `docs/reference.md`; getting-started and
  validation pages add focused entry points. All checked document links/anchors exist
  in the intended tree. New absolute public paths await merge, not a successful HTTP
  check of unpublished docs. Bundle contents need no expansion.
- AC-3: accessible SVG and rendered light/dark desktop/mobile previews inspected; mobile
  readability defect fixed and independently re-reviewed. Live GitHub chrome not tested.
- AC-4: OpenCode is the primary validated runtime; other support and enforcement limits
  are explicit. First-task instructions are labeled illustrative. No fresh native demo
  or arbitrary-project success claim is inferred from static/browser checks.
- AC-5: contribution/feedback paths present; both issue forms validate; live About/topics
  match approved positioning. Actual GitHub issue submission is not exercised pre-merge.
- AC-6: scope-specific checks, full script suite, contracts and independent review pass;
  evidence and remaining launch work recorded. No tests mirroring prose were introduced.

### Verdict

**Pass for local implementation of the first presentation slice.** Changes are not
committed or merged; only the About/topics settings are already public. The marketing
plan remains in progress: public-page recheck, first-time-user walkthrough, recorded
native demo, custom social preview and organic outreach are follow-ups. No remote CI,
first-run user study or full marketing-launch completion is claimed.
`recommended_next: none` for this implementation slice; delivery requires authorization.

## ECC/I2P competitive research verification — 2026-10-26

Scope: critical comparative analysis and core-preserving recommendations, not implementation
or proof of comparative coding performance. Criteria/research fact-check verdict are in
the matching section of `review.md`. `itp-verify` and its verification child were loaded.

- ECC source snapshot verified as `25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b`;
  I2P public baseline `7d3aa9a` fetched. Inspected local runtime files match that baseline.
- Parent source-path/range check: 55 ECC and 23 I2P immutable blob citations resolve to
  files in the pinned Git trees; numeric line ranges valid; two local report links exist.
  Snapshot/scope disclaimers and whitespace checks passed. This checks references, not
  every interpretive conclusion; skeptical source fact-check and parent inspection supply that.
- Fresh local script suite: 89 passed, zero failed. Fresh final contract check: 63 passed.
  Logs: `/tmp/opencode/i2p-competitive-tests.log` and
  `/tmp/opencode/i2p-competitive-contracts-final.log`. Not counted as native agent trials.
- ECC code/installers/hooks/tests were not executed; remote CI status is observed evidence
  only. Popularity counters are dated observations, not adoption or outcome measurements.
- No head-to-head run, external user study, security exploit test or hosted-service audit.
  Proposed evaluation and 12-week sequence are recommendations, not completed work.
- Existing `TODO.md` remains unchanged/uncommitted; only report/evidence/index docs changed.

Verdict: pass for scoped research documentation and factual evidence checks. Neither
product is declared empirically superior at coding tasks. No runtime/dependency changes,
commit, push or remote publication performed. Full product improvement requires separately
approved work and the proposed native/user evaluation.

## Skill Watch source triage — 2026-10-26

Scope: inspect latest issue #9 for approved-skill updates and useful new candidates;
user explicitly withheld permission to install or integrate. Outputs are
`SKILL-WATCH-2026-10-26-UPDATES.md` and `SKILL-WATCH-2026-10-26-CANDIDATES.md`.

`itp-verify` and its verification child loaded. Fresh contract check: 63 pass. Source
triage uses exact snapshot links, directory comparisons for existing updates, and static
entry-document/tree/prerequisite review for candidates. Parent spot-checked new review
dispatch text and wizard file-writing code. Candidate-note source blob links use 40-char
revisions; scope/prerequisite/license caveats and report whitespace checked.

No candidate/upstream skill code was executed or loaded as instructions; no native
compatibility or full candidate-license/security approval is claimed. Missing sandbox,
packaging, permission and host prerequisites remain explicit. Registry, lock, adapters,
installer and installation configuration have no diff. Only research notes and this
evidence record changed. No installation, integration, repin, remote mutation or commit.
Verdict: source-review recommendations only; any adoption/update requires user approval
and separately scoped behavioral verification. This is not implementation acceptance.

## tstack + issue #9 integration planning — 2026-10-26

Scope: user requested a combined integration plan, not installation or implementation.
Outputs: `agent-work/plans/TSTACK-SKILL-WATCH-INTEGRATION.md`, its index pointer, and
`docs/work/TSTACK-INTEGRATION-RESEARCH.md`. Prior Skill Watch notes remain unchanged.

Planning acceptance: account for all nine upstream skills; specify lifecycle ownership,
dependencies, authority/host/packaging gates, issue #9 update/candidate sequence, acceptance
cases and rollback. The plan has a disposition for all nine, including explicit blockers
for unchanged full-workflow adoption rather than claiming all-nine compatibility.

Fresh evidence:

- Read-only GitHub API recheck: issue #9 unchanged at `2026-10-26T12:24:39Z`, three comments.
- tstack source fixed at `7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd`. Research read the
  complete source; parent independently checked its complete non-truncated tree: nine
  skill entries, 16 regular blobs, no symlinks/submodules. All 16 immutable file citations
  resolve to that tree; all nine skills appear in the research and plan matrices.
- Parent spot-read upstream full-send authority and watcher query/check/readiness code;
  confirmed broad testing grant and that helper readiness is not a complete merge gate.
- Assertion checks passed for local Markdown links, whitespace, issue-upgrade coverage,
  approval boundaries and rollback. `git diff --check` passed.
- `node tests/skills/check-contracts.mjs`: 63 passed.
- `node --test tests/scripts/content-assertions.test.mjs tests/scripts/check-contracts.test.mjs`:
  18 passed, zero failed. Logs under `/tmp/opencode/tstack-plan-*.log`.
- No diff in registry, lock, generated dependency JSON, adapters, installer or install config.

`itp-verify` and its evidence child consulted. Evidence supports the scoped planning/source
checks, not implementation acceptance: no implementation-slice tests or review verdict
establish native adoption. Candidate code was not executed or loaded as instructions;
no installations, integrations, pin changes, live PR operations, commits or remote writes.
Native host/model routing, watcher behavior, permission adaptations and external service
terms remain unverified; the plan names their approval/test gates. Full script suite and
live native trials were not run for this documentation-only change.

## All-nine scope clarification and planning commit — 2026-10-26

User requested a commit and integration of every tstack skill, permitting replacements
where needed. Updated the plan to require all nine as working integration targets;
deferred/blocked/research-only entries cannot satisfy final acceptance. Added replacement
decisions, including evaluating `file-pr` against Matt `pr`, whole-caller migration and
rollback. Preserved permission, primary-review coverage and native-evidence gates.
The earlier research recommendation remains historical; the plan explicitly supersedes
its selective scope. This change commits planning/evidence, not candidate implementation.

Fresh checks: all nine appear once in the routing matrix; required all-nine completion
ledger and replacement/migration gates present; local links/whitespace valid. Contract
checker: 63 passed. Targeted content/contract tests: 18 passed, zero failed. Logs:
`/tmp/opencode/tstack-all-nine-contracts.log` and `tstack-all-nine-doc-tests.log`.
Registry/lock/adapters/installer/generated dependency JSON remain unchanged;
`git diff --check` passed. `itp-verify` and evidence child loaded for this commit gate;
no implementation acceptance or native skill integration pass is claimed.

Commit scope: combined plan, tstack source research, both existing Skill Watch notes,
agent-work index and this append-only evidence. No installation, execution, integration,
repin, push, PR or remote operation is included. Runtime validation remains pending.

## Skill Watch process refresh — fresh implementation verification, 2026-10-26

Slice: `ISSUE-SKILL-WATCH-PROCESS-REFRESH.md`, AC 1–6. Base `59170e7`, uncommitted
working tree on `integration/skill-watch-process-refresh`. User approved starting the
plan and explicitly confirmed installer/hash and native-output test seams. This entry
supersedes the prior planning-only runtime-pending status for these three updates only.

`itp-implement`/`tdd`, independent two-axis `itp-review`/`code-review`, triggered
`agentic-eval`, and `itp-verify`/`verification-before-completion` ran. Final review/evidence
details: `review.md` and `tests/skills/results/2026-10-26-process-refresh.md`.

Fresh post-review checks and observed results:

- `TMPDIR=/tmp/opencode npm test`: 89 passed, zero failed.
- `node tests/skills/check-contracts.mjs`: 63 passed.
- Exact lock comparison against the retained base: only `grilling`, `tdd` and
  `diagnosing-bugs` revision/hash pairs changed. Selected metadata and every other entry
  unchanged. All three old/new source directories differ only in `SKILL.md`.
- Regenerated `dependency.json`: no diff. Registry, adapter contracts, installer and
  scripts unchanged. Ownership/invocation remain intact.
- Proposed distribution built with all 26 upstream bundles hash-verified; strict fresh
  repo-local/global installs exited 0. Post-review strict reruns succeeded. Final assertions
  verified all 52 installed directory hashes across both scopes and confirmed selected
  real user-global skill hashes are unchanged. No asset published or live installation refreshed.
- Native OpenCode v2.1.3 / `openai/gpt-6.1-sol` paired baseline/updated probes observed:
  yes-aligned provisional grilling questions; per-seam TDD catches/misses plus approval;
  diagnosis mutation diff before real red, clean restoration and real green. Parent and
  independent Spec reviewer inspected actual native tool calls, not emulated loading.
- Updated grilling output shape check passed: three questions, no missing recommendation.
- Native small golden session `ses_e87546754ffeU2ltdvIT8dTSZB` loaded installed updated
  TDD, completed three actual red/green cycles, real parallel independent reviews and fresh
  post-review verification. Five tests passed; parent independently reran them and diff
  checks. Actual root/adapter chain, phase skips and inline-AC artifacts inspected.
- Parent compared restored diagnosis source/pristine bytes and original untracked notes;
  all preserved. Native denials/setup failure remain disclosed in the result record.
- Local docs links/whitespace and `git diff --check` passed. Final source hash/installation
  assertions ran after review. Native trace SHA-256 manifest retained in the fixture tree.

Logs/artifacts: `/tmp/opencode/process-refresh-validation/`, including
`final-script-tests.log`, `final-contracts.log`, `final-install-{repo,global}.log`, paired
native traces, `golden.jsonl` and `trace-sha256.json`. Durable native session references,
key excerpts and review timing are in the dated result record.

Verdict: **pass for this first approved-process refresh slice**. Six acceptance criteria
have scoped evidence; independent reviewers found no implementation blockers. Parent
checked final evidence/status-only additions after the snapshot re-review. No framework
commit, push, PR, release or real-global installation change occurred. All nine tstack
skills remain pending adoption; next slice is `leaving-pr-comments` preparation/integration.

Limits: single paired samples and one bounded golden observation, not repeatability or
cross-host certification. Existing authentication/session storage reused; temporary HOME
and permission rules are not an OS sandbox. Other issue #9 updates remain pinned. No
security guarantee, unsupported runtime support or complete all-nine integration claimed.

### Process-refresh commit gate

User subsequently authorized the framework commit. Fresh `npm test`: 89 passed, zero
failed; contract checker: 63 passed; exact comparison against HEAD confirms only the three
reviewed lock entries changed. `git diff --check` passed. Logs:
`/tmp/opencode/process-refresh-validation/commit-script-tests.log` and
`commit-contracts.log`. Planning/slice status wording now reflects commit authorization;
no runtime changes followed independent review. Native/installer evidence above remains
the retained acceptance evidence; those trials were not rerun solely for the commit.
Commit excludes pushes, publication, live installation changes and tstack adoption.

## tstack leaving-pr-comments — verification in progress, 2026-10-26

Scope: `ISSUE-leaving-pr-comments-adoption.md`, AC 1–7; base `cc49991`, uncommitted
working tree on `integration/tstack-pr-comments`. User authorized continuation and the
bundle/install, manual-update and fake-GitHub native test boundaries. Standard scale:
the external-write/trust-boundary routing needs specialist review, not a small wording pass.

Independent Standards, Spec and differential/adversarial reviews now approve the bounded
implementation, after their initial findings were fixed. Details and actual snapshot
ranges are in `review.md`; all ten scoped ASI controls and limits are in
`leaving-pr-comments-security.md`. `agentic-eval` distinguishes actual tool observations
from declarations, retained deviations and universal claims. `itp-verify` and its required
fresh-evidence child loaded; no PR body/comment delivery is requested for the real framework.

Fresh post-review checks already observed:

- Full script suite: 95 passed, zero failed (`final-tests.log`).
- Contract checker: 67 passed (`final-contracts.log`). Registry JSON agrees with Markdown.
- Only one new lock entry; every existing pin equals base `cc49991`. Adapted directory
  hash matches all installed copies. Original entry, metadata and MIT notice were
  byte-verified at the exact upstream commit; installed hash covers local guards as well.
- Unpublished local distribution built successfully; strict fresh repo-local/global-scope
  installs and post-review strict reruns exited 0. All 54 upstream/vendored hashes across
  the two scopes match. Packaged `itp-verify` is byte-identical to the changed source;
  actual user-global comment-skill state is unchanged.
- Public repin CLI direct/bulk and separate monitor tests exercise reviewed maintenance
  behavior with fake tools/no ambient token. Real red/green evidence covers direct guard,
  bulk source selection, graph introduction and inherited Git-variable preservation in
  the reproducible test constructor. No unreviewed installer/runtime service was added.
- Parent checked actual native test-before-specialist ordering and selected skill body
  bytes in authorized/error/receipt/replay traces, not manual procedure emulation.
  Native primary host/model: OpenCode v2.1.3 / `openai/gpt-6.1-sol`.
- Authorized routing posts one fake attributed body; separate receipt/status saved. A
  denied delivery-record write resumed without repost. Non-triggers make no fake write;
  missing skill, incomplete target/identity/tool/authority, unsafe direct preflight,
  failed post and absent/mismatched receipt all hand off rather than invent success.
- Exact twelve-case prompts/context/config/application inputs are retained under
  `tests/skills/fixtures/`; parent compared them to the actual temporary fixture inputs.
  Fresh native replay from the retained constructor/inputs passed. Constructor's foreign
  Git paths and existing-destination protection have executable regression coverage.
- `git diff --check`, local links and source/pin assertions passed. Trace fingerprints
  retained at `/tmp/opencode/tstack-comments-validation/trace-sha256.json`.

Native evidence/IDs, including failures and disclosure limits:
`tests/skills/results/2026-10-26-leaving-pr-comments.md`. Logs and request ledgers:
`/tmp/opencode/tstack-comments-validation/`, including `post-review-install-{repo,global}.log`.
Fake receipts are not live GitHub proof. The opaque-original-author harness case is a
synthetic context branch, not proof a host hid the current formatter's model. Unsafe
lifecycle verification stopped before specialist loading; direct specialist preflight
is separate. One unnecessary `pr` load and an ambiguous-body expansion remain disclosed.

Remaining gate at this point: the existing small-localized-change golden regression with
the changed adapter contract, followed by inspection/fresh close-out. Its input config,
prompt and context are retained in `tests/skills/fixtures/pr-comments-golden.json` with
setup instructions. No all-nine acceptance, live publication, real-global installation,
commit or push is claimed. Final verdict remains pending until that gate is examined.

### Final leaving-pr-comments closure

The remaining small-golden gate passed natively, session
`ses_e86dd586cffe5xp2NKSgb7GCLg`, against the changed installed verification adapter.
Root recorded small/spec-lite/inline acceptance and three actual red/green cycles, then
two independent reviewers overlapped and approved before fresh verification. Parent
examined the real trace/ledger/artifacts and independently reran the four tests and diff
check: all pass. Notes/config bytes are unchanged; notes remain untracked. No comment
grant existed, so neither the new specialist nor a posting command ran.

Retained golden config/prompt/context match launched inputs exactly. They expose the
reviewer permission limitation (local Git mutation commands are allowed even though their
observed behavior is read-only); the previous evidence's stronger claim is corrected by
an append-only clarification. No host/runtime enforcement guarantee is inferred.

Closure source suite `closure-tests.log`: **95 passed, zero failed**; contracts
`closure-contracts.log`: **67 passed**. Fixture JSON, docs links/whitespace, source/pin
checks and existing-pin preservation pass. Logs/native artifacts and trace fingerprints
remain under `/tmp/opencode/tstack-comments-validation/`; durable input/setup and session
evidence are under `tests/skills/fixtures/` and the dated result record.

**Verdict: pass for this bounded first tstack adoption slice (AC 1–7).** Review findings
were resolved; no blocking implementation finding remains. Parent inspected final
golden/evidence/status-only additions after independent re-review. Live GitHub semantics,
cryptographic identity, prompt-injection resistance, general exact-body/selection compliance,
repeatability and host parity are not established. Retained deviations remain explicit.
No real-global installation, framework commit, push, PR, release or live comment occurred.
One of nine tstack skills is locally integrated/verified; eight remain, starting with
`babysit-pr`. Mainline adoption and consuming-project refresh remain separate actions.

### leaving-pr-comments commit gate — 2026-10-27

User authorized commit and continuation. Fresh full suite: 95 passed, zero failed;
contracts: 67 passed; `git diff --check` passed. Logs:
`/tmp/opencode/tstack-comments-validation/commit-{tests,contracts}-2026-10-27.log`.
Prior temporary raw traces/install fixtures had expired; native results above remain
historical observations, with durable inputs, setup and session references retained.
They were not rerun or relabeled fresh for this commit. No runtime code changed since
independent review; status/evidence wording reflects authorization. No push, global
refresh, live publication or acceptance of the other eight skills is included.

## tstack babysit-pr — fresh local verification, 2026-10-27

**Verdict: pass for bounded local adoption; slice uncommitted.** Invoked `itp-verify`
and its required `verification-before-completion` child after independent Standards,
Spec, differential/adversarial and agent-boundary implementation rechecks approved.
Base `c5b1266`; inputs: actual working-tree/new-file diff, `ISSUE-babysit-pr-adoption.md`
AC1–7, `review.md`, `babysit-pr-security.md`, public tests and retained native fixtures.

### Fresh commands and observed output

- `TMPDIR=/tmp/opencode npm test`: **113 passed, zero failed**, including **17 public
  watcher CLI tests**; no skipped/cancelled tests.
- `node tests/skills/check-contracts.mjs`: **71 passed**, registry/generated JSON and
  28-entry lock consistent, all vendored content hashes verified.
- Python `ast.parse(..., feature_version=(3,10))` for the adaptation and fake CLI;
  JSON parsing for retained watcher inputs, registry and lock: passed, no generated
  bytecode/cache artifacts. This checks syntax compatibility, not a Python 3.10 runtime.
- `git diff --check`: passed.
- Assert-based artifact checks: final helper hash, helper/archive modes, exact original
  guide/helper/license against pinned Git cache, both strict isolated installation hashes,
  all 27 prior pins unchanged, five final native traces/tool order/source selection/
  receipts, no installed fixture modifications or failed/denied native tools, allowed
  fake reads only, unchanged golden note bytes/untracked status and no monitor/comment
  skill in the affected golden: passed.
- Fresh `npm test` in the affected golden: **5 passed, zero failed**; independent
  Standards/Spec reports and native fresh verification already captured after quota resume.

Logs: `/tmp/opencode/tstack-babysit-review/final-validation/npm-test.log`,
`contracts.log`, `artifact-proof.log`. Strict installation root:
`/tmp/opencode/babysit-install-utthe3`; final native root:
`/tmp/opencode/babysit-native-final-xrg1bup3`; golden root:
`/tmp/opencode/babysit-golden-IwkaHJ`. Durable reproduction inputs, exact sessions,
results and honest deviations: `tests/skills/results/2026-10-27-babysit-pr.md`.

### Acceptance mapping

| AC | Evidence and result |
|---|---|
| 1 bundle/registry/install | Complete adaptation plus unchanged archives/MIT license, executable mode, manual pin, generated registry and conditional owner; both strict scopes pass with exact hashes; prior pins preserved |
| 2 bound target/response | Public invalid/nonfinite input, host/URL mismatch, head/base drift, during-check drift and malformed/denied API cases pass; unknown readiness in all receipts; native drift hands off |
| 3 budget/ownership | Public hung descendant, cancellation/released ownership, uppercase duplicate owner and retry-backoff tests pass; pending sleeps expire; native deadline is one watch, no extension |
| 4 private state | Mode0700 directory/mode0600 files, descriptor-relative no-follow reads, atomic unique writes; restart, unsafe links/modes, corruption, stale/oversized/context reset preserve unrelated bytes and disclose baseline |
| 5 trust/privacy/unknown | Metadata-only comments/reviews/threads/bot summaries, no raw denied-response bodies, explicit unknown policy; truncated/non-atomic limits documented; event metadata remains untrusted |
| 6 native lifecycle behavior | Final consistent locked fixtures: local pass precedes observation; non-trigger does not load/watch; missing budget blocks without watch; deadline stops once; changed head yields fresh review/verify handoff; no actions or merge approval |
| 7 evidence/review/docs | Four independent implementation review approvals, retained fixtures/results/interruptions, affected ordinary golden plus fresh parent suite/contracts, spec/reference/plan/index updated |

No application build/typecheck/UI/browser/DB checks apply: no such runtime was changed;
Node/Python parsing, public CLI tests, graph/install integrity and native behavior are
the relevant proof. No global installation, real PR operation, commit, push or publication.
No post-pass PR/comment/monitor close-out is triggered: this task tests integration and
does not grant live delivery/monitoring.

### Limits and disposition

Provider quota interrupted preliminary reruns/rechecks and the golden; successful
retries occurred after its recorded reset. An old native fixture received new helper
bytes without its new lock hash; that deviation is retained but excluded from accepted
final evidence. Five fresh fixtures rebuilt from the final strict installation match
both lock and helper. Golden used the preceding helper snapshot before exceptional
context preservation; the routed skill/adapter bytes match current source and that helper
was never invoked. Final CLI/native cases cover the helper delta. Golden's note-hash
command was denied; its read fallback and the parent's exact-byte assertion confirmed
preservation. Reviewer read-only behavior is observed, not deterministic Git restriction.

Residual limits: no live GitHub reliability/complete history/host parity, deterministic
prompt resistance/authorization, cross-host locking, hard CPU/memory sandbox or merge
readiness proof. These are explicitly excluded claims, not hidden acceptance waivers.
Two of nine tstack entries are locally verified; seven remain pending. Next planned
slice: `modernize`; watcher commit/publication and real-global refresh remain separate.

### babysit-pr commit gate — 2026-10-27

User authorized commit and continuation. Fresh `TMPDIR=/tmp/opencode npm test`:
113 passed, zero failed; contracts: 71 passed; `git diff --check` passed.
Logs: `/tmp/opencode/tstack-babysit-review/final-validation/commit-tests.log` and
`commit-contracts.log`. Implementation bytes and reviewed hash are unchanged. Prior
native/install/golden evidence is retained above, not relabeled as rerun for this commit.
Only authorization/status wording changed. No push, publication, global refresh or
completion of the other seven tstack skills is included.

## tstack modernize — fresh local verification, 2026-10-27

**Verdict: pass for bounded local adoption; slice uncommitted.** Invoked `itp-verify`
and required `verification-before-completion` after independent Standards/Spec/security/
agent-boundary implementation and test-design reviews approved. Base `a2fc0ad`; inputs:
actual diff/new files, `ISSUE-modernize-adoption.md` REQ1–7/AC1–7, review report, complete
bundle and confirmed public Git/install/native fixtures. This is not a live PR task.

### Fresh proof

- `TMPDIR=/tmp/opencode npm test`: **118 passed, zero failed**, including four public
  modernization fixture tests; none skipped/cancelled.
- `node tests/skills/check-contracts.mjs`: **74 passed**, 29 pinned entries consistent,
  generated registry in sync and all vendored hashes verified. User entry is not an
  adapter child; runtime/root/UI metadata and handoff docs agree.
- Python AST syntax parsing for setup/fake scripts, JSON parsing for inputs/registry/lock,
  and `git diff --check`: passed without generated files. No production Python dependency
  or Python-version runtime proof is claimed by those fixture syntax checks.
- Parent artifact assertions: original guide/UI/license exact; both isolated strict
  install hashes match; all 28 prior pins unchanged; eight selected native cases use
  local skill source and preserve original dirty/untracked bytes and local/remote refs.
  No native push/PR mutation/reset/clean attempt; fake reads allowed only.
- Corrected native local-work path actually fetched before rebasing; parent rechecked
  original contributor, equivalent range-diff and base ancestry. Fresh public one-test
  command passed in the owned rebased worktree, no publication.
- Affected ordinary golden actually completed independent Standards/Spec review and
  fresh verification, with no modernize load. Parent re-ran `npm test`: **5 passed**,
  compared current root/lifecycle/modernize bytes and exact preserved/untracked note.

Logs: `/tmp/opencode/modernize-validation/final-tests.log`, `final-contracts.log`,
`artifact-proof.log`, `final-integrity.log`. Strict install root:
`/tmp/opencode/modernize-install-9fy8u9`; completed assessment/negative native root:
`/tmp/opencode/modernize-native-reviewed-xddqtkxx`; corrected local/root replay:
`/tmp/opencode/modernize-native-final-local-_la4yfks`; affected golden:
`/tmp/opencode/modernize-golden-Mgz1CI`. Exact sessions/prompts/config and raw-path
references are retained in `tests/skills/results/2026-10-27-modernize.md` and its fixtures.

### Acceptance mapping

| AC | Result and scope of proof |
|---|---|
| 1 / REQ1 | Complete manual user-entry adaptation, unchanged guide/UI/license archives, registry/lock/hash and both strict install scopes; previous 28 pins unchanged |
| 2 / REQ1,2 | Explicit local skill loading; root returns recommended_user_skill modernize without recursion; behind-branch context does not trigger; missing-context preflight blocks without guessed target or Git/gh |
| 3 / REQ3 | Native MODERNIZE, REWORK and CLOSE from actual original/current code/base/history, not age/conflict-free Git; recommendation outcomes remain handoffs |
| 4 / REQ4,5 | Public/native owned-worktree rebase preserves dirty/untracked bytes, original branches, author and equivalent patch; actual focused test passes; returns existing review/fresh-verification handoff, no claim those phases passed for this PR |
| 5 / REQ5,6 | Real local Git explicit observed-SHA lease succeeds when supplied; independent writer then advances bare ref; stale lease rejects and collaborator commit remains. This is Git primitive proof, not native/live publication |
| 6 / REQ2,6,7 | Native no-publication/rework/closure boundaries, actual malicious PR-body grant refusal, correct identities/results and next owners; all denials/deviations retained; no unauthorized action attempt in adversarial case |
| 7 / all | Four independent reviews/rechecks, retained fixture inputs/results and deviations, affected ordinary golden, fresh full suite/contracts/integrity proof, declared docs updated |

### Deviations, exclusions and disposition

Initial six native trials encountered narrow read/adapter permissions and were not clean
positive local-rebase evidence. An intermediate native trial proceeded after fetch denial
using already-present objects matched by fresh local-origin reads; independent reviewers
required excluding it from the freshly-fetched-base procedure. A fresh corrected trial
actually fetched/rebased/range-diffed/tested; the earlier deviation remains recorded.
Optional docs/package/ledger reads were absent; final root handoff's origin-URL read was
denied and reported without recursive skill invocation. No hidden successful read claim.

Golden's denied note-hash command and safe read fallback are retained. Reviewers were
instructed read-only/denied edit/delegation, but had fixture Git staging/commit permissions:
observed read-only behavior is not deterministic enforcement. All commits in that golden
are fixture-only, not permission for a framework commit.

No native publication grant or end-to-end review/verify/push for the synthetic PR is
claimed. Rebase returns a pending phase handoff; ordinary phase behavior is separately
exercised by the golden. No live GitHub/fork reliability, deterministic model permission/
prompt resistance, atomic base/head transaction, production code or hard sandbox claim.
No application build/typecheck/UI/browser/DB checks apply: only skills/routing/registry,
documentation and test fixtures changed. Metadata UI files are skill descriptors, not
an application UI. No PR/comment/monitor close-out trigger applies to this maintenance.

Three of nine tstack entries are locally verified. Modernize remains uncommitted;
no real PR operation, global refresh, push or publication occurred. Next planned slice:
`takeover`, with its own authority and validation gates. Six integrations remain pending.

### modernize commit gate — 2026-10-27

User authorized commit only. Fresh `TMPDIR=/tmp/opencode npm test`: 118 passed, zero
failed; `node tests/skills/check-contracts.mjs`: 74 passed; `git diff --check` passed.
Logs: `/tmp/opencode/modernize-validation/commit-tests.log` and `commit-contracts.log`.
Reviewed implementation/hash unchanged; only authorization/status wording changed for
this gate. Earlier native/install/golden evidence remains retained observations, not
relabeled as rerun. Commit excludes push, publication, live PR/global changes and work
on the next slice.
