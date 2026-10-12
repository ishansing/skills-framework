# Adoption preview — milestone 1

Approved scope: `agent-work/plans/SKILL-INTEGRATION-PLAN.md`, preview vertical slice.
Branch: feature/skill-adoption-preview, based on the existing Skill Watch commit.

AC-1: resolve an explicitly selected verified candidate at an exact commit, validate
GitHub identity, contained bundle path, name/hash/invocation and runtime metadata.
AC-2: compare regular bundle files to committed Git objects; reject dirty/extra/ignored
files, symlinks, submodules and special files before hashing. Use existing fetch/hash tools
with scoped inspection Git settings; no candidate scripts, instructions or hooks execute.
AC-3: produce preview Markdown and JSON manifest with a proposed inventory row/lock entry,
collision/dependency/routing blockers, exact candidate/proposal/framework binding. Nothing
is approved automatically. Revalidation rejects changed inputs or dirty source content.
AC-4: neither preview nor revalidation edits registry/pins/adapters, installs globally,
commits/pushes, or publishes GitHub objects. Output/cache writes are explicit and bounded.
AC-5: agent-facing plans move under agent-work with active references/index updated; docs,
README, behavioral cases/results and runtime instructions retain their established roles.

Architecture: one preview module using existing fetchSkill(), dirHash(), registry JSON and
YAML parser. A structured optional proposal supplies capability/role/owner/triggers/required
children; absent policy remains unresolved. No Markdown-registry rewriting in this slice.
Bundle/reference inspection is static and reports its coverage; it is not installation or
native skill validation. Those are later adoption milestones with explicit execution isolation.

Approved tests: actual disposable Git repositories, snapshots and CLI output; integrity,
containment, collisions/dependencies, stale bindings and no mutation. Pass: regression
suite, contract check, real read-only preview if possible, independent review and itp-verify.
Documentation impact: root README usage pointer, agent-work plan/index and milestone handoff.
Security differential review triggered by untrusted source materialization/filesystem access.
