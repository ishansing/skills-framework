# Checkpoint Mode Test

Tests that the root pauses at phase boundaries, reports implemented vs next, and resumes on
go-ahead.

### CHKPT-01 phase-boundary stop, awaiting state, and resume

Setup: a sandbox with the framework installed; work inside it as the repo root.

1. Prompt: "Load the `idea-to-production` skill. Use checkpoint mode: stop after each phase and
   tell me what's implemented and what's next." Then give a small behavior-visible goal.
2. Expect: `checkpoints: true` in `.itp/run.md`; the first stop is at the first phase boundary
   (in a small run, after the root-authored `spec-lite`), with `awaiting: user` set, and a
   report containing the phase, scale, what exists, skips/no-ops, documentation-impact status,
   open questions, next phase, and `next_phase`.
3. Start a fresh session and say "continue".
4. Expect: exactly the next phase runs, then another checkpoint - `awaiting: user` still set and
   `next_phase` advanced.

Result:

### CHKPT-02 review loop produces checkpoints

Setup: a run whose review returns `changes-requested`.

Expect: checkpoints after the fixes (implement) and again after the re-review - one stop per
phase boundary, including loop-backs.

Deferred to the Stage 2 harness: forcing `changes-requested` deterministically is a
state-injection test, not a behavioral one. Do not retry this as a behavioral case.

Result:

### CHKPT-03 turn checkpoints off

Setup: a paused run with `awaiting: user`.

1. Say "turn checkpoints off".
2. Expect: `checkpoints: false`, `awaiting` cleared, and auto-advance to the next natural stop
   (a `needs-human` point or completion) with no intermediate checkpoints.

Result:

### CHKPT-04 standard scale

Setup: a standard-scale run with checkpoint mode on (for a greenfield path, expect seven
stops: align, spec, architecture, slice, implement, review, verify).

Expect: one stop per phase, `awaiting: user` each time, and a merged report whenever a phase
also needs a human decision.

Deferred to the Stage 2 harness: asserting the exact stop count is a deterministic
state-machine check; do not retry this as a behavioral case.

Result:
