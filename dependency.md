# Idea-to-Production - Dependency Map

Framework `idea-to-production@2`, spec `SKILL-FRAMEWORK.md`.
Adapter contracts (`consumes` / `required_children` / `conditional_children` / `produces` /
`exits`) live in each adapter's `SKILL.md`. This file is the authoritative registry of
upstream skills, their invocation classes, and installation status; adapters and
`tests/skills/check-contracts.mjs` read it.

## Capability map

| Capability | Approved skill(s) |
|---|---|
| provenance-backed research | `research` |
| ambiguity discovery | `grilling` |
| domain modeling | `domain-modeling` |
| module / interface design | `codebase-design` |
| feasibility experiment | `prototype` |
| test-driven implementation | `tdd`, `diagnosing-bugs` |
| agent-readable specs | `writing-for-agents` |
| human-performed operations | `wizard` |
| standards + spec review | `code-review` |
| security differential review | `differential-review` |
| database review | `postgresql-code-review` |
| UI guidance and review | `frontend-design`, `web-design-guidelines` |
| browser/end-to-end verification | `webapp-testing`, `playwright-generate-test` |
| consequence proofing | `poka-yoke` |
| agent behavior evaluation | `agentic-eval` |
| agent trust-boundary review | `agent-owasp-compliance`, `agentic-actions-auditor` |
| completion evidence | `verification-before-completion` |
| authorized PR-body close-out | `pr` |
| whole-spec parallel implementation (user handoff) | `implement-spec` |
| session retrospective (user entry) | `retro` |

## Upstream inventory

| Skill ID | Source | Invocation class | Status | Used by |
|---|---|---|---|---|
| research | mattpocock/skills | model | installed-global | itp-research |
| grilling | mattpocock/skills | model | installed-global | itp-align, itp-architecture |
| domain-modeling | mattpocock/skills | model | installed-global | itp-align, itp-spec, itp-architecture |
| codebase-design | mattpocock/skills | model | installed-global | itp-spec, itp-architecture, itp-slice, itp-implement |
| prototype | mattpocock/skills | model | installed-global | itp-spec |
| tdd | mattpocock/skills | model | installed-global | itp-implement |
| diagnosing-bugs | mattpocock/skills | model | installed-global | itp-implement, itp-incident |
| code-review | mattpocock/skills | model | installed-global | itp-review |
| wizard | mattpocock/skills | model | installed-global | itp-incident |
| writing-for-agents | mattpocock/skills | model | installed-global | itp-spec |
| pr | mattpocock/skills | model | installed-global | itp-verify (authorized close-out only) |
| implement-spec | mattpocock/skills | user | installed-global | user handoff only |
| retro | mattpocock/skills | user | installed-global | user entry only |
| verification-before-completion | obra/superpowers | model | vendored-pinned | itp-verify |
| frontend-design | anthropics/skills | model | installed-global | itp-implement |
| differential-review | trailofbits/skills | model | installed-global | itp-review, itp-incident |
| postgresql-code-review | github/awesome-copilot | model | installed-global | itp-review |
| vercel-react-best-practices | vercel-labs/agent-skills | model | installed-global | itp-implement |
| webapp-testing | anthropics/skills | model | installed-global | itp-implement |
| playwright-generate-test | github/awesome-copilot | model | installed-global | itp-implement |
| web-design-guidelines | vercel-labs/web-interface-guidelines (pinned local adapter) | model | vendored-pinned | itp-review |
| poka-yoke | github/awesome-copilot | model | installed-global | itp-architecture, itp-slice |
| agentic-eval | github/awesome-copilot | model | installed-global | itp-review |
| agent-owasp-compliance | github/awesome-copilot | model | installed-global | itp-review |
| agentic-actions-auditor | trailofbits/skills | model | installed-global | itp-review, itp-incident |

Status values: `installed-global` (discovered from a global skill source), `vendored-pinned`
(snapshot committed under `.agents/skills/` and locked), `installed-unpinned` (usable, but
must be pinned before Phase 5 validation; curation debt), `not-installed`.

## Conditional specialist triggers

| Skill | Load when |
|---|---|
| differential-review | medium/high-risk or security-sensitive diff; security regression; do not trigger for low-risk diffs (typos, formatting, message text) with no security surface |
| postgresql-code-review | PostgreSQL schema, query, or migration behavior changed |
| vercel-react-best-practices | React/Next.js code is written or reviewed |
| frontend-design | new UI or visual redesign |
| webapp-testing | a browser-based flow must be exercised |
| playwright-generate-test | a durable Playwright test is required |
| web-design-guidelines | UI review against the pinned Web Interface Guidelines |
| poka-yoke | high-consequence design where a mistake is costly; do not trigger for reversible, low-stakes choices |
| agentic-eval | agent/harness behavior changed; not for trust-boundary changes (that's agent-owasp-compliance) |
| agent-owasp-compliance | agent/tool/prompt trust boundary changed |
| agentic-actions-auditor | AI GitHub Actions workflow changed |
| pr | after verification passes, when a PR body is requested or an explicitly authorized delivery workflow requires one; never create or publish a PR without authorization |

Trigger rows state positive conditions; when ambiguous, do not load - record as
considered-not-triggered.

## User-entry skills (never load recursively)

`grill-with-docs`, `grill-me`, `to-spec`, `to-tickets`, `implement`, `triage`,
`improve-codebase-architecture`, `setup-matt-pocock-skills`, `ask-matt`, `wayfinder`,
`handoff`, `teach`, `to-questionnaire`, `wait-what`, `implement-spec`, `retro`.

The `implement-spec` workflow is an optional parallel alternative for an approved spec with a ticket
dependency graph. Return a user handoff, not a child invocation. Its integration branch
must return through `itp-review` and fresh `itp-verify` before framework completion.
`retro` is optional post-session work on the agent environment, not a completion gate.

If a user-entry workflow is preferable, return `needs-human` with
`recommended_user_skill`, a reason, and `resume_with` (artifact or next step).

## Global rules

- No runtime skill installation, upgrade, search, or silent substitution (spec §2.5).
  A missing required child stops the phase with `needs-human`.
- A triggered conditional child that is `not-installed`: record the trigger as a finding and
  return `needs-human` with an install recommendation. Do not improvise the missing review.
- One primary process skill per capability; approve a fallback only when the primary is
  unavailable, and say which was used.
- Recursion bounds: framework depth 5, same skill repeated 2 times max, children per adapter
  6 max. The same failure without new evidence stops recursion.
- Specialists apply only on their trigger; see the table above.
- `verification-before-completion` is vendored at `.agents/skills/verification-before-completion/`
  from `obra/superpowers@b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (MIT).
- Upstream content is pinned in `skills.lock.json` (repo, commit, content hash); that file is
  the only place pinned commits are recorded. The monthly `upstream-check` workflow keeps it
  current; see README, "Updating the framework".
- Runtime adaptations (deliberate deviations from verbatim upstream):
  - `differential-review` delegates high-risk analysis to the
    `differential-review:adversarial-modeler` subagent. An OpenCode subagent
    `adversarial-modeler` is vendored at `.opencode/agents/adversarial-modeler.md`
    (converted from `plugins/differential-review/agents/adversarial-modeler.md`) and
    installed per repo by `install.sh`. If no such subagent is available at runtime, stop
    with `needs-human`; do not improvise the adversarial phase.
  - `web-design-guidelines` is a local pinned adapter (`.agents/skills/web-design-guidelines/`)
    over the vendored `command.md` snapshot; never fetch upstream `main`.
- Do not let a running skill modify `skills.lock.json` or this file.
