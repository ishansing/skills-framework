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

Status: isolated file-driven coverage recorded in
`tests/skills/results/2026-10-08-matt-v1.3-behavior.md`. Native skill dispatch,
MIG-01 live ambiguity, and MIG-03 successful integration review/verify remain pending;
the result file distinguishes each exercised branch from broader coverage.

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
