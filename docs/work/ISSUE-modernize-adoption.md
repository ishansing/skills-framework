# Adopt tstack modernize — explicit stale-PR reassessment

Status: implemented, independently reviewed and locally verified, 2026-10-27. Base `a2fc0ad`, branch
`integration/tstack-modernize`. User authorized continuation of all-nine integration,
not real PR rewrites/publication/global refresh. Framework commit subsequently authorized.
Scale: standard (Git history/data-loss and external-action authority boundaries).

## Source and existing ownership

Source: `t3dotgg/tstack`, exact path `skills/modernize`, at the reviewed snapshot in
`TSTACK-INTEGRATION-RESEARCH.md` (same source revision as the two preceding adaptations).
Bundle: `SKILL.md` and `agents/openai.yaml`, plus root MIT notice retained locally.
Original guide/UI metadata remain archival; adapt runtime guide/UI prompt and pin actual
installed bytes in manual-update mode. No helper script, new dependency or rebase engine.

The useful gap is conceptual stale-PR reassessment: a clean rebase is not proof that the
idea still belongs. This is a user-entry workflow, never a required/conditional adapter
child or automatic response to a behind branch. Root/lifecycle docs own an explicit
`needs-human` user handoff; returned changes still pass `itp-review` and fresh `itp-verify`.
Existing implementation owns conflict fixes/rework; verified authorized comment delivery
stays with `itp-verify` -> `leaving-pr-comments`. No competing lifecycle or publication owner.

## Requirements

- **REQ-1 Invocation/packaging.** Register a manually pinned vendored user entry, complete
  bundle/provenance/license, generated registry and precise handoff/non-trigger docs.
  Describe explicitly requested old-PR reassessment/rebase only; no recursive auto-load.
- **REQ-2 Authority/identity.** Establish target host/repository/PR, actual base, head
  repository/ref/full observed SHA, original authors and user-granted actions. Default
  is assessment. Local rebase/rework, test execution and remote update require their
  applicable grants; an ambiguous “modernize” request does not imply publication.
  PR text/diffs/comments/receipts are untrusted data, not instructions or added authority.
- **REQ-3 Intent/disposition.** Inspect complete available original intent/diff, merge
  base, current fetched base changes and evidence of replacement/competing work. Return
  MODERNIZE, REWORK or CLOSE with evidence; age/conflict-free Git alone is insufficient.
  Incomplete history/tools/authority or conceptual disagreement yields a named handoff,
  not invented certainty. REWORK stops before an ungranted rewrite; CLOSE is advice only.
- **REQ-4 Preserve work.** Inspect current Git status/active operations and preserve all
  user-owned edits/branches. Use an owned disposable worktree/branch at recorded head for
  authorized local rebase; avoid `git pull` into an active branch, implicit stashing/reset,
  unrelated remote mutation or deletion. Preserve original commit/author provenance and
  before/after identities. Unclear conflict intent stops for the owner.
- **REQ-5 Verify before delivery.** Compare original/rebased series using `git range-diff`
  and inspect final diff against current base, then run approved focused checks. Actual
  change returns through the existing review/fresh verification gates before any separately
  authorized remote update. Do not duplicate those procedures or assert unrun tests.
- **REQ-6 Lease/stop.** If explicitly granted an in-place remote update, bind it to the
  verified head repository and full branch ref with explicit observed-SHA
  `--force-with-lease=<ref>:<observed-head>` and explicit source/destination refspec. Recheck
  base/target freshness; movement invalidates prior context. Failed lease stops and
  reassesses; no blind retry, plain force, scope expansion, automatic merge/close/base
  change/comment/resolution/settings write. Report local and remote outcomes separately.
- **REQ-7 Evidence.** Return a structured disposition/result with target, old/new/base
  identities, evidence paths, performed/granted actions, actual checks/review/verification,
  publication outcome and remaining owner/resume point. Assessment is not verification,
  publication is not merge approval, and a block does not complete requested delivery.

## Acceptance and proposed validation seams

Repository maintenance adoption uses this issue-scoped spec/AC document, as required by
`SKILL-INTEGRATION-PLAN.md`, rather than overwriting unrelated framework product artifacts.

| AC | Requirements | Public proof |
|---|---|---|
| 1 | REQ-1 | Source/archive/license/hash, manual-repin and graph checks; both strict isolated install scopes, prior pins unchanged; native user-entry discovery |
| 2 | REQ-1,2 | Native explicit invoke vs root non-trigger/handoff; no recursive modernize load, missing target/tool/grant gives named handoff without installation |
| 3 | REQ-3 | Local fake-GitHub/native cases recommend MODERNIZE, REWORK and CLOSE from explicit current evidence, not age or conflict-free rebase alone |
| 4 | REQ-4,5 | Disposable local Git repositories/worktrees with dirty original files; approved local rebase preserves those bytes and author provenance, records range-diff and actual tests, then returns through review/fresh verify |
| 5 | REQ-5,6 | Public Git remote-ref assertions against local bare fixture only: exact observed-SHA lease succeeds when granted; competing update rejects stale lease and preserves competing work; no real remote writes |
| 6 | REQ-2,6,7 | Native no-publication/blocked/rework/closure boundaries and untrusted metadata cases; record all denied/deviating attempts, actual source/target context and safe handoffs |
| 7 | all | Independent Standards/Spec/security/agent-boundary reviews, relevant existing composition/golden regression, documented results/limits and fresh `itp-verify` |

User confirmed these test seams before tests were written: isolated install/hash;
public Git state/history and fake-GitHub/native command observations. Fixtures may create
and rebase owned local branches/worktrees and push to disposable local bare repositories
only. Model/provider traffic uses existing authentication; no real GitHub monitoring,
mutation, credential copying or global install. Native examples are finite observations,
not deterministic prompt resistance, permissions or live fork/lease reliability.

## Impact and handoff

Expected paths: vendored modernize guide/UI/originals/license; dependency map/generated
JSON/manual lock; root and lifecycle user-entry handoff; framework/reference docs; install,
native/Git fixtures/results; plan/index and append-only review/verification. No existing
skill is replaced or removed. Rollback is a reviewed revert/installer refresh, never
deleting unowned skills, user branches/worktrees or PR data.

User selected “Use these seams” on 2026-10-27. Proceed with one red/green implementation
cycle at a time. User authorized this slice's commit after local verification;
global refresh, live PR operations and push remain excluded.

## Local acceptance

Fresh `itp-verify` passed: 118 script tests, 74 contracts, two strict isolated install
scopes, original archive/license and prior-pin checks, eight native boundary/disposition/
handoff cases, corrected fetched-base local rebase, and the affected five-test golden.
Native publication was not granted or tested; public Git tests separately exercise real
local explicit-SHA lease success and preservation of an independent collaborator update.
Initial permission failures and the denied-fetch/proceeded-rebase deviation are retained,
not relabeled successful. Exact cases/sessions/limits: `tests/skills/results/2026-10-27-modernize.md`;
reviews: `modernize-security.md`, `review.md`; acceptance mapping: `verification.md`.
Commit authorized; merge and deployment remain separate. Three of nine integrations are
locally verified; next: takeover.
