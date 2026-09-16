# Checkpoint Mode Test

Tests that the root can pause after each phase and report implemented vs next.

### CHKPT-01 stop after each phase and resume on go-ahead

Setup: a sandbox repo with the framework installed (either golden sandbox works). Work inside
it as the repo root.

1. Prompt: "Load the `idea-to-production` skill. Use checkpoint mode: stop after each phase and
   tell me what's implemented and what's next." Then give a small goal.
2. Expect: `checkpoints: true` recorded in `.itp/run.md`; after the current phase the run stops
   with a checkpoint containing - phase completed, what exists now (artifacts and code/tests),
   open questions, the next phase and what it will do, and `next_phase` as the resume point.
3. Do not continue past that checkpoint.
4. Start a fresh session and say "continue". Expect the next phase to run and stop at the next
   checkpoint, with `next_phase` advanced.
5. Say "turn checkpoints off". Expect auto-advance to the next stop (a `needs-human` point or
   completion) without intermediate checkpoints, and the flag cleared in the ledger.

Result:
