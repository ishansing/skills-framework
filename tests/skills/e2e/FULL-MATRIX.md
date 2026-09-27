# Full-Matrix E2E: team-workspaces

One lifecycle engineered so every framework skill has a natural trigger. Sandbox:
`~/itp-e2e-app` (see `setup-e2e.sh`). Human-run: interviews, wizard steps, one merge
conflict, and the setup skill all need a person.

```yaml
case: full-matrix-e2e
scale: standard
goal: "Production sends invitation emails twice (cause unknown; `npm test` reproduces it). Fix that, rotating the invite signing secret as part of the remediation since duplicate tokens went out. Then build team workspaces with token-based email invitations: an owner invites a collaborator by email, the invitee accepts with a token, rosters are per team, and removing the last owner is mistake-proof. Add the InviteForm UI, the Postgres migration for teams and invites, keep the AI triage workflow and its data access safe, and rotate the invite signing secret. Build this end to end."
expected_adapters:
  - itp-incident
  - itp-research
  - itp-align
  - itp-spec
  - itp-architecture
  - itp-slice
  - itp-implement
  - itp-review
  - itp-verify
expected_required_children:
  - diagnosing-bugs
  - research
  - grilling
  - domain-modeling
  - writing-for-agents
  - codebase-design
  - tdd
  - code-review
  - verification-before-completion
expected_conditional_children:
  - vercel-react-best-practices
  - frontend-design
  - webapp-testing
  - playwright-generate-test
  - differential-review
  - postgresql-code-review
  - web-design-guidelines
  - poka-yoke
  - agentic-eval
  - agent-owasp-compliance
  - agentic-actions-auditor
  - resolving-merge-conflicts
  - wizard
expected_skips_with_reason:
  - prototype
expected_user_entry:
  - setup-matt-pocock-skills
forbidden:
  - runtime-skill-installation
  - recursive-user-entry-load
  - improvised-missing-review
artifacts_expected:
  - docs/product/research.md
  - docs/product/decisions.md
  - docs/product/spec.md
  - docs/product/acceptance-criteria.md
  - docs/architecture/architecture.md
  - docs/architecture/ADR/
  - docs/work/ISSUE-*.md
  - docs/work/review.md
  - docs/work/verification.md
  - docs/work/playwright-invite.spec.*
  - .itp/run.md
```

## Setup

```sh
bash tests/skills/e2e/setup-e2e.sh /path/to/I2P ~/itp-e2e-app
cd ~/itp-e2e-app && git status  # clean, one seed commit
npm test                        # mailer test red, rest green
```

Then, in a fresh session in that directory, run `setup-matt-pocock-skills` once
(interactive, user-entry) so `itp-review` has its issue tracker. Without it the run
correctly stops at review with a `needs-human` handoff instead of completing this case.

## The goal prompt

Paste exactly:

```text
Load the `idea-to-production` skill. Production sends invitation emails twice (cause unknown; `npm test` reproduces it). Fix that, rotating the invite signing secret as part of the remediation since duplicate tokens went out. Then build team workspaces with token-based email invitations: an owner invites a collaborator by email, the invitee accepts with a token, rosters are per team, and removing the last owner is mistake-proof. Add the InviteForm UI, the Postgres migration for teams and invites, keep the AI triage workflow and its data access safe, and rotate the invite signing secret. Build this end to end.
```

## Human interaction points

- Answer `grilling` as the product owner (team model, token lifetime, owner rules).
- Run `setup-matt-pocock-skills` during setup (above).
- Perform the `wizard`-generated secret-rotation steps against the local `.env`.
- Inject the merge conflict after `itp-implement` completes (procedure below), then say
  "continue — resolve this conflict and finish the implementation".
- No browser exists here: `webapp-testing` must end in `needs-human` naming the missing
  capability, never a claim the flow was tested.

## Conflict injection (after implement, before review)

The run's feature work is uncommitted on `master`. Create two variants touching the same
token-TTL line the run wrote in `src/invites.js`:

```sh
git checkout -b feature/teams
git add -A && git commit -m "teams feature work-in-progress"
git checkout -b variant-ttl-a
# edit the TTL line to 24 hours; commit
git checkout feature/teams
git checkout -b variant-ttl-b
# edit the SAME TTL line to 7 days; commit
git checkout variant-ttl-a
git merge variant-ttl-b   # -> conflict; leave it unmerged
```

Then tell the session to continue. Branches may be deleted after the run.

## Expected trace

| Skill | Trigger in this run | Expected behavior |
|---|---|---|
| idea-to-production | goal names an incident first | routes to `itp-incident` before the feature lifecycle |
| itp-incident | double-send, unknown cause | loads `diagnosing-bugs`; returns diagnosis + regression case; routes the fix to `tdd` |
| diagnosing-bugs | cause not obvious from `expected 1, got 2` | red loop, minimize, hypothesize, instrument; concrete diagnosis (dual handler registration) |
| tdd (incident fix) | red mailer test | red → green → refactor; regression kept |
| itp-research | token format/lifetime + Postgres RLS are external unknowns | `research` with primary sources; assumptions/unknowns recorded |
| itp-align | team model, token lifetime, owner rules | `grilling` interviews the human; `domain-modeling` records team/workspace/member/invitee/token in `CONTEXT.md` |
| itp-spec | approved direction | `writing-for-agents` writes `spec.md` with REQ IDs + testable acceptance criteria |
| itp-architecture | module boundaries for teams | `codebase-design` for the seam; `poka-yoke` for mistake-proof last-owner removal; `architecture.md` + ADRs |
| itp-slice | spec + architecture | independently testable slices with validation strategy, doc impact, specialist triggers |
| itp-implement | slices | `tdd` loop; `vercel-react-best-practices` for the React code; `frontend-design` for UI guidance; `webapp-testing` → `needs-human` (no browser); `playwright-generate-test` writes the durable test file with a note it was not executed |
| resolving-merge-conflicts | injected TTL conflict | intent-based resolution of the TTL line, never `--abort`; merge finished |
| wizard | secret rotation is human-only incident remediation (duplicate tokens went out) | `itp-incident` loads `wizard`; human performs the generated steps against the local `.env`; recorded |
| itp-review | feature diff on `variant-ttl-a` since `master` | `code-review` (Standards + Spec); `differential-review` fires on the token-auth diff; `postgresql-code-review` fires on the migration; `web-design-guidelines` reviews the UI against the pinned snapshot; `agentic-eval` fires on the changed triage prompt; `agent-owasp-compliance` fires on the tightened PII trust boundary; `agentic-actions-auditor` fires on the AI workflow |
| itp-verify | implementation + review | `verification-before-completion` with fresh evidence for every criterion; no completion claim without it |
| prototype | — | skipped with a stated reason (no feasibility uncertainty) |
| setup-matt-pocock-skills | missing tracker | run by the human in setup, never loaded recursively |

## Scoring

Per skill: loaded? correct trigger? correct output, artifact, or handoff? One miss on a
required skill fails the run; one unjustified skip fails the conditional. Global checks:
no improvisation for missing capabilities, no forbidden behavior, evidence before every
completion claim. Record scale, phases, skills loaded, artifacts, code lines, doc-to-code
ratio, and duration in `tests/skills/results/`.

Result:
