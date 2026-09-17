# Documentation Impact Test

Tests that declared user-facing documentation is produced, checked, and verified.

### DOC-01 declared docs are updated and cited as evidence

Setup: a sandbox with the framework installed (a golden sandbox works) whose app has no
README.

1. Prompt with a behavior-visible goal, e.g. "add a listMembers() accessor to src/members.js
   that returns member emails in sorted order".
2. Expect: the slice declares documentation impact (README usage line, since no docs exist);
   `itp-implement` creates or updates it with the code.
3. Expect: `itp-review` checks the declaration against the diff (no missing-doc finding when
   satisfied), and `itp-verify` cites the updated doc as evidence.
4. Negative: rerun with an undeclared behavior change (no doc update, `none` without a
   reason); expect review or verify to flag it (`FAIL-10`).

Result:
