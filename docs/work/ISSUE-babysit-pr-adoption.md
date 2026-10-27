# Adopt tstack babysit-pr — bounded observation

Status: implemented, independently reviewed and locally verified, 2026-10-27. Base `c5b1266`, branch
`integration/tstack-babysit-pr`. User authorized continuation and confirmed install/hash,
public watcher command with fake GitHub, and native routing/stop/handoff test seams.
Scale: standard (remote-read, local-state and agent-action trust boundaries).

## Ownership and design

Use the same reviewed tstack snapshot as `leaving-pr-comments`, selected by repository
and exact path `skills/babysit-pr`. Retain unchanged original guide/script and root MIT
notice alongside a clearly marked local adaptation; the lock owns revision and actual
installed-byte hash. Manual-update mode prevents automatic replacement of adaptations.

`itp-verify` owns explicit post-verification monitoring close-out. `babysit-pr` is a
model-invoked conditional observer, not another lifecycle or a merger. Its default and
only in-module action scope is observe/report. Repairs, rebases, pushes, comments,
resolution, PR settings and merge require separate grants and return to their existing
implementation/review/verification or comment owner; this module never performs them.

Extend the upstream watcher in its responsible layer rather than add a new polling
service. Its interface is one GitHub.com target, expected full head/base SHAs and an
explicit finite time budget. Return bounded observation/deadline/blocked/stopped results,
always with merge readiness unknown. Remove its partial ready/green gate from the adapted
interface; do not reproduce a GitHub merge-policy engine. The original remains archival
data, not an alternative executable fallback. Python 3/POSIX and existing authenticated
`gh` are preconditions; no installation or credential expansion is implicit.

## Acceptance

1. Complete vendored bundle, provenance/license, executable helper mode, registry/lock,
   generated JSON and conditional adapter routing agree; strict installs work in both
   scopes without changing the real user's installation. Existing pins remain unchanged.
2. Watcher requires valid target/head/base and a positive finite budget, rejects URL/repo
   mismatch before querying another target, and stops for changed head/base or invalid
   response. No exit code/result is a merge approval. Unsupported host/tool yields handoff.
3. Budget covers initial reads, retries, sleeps and hung CLI calls. Cancellation/expiry
   terminates owned subprocess groups, releases local ownership and never kills another
   watcher. One watcher owns a PR in its state directory; no second polling loop/service.
4. State is private, owner-controlled and symlink-safe; atomic writes preserve unrelated
   files. Stale/corrupt/different-context state becomes a disclosed new baseline, not
   old verification evidence. Restart can report events arriving between watches.
5. Default events omit review/comment bodies and private bot-summary text. Remote text
   and receipts are untrusted data, never action grants. Permission/policy-read failures,
   truncated-history limits and non-atomic status sampling remain unknown, not ready.
6. Native positive/non-trigger/blocked/expiry/context-drift cases use actual loading and
   local fake GitHub only. Monitoring cannot fix/post/resolve/rebase/merge or silently
   continue beyond its budget. Verification and monitoring outcomes stay separate; action
   findings hand off with current source context, not stale pass claims.
7. Tests exercise the public CLI and install/native seams, not private watcher methods.
   Preserve exact reproducible fixture inputs, failures, commands and session references.
   Independent standards/spec/security/agent-behavior review, affected golden regression
   and fresh verification precede local acceptance. No live PR monitoring is authorized.

## Scope of proof and handoff

CLI tests catch process/target/state and event regressions, not GitHub consistency or
host authorization. Native cases are finite observations, not deterministic prompt
enforcement. Private temporary state is not OS isolation. Existing `leaving-pr-comments`
remains the separately authorized comment owner, never a monitoring side effect.

Update owning adapter/spec/reference, cases/results and plan/index. Rollback is a reviewed
revert and verified installer refresh, never deleting unowned global skills or watch state.
Framework commit authorized by the user on 2026-10-27; push/publication/global refresh
remain excluded.

## Local acceptance

Fresh `itp-verify` passed with 113 script tests (17 public watcher tests), 71 contracts,
both isolated strict install scopes, unchanged archives/license/prior pins, five final
native cases and the affected small golden. Details, interruptions, fixture correction,
session references and explicit proof limits: `verification.md` and
`tests/skills/results/2026-10-27-babysit-pr.md`. Commit authorized; no live PR,
publication or global refresh was performed. Seven tstack integrations remain pending.
