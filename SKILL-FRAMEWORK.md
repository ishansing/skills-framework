# Idea-to-Production — Skill Framework Specification

**Framework ID:** `idea-to-production`
**Spec version:** `2.0.0` (skill-framework layer only)
**Companion document:** `CUSTOM-HARNESS.md` — the future production harness that implements and enforces this framework mechanically. Do not begin that document's build order until this document's readiness gate (§25) is satisfied.
**Target runtimes:** any coding agent that supports the Agent Skills spec (a `SKILL.md` file with YAML frontmatter, discovered and loaded on demand). Primary validation runtime: **OpenCode**, which has native skill discovery and a built-in `skill` tool. Secondary validation targets: other Agent-Skills-compatible agents such as **Codex** and **Pi**, used to confirm that the framework's *composition and recursion behavior* — not just the `SKILL.md` file format — actually ports, since loading/recursion semantics differ by runtime.
**Primary design:** Matt-Pocock-first, composable Agent Skills with thin lifecycle adapters

---

## 1. Purpose

This specification defines a **skill framework**, not a harness.

The framework turns an engineering intent into a composable lifecycle of reusable skills:

```text
Intent
  ↓
Research / Align
  ↓
Specify
  ↓
Architect
  ↓
Slice
  ↓
Implement
  ↓
Review
  ↓
Verify
  ↓
Complete / Hand off
```

The framework is responsible for defining:

- which skills exist;
- what each skill is responsible for;
- which skills may compose with which other skills;
- required vs conditional dependencies;
- artifact contracts between phases;
- recursion and retry conventions;
- human handoff conventions;
- upstream skill provenance;
- packaging that stays compatible across Agent-Skills runtimes;
- validation tests for isolated and composed skill behavior.

The framework is **not** responsible for implementing production runtime controls such as worker leases, sandbox orchestration, global budgets, immutable audit logs, atomic state transitions, deployment authorization, or kill switches. Those belong to the companion harness document, and are out of scope here.

### 1.1 This document's place in the two-stage strategy

```text
STAGE 1 — FRAMEWORK VALIDATION   (this document)

spec.md + dependency.md
        ↓
SKILL.md definitions
        ↓
pre-installed upstream skills
        ↓
one or more Agent-Skills-compatible runtimes (OpenCode primary)
        ↓
isolation + composition + recursion tests
        ↓
refine skill contracts
```

Stage 2 — the production harness — is defined separately in `CUSTOM-HARNESS.md` and should only be started once §25's readiness gate is met. Building the harness before the framework is stable means encoding rules that are still going to change.

---

## 2. Design Principles

### 2.1 Skills own behavior; the runtime only runs them

The workflow should live primarily in the skills and their dependency contracts rather than in a large runtime-specific prompt or hardcoded workflow.

```text
Wrong
─────
Runtime giant prompt
  ├── research instructions
  ├── architecture instructions
  ├── TDD instructions
  ├── review instructions
  └── every routing decision

Preferred
─────────
Runtime (OpenCode / Codex / Pi / ...)
  ↓
idea-to-production
  ↓
small lifecycle adapters
  ↓
specialized upstream skills
```

This keeps the framework portable across Agent-Skills-compatible runtimes instead of being locked into one tool's prompt conventions.

### 2.2 Prefer upstream skills over duplicated local skills

Where a trusted upstream skill already owns a procedure, the framework should reuse it.

A local framework skill should normally be a **thin adapter**, not a fork of the upstream prompt.

```text
UPSTREAM SKILL
      +
FRAMEWORK ADAPTER / CONTRACT
      =
FRAMEWORK-COMPATIBLE CAPABILITY
```

Adapters add things such as:

- lifecycle position;
- expected inputs;
- required artifacts;
- dependency selection;
- completion criteria;
- handoff format;
- framework-specific naming.

Adapters should not copy large portions of the upstream skill body.

### 2.3 Capability-first composition

The framework reasons in capabilities such as:

```text
research-with-provenance
ambiguity-analysis
domain-modeling
module-interface-design
test-driven-implementation
security-differential-review
browser-e2e
completion-evidence
```

`dependency.md` maps those capabilities to approved skills.

### 2.4 Matt-Pocock-first engineering profile

Matt Pocock skills are the primary general engineering/process layer. Other ecosystems are used for specialist gaps rather than as competing end-to-end methodologies.

```text
Matt Pocock       → engineering process / reasoning
Trail of Bits     → security-specialist review
Vercel            → React / web interface guidance
Anthropic         → frontend design / webapp testing
GitHub Copilot    → narrow ecosystem specialists
Obra Superpowers  → completion evidence + selected fallbacks
```

This is an explicit, opinionated choice, not a neutral default — swap the primary layer if your team's engineering philosophy differs (e.g. less TDD-centric, lighter-weight domain modeling).

### 2.5 No runtime skill installation

For framework tests, all dependencies should be installed **before the run**.

A running skill may select or load an installed dependency, but it must not:

- search the web for a replacement skill;
- install a new skill;
- upgrade a skill;
- rewrite another skill;
- silently substitute a missing dependency.

Discovery/curation is a separate maintenance workflow.

---

## 3. Reference & Validation Runtimes

The framework is authored against the general Agent Skills spec so it can run on any compatible agent. It is currently validated primarily in **OpenCode**, because OpenCode natively discovers Agent Skills and loads them on demand with its `skill` tool.

For portability, project-local framework skills SHOULD use:

```text
.agents/skills/<skill-id>/SKILL.md
```

This is a real OpenCode discovery path alongside `.opencode/skills/` and the Claude-compatible `.claude/skills/` path, and is the least OpenCode-specific of the three.

### 3.1 What the runtime needs to provide

Any runtime used to validate this framework needs to provide:

- skill discovery;
- on-demand skill loading (the model can request the full body of a skill it hasn't seen yet, rather than everything being pre-injected);
- model execution with normal coding/file/shell tools;
- interactive human feedback;
- a practical environment for composition experiments.

### 3.2 What the runtime is NOT expected to prove

No Agent-Skills runtime tested here is expected to give formal guarantees of:

- immutable skill hashes;
- privilege monotonicity;
- sandbox guarantees;
- atomic lifecycle state;
- worker leases;
- cost accounting;
- production deployment controls;
- durable append-only audit logs.

Those are harness concerns — see `CUSTOM-HARNESS.md`. During framework validation, these remain **framework conventions and test assertions**, not security boundaries, regardless of which runtime is used.

### 3.3 Skill loading model

The root and adapter skills should name exact child skill IDs in their instructions. Conceptually, this should hold on any compliant runtime:

```text
User loads idea-to-production
        ↓
root decides next framework adapter
        ↓
root asks the runtime's skill tool to load adapter
        ↓
adapter loads approved upstream skill(s)
        ↓
result/artifact returned to current conversation
        ↓
root continues lifecycle
```

OpenCode should not need a separate custom plugin for the MVP; its built-in `skill` tool is sufficient.

### 3.4 Portability checklist for a second runtime

Before trusting this framework on a runtime other than OpenCode (Codex, Pi, etc.), re-verify the following, since these vary by implementation even though the `SKILL.md` file format itself is broadly standardized:

```text
✓ Does the runtime expose a callable "load this skill by ID" action,
  or does it just inject all skill text into context up front?
  (Changes whether §10's composition protocol works as written.)

✓ Does a loaded skill's output actually return to the calling
  skill/adapter, or does it flatten into one shared context?
  (Changes whether adapters can inspect a child's structured result.)

✓ Does the runtime respect custom `metadata` frontmatter keys
  (e.g. invocation-class), or are unknown keys silently dropped?
  If dropped, encode invocation-class conventions in the skill BODY
  text instead of relying on frontmatter metadata being read.

✓ Does the runtime support nested/recursive skill loading at all,
  or only one level (root → skill, no skill → skill)?

✓ What project-local and global discovery paths does it scan?
  Confirm `.agents/skills/` (or an equivalent) is actually honored,
  not just `.opencode/skills/`.
```

Treat any runtime that fails several of these as requiring its own thin compatibility layer, not a drop-in replacement for OpenCode.

---

## 4. Framework Repository Layout

Recommended repository layout:

```text
project/
├── AGENTS.md
├── skill-framework.md              # this document
├── dependency.md
├── skills.lock.json
├── opencode.jsonc                 # optional OpenCode test configuration
│
├── .agents/
│   └── skills/
│       │
│       ├── idea-to-production/
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── lifecycle.md
│       │       └── artifacts.md
│       │
│       ├── itp-research/
│       │   └── SKILL.md
│       ├── itp-align/
│       │   └── SKILL.md
│       ├── itp-spec/
│       │   └── SKILL.md
│       ├── itp-architecture/
│       │   └── SKILL.md
│       ├── itp-slice/
│       │   └── SKILL.md
│       ├── itp-implement/
│       │   └── SKILL.md
│       ├── itp-review/
│       │   └── SKILL.md
│       ├── itp-verify/
│       │   └── SKILL.md
│       └── itp-incident/
│           └── SKILL.md
│
├── vendor/
│   └── skills/                    # optional pinned snapshots/adapters
│
├── docs/
│   ├── product/
│   └── architecture/
│
└── tests/
    └── skills/
        ├── isolation/
        ├── composition/
        ├── recursion/
        ├── failure/
        └── golden/
```

Upstream dependencies may be installed globally or in a separate approved skill source. They do not need to be copied into `.agents/skills/` if the runtime can already discover them under stable unique IDs.

---

## 5. Root Skill

The framework root is:

```text
idea-to-production
```

It is the **only lifecycle orchestrator owned by this framework**.

It should remain thin. Its responsibilities are:

1. determine where the current work is in the lifecycle;
2. identify the next adapter/capability;
3. load that adapter;
4. inspect the returned artifact/status;
5. choose the next step;
6. stop for a human when necessary;
7. prevent obvious recursive loops;
8. maintain a lightweight run ledger in the conversation/artifacts.

It should NOT contain detailed procedures for TDD, security review, research, UI design, etc.

### 5.1 Suggested `SKILL.md` frontmatter

```yaml
---
name: idea-to-production
description: >-
  Drive an engineering idea through research, alignment, specification,
  architecture, vertical slicing, implementation, review, and verification
  by composing the installed idea-to-production framework skills.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  framework-version: "2"
  role: root
  invocation-class: user
  opencode/autoinvoke: "false"
  opencode/slash: "true"
---
```

The root should normally be invoked explicitly by the user instead of being automatically selected for every coding request. `opencode/*` metadata keys are OpenCode-specific extensions — see §3.4 before relying on equivalent behavior elsewhere.

---

## 6. Thin Lifecycle Adapters

The framework owns these adapters:

```text
idea-to-production
│
├── itp-research
├── itp-align
├── itp-spec
├── itp-architecture
├── itp-slice
├── itp-implement
├── itp-review
├── itp-verify
└── itp-incident
```

Each adapter provides the stable framework contract while delegating specialized reasoning to upstream skills.

### 6.1 Adapter contract

Every adapter SHOULD define:

```yaml
adapter_contract:
  id: itp-implement
  role: lifecycle-adapter
  phase: implementation

  consumes:
    - issue-or-slice
    - acceptance-criteria
    - relevant-design-context

  required_children:
    - tdd

  conditional_children:
    - diagnosing-bugs
    - react-best-practices
    - frontend-design
    - webapp-testing

  produces:
    - implementation-summary
    - validation-evidence
    - unresolved-findings

  exits:
    - completed
    - blocked
    - needs-human
    - needs-review
```

This metadata may live in `SKILL.md`, a reference file, or `dependency.md`. The runtime does not need to interpret every field automatically; the framework uses them as authoring and testing contracts. (The harness will interpret these mechanically — see `CUSTOM-HARNESS.md`.)

---

## 7. Upstream Skill Profile

### 7.1 Matt Pocock — core engineering layer

Pre-install the model-invoked/core skills used by the framework:

```text
research
grilling
domain-modeling
codebase-design
prototype
tdd
diagnosing-bugs
code-review
resolving-merge-conflicts
wizard
writing-for-agents
```

Framework usage:

| Skill | Framework use |
|---|---|
| `research` | provenance-backed external research |
| `grilling` | ambiguity discovery / decision pressure |
| `domain-modeling` | terms, scenarios, invariants, domain boundaries |
| `codebase-design` | interfaces, seams, deep modules, codebase structure |
| `prototype` | throwaway experiment for uncertain design choices |
| `tdd` | implementation loop |
| `diagnosing-bugs` | confirmed failure/regression diagnosis |
| `code-review` | Standards + Spec review |
| `resolving-merge-conflicts` | intent-aware conflicts |
| `wizard` | human-performed operational steps |
| `writing-for-agents` | agent-readable specs/context/instructions |

### 7.2 Matt user-entry workflows

The following should NOT be recursive dependencies of framework adapters:

```text
grill-with-docs
grill-me
to-spec
to-tickets
implement
triage
improve-codebase-architecture
setup-matt-pocock-skills
ask-matt
wayfinder
```

If one of these is preferable, the framework should tell the human:

```yaml
status: needs-human
recommended_user_skill: to-spec
reason: "Use Matt's native interactive spec workflow for this decision-heavy request."
resume_with: docs/product/spec.md
```

### 7.3 Specialist layer

Conditional specialists are defined in `dependency.md` and may include:

- Trail of Bits `differential-review`;
- Trail of Bits `agentic-actions-auditor`;
- Vercel `react-best-practices`;
- Vercel `web-design-guidelines`;
- Anthropic `frontend-design`;
- Anthropic `webapp-testing`;
- GitHub Awesome Copilot `poka-yoke`;
- GitHub Awesome Copilot `postgresql-code-review`;
- GitHub Awesome Copilot `playwright-generate-test`;
- GitHub Awesome Copilot `agentic-eval`;
- GitHub Awesome Copilot `agent-owasp-compliance`;
- Obra `verification-before-completion`.

These should be loaded only when their trigger is present.

Because most of these live in independently maintained repos, expect occasional breaking renames/removals upstream (this has already happened more than once in Matt Pocock's own repo). Re-validate adapter contracts against upstream changes deliberately — see §13 on pinning.

---

## 8. Phase-to-Skill Composition

### 8.1 Research

Framework adapter:

```text
itp-research
```

Primary composition:

```text
itp-research
  └── research
```

Responsibilities:

- inspect the current repository/context;
- identify external unknowns;
- use `research` when outside evidence is needed;
- record assumptions and unknowns;
- preserve sources/provenance.

Expected artifacts:

```text
docs/product/research.md
docs/product/assumptions.md
docs/product/unknowns.md
```

### 8.2 Alignment / Grilling

```text
itp-align
  ├── grilling
  └── domain-modeling        [conditional]
```

Use `domain-modeling` when ambiguity is really about domain language, business invariants, actors, scenarios, or bounded contexts.

Exit only when high-impact decisions are resolved or explicitly handed to the user.

### 8.3 Specification

```text
itp-spec
  ├── writing-for-agents
  ├── domain-modeling        [conditional]
  ├── codebase-design        [reference]
  └── prototype              [uncertain feasibility only]
```

Expected artifacts:

```text
docs/product/spec.md
docs/product/acceptance-criteria.md
```

Requirements should have stable IDs where useful.

### 8.4 Architecture

```text
itp-architecture
  ├── domain-modeling
  ├── codebase-design
  ├── grilling              [unresolved decision]
  └── poka-yoke             [high-consequence design]
```

Expected artifacts:

```text
docs/architecture/architecture.md
docs/architecture/ADR/
```

The adapter—not `codebase-design` alone—owns production of the architecture artifact.

### 8.5 Vertical slicing

```text
itp-slice
  ├── local tracer-bullet procedure
  ├── codebase-design
  └── poka-yoke             [conditional]
```

Prefer independently testable vertical slices over horizontal component tasks.

A slice should contain:

- objective;
- linked requirements;
- acceptance criteria;
- relevant files/modules;
- dependencies;
- out-of-scope behavior;
- validation strategy;
- conditional specialist triggers.

### 8.6 Implementation

```text
itp-implement
  ├── tdd                         REQUIRED
  ├── codebase-design             as-needed
  ├── diagnosing-bugs             failure path
  ├── react-best-practices        React/Next.js
  ├── frontend-design             UI creation
  ├── webapp-testing              web flow
  └── playwright-generate-test    durable Playwright test
```

Reference loop:

```text
slice / issue
   ↓
load tdd
   ↓
red
   ↓
green
   ↓
refactor
   ↓
run checks
   ↓
problem unclear?
   ├── yes → diagnosing-bugs
   └── no  → implementation result
```

Do not load both Matt `tdd` and Superpowers `test-driven-development` by default. One is primary; the other is fallback.

### 8.7 Review

```text
itp-review
  ├── code-review                     REQUIRED
  ├── differential-review             risk/security trigger
  ├── postgresql-code-review          PostgreSQL trigger
  ├── web-design-guidelines           UI trigger
  ├── agentic-eval                    agent/harness trigger
  ├── agent-owasp-compliance          agent-security trigger
  └── agentic-actions-auditor         AI GitHub Actions trigger
```

Matt `code-review` should not be treated as the only security or bug signal.

Review should use a fresh reading of the current diff/spec rather than simply accepting the implementation narrative.

### 8.8 Verification

```text
itp-verify
  └── verification-before-completion
```

The verification adapter requires fresh evidence before the root skill claims completion.

Evidence may include:

- tests actually run;
- build output;
- type checking;
- linting;
- browser checks;
- migration checks;
- relevant review findings resolved.

### 8.9 Incident / failure handling

```text
itp-incident
  ├── diagnosing-bugs
  ├── differential-review         [security regression]
  ├── agentic-actions-auditor     [AI workflow]
  └── wizard                      [human-only operations]
```

---

## 9. Skill Invocation Classes

The framework recognizes two logical classes:

```text
USER ENTRY SKILL
  invoked intentionally by the human

MODEL-COMPOSABLE SKILL
  may be loaded by the root/adapters during execution
```

For framework validation this is primarily a **framework convention**, represented with metadata and reinforced by the root/adapters — not a mechanically enforced boundary. Mechanical enforcement is a harness concern (`CUSTOM-HARNESS.md`).

Example:

```yaml
metadata:
  framework: idea-to-production
  invocation-class: model
```

### 9.1 Root rule

`idea-to-production` is user-entry.

### 9.2 Recursive rule

Adapters may recursively load only dependencies marked/modelled as composable.

### 9.3 User-only dependency rule

If a desired dependency is user-entry only:

```text
DO NOT load recursively
      ↓
return needs-human
      ↓
recommend exact user skill
      ↓
provide resume artifact / next step
```

---

## 10. Composition Protocol

No runtime tested here needs a bespoke JSON RPC protocol for the first experiment. The protocol can be expressed as a structured section in skill output — see §3.4 for what to re-verify if the target runtime doesn't return structured child results cleanly.

Recommended child request:

```yaml
next_skill:
  id: domain-modeling
  requirement: conditional
  reason: "The collaborator role boundaries are still ambiguous."
  context:
    artifacts:
      - docs/product/research.md
    focus:
      - collaborator
      - invitation
      - ownership
```

Recommended child result:

```yaml
skill_result:
  skill: domain-modeling
  status: completed
  summary: "Defined Owner, Collaborator, Invite, and Membership boundaries."
  artifacts:
    - docs/product/domain.md
  findings: []
  recommended_next:
    - itp-spec
```

The root/adapter remains responsible for deciding whether to follow a recommendation.

---

## 11. Recursion Rules

The goal is to validate useful composition without creating uncontrolled loops.

These are **framework conventions** — enforced by asking the model to follow them, not by code. Treat every rule in this section as something to hand-verify during composition/recursion testing (§19), and as a candidate for early mechanical enforcement in the harness (`CUSTOM-HARNESS.md` §6 proposes enforcing exactly this section first, since it's cheap to encode and the most likely convention to be violated under context pressure).

### 11.1 Default limits

Framework convention:

```yaml
recursion:
  max_framework_depth: 5
  max_repeat_same_skill: 2
  max_children_from_one_adapter: 6
```

### 11.2 Cycle avoidance

Bad:

```text
tdd
  → diagnosing-bugs
      → tdd
          → diagnosing-bugs
              → ...
```

Allowed bounded recovery:

```text
tdd
  ↓ failing behavior not understood
 diagnosing-bugs
  ↓ concrete diagnosis + regression case
 tdd
  ↓ verify fix
 continue
```

If the same failure returns without new evidence, stop and ask the human rather than recurse again.

### 11.3 Context discipline

A child skill should receive the smallest useful context:

- relevant artifact paths;
- target requirement/slice;
- current diff when reviewing;
- error/reproduction when debugging;
- specific question when researching.

Avoid replaying the entire conversation to every skill when source artifacts are available.

---

## 12. Artifact Contracts

Artifacts are the main interface between lifecycle phases.

Recommended flow:

```text
research.md
    ↓
spec.md + acceptance-criteria.md
    ↓
architecture.md + ADRs
    ↓
slices/*.md
    ↓
implementation diff + tests
    ↓
review.md
    ↓
verification.md
```

### 12.1 Artifact rules

Artifacts SHOULD:

- be readable without hidden conversation context;
- distinguish facts, assumptions, decisions, and open questions;
- link to source files/requirements where useful;
- identify stale assumptions;
- be concise enough to load selectively;
- be version-controlled during repository experiments.

### 12.2 Framework run ledger

Keep a lightweight run artifact:

```yaml
run:
  goal: "Add collaborator invitations"
  current_phase: review
  completed:
    - research
    - align
    - spec
    - architecture
    - slice
    - implement
  artifacts:
    research: docs/product/research.md
    spec: docs/product/spec.md
    architecture: docs/architecture/architecture.md
    slice: docs/work/ISSUE-014.md
  loaded_skills:
    - research
    - grilling
    - domain-modeling
    - tdd
    - code-review
  open_questions: []
```

This can initially live at:

```text
.itp/run.md
```

or `.itp/run.yaml` if the runtime reliably edits YAML.

It is a coordination aid, not a production state database — the harness replaces it with atomic, persisted state (`CUSTOM-HARNESS.md` §4, State/Persistence).

---

## 13. `skills.lock.json`

The lockfile documents exactly which upstream skill content the framework was tested against.

At the framework layer it is mainly for reproducibility and auditing; the harness later enforces it mechanically.

Example:

```json
{
  "version": 1,
  "framework": "idea-to-production@2",
  "skills": [
    {
      "id": "research",
      "repo": "mattpocock/skills",
      "commit": "<exact-commit-sha>",
      "contentSha256": "<sha256>",
      "invocationClass": "model"
    },
    {
      "id": "tdd",
      "repo": "mattpocock/skills",
      "commit": "<exact-commit-sha>",
      "contentSha256": "<sha256>",
      "invocationClass": "model"
    },
    {
      "id": "differential-review",
      "repo": "trailofbits/skills",
      "commit": "<exact-commit-sha>",
      "contentSha256": "<sha256>",
      "invocationClass": "model"
    }
  ]
}
```

Rules:

- never use `latest` in the lockfile;
- record exact upstream repository and commit;
- hash vendored skill content;
- record mutable referenced resources separately;
- regenerate intentionally during framework upgrades;
- do not let a running skill modify the lockfile.

---

## 14. Mutable Upstream Resources

A skill that dynamically fetches mutable instructions is not reproducible enough for this framework's autonomous tests.

Example: if a UI review skill fetches guidelines from upstream `main`, create a thin local adapter that points to a pinned/vendored snapshot instead.

```text
upstream web-design-guidelines skill
           ↓
local itp-pinned-web-guidelines adapter
           ↓
vendor/web-interface-guidelines/<commit>/command.md
```

The framework tests the pinned snapshot.

The harness may enforce this mechanically; at the framework layer it is an installation/curation rule.

---

## 15. Skill Selection Rules

Use one primary process skill plus orthogonal specialists.

### 15.1 Preferred order

```text
1. Matt Pocock process/reasoning skill
2. stack/domain specialist if triggered
3. independent verification/security specialist if triggered
4. approved fallback only if primary is unavailable
5. needs-human if required capability is missing
```

### 15.2 Avoid overlapping workflows

Bad default:

```text
tdd
+ test-driven-development
+ another TDD skill
```

Preferred:

```text
matt:tdd                primary
obra:TDD                fallback only
```

### 15.3 Discovery skills are curator-only

Skills such as:

```text
find-skills
agent-skill-stack
skill-creator
writing-great-skills
```

belong to framework development/curation. They should not dynamically change a running project's dependency set.

---

## 16. Human Handoff Contract

A framework skill should stop and ask the human when:

- a high-impact product decision has no defensible default;
- a required user-entry skill is needed;
- credentials/account actions must be performed by the user;
- destructive or production-changing action is requested;
- the same failure recurs without new evidence;
- a required installed skill is missing;
- conflicting requirements cannot be reconciled;
- an implementation/review decision exceeds the current task scope.

Recommended handoff:

```yaml
handoff:
  status: needs-human
  reason: "Product owner must choose whether deleted projects are recoverable."
  decision: "Recoverable deletion policy"
  options:
    - soft-delete for 30 days
    - irreversible delete
  affected_artifacts:
    - docs/product/spec.md
    - docs/architecture/architecture.md
  resume_with: itp-spec
```

---

## 17. Definition of Ready — Framework Phase

A phase is ready to execute when its required context exists.

Example for implementation:

```text
✓ a vertical slice/issue exists
✓ acceptance criteria are testable
✓ required architecture decision is known
✓ relevant upstream skills are installed
✓ conditional specialist triggers are evaluated
✓ no unresolved high-impact ambiguity blocks coding
```

This is deliberately lighter than the harness's production gate.

---

## 18. Definition of Done — Framework Experiment

The root may call a work item complete when:

```text
✓ required lifecycle adapters completed
✓ acceptance criteria are satisfied
✓ relevant tests/checks were actually run
✓ code-review completed
✓ triggered specialist reviews completed
✓ verification-before-completion produced fresh evidence
✓ unresolved findings are either fixed or explicitly handed off
✓ final artifacts describe what changed and any follow-up
```

Do not require production deployment or post-deploy SLO monitoring to declare the **framework experiment** successful unless the user explicitly included deployment in the test.

---

## 19. Testing Strategy

The purpose of framework validation is to discover whether the skill graph behaves correctly before implementing it in a harness.

### 19.1 Isolation tests

Test each framework/upstream capability independently.

Examples:

```text
research
  → does it produce sourced findings?

grilling
  → does it identify important ambiguity rather than invent answers?

domain-modeling
  → does it sharpen concepts and invariants?

tdd
  → does it follow red → green → refactor?

code-review
  → does it review against actual spec/standards?
```

### 19.2 Composition tests

Test pair and short-chain composition.

```text
research → grilling

grilling → domain-modeling

spec → codebase-design

tdd → code-review

code-review → differential-review [security trigger]
```

Questions to record:

- Was the second skill actually necessary?
- Did the first skill pass useful artifacts rather than a bloated transcript?
- Did responsibility overlap?
- Did one skill undo the other's work?

### 19.3 Recursive workflow tests

Test bounded recursion:

```text
itp-implement
   ↓
tdd
   ↓ failure unclear
 diagnosing-bugs
   ↓ diagnosis
 tdd
   ↓ pass
 itp-review
```

Success means the loop terminates with new evidence, not merely that recursion was possible.

### 19.4 Failure tests

Intentionally exercise:

- missing skill;
- ambiguous product requirement;
- repeated test failure;
- review failure;
- security finding;
- merge conflict;
- UI task without browser test capability;
- user-only workflow requested recursively.

Expected behavior is a useful fallback or `needs-human`, not improvisation.

### 19.5 Routing tests

Give the root varied tasks and verify skill selection.

Examples:

```text
"Research whether this API supports webhooks"
  → research, not full implementation

"Fix this failing authorization test"
  → diagnosing-bugs / tdd, not PRD generation

"Build collaborator invitations from this approved spec"
  → slice → implement → review → verify

"Review my PostgreSQL migration"
  → review + postgresql-code-review
```

### 19.6 Golden end-to-end tests

Maintain a small set of representative projects/tasks with expected lifecycle traces.

Example expectation:

```yaml
case: add-collaborator-invitations
expected_required:
  - itp-align
  - itp-spec
  - itp-architecture
  - itp-slice
  - itp-implement
  - tdd
  - itp-review
  - code-review
  - itp-verify
  - verification-before-completion
expected_conditional:
  - differential-review
forbidden:
  - runtime-skill-installation
  - recursive-to-spec
```

Because model behavior is not fully deterministic, treat golden tests as regression signals, not proofs — rerun periodically and expect some variance across model versions.

---

## 20. Framework Evaluation Metrics

Track results manually or in simple fixtures before building the harness.

Recommended metrics:

| Metric | Desired direction |
|---|---|
| Correct skill selection | up |
| Unnecessary skill loads | down |
| Duplicate/overlapping workflow steps | down |
| Recursion loops | zero |
| Human handoffs that were actually necessary | high precision |
| Missing necessary human handoffs | zero |
| Artifact completeness | up |
| Context passed between skills | smaller but sufficient |
| Test/review evidence quality | up |
| Successful end-to-end completion | up |

The goal is not maximum autonomy. The goal is **predictable useful composition**.

---

## 21. Suggested Framework `AGENTS.md`

`AGENTS.md` should contain only stable project-level rules that apply to every run, for example:

```text
# Idea-to-Production Framework Rules

- The lifecycle root is `idea-to-production`.
- Use framework adapters rather than reproducing their procedures manually.
- Use only pre-installed skills listed in dependency.md / skills.lock.json.
- Do not install or upgrade skills during a run.
- Prefer Matt Pocock skills for primary engineering process.
- Add specialist skills only when their documented trigger applies.
- Never recursively invoke skills classified as human/user entry points.
- If the same failure recurs without new evidence, stop and ask the user.
- Do not claim completion until `itp-verify` runs with fresh evidence.
```

Do not duplicate every individual skill's instructions in `AGENTS.md`.

---

## 22. Minimal Root Workflow

Reference behavior for the first `idea-to-production/SKILL.md`:

```text
1. Inspect user goal and available artifacts.

2. Determine earliest incomplete lifecycle phase.

3. Load only that framework adapter.

4. Let the adapter load its required/conditional upstream skills.

5. Require the adapter to return:
   - status
   - artifacts produced/updated
   - unresolved findings
   - recommended next phase

6. Validate that the recommendation is consistent with dependency.md.

7. Continue to the next adapter or stop for the human.

8. Before claiming completion, load itp-verify.
```

### 22.1 Important root behavior

The root should NOT blindly execute every phase.

Examples:

```text
Existing approved spec + architecture
    ↓
skip research/spec if not stale
    ↓
itp-slice

Bug with clear reproduction
    ↓
itp-implement
    ↓
diagnosing-bugs
    ↓
tdd

Review-only request
    ↓
itp-review
```

The framework is a lifecycle **router**, not a fixed waterfall.

---

## 23. Minimal Adapter Example

Example `itp-review/SKILL.md`:

```markdown
---
name: itp-review
description: Review an implementation against its specification and load conditional specialist reviewers when the change requires them.
compatibility: agent-skills
metadata:
  framework: idea-to-production
  role: adapter
  phase: review
  invocation-class: model
---

# ITP Review

## Inputs

Read the current diff, linked specification/acceptance criteria, and relevant project rules.

## Required child skill

Load `code-review` and perform its Standards + Spec review.

## Conditional children

- Load `differential-review` for medium/high-risk or security-sensitive diffs.
- Load `postgresql-code-review` when PostgreSQL behavior/schema is changed.
- Load the pinned web-design-guidelines adapter when UI is changed.
- Load `agentic-eval` when agent behavior is changed.
- Load `agent-owasp-compliance` when agent/tool/prompt trust boundaries are changed.

## Output

Return:

- verdict: approve | changes-requested | needs-human
- spec/acceptance coverage
- findings grouped by source skill
- unresolved blocking findings
- recommended next phase
```

The adapter coordinates. It does not reimplement each reviewer.

---

## 24. Framework Build Order

Build the skill framework in this order. (Building the harness itself is a separate, later effort — see `CUSTOM-HARNESS.md`.)

### Phase 1 — Skeleton

Create:

```text
skill-framework.md
dependency.md
skills.lock.json
AGENTS.md
.agents/skills/idea-to-production/SKILL.md
```

### Phase 2 — Minimal viable lifecycle

Implement only:

```text
idea-to-production
itp-research
itp-align
itp-spec
itp-implement
itp-review
itp-verify
```

Use this initial upstream set:

```text
research
grilling
domain-modeling
codebase-design
tdd
diagnosing-bugs
code-review
verification-before-completion
```

### Phase 3 — Prove composition

Run isolation, pair-composition, recursion, failure, and golden end-to-end tests.

Do not add more dependencies until the minimal graph is understandable.

### Phase 4 — Add architecture and slicing adapters

Add:

```text
itp-architecture
itp-slice
prototype
poka-yoke
```

### Phase 5 — Add specialists

Add specialist skills only after triggers are tested:

```text
differential-review
agentic-actions-auditor
react-best-practices
frontend-design
webapp-testing
playwright-generate-test
postgresql-code-review
web-design-guidelines
agentic-eval
agent-owasp-compliance
```

### Phase 6 — Stabilize contracts

Freeze:

- adapter IDs;
- artifact paths;
- output conventions;
- dependency triggers;
- recursion conventions;
- human-handoff schema;
- golden tests.

Once contracts are frozen here, they become the input to the harness's own build order — see `CUSTOM-HARNESS.md` §6. Do not start that build order before this phase is genuinely stable; the harness encodes these contracts in software, and software is far more expensive to re-cut than markdown.

---

## 25. Readiness Gate — Exit Criteria Before Building the Harness

Do not move to the custom harness merely because the skills can run.

The framework is ready when:

```text
✓ root routes common task types correctly
✓ each adapter works in isolation
✓ required child skills are consistently selected
✓ conditional specialist triggers are understandable
✓ user-entry skills are not recursively invoked
✓ missing dependencies produce clear handoffs
✓ debugging/TDD loops terminate
✓ review failures route back to implementation cleanly
✓ verification prevents unsupported completion claims
✓ end-to-end golden tasks are repeatable
✓ artifacts are sufficient to resume work in a fresh session
✓ dependency graph has no unexplained cycles
✓ skill IDs and contracts are stable enough to encode in software
```

At that point, `CUSTOM-HARNESS.md` becomes an enforcement and scaling layer instead of an experiment in workflow design.

---

## 26. Upstream Sources

Framework sources should be pinned in `skills.lock.json`. Human-readable upstream locations:

- Matt Pocock skills: <https://github.com/mattpocock/skills>
- Matt invocation rules: <https://github.com/mattpocock/skills/blob/main/.agents/invocation.md>
- OpenCode skills documentation: <https://opencode.ai/docs/skills>
- Vercel agent skills: <https://github.com/vercel-labs/agent-skills>
- Vercel skill discovery: <https://github.com/vercel-labs/skills>
- Vercel Web Interface Guidelines: <https://github.com/vercel-labs/web-interface-guidelines>
- Anthropic skills: <https://github.com/anthropics/skills>
- Trail of Bits skills: <https://github.com/trailofbits/skills>
- GitHub Awesome Copilot: <https://github.com/github/awesome-copilot>
- Obra Superpowers: <https://github.com/obra/superpowers>

---

## 27. Relationship to the Custom Harness

This document defines *what* the system does and *how skills compose*. It deliberately does not define *how any of it gets mechanically enforced* — that's the harness's job, and premature enforcement code would just have to be rewritten as the framework above changes.

```text
This document (Skill Framework)     CUSTOM-HARNESS.md
────────────────────────────        ──────────────────
what skill to use            →      resolve exact installed skill
when to stop                 →      enforce state/approval rule
bounded recursion rule        →      depth/cycle breaker
pinned dependency intent      →      hash/lockfile verification
artifact handoff               →      persistent state/evidence store
human handoff                  →      approval workflow
verification requirement       →      hard completion gate
```

The framework succeeds when the skills compose predictably **without requiring the runtime itself to contain the methodology**. Only once §25's readiness gate is met should work begin on the harness that enforces this exact framework in code.
