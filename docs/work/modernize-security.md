# modernize differential and agent-boundary review — 2026-10-27

Base `a2fc0adef418cb1177050df16f9a940a83110bcc`; uncommitted maintenance slice.
Spec: `ISSUE-modernize-adoption.md`. Original guide/UI/license compare exactly with
the reviewed pinned local Git cache; the lock hashes actual adapted bytes.

## Independent review and response

- Standards `ses_e828850bdffetbgBw1ynIRxwWe`: implementation approved; no documented
  violations or material heuristic smells.
- Spec `ses_e828824e2ffeDvhdY5Oeejmvot`: initially required author-provenance assertions
  and actual adversarial PR content; recheck approved after those additions.
- Differential/adversarial `ses_e8287f522ffe1RIVkc3METFn8x`: zero confirmed vulnerabilities;
  initial conditional approval and focused fixture recheck approval.
- Agent-boundary/agentic-eval `ses_e8287afb6ffeeEXl0N1tGbpUm3`: no authority defect;
  preservation/non-trigger/adversarial coverage corrected, implementation/design approved.

Reviews used tracked diff plus untracked files, without edits, delegation or network.
They are independent model reviews, not deterministic read-only enforcement. Runtime
skill bytes stayed unchanged while tests and fixture permissions were improved.

Public assertions now cover literal rebased author, dirty/untracked bytes, original refs,
meaningful range-diff equivalence and an independent collaborator's local-remote update
before stale-lease rejection. Adversarial PR text is actual fake metadata, not merely a
warning in the prompt. Native negative cases include behind-branch non-trigger and
untrusted grant attempts. Git primitive proof remains distinct from agent publication.

## Threat analysis and blast radius

Remote PR authors may control text, diffs, reviews and fork refs. They do not supply
rewrite/publication grants: the guide separates assessment, local changes, tests and
remote update, establishes host/head-repository/full-ref identities and preserves original
authors/current base invariants. Remote instructions and receipts remain data. No new
rebase engine, execution service or runtime authorization layer was introduced.

Concurrent local work is protected by prescribed status/operation inspection and an owned
disposable worktree, not stash/reset/pull or unowned cleanup. Ambiguous conflicts stop
for the owner. These are instructions plus finite observations, not guarantees against
arbitrary same-UID mutation. Parent assertions measure actual preserved files and refs.

Concurrent remote writers are protected by Git's explicit full-ref/original-observed-SHA
lease when correctly supplied, plus an explicit source/destination refspec. A failed lease
stops without refreshing the expected SHA and blindly retrying. Current review/fresh
verification and frozen content precede separately granted publication. A head lease does
not atomically protect the base ref: movement after the last read remains a cross-ref
race, not solved here or represented as live readiness proof.

History/blame: the user handoff follows the `implement-spec`/`retro` precedent from
`ed7c6eb`; manual adaptations follow `c5b1266`/`a2fc0ad`. No removed security fix or
validation regression was identified. Blast radius: one new lifecycle user-handoff site,
reached through the existing root pointer; zero adapter modernize children. Generic
installer/hash/registry/manual-repin owners are reused. Fixtures are test-only.

Fixture setup refuses existing outputs, constructs local repos, disables hooks for setup
Git commands and excludes inherited Git configuration. Fake GitHub uses no network client
and accepts fixture-bound reads. Cleanup is scoped to owned temporary parents. Source
bundles/PATH/fixture JSON and same-UID filesystem access are trusted infrastructure,
not a sandbox for hostile local users or arbitrary source bundles.

## Affected controls (installed ASI rubric, not universal compliance)

| Control | Scoped evidence and limit |
|---|---|
| 01/05 input/trust | remote text is data, not grants; finite adversarial observation, not deterministic prompt protection |
| 02/03/04 tools/agency/escalation | user entry, separate grants and existing owners; host permissions remain external to prose |
| 06 audit | structured dispositions and actual evidence; no tamper-evident durable audit claim |
| 07 identity | existing target/author identity checks; no new cryptographic agent identity |
| 08 policy | intent-based disposition, review/verification and explicit lease; no deterministic model choice or atomic head/base transaction |
| 09 supply chain | immutable archives, MIT notice, adapted hash and manual repin protection; no signing claim |
| 10 behavior | stop on missing context/authority, disagreement or failed lease; no runtime anomaly detector |

## Behavioral deviations and limits

Initial native read/adapter permission denials are retained as blocked/deviating trials.
An intermediate local-rebase trial proceeded after denied fetch using existing objects
matched by fresh origin reads. Reviewers explicitly excluded it from clean fetched-base
proof. A corrected fresh fixture actually fetched, rebased, range-diffed, preserved author
and user work, ran its test and handed off review/verification without publishing.
Root handoff's optional origin-URL read was denied and reported, without recursive load.
Absent optional fixture docs/package reads are not successful verification evidence.

These finite guided observations do not prove deterministic authorization, model-wide
prompt resistance, live fork/host correctness, atomic-base freshness or live reliability.
Native grants exclude push/closure/merge. Public tests prove correctly supplied lease
primitives, not autonomous publication selection. Fresh parent verification remains the
separate final gate; its local pass, evidence and session references live in the dated
results and `verification.md`. No new security or behavioral guarantee follows from that pass.
