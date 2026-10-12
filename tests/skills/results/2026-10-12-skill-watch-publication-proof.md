# Skill Watch live publication proof - 2026-10-12

First authorized live run of the Skill Watch publisher (plan: `SKILL-WATCH-PLAN.md`
rollout proof). Used a temp config copy with `publication.enabled: true` and
`publisherLogin` matching the local token identity; the committed
`skill-watch.json` still has publication **disabled**, and no repo files changed.

## Runs

1. **Dry run** (`--dry-run`): scan usable, 1 unavailable source
   (`discovery:skillsmp`: listing layout yielded no candidates), 8 pending pin
   updates, zero mutations.
2. **Publish attempt 1**: refused — `token identity differs from configured
   publisher; state not advanced`. The temp config still named
   `github-actions[bot]` while the local token belongs to `ishansing`. Guard
   worked as designed; retargeted the temp config (workflow path keeps
   `github-actions[bot]`).
3. **Publish attempt 2**: `Managed issue updated; remote state persisted.`
4. **Repeat publish**: same, with no duplicate notification.

## Remote artifacts (verified via API)

- Issue **#8** `Skill Watch — updates and candidates`: open, contains the managed
  marker; exactly **1** comment carrying the notification marker (weekly digest —
  2026-10-12 is a Monday; 8 pin-update events delivered).
- Branch `automation/skill-watch`, file `skill-watch-state.json`: schema version 1,
  11 sources, `pending: 0`, `notified: 8`, `issueNumber: 8`.

## Repeat-run analysis

The second publish reported 17 pending (`new: 14`, `rising: 3`), all
`discovery:skills-sh` identities unseen on run 1 (newly verified keys within the
per-run verification budget, plus live leaderboard churn and rank movement).
**Zero** of the 17 overlap already-notified IDs, and the comment count stayed at
1 — deduplication held; the new identities are per-design discovery behavior for
a rolling feed, not a re-notification bug.

## Rollout state after proof

- Publisher mechanics proven: managed-issue ownership, per-event markers, stale
  handling, state persistence, idempotent re-runs.
- **Not yet proven**: the GitHub Actions workflow path (checkout/npm/scan/publish
  under `github-actions[bot]`) — code path identical except token identity.
- Committed rollout flag remains **off**; schedule stays paused. Enabling the
  schedule is a separate decision.
