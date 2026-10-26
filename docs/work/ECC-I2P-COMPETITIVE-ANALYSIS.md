# ECC vs Idea-to-Production: competitive assessment and strategy

**Audience:** I2P maintainer. **Research date:** 2026-10-26 UTC.
**Decision:** how to make I2P a credible competitor without changing its core idea.
**Status:** analysis and recommendations, not an approved implementation program.

## Executive recommendation

Do not compete by copying ECC's catalog or describing it as merely a prompt collection.
Compete on the quality of a complete engineering handoff: a requirement becomes an
inspected change, with bounded human decisions, a resumable record and fresh evidence.

I2P's thin adapters, curated upstream skills, pinned dependencies and explicit lifecycle
are worth preserving. Its central weakness is not a lack of principles; it is the gap
between those principles, reliably delivered user experience, and publicly inspectable
outcomes. A larger specification or a more elaborate banner will not close that gap.

The defensible objective is **better at a defined workflow for a defined user**, not
“better than ECC” across every supported language, tool, integration and use case.

This report separates source observations, product judgments and proposed experiments.
It does not establish comparative task success, token savings, security superiority or
retention. Those require execution and users, not repository inspection.

## 1. Scope, baselines and evidence discipline

I2P public baseline: `7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc` on `master`.
ECC public baseline: `25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b` on `main`,
package version `ecc-universal` 2.2.3. The requested ECC URL resolved directly; no
redirect was observed.
Local checkout: `bd0cacc`, with an uncommitted `TODO.md` preserved. The inspected local
skills, scripts, installer, dependency files and tests match the public baseline;
intervening public commits update presentation/Actions pins. Fresh local checks:
**89 script tests pass; 63 contract checks pass**. These are not 89 native agent trials.
Public master CI at this baseline also passed. [I1–I3]

ECC's independently researched immutable baseline and source details are recorded in
the companion [ECC primary-source research](ECC-COMPETITIVE-RESEARCH.md). Comparative
claims below must be read with that source note and its execution limits.

I2P metadata observed during this session: one star, zero forks, zero watchers; latest
release v4.0.0. ECC's research snapshot recorded 289,080 stars, 42,847 forks and 1,414
subscribers (the later parent recheck already showed 289,082 stars). This is an enormous
distribution/attention difference, not evidence of an equivalent difference in quality.
These are awareness signals, not installation counts or user outcomes.
No ECC installation, execution, head-to-head benchmark, user interview or conversion
study was performed for this report. Repository counts are time-specific snapshots.

Evidence levels used here:

1. **Implemented:** executable code/configuration exists and was inspected.
2. **Tested implementation:** relevant tests/run evidence exist, with their scope named.
3. **Behavioral evidence:** a real agent/model executed the workflow; environment and
   trace distinguish native behavior from an analyst following the instructions.
4. **Outcome evidence:** independent tasks/users show correctness, cost or retention.
5. **Claim/plan:** documentation describes intent; not treated as implemented proof.

## 2. Are these the same idea?

At the broadest level, yes: both improve coding-agent work through reusable expertise,
orchestration and engineering conventions. Users will reasonably compare them. Calling
one “a framework” and the other “a toolkit” does not create meaningful differentiation.

I2P's particular design is an opinionated engineering route:

```text
intent → research/alignment → specification → architecture/slices
       → implementation → review → verification → complete or handoff
```

It chooses a primary process methodology, delegates to approved specialists, and passes
repository artifacts between phases. The root can skip already-satisfied phases. It is
not intended to install new skills during a run or become an autonomous deployment
platform. Those are real scope decisions, not missing features by definition. [I4–I6]

However, I2P must compete against what ECC actually implements, including its workflows,
not a convenient “ECC is only many independent skills” caricature. A lifecycle diagram,
TDD, review, verification, memory and orchestration are not automatically exclusive
features. The opportunity is a more coherent, demonstrably effective default experience.

### 2.1 Where ECC is currently better

**My judgment: ECC is the stronger overall product/distribution proposition today,
particularly for Claude Code users.** That judgment is about observed breadth,
integration maturity, operations and reach—not a measured win on coding correctness.

| Dimension | Observed ECC advantage | I2P consequence | Confidence |
|---|---|---|---|
| Distribution and awareness | Large public attention footprint, plugin/package channels, guides/translations/community and a hosted offering | A better design alone will not cause users to discover or trust I2P | High for presence/reach; no active-user inference |
| Onboarding lifecycle | Guided setup, selective profiles, doctor, repair and uninstall; containment/drift protections exist in installer code | I2P's working installer is necessary but not equivalent to a complete installation lifecycle | High for inspected surfaces; not all paths executed |
| Runtime reach | Claude Code integration documented by ECC as stable/primary, native Codex distribution, beta/experimental adapters with stated limits | I2P's portability checklist does not substitute for installed native support | High for packaging/source; stability/parity not independently established |
| Event-driven operations | Real Claude hook registration and executable session/context/governance/check scripts | ECC can react automatically to some events where I2P asks the model to remember instructions | High for mechanism; efficacy host/predicate dependent |
| Everyday utility | 71 agent definitions, 311 skill definitions and 97 commands, with selective profiles | More users can find a relevant entry point without adopting I2P's entire preferred route | High inventory confidence; quality not established by count |
| Cross-platform release engineering | CI matrix and exact packed-installer lifecycle tests across Linux/macOS/Windows | I2P's primarily Ubuntu-oriented CI leaves a narrower tested distribution story | High for inspected CI config; coverage not universal |
| Operational feedback | Persistence, cost/session hooks and optional learning implementations | ECC offers mechanisms for ongoing workflow assistance, not just initial procedure selection | High presence confidence; improvement not independently measured |

Sources: ECC research findings 1–4, 6–7, 9 and 11–12, with pinned references [E1–E6].

#### A. It offers more value before a user buys into the whole methodology

The task-specific commands, language specialists and selectable profiles create many
small reasons to install ECC. A user can start with planning, review or a familiar
stack-specific task. This is a distribution advantage even if an individual prompt is
easy to reproduce. I2P has direct adapter entry points too, but they are less developed
as tested recipes and native-host first-use paths. [E1, E2]

**Lesson:** publish and validate three existing I2P entry recipes—feature, incident,
review—before adding more methods. The root remains the primary full-lifecycle entry.

#### B. It has executable operational behavior, not only stronger instructions

ECC's Claude hooks run at concrete lifecycle/tool events. GateGuard, hook dispatch,
session persistence and other scripts are actual software. I2P has real installer,
checker and maintenance software, but its engineering-run coordination remains
predominantly model-followed contracts. Those are different operational properties.
Do not pretend one is the same as the other. [E3, I4, I10]

**Lesson:** identify a few recurring failures and fix the responsible deterministic seam.
For example, reject malformed/stale evidence at a completion-check boundary, or use
a host-supported event for a specific permission check. Keep those mechanisms optional
where the host requires it, explicit about failure mode, and separate from a new harness.

#### C. It treats setup, compatibility and removal as part of the product

ECC documents installation modes, collisions, trust, profiles and removal. Its source
includes drift-aware uninstall safeguards. I2P protects install/refresh ownership well,
but lacks comparable doctor/uninstall surfaces in the audited installer. Scope selection
is not the same as workflow/profile/capability qualification. [E2, I8, I11]

**Lesson:** installation diagnosis and safe cleanup deserve priority over new specialist
coverage. A user who cannot understand what the installer changed will not recommend it.
Do not assume ECC's uninstall is perfect: inspected protections apply to particular
operations/options, not a guarantee across every adapter.

#### D. Its software-testing investment is more mature in breadth

ECC has a substantial test-runner/validator surface and cross-platform package-lifecycle
CI, beyond static prompt checks. The inventory found 443 JavaScript test files and 26
Python test files; this report did not execute them and does not compare those file
counts to I2P's 89 passing individual tests. They are different units. [E4]

**Lesson:** I2P needs the specific packaging, host and native behavioral coverage users
depend on—not hundreds of assertions merely to match ECC's count. A correct small test
at the actual installation/resume boundary is more valuable than many prose snapshots.

#### E. It has substantially greater visibility and distribution surfaces

ECC's reach gives it a much larger pool of possible advocates, feedback and integrations.
Community/guide/commercial surfaces demonstrate product packaging, although they do not
establish paid adoption, revenue, maintainer responsiveness or user retention. [E5]

**Lesson:** I2P needs a specific switching reason. “Also has planning/TDD/review” is
category membership, not differentiation. Repeatedly usable outcomes in a narrow workflow
are a credible starting point; buying broad awareness before that is expensive noise.

### 2.2 Where ECC's claims need qualification

Being critical of ECC is necessary for a fair decision, not a reason to manufacture
defects that make I2P look good.

1. **It already has an I2P-like orchestration pipeline.** The `orch-*` family uses thin
   wrappers, size classification, research/planning/TDD/review, handoff documents and
   human gates. These gates are written in a skill, not implemented there as a transactional
   state machine. I2P's process is more explicit in particular artifact/invocation details,
   but “we have a lifecycle and they do not” would be false. [E6]
2. **Its host support is uneven by its own documentation.** Claude is primary; other
   hosts have narrower support. The default OpenCode profile intentionally excludes the
   hook runtime, and inspected OpenCode hooks do not reproduce Claude GateGuard behavior.
   “ECC is more integrated” must name the host/profile. [E1, E7]
3. **Some security behaviors trade convenience for risk.** The OpenCode adapter has
   prefix-based formatter/test auto-approval source. If honored by that host version,
   that policy does not validate the entire compound command or make project test
   scripts safe. This is a source-level concern, not a demonstrated exploit. Do not
   market I2P as more secure without equivalent threat-model and execution tests. [E7]
4. **Learning is neither uniformly automatic nor proved beneficial.** The legacy
   evaluator logs an instruction to evaluate/extract patterns; that alone proves neither
   extraction nor model receipt/compliance. V2 actually spawns a bounded observer,
   but its checked-in observer is disabled. Enabling it adds cost and persistent-trust
   questions. Instinct confidence is not calibrated outcome evidence. [E8]
5. **Security scanning is not entirely bundled assurance.** AgentShield is separate;
   README provenance warnings and the skill's unpinned execution examples disagree.
   Advertised AgentShield test/coverage counts are not ECC's own coverage or verified
   security efficacy. No AgentShield audit was performed here. [E9]
6. **Eval tooling is not a demonstrated self-improvement engine.** One candidate
   execution gate is explicitly disabled because verified containment is unavailable.
   ECC2 remains an alpha scaffold; its score-based comparisons acknowledge operator
   assertions and lack of statistical significance. [E10]
7. **Broad capability increases maintenance/trust surface.** Install channels, host
   adapters, generated builds, optional runtimes, persistence, MCP and security tools
   add failure modes. Selective profiles mitigate that, so “311 skills always overload
   every install” would also be false. [E1, E2, E8]

The reasonable conclusion is **mature toolkit with real mechanisms and explicit gaps**,
not “fully autonomous engineering OS” or “only Markdown.”

### 2.3 Where I2P could win—and what remains a hypothesis

| Candidate advantage | Existing basis | Evidence needed before claiming a win |
|---|---|---|
| Clearer current-run handoff | Typed-in-prose phase/result/artifact contracts and ledger | Native interruption/resume tasks, stale-evidence cases and user comprehension |
| Easier methodology choice | One opinionated primary process, triggered specialists | First-run completion and fewer avoidable configuration/decision steps |
| Reviewed upstream composition | Exact external skill pins, invocation classes and approval boundaries | Installed/discovered byte checks and conformance across updates/hosts |
| Less invasive optional surface | No learning daemon/hooks required by the core workflow | Measured footprint/permissions/cost against a suitable selective ECC profile |
| Better requirement-to-evidence traceability | Acceptance IDs, slice pass bars, explicit review/verify outputs | Independent audit of task requirements versus actual diff/checks |

These are credible competitive hypotheses. None is presently a controlled outcome
finding. ECC's own profiles, orchestration and provenance practices weaken simplistic
claims of unique minimalism, lifecycle structure or reproducibility.

## 3. I2P's strengths worth preserving

### 3.1 A coherent default, not a menu of every possible method

The framework specifies required vs conditional children, input/output contracts,
invocation classes, retry bounds and human handoffs. Users should not have to assemble
their own engineering process from many overlapping instructions. [I4–I6]

**Potential value:** fewer process choices and clearer ownership of each phase.
**Not yet proved:** lower task failure or lower cost than ECC's recommended workflow.

### 3.2 Reviewable dependency composition

There are 12 local skill definitions: root, nine phase/incident adapters and two pinned
local skills. The lock contains 26 pinned entries, including two vendored entries,
across eight upstream repositories. Exact revisions/content hashes and invocation
classes are explicit. Dependencies are selected before the run. [I5, I7]

**Potential value:** explain which procedure a team approved and reproduce its installed
bytes. This is stronger than telling users to fetch whatever a skill happens to be today.
It does not pin the model, host behavior, tool permissions or live web results, and
therefore does not make agent outputs reproducible by itself.

### 3.3 Durable, user-readable artifacts

The run ledger and artifact contracts preserve decisions, acceptance criteria, review
results and a resume point. Phase/slice checkpoints express real opportunities for the
user to steer. This is a useful product direction for work that spans sessions. [I6]

**Potential value:** resume with the actual project state instead of repeatedly explaining
the conversation. **Limitation:** the ledger explicitly is not a transactional state
database; its correctness and freshness depend on the agent and workspace discipline.

### 3.4 A real distribution foundation

The release builder bundles approved upstream bytes, checks their hashes, and produces
a versioned archive/checksums. The bootstrap rejects checksum failures and unsafe archive
entries; the installer guards ownership/conflicts and supports project-local scope. [I8]

The project has moved beyond “clone this folder of prompts.” That is a meaningful
foundation. It is not a signed supply chain, runtime isolation or a whole-install
transaction, and should not be sold as one.

### 3.5 Willingness to record limitations

The validation overview distinguishes automated checks, native runs and runtime
enforcement. Native follow-up notes record actual deviations rather than declaring
blanket conformance. Preserve that honesty; make the evidence easier to inspect. [I3, I9]

## 4. The uncomfortable I2P weaknesses

These matter even if ECC did not exist.

### 4.1 “Repeatable” is a promise the product has not quantified

The README sells a repeatable engineering workflow. Existing tests and dated campaigns
are useful, but there is no public matched-task success distribution against an untreated
agent or ECC. A successful demonstration cannot establish repeatability. [I1–I3, I9]

**Business consequence:** a visitor can admire the design without knowing whether it
will improve their next task. **Fix:** repeated native-task evaluation, including failures,
and evidence that a fresh user can reproduce the result.

### 4.2 The safety-critical guarantees mostly live in prose

The root instructs the agent to honor invocation classes, phase boundaries and retry
bounds. The artifact reference asks for structured results, but there is no implemented
state-transition service enforcing those contracts. The separate harness document is
a stub. Content-assertion tests explicitly verify sentence presence, not behavior. [I4,
I6, I10]

**Consequence:** a compliant trace is evidence that the model followed instructions once,
not proof that it cannot skip a gate. **Fix:** validate narrow, deterministic seams and
publish measured compliance; do not build an entire production harness to fix a messaging
problem or claim that a completion-record checker proves arbitrary commands really ran.

### 4.3 Portability is an architectural intention, not shipped broad support

The canonical skill layout is portable in concept, but the installer writes an OpenCode
specialist-agent configuration and the checker assumes the current local skill path.
OpenCode-specific invocation metadata does not define another host's behavior. The TODO
correctly treats Codex/Claude validation as unfinished work. [I3, I4, I11]

**Consequence:** a developer with another daily agent may leave before testing the core
idea. **Fix:** native validation and thin host profiles, not duplicated lifecycle trees.
Do not list a host as supported merely because its parser accepts `SKILL.md`.

### 4.4 Small tasks still have a potentially expensive process footprint

The `small` profile names five artifacts and targets four adapter loads; review itself
requires the upstream process. All fresh greenfield work is at least `standard`. These
can be appropriate defaults, but “small” should not be assumed cheap without measurement.
Installed capability metadata also consumes host context before selective loading. [I6]

**Consequence:** users doing a ten-minute change may perceive more administration than
benefit. **Fix:** measure setup, required decisions, artifact burden and end-to-end cost.
Reuse approved issue/spec material and existing project docs rather than generating
documents for their own sake. If evidence justifies consolidating small-task artifacts,
change the contract explicitly with migration/tests; do not silently skip review/verify.

### 4.5 The composition can disagree with its own dependencies

Concrete example: I2P's architecture adapter triggers `security-threat-model` when work
touches auth, PII or trust boundaries. The exact pinned upstream skill says to trigger
**only when the user explicitly asks for threat modeling**. These policies are not the
same. A green registry check does not resolve the conflict. [I12]

This is not evidence of an exploit or proof the model always chooses incorrectly. It
is a maintenance/behavioral ambiguity in the product's core composition contract.
Resolve it by preserving explicit consent or approving a transparent, separately
tracked adaptation; then test the positive and negative paths with real host execution.

### 4.6 Installed integrity and discovered execution are different claims

The installer verifies skill source/staging content. The contract checker checks local
presence/name for nonvendored installed-local skills and registry/lock consistency for
global ones; it does not rehash all nonvendored installed content or establish which
duplicate a host actually loaded. [I7, I8, I11]

**Consequence:** “pinned skills” can be misunderstood as an attested runtime guarantee.
**Fix:** an explicit installed-environment check that verifies the chosen paths and
content, plus host-native discovery/loading evidence. Report ambiguity, do not guess.
Even that is not continuous integrity enforcement against concurrent modification.

### 4.7 Run identity and evidence durability are weaker than the resume story

The example ledger does not bind a run to a schema version, workspace identity or
verified source revision. Generic review/verification filenames can contain historical
sections from multiple tasks. Several native raw logs are referenced under temporary
directories rather than committed public evidence bundles. [I6, I9]

**Consequence:** a new session can mistake the right-looking artifact for the current
artifact; an outside evaluator may be unable to independently inspect the original trace.
**Fix:** start with run/revision linkage, explicit active evidence pointers and durable
redacted trace bundles. Support existing ledgers; add a migration when changing shape.
Checks should distinguish stale, missing and valid-for-this-run, rather than just present.

### 4.8 Validation records need a higher standard than favorable summaries

The threat-model adoption note labels a positive execution “Native trigger,” while its
negative case is explicitly not a separately executed session. Prior task history also
clarifies that the purported native positive involved manual file reading/artifact
authoring rather than fresh native dispatch. That positive label must not be reused as
independent runtime proof. [I13]

Similarly, historical readiness closure is baseline-scoped; subsequent pin/host/model
changes are not automatically covered. Establish a small evidence taxonomy and correct
overstated records transparently. Preserve the original history and append the correction,
not an edited story that makes a failed or emulated run appear native.

### 4.9 More prose is not a durable moat

The nine ECC-sourced improvements already marked implemented in `UPGRADES.md` show that
useful instructions and schemas travel between projects. That is healthy open-source
learning, but it means “stricter reviewer wording” is easy for competitors to reproduce.
Some backlog language such as “closes the prompt-injection hole” also overstates what
instructional delimiters can establish. [I10]

The harder-to-copy assets are maintained behavioral regressions, a good host onboarding
experience, a trusted release process and a body of independent task/user results.

### 4.10 Maintenance activity is not necessarily user progress

Skill Watch, preview tooling and release safety are useful. They also compete for a
single maintainer's time with native runtime support, a real demo, fewer setup failures
and second-use adoption. Do not let discovery volume become the product roadmap.

The previous rejection of per-runtime packaging in `UPGRADES.md` should be clarified:
reject **forked copies of every contract**, not every small native host integration.
Otherwise an old simplification rule blocks the distribution work users actually need.

## 5. What must not change

Preserve these as the product's stable core:

- One artifact-driven engineering lifecycle with shortcuts and explicit handoffs.
- Thin adapters; primary methods and specialists remain upstream-owned.
- Approved, pinned dependencies selected before a run.
- Review and fresh verification at every scale.
- Human authority over material decisions, destructive actions and deployment.
- Runtime portability as a goal supported by tested host-specific bindings.

Improving discovery, diagnosis, evidence linkage, host invocation controls and onboarding
does not abandon that core. Copying hundreds of overlapping methods or making every
task an autonomous multi-agent production deployment would.

## 6. Product direction: the reliable engineering handoff

**Primary customer:** a developer or small team doing real feature work in an existing
repository, across multiple sessions, who values acceptance fidelity and an inspectable
handoff more than a huge catalog of commands.

**Job to be done:** “Take this agreed intent to a change I can review and resume, without
having to recreate the process or trust a context-free 'done' message.”

Treat this as a target customer hypothesis. Validate it with users before investing in
team administration, enterprise policy products, dashboards or pricing infrastructure.

### The minimum compelling experience

1. Install into a project without breaking the developer's existing agent setup.
2. Inspect the environment and name unsupported/missing prerequisites before work starts.
3. Accept a bounded goal or reuse an existing issue/spec, and show the selected route.
4. Work through the selected phases with reviewable human decisions.
5. Pause, close the session, and resume from a clearly current project record.
6. Deliver a concise handoff: requirements covered, diff, checks actually run, findings,
   decisions still open and exact next action.

No dashboard is necessary to prove this experience. Use existing artifacts and the
host's tools first; add deterministic helpers only where an observed failure needs one.

### Focused improvements, not feature parity

| Improvement | Why users care | Smallest acceptable proof |
|---|---|---|
| Installed-environment/host preflight | Finds discovery, hash, duplicate and tool problems before a run | Intentional bad paths/pins/tool absence produce actionable failures |
| Validated Codex and Claude bindings | Works in users' daily tools | Native end-to-end and interrupted/resume cases per tested host |
| Run-scoped evidence linkage | Avoids stale review/verification being treated as current | Deliberately stale artifacts cannot satisfy the completion-record checks |
| Simple status/resume presentation | Reduces conversation reconstruction | A new session identifies the active run and right next step without hidden history |
| Small-task artifact economy | Reduces ceremony without losing review/verification | Matched tasks show lower unnecessary loads/interventions with equal correctness |
| Reproducible demo/evidence bundle | Lets another developer verify the claim | Clean start, exact prompt/config, actual trace, resulting diff and checks |

These are proposed public behaviors, not authorization to implement a new CLI or a
general plugin framework. Prefer the existing installer/checker/ledger ownership points.

## 7. How to prove superiority rather than announce it

### Stage A: validate the evaluation itself

Before comparisons, make task acceptance independent of the agent's own tests and
summary. Use seeded repositories, hidden acceptance checks and a published human
decision rubric. Include failures of the evaluator in the report if discovered.

Choose five task shapes:

1. A bounded existing-project feature with unclear edge cases.
2. A bug with an incomplete initial reproduction.
3. A change interrupted after specification, resumed in a fresh session.
4. A cross-module change with a seeded regression and review obligation.
5. A task with stale evidence or a missing specialist that should stop or hand off.

Include at least one task where a light, direct agent should win on speed. A test set
where every task rewards I2P's architecture is advertising, not useful evaluation.

### Stage B: matched three-arm experiment

Compare **bare host**, **ECC's documented recommended workflow**, and **I2P**. For each:

- Same starting repository, model/version, host version, tool access, credentials policy,
  task text, time/cost cap and pre-scripted human answers.
- Use a host both products genuinely support for that workflow. Keep a separate matrix
  for host-specific capabilities; do not disable ECC hooks and call that its normal product.
- Pin both repository revisions/configurations. Remove unrelated skills/hooks and check
  actual discovery so products do not contaminate each other's runs.
- Let each product use its intended workflow, not the same unnatural instruction sequence.
  Publish setup/config changes and skill-selection rules before observing results.
- Start every trial fresh. Randomize order; blind final artifact assessment where practical.
- Use three repetitions per task initially: **5 tasks × 3 arms × 3 repetitions = 45 runs**
  on one host. That is an exploratory study, not strong general statistical proof.
- Report all runs, capped/incomplete runs, interventions and unavailability. A correct
  required handoff on a deliberately blocked task is not an implementation failure.

Then increase repetitions/tasks and add a second host when the pilot shows that the
evaluation is meaningful and the measured differences justify the expense.

### What to measure

| Metric | Definition / interpretation |
|---|---|
| Correct completion | Independent acceptance checks pass, requirements satisfied, no seeded blocker left |
| False completion | Agent declares successful completion despite failed independent criteria or required missing evidence |
| Resume correctness | Fresh session chooses correct state/next action and does not reuse stale approval |
| Human burden | Count and classify clarifying decisions, necessary permissions and avoidable rescue interventions |
| Review precision/recall | Seeded real defects found vs supported findings; adjudicate uncertain findings separately |
| Cost/time | Total spend and elapsed/active human time; separate successes, caps and failures |
| Workflow overhead | Unnecessary artifacts/loads and maintenance effort, not merely total document count |
| Adoption | External users complete a first task and voluntarily choose the product for a second |

Use correctness and false-completion rate as primary outcomes. Do not compress safety,
quality and token cost into a self-serving weighted score. Distinguish host permission
blocks from workflow failures and mechanical safety mechanisms from model compliance.

Proposed release bar, subject to pilot calibration: all installed-environment failure
fixtures produce correct diagnosis; mandatory stop/consent cases have no observed
unauthorized completion; current host smoke cases all pass; repeatability failures and
cost regressions have dispositions. “Zero observed” is not a zero-risk guarantee.

Only after results exist publish a bounded comparison such as:

> On the published interrupted-feature task set, I2P resumed correctly in X/Y runs
> versus A/B for the compared ECC configuration, using the named host/model/revisions.

Never populate those variables with projections. Link raw artifacts and rerun instructions.

## 8. Execution roadmap without changing the core

Suggested sequence for one maintainer; dates are timeboxes, not delivery promises.

### First 2 weeks: remove credibility and activation blockers

- Reconcile trigger-policy conflicts and inaccurate native-evidence labels.
- Capture current onboarding attempts, environment prerequisites and discovery failures.
- Validate Codex on the existing layout before implementing new compatibility code.
- Preserve one durable, redacted native example from clean install to inspected result.
- Specify one environment-preflight seam and one stale-evidence/resume regression.

**Exit:** a new user can reproduce a first task on the named primary host; required
capability gaps are diagnosed before surprise failure; evidence is publicly inspectable.

### Weeks 3–6: turn core strengths into dependable behavior

- Add the smallest required host integration and ownership-aware installer support.
- Validate a Claude Code path in addition to Codex/OpenCode as capacity allows.
- Add run/revision evidence linkage with backward compatibility for existing ledgers.
- Add a small native regression campaign for checkpoint feedback, missing prerequisites,
  resume and completion claims. Keep infrastructure tests separate from model trials.
- Pilot the five-task evaluation and fix the recurring causes, not prompt symptoms alone.

**Exit:** at least two explicitly versioned host combinations have inspectable native
evidence; stale/foreign evidence is surfaced; product claims match observed support.

### Weeks 7–12: comparative proof and distribution

- Execute the matched pilot, publish failures and identify the workflows I2P actually wins.
- Recruit five relevant external testers; observe at least three first attempts and seek
  voluntary second-task use. These are learning targets, not growth forecasts.
- Publish two real case studies and a short demo with evidence links.
- Launch narrow content around the demonstrated advantage; revise the message if users
  do not value the lifecycle/resume/evidence benefits enough to return.

**Exit:** a specific improvement over the baseline/competitor can be defended with data,
or the results clearly indicate what to change. Do not delay all visibility until week 12;
publish honest progress and ask for testing throughout.

### Deliberately not first

- A large custom runtime, worker-leasing service, cloud control plane or billing system.
- Catalog-size parity, many language-specific agents or duplicated per-host workflows.
- Automatic self-learning that silently alters approved pinned behavior.
- Autonomous deployment as a way to justify the product name.
- Paid acquisition before first-run and second-use evidence.
- Another cosmetic redesign as the principal response to the competition.

## 9. Positioning and go-to-market

### A defensible message

> **From an engineering intent to a reviewable, resumable change.**
> I2P coordinates pinned specialist skills through specifications, implementation,
> review and verification, keeping decisions and evidence with the repository.

Use “evidence-linked” or “verification-oriented” when discussing current completion
behavior. Reserve “enforced” for a specific implemented control with a documented scope.

### How to address ECC fairly

Publish a comparison page after the technical audit/benchmark, not an attack page.
Describe who should choose each product, the exact tested versions/configurations,
tradeoffs and a working example. Credit ECC-inspired improvements openly. Acknowledge
that a user happy with ECC should not switch merely to get fewer files or a new brand.

Avoid these pitches:

- “ECC is just prompts; I2P is a real engineering system.”
- “More secure because our prompts forbid unsafe actions.”
- “Portable everywhere because both use SKILL.md.”
- “Faster/cheaper because our adapters are short.”
- “Production-ready because the product name says production.”

### Acquisition should sell a problem solved

Lead with a reproducible interruption/resume or spec-to-verified-diff example, not the
number of skills. Put installation, host prerequisites, expected output and limitations
next to the example. Offer a safe isolated test project rather than asking users to
replace their existing global configuration.

Initial channels: the maintainer's existing network, OpenCode/Codex/Claude communities
where the tested binding works, technical walkthroughs, and relevant curated lists.
Show HN or a larger launch comes with a working example and availability to answer.
Measure first-run completion, setup failures, helpful artifacts and repeat use. Stars
and downloads remain secondary; they cannot establish technical superiority.

### Can ECC and I2P coexist?

Potentially, but treat coexistence as tested configuration, not an automatic promise.
Overlapping skill names, hooks, instruction precedence and different review policies can
change behavior. A later documented coexistence path can lower switching cost while
I2P owns the selected lifecycle. Do not wholesale import ECC or let agents discover
replacement procedures during a run; respect the registry, pins and license review.

### Who should choose which product today?

- **Choose ECC** when you want a broad Claude-native toolkit, task/language-specific
  entry points and configurable operational hooks, and accept the setup/trust/maintenance
  tradeoffs of the selected profile. It is the more defensible default recommendation
  for that customer on today's source evidence.
- **Try I2P** when you specifically want its opinionated artifact-driven lifecycle,
  are on the validated OpenCode path, and are willing to evaluate it on a bounded task.
  Be clear that comparative quality, cost and second-host support are not proved yet.
- **Use the bare agent** when the task is simple enough that framework setup/ceremony
  is not worthwhile, or organizational rules forbid installing either toolkit. The
  relevant competitor is often the user's existing setup, not ECC.

The benefit I2P must eventually sell to an ECC user is **less work to reach a trusted,
current handoff**, not merely “more structured instructions.” Until that outcome is
demonstrated, ask users to try a reproducible example rather than asserting they should
replace a productive existing setup.

### Maintainer economics and a stop/go decision

For a small project, broad feature parity is an unfavorable race: every new host,
integration or learning mode adds compatibility and support obligations. Spend scarce
maintenance time on an enduring regression suite and two well-supported host paths,
then expand based on observed use. Reusing upstream skills reduces prompt authorship;
it does not eliminate integration/conformance ownership.

After the first evaluation/user cycle:

- If I2P improves resume/requirement fidelity but costs more, position the quality/control
  tradeoff honestly; target the work where errors and context loss matter.
- If outcomes are equal but onboarding is simpler, sell the simpler experience and show
  the measured setup/human-time result—not an unsupported accuracy claim.
- If neither quality nor user effort improves, defer a large competitive launch. Diagnose
  the specific workflow failure and refine routing/experience before expanding scope.
- If external users repeatedly choose it for a second task, deepen that use case before
  broadening the catalog. A small number of genuine repeat users is more useful than a
  cosmetic jump in stars.

## 10. Decision memo

**Keep:** the core lifecycle, thin composition, pins, explicit handoffs and fresh review/
verification requirements.

**Change:** prioritize first-run reliability, native host support, current-run evidence,
durable behavioral regressions and independent outcome proof above catalog expansion.

**Market:** a clearly bounded outcome for developers doing reviewable, multi-session
engineering work. Earn a comparative claim one task family at a time.

**Stop doing:** treating completed internal checklists, more adapter prose or improved
branding as evidence of broad competitive superiority.

The strategic objective is not “ECC, but smaller.” It is **a better default path from
intent to an inspectable engineering handoff**, demonstrated with repeatable evidence.

## ECC primary-source entry points

The [companion research note](ECC-COMPETITIVE-RESEARCH.md) contains 12 findings and 34
immutable source references, plus the dated metadata/API observations. Key anchors:

- **E1:** [Support/capability matrix](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L1310-L1449), [selective profiles](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/manifests/install-profiles.json#L1-L112).
- **E2:** [Guided setup/trust/channels](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L164-L383), [uninstall protections](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/lib/install-lifecycle.js#L486-L515).
- **E3:** [Claude hook manifest](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/hooks/hooks.json#L1-L258), [GateGuard](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/hooks/gateguard-fact-force.js#L1-L115), [runner fail/no-op behavior](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/hooks/run-with-flags.js#L120-L238).
- **E4:** [CI platform matrix](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.github/workflows/ci.yml#L15-L164), [packed-installer lifecycle](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.github/workflows/ci.yml#L176-L242), [runner](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/tests/run-all.js#L1-L65).
- **E5:** [Positioning/catalog/distribution](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L20-L153); GitHub attention counts are dated metadata observations, not immutable usage statistics.
- **E6:** [Shared orchestration pipeline](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/orch-pipeline/SKILL.md#L8-L121).
- **E7:** [OpenCode reminder handler](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.opencode/plugins/ecc-hooks.ts#L425-L501), [approval handler](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.opencode/plugins/ecc-hooks.ts#L754-L802).
- **E8:** [Legacy evaluator](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/hooks/evaluate-session.js#L44-L100), [v2 defaults](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/continuous-learning-v2/config.json#L1-L8), [v2 observer](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/continuous-learning-v2/agents/observer-loop.sh#L350-L459).
- **E9:** [AgentShield README prerequisite](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L2036-L2068), [skill execution guidance](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/security-scan/SKILL.md#L20-L129).
- **E10:** [Disabled candidate execution boundary](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/lib/eval-harness/gate.js#L1-L44), [ECC2 alpha/evaluation scope](https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/ecc2/README.md#L1-L120).

## I2P primary sources

Links pin the audited public revision unless otherwise noted. The companion ECC note
contains its own immutable references. Proposed product work is not current functionality.

- **I1:** [README](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/README.md), particularly first-task disclaimer and support/limits.
- **I2:** [CI](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/.github/workflows/ci.yml), [public successful run](https://github.com/ishansing/skills-framework/actions/runs/38954163099); fresh local logs under `/tmp/opencode/i2p-competitive-{tests,contracts}.log` are session evidence, not durable public artifacts.
- **I3:** [Validation scope](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/docs/validation.md).
- **I4:** [Specification, especially §§2–3](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/SKILL-FRAMEWORK.md#3-reference--validation-runtimes), [root](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/.agents/skills/idea-to-production/SKILL.md).
- **I5:** [Registry](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/dependency.md), [lock](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/skills.lock.json).
- **I6:** [Lifecycle/routing](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/.agents/skills/idea-to-production/references/lifecycle.md), [artifacts/results/ledger](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/.agents/skills/idea-to-production/references/artifacts.md).
- **I7:** [Contract checker](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/tests/skills/check-contracts.mjs#L142-L181).
- **I8:** [Bundle builder](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/scripts/build-install-bundle.mjs), [bootstrap](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/bootstrap.sh), [installer](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/install.sh), [distribution security limits](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/docs/work/curl-install-security.md).
- **I9:** [Native v1.3 evidence and deviations](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/tests/skills/results/2026-10-08-matt-v1.3-native.md), [strict follow-up](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/tests/skills/results/2026-10-08-matt-v1.3-conformance.md).
- **I10:** [ECC-inspired upgrade history](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/agent-work/plans/UPGRADES.md), [harness stub](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/agent-work/plans/CUSTOM-HARNESS.md), [presence-not-behavior tests](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/tests/scripts/content-assertions.test.mjs#L7-L8).
- **I11:** [Installation paths/ownership metadata](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/scripts/install-config.mjs#L30-L87), [OpenCode specialist agent](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/.opencode/agents/adversarial-modeler.md).
- **I12:** [I2P architecture trigger](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/.agents/skills/itp-architecture/SKILL.md#L40-L47) vs [exact pinned upstream explicit-request trigger](https://github.com/openai/skills/blob/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/security-threat-model/SKILL.md#L1-L4).
- **I13:** [Threat-model adoption record](https://github.com/ishansing/skills-framework/blob/7d3aa9abe3cdbdb5f35ce25b4477315070eac0dc/tests/skills/results/2026-10-12-threat-model-adoption.md#L22-L35). The distinction between the record's claimed native positive and the actual manual procedure is additionally supported by the user's retained task/session history; this research did not independently recover a native trace proving that positive.

No code fixes, skill adoption, dependency changes, remote publication or edits to the
existing uncommitted `TODO.md` are authorized or performed by this analysis.
