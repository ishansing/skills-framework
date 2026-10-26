# TODO

## ECC-informed product upgrades

Source: [competitive assessment](docs/work/ECC-I2P-COMPETITIVE-ANALYSIS.md) and
[ECC evidence](docs/work/ECC-COMPETITIVE-RESEARCH.md), researched 2026-10-26.
These are pending work items, not implemented capabilities or permission to publish,
install new skills, change dependency pins, or run paid benchmarks.

Preserve the core: one artifact-driven lifecycle, thin adapters, approved pinned
skills, explicit handoffs, human authority, and review/fresh verification at every scale.
Use the existing installer, checker and artifact ownership points before adding tooling.

### P0 — Correctness, credibility and first-run reliability

- [ ] Resolve the `security-threat-model` trigger conflict: I2P currently triggers on
  security-sensitive architecture while its pinned upstream requires an explicit user
  request. Preserve consent or approve a separately tracked adaptation; validate actual
  positive and negative native-runtime cases.
- [ ] Correct overstated native-validation labels with append-only clarifications;
  distinguish manual/emulated procedure, static checks, native execution and independently
  verified outcomes. Preserve original failed/historical evidence.
- [ ] Audit safety wording: distinguish instructional guards from deterministic checks
  and authorization boundaries; remove unsupported prompt-injection/enforcement guarantees.
- [ ] Observe fresh installation/onboarding attempts and record missing prerequisites,
  discovery ambiguity, duplicate skills and unnecessary human rescue steps.
- [ ] Define and test an installed-environment preflight: selected paths, skill hashes,
  duplicate discovery and required tools. Report unsupported capabilities before work;
  do not claim installed-byte checks prove which skill the host loaded or followed.
- [ ] Publish one durable, redacted native example with starting revision, host/model,
  prompt/configuration, actual trace, resulting diff and verification commands. Use it
  for the demo rather than presenting an illustrative prompt as an observed result.

### P1 — Dependable lifecycle and host integration

- [ ] Complete the [additional-agent support checklist](#support-additional-coding-agents):
  validate Codex first, then thin Claude Code bindings; qualify exact host/version support.
- [ ] Clarify the older rejection of per-runtime packaging in
  `agent-work/plans/UPGRADES.md`: reject duplicated lifecycle contracts, not necessary
  native host configuration. Record the decision before changing that policy.
- [ ] Bind active run/evidence pointers to a run identity, schema version and workspace/
  source revision as appropriate. Define compatibility/migration for existing ledgers.
- [ ] Add stale/missing/foreign evidence cases: an old review or verification file must
  not satisfy the current run merely because it exists. Document what each check can prove.
- [ ] Make status/resume output identify the active run, blockers and next action without
  hidden conversation history; prove it with interrupted/fresh-session runs.
- [ ] Add repeatable native regressions for checkpoint feedback, required handoffs,
  review/delegation, resume and false completion. Keep model trials distinct from script tests.
- [ ] Measure small-task artifact/load/intervention overhead. Reuse existing approved
  specs/issues/docs; consolidate artifacts only through an explicit tested contract change,
  retaining review and fresh verification.
- [ ] Evaluate managed repair/uninstall and cross-platform installer lifecycle coverage
  against observed user needs; preserve edits, ownership boundaries and explicit consent.
- [ ] Package three tested entry recipes using existing capabilities: bounded feature,
  unknown incident and specification-based review.

### P2 — Comparative proof and focused launch

- [ ] Define independent acceptance checks and a human-decision rubric for five task types:
  bounded feature, incomplete bug reproduction, interrupted/resumed feature, cross-module
  regression, and stale evidence/missing capability requiring a handoff.
- [ ] Agree a cost budget and matched bare-agent/ECC/I2P protocol before execution: same
  supported host/model, starting state, tools, permissions, task and scripted user answers;
  isolate installations and retain each product's intended workflow.
- [ ] Run an initial three-repetition pilot: five tasks × three configurations × three
  repetitions = 45 runs. Publish all results, caps, failures and necessary handoffs;
  expand only after validating the evaluator and assessing the expense.
- [ ] Measure independent correctness, false completion, resume correctness, review
  precision/recall, human intervention, total cost/time and avoidable workflow overhead.
- [ ] Invite five relevant external testers, observe at least three first attempts and
  seek voluntary second-task use. Treat these as learning targets, not adoption forecasts.
- [ ] Publish two real case studies, a short evidence-linked demo and a fair comparison
  page naming configurations, strengths, limitations and who should choose each product.
- [ ] Test coexistence before suggesting ECC and I2P can safely share a setup; check
  duplicate names, hook behavior and instruction precedence without importing unapproved skills.
- [ ] Market the demonstrated intent-to-reviewable/resumable-change advantage. If the
  pilot shows no quality or user-effort benefit, fix the workflow before a broad launch.

### Defer unless evidence justifies them

- Catalog-size parity, duplicated host workflows and unvalidated runtime logos.
- Large custom runtime/control plane, automatic deployment and silent self-learning.
- More cosmetic redesign or paid acquisition as substitutes for reliability and repeat use.

## Support additional coding agents

Keep one shared lifecycle and pinned skill inventory. Add thin agent-specific
installation/configuration only where native capabilities require it.

### 1. Validate Codex first

- [ ] Recheck official discovery, invocation-policy, instruction and delegation behavior
  for the exact Codex version under test. Its documented `.agents/skills` and
  `~/.agents/skills` paths already match the current installation layout.
- [ ] Test the current release in an isolated project/home before changing implementation.
- [ ] Reuse the portability checklist in `SKILL-FRAMEWORK.md` §3.4 and behavioral cases
  in `tests/skills/`; identify concrete gaps rather than assuming file-format compatibility.
- [ ] Implement only the compatibility changes demonstrated necessary by these runs.

### 2. Add agent-aware installation

- [ ] Add an agent selector to the installer/menu, with proposed flags
  `--agent opencode|codex|claude`; preserve existing scripted installation behavior.
- [ ] Keep each agent profile limited to discovery paths, project instructions,
  invocation controls, specialist configuration and capability/setup guidance.
- [ ] Record selected agent and actual managed paths in `.itp/install.json`.
- [ ] Extend `installed-local` checking to validate selected-agent locations instead
  of assuming every installation lives under `.agents/skills`.
- [ ] Preserve pin verification, ownership guards, refresh consent, existing user
  instructions and ledgers. Define collision behavior before supporting multiple agents
  in one project; avoid duplicate discovery.

### 3. Add Claude Code support

- [ ] Verify native `.claude/skills` / `~/.claude/skills` discovery for the tested version.
- [ ] Add a managed `CLAUDE.md` bridge to shared framework instructions, preserving
  existing project content.
- [ ] Map root/user-entry explicit invocation and model-callable adapters to native
  controls. Validate Claude's `disable-model-invocation` and Codex's
  `allow_implicit_invocation` behavior rather than relying on OpenCode metadata.
- [ ] Configure required specialist/subagent equivalents, including the current
  OpenCode-only `adversarial-modeler` configuration, where supported.
- [ ] Keep upstream skill bytes unchanged; use native configuration or separately
  tracked compatibility material when host adaptation is needed.
- [ ] Preserve `needs-human` handoffs when required capabilities are unavailable;
  do not silently weaken review or substitute approved procedures.

### 4. Prove behavior for each supported runtime

- [ ] Skills are discovered in the selected project/global scope.
- [ ] User explicitly invokes the root; root → adapter → upstream composition works.
- [ ] Child results return in a form the workflow can inspect.
- [ ] Phase checkpoints stop, accept feedback and continue correctly.
- [ ] A fresh session resumes from `.itp/run.md` and its artifact pointers.
- [ ] Review/delegation and verification produce actual findings and fresh evidence.
- [ ] Missing capabilities produce the correct handoff.
- [ ] User-entry recursion and runtime installation/substitution remain prohibited.
- [ ] Add meaningful automated checks for changed installation/configuration behavior;
  use native sessions for runtime-behavior evidence.

### 5. Publish scoped support claims

- [ ] Record agent version, model, environment, framework revision, results and gaps.
- [ ] Publish a support matrix covering installation, core workflow, specialist gaps
  and links to dated evidence.
- [ ] Label discovery-only support experimental; installation success is not lifecycle
  validation. Update README/runtime guides only to match demonstrated behavior.
- [ ] Assess other agents individually after Codex and Claude Code validation.

References:
- [Framework portability checklist](SKILL-FRAMEWORK.md#34-portability-checklist-for-a-second-runtime)
- [Behavioral validation guide](tests/skills/README.md)
- [Codex skills](https://developers.openai.com/codex/build-skills)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
