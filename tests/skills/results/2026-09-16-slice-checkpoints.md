# Slice-Granularity Checkpoints Result - 2026-09-16

Feature: `checkpoints: slice` adds a stop after each implementation slice, only when its tests
are green. Validated with two fresh-context subagent sessions in `sandbox-chkpt4` on a
two-slice goal (`listMembers()` then `removeMember()`).

Verdict: **pass**.

| Step | Observed |
|---|---|
| goal slicing | two slices produced (`ISSUE-001`, `ISSUE-002`) |
| after slice 1 | stopped with `checkpoints: slice`, `slice: 1/2`, `awaiting: user`, `completed: [spec, slice]`, `next_phase: implement` (slice 2 of 2); `listMembers` implemented with tests; `removeMember` not started |
| resume "continue" | slice 2 ran: `removeMember` implemented with tests; stopped at the final slice checkpoint with `slice: 2/2`, `awaiting: user`, `completed: [spec, slice, implement]`, `next_phase: review` |
| green-only rule | no pause occurred mid-cycle; tests were green at both stops |
| quality | `npm test` re-run here: exit 0; README usage updated per the declared documentation impact |
| ledger nit found | `slice` persisted after the implement phase; the ledger template now says to clear it when the implementation phase ends |

## Notes

- Phase-boundary checkpoints were auto-acknowledged in the prompt so the run could reach the
  slice stops; phase-boundary behavior was validated separately (`2026-09-16-checkpoint-
  hardening.md`).
- Deterministic slice-count and two-re-run bound assertions remain deferred to the Stage 2
  harness, consistent with `CHKPT-02`/`04`.

## What changed

- Root step 8 and hard rules: `checkpoints: false | phase | slice`, slice stops after green
  slices, granularity changes recorded.
- `artifacts.md`: granularity values, `slice: n/m` ledger field, slice additions to the
  checkpoint report.
- `lifecycle.md`: granularity table and guidance (`slice` for full-scale/greenfield, never
  automatic).
- `itp-implement`: one slice per invocation under slice granularity, `slice: n/m` in the
  result, never pause mid-cycle.
- README: usage; `CHKPT-06` fixture added.
