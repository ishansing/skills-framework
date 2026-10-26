# Skill Watch candidate triage — 2026-10-26

Source: [issue #9](https://github.com/ishansing/skills-framework/issues/9), updated
2026-10-26T12:24:39Z, including the current body and latest weekly comment. Scope:
read-only source review and recommendations. No skill installed, loaded for execution,
integrated, adopted, or added to the registry/lock. No candidate code executed.

The issue is a cumulative discovery backlog, not a list of approved skills or proof
that every item was newly authored this week. Its source-health inventory reports
last success on October 24 even though the issue/run is dated October 26. SkillsMP
is unavailable, samples are partial, and the change backlog limit has been reached.
Duplicate `code-review` entries from awesome-copilot are not updates to I2P's approved
Matt Pocock skill of the same name. Compare repository and path, not display name.

## Recommended shortlist

### 1. PR-feedback triage — best small candidate for permissioned evaluation

[pr-address-feedback](https://github.com/github/awesome-copilot/blob/2d4b998d2df28917074ee33db45c9601484c72ad/skills/pr-address-feedback/SKILL.md)
reads all review feedback, checks current PR-head code, presents each item with evidence,
and builds an approvable resolution plan before edits or GitHub writes.

- Gap filled: the existing `pr` skill formats a PR body; `code-review` produces review
  findings. Neither owns the complete feedback-resolution interaction.
- Proposed role: explicit user-entry workflow after reviews, outside mandatory lifecycle
  recursion. Preserve separate authorization for edits, commits, replies and thread resolution.
- Review issues before use: host-specific `ask_user` / `exit_plan_mode` calls need native
  mapping; per-comment full blocks can be verbose; automatic skip rules need scrutiny.
- Source tree contains one skill file; root license at this snapshot is MIT. That is a
  preliminary packaging observation, not completed compatibility/license approval.

### 2. Playwright quality guidance — useful only for projects using Playwright

[playwright-best-practices](https://github.com/currents-dev/playwright-best-practices-skill/blob/283d5cbc5d11aac1abda058b16ad22c317d54dc0/playwright-best-practices/SKILL.md)
routes to guidance on locators, waiting/assertions, isolation, fixtures, flaky tests,
authentication and CI.

- Gap filled: guidance on maintaining good tests complements existing browser operation
  and test-generation skills; it should not become another competing TDD method.
- Proposed trigger: an existing Playwright suite or requested Playwright test change,
  especially flakiness/isolation problems—not every UI task.
- Bundle needs all referenced material: 59 files under the skill directory at the
  inspected snapshot. Root license/frontmatter indicate MIT. Broad trigger wording
  and reference quality still need review; only the entry document was read in depth.
- Do not add overlapping instructions to every browser session or assume MCP availability.

### 3. Independent patch/regression proof — highest strategic relevance, heavier evaluation

Trail of Bits snapshot: `a3131740a39291e42fd15b9eac07e0b393ad71b1`.

- [patching-bugs](https://github.com/trailofbits/skills/blob/a3131740a39291e42fd15b9eac07e0b393ad71b1/plugins/patching-bugs/skills/patching-bugs/SKILL.md): known-bug workflow with independent reproduction/validation, patching, proof and regression campaign.
- [prove-patch](https://github.com/trailofbits/skills/blob/a3131740a39291e42fd15b9eac07e0b393ad71b1/plugins/patching-bugs/skills/prove-patch/SKILL.md): same-input baseline/patch evidence, controls, retained receipts and baseline/patch/revert proof.
- [regression-hunt](https://github.com/trailofbits/skills/blob/a3131740a39291e42fd15b9eac07e0b393ad71b1/plugins/regression-hunt/skills/regression-hunt/SKILL.md): source-pinned campaigns, independent reproduction/replay/adjudication, sealed records and resumable progress.
- [adjudicate-regression](https://github.com/trailofbits/skills/blob/a3131740a39291e42fd15b9eac07e0b393ad71b1/plugins/regression-hunt/skills/adjudicate-regression/SKILL.md): distinguishes newly introduced regressions from latent bugs, incomplete fixes and unresolved claims.

These closely match I2P's stale-evidence, independent-validation and resume priorities.
They are not approval to replace `diagnosing-bugs`, `tdd` or `differential-review`.
First evaluate them as an explicit bounded specialist workflow or study their evidence
contracts with attribution; decide integration ownership only after a native pilot.

Material blockers to a simple pin:

- Shared references/schemas/scripts live above individual skill directories. Copying
  only `skills/<id>/` loses those dependencies; the current per-skill distribution
  layout needs an explicit packaging design before these can work unchanged.
- Source trees contain 82 files under patching-bugs and 28 under regression-hunt.
  Both pyprojects require Python >=3.13; workflows call `uv run --no-project`.
  These are additional optional prerequisites, not existing I2P installation guarantees.
- Multiple fresh stage agents and machine-checked receipts add execution/cost/host
  requirements; do not make the entire workflow mandatory for a small routine fix.
- The patching coordinator allows up to three repair attempts. Reconcile that protocol
  and nested workflow dispatch with I2P's retry/recursion bounds before integration;
  do not silently override either workflow's policy or label isolated subskills plug-compatible.
- Patching workflow requires a clean Git worktree and local patch commits. Existing
  dirty work and commit authorization must be resolved without discarding user changes.
- [Root license](https://github.com/trailofbits/skills/blob/a3131740a39291e42fd15b9eac07e0b393ad71b1/LICENSE)
  is CC BY-SA 4.0 at this snapshot; no separate license file was found in these two
  plugin trees. Review applicable attribution/share-alike obligations and bundled-file
  provenance before redistribution/adaptation. This is not a legal compatibility verdict.

## Conditional or deferred

- [cypress-flake-fixer](https://github.com/github/awesome-copilot/blob/156736fb63e965b2f547a1460f3b5972c46e6b24/skills/cypress-flake-fixer/SKILL.md): good narrow fit for an actual Cypress suite; scanner is heuristic, requires separate source review, and no scanner/Cypress runs were performed. I2P itself does not currently need Cypress testing.
- [security-best-practices](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/security-best-practices/SKILL.md): potentially useful secure-default guidance for Python/JS/TS/Go, but explicitly requires a user security request and overlaps current specialists. Resolve I2P's existing threat-model trigger mismatch before adding another broad security trigger.
- [Cloudflare security-audit](https://github.com/cloudflare/security-audit-skill/blob/c1c8a8c1471069fb0e188eeaff69b8e8db6564a8/skills/security-audit/SKILL.md): strong evidence/coverage discipline, but target execution requires an OS-enforced no-network/resource-bounded sandbox and trusted evidence-promotion machinery. Do not treat scratch directories as satisfying that requirement. Defer execution/integration until those capabilities are real.
- Java/Quarkus, App Store, Firebase APK, Vitess and other stack-specific entries: consider only for a concrete project in that stack. No general-framework adoption recommended from issue metadata alone.
- Alternative broad architecture/review/methodology skills: not a current gap; avoid competing defaults alongside Matt Pocock. The issue's Superpowers release is not permission to replace the primary process.

## Recommended decision order

1. Review existing approved updates first; see the companion update note.
2. If the user wants the smallest addition, request permission to evaluate PR-feedback
   triage; Playwright guidance is next only if relevant to target projects.
3. For evidence-quality upgrades, request a separate packaging/license/capability review
   of Trail of Bits patching/regression bundles before installation or a paid/native pilot.
4. Keep findings as proposals until explicit approval. A source read or discovery badge
   is not an adoption, license audit, installed test, or native-runtime validation.
