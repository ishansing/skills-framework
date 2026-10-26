# tstack + Skill Watch integration plan

Status: implementation started, 2026-10-26. All-nine tstack scope and justified
replacements remain required. First active slice:
[approved-process refresh](../../docs/work/ISSUE-SKILL-WATCH-PROCESS-REFRESH.md).
The user authorized starting the plan and confirmed isolated installer/native-output
test boundaries. Real-global installation changes and remote publication are excluded.

## Outcome and boundaries

Integrate **all nine tstack skills** and selected issue #9 upgrades through I2P's
existing adoption process, preserving one artifact-driven lifecycle and one primary
process per capability. Adopt capabilities, not tstack's entire host configuration.

All nine are required delivery targets, not a shortlist. A blocker changes the adaptation
or delivery sequence; it does not remove a skill from scope. Do not report this initiative
complete while any skill is merely researched, deferred, copied without working routing,
or represented by a recommendation to install it later.

Follow [the adoption procedure](SKILL-INTEGRATION-PLAN.md) for implementation;
this plan selects scope, sequence and acceptance. The registry and lock remain
unchanged until an implementation slice is explicitly approved.

Evidence:

- [tstack source review](../../docs/work/TSTACK-INTEGRATION-RESEARCH.md), snapshot
  `t3dotgg/tstack@7de017b3fc9d50c03cf3ecb98fb71e0ca65a78bd`.
- [Approved update review](../../docs/work/SKILL-WATCH-2026-10-26-UPDATES.md).
- [Issue #9 candidate review](../../docs/work/SKILL-WATCH-2026-10-26-CANDIDATES.md).
- [Issue #9](https://github.com/ishansing/skills-framework/issues/9), rechecked
  2026-10-26: unchanged at `2026-10-26T12:24:39Z`, three comments. Its cumulative
  backlog and October 24 inventory freshness are not comprehensive current coverage.

Snapshot SHAs here identify research inputs, not approved dependency pins. At execution,
use these reviewed bytes or review a new diff; never silently substitute latest HEAD.
The research note's earlier selective/defer recommendation is historical analysis;
the user's all-nine direction above supersedes that proposed scope, not its source facts
or safety findings.

## Invariants

- Prefer the approved Matt Pocock process unless an evidenced replacement fits better.
  The user permits replacements where needed; each requires a documented ownership and
  behavior migration, not two competing required children or removal of required coverage.
- Specialists have narrow positive and negative triggers. User-entry workflows remain
  user-invoked; returned changes pass `itp-review` and fresh `itp-verify`.
- Missing tools, unapproved children or unsupported hosts yield a named `needs-human`
  handoff. No recursive installation or automatic permission expansion.
- Preserve user edits and existing global skills. Installation scope and native discovery
  are separate proofs. Isolated HOME/worktrees are not security sandboxes.
- Framework artifacts remain authoritative for run identity, resume and completion;
  an upstream report or successful command cannot bypass lifecycle gates.

## Delivery sequence

Progress: the first three process pins are updated in the working branch, paired native
probes, strict isolated installs, native golden composition and independent review have
run; final fresh verification passed for this slice. Publication and live installation remain pending.
Next: `leaving-pr-comments` adoption. No tstack skill is integrated yet. Detailed outcomes belong
in the [dated results](../../tests/skills/results/2026-10-26-process-refresh.md).

### Proposed tstack routing matrix — all nine skills

The following defines required integration targets, not an already approved registry. Source behavior
and dependency details are in the linked research note.

| Skill | Proposed I2P role / owner | Delivery gate |
|---|---|---|
| `leaving-pr-comments` | Conditional publication-hygiene specialist, only after posting is authorized; explicit delivery handoff rather than a new lifecycle phase. | First tstack slice: correct model/user attribution, secret/attachment checks, verified response URL before thread resolution. No posting from a draft-only request. |
| `babysit-pr` | Explicitly requested PR monitoring; default grant is observe/report, with fixes/publication separately authorized. | Second tstack slice: complete helper bundle, host wakeup/deadline support, typed outcome contract and live final-head checks. Monitoring is not merge authorization. |
| `modernize` | User-entry stale-PR reassessment/modernization. | Third tstack slice: distinguish MODERNIZE/REWORK/CLOSE, preserve dirty work and intent, range-diff plus observed-SHA lease; publication is a separate handoff. |
| `takeover` | User-entry contributor handoff, composed with approved modernization capability and explicit delivery handoffs. | After modernization: preserve authors/credit, independently verify original claims, require authority for original-PR changes or closure. |
| `sol-loop` | Required integration as a user-requested exact-model second opinion; standards/spec coverage remains required. | Prove actual GPT Sol dispatch, read-only delegate, current-diff approval, bounded rounds and no recursive user-entry calls. Missing model blocks that run, not adoption scope. |
| `council` | Required integration as a user-entry multi-provider second opinion. | User-approved provider/data-sharing/cost/round limits, exact member dispatch and safe timeout/exhaustion. No unbounded “until satisfied” loop. |
| `file-pr` | Required integration as authorized PR preparation/publication; evaluate replacing Matt `pr` as the single PR-writing owner. | Prove existing body-formatting and verify-gate behavior survive migration; creation/non-draft status, updates and fallback API writes need explicit grant. Reuse comment hygiene. |
| `full-stop` | Required adapted user-entry delivery recipe over the shared I2P lifecycle, not a recursive adapter child. | Reconcile lifecycle/child invocation and testing authority; disabling auto-merge/dequeue is a remote write. Prove no direct/delegated/queued merge and preserve all I2P gates. |
| `full-send` | Required adapted user-entry delivery recipe over the same lifecycle with separately approved merge authority. | All full-stop prerequisites plus explicit repo/branch/head-scoped merge grant and independent live readiness gate. No confidence-based bypass of required human review. |

All nine must become working, pinned, documented framework entries. Invocation remains
optional where appropriate: integrating `council` does not run paid multi-provider reviews
on every task, and integrating `full-send` does not grant unattended merge authority.
Unchanged bulk installation is not sufficient; broader workflows need reviewed adaptations.

#### Replacement decisions

| Existing owner / candidate | Planned decision and migration proof |
|---|---|
| Matt `pr` versus tstack `file-pr` | Evaluate `file-pr` as the replacement PR owner. Retain a draft/body-only path when publication is not authorized. If replacement passes, migrate `itp-verify` close-out, capability/inventory/trigger rows, lock, generated registry, fixtures and docs together; retire the old active requirement without deleting unowned global copies. If replacement loses required behavior, adapt `file-pr` or retain a narrowly scoped formatting dependency with only one owner per operation. |
| Matt `code-review` versus `sol-loop`/`council` | Do not equate model agreement with Standards + Spec coverage. Keep required review ownership unless an explicit replacement proposal demonstrates both axes, tracker/standards discovery, independent reports, blocked paths and specialist composition. Integrate both tstack review entries regardless of that decision. |
| Issue #9 `pr-address-feedback` versus `babysit-pr` | Prefer the required tstack integration where it meets the need; add the new candidate only for a demonstrated approval-first triage gap with no duplicate resolution owner. |

Other replacements are allowed where evidence justifies them. Record old/new owner,
retained behavior, migrated callers/fixtures, installed-state compatibility and rollback
before retiring anything. Replacing a skill does not waive consent, review or verification.

#### Packaging and authority prerequisites

- The upstream is MIT; retain Theo Browne's copyright and license notice. The pinned
  tree has 16 files, no symlinks/submodules and no upstream tests. External tools/models
  are not covered by that provenance review.
- Preserve cross-directory dependencies: `full-stop` imports `../full-send/SKILL.md`;
  its closure includes six skills. `takeover` needs five. `babysit-pr` includes executable
  `scripts/pr-wait`; preserve its mode. Installing a dependent alone is incomplete.
- These closures include workflows proposed as user entries. I2P cannot recursively load
  them merely because tstack asks. Before broader adoption, design explicit handoffs or
  reviewed local adaptations; do not relabel explicit-user workflows as model skills just
  to satisfy the graph. Use existing vendored-pinned adaptation conventions with upstream
  provenance and hashes of the actual installed bytes, never unchanged-source hash claims.
- Preflight authenticated Git/GitHub CLI, permitted repository access and actual host tools.
  The helper uses Python stdlib/POSIX locking; validate its Python floor (source suggests
  3.9+) and reject unsupported platforms. No tool install or authentication expansion is
  implicit. T3 tool names cannot be called on OpenCode merely because prose names them.
- `full-send`/`full-stop` testing grants must not override higher-priority instructions
  or local consent requirements. Any delivery mode spells out test/device/network,
  commit/push, comment/resolution, PR-setting and merge grants separately.

#### PR monitor acceptance contract

Start with observe/report rather than automatic repair or merge. Bind input and output
to repo/PR/head/base, authorized actions, expected checks/bots, deadline and watcher owner.
Use one native watcher or one helper, not both; cancel on handoff and stop on budget expiry.
Avoid a new background service or a second run ledger.

The helper's exit 0 means its requested condition, not permission to merge. Its current
readiness logic lacks required human approvals/draft status, has bounded unpaginated
thread reads, degraded policy reads and head/check races. Empty-check repositories do
not reach green; missing Greptile/Macroscope prevents default ready. Unknown is blocked,
not safe. Any future merge operation needs fresh, complete policy/review/head/base evidence
and a head-bound operation independent of helper readiness. If API consistency or branch
protection cannot make that safe, hand off; don't add a custom merge control plane.

Use fake `gh` fixtures before live read-only evaluation: head/base changes, missing checks,
human changes requested, draft/blocked/unknown state, >100 threads, no bots/checks, denied
policy reads, hung CLI, restart/corrupt state, duplicate watcher and deadline/cancellation.
Treat remote comments/bot instructions as untrusted data; redact private snippets in logs.

### 0. Approve scope and prepare exact-source proposals

1. Resolve all nine tstack skills' identity, license, invocation class, complete bundle,
   host assumptions, side effects, owner and overlap using the source reviews.
2. Create an adoption proposal for each new capability, using the existing preview tool
   where applicable. Bind previews to the proposal, framework revision and routing bytes.
3. Resolve only blockers needed by the slice. Before changing security routing, resolve
   I2P's threat-model trigger mismatch with upstream's explicit-user-request restriction;
   adding tstack is not permission to broaden security triggers.
4. Record the implementation base and use one maintenance branch/PR per coherent slice
   from reviewed mainline. Preserve the current local research commits and uncommitted
   notes; include needed planning evidence deliberately, without discarding or silently
   bundling unrelated work. Commit/push actions need their own authorization.

Exit: each tstack skill and selected issue #9 change has a reviewable proposal, positive/non-trigger/blocked cases,
and no unresolved licensing or packaging assumption. User selects implementation slices.

### 1. Issue #9 low-risk approved-process refresh

Selectively update `grilling`, `tdd` and `diagnosing-bugs` to the reviewed Matt snapshot.
Use existing per-ID repin tooling, not `--all`; hashes cover full directories.

Acceptance:

- A recommended answer maps to “yes” without removing alternatives or user authority.
- Each proposed test seam states what it catches and misses; seam approval remains.
- When forced mutation is used, retained diff proves it landed before red is trusted;
  pre-existing work survives restoration. Do not require mutation for every test.
- Relevant align/architecture/implementation/incident cases still pass.

Exit: exact pins, fresh installation and recorded native behavior for affected cases;
static text checks alone cannot establish adherence.

### 2. First bounded tstack adoption

Start with `leaving-pr-comments`, the smallest bounded capability in the routing matrix.
Keep it independently reviewable from the approved-process refresh. Route through an
existing adapter or explicit user handoff; introduce no new lifecycle phase.

Exit: complete pinned bundle, native discovery/invocation, one positive/non-trigger/
missing-capability case, expected artifacts, and return through review/verification.

### 3. Remaining tstack capabilities in coherent slices

Integrate `babysit-pr`, then `modernize`/`takeover`, then `file-pr` with its replacement
decision. Integrate `sol-loop`/`council` with model and budget preflight, then implement
`full-stop`/`full-send` after their ownership and authority adaptations are reviewed.
The latter are required later slices, not deferred-out-of-scope items. Group only skills sharing a real
bundle or routing dependency. Resolve duplicate primary
processes and higher-risk credential/Git/network behavior before their slice runs.
Validate on the current supported OpenCode host first; Codex/Claude Code support claims
require their own exact-version runs, not repository marketing or compatible file paths.

Exit: all nine skills are integrated, directly or as documented adaptations, with exact
installed-byte provenance, working discovery/routing and fresh native acceptance evidence.
User-entry integration requires an actual invocation and lifecycle return, not a static
handoff document. Missing providers or unresolved authority decisions keep this milestone
incomplete; do not claim full adoption from a partial set or static installation alone.

### 4. Gated issue #9 updates

| Update | Required proof before repinning |
|---|---|
| Matt `code-review` | Two independent Standards/Spec calls dispatched together in the foreground, both awaited before aggregation; all applicable standards enumerated; missing tracker preserves setup handoff. |
| Matt `wizard` | Actual dotenv-consumer round trips (including apostrophes, dollar signs and backslashes), EOF/partial input, reruns, modes, symlink destinations and write-failure behavior. Explicitly accept or address non-atomic truncate/rewrite and existing permissive modes; no automatic rewrite of user wizards. |
| Trail of Bits existing reviewers | Optional metadata-only refresh; verify unchanged analysis and adversarial-modeler compatibility. No detection-improvement claim. |
| Vendored web guidelines | Optional pinned snapshot refresh retaining local adapter; validate conditional desktop overscroll guidance, hybrid/coarse-pointer caveat and no forced unrelated app CSS edits. |

Retain the old pin if a gate fails. Any necessary adaptation gets separate reviewed
provenance and tests; never label modified bytes an unchanged upstream snapshot.

### 5. Issue #9 new candidates, after tstack overlap resolution

- **PR-feedback triage:** evaluate `pr-address-feedback` against `babysit-pr` before
  adding both. Proposed split: approval-first per-comment triage owns resolution planning;
  babysitting owns observation/wakeup only. Adopt that split only if tests demonstrate no
  duplicate replies, fixes or thread resolution. Keep GitHub writes separately authorized
  and map host-specific interaction tools explicitly; otherwise choose one owner.
- **Playwright guidance:** optional conditional specialist only for Playwright test
  changes; review all 59 bundle files and compatibility with existing browser/generation
  skills. It complements TDD rather than replacing it.
- **Trail of Bits patch/regression proof:** separate heavier proposal. Resolve parent
  references/scripts/schemas packaging, CC BY-SA obligations, Python >=3.13/`uv`, fresh
  stage-agent support, clean-tree/local-commit requirements and three-attempt policy
  versus framework bounds before any execution. Do not adopt isolated broken subskills.
- **Defer:** Cloudflare audit until real required OS isolation/evidence promotion exists;
  Cypress and other stack-specific skills until a concrete project needs them; broad
  alternative engineering processes while the approved primary covers the capability.

Exit: no duplicate owner introduced; each addition independently justified and approved.

## Change surface and validation

For each approved adoption/update, account for all affected callers and surfaces:

- `dependency.md`: capabilities, invocation/status, owners, triggers and user-entry rules.
- `skills.lock.json`: exact source/path/revision/full-directory hash; generated
  `dependency.json` via the existing generator.
- Owning `.agents/skills/itp-*/SKILL.md` contracts/procedures, or explicit user handoff;
  root routing only where needed. Respect six-child/depth/repeated-skill limits.
- `SKILL-FRAMEWORK.md` and public reference docs where approved routing changes their
  described contracts; reuse its §3.4 portability checklist for additional hosts.
- Bundled content and license notices if vendored; documented adaptations and provenance.
- `install.sh`, `scripts/install-config.mjs`, fetch/hash/adoption tools **only if**
  a demonstrated packaging or ownership gap requires them. Reuse the installer.
- Relevant `tests/skills/` positive, negative, failure, recursion and composition cases;
  `tests/scripts/` only for changed machinery. Update installation/host documentation
  and append dated evidence without rewriting old results.

Verification for implementation (not commands authorized to install by this plan):

1. Regenerate dependency JSON and confirm it agrees with Markdown/lock.
2. Run `node tests/skills/check-contracts.mjs`, relevant script tests, then `npm test`
   for an adoption branch; run strict fresh-install smokes in isolated repo/global scope.
3. Verify complete bundle hashes/references and reject symlink/special-file/ID collisions;
   preserve modified/unowned installations and prove missing capability handoff.
4. Record fresh native host/version/model, source revision, actual calls, outputs and
   artifacts for trigger/non-trigger/blocked paths and review/verify return. Include
   the affected behavioral cases and a golden run for upstream repins or contract changes,
   as required by `CONTRIBUTING.md`; label each run's scope rather than imply host parity.
5. Run `itp-review` and fresh `itp-verify`; distinguish static, manual and native evidence.

No merge, issue comment, commit, push or release follows automatically. After separately
authorized merge/release, refresh consuming installations with ownership checks and
restart sessions. Roll back through a reviewed revert of routing/pins and a verified
refresh; never delete arbitrary user-global copies.

## Approval boundary

All-nine scope and justified replacements are requested. Implementation remains staged,
not an unreviewed catalog-wide install. Confirm the first implementation slice and its
execution/network/Git-write boundaries before running candidates. Provider spending,
runtime expansion, license-sensitive adaptation and publishing remain separate decisions.

Final acceptance requires a nine-row evidence ledger: skill ID, upstream/adapted revision
and hash, owner/entry point, complete dependencies, native host/model, positive case,
non-trigger case, blocked-path case and review/verification return. All nine rows must
pass; blocked/deferred rows are unfinished work, not acceptable completion dispositions.
