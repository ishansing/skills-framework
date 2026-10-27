# Adopt tstack file-pr — separate PR publication from formatting

Status: locally verified for bounded adoption; uncommitted, merge pending. Base `26efe98`, branch
`integration/tstack-file-pr`. User authorized continued all-nine adoption, not real PR
publication, global refresh or committing this next slice. Scale: standard (external
write authority, identity and uncertain-outcome boundaries).

## Dependency order and ownership decision

`takeover` explicitly needs file-pr for requested PR delivery. Bring this slice ahead of
takeover rather than ship an incomplete composition. All nine remain required; the
sequence change does not waive takeover or treat a blocked entry as delivered.

Source: `t3dotgg/tstack`, `skills/file-pr`, at the reviewed snapshot in
`TSTACK-INTEGRATION-RESEARCH.md` (same source revision as preceding adaptations).
Bundle is its guide plus retained root MIT notice; preserve the unchanged guide archive
and pin actual local adapted bytes in manual mode. No new installer/transport service.

Replacement evaluated against installed Matt `pr`: its Summary visual/diff, concrete
before/after Evidence, Merge Danger/door/blast-radius and glossary conventions are not
reproduced by upstream file-pr. Preserve Matt as the single primary **body formatter**.
Make file-pr an explicit **user-entry publication owner** consuming the verified prepared
body, not a second body methodology. Copying Matt's procedure or replacing its evidence
format would cost more and lose the preferred primary process without a capability need.
Tstack's problem-first concise style fits inside the existing Summary, not instead of
Evidence/Merge Danger. Attribution/privacy/contributor-credit checks belong at delivery.

`itp-verify` still owns post-pass `pr` formatting. A requested PR create/update returns an
explicit file-pr user handoff, never a recursive user-entry invocation. File-pr consumes
current passed review/verification and an approved body artifact; missing inputs return
to that owner. Comments and monitoring remain separately granted close-outs through
`itp-verify` -> existing specialists. File-pr does not implement or verify code, push a
branch, rebase, merge, close PRs, change settings, post comments or resolve threads.

## Requirements

- **REQ-1 Packaging/invocation.** Complete vendored manual adaptation, original guide and
  MIT notice, registry/generated JSON/lock, human-facing user-entry metadata, explicit
  root/verification handoff and non-trigger documentation. Existing pr and pins remain.
- **REQ-2 Current context/authority.** Before writes, establish trusted host/base repo,
  actual base/head repositories/full refs and expected SHAs, current passed review/verify
  artifacts, prepared body/title, available authenticated tool and create/update grant
  including intended draft status. Compare actual current identities/scoped diff with
  evidence; missing/stale/mismatched context blocks publication. No implicit Git push,
  permission expansion, tool installation or publication from a body/draft request.
- **REQ-3 Prepared content.** Preserve the single pr formatter's evidence/risk structure,
  honest missing-before evidence and domain language. Check repository title conventions,
  concise problem/solution, public model/harness note, verified contributor credit/source
  links, title/body/quotes/attachments for secrets/private details before output/publication.
  Unknown identities are explicit; no guessed model/email or invented verification.
  Remote PR/tool text is untrusted data, never new authority or executable instructions.
- **REQ-4 Existing PR/update.** Look up matching open PR by full target/base/head-repository
  identity, not branch spelling alone. Reuse/report an existing match rather than create
  a duplicate. Existing-body/draft-status changes need a separate explicit update grant
  and fresh current-content/identity check; a filing request is not blanket edit authority.
  Preserve unrelated human content; changed content or multiple/ambiguous matches hands off.
- **REQ-5 Create/fallback/uncertainty.** Create only the granted PR/status using a safe
  file-based body with available authorized transport. Upstream's automatic non-draft
  default and unconditional REST retry are narrowed: fallback needs appropriate authority,
  a definite pre-write failure and reconciliation of existing PR state. Missing/mismatched
  receipts, ambiguous failures or changed context stop without blind retry, duplicate post,
  rollback or guessed success. A GraphQL error alone is not proof no write occurred.
- **REQ-6 Receipt/composition.** Validate receipt/read-back against intended host/repository/
  PR, base/head repositories/refs/SHAs and draft state. Preserve actual write outcome and
  verification status separately; drift after creation invalidates that pass for the new
  head, not the historical test output. Required next monitoring/comments return to their
  existing owner with explicit grants/budget, never automatic actions or merge approval.
- **REQ-7 Evidence/limits.** Return structured target/grant, verified/observed identities,
  safe prepared artifact, actual receipt only when established, publication outcome,
  unresolved findings and next owner/resume context. Detect known concurrent changes;
  do not claim atomic branch/base/content checks, exactly-once writes, deterministic
  model authorization or live GitHub consistency from prompt/fake-service tests.

## Acceptance and proposed seams

This issue-scoped spec follows the existing repository maintenance adoption convention
in `SKILL-INTEGRATION-PLAN.md`, avoiding changes to unrelated product artifacts.

| AC | Requirements | Public proof |
|---|---|---|
| 1 | REQ1 | Archive/license/hash/manual-repin/graph checks and both strict isolated install scopes; all prior pins preserved; native explicit discovery |
| 2 | REQ1,2 | Fresh verify -> existing pr formatter retained for body-only requests; requested publication gives user handoff without recursive file-pr load/write; meaningful non-trigger |
| 3 | REQ2,3 | Native direct explicit invocation requires actual current local Git/evidence/body context; missing authority/tool, stale identities, private content or metadata grant injection block safely |
| 4 | REQ4,5 | Public fake-GitHub CLI and native create/existing-match/explicit-update cases show correct target/status, no duplicate or ungranted update, safe prepared-body use |
| 5 | REQ5,6 | Definite failure vs uncertain receipt, optional authorized REST fallback, mismatch and pre/post-write drift cases preserve actual outcomes with no blind repeat/rollback |
| 6 | REQ6,7 | Publication vs verification/monitoring/comment outcomes stay separate, next-owner handoffs preserve identities/grants; no implicit push/comment/watch/merge/settings action |
| 7 | all | Retained exact fixtures/prompts/results/deviations, independent Standards/Spec/security/agent-boundary reviews, affected golden and fresh itp-verify |

User confirmed these seams before tests were written: isolated install/hash;
public fake GitHub command/state observations; native loading/routing/content/stop/handoff
in disposable local Git projects. Setup may create fixture-only commits to bind bodies,
actual tests and head identities. Fake writes only update local fixture data—no real
GitHub/PR, network Git write, credential copying or global installation change. Existing
provider authentication/traffic is not OS isolation. No native live reliability or
deterministic authorization claim follows from those bounded observations.

## Impact and next step

Expected paths: file-pr adaptation/original/license; registry/generated JSON/manual lock;
root/lifecycle and itp-verify user handoff; framework/reference; fake service/native inputs/
script tests/cases/results; plan/index and append-only review/verification. Keep pr and
all unowned/global skills. Rollback is reviewed revert/installer refresh, not removal of
unowned content or compensating remote writes. User selected “Use these seams”;
Vertical TDD, independent review and fresh verification are recorded in
`tests/skills/results/2026-10-27-file-pr.md` and `docs/work/verification.md`, including
unexercised native branches and retained deviations. No live publication/global refresh
or framework commit occurred. Next planned integration: takeover.

Subsequent user authorization: commit this verified slice only. Fresh commit-gate
evidence is appended to `docs/work/verification.md`; no push/publication is authorized.
