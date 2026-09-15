# Lifecycle Reference

Phase order:

```text
research -> align -> spec -> architecture -> slice -> implement -> review -> verify -> complete
itp-research  itp-align  itp-spec  itp-architecture  itp-slice  itp-implement  itp-review  itp-verify
```

## Standard routing

| Completed adapter | Recommended next | Loop-back |
|---|---|---|
| itp-research | itp-align | - |
| itp-align | itp-spec | needs-human when decisions remain |
| itp-spec | itp-architecture, or itp-slice when architecture is already decided | itp-align |
| itp-architecture | itp-slice | itp-spec |
| itp-slice | itp-implement | itp-architecture |
| itp-implement | itp-review | diagnosing-bugs then resume tdd; resolving-merge-conflicts on conflicts |
| itp-review | itp-verify when approved | itp-implement on changes-requested |
| itp-verify | complete | itp-implement or itp-incident on fail |

## Routing shortcuts

The root skips phases when their output already exists and is not stale:

- Approved spec and architecture present and current -> itp-slice.
- Bug with a clear reproduction -> itp-implement (diagnosing-bugs -> tdd).
- Review-only request -> itp-review.
- Research-only question -> itp-research, then stop.
- Incident/regression with unknown cause -> itp-incident.

## Definition of Ready (framework phase)

A phase is ready when its required context exists:

- implementation: a slice/issue exists, acceptance criteria are testable, the required
  architecture decision is known, required skills are installed, conditional specialist
  triggers are evaluated, and no unresolved high-impact ambiguity blocks coding;
- other phases: their `consumes` artifacts exist and are not stale.

## Definition of Done (framework experiment)

Complete a work item only when:

- required lifecycle adapters completed;
- acceptance criteria are satisfied;
- relevant tests/checks were actually run;
- `code-review` completed, plus any triggered specialist reviews;
- `itp-verify` produced fresh `verification-before-completion` evidence;
- unresolved findings are fixed or explicitly handed off;
- final artifacts describe what changed and any follow-up.

No production deployment or SLO monitoring is required to declare the framework experiment
successful unless the user explicitly included deployment in the test.

## Recursion

- Bounds: depth 5, same skill twice, at most 6 children loaded per adapter invocation
  (declared conditional triggers may exceed that; load only what the trigger requires).
- Allowed bounded recovery: `tdd` -> failing behavior not understood -> `diagnosing-bugs`
  (concrete diagnosis + regression case) -> `tdd` to verify the fix.
- Forbidden: unbounded cycles such as `tdd -> diagnosing-bugs -> tdd -> diagnosing-bugs`.
- Same failure without new evidence: stop and ask the human.

## Human handoff triggers

Stop and ask when:

- a high-impact product decision has no defensible default;
- a required user-entry skill is the right tool;
- credentials/account actions must be performed by the user;
- a destructive or production-changing action is requested;
- the same failure recurs without new evidence;
- a required installed skill is missing;
- conflicting requirements cannot be reconciled;
- a decision exceeds the current task scope.

Handoff schema: `references/artifacts.md`.
