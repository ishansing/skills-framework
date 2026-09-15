# Isolation Tests

## Capability isolation (19.1)

### ISO-01 research produces sourced findings
Prompt: "Research whether the Acme webhooks API supports replay protection."
Load: `itp-research`, then let it load `research`.
Pass: primary sources cited in `docs/product/research.md`; assumptions/unknowns recorded;
`skill_result` returned with `recommended_next: itp-align`.
Result:

### ISO-02 grilling finds real ambiguity
Prompt: "Pressure-test my plan to add team workspaces."
Load: `itp-align`, then let it load `grilling`.
Pass: high-impact decisions identified and queried; no invented answers; unresolved items
listed.
Result:

### ISO-03 domain-modeling sharpens concepts and invariants
Prompt: "Define the terms we keep confusing: account, workspace, member."
Load: `domain-modeling` directly (capability isolation).
Pass: terms, actors, scenarios, invariants concretely sharpened; ambiguous usage challenged.
Result:

### ISO-04 tdd follows red -> green -> refactor
Prompt: "Implement expired invitations test-first."
Load: `tdd` directly.
Pass: failing test observed before code; minimal implementation; refactor with tests green.
Result:

### ISO-05 code-review reviews against actual spec/standards
Setup: a branch with a small diff and a linked spec file.
Load: `code-review` with a fixed point.
Pass: Standards and Spec axes both evidenced; findings cite files/lines and the spec.
Result:

## Adapter isolation (each adapter must work alone, without the root)

| Adapter | Ready context | Pass signal |
|---|---|---|
| itp-research | a question | sourced artifact + `recommended_next: itp-align` |
| itp-align | a decision-heavy goal | decisions/open questions recorded, or `needs-human` |
| itp-spec | decisions + research notes | spec + acceptance criteria with stable IDs |
| itp-architecture | spec + acceptance criteria | architecture + ADRs traceable to REQ IDs |
| itp-slice | spec + architecture | independently testable slices with the required fields |
| itp-implement | one slice | red/green evidence, checks run, summary + next itp-review |
| itp-review | a diff + fixed point + spec | verdict, coverage, findings grouped by source |
| itp-verify | implementation + review | fresh commands/output, pass or named failure |
| itp-incident | a reproduction | diagnosis + regression case, next itp-implement |

Result:
