# Root Routing Tests (19.5)

The root is loaded explicitly for each case; observe which adapters and children it selects.

### ROUTE-01 research-only request
Prompt: "Research whether this API supports webhooks."
Expect: `itp-research` -> `research`; no spec, no implementation; stops after research.
Result: pass - see results/2026-09-16-campaign1.md

### ROUTE-02 bug with clear reproduction
Prompt: "Fix this failing authorization test" + reproduction.
Expect: `itp-implement` -> `diagnosing-bugs` or `tdd`; no PRD/spec generation.
Result: pass - see results/2026-09-27-campaign3.md

### ROUTE-03 build from approved spec
Prompt: "Build collaborator invitations from the approved spec."
Expect: skips research/spec if current; `itp-slice` -> `itp-implement` -> `itp-review` ->
`itp-verify`.
Result: pass - see results/2026-09-27-campaign7.md

### ROUTE-04 review-only request
Prompt: "Review my PostgreSQL migration."
Expect: `itp-review` -> `code-review` + `postgresql-code-review` triggered by the PostgreSQL
change; findings returned with a verdict.
Result: pass - see results/2026-09-16-campaign1.md

### ROUTE-05 incident with unknown cause
Prompt: "Production invitations are being sent twice; cause unknown."
Expect: `itp-incident` -> `diagnosing-bugs` -> diagnosis + regression case -> `itp-implement`.
Result: partial - incident path (diagnosis + regression case) evidenced via FAIL-01; final implement step legitimately blocked; see results/2026-09-16-campaign2.md

### RESUME-01 fresh-session resume
Setup: a completed research phase with `.itp/run.md` + artifacts on disk, no conversation history.
Expect: fresh session reads the ledger and artifacts only, resumes at the earliest incomplete phase, loads the next adapter, stops at the first human gate with no history required.
Result: pass - see results/2026-09-16-campaign1.md

### SCALE-01 scale classification
Setup: three goals spanning small, standard, and full tiers.
Expect: root records `small` for the single-module change, `standard` for the access-control feature, `full` for the migration; skips and guardrails stated per tier.
Result: pass - see results/2026-09-16-right-sizing.md
