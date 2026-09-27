# Custom Harness — Design Inputs (STUB)

**Status: inputs only. The build order for this harness is NOT started.**
Per `SKILL-FRAMEWORK.md` §25, no enforcement code gets written until the framework's
readiness gate is met; per §27, this document will eventually define *how the framework gets
mechanically enforced*. Until then, this file collects design inputs so they are not lost.
Nothing below is a commitment — enforcement semantics get defined at build time.

## Source

Findings mined from [affaan-m/ECC](https://github.com/affaan-m/ECC) (`e482e57`, 2026-09-24;
v2.2.2). Verified by reading: `ecc2/` (Rust control-plane scaffold, explicitly alpha),
`docs/ECC-2.0-GA-ROADMAP.md` (TCAS leases, atomic outbox — roadmap prose, no implementation
found in `ecc2/src`), `skills/enterprise-agent-ops/SKILL.md` (operations checklist, guidance
only), `workflows/orch-review.workflow.js` (deterministic orchestration with barriers —
execution, not enforcement). ECC has no production enforcement layer either; these are inputs,
not a reference implementation.

## Inputs by harness concern

### Session and worker leases
- TCAS-style lease record: `{session, branch, touched_paths, heartbeat, owner, epoch}` with
  transactional acquire/renew/release and unique overlap enforcement.
- Bounded lease expiry with recovery after heartbeat loss; queue serialization for
  contending sessions.
- Mutation requires an atomically acquired workspace-wide lease; revalidate the final
  touched-path set before commit.

### Persistent state
- SQLite as the cross-process source of truth for session state, output, and risk; readers
  sync on a monotonic database cursor (only rows appended since the last tick).
- Atomic transaction/outbox pattern for state changes, with reconciliation for unapplied
  side effects.

### Observability and risk
- Session store hydrated into a dashboard at startup and after recovery; worktree-aware
  session scaffolding; multi-session output tracking.
- Risk-scoring primitives attached to sessions (escalate or block on score crossing).

### Budgets
- Hard timeout and retry budgets per run; mean-retries-per-task as a tracked metric alongside
  success rate.

### Audit
- Append-only audit log, mandatory for high-risk actions; immutable deployment artifacts.

### Credentials and change management
- Least-privilege credentials; environment-level secret injection (never in artifacts).
- Rollout/rollback procedure as a harness-level concern, not per-run improvisation.

### Kill switches, scopes, permissions
- Checklist-level only (no ECC implementation found): scoped permissions per session and a
  global kill switch. Semantics open.

## Open gaps (no ECC input found)

- **Deployment authorization:** no equivalent examined; design from scratch at build time.
- **Sandbox orchestration:** ECC's `docker/` is test/plugin packaging, not sandboxing; design
  from scratch at build time.
- **Enforcement of skill contracts:** our `dependency.md` + `skills.lock.json` are the intended
  source of truth to encode (see `UPGRADES.md` U7); resolution mechanics open.

## When this file becomes real

When §25 is met: replace this stub with the build order — worker leases, sandbox
orchestration, global budgets, immutable audit log, atomic state transitions, deployment
authorization, kill switches — each section graduating from the inputs above into specified,
tested behavior.
