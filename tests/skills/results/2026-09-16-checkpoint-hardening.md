# Checkpoint Hardening Result - 2026-09-16

Implemented the five review items: phase-boundary semantics, `needs-human` precedence, explicit
`awaiting: user` state, a richer checkpoint report, and expanded tests. Validated with two
fresh-context subagent sessions in `sandbox-chkpt2`.

| Step | Observed |
|---|---|
| enable checkpoint mode | `checkpoints: true` in `.itp/run.md` |
| first stop | at the `spec` boundary (root-authored `spec-lite` plus no-op research/align), **before** slice - previously the first stop came only after slice; `awaiting: user` set; `next_phase: slice`; only `spec.md` existed |
| resume "continue" | advanced exactly one phase to `slice` with another checkpoint |
| "turn checkpoints off" | `checkpoints: false`, `awaiting` cleared, auto-advanced through implement, review, verify to `next_phase: complete` with no intermediate stops |
| guardrails | review verdict **approved**; verification completed; `README.md` created per the declared documentation impact; `npm test` exit 0 |
| budget | small tier honored: four adapters loaded (`itp-slice`, `itp-implement`, `itp-review`, `itp-verify`); research/align/spec completed without adapter loads |

The `awaiting: user` field makes the paused state visible on disk, so resume evidence no longer
depends on the model's prose (which the compression plugin still garbles).

## Deferred to the Stage 2 harness

- `CHKPT-02` (checkpoints across a review -> implement -> re-review loop) and `CHKPT-04`
  (standard-scale seven-stop count) are deterministic state-transition tests: the harness can
  stage a failing check or force `changes-requested` and assert the checkpoint and `awaiting`
  transitions mechanically. They are not retried as behavioral cases (this run's review
  approved first time and the change classified `small`).
- The exact checkpoint prose could not be captured; ledger and artifact state are the evidence.
