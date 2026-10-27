# babysit-pr differential and agent-boundary review — 2026-10-27

Base: `c5b1266ec69cc4a8743e7f8fbf37ef5be4e6fdcf`, uncommitted watcher slice.
Spec: `ISSUE-babysit-pr-adoption.md`. Source comparison: runnable adaptation against
unchanged `upstream/pr-wait.txt`; main agent independently compared guide/helper/license
byte-for-byte with the exact pinned Git cache. No live PR operations were used.

## Independent reviews

- Standards: `ses_e83a793a0ffeIm31hfTQAv2UHs`.
- Spec: `ses_e83a76d22ffeCgjx5MdkJY1ZX7`.
- Differential/adversarial: `ses_e83a7316cffe0Ig1rPesGWjB67`.
- ASI-rubric trust boundary and agentic-eval: `ses_e83a6fea7ffeuqMiJ8oNFDqjkU`.

Reviewers inspected tracked diff and new untracked files, without editing, delegation
or network. This is independent model review, not deterministic read-only enforcement.
Initial security review classified scope HIGH risk (subprocesses, authenticated reads,
state and routing) but found no confirmed security exploit. Standards/spec/agent review
found concrete correctness gaps; absence of a security exploit did not waive them.

After the fixes below, the same Standards and Spec reviewers independently approved
implementation on recheck. Differential/adversarial and agent-boundary reviewers also
approved the final bundle hash recorded in the lock, with zero remaining blocking findings.
The security recheck reran 14 CLI tests and 71 contracts; three additional state-safety/
retry-budget regressions subsequently passed without changing implementation bytes. Recheck attempts
initially hit provider quota; successful rechecks occurred only after its recorded reset.
These are implementation approvals, not substitutes for native/golden/final verification.

## Findings and implementation response

| Finding | Response and public regression |
|---|---|
| implicit CLI hostname can select another host before URL validation | reject conflicting GH_HOST before reads; pin subprocess GH_HOST to github.com; conflicting-host test red then green |
| case aliases acquire separate local watch locks | canonical repository identity before read/lock/state; competing uppercase-alias test red then green |
| malformed URL/nested response shapes can escape typed result contract | validate PR/comment/review/thread/check shapes before consuming; malformed URL/threads tests red then green |
| failed policy lookup described as known absence | explicit complete/unknown policy state, no inferred empty configured gate; denied-policy test red then green |
| obsolete readiness/body/base-overlap code | remove unused snippet/verdict/reviewed and unreachable base-overlap machinery from adaptation only |
| deadline receipt loses target context | preserve established expected/observed context for exceptional results; deadline-context regression red then green |

## Threats, controls and limits

Remote participants can supply bodies and metadata. Fixed argv commands and separate
GraphQL variables provide no identified data-to-shell path. JSON framing escapes raw
terminal/newline content but is not model prompt-injection enforcement. Body omission
is tested for comments, human reviews, threads and bot summaries; metadata remains
untrusted and the guide requires quoting it as data, not following it.

Other local users cannot normally modify a mode-0700 owner-controlled state directory.
Descriptor-relative no-follow traversal, owned regular mode-0600 single-link files,
exclusive temporary creation and atomic replacement protect state writes. Same-UID
configuration/PATH mutation is not a sandbox escape; this implementation is not OS
isolation. Locks cover one directory, not hosts/accounts/alternate state directories.

Owned subprocess groups are killed on deadline/cancellation; tests observe descendants
no longer running and lock release, without PID-directed termination of other watchers.
Detached descendants, repeated asynchronous signals and arbitrary filesystem stalls are
not proven bounded. CLI output is buffered; monotonic budget tests cover network waits,
retries/sleeps and normal processing, not a hostile memory/resource sandbox.

History/blame: `ed7c6eb` established separate PR-formatting authority; `c5b1266` added
manual vendored comment hygiene and distinct delivery status. New monitoring routing
retains fresh evidence and separate action grants. No validation removal from a prior
security-fix commit was identified. Generic installer and manual-repin owners are reused.
Initial static blast radius: one adapter -> one documented watcher owner; shared `gh`
owns all reads; `private_file` owns four state operations; `fetch_pr` has two poll call
sites; `fetch_checks`, lock and Watcher construction have one caller each. Removed
base-overlap reads reduce the initial five `gh` / three `gh_lines` call-site counts.

## Affected ASI controls (installed rubric, not universal compliance)

| Control | Evidence / limit |
|---|---|
| 01 prompt injection | omitted bodies and untrusted-metadata instructions; no deterministic model barrier |
| 02 tool governance | fixed read argv, host/target/SHA validation; existing gh authentication required |
| 03 agency / 04 escalation | observe/report scope and separate owners/grants; surrounding agent permissions remain host-owned |
| 05 trust boundary | expected/current context binding and repeated sampling; not atomic GitHub evidence |
| 06 logging | structured receipts/private state; not tamper-evident durable audit storage |
| 07 identity | no new cryptographic inter-agent identity claim; existing authenticated gh only |
| 08 policy integrity | deterministic helper limits, explicit unknown policy; prose does not enforce host permissions |
| 09 supply chain | immutable source, adapted-byte hash, manual update protection, archived MIT provenance |
| 10 behavior | budget/cancellation/context drift stop; finite native observations are not universal compliance |

Final installer/native/golden evidence and fresh `itp-verify` are recorded in
`verification.md`; local bounded adoption passed. No live GitHub reliability, complete history, host parity, deterministic
authorization, cross-host ownership, hard resource sandbox or merge-policy proof claimed.
