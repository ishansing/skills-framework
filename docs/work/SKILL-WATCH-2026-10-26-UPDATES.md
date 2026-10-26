# Skill Watch — approved-skill updates, 2026-10-26

## Scope and provenance

Read-only source review of the eight approved updates in [issue #9](https://github.com/ishansing/skills-framework/issues/9), using `/tmp/opencode/skill-watch-issue-latest.json`, `dependency.md`, and `skills.lock.json`. No installation, integration, repinning, registry/TODO edit, candidate-skill invocation, or remote mutation was performed. New candidates are outside this report.

Issue `updatedAt`: **2026-10-26T12:24:39Z**; body observation: **2026-10-26T12:23:23.716Z**. Its source-health entries still report last successful inventory **2026-10-24T10:25:21.153Z**. An October 26 run/issue timestamp does **not** establish October 26 inventory freshness. Backlog and bounded-history caveats also apply. The issue's actionable `code-review` alerts point to **github/awesome-copilot**, not the approved **mattpocock/skills** skill: names alone do not establish identity.

Reviewed immutable endpoints:

| Repository | Locked baseline | Reviewed endpoint |
|---|---|---|
| mattpocock/skills | `984a2c023c9fb42bb6ea40c70a652284a109dc05` | `5beb35b040e3de97e54fa9e386d7e42d15c295c2` (requested endpoint; commit October 19) |
| trailofbits/skills | `027bc47a69a276c340717bafdc3708263094b9a4` | `196a9073ab10d35bacf111f945e02c00b2c6883a` (HEAD resolved during this review; commit October 23) |
| vercel-labs/web-interface-guidelines | `e3d624baaf29dc1fc645aff3e38f03e564d2d6b1` | `434b7f91364665f2f733b310ec54809bf8f37937` (HEAD resolved during this review; commit October 5) |

Complete, non-truncated GitHub trees and every blob in each exact old/new skill directory were fetched with read-only GitHub API requests into `/tmp/opencode/skill-watch-updates/`. All **seven old upstream skill directories match their lock hashes** using repository `dirHash` (including its locale-based path ordering). The eighth is a local adapter: its vendored `command.md` is byte-identical to upstream at the locked commit. The adapter's directory hash is not the hash of upstream `command.md` alone.

## Priorities and recommendations

### 1. Gate `code-review` on harness scheduling compatibility

[Exact source comparison](https://github.com/mattpocock/skills/compare/984a2c023c9fb42bb6ea40c70a652284a109dc05...5beb35b040e3de97e54fa9e386d7e42d15c295c2) — [new SKILL.md](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/code-review/SKILL.md#L56-L60).

- Both Standards and Spec agents were **already parallel**. New text requires issuing both calls **together, in the foreground**, then aggregating their returned reports. Background/fire-and-forget agents, sequential foreground calls, or aggregation before both reports arrive do not satisfy it. “Foreground” is not a request to remove concurrency.
- Standards discovery now explicitly searches for **every** standards document and requires `CODING_STANDARDS.md` / `CONTRIBUTING.md` when present.
- Tracker wording no longer hardcodes `docs/agents/issue-tracker.md`; it refers to the supplied tracker doc. This repo supplies that document, so no tracker migration is implied. Missing tracker still leads to the setup recommendation; `itp-review` must preserve its `needs-human` handoff, not run setup/install automatically.
- **Recommendation:** retain pin pending a harness-specific demonstration that two review calls can be dispatched together, awaited, and aggregated independently. Check standards enumeration and tracker handoff too. `.agents/skills/itp-review/SKILL.md` consumes this behavior directly. No scheduling behavior was exercised here.
- Directory scope: only `SKILL.md` changed; import metadata unchanged.

### 2. Review `wizard` as a credential-writing implementation change

[New template](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/wizard/template.sh#L92-L151); [stage wrapper](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/wizard/template.sh#L194-L223).

Only `template.sh` changed; `SKILL.md` and import metadata are identical. Actual behavior:

- `_clear` falls back when `tput clear` fails; browser-open failure now reaches the visible warning even when no opener exists. Unused `RED` removed.
- `ask` gains Readline editing and prompt color delimiters. Both input helpers now return failure on empty EOF instead of silently accepting empty/current input; with ordinary `set -e` stage calls this stops the wizard. A partial non-empty EOF input remains accepted.
- `_existing` decodes template-written single quotes and simple double quotes; it refuses double-quoted values containing escapes, `$`, or embedded quotes and asks again instead.
- `write_env` now writes shell-style `KEY='VALUE'`, escaping apostrophes, and assigns the shell variable. It creates new files mode 0600, preserves an existing mode, and writes through symlinks instead of replacing the symlink with `mv`.
- Stages move inside `run_wizard`, ending with `run_wizard "$@"; exit`, so stage syntax is parsed before prompting and mid-run edits cannot replace later stage text.

**Recommendation:** hold pending focused acceptance checks for the actual dotenv consumer (shell apostrophe escaping is not universally dotenv-compatible), EOF, permissions, symlink destination, and reruns. Existing permissive modes are preserved, not tightened. The new `cat "$tmp" > "$ENV_FILE"` is a **non-atomic truncate-and-rewrite**: interruption/write failure can leave partial data, and symlink targets are modified deliberately. Neither version provides concurrent-writer protection. These are source-derived risks, not observed failures. `itp-incident` must still hand off production-changing/destructive remediation to humans. Do not silently regenerate existing user wizards.

### 3. Small process improvements: suitable for a separately authorized selective update

All three change **only `SKILL.md`**; their remaining files/references/import metadata are byte-identical.

| Skill | Actual change | Compatibility / recommendation |
|---|---|---|
| [grilling](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/productivity/grilling/SKILL.md#L21-L25) | Word each question so “yes” accepts the recommended answer. | Low integration risk; preserve neutral alternatives and genuine user decisions. Existing fact-finding delegation/frontier behavior did not change. |
| [tdd](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/tdd/SKILL.md#L21-L27) | Add a one-line catches/misses explanation for each proposed test seam. | Useful coverage transparency for `itp-implement`; user confirmation of seams was already mandatory, not a new approval gate. `codebase-design` reference unchanged. |
| [diagnosing-bugs](https://github.com/mattpocock/skills/blob/5beb35b040e3de97e54fa9e386d7e42d15c295c2/skills/engineering/diagnosing-bugs/SKILL.md#L122-L130) | If forcing red by mutation, diff against a pristine copy to prove the mutation landed before trusting red. | Strong evidence improvement for `itp-implement` / `itp-incident`. Preserve user changes when capturing/restoring the baseline; this does not authorize resetting the worktree. No requirement to mutate every test. |

### 4. Trail of Bits: metadata-only, not stronger security analysis

[Repository comparison](https://github.com/trailofbits/skills/compare/027bc47a69a276c340717bafdc3708263094b9a4...196a9073ab10d35bacf111f945e02c00b2c6883a).

- [differential-review `agents/openai.yaml`](https://github.com/trailofbits/skills/blob/196a9073ab10d35bacf111f945e02c00b2c6883a/plugins/differential-review/skills/differential-review/agents/openai.yaml): adds `display_name: "Differential Review"` and `short_description: "Review code changes for security regressions and impact"`.
- [agentic-actions-auditor `agents/openai.yaml`](https://github.com/trailofbits/skills/blob/196a9073ab10d35bacf111f945e02c00b2c6883a/plugins/agentic-actions-auditor/skills/agentic-actions-auditor/agents/openai.yaml): adds `display_name: "Agentic Actions Auditor"` and `short_description: "Audit AI agent integrations in GitHub Actions"`.
- Everything else in the exact directories is identical: **7 files** for differential review (including methodology, adversarial guidance, patterns, reporting, asset) and **15 files** for actions auditor (including all 12 references and asset). No scripts added, removed, or changed.
- The separately referenced [adversarial-modeler source](https://github.com/trailofbits/skills/blob/196a9073ab10d35bacf111f945e02c00b2c6883a/plugins/differential-review/agents/adversarial-modeler.md) is also byte-identical old/new. This does not certify the locally converted OpenCode agent; the existing required runtime adaptation in `dependency.md` remains necessary.
- **Recommendation:** defer unless ChatGPT import metadata matters. These changes warrant no claim of improved detection or a security fix; avoid repinning unrelated upstream changes merely because HEAD advanced.

### 5. `web-design-guidelines`: one conditional desktop rule

[Exact command.md comparison](https://github.com/vercel-labs/web-interface-guidelines/compare/e3d624baaf29dc1fc645aff3e38f03e564d2d6b1...434b7f91364665f2f733b310ec54809bf8f37937); [new rule](https://github.com/vercel-labs/web-interface-guidelines/blob/434b7f91364665f2f733b310ec54809bf8f37937/command.md#L107).

The sole change is page rubber-band suppression: `overscroll-behavior: none` on `<html>` within `@media (pointer: fine)`, retaining coarse-pointer defaults for pull-to-refresh. The source explicitly calls for hybrid-device testing because `pointer` describes the **primary** input and `none` also disables scroll chaining/native swipe navigation.

**Recommendation:** optionally refresh the vendored snapshot in a separately authorized change; preserve the local pinned adapter rather than replacing it with a fetch-from-`main` skill. Treat the new rule as conditional UX guidance, not a universal CSS fix or a reason to rewrite app styles during this review.

## Evidence limits / proposed next step

Evidence is complete directory/blob comparison at the listed immutable commits, lock-hash verification, vendored-source equality, and static reading of consuming adapters. It is **not** runtime certification: no evaluated upstream skill execution, generated wizard execution, harness/subagent scheduling test, browser/device test, or application dotenv test was run. No adapter or dependency map changed, so the adapter contract checker was not required for this documentation-only review.

Keep current pins. If updates are authorized later, separate low-risk process wording from `code-review` scheduling and `wizard` credential/file semantics; verify each affected behavior before accepting new hashes. A repository HEAD is an evidence endpoint, not an automatic repin recommendation.
