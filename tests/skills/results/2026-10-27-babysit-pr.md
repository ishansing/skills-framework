# babysit-pr adoption evidence — 2026-10-27

Base `c5b1266`, branch `integration/tstack-babysit-pr`, uncommitted slice. Scope:
`docs/work/ISSUE-babysit-pr-adoption.md` AC1–7. OpenCode v2.1.3,
`openai/gpt-6.1-sol`; local fake GitHub only, no real PR observation/write. Final adapted
bundle hash: `51d46c684b7bbae1dd753aaa048f0fd0769d56e099c6f613a84afcf57b40463b`.

## Public CLI red/green evidence

Command: `TMPDIR=/tmp/opencode node --test tests/scripts/pr-wait.test.mjs`.
Observed final suite: **17 watcher CLI tests passed, zero failed** within 113 passing
script tests. Initial failures were retained
in this implementation session before their fixes: missing required-budget interface,
head drift, URL/repository mismatch, legacy readiness option, ignored XDG state path,
raw server response leakage, drift during check sampling, implicit host, case-alias
ownership, malformed URL, policy denial described as no policy, and empty deadline
context. Follow-up state/privacy and retry-backoff tests pass without changing the
reviewed helper bytes.

Tests exercise the executable through fake `gh`, not private methods. They demonstrate
owned-descendant deadline/cancellation cleanup, released exclusive ownership, metadata-only
comments/human reviews/threads/bot summaries, private atomic restart state, corrupt/stale/
oversized/different-context baseline disclosure, symlink/mode/hardlink refusal preserving
unrelated files, finite/invalid argument rejection, base/head binding, failures/conflicts
as blocked, explicit unknown policy and no readiness approval. No branch-coverage or
hard CPU/memory sandbox measurement is claimed.

## Strict installs and source

Isolated root `/tmp/opencode/babysit-install-utthe3`; source checkout installer was run
with isolated HOME/cache, `--init --strict --skills-scope repo` and `global` on distinct
targets. Subsequent owned refreshes used the same strict scope flags after reviewed
helper changes. Final logs: `repo-install-final.log`, `global-install-final.log`.
Both scopes match the final adapted hash; helper mode 0755, archived helper 0644 with
no executable bits. All 27 prior lock entries compare exactly with the base lock.
Original guide/helper/license compare byte-for-byte with the pinned upstream Git cache.
No real-global installation or credentials were changed/copied.

## Final native cases — consistent fresh strict-install fixtures

Raw root `/tmp/opencode/babysit-native-final-xrg1bup3`; each case has `trace.jsonl`,
`trace.stderr`, isolated HOME/state/bin/config, exact saved prompt/context, local evidence
and networkless `gh-reads.jsonl` when reads occurred. Exact retained inputs/config/setup:
`../fixtures/pr-wait-inputs.json` and `../fixtures/PR-WAIT-README.md`.

| Case | Actual native session | Observed outcome |
|---|---|---|
| positive | `ses_e82d3821affe0XuXITAEn108q5` | Fresh local test pass, verification child and local monitoring skill; one 1-second watch returns `observed`/exit 0; new comment/review/thread/bot metadata; no body leakage or follow-up action |
| non-trigger | `ses_e82d3866dffe3mp2eIrpYOm1Sw` | Fresh local pass; no monitoring load/watch/delivery |
| missing-budget | `ses_e82d38697ffeNtsUgs7hcVMvH9` | Fresh local pass; adapter returns missing-budget `needs-human` without specialist/watch or assumed grant |
| deadline | `ses_e82d3869bffeV5VOH0Xo6hwMZa` | Fresh local pass; one watch exits 124/deadline with bound expected/observed context, no restart |
| context-drift | `ses_e82d3868effeDn4it99QLMI2o2` | Fresh local pass; one watch exits 1/blocked, expected a-head vs observed c-head, b-base unchanged; fresh review/verification handoff |

Native traces confirm test execution precedes watcher invocation, local specialist source
selection, at most one non-help watcher call, no denied/failed tool calls or unauthorized
actions, and allowed fake reads only. Script/lock hashes match in all five fixtures and
Git reports no installed skill/lock modifications. Readiness stays unknown; monitoring
and verification remain distinct. Synthetic PR a/b/c identities are not real Git commits.

## Retained interruptions and fixture correction

Initial five observations in `/tmp/opencode/babysit-native-eay4hyjz` behaved as expected
on earlier helper bytes. Final-byte attempts there and independent rechecks then hit
provider quota; no failed provider run is counted as behavioral evidence. After the
recorded quota reset passed, rechecks succeeded. A first successful rerun copied only
the final helper into those old fixtures, leaving their old lock hash: it is retained
as a setup deviation and is not the accepted final install/native proof. All five cases
were therefore rebuilt from the final strict installation at the fresh root above.

## Affected small golden

`/tmp/opencode/babysit-golden-IwkaHJ`, session `ses_e839f05d1ffevwvt9S7mINcx6I`;
inputs/config reuse `../fixtures/pr-comments-golden.json` and the existing golden setup.
Seed `5e98ca6fc81f7ed5e9ff7ffc8073eca98316c920`, fixture-only implementation `69fa2dd`,
evidence commit `63a4b0b`. Actual root/slice/implement/TDD/review/verify loads observed.
Three red/green cycles cover add normalization, lookup and non-string rejection; final
fresh `npm test` after resume: **5 passed, zero failed**. Independent Standards
`ses_e839c490effe3pN51TRyDYNBsQ` passed with one optional duplication advisory; Spec
`ses_e839c490affeiz6UOuLQxtd7we` approved with zero findings. Note bytes match retained
input and remain untracked. Neither monitoring nor comment specialist loaded.

Golden's `sha256sum user-notes.txt` attempt was denied by the deliberately narrow shell
allowlist, then the agent safely read the note and continued. Provider quota interrupted
after reviews; `resume-after-reset.jsonl` contains fresh verification, not an invented
uninterrupted pass. Reviewers were instructed read-only and denied edit/delegation tools,
but inherited fixture Git stage/commit permissions; this is observed behavior, not
deterministic read-only enforcement. Fixture commits do not authorize framework commits.
Golden installed the preceding helper hash `c73d17…c14ac9`; its routed adapter/skill bytes
match the final source, and it never invoked that helper. The later change only preserved
exceptional helper result context; final CLI and five fresh native cases cover that delta.

## Limits and verdict

Independent Standards/Spec/security/agent-boundary implementation rechecks approved;
reports and references: `docs/work/babysit-pr-security.md` and `docs/work/review.md`.
Fresh parent `itp-verify`: **pass**. `TMPDIR=/tmp/opencode npm test`: 113 passed;
`node tests/skills/check-contracts.mjs`: 71 passed; Python 3.10 syntax/JSON parsing and
`git diff --check` passed. Final artifact assertions rechecked both installed hashes/modes,
all 27 prior pins, unchanged archives/license, five native tool sequences/source selection/
receipts, golden note preservation/non-triggering and fresh five-test golden output.
Logs: `/tmp/opencode/tstack-babysit-review/final-validation/{npm-test,contracts,artifact-proof}.log`.
Acceptance mapping and final verdict: `docs/work/verification.md`. These guided
finite native observations do not prove model-wide authorization, prompt-injection
resistance, live reliability, cross-host ownership, complete history or merge readiness.
No real PR action, push, publication or global refresh; watcher commit authorized 2026-10-27.
