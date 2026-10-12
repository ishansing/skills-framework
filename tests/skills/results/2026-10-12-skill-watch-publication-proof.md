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

## Workflow-path proof (same day, temp branch)

Proved the GitHub Actions path without touching `master`'s rollout flag: branch
`proof/skill-watch-workflow` set `publication.enabled: true` only, was pushed,
and the Skill Watch workflow was dispatched with `publish: true`
([run 38229699276](https://github.com/ishansing/skills-framework/actions/runs/38229699276),
job `watch`: success).

- The bot ignored issue #8 (owned by `ishansing`, not the configured
  `github-actions[bot]`) and created bot-owned issue **#9** with the managed
  marker — ownership logic working as designed.
- #9 received exactly 1 notification comment with the marker (Monday weekly
  digest); state now `pending: 11`, `notified: 48`, `issueNumber: 9`.
- Temp branch deleted after the run. Duplicate proof issue #8 closed with a
  pointer to #9, which is the canonical bot-owned watchlist going forward.
