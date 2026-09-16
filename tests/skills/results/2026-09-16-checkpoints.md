# Checkpoint Mode Result - 2026-09-16

Requirement: the framework should be able to stop at phase boundaries and report what is
implemented and what is next, on request.

Verdict: **pass** (two fresh-context subagent sessions in `sandbox-chkpt`, a small-tier
sandbox inside the framework repo).

| Step | Observed |
|---|---|
| User asks for checkpoint mode | `checkpoints: true` recorded in `.itp/run.md` |
| First stop | `completed: [spec, slice]`, `next_phase: implement`; only `spec.md`, `ISSUE-001.md`, and the ledger existed; no code touched |
| Fresh session, user says "continue" | advanced exactly one phase: `completed: [spec, slice, implement]`, `next_phase: review`; `src/members.js` and `test/members.test.js` changed (`listMembers` present in both) |
| Resume context | none needed beyond `.itp/run.md` and the artifacts (same pattern as RESUME-01) |

Note: the exact checkpoint prose was lost to the local output-compression layer, so the
on-disk state at each stop is the recorded evidence; behavior is confirmed by the ledger
advancing one phase per go-ahead and stopping in between.

## What changed

- Root procedure step 7 and hard rules: honor `checkpoints`, report the checkpoint, wait for a
  go-ahead before loading the next adapter; record the toggle.
- `references/artifacts.md`: ledger gains `checkpoints: false` and the phase-checkpoint report
  definition (phase, what exists, open questions, next phase, resume point).
- `references/lifecycle.md`: Checkpoints section.
- README: how to ask for checkpoint mode.
- Test case: `tests/skills/isolation/checkpoint-mode.md`.
