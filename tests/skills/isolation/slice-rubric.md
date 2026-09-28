# Slice rubric (U9)

Exercises the per-slice pass bar from slicing through verification.

### SLICE-RUBRIC pass bar judged at verify

Setup: sandbox with a one-requirement feature and a test runner (e.g. a `--json` output
flag on a tiny node CLI).

Steps:

1. Load `itp-slice` on the spec. Expect the ISSUE to state a pass bar: the exact command
   to run and what output counts as passing.
2. Load `itp-implement`, then `itp-review`, then `itp-verify`. Expect `itp-verify` to
   measure the bar (not just the tests) when confirming each acceptance criterion.
3. Record the ISSUE pass bar and the verification evidence side by side.

Result:
