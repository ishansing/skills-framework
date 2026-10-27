# Review — Skill Watch feature branch (pre-commit)

Fixed point: `6230ad0`. Range: working tree (`git add -N` intent-added, 16 files,
+1278/−2, no branch commits yet). Spec: `docs/work/ISSUE-SKILL-WATCH.md` (AC-1..AC-5)
and `SKILL-WATCH-PLAN.md`. Tracker: `docs/agents/issue-tracker.md` present (no issue
refs in messages; spec passed explicitly). Subagents: Standards
`ses_ee397b9c6ffe4QA8nbFEeyog09`, Spec `ses_ee397b8c8ffenq05Lua4p6aAUo`,
adversarial `ses_ee397b7bdffeC5aYr3nta3BawN` — all read-only, parallel.

## Standards

Hard: docs triplication — budgets/queries/rollout/four-sources repeated across
README.md, SKILL-WATCH-PLAN.md, docs/work/ISSUE-SKILL-WATCH.md vs writing-for-agents
single-source-of-truth. Fix by trimming README to pointer + essentials.
Judgement-only (5, minor): extractor `if(kind…)` chains; duplicated href/heading
lookup lines; string identity keys; `safe` name; workflow inline `node -p`.
`check-upstream.mjs` WeakMap fix is a root-cause fix, endorsed, not a smell.

Summary: 1 hard + 5 minor; worst is docs triplication.

## Spec

(a) Missing/partial (5): SkillsMP categories + timeline never collected; AwesomeSkill
`sort=latest&limit=50` hardcoded while plan requires validated sort/pagination (also
silently drops the 10th default query); no move detection or linked-reference reading;
`validateConfig` + hardcoded `HOSTS` block config-only source extension; disposition
keys (`lead:<sha256>`, numeric repo IDs) are unauthorable, defeating reviewed
dispositions in AC-1/§6.
(b) Scope creep (2): `check-upstream.mjs` WeakMap fix (beneficial root-cause fix —
keep with justification); publisher batch/cap/budget constants (defensible hardening —
keep, document in plan).
(c) Wrong (1): `robotPolicy` matcher `"skillwatch".includes(a)` is reversed — selects
crawler groups whose name is a substring of "skillwatch"; against AC-3.

Summary: 8 findings; worst is unauthorable disposition keys.

## Security (differential, triggered: outbound fetch + publication)

3 LOWs: YAML alias expansion relies on library default (harden `maxAliasCount` +
`schema:'core'`); concurrent-publisher duplicate-notify/last-writer-wins state
(HARD exploitability, LOW severity); `writeApi` path guard prefix-only if reused
(no current exploit — all call sites validated). Verified CLEAN with tests:
cross-host redirect auth boundary, private-repo ingress, forged issue/comment
markers, Markdown/mention injection, allowlist/robots. Blast radius: collectors
and publisher called only from `main()` scan/publish paths. Coverage gaps noted:
no private-repo/YAML-bomb/race tests.

## Other specialists

postgresql-code-review, web-design-guidelines, agentic-eval, agent-owasp-compliance:
not triggered (no DB/UI/agent-behavior/trust-boundary changes). agentic-actions-auditor:
new workflow invokes no AI agents — considered, not triggered.

## Documentation impact

README Skill Watch section present and behavior-accurate; trim overlap per Standards
finding rather than adding content.

## Verdict

**changes-requested** — fix list for `itp-implement`: (1) `robotPolicy` reversed
matcher; (2) human-authorable disposition keys; (3) README trim to pointer;
(4) YAML `maxAliasCount` hardening; (5) SkillsMP categories/timeline + AwesomeSkill
sort/pagination validation, or explicitly waive with recorded limitation;
(6) move detection + config-source extension, or explicitly waive with follow-up.
Keep: WeakMap fix, publisher bounds (document the latter in plan).
`recommended_next: itp-implement`.

## Final re-review — 2026-10-11

Working-tree review against the user-approved same baseline, before commit. Initial
verdict above is retained as dated history, not the current disposition.

- Standards: `ses_ed4128262ffevaR5D2zx9x264p` approves. Shared disposition resolution
  now covers rendering/status and alerts; documentation points to the plan. No blocker.
- Spec: `ses_ed4128102ffeCrV5EVgzWFzDTr` approves. Reconstructed compacted identities,
  stable lead aliases, unambiguous moves with retained approved impact, weekly markers,
  and bounded issue bodies resolve its five concrete findings. CLI mode conflicts are
  also guarded. SkillsMP category/timeline and code-reviewed source extension are explicit
  scope limits, not silently claimed functionality.
- Differential/adversarial: `ses_ed4127fb4ffesLp5LQ3cjGatFH` approves after local payload
  rechecks. Authenticated redirect/cache and publisher ownership boundaries are intact.
  Robots ReDoS, oversized headings, and repeated-card state inflation are closed with
  runnable regressions. No verified HIGH/MEDIUM blocker remains in the reviewed scope.

Both original functional/availability regressions and subsequent duplicate-card payload
were shown red before fixes and green afterward. Optional speculative nits are not
escalated into blockers. Detailed security coverage: `docs/work/skill-watch-security.md`.

**Current verdict: approve for implementation commit.** Publication remains disabled;
approval does not constitute a real GitHub publication proof or remote CI success.
`recommended_next: itp-verify`.

## ECC/I2P competitive analysis review — 2026-10-26

Scope: user's requested detailed, critical competitive report, preserving I2P's core.
Research criteria: inspect primary sources at named revisions; separate implemented
mechanisms, tests, native behavior and unproved outcomes; explain ECC strengths and
weaknesses; give specific I2P priorities, a fair evaluation design and marketing strategy.

Artifacts: `ECC-COMPETITIVE-RESEARCH.md` and `ECC-I2P-COMPETITIVE-ANALYSIS.md` in this
directory. ECC snapshot `25278e7`; I2P public snapshot `7d3aa9a`.
Independent research/fact-check session `ses_e88d5ca53ffe9slaOPzqsU5UnS` found no factual
blocker in the ECC comparison sections. Parent applied its three wording corrections:
visibility is not measured mindshare; upstream's stable classification is not independent
runtime proof; the legacy learning evaluator logs instructions rather than proving extraction.

Parent inspected core ECC pipeline, profile/support matrix, permission handler and disabled
eval gate, plus I2P contracts/installer/checker/evidence. No coding-task benchmark or security
exploit was executed. This is a research fact-check, not a two-axis implementation-code
review or comprehensive security audit. Proposed features are not current capabilities.
Verdict: suitable for the scoped advisory report, with stated evidence limits.

## Curl installation review — 2026-10-12

Scope: `docs/work/ISSUE-CURL-INSTALL.md`, AC-1–AC-6 and approved plan refinements.
Fixed point: `86750bcf7bdd5c87b843435d7f4617c8b100ebd0`; current uncommitted
working tree on `feature/curl-install-menu`. HEAD equals the baseline, so reviewers
used `git diff 86750bc` plus explicit reads of untracked implementation/test files;
an empty three-dot committed range was not presented as the implementation diff.

### Standards

Independent read-only reviewer `ses_ed00849c9fferBoXW8CqKwY30i`: no hard violations,
two advisory duplication findings (filesystem traversal predicates and workflow smoke
commands). Kept explicit small procedures; neither finding blocks correctness.

### Spec

Independent reviewer `ses_ed0084892ffe412O2NXIA8ttAQ` initially found explicit
`curl ... | bash -s -- --menu` inherited the exhausted pipe. Bootstrap now selects
`/dev/tty` for menus in stdin-executed scripts; file-based scripted answers retain
stdin. Both pipe forms have real HTTPS/PTY coverage. Fix-only re-review approves.
An additional red→green test found CRLF managed AGENTS markers were not updated by
awk; comparison-only normalization now replaces the block and preserves outside user
lines. The same independent reviewer approved this final incremental fix.

### Differential security

Independent adversarial reviewer `ses_ed008475fffehk2KEJn7Ay6YEU` reproduced a
MEDIUM ownership-confusion issue: project `.itp/install.json` could authorize
overwriting a conflicting shared global skill without refresh. Global destinations
now ignore project ownership for replacement authorization; explicit refresh is
required. Tests cover forged records declaring either scope. The reviewer independently
reproduced the boundary fix, removed the guard in memory to reproduce the original
attack, and verified legitimate local upgrades and explicit global refresh.
Final security verdict: no remaining concrete blocker in the focused review.
Detailed findings/coverage: `docs/work/curl-install-security.md`.

### Documentation and verdict

README, installation plan and agent-work index match the implementation; public
installation remains pending release publication. No DB, web UI, AI Actions workflow,
or agent-runtime behavior change triggers another specialist.

**Current verdict for curl installation: approve for local implementation acceptance.**
Tests and release wiring do not establish remote workflow execution or published assets.
`recommended_next: itp-verify`.

## GitHub presentation refresh

Scope: `docs/work/ISSUE-GITHUB-PRESENTATION.md`, AC-1–AC-6, and the approved marketing
plan's first presentation slice. Baseline `5b3c992`; intentional uncommitted working-tree
review on `feature/github-presentation`, including explicit reads of untracked files.
No committed implementation range was substituted for this WIP diff.

### Standards

Independent read-only reviewer `ses_ebacf28b6fferCl4Zt3sYJ0typ`: no blocking standards
findings. Existing technical guidance is preserved in `docs/reference.md`; absolute
GitHub links keep release-bundle README documentation usable without bundling the docs.
The reviewer noted small SVG type at mobile widths, addressed with the Spec finding.

### Spec and visual review

Independent reviewer `ses_ebacf2785ffeeRWvfpuT1B93PM` found one presentation defect:
the original 15–18-unit SVG descriptions shrank to unreadable text on mobile. The
visual now uses only a 48-unit headline, 52-unit stage labels and 42-unit footer,
with detailed meaning retained in alt text and nearby prose. A font-floor check was
shown red before the change and green afterward; all type remains at least 12px at
a 280px image width in the 320px viewport preview.

Fix-only re-review approved after inspecting 320px dark, 390px light and 1200px light
screenshots. No remaining blocking finding. The previously pending review/verification
records are supplied here and in the corresponding verification section.

Pinned `web-design-guidelines` reviewed for applicable Markdown/SVG concerns: descriptive
alt text, explicit banner dimensions, semantic headings/links, static media, contrast
and mobile readability. No remaining finding in the final banner. GitHub owns page
chrome, focus behavior and issue-form controls; this patch does not implement a custom UI.
No runtime/agent contract, dependency, AI Actions, database or security boundary changed.

### Verdict and limits

**Approve for this local presentation slice.** Supporting docs, contribution guide,
issue forms and GitHub metadata satisfy the declared scope. Preview screenshots use
GitHub API-rendered Markdown with local preview CSS, badge stand-ins and local SVG;
they are not screenshots of the live GitHub repository page. New public docs/image links
become available after merge. A live-page recheck, fresh newcomer task, recorded native
demo and custom social-preview upload remain launch follow-ups.
`recommended_next: itp-verify`.

## Skill Watch process refresh review — 2026-10-26

Scope: `ISSUE-SKILL-WATCH-PROCESS-REFRESH.md`; first slice only, not all-nine completion.
Real framework base is `59170e7`, with uncommitted changes. To preserve the requested
fixed-point review without committing the framework, exact changed/new source bytes were
copied into an isolated Git snapshot at
`/tmp/opencode/process-refresh-validation/review-snapshot`. Its real review range is
`4690527...abca01f`; the former is an archive of the framework base, the latter overlays
the proposed six-file change. The parent verified copied file bytes against the working
tree. Subsequent append-only evidence/progress updates require final parent inspection.

### Standards

Independent reviewer `ses_e8750eb7fffeVnIj61Zg655u54`: approve; no findings or concrete
blockers. Inspected the full diff, documented standards and six old/new source-directory
hashes. Only the three intended skill wordings changed; ownership, invocation classes,
references and unrelated entries remain unchanged. No actionable design smells.

### Spec

Independent reviewer `ses_e8750eb01ffeNkXc6JE9bCYBHQ`: no implementation defects or
scope creep. Independently checked installed/probe directory hashes and paired native
traces. All three targeted behaviors observed. The golden composition plus independent
review/fresh verification remain an explicit acceptance gate, not a wrong implementation.

Standards: zero findings. Spec: zero implementation defects; one remaining acceptance
gate (composition/fresh verification), explicitly pending rather than falsely passed.

### Agent behavior evaluation

`agentic-eval` triggered by changed skill behavior; applied the agreed output rubric to
actual paired traces, not source keywords or self-reported completion. Each updated trace
loaded the intended bytes and exhibited its targeted behavior. Old outputs lacked the
new per-seam, yes-alignment or pre-red diff requirement. One wrong-directory setup run
and one denied broad-shell attempt are retained and excluded/not hidden. No repeated-run
reliability, causal statistical effect or universal compliance claim is supported.

No DB, UI, AI Actions or trust-boundary implementation changed; other specialists were
considered, not triggered. Low-risk wording-only updates do not require differential
security review. Documentation impact is covered by slice/cases/results/plan/index.

Verdict: implementation review approved; final slice acceptance awaits the named golden
composition gate and fresh `itp-verify`. No installation into real-global skills or remote
publication is authorized by this review.

### Final evidence re-review

Same reviewers inspected `abca01f...ba51e52` in the isolated snapshot (full range
`4690527...ba51e52`), including the original native golden trace and actual fixture
artifacts. Standards: approve, zero findings. Spec: golden composition gate satisfied,
zero implementation defects; flagged one premature sentence saying final framework
verification was already recorded. That statement is satisfied only by the new actual
post-review verification entry, not inferred from fixture verification.

Both confirmed real overlapping Standards/Spec reviewers, three red/green cycles and
fresh five-test verification after review. Final documentation/verification append is
parent-inspected; no runtime/pin changes followed review. **Implementation review approved;
recommended next: fresh `itp-verify` for the framework slice.** Historical pending verdicts
above remain as evidence of the order, not a current golden-run failure.

## tstack leaving-pr-comments adoption review — 2026-10-26

Scope/spec: `ISSUE-leaving-pr-comments-adoption.md`, AC 1–7, standard scale because the
agent publication/trust-boundary contract changes. Actual base `cc49991`, uncommitted
working tree on `integration/tstack-pr-comments`. Exact changed/new source bytes were
copied into an isolated snapshot at `/tmp/opencode/tstack-comments-validation/review-snapshot`.
Its base `6386b54` archives the framework base; reviewed proposal `aaf788f`, final reviewed
range `6386b54...79b727b`. Parent verified copied file bytes; final evidence/status-only
appendices are inspected by the parent rather than called independently reviewed code.

### Standards

Reviewer `ses_e86fb9a46ffesvpQWfuQ7kKOnR` initially requested retained native prompts,
configs and inputs: temporary traces alone were not reproducible. Exact twelve-case
inputs, safe constructor and invocation/resume guide now live under `tests/skills/fixtures/`.
Actual native replay from those retained inputs passed, with one fake write and separate
verification/delivery records. Final re-review approves; no remaining standard breach or
actionable smell. Production updater and test-only fixture ownership remain coherent.

### Spec

Reviewer `ses_e86fb99dbffeIOCccqc3CIJAAd` initially required missing-target, missing-receipt
and author-harness fallback observations, and flagged bulk repin querying manual sources.
Added native cases cover the missing branches with explicit limits. Bulk repin now skips
manual entries before their metadata/source requests while checking ordinary entries;
direct targeting refuses manual adaptations. Separate monitoring still includes them.
Hermetic CLI/monitor tests cover those behaviors; fixture Git redirection also has a real
red/green regression preserving unrelated temporary work.

Final re-review: approved for the bounded slice, pending fresh framework verification.
No remaining implementation requirement or scope creep; AC7's parent verification remains
the final gate. Standards: zero remaining findings. Spec: zero remaining implementation
findings; fresh verification not inferred from prior outputs.

### Differential/adversarial and ASI boundary review

Triggered by new authorized external-write routing. Registered adversarial reviewer
`ses_e870249f6ffenIhWQxUTmsr20M` inspected baseline/blame, calculated callers, attacker
scenarios, updater and fixture safety, native traces and all ten registered ASI checks.
Initial and follow-up verdicts: no demonstrated new blocker; approved within bounded
security scope. Its one nonblocking hermetic-test observation was addressed with fake
GitHub/Git tools and masked tokens; import-time production auth lookup is not claimed absent.
Full report: `leaving-pr-comments-security.md`.

### Agent behavior evaluation and documentation

`agentic-eval` rubric uses actual calls/receipts for authorized routing, non-triggers,
blocked capabilities, unsafe preflight, uncertain writes and continuation without repost.
Retained failures: unsafe verifier stopped before specialist; initial author context expanded
the body; one unnecessary `pr` load; delivery-record permission denial before safe resume.
Successful direct preflights and delimited contrasts do not erase those observations or
prove universal adherence. Fake CLI/runtime permissions are experimental bounds, not
production authorization, crypto identity, exactly-once delivery or injection protection.

Public reference/spec, registry, adapter, manual-update policy, cases, retained inputs,
results and plan/index cover documentation impact. No DB/UI/AI Actions change triggers
another specialist. **Review verdict: approve implementation scope; recommended next:
fresh `itp-verify`.** All-nine adoption and live publication remain outside this verdict.
