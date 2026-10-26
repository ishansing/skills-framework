# Skill Watch process refresh — native evidence, 2026-10-26

Scope: the first slice of `agent-work/plans/TSTACK-SKILL-WATCH-INTEGRATION.md`.
Only `grilling`, `tdd`, and `diagnosing-bugs` pins changed. This is not tstack adoption
or proof of all-host/repeated model conformance. Slice/criteria:
`docs/work/ISSUE-SKILL-WATCH-PROCESS-REFRESH.md`.

## Method

Host: OpenCode v2.1.3; model: `openai/gpt-6.1-sol`. Fresh private servers/sessions used
`opencode run --standalone --model openai/gpt-6.1-sol --agent process-probe --format json`.
Each process was bounded by `timeout 240`. Old/new fixture directories contain complete
source directories matching the respective lock hashes. Actual native `skill` outputs
name those fixture-local base directories; no manual content injection stands in for loading.

Fixtures/logs: `/tmp/opencode/process-refresh-validation/`. Exact paired prompts are in
`tdd-prompt.txt`, `grilling-prompt.txt`, and `diagnosis-prompt.txt`; paired raw traces use
`<case>-baseline.jsonl` / `<case>-updated.jsonl`. HOME/config/state are fixture-local;
existing provider authentication/session storage is reused without credential copying.
This is not OS isolation. No real-global installation or remote GitHub operation occurred.

Probe agent permissions deny all by default and allow reads/globs/grep plus only the
named skill. Diagnosis additionally allows editing `labels.mjs`, the exact command
`node --test labels.test.mjs`, and `diff`. No network, subagent, broad shell or interactive
question tool is authorized. Prompts request final-text questions so an unattended CLI
can stop without a human-tool hang; this is a disclosed test accommodation.

## Paired outcomes

| Case | Old-pin session | Updated-pin session | Observed difference |
|---|---|---|---|
| SWP-01 grilling | `ses_e875b9488ffeyfgNKG497a4wMT` | `ses_e875a6f8effeBqD5T97y8ZhOXo` | Old first frontier asks open-ended “what” / “which” questions despite recommendations. New frontier asks three yes-accepts-recommendation questions; recommendations stay provisional and it waits for answers. |
| SWP-02 TDD seams | `ses_e875dd45affei6Cc1kwQ51e2s5` | `ses_e875ce736ffegWELJP66cqPevw` | Same prompt: old proposes two seams without per-seam catches/misses; new adds both for each seam and stops for approval before tests/files. |
| SWP-03 mutation | `ses_e87594d7effeqQYM6FiU47iJEh` | `ses_e87580fa0ffebtIC704JZq0w9s` | Both observe green/red/green. Only new runs pristine diff after mutation, before trusting red, then another diff confirming exact restoration. |

TDD task: plan tests for public `normalizeLabel(text)` and JSON `saveLabels(path, labels)`
read by a fresh process, with no seams approved yet. New output distinguishes normalization
from persistence coverage and explicitly excludes unspecified failure/crash durability.
Grilling task: first frontier for a personal offline notes app, autosave versus Save,
without deciding on the user's behalf. Actual new output passed the existing
`check-grilling-output.mjs` shape checker (three questions, no missing recommendations);
parent inspected the semantic yes/recommendation alignment separately.

Diagnosis task explicitly approves a single `.trim()` sensitivity mutation on an already
green synthetic fix. Source includes a pre-existing `USER EDIT` comment, a pristine copy
and untracked user notes. The test expects `' HeLLo '` to become `'hello'`.
Both native runs observe 1 pass → 1 failure (`' hello ' !== 'hello'`) → 1 pass. Updated
trace orders `patch → diff -u pristine/labels.mjs labels.mjs → failing test → restore →
clean diff → passing test`. Parent independently verifies byte-identical restoration
and unchanged notes. This exercises the forced-mutation branch, not the full diagnosis
process and not a requirement to mutate every test.

### Retained failed setup

An initial grilling process ran in the TDD-only fixture by harness mistake. Its skill
load was denied and it improvised generic questions. Retained trace:
`grilling-setup-error.jsonl`, session `ses_e875c13bcffem3H7LdST6cMyV6`. Excluded from
the paired comparison; the retry changed the working directory, not the prompt or skill.
The old diagnosis run attempted a broad `find` hash command; permission denied it.
The new diagnosis run stayed within the allowed commands. Neither event is hidden or
counted as a successful unavailable-capability handoff.

## Installer/static evidence

Fresh local distribution built from the proposed lock, with all 26 upstream entries
hash-verified. Strict repo-local and isolated-global installs both exited 0; logs:
`bundle-build.log`, `install-repo.log`, `install-global.log`. No asset was published.
`dependency.json` regenerated with no diff; unchanged registry ownership needs no edits.
Every unrelated lock entry and selected-entry metadata other than revision/hash match
base `59170e7`. Full script suite: 89 passed. Static contracts: 63 passed.

## Composition and disposition

SWP-04 completed natively in the strict repo-local installation. Session
`ses_e87546754ffeU2ltdvIT8dTSZB`; trace `golden.jsonl`, prompt `golden-prompt.txt`.
Fixture seed `235d3cf98de4c4a6db900c89b75e209ee465b343`, implementation `d233327`,
final artifact-only commit `b696928`. These are fixture commits, not framework commits.

Actual loaded chain: `idea-to-production`, `itp-slice`, `itp-implement`, updated `tdd`,
`itp-review`, unchanged `code-review`, `itp-verify`, `verification-before-completion`.
The root selected small, recorded align/architecture as unnecessary, used spec-lite and
inline slice acceptance, and did not invoke grilling or create separate architecture/AC
files. Pre-approved public add/lookup seams exercised three observed red/green cycles.
Five final public API tests pass; source/testing changes remain confined to the fixture.

Independent reviewers actually overlapped: Standards
`ses_e87510051ffe35ZbqaqaCVXPIn` ran `1793026097061–1793026145584`; Spec
`ses_e87510050ffeoaWfYh47YxxHy4` ran `1793026097065–1793026124697` (epoch ms).
Spec approved with zero findings. Standards approved with one non-blocking duplication
advisory, explicitly accepted without unrelated refactoring. Fresh `npm test` and diff
checks followed review; the ledger records complete. Parent independently reran the five
tests and diff check and compared untracked user-note bytes to the original.

The native fixture's optional `sha256sum` command was denied; it did not work around the
denial or claim checksum proof. Parent supplies the separate byte comparison. Exact-model
primary runs reuse existing provider authentication; no remote GitHub/push/merge or real
global installation occurred. Fixture agents had local edit/test/Git-commit permissions;
read-only general reviewers had no mutation/delegation grant. This is a bounded observed
golden pass, not a repeated reliability or universal isolation claim.

Independent framework-change review and fresh final verification are recorded in
`docs/work/review.md` and `docs/work/verification.md`. No complete initiative or tstack
integration claim follows from this first process slice.
