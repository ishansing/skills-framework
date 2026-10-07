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

Status: pending behavioral runs. Use dated results under `tests/skills/results/`.
