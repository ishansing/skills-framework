# ECC competitive evidence note

**Observed:** 2026-10-26, approximately 07:44–07:51 UTC. **Scope:** ECC evidence research for a later senior technical comparison with I2P; not an I2P audit, implementation proposal, or endorsement.

**Bottom line:** ECC is a substantial, widely distributed agent-engineering toolkit with actual installers, hook runtimes, persistence, tests, and multiple harness adapters. Calling it only a prompt collection would be inaccurate. Calling every advertised workflow an enforced, portable operating system would also be inaccurate. Its strongest competitive assets are distribution, discoverability, breadth, and Claude-native operational tooling. Its most important qualifications are uneven harness parity, instruction-level lifecycle gates, optional learning, external security-tool prerequisites, and no outcome comparison established by this research.

## Snapshot and method

The requested URL `https://github.com/affaan-m/ECC` returned HTTP 200 with that same effective URL. The repository API returned `full_name: affaan-m/ECC`, also directly with HTTP 200: **no rename/redirect was observed for the requested address**. Some source still contains `everything-claude-code` compatibility aliases; those do not establish that this requested URL currently redirects.

| API field | Observed value |
|---|---|
| Default branch | `main` |
| Immutable branch HEAD | `25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b` |
| HEAD committer time | `2026-10-26T04:03:57Z` |
| Stars | 289,080 |
| Forks | 42,847 |
| Subscribers/watchers via `subscribers_count` | 1,414 |
| Open issues via `open_issues_count` | 237; GitHub's repository counter includes open PRs |
| Created | `2026-01-18T00:51:51Z` |
| Updated | `2026-10-26T07:43:23Z` |
| Pushed | `2026-10-26T04:56:56Z` |
| License / archived | MIT / false |
| Checked-out package version | `ecc-universal` 2.2.3 |

API sources: [repository metadata](https://api.github.com/repos/affaan-m/ECC), [main commit](https://api.github.com/repos/affaan-m/ECC/commits/main), and [commit-pinned API object](https://api.github.com/repos/affaan-m/ECC/commits/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b). The metadata response's HTTP Date was `Mon, 26 Oct 2026 07:43:49 GMT`. These API URLs are live, not immutable metadata archives; the values above are the dated observation. Stars and forks measure attention, not active usage, quality, or retained adoption. No npm download, installed-user, revenue, or contributor-total estimate was independently collected.

A shallow clone was placed only at `/tmp/opencode/ecc-research-20261026`, then its HEAD was checked against the API SHA. Research used read-only public GitHub HTTP/API requests, Git source retrieval, targeted source reads, and independent Python file enumeration. **No ECC repository code, installer, hook, test suite, model workflow, or hosted service was executed. No head-to-head execution was performed.** Source links below pin the inspected SHA; line spans refer to that snapshot, not future `main`.

## Twelve material findings

### 1. Catalog breadth is real, but these are inventory counts, not outcome evidence

Independent file enumeration found **71 `agents/*.md`, 311 `skills/*/SKILL.md`, and 97 `commands/*.md`**, matching the README table. Source organization includes agents, skills, commands, rules, contexts, manifests, schemas, hooks, `scripts/`, Python `src/`, tests, `.claude-plugin`, `.codex-plugin`, `.qoder-plugin`, `.opencode`, other harness directories, and the separate Rust `ecc2/` alpha. The package exports an OpenCode build and exposes six executable names, including the main CLI, installer, memory MCP, control pane, and plan canvas. It has five direct Node runtime dependencies, alongside optional Python/Bash/Rust paths. [Catalog claim][catalog], [package surface][package], [package dependencies/build][package-build].

The planner is a Markdown agent definition with `Read, Grep, Glob` and `model: opus`, followed by behavioral instructions. The `/plan` command explicitly runs inline by default and does **not** spawn an agent merely because a planner definition exists. Therefore agent count is not an autonomous-worker count; command availability is not evidence that the complete workflow automatically runs. [Planner source][planner], [plan entry point][plan].

### 2. ECC now overlaps lifecycle orchestration, not merely specialist skills

The `orch-*` family covers new features, feature changes, defect fixes, refactoring, and MVP building. Its shared pipeline classifies size, delegates research/planning/TDD/review, escalates security-sensitive work, and requires plan approval and commit confirmation. It explicitly says the planning documents are its handoff state. This is meaningful overlap with a lifecycle framework and should not be omitted in an I2P comparison. [Shared orchestration pipeline][orch].

**Boundary:** this particular engine is a `SKILL.md` describing model behavior, not an executable state machine validating every phase transition. Its two human gates are textual instructions. Runtime hooks elsewhere do enforce narrower predicates; their existence does not automatically turn these plan/commit instructions into an end-to-end transactional lifecycle guarantee. Compare actual artifact and transition contracts rather than asserting that ECC has no process or that every ECC process is enforced.

### 3. There is genuine event-driven runtime enforcement, with explicit escape hatches

Claude's hook manifest wires PreToolUse, UserPromptSubmit, PreCompact, SessionStart, PostToolUse, PostToolUseFailure, and Stop events. It invokes dispatchers and scripts for governance capture, configuration protection, MCP health, GateGuard fact forcing, observation, formatting/type checking, session persistence, evaluation prompts, and cost tracking. Some jobs are asynchronous and have timeouts. [Hook registration][hooks].

GateGuard is actual JavaScript with shell/PowerShell classification, per-session state, target classes, transcript/search evidence helpers, and destructive-operation checks—not just the README telling the agent to be careful. However, the advertised fact forcing should be described as a scoped preflight/behavior guard, not proof that the resulting code is correct or the model's reasoning is truthful. [GateGuard implementation][gateguard].

Hook flags default to standard, permit global disabling and per-ID disabling, and select minimal/standard/strict behavior. The runner explicitly blocks oversized input for selected security hooks, but treats many other unavailable/no-op paths as no opinion; a missing script returns success after a diagnostic. This is a configurable reliability/safety tradeoff, **not** a tamper-resistant authorization boundary. [Flags][flags], [runner truncation and missing-script behavior][runner].

### 4. Harness reach is broad; feature parity is explicitly not claimed

The support matrix calls Claude Code stable primary, Codex a supported native plugin, Qoder a supported native plugin with only a reviewed SessionStart hook, Cursor beta, OpenCode beta built plugin, Copilot Chat instruction-only, and numerous remaining targets experimental/minimal. It specifically distinguishes instruction, skill, agent, hook, and MCP surfaces by harness. This is more credible than an undifferentiated “works everywhere” claim. [Support and capability matrix][support].

OpenCode installation requires building the payload for the full hook-enabled path. The default `opencode` profile intentionally **excludes** `hooks-runtime`; `minimal` also excludes that runtime. A successful file-placement test therefore must not be reported as a successfully enforced OpenCode workflow. The same caveat applies to experimental adapters that test instruction portability rather than complete native feature parity. [Install commands][other-install], [profile definitions][profiles].

### 5. The OpenCode adapter has code-level gaps worth testing before adoption

Its `tool.execute.before` handler tracks writes and emits reminders/warnings; even the block titled “Block creation of unnecessary documentation files” just logs a warning. It does not reproduce the inspected Claude GateGuard checks in that handler. This illustrates why similarly named hooks cannot be assumed equivalent. [OpenCode pre-tool handler][oc-before].

The adapter also contains a `permission.ask` handler that returns approval for reads and shell commands beginning with formatter/test prefixes. The regexes do not parse the complete shell command, so, **if this hook's return contract is honored by the selected OpenCode version**, a compound command beginning with `npm test` can match despite subsequent effects. In addition, project test scripts themselves can execute arbitrary code. This is an identifiable source-level permission-policy concern, **not a demonstrated exploit**: SDK/runtime compatibility and live effect were not tested. [OpenCode approval source][oc-permission]. Do not copy this auto-approval policy into I2P on the assumption that “test” means read-only.

### 6. Setup and removal are productized, with meaningful safety machinery

The recommended path pins `npx ecc-universal@2.2.3 setup`; documentation inventories scopes, asks users not to layer manual and plugin installs, distinguishes native Claude/Codex trust, offers dry runs, repair, doctor, and uninstall, and describes one reviewed guided flow for Claude/Codex/Kimi. Advanced adapters remain outside the fully qualified guided collision/update/repair/uninstall matrix. [Setup and channel boundaries][setup].

Source substantiates at least part of the safety story: the uninstall lifecycle checks containment, detects symlinks, reads without following links, and can preserve copied files when their SHA-256 differs from the recorded digest. That behavior is conditional on the lifecycle option and operation type; it is not a blanket guarantee for every install path. [Drift-preserving uninstall implementation][uninstall]. The profile manifest supports selective modules rather than forcing the entire library. [Profiles][profiles].

**Trust cost:** executing a pinned npm package still grants that package local process authority; the README itself says a version pin is not a security audit or integrity check. The root MCP config launches `npx -y chrome-devtools-mcp@1.10.1`, a version-pinned external executable, not bundled audited code. Native harness/plugin trust and package provenance remain relevant. [Version-pin warning][setup], [actual MCP config][mcp].

### 7. “Continuous learning” has multiple implementations and materially different defaults

The legacy `evaluate-session.js` does **not** extract patterns itself: it counts user transcript messages, skips sessions below a configurable threshold (default ten), and logs a request for Claude to evaluate/save patterns. A claim of automatic extraction based on this script alone would be false. [Legacy evaluator, especially lines 86–97][learning-v1].

V2 is more substantial: its observer loop actually spawns `claude --model ... --max-turns ... --print --allowedTools "Read,Write"`, defaults to Haiku, disables recursive observation, and uses a watchdog and completion marker. But checked-in `observer.enabled` is **false**; the docs require Linux/macOS/WSL for the background path and document native-Windows failure. [V2 default][learning-config], [observer execution and cleanup][observer], [V2 configuration/platform notes][learning-doc].

Consequences: memory/observation persistence and learned instructions add a durable trust surface; enabling the observer adds model calls and operational failure modes. No learning-quality, leakage-resistance, or poisoning-resistance evaluation was performed here. Do not equate instincts/confidence fields with calibrated empirical improvement.

### 8. Security scanning is an external dependency, with a docs/source inconsistency

README labels AgentShield included, but later explicitly requires an already installed, reviewed `ecc-agentshield` runner and says ECC supplies no audited AgentShield pin. The inspected skill directs `npx ecc-agentshield` and `npm install -g ecc-agentshield` without version pins; its CI example uses `affaan-m/agentshield@v1`. That is weaker provenance guidance than the README's “do not substitute an unversioned one-shot download.” [AgentShield prerequisite and claim][shield-readme], [skill instructions][shield-skill].

The advertised “1282 tests, 98% coverage, 102 static analysis rules” belongs to the **separate AgentShield project**, not ECC's own test coverage. Its optional deep scan uses three Opus agents and requires credentials. The AgentShield implementation and hosted ECC App were not audited in this task; neither their security efficacy nor those numbers are independently validated by this note. Scanning agent config is also not a sandbox or proof against prompt injection.

### 9. Test/CI engineering is significant and was green at this HEAD

Independent source enumeration found **443 `tests/**/*.test.js` files and 26 `tests/**/test_*.py` files**. These are file counts, not assertion counts, passed tests, or coverage. The JS runner recursively discovers suites and supports filtered/parallel/serial execution. Package scripts provide static validators, JS/Python suites, and explicit coverage commands with 80% thresholds. [Runner][test-runner], [test and coverage scripts][package-build].

CI uses a three-OS matrix, Linux Node 18/20/22 full lanes, current configured Windows/macOS full lanes, and narrower package-manager compatibility lanes. Actions are SHA-pinned, credentials are not persisted on checkout, and dependency installs suppress lifecycle scripts. Another job packs an exact installer artifact and runs its lifecycle test on Linux/macOS/Windows using its SHA-256. This is materially stronger evidence of distribution discipline than lint-only CI. [CI matrix and test execution][ci], [exact packed artifact lifecycle][ci-pack].

The read-only [HEAD-filtered Actions API](https://api.github.com/repos/affaan-m/ECC/actions/runs?head_sha=25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b&per_page=30) returned 11 runs: the [CI run](https://github.com/affaan-m/ECC/actions/runs/40267131419), Push on main, and supply-chain watch runs were completed/success; one npm-and-yarn dependency-update run was failure. Do not flatten that into “all checks green.” Logs, job-level exclusions, and every suite were not audited, and none were rerun locally.

### 10. Evaluation infrastructure is not evidence of superior coding outcomes

ECC's executable eval CLI supports capsule verification/projection/export/grouping and receipt creation/verification. **Candidate gate execution is explicitly unavailable**: `gate run` calls `requireSupportedIsolation()` rather than running candidate code. The library explains that no verified OS containment backend exists and syntactic tripwires cannot establish containment or prevent reward hacking. This is a responsible limitation, but important when evaluating “self-improving harness” positioning. [Eval CLI][eval-cli], [gate security boundary][eval-gate].

The Rust `ecc2/` alpha also offers a bounded candidate/baseline comparison using operator-provided recorded scores and seeds. Its docs explicitly state that evidence references/scores are operator assertions, arithmetic thresholds are not statistical significance, and the registry active pointer does not deploy a configuration into runtime. [ECC2 evaluation limits][ecc2].

No inspected source established a controlled ECC-versus-I2P benchmark or a generally applicable accuracy, completion-rate, latency, or cost advantage. The verification skill is a useful build/type/lint/test/security-grep/diff checklist, but it is still model-executed workflow guidance, and its simple greps are not comprehensive security testing. [Verification workflow][verify].

### 11. Presentation and onboarding are competitive strengths independent of technical superiority

The README immediately supplies official-source warnings, platform-specific setup, Windows steps, support tiers, troubleshooting, commercial links, community, sponsor recognition, multiple translations, catalog tables, and guide links. There are hero/guide images and example workflows. The positioning is “coordinated engineering system and toolbox,” with a memorable plan → test → implement → review → verify → remember → improve sequence. [README opening and positioning][intro], [setup][setup].

The MIT OSS and paid hosted App are clearly separated: README advertises private repos from **$19/seat/month** and says OSS remains free. This is a dated first-party advertised price, not independently checked billing terms or actual spend. Its GitHub App and local skill-creation options are different trust/deployment products. [OSS/hosted positioning][intro], [local versus hosted creator][creator]. No demo was executed and no visual asset establishes correctness.

### 12. Breadth creates operational and maintenance costs that selective use can avoid

The README itself warns about duplicate installs, context footprint, agent-team token multiplication, and too many MCP servers. Agent definitions may choose expensive models (the inspected planner uses Opus); enabled learning adds background calls. Claimed token savings such as switching models are configuration guidance, **not measured savings for a fixed quality target in this research**. [Cost/context guidance][cost], [planner][planner], [observer][observer].

Complexity is not just the number of Markdown files: there are multiple install channels, per-harness layouts, compatibility aliases, generated builds, Node/Bash/Python dependencies, optional external MCP/security executables, persistent state, and a separate Rust control plane. The latter explicitly identifies itself as an **alpha scaffold**, missing richer delegation, external compatibility, and release packaging—not a completed GA OS. [Package/build surface][package-build], [ECC2 status][ecc2]. Selective profiles and documented capability boundaries mitigate these costs; dismissing all breadth as bloat would ignore that design.

## Comparison dimensions to carry into the I2P report

These are measurement questions and candidate lessons, **not unverified findings about I2P**. Preserve I2P's lifecycle root, explicit invocation, adapters, approved dependency registry, and pinned upstream content unless separate I2P evidence justifies a change.

| Dimension | ECC evidence / competitive pressure | Fair comparison or core-preserving response |
|---|---|---|
| First successful use | Guided package/plugin setup, Windows steps, dry runs, repair/uninstall | Measure time to a verified first task; improve I2P onboarding without replacing lifecycle ownership. |
| Process ownership | `orch-*` shared textual research/plan/TDD/review/commit pipeline | Compare phase inputs/outputs, approvals, resume artifacts, and failure handling; do not claim process uniqueness based on ECC lacking a lifecycle. |
| Enforced versus instructed behavior | Actual Claude hooks; some lifecycle gates remain prose | Label each I2P/ECC guarantee by enforcement layer and harness. Keep native harness authorization separate. |
| Portability | Stable Claude versus partial/experimental other adapters | Compare the user's exact harness/version/profile, not platform-logo counts. OpenCode should be its own test lane. |
| Provenance and updates | Reviewed runner warnings, pinned examples, selective profiles; some unpinned skill examples | Compare actual installed bytes, approval/change records, package integrity, and rollback—not a generic “secure” badge. |
| Persistent knowledge | V1 prompt signal, V2 optional observer and instincts | Test memory relevance, contamination, deletion/isolation, and cost before adopting autonomous learning. |
| Verification | Substantial software tests/packed install CI, but no demonstrated comparative task advantage | Separate installer/runtime correctness from coding-task outcomes; retain fresh evidence as the completion criterion. |
| Selection/discoverability | Large catalog, quick paths, command/skill entry points, guides | Offer task-oriented recipes for already-approved I2P skills rather than importing the entire catalog. |
| Total cost | Free OSS plus models/MCPs/maintenance; optional hosted App | Measure tokens, retries, human interventions, setup/upgrade effort, and escaped defects on identical tasks. |
| Security | Narrow guards, external scanning, some permissive adapter policy | Compare threat models and concrete denied actions; never treat scanner scores or prompt defenses as isolation. |
| Presentation | Translations, visuals, explicit support matrix, community, clear monetization | Publish small reproducible I2P proof assets and honest support tiers, not unsubstantiated performance marketing. |

## Evidence limits and handoff

- This note establishes a dated source/API baseline, not a full security audit or proof that all advertised integrations work. The strongest source-level concerns are the OpenCode prefix-based approval policy and inconsistent AgentShield provenance instructions; both need a targeted follow-up before operational adoption.
- CI success is an observed remote result for this SHA, not a local rerun or assurance about every harness. Snapshot source can differ from npm 2.2.3 payloads or existing user installs; registry tarballs/signatures were not inspected.
- No user study, coding benchmark, hosted-service examination, external AgentShield audit, npm popularity snapshot, latency test, token accounting, or head-to-head ECC/I2P execution was performed. No claim of “I2P wins” or “ECC wins” is justified by this research alone.
- ECC code was never executed; only this Markdown evidence note was added to I2P. Lifecycle/framework files and dependency maps were not changed. The parent session owns I2P comparison, report synthesis, and final framework verification.
- Note-level verification: an independent Python check resolved all 34 immutable source references against the cloned SHA, validated every cited line range and reference use, counted twelve findings, and confirmed the explicit no-head-to-head limitation (PASS, 2026-10-26 07:50 UTC). `itp-verify` and its verification child were loaded; full lifecycle pass is not asserted because the parent review/synthesis inputs are outside this delegated research scope. Existing shared verification artifacts were deliberately not overwritten.

## Immutable source references

[intro]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L20-L144
[catalog]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L144-L153
[package]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/package.json#L1-L177
[package-build]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/package.json#L496-L596
[planner]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/agents/planner.md#L1-L53
[plan]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/commands/plan.md#L1-L49
[orch]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/orch-pipeline/SKILL.md#L8-L121
[hooks]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/hooks/hooks.json#L1-L258
[gateguard]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/hooks/gateguard-fact-force.js#L1-L115
[flags]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/lib/hook-flags.js#L1-L139
[runner]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/hooks/run-with-flags.js#L120-L238
[support]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L1310-L1449
[other-install]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L387-L445
[profiles]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/manifests/install-profiles.json#L1-L112
[oc-before]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.opencode/plugins/ecc-hooks.ts#L425-L501
[oc-permission]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.opencode/plugins/ecc-hooks.ts#L754-L802
[setup]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L164-L383
[uninstall]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/lib/install-lifecycle.js#L486-L515
[mcp]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.mcp.json#L1-L8
[learning-v1]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/hooks/evaluate-session.js#L44-L100
[learning-config]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/continuous-learning-v2/config.json#L1-L8
[observer]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/continuous-learning-v2/agents/observer-loop.sh#L350-L459
[learning-doc]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/continuous-learning-v2/SKILL.md#L220-L250
[shield-readme]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L2036-L2068
[shield-skill]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/security-scan/SKILL.md#L20-L129
[test-runner]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/tests/run-all.js#L1-L65
[ci]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.github/workflows/ci.yml#L15-L164
[ci-pack]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/.github/workflows/ci.yml#L176-L242
[eval-cli]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/eval-harness.js#L1-L155
[eval-gate]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/scripts/lib/eval-harness/gate.js#L1-L44
[ecc2]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/ecc2/README.md#L1-L120
[verify]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/skills/verification-loop/SKILL.md#L1-L135
[creator]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L2001-L2034
[cost]: https://github.com/affaan-m/ECC/blob/25278e7d7b6cf6e6a4e7a6c8e10f14ff22f0eb5b/README.md#L1853-L1931
