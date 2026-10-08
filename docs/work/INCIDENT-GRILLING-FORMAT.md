# Grilling recommendation omission: prompt-conflict diagnosis

## Symptom and baseline

Native question output omitted every recommended-answer line, despite the correct
pinned `grilling` skill loading. The original conformance session asked four frontier
questions with zero recommendations. Historical failure remains valid evidence.

## Red-capable loop

`node tests/skills/check-grilling-output.mjs <opencode-jsonl>` reads actual rendered
text events, excluding Skill-tool template output, and checks each question's
non-empty `➡️` line. Exit 1 means shape failure, not a semantic review of the advice.
Replaying `/tmp/opencode/v13-grilling-format.jsonl` produced:
`{"questions":4,"missing":["Q1","Q2","Q3","Q4"],"pass":false}`.

## Minimized reproduction

Fresh native CLI process in an empty directory, same skill/tool/plugin environment:

> Call the grilling Skill. Pressure-test my plan for shared workspace ownership.
> Ask the first frontier and wait. Do not answer for me. Do not edit files.

Session `ses_ee50d3136ffeMD6PSnU4TKIfUd` loaded the real skill and returned two
questions, zero recommendations. Application fixtures, glossary history, framework
adapters, and concurrent worktrees were not necessary to reproduce the symptom.

## Ranked hypotheses, shown before testing

1. Broad “Do not answer for me” suppresses recommendations along with decisions.
2. Higher-level session instructions discourage recommendations.
3. Plugin processing changes effective instruction context.
4. Variable model compliance causes the omissions independent of those constraints.

Only hypothesis 1 needed a changed variable to explain the controlled contrast;
the other contexts were held unchanged. They are not independently ruled out as
possible contributors to other failures.

## Controlled contrasts

| Native run | Changed variable | Questions / missing lines | Outcome |
|---|---|---|---|
| `ses_ee50d3136ffeMD6PSnU4TKIfUd` | minimized original, broad prohibition retained | 2 / 2 | red |
| `ses_ee50c288fffeiqEnPEg5n4pATz` | removed only “Do not answer for me” | 2 / 0 | green |
| `ses_ee50308d7ffeI9vsZeVxwhkEru` | restored the original clause | 3 / 3 | red |
| `ses_ee50305dbffefBZgXmSgg2tDZ1` | replaced clause with narrower decision boundary | 3 / 0 | green |
| `ses_ee501edd8ffe5vL2lJGGKT2MSJ` | original full scenario with that boundary replacement | 4 / 0 | green |

Corrected boundary:

> Do not make product decisions on my behalf; recommendations are provisional
> proposals, not resolved decisions.

Exported native session data independently confirmed that the minimal baseline and
add-back user messages are identical, the removal differs only by the broad clause,
and the clarified minimal message differs only by its replacement. Every exported
run reports model `openai/gpt-6.1-sol`. Assertions on those actual exported messages
passed; this is not based only on the shell invocation text.

The repaired full scenario asked four independent frontier questions, marked every
recommendation provisional, and awaited user decisions. It did not implement anything,
edit files, or claim shared understanding. Actual Skill loading remained unchanged.

## Diagnosis and remediation

The validation prompt imposed an ambiguous constraint that competed with the skill's
recommendation requirement. Removing it changed the observed result; restoring it
restored the failure; narrowing it preserved human authority and restored recommendations
in both the minimized and original scenarios. This supports a prompt-conflict cause for
these probes, not a claim to know the model's internal reasoning or prove determinism.

Remediation belongs in the probe instructions, not in a patched upstream skill or extra
global reminders. MIG-07 now states the narrower boundary. The unchanged pinned skill,
global instructions, and plugin configuration were preserved. The trace shape checker
and two focused tests retain a runnable regression seam; no new dependencies were added.

## Evidence and limits

Raw native logs remain under `/tmp/opencode/grilling-diagnosis/`:
`minimal.jsonl`, `without-clause.jsonl`, `add-back.jsonl`, `clarified.jsonl`,
`original-clarified.jsonl`. Native session IDs above provide additional trace references.
The same checker was run against each actual output; old traces remain red, corrected
traces green. This is a small controlled sample, not a reliability statistic, broad
model-compliance guarantee, or full release-readiness assessment.
