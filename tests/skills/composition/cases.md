# Composition Tests (19.2)

Record for every case: was the second skill necessary; did the first pass useful artifacts
(not a transcript); did responsibilities overlap; did one undo the other's work.

### COMP-01 research -> grilling
Setup: `docs/product/research.md` produced by ISO-01.
Pass: grilling uses the research artifact as context and challenges decisions rather than
re-asking settled facts.
Result:

### COMP-02 grilling -> domain-modeling
Setup: an alignment session that surfaces inconsistent domain terms.
Pass: domain-modeling triggers on the terms, not on a generic request; records terms and
invariants.
Result:

### COMP-03 spec -> codebase-design
Setup: a spec whose module boundary is constrained by an existing interface.
Pass: `codebase-design` is consulted as a reference; spec reflects the interface without
duplicating the skill's procedure.
Result:

### COMP-04 tdd -> code-review
Setup: one implemented slice.
Pass: review reads the diff and spec fresh; findings cite requirement IDs; verdict routes
back to implement when needed.
Result:

### COMP-05 code-review -> differential-review (security trigger)
Setup: a diff touching authentication/session code.
Pass: differential-review triggered by the risk, not by default; findings grouped from both.
Result:
