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

## Right-sizing

Classify every run once, at the start, and record `scale` in `.itp/run.md`. When unsure, use
`standard`.

| | `small` | `standard` (default) | `full` |
|---|---|---|---|
| When | one module, no new interface or module boundary, no security/data/destructive/migration surface, requirements clear | multi-module or new interface, some ambiguity | cross-cutting, security-critical, migrations, domain ambiguity, or the user asks for the full process |
| Phases | align only if a decision is open; spec-lite; architecture only if a boundary changes; slice; implement; review (code-review only); verify | all applicable phases with full artifacts | standard plus every applicable specialist |
| Artifacts | `spec.md`, `ISSUE-<n>.md` (acceptance criteria inline), `review.md`, `verification.md`, `.itp/run.md` | see `artifacts.md` | standard plus specialist reports |

Hard guardrails:

- review and verify always run, at every scale;
- a security, data, destructive, or migration surface upgrades `small` to at least
  `standard`, with the reason recorded;
- scale may rise mid-run; it never drops without a recorded reason.

Budget for `small`: target one session and at most four adapter loads (slice, implement,
review, verify). The root may author the small `spec-lite` directly - one short file with
stable `REQ-` IDs and the acceptance criteria in the slice - so `itp-spec` is not loaded for
small runs. If the run exceeds the budget, stop and report instead of adding ceremony.

## Greenfield projects

A repo with no application code yet is never `small`: greenfield work creates interfaces and
boundaries, so classify it `standard` or `full` until structure and tooling exist.

- Research may cover stack and library options with provenance before align.
- Align resolves stack, scope, and tooling decisions and records them in
  `docs/product/decisions.md`.
- Architecture decides the initial structure, module boundaries for the intended design, the
  testing/tooling strategy, and records stack choices as ADRs.
- The first slice is the bootstrap slice: chosen runtime tooling, test runner, linter, and CI,
  with a smoke test that runs green. Feature slices follow.
- Scale may drop to `small` only after structure and tooling exist.

## Checkpoints

By default the root advances without stopping except for `needs-human`. `checkpoints` accepts
`false` (default), `phase`, or `slice` (legacy `true` means `phase`; ask without specifying and
you get `phase`):

- `phase` - one stop at every phase boundary, not just adapter loads;
- `slice` - additionally one stop after each implementation slice, only once that slice's
  tests are green (never mid-cycle); `slice: n/m` is recorded in the ledger.

`slice` suits `full`-scale work and greenfield bootstrap; it is never automatic. While paused
the root sets `awaiting: user`; a `needs-human` stop takes precedence and merges into the same
report. At a checkpoint the user can continue, describe changes, or turn checkpoints off.
Requested changes route to the owning phase's adapter (for a slice, back to `itp-implement` for
that slice), which re-runs with the feedback as context (at most two re-runs per phase or per
slice); the ledger records the amendment and `awaiting: user` stays set until the go-ahead.

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
- declared documentation impact is satisfied or explicitly waived;
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
