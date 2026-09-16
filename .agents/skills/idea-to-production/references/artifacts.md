# Artifact and Result Reference

## Artifact paths

| Artifact | Path |
|---|---|
| research findings | `docs/product/research.md` |
| assumptions | `docs/product/assumptions.md` |
| unknowns | `docs/product/unknowns.md` |
| resolved decisions / open questions | `docs/product/decisions.md` |
| specification | `docs/product/spec.md` |
| acceptance criteria | `docs/product/acceptance-criteria.md` |
| architecture | `docs/architecture/architecture.md` |
| ADRs | `docs/architecture/ADR/NNNN-<slug>.md` |
| vertical slice | `docs/work/ISSUE-<n>.md` |
| review report | `docs/work/review.md` |
| verification evidence | `docs/work/verification.md` |
| incident record | `docs/work/INCIDENT-<n>.md` |
| implementation | code diff + tests |
| run ledger | `.itp/run.md` |

## Artifact minimums by scale

| Scale | Minimum artifacts |
|---|---|
| small | `docs/product/spec.md` (one page, stable `REQ-` IDs), `docs/work/ISSUE-<n>.md` (testable acceptance criteria inline), `docs/work/review.md`, `docs/work/verification.md`, `.itp/run.md` |
| standard | the artifact table above |
| full | standard plus each triggered specialist's report |

Omit files that would be empty: no `decisions.md` when no decisions were made, no ADR without
a real decision with alternatives, no `architecture.md` for a small change that moves no
boundary.

## Metrics to record per run

In the results log or the ledger evidence: scale, phases completed, skills loaded, artifacts
written, code lines changed, doc-to-code line ratio, and approximate duration. Small runs
should land near or below a 1:1 doc-to-code ratio.

## Artifact rules

Artifacts must be readable without hidden conversation context. They distinguish facts,
assumptions, decisions, and open questions; link to source files/requirements; mark stale
assumptions; stay concise enough for selective loading; and are version-controlled. Create
artifact directories on first write; do not pre-create empty ones.

## Child request (adapter -> runtime skill tool)

```yaml
next_skill:
  id: domain-modeling
  requirement: conditional
  reason: "The collaborator role boundaries are still ambiguous."
  context:
    artifacts: [docs/product/research.md]
    focus: [collaborator, invitation, ownership]
```

Pass only the smallest useful context (spec §11.3).

## Child result (what each adapter returns to the root)

```yaml
skill_result:
  skill: itp-review
  status: completed            # completed | changes-requested | pass | fail | blocked | needs-human
  summary: "..."
  artifacts: [docs/work/review.md]
  evidence:                    # commands actually run + observed result
    - "pnpm test -- auth.invitation  -> 12 passed"
  findings: []                 # {severity, source, detail}
  open_questions: []
  recommended_next: [itp-verify]
  handoff: {}                  # required when status is needs-human
```

## Human handoff

```yaml
handoff:
  status: needs-human
  reason: "Product owner must choose whether deleted projects are recoverable."
  decision: "Recoverable deletion policy"
  options: [soft-delete for 30 days, irreversible delete]
  affected_artifacts: [docs/product/spec.md, docs/architecture/architecture.md]
  resume_with: itp-spec
  recommended_user_skill: to-spec   # only when a user-entry workflow is the right tool
```

## Run ledger (`.itp/run.md`)

```yaml
run:
  goal: "Add collaborator invitations"
  scale: standard
  next_phase: verify
  completed: [research, align, spec, architecture, slice, implement]
  artifacts:
    research: docs/product/research.md
    spec: docs/product/spec.md
    architecture: docs/architecture/architecture.md
    slice: docs/work/ISSUE-014.md
  loaded_skills: [research, grilling, domain-modeling, tdd, code-review]
  open_questions: []
```

`next_phase` is where a fresh session resumes; update it whenever the run stops (use
`complete` when everything is done). The ledger is a coordination aid, not a production state
database.
