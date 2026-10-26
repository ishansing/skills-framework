# Skill Watch process refresh — first implementation slice

Status: locally verified; paired native probes, golden composition, independent review
and fresh verification passed. Commit authorized; no deployment. Base: `59170e7`;
branch `integration/skill-watch-process-refresh`.
User authorized starting the combined plan and confirmed installer/hash and native-output
test seams. Global installation changes, publication, paid multi-provider campaigns and
pushes are excluded; the user subsequently authorized the framework commit. Local commits
inside synthetic native validation fixtures are allowed solely to provide real review ranges.

## Scope and acceptance

Update only `grilling`, `tdd` and `diagnosing-bugs` to the exact reviewed Matt snapshot
named in [the update research](SKILL-WATCH-2026-10-26-UPDATES.md), using per-ID repinning.
The authoritative selected revisions/hashes remain in `skills.lock.json`.

1. The three complete directories match their new hashes; every other lock entry remains
   identical to the base. Capability ownership and invocation classes stay unchanged.
2. Strict fresh repo-local and isolated-global installs succeed and preserve complete
   skill/reference bundles. Real user-global skill bytes remain unchanged.
3. Fresh native `grilling` loads the selected source and words questions so “yes” accepts
   the recommendation; alternatives and actual user decisions remain available.
4. Fresh native `tdd` loads the selected source and proposes confirmed public seams with
   a catches/misses explanation per seam, before test implementation.
5. Fresh native `diagnosing-bugs`, when a forced mutation is necessary, retains evidence
   that the mutation landed before trusting red, restores only its own mutation, preserves
   pre-existing work and does not claim that mutation is mandatory for all tests.
6. Relevant existing tests, contract checks and a bounded golden composition run pass;
   independent review precedes fresh verification. Missing runtime proof leaves acceptance
   pending rather than being replaced by source-text assertions.

## Agreed seams

- Existing installer/hash boundary: catches incomplete bundles, wrong revisions and
  unintended lock changes; does not establish that a host selected/followed those bytes.
- Native skill-output boundary: catches observed recommendation/seam/evidence regressions;
  model behavior is nondeterministic, so individual passes are not universal guarantees.

Run one baseline/new comparison per relevant case where feasible. Record red as the
observed missing behavior, not an invented unit-test failure. Stop on repeated failure
without new evidence. Use synthetic fixtures, local-only tools and bounded runs; isolated
directories are not an OS sandbox. Upstream instructions are trusted only for these scoped
tests; they confer no production, remote publication or broader filesystem authority.

## Change surface and return

Expected changes: three lock entries, focused behavioral fixtures/results, this slice,
plan progress/index pointers and append-only review/verification evidence. Regenerate
`dependency.json` and confirm no diff because capability/status did not change. No adapter,
installer, runtime config or tstack entry changes are needed for these wording updates.
Documentation impact is covered by this slice, the linked plan and dated behavior results.

Return through `itp-review` and `itp-verify`. Keep native run evidence distinct from static
checks. This slice does not complete the all-nine initiative; tstack adoption remains next.
