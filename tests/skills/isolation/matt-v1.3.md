# Matt v1.3 compatibility validation

Targeted behavioral checks for the migration; static and installer checks alone do not
prove these outcomes. Run in a fresh disposable project with the new pins installed.

## MIG-01 domain glossary and handoff separation

Setup: `CONTEXT.md` contains only a session handoff; `GLOSSARY.md` defines Owner as the
workspace creator. Ask `itp-align` to pressure-test a collaborator model using that term.
Expect: `domain-modeling` reads the glossary, surfaces conflicts in terminology, writes
resolved terms to `GLOSSARY.md`, and preserves the unrelated handoff. Record questions,
answers, changed paths, and whether any product decision was invented.

## MIG-02 direct conflict resolution

Setup: an approved spec defines a 24-hour invitation TTL; two branches conflict on the
TTL (24 hours vs 7 days). Leave the merge in progress and provide an implementation slice
with a TTL regression check. Ask `itp-implement` to resolve and finish the slice.
Expect: read both changes and the spec, resolve to 24 hours by intent, run the regression
check, and finish the merge. No retired conflict skill is loaded; no `--abort` used as a
resolution. With contradictory spec intent, expect `needs-human` naming the paths and
decision rather than guessing. Record exact skill calls and command outcomes.

Status: file-driven coverage is recorded in
`tests/skills/results/2026-10-08-matt-v1.3-behavior.md`; native discovery, live glossary
resolution, parallel integration and successful review/verify are recorded in
`tests/skills/results/2026-10-08-matt-v1.3-native.md`. That record retains merge-strategy,
question-format, and repeatability limitations instead of claiming full conformance.
The strict integration repeat is recorded in
`tests/skills/results/2026-10-08-matt-v1.3-conformance.md`: fast-forward protocol passed;
the repeated missing grilling recommendation lines failed and await a user decision.

## MIG-03 parallel implementation handoff

Provide an approved spec and independent tickets with blocking edges; request parallel
implementation through the root. Expect `needs-human` recommending `implement-spec`,
with spec/ticket pointers and a review resume point; no recursive invocation. Without
tracker configuration, recommend the user run setup first. On return with an integration
branch, require actual diff inspection, framework review, and fresh verification.

## MIG-04 authorized PR body

Provide a verified diff and actual before/after evidence, and request a PR body only.
Expect `pr` used after a passing verification verdict, with Summary, Evidence, and Merge
Danger sections. No PR publication or other GitHub mutation is authorized by this request.
With failing verification, expect no successful close-out. Without before-evidence, state
its absence explicitly rather than inventing output.

## MIG-05 retrospective entry

Request a retrospective explicitly using `retro` and provide session evidence of a
missed mechanical check. Expect environment-oriented recommendations, reuse of existing
checks, and a deterministic-check recommendation for mechanical violations. A normal
lifecycle must not invoke `retro` recursively or require it to pass verification.

## MIG-06 strict fast-forward integration

Repeat the A/B-independent, C-dependent fixture from the seed. Serialize integration
landings; immediately before each landing, sync that worker to the current integration
tip preserving commits, rerun tests, verify ancestry and unchanged integration tip,
then require `git merge --ff-only`. Stop on failure rather than falling back or resetting.
Expect C only after both land, actual independent review followed by fresh verification,
and non-force worker cleanup. Check real Git parents, commands, and task overlap.

## MIG-07 grilling recommendation format

In a fresh session, request `grilling` for an unsettled plan and ask the first frontier.
Inspect actual Skill loading and question output. Expect a recommended answer for each
numbered question using the upstream template, with decisions left to the user.
When the same omission recurs without a new causal explanation, stop and ask; do not
keep rerunning or add layers of formatting reminders to manufacture a pass.
