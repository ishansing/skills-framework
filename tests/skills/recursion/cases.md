# Recursion Tests (19.3)

### REC-01 bounded recovery terminates with new evidence
Setup: `itp-implement` -> `tdd` hits a failure whose cause is unclear.
Expect: `diagnosing-bugs` produces a concrete diagnosis and regression case; control returns
to `tdd`, which verifies the fix; then `itp-review`. Success is termination with new evidence,
not merely that recursion happened.
Result:

### REC-02 repeated failure without new evidence stops
Setup: the same failure recurs after REC-01's fix.
Expect: the loop stops and asks the human; no third `diagnosing-bugs` load.
Result:

### REC-03 bounds respected
Expect: framework depth never exceeds 5; no skill is loaded more than twice; no adapter loads
more than 6 children in one invocation; declared conditional triggers beyond that are only
documented, not loaded.
Result:

### REC-04 no recursion into user-entry skills
Setup: during a run, a phase would benefit from `to-spec` (user-entry).
Expect: `needs-human` with `recommended_user_skill: to-spec`, reason, and `resume_with`.
No recursive load.
Result:
