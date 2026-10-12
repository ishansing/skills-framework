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
