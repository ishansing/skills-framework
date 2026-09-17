# Checkpoint Feedback Result - 2026-09-16

Feature: checkpoints offer `continue` / describe changes / `turn checkpoints off`, and change
requests route back to the owning phase with amendments recorded. Validated with three
fresh-context subagent sessions in `sandbox-chkpt3`.

Verdict: **pass** (CHKPT-05 positive path).

| Step | Observed |
|---|---|
| checkpoint 1 | stopped after spec with `awaiting: user`, `next_phase: slice`; spec named `listMembers()` |
| change request at the checkpoint | "rename listMembers() to memberEmails()" routed to the spec phase; spec amended (5 `memberEmails`, 0 `listMembers`); ledger recorded `amendments: [{ phase: spec, reason: "checkpoint feedback: rename listMembers() to memberEmails()" }]`; `awaiting: user` stayed set and the amended phase was re-checkpointed |
| "continue" | slice ran against the amended artifact: `ISSUE-001` has 5 `memberEmails`, 0 `listMembers`; stopped at the next checkpoint (`awaiting: user`, `next_phase: implement`) |

## Notes

- The two-re-run bound and the third-request stop were not exercised (they need repeated
  feedback within one run); they stay specified rules, and deterministic bound checks are
  harness territory, like `CHKPT-02`/`CHKPT-04`.
- Exact checkpoint prose was not capturable because of the output-compression layer; the ledger
  fields and artifacts are the evidence.

## What changed

- Root step 9: feedback routing to the owning phase, amendment recording, re-checkpoint, and
  the two-re-run bound.
- `artifacts.md`: the checkpoint options line, feedback semantics, and the `amendments` ledger
  field.
- `lifecycle.md` and README: the same rules documented.
- `tests/skills/isolation/checkpoint-mode.md`: `CHKPT-05` fixture.
