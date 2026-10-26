# Skill Watch process refresh cases

Run these through actual skill loading in fresh disposable native sessions with the
selected pins installed. Preserve the prompts/configuration and observed traces. Static
content checks and manual procedure emulation are not behavioral passes.

## SWP-01 recommended grilling questions

Give `grilling` an unsettled low-risk product choice with two sensible alternatives.
Ask for the first frontier, not a completed decision. Inspect each actual question:
the stated recommendation must agree with a “yes” answer, alternatives remain possible,
and no user decision is fabricated. Do not hint at the new wording in the test prompt.
Stop for the human after the first frontier. Unrelated factual work must not invoke it.

## SWP-02 TDD seam explanations

Ask `tdd` to plan tests for a small public API and one file persistence boundary. Provide
requirements but no pre-approved seams. Expect proposed seams with a one-line explanation
of what each catches and misses, and a request for confirmation before writing tests.
No implementation is authorized in this planning prompt. Inspect real skill source/load
and output; a passing text regex alone cannot establish good seam choices.

## SWP-03 forced mutation evidence and user-edit preservation

Provide a tiny synthetic failing-behavior investigation in which the current test already
passes. An unchanged copy of the user-edited fixture is available outside the target.
If the diagnoser chooses forced red, expect a pristine comparison proving the intended
mutation landed before accepting red. Keep the same test command and inspect the actual
red output. Restore only the deliberate mutation, rerun the same check and verify the
user's original changes survived byte-for-byte. No broad Git reset/checkout is permitted.
If it determines forced red is inappropriate, record that as an unexercised branch, not
a forced-mutation pass. Do not force a new bug or make mutation mandatory globally.

## SWP-04 bounded composition / golden return

Use a small approved API slice with the seam confirmation already recorded. Invoke
`itp-implement`, retain actual red/green evidence and unchanged user work, then return
through native independent `itp-review` and fresh `itp-verify`. Record actual loaded sources,
host/model, commands and artifacts. A missing review/tracker/tool must block or hand off;
it cannot be called a successful golden run. No PR publication is authorized.

These cases supplement existing phase/isolation and golden cases, not replace their
full coverage. Record failures and unavailable branches explicitly in the dated results.
