# tstack integration research

Research date: 2026-10-26. Scope: read-only inspection of
`t3dotgg/tstack@7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd`, not approval or installation.
Candidate skill text was treated as source data, not loaded as instructions. No candidate
code was executed. Only this research file is a deliverable; registry, lock, TODO, remote,
and the parent's combined plan are outside scope.

## Conclusion

Do not adopt the bundle as an additional lifecycle. Its narrowest potentially useful gaps
are PR-comment attribution and PR monitoring; old-PR modernization is a useful explicit
user workflow. The delivery and multi-model review workflows should remain user entries,
not recursively invoked specialists. `file-pr` duplicates the existing PR-writing owner
while adding publication authority. No skill is approved by this investigation.

Primary blockers: authorization conflicts in `full-send`/`full-stop`, missing portable
multi-model delegation and event-monitor contracts, an incomplete watcher readiness gate,
and unbounded `council` rounds. These require explicit integration decisions and behavioral
tests, not installation and hopeful precedence rules. [S4–S12; L1–L5]

## Immutable evidence and method

All upstream citations below point at the requested commit, never `main`.
The recursive Git tree was inspected through `gh api`; it reports `truncated: false`.
All 16 file blobs were read through GitHub's raw contents API: README, LICENSE, nine
`SKILL.md` entries, four UI metadata files, and the executable `pr-wait` script.
No nested candidate repository, installer, package manager, or runtime was invoked. [S1]

| Ref | Immutable upstream source |
|---|---|
| S1 | [Complete recursive tree](https://api.github.com/repos/t3dotgg/tstack/git/trees/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd?recursive=1) |
| S2 | [README.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/README.md) |
| S3 | [LICENSE](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/LICENSE) |
| S4 | [full-send/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/full-send/SKILL.md) |
| S5 | [full-stop/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/full-stop/SKILL.md) |
| S6 | [council/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/council/SKILL.md) |
| S7 | [sol-loop/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/sol-loop/SKILL.md) |
| S8 | [file-pr/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/file-pr/SKILL.md) |
| S9 | [takeover/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/takeover/SKILL.md) |
| S10 | [babysit-pr/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/babysit-pr/SKILL.md) |
| S11 | [modernize/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/modernize/SKILL.md) |
| S12 | [leaving-pr-comments/SKILL.md](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/leaving-pr-comments/SKILL.md) |
| S13 | [babysit-pr/scripts/pr-wait](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/babysit-pr/scripts/pr-wait) |
| S14 | [full-send/agents/openai.yaml](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/full-send/agents/openai.yaml) |
| S15 | [full-stop/agents/openai.yaml](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/full-stop/agents/openai.yaml) |
| S16 | [leaving-pr-comments/agents/openai.yaml](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/leaving-pr-comments/agents/openai.yaml) |
| S17 | [modernize/agents/openai.yaml](https://github.com/t3dotgg/tstack/blob/7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd/skills/modernize/agents/openai.yaml) |

Local comparison sources, inspected in the working tree rather than asserted to share an
upstream revision:

- **L1:** [dependency.md](../../dependency.md): capability ownership, conditional triggers,
  user-entry isolation, no runtime installation/substitution, depth 5/repetition 2/children 6.
- **L2:** [itp-review](../../.agents/skills/itp-review/SKILL.md): required `code-review`,
  standards/spec coverage, triggered specialists, no implementation inside review.
- **L3:** [itp-verify](../../.agents/skills/itp-verify/SKILL.md): fresh evidence and acceptance
  coverage; `pr` is authorized formatting close-out, not permission to publish or merge.
- **L4:** [itp-implement](../../.agents/skills/itp-implement/SKILL.md): required `tdd`, scoped
  slices, focused stack specialists, intent-based conflict resolution.
- **L5:** [itp-incident](../../.agents/skills/itp-incident/SKILL.md): diagnosis first,
  fixes through implementation, production/destructive remediation handed to the human.
- **L6:** [SKILL-FRAMEWORK.md](../../SKILL-FRAMEWORK.md), §§2–3: Matt-first engineering,
  thin adapters, preinstalled dependencies, OpenCode-primary portability, distinction between
  prompt conventions and enforceable harness controls.

## Complete skill inventory and recommended classes

IDs below are actual frontmatter `name` values, not inferred product names. [S4–S12]

| Skill ID | Actual behavior and limits | Recommended classification and overlap |
|---|---|---|
| `full-send` | Explicit phrase grants unattended change completion, proof, `sol-loop`, PR creation, rebase/lease-protected force-push of its branch, babysitting, and merging. Requires green checks, handled bot findings, no outstanding human change request, current base and mergeability. Uses configured protections, forbids admin bypass; may ignore automated “needs human review” requests on confidence. Requires final merge commit and proof. Claims its testing grant replaces project ask-first rules, while retaining harness/system approvals and excluding production/data deletion. [S4] | **User entry; duplicate lifecycle process.** Do not add as an adapter child or alternate completion gate. Overlaps implementation, review, verification, and PR close-out; its test permission claim needs reconciliation with local rules. [L1–L6] |
| `full-stop` | Imports `full-send` by relative path but never merges. Allows commits, pushes, rebase, conflict fixes, `--force-with-lease`. Must disable existing auto-merge and dequeue before work and recheck before every push. Hands off ready, approval-waiting, or blocked; checks final live PR and proof. Inherits broad testing permission. [S5] | **User entry; duplicate lifecycle process.** Safer merge boundary than `full-send`, but still writes remote merge settings and runs an entire lifecycle; not a passive readiness specialist. [L1–L4] |
| `council` | User-triggered three-provider, high-effort delegation; exact requested members or latest flagships. Missing provider/member is a blocker, not substitution. Review delegates read-only; scores/rounds go into PR description or final response. Parent can implement recommendations and repeat until all delegates satisfied. No numeric round/cost bound. [S6] | **User entry; duplicate review process.** Not a replacement for required standards/spec or security reviews. Could be an explicitly authorized optional second opinion only with caps, data-sharing consent, and fixed output contract. [L1–L2] |
| `sol-loop` | One actual GPT Sol reviewer; 3 rounds normally, up to 5 for enumerated high-risk concerns with evidence or user request. Fetches base, includes untracked scoped files, runs checks before review. Keeps severity/disposition ledger; no edits while delegate runs, no pushing during loop, no delegate recursion. Requires approval on current behavior diff; budget exhaustion/dispute is not approval. Push only when separately requested. [S7] | **User entry; duplicate review process.** Preserve explicit phrase trigger and exact-model requirement; not a second primary reviewer under `itp-review`. The instruction to try a direct capability call when T3 tools are unlisted needs removal/adaptation on strict tool catalogs. [L1–L2, L6] |
| `file-pr` | Checks existing branch PR and local diff; derives title conventions from merged PRs/history. Writes problem-first body, public model/harness attribution; screens text/attachments for secrets. Publishes a non-draft PR, REST fallback if GraphQL exhausted. Optional babysitting only if requested; comment formatting dependency when a comment is needed. [S8] | **Duplicate process; user entry if retained for publication.** Existing `pr` owns body writing. Do not silently replace it or treat formatting authorization as publication authorization. Distinct future publication operation would need explicit authority. [L1, L3] |
| `takeover` | Reads source PR/branch/thread and corrections, treats handoff as context not proof. Default replacement imports original commits to new branch, separates fixes, preserves authors/co-authors, credits source. Honors authorized in-place/stacked work; uses `modernize`; independently proves failure/workflows. PR finish uses creation plus monitoring. Original merge/closure only when authorized. [S9] | **User entry.** Cross-phase ownership/handoff workflow, not a narrow specialist. Adds credit-preservation detail absent from the inspected adapters; retain local implementation/review/verification gates on return. [L1–L4] |
| `babysit-pr` | User asks to monitor/watch. One owner/watcher; process existing comments first, validate bot findings, fix real failures, reply/resolve false positives, track base movement and rebase when needed. CodeRabbit advisory. Merge only if explicitly requested; fetch and recheck base immediately beforehand. Stops when ready or blocked and unwatches T3 handoffs. [S10] | **Conditional specialist candidate, not yet approved.** Trigger only for explicitly authorized ongoing PR monitoring; separates an actual delivery gap from existing verification. Scope must distinguish monitoring from code fixes, pushes, comment/thread writes, and merges. Fixes return through local gates. [L1–L5] |
| `modernize` | Explicit old-PR/rebase request. Fetches related refs; dirty worktree protected via disposable worktree. Reads actual base/head/intent and intervening architecture/competing PRs. Recommends `MODERNIZE`, `REWORK`, or `CLOSE`; latter two stop before unauthorized rewrite/closure. For modernization rebases, `range-diff`s, tests, force-pushes with lease tied to observed remote SHA; failed lease requires reassessment. No merging/base change/scope expansion. [S11] | **User entry**, potentially a future narrowly contracted specialist for authorized stale-PR reassessment. No auto-trigger merely because a branch is behind: requested modernization includes remote mutation. Conflict mechanics overlap `itp-implement`; conceptual-obsolescence analysis is the useful gap. [L1, L4] |
| `leaving-pr-comments` | Applies verified model/user note callout to agent-written top-level/inline/reply/feedback explanations; excludes descriptions, commit messages and explicitly verbatim unattributed text. Checks secrets including quotes/attachments, previews Markdown, verifies returned comment/review URL; resolves only after response posted. [S12] | **Conditional specialist candidate.** Trigger only when posting on the user's behalf is already authorized. Useful narrow attribution/publication hygiene, not authorization itself; does not need to replace the `pr` writer. [L1, L3] |

## Bundle closure and external references

The actual internal graph is:

```text
full-stop -> ../full-send/SKILL.md
full-send -> sol-loop, file-pr, babysit-pr
takeover -> modernize, file-pr, babysit-pr, leaving-pr-comments
file-pr -> leaving-pr-comments; babysit-pr only if babysitting requested
babysit-pr -> scripts/pr-wait (non-T3 watcher), leaving-pr-comments
modernize -> leaving-pr-comments (when authorized comments are needed)
council, sol-loop, leaving-pr-comments -> no other tstack skills
```

README documents essentially this graph but does not explicitly enumerate the conditional
`file-pr -> babysit-pr` edge; the skill body does. Installing `full-stop` alone is not
self-contained: its transitive closure includes six skills (`full-stop`, `full-send`,
`sol-loop`, `file-pr`, `babysit-pr`, `leaving-pr-comments`) and the helper. `takeover` needs
five skills including itself plus the helper; it does not implicitly include `sol-loop`
or `full-send`. [S2, S4–S12]

Tree modes are regular `100644` files except `scripts/pr-wait` (`100755`); there are no
`120000` symlinks, `160000` gitlinks/submodules, or hidden external content in the complete
tree. No package manifest, lockfile, installer, vendored third-party library, test suite,
reference directory, or bundled custom Sol reviewer exists at this SHA. Four
`agents/openai.yaml` files contain display name, short description, and `$skill` default
prompt only; they do not provision models, permissions, tools, or a reviewer agent.
Preserve the relative layout and executable bit if later packaging is approved. [S1, S14–S17]

External references are runtime dependencies or user context, not bundled symlinks:

- `gh`, Git, authenticated GitHub repository access; GitHub GraphQL/REST API and branch
  protection/ruleset semantics. README requires authenticated `gh`. [S2, S7–S11, S13]
- Python 3 with stdlib and POSIX `fcntl` for the helper; no Python packages are declared.
  Modern annotation syntax and `collections.abc` use make Python 3.9+ the conservative
  source-level floor to validate, rather than assuming every Python 3 release works. [S13]
- T3 Code (README links `pingdotgg/t3code`): `orchestrator_capabilities`, `delegate_task`,
  `watch_pull_request`, `unwatch_pull_request`; `sol-loop` also names prohibited thread
  tools. Exact APIs and fallbacks are prose assumptions, not vendored implementations.
  Other hosts need native cross-model delegates and async completion; generic subagents
  that cannot select the required provider/model are insufficient. [S2, S6–S7, S10]
- Claude Code Monitor (`timeout_ms: 3600000`) or a long-running command for `pr-wait`;
  Claude `AskUserQuestion`, Codex `request_user_input`, or equivalent question tool for
  unattended blockers. No question tool means safe unmerged handoff. [S4, S10]
- `.macroscope/check-run-agents/*.md` from the target repository when responding to
  Macroscope; Greptile/Macroscope/CodeRabbit on the live PR. These rules/bots are not
  bundled or pinned by tstack. A repo without Greptile/Macroscope should use `green`, not
  the default `ready`. [S10, S13]
- `AGENTS.md`/`CLAUDE.md` for personal council members; user handoff threads and original
  PRs for `takeover`; optional app/browser/device/screenshot/upload tooling for proof.
  No portable screenshot uploader or thread reader is supplied. [S2, S4, S6, S9]

## What the executable actually does

`pr-wait` is a local Python polling process, not an agent and not a merger. It takes a
positive PR number/URL, optional `owner/name`, `--until ready|green|any-change`, and
`--interval` (default 20 seconds, minimum 5). Only github.com PR URLs match. Repo discovery
uses `gh repo view`; target validation uses `gh pr view`. `--repo` overrides a URL's repo,
so a mismatch needs explicit policy if wrapped. [S13: `parse_target`, `main`]

**Local writes:** creates `~/.local/state/pr-wait/`, opens a per-repo/PR `.lock`, acquires
nonblocking `flock`, records PID, and writes `.json` state via `.tmp` plus replacement.
Same-PR process lock is per local user/state directory, not cross-host/account-global.
State records reported IDs, bot summary digests, base OID and merge state; not full bodies
or tokens. State older than six hours or unreadable JSON becomes a new baseline. First
run suppresses old event notifications but still evaluates failure/readiness. The script
does not explicitly harden directory permissions/symlink handling or prune old files.
[S13: `STATE_DIR`, `lock`, `load`, `save`, `emit`, `run`]

**Remote operations:** subprocess argument arrays call authenticated `gh` for GraphQL
viewer/PR/comments/reviews/threads, checks, branch rules/protection, PR file paths and
commit comparisons. Its GraphQL request is a query, not a mutation even though sent via
`gh api graphql -f`. No script operation pushes, merges, posts a comment, changes PR state,
installs code, or edits credentials. Authentication is inherited from `gh`; it does not
provision credentials. Transient errors retry up to five attempts (2/4/8/16-second sleeps),
then up to ten consecutive failed polls; permanent errors stop. No total wall-clock
deadline. [S13: `gh`, `fetch_pr`, `fetch_checks`, `required_checks`, `base_overlap`, `run`]

**Check/event policy:** reads required names from rulesets and classic branch protection;
missing required checks count pending. Duplicate check names collapse to worst bucket.
Without required names every non-review-bot CI check gates. Uses two identical snapshots
to avoid immediate half-registered green. Bot identity uses substring matching on names.
Greptile/Macroscope completion is terminal bot checks, a head-matching review, or a summary
containing the seven-character head SHA; CodeRabbit does not gate. Reports external
comments/reviews/threads, bot completion/summary changes, base file overlap and BEHIND/
DIRTY transitions. Filters own/PR-author and status-bot top-level comments. [S13: `poll`]

**Exit policy:** 0 means requested condition or merged; 1 means required failure,
DIRTY, closed, ready blocked by threads/BEHIND, or API failure; 2 means arguments,
target-validation or competing watcher failure. Interrupt is 130. `green` does not require
reviewers or resolved threads and can return with BEHIND. `any-change` reports events,
not readiness, and does not use normal failure stopping conditions. Wrapper consumers
must distinguish these modes and outputs rather than interpreting any exit 0 as merge
authorization. [S13: `poll`, `finish`, `main`]

### Watcher limitations requiring tests or explicit exclusions

These are source-derived integration risks, not demonstrated runtime exploit claims:

1. **Not the merge gate:** query lacks aggregate required approvals/review decision and
   draft status. `ready` only explicitly excludes DIRTY/BEHIND, not UNKNOWN/BLOCKED or
   every nonmergeable state. Bot checks marked failed/cancelled still count as a completed
   bot review unless also a required check. Human change requests are reported, not used
   directly to block readiness. Keep a separate live merge gate. [S4, S10, S13]
2. **Bounded reads without pagination:** last 100 top-level comments/reviews/threads and
   first 100 comments per thread. Older unresolved threads or review evidence can be
   missed; commit-compare file lists are not paginated either. [S13: `QUERY`, `base_overlap`]
3. **No checks means no success:** `gate_done = bool(gate) and ...`; a repo with no checks
   never becomes green/ready, including `--until green`. A repo without gating bots never
   becomes default ready. These are real operational limits, not installation failures.
   [S13: `poll`; S10]
4. **Races and stale policy:** PR metadata and `gh pr checks` are separate requests; checks
   are not pinned to the previously read head. Required names are cached for the process,
   even if policy/base changes. Two snapshots reduce registration races but do not prove
   an atomic current-head decision. [S13: `fetch_pr`, `fetch_checks`, `poll`]
5. **Degraded reads:** required-policy read failures other than 404 are logged and polling
   continues with whatever names were collected; comparison failures become no overlap.
   These should be unknown/blocking for a delivery gate, not evidence of safety. [S13]
6. **Untrusted text crosses into agent context:** snippets of remote comments and review
   content appear on stdout; stripping HTML is formatting, not prompt-injection defense.
   `.macroscope` files and PR handoff bodies are also external instructions/data requiring
   trust classification. The local review adapter already explicitly treats diffs as data.
   [S10, S13; L2]
7. **Operational/privacy limits:** watcher output includes comment snippets and URLs that
   may be private; cached paths expose repo names. No explicit network timeout in
   `subprocess.run`, so a hung `gh` can outlive the transient retry budget. POSIX locking
   is not Windows portable, and multiple hosts still share GitHub quota. [S10, S13]

## Writes, network, credentials, and authorization boundary

| Surface | Risk-bearing behavior | Required integration boundary |
|---|---|---|
| Working tree/history | Full workflows implement/fix, create branches, commit, rebase; takeover imports commits; modernize may create worktrees. Dirty work preservation is explicit in several skills. [S4–S5, S7, S9, S11] | Scope paths and user-owned changes before writing; preserve credit and inspect conflict/range diffs. Do not let monitor auto-fixes bypass `tdd`/review/evidence. |
| Remote branch | Full workflows and modernization permit lease force-push. Modernize explicitly binds lease to observed SHA; full-send only says `--force-with-lease`. [S4–S5, S11] | Require exact repo/branch/head and observed-SHA lease; concurrency failures block, not retry-overwrite. |
| PR publication/settings | `file-pr` publishes real non-draft PRs; council/sol-loop edit review attribution; full-stop disables auto-merge/dequeues; replies resolve feedback. [S5–S8, S10, S12] | Separate authorizations for body drafting, creation/update, comments/resolution, auto-merge/queue settings; warn that PR creation/push may trigger CI and external bots. |
| Merge/close | full-send merges after gate, waits for auto-merge/queue completion, permits dismissing automated human-review requests; full-stop expressly prohibits merge/queue enrollment/default-branch push. Modernize/takeover do not authorize closure. [S4–S5, S9, S11] | No recursive user-entry invocation; preserve human approval and protection requirements, live final-head proof, and explicit merge/closure grants. |
| Models/network | council sends code/context to three providers; sol-loop sends it to GPT Sol. No data-residency, retention, price cap or credential provisioning is supplied. [S6–S7] | Preflight permitted providers/models, confidential-code policy, billing/round caps and completion/cancellation contract. Never silently substitute. |
| Testing | full-send/full-stop claim testing methods allowed despite project ask-first guidance, including app/dev server/device/computer use; no production/data-deletion permission. [S4–S5] | Reject blanket override of higher-priority controls; explicitly scope device, environment, network, fixture and screenshot permissions. |
| Credentials/content | Authenticated `gh` reads/writes as user; comments and PR bodies require secret screening, but no credential manager, least-privilege token policy, or enforcement is bundled. [S2, S8, S12–S13] | Use existing approved auth; no new secrets in skill files or output. Delimit untrusted PR/bot text and verify quoted attachments. |

## License and provenance caveats

Repository LICENSE is MIT, copyright © 2026 Theo Browne. Redistribution of copies or
substantial portions requires preserving the copyright and permission notice; the code
and documentation are supplied without warranty. No per-file alternate licenses or
third-party notices were present in the inspected tree. This supports copying the pinned
bundle under MIT, not a claim that every externally referenced tool/service is covered
by that license. Preserve LICENSE with later vendoring even if an individual SKILL.md has
no license frontmatter. [S1, S3]

GitHub/CLI, model providers, T3 Code, host tools and live bot/repository content are external;
their licenses, terms, access rights and data policies were not audited here. README's
clone/copy examples track default-branch content and omit a pinned revision/license-copy
step; they are not suitable as this framework's immutable installation procedure. Do not
infer upstream origin or legal approval beyond the supplied repository notice. [S2–S3]

## Integration prerequisites (recommendations, not changes made)

1. **Keep the current primary process.** Preserve `code-review`, `tdd`, evidence verification
   and `pr`. If a user chooses tstack end-to-end workflows, return a user handoff rather
   than nesting them; route final work back through `itp-review` and fresh `itp-verify`.
   Council/Sol confidence and watcher exits cannot replace standards/spec/security gates.
   [L1–L6]
2. **Choose narrow candidates separately.** Consider comment attribution first; monitor
   second after scoped read/write authority and watcher limitations are addressed.
   Keep modernization/takeover explicit user workflows. Record exclusions rather than
   adopting all nine to obtain one formatting convention.
3. **Before later approval**, pin full transitive source content, helper, metadata and MIT
   notice in the normal lock/provenance system; verify packaged paths, executable mode and
   no escaping symlinks. Installation is a separate authorized maintenance action, never
   a running adapter's fallback. Do not add dependencies during this research. [L1, L6]
4. **Define host contracts before routing.** Model discovery must use available catalog
   tools; unavailable T3 tools are not callable by guessing names. Prove exact Sol/provider
   routing, read-only reviewer isolation, async cancellation/wakeup, question and monitoring
   support; otherwise report `needs-human`. Bound council rounds and reconcile Sol's 3/5
   rounds with the framework's repeated-skill limit instead of exempting it silently.
5. **Make authority and result explicit.** Inputs: PR repo/number, head/base SHA, intended
   scope, allowed writes, checks/bots expected, deadline. Outputs: observed head, check/
   review/base evidence, unresolved findings, actions taken, blocked/ready distinction.
   `leaving-pr-comments` must not make posting automatic just because its trigger fires.
6. **Do not model prompts as runtime enforcement.** tstack does not supply a sandbox,
   provider isolation, secret detector, cross-host watcher lease, audit log or transactionally
   consistent merge gate. Existing framework documentation already distinguishes these
   harness concerns. [L6]

## Required tests before any future adoption

These are proposed acceptance cases; none executed candidate code in this investigation.
Use fixture-driven fake `gh` and isolated HOME for helper tests, never live publication.

| Area | Minimum concrete cases / expected proof |
|---|---|
| Package/closure | All nine frontmatter IDs match directories; relative full-stop import resolves; conditional edges and helper/YAML/license are pinned; executable bit retained; reject symlink escape/missing helper. |
| Authorization/precedence | Research/body-writing/monitor-only request cannot commit, publish, resolve threads, rebase/push, modify merge settings or merge. `full-stop` cannot merge directly, by delegation, queue, auto-merge or default push. Existing automatic-merge prevention failure blocks before writes. Project/system test restrictions are not overridden implicitly. |
| Reviewer routing | Sol missing/wrong model, one council provider missing, unsupported async tool, delegate timeout/error, unavailable question tool all block safely. No reviewer writes/subdelegation; no scoped edits during review; council and 3/5 Sol rounds bounded; exhausted rounds never approve. |
| Local lifecycle | Handoff work still requires spec/standards review, triggered security specialists and fresh final-head evidence; monitor fixes route through implementation, not self-approval. Documentation-only/nit fixes follow explicit approved policy. |
| Watcher I/O/state | Invalid/empty/zero PR; URL/`--repo` mismatch; repo lookup errors; min interval; duplicate local watcher; restart baseline/replay; six-hour expiry; corrupt/partial state; atomic save; no repo/credential writes; private snippet handling. Test file permissions/path safety before use on shared hosts. |
| Watcher checks | Missing required job stays pending; duplicates use worst state; skipped/cancelled/failed/pending; empty checks; bot-only checks; protection-read denial; base/policy change; two stable snapshots; head changes between metadata and checks. Explicitly test that exit 0 is never consumed as merge authorization. |
| Watcher reviews/base | No Greptile/Macroscope; advisory-only CodeRabbit; failed bot checks; stale short-SHA summary; unresolved thread outside 100-node window; paginated replies; human change request; draft/UNKNOWN/BLOCKED; BEHIND in green vs ready; base-overlap comparison error. Unknowns block delivery rather than pass. |
| Watcher failure/ownership | Network/429/backoff, permanent error, hung `gh`, ten failed polls, interrupt, owner-only T3 watcher, unwatch before handoff, no duplicate native/script watchers and no busy polling. |
| Branch/contributor safety | Dirty worktree preserved; no original PR mutation without authority; actual non-main base used; competing PR causes reassessment; range-diff detects lost/reintroduced behavior; explicit observed-SHA lease fails on concurrent remote update; authors/co-authors survive replacement/squash. |
| Publishing/content | Secret/private quote or attachment blocked; verified model/login attribution only; verbatim exception honored; Markdown preview; returned URL verified before resolve; failed comment never resolves; non-draft PR and REST fallback require original publication authorization. |

If adapters or dependency mapping are subsequently changed, run
`node tests/skills/check-contracts.mjs` plus the new isolation/composition cases in
`tests/skills/`; a static contract pass alone cannot prove these behavioral boundaries.
This research changes neither adapters nor dependency mapping. [L1]

## Evidence limits and handoff

Observed facts are from the full pinned repository source and the named local contracts;
runtime capabilities, remote branch permissions, installed model routes and bot behavior
were not exercised. No candidate code, live PR action or upstream test was run. The tree
contains no upstream tests to cite. This document is evidence for the parent to combine
with its separate issue-9 research and plan, not a registry approval, completed integration,
or framework verification verdict.

Fresh document check: a local Python assertion check re-read the GitHub tree and this
document and passed: nine inventory rows, 16 upstream blobs, 16 immutable file citations
at the requested SHA, existing local comparison links, complete tree, and no symlink or
submodule entries. This executes only the researcher's validation code, not candidate code.
`itp-verify` and its evidence child were consulted; a lifecycle integration pass is not
claimed because this is research without an implementation slice/test/review-verdict
input set. Its usual verification artifact was not written: this task authorizes only this
file, and the parent owns combined verification.
