# Root Routing Tests (19.5)

The root is loaded explicitly for each case; observe which adapters and children it selects.

### ROUTE-01 research-only request
Prompt: "Research whether this API supports webhooks."
Expect: `itp-research` -> `research`; no spec, no implementation; stops after research.
Result:

### ROUTE-02 bug with clear reproduction
Prompt: "Fix this failing authorization test" + reproduction.
Expect: `itp-implement` -> `diagnosing-bugs` or `tdd`; no PRD/spec generation.
Result:

### ROUTE-03 build from approved spec
Prompt: "Build collaborator invitations from the approved spec."
Expect: skips research/spec if current; `itp-slice` -> `itp-implement` -> `itp-review` ->
`itp-verify`.
Result:

### ROUTE-04 review-only request
Prompt: "Review my PostgreSQL migration."
Expect: `itp-review` -> `code-review` + `postgresql-code-review` triggered by the PostgreSQL
change; findings returned with a verdict.
Result:

### ROUTE-05 incident with unknown cause
Prompt: "Production invitations are being sent twice; cause unknown."
Expect: `itp-incident` -> `diagnosing-bugs` -> diagnosis + regression case -> `itp-implement`.
Result:
