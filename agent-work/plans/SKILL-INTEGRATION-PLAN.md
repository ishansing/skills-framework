# Discovered Skill → ITP Integration Plan

Status: preview milestone in implementation; adoption/installation remains proposed.
Scope is **integration into the Idea-to-Production
framework**, including installation as an approved dependency. This is separate from
Skill Watch collection and from Loom runtime enforcement.

## 1. Outcome and ownership

```text
Skill Watch candidate
  -> evaluate capability fit and exact source
  -> explicitly approve an adoption proposal
  -> integrate registry + pins + adapter/handoff + cases on a feature branch
  -> install in isolation and validate through a fresh agent session
  -> review + fresh itp-verify + green CI
  -> merge, refresh consuming projects, record adopted disposition
```

Skill Watch owns discovery/provenance, not approval. `dependency.md` owns approved
capabilities, IDs, invocation classes, statuses and triggers. `skills.lock.json` owns
exact upstream revisions and full-directory hashes; `dependency.json` is generated.
Adapters own routing and handoffs. `install.sh` owns materializing approved content.

Keep this an explicit maintenance operation. An ordinary ITP run cannot install,
upgrade, discover substitutes, or change its approved registry mid-run.

## 2. Candidate selection and evaluation

Select one candidate from a JSON report/state snapshot using its verified identity,
repository, exact `SKILL.md` path and observed revision. Unverified or ambiguous leads
must be resolved before installation preparation. Never select solely by display name,
repository stars, or a changing marketplace rank.

Record one short adoption proposal under `docs/work/ISSUE-<skill-id>-adoption.md`:

- candidate/source links and exact revision;
- capability gap and overlap with existing approved skills;
- intended owning adapter or user-entry handoff;
- invocation class, actual child-skill dependencies and required runtime tools;
- license, bundled references/scripts and OpenCode compatibility;
- positive trigger, non-trigger, expected artifacts/results and blocked-path behavior;
- whether this is an addition, specialist, or replacement, with acceptance cases.

Inspect the whole bundle, including references and runtime metadata, as untrusted data.
Watch metadata is only a lead: it does not establish licensing, safety, compatibility,
transitive dependency completeness, or integration quality. Prefer the existing approved
primary process and Matt skills where appropriate. Reject/defer duplicates without adding
another orchestration layer.

Keep disposition `evaluating` until acceptance is established. Rejection/defer records
retain reasons; a new popularity signal is not an adoption decision.

## 3. Integration route

| Candidate role | Registry / routing changes | Required proof |
|---|---|---|
| Primary model-invoked process | Map the capability and update its owning adapter's required child only after explicit approval | Phase isolates correctly; existing composition and failure behavior retained |
| Conditional specialist | Register capability plus a precise trigger; add conditional child to the appropriate adapter | Trigger fires when warranted, does not fire for unrelated work, missing capability hands off |
| User-entry workflow | Register user invocation class and user-entry list; document a root/user handoff | No recursive invocation; explicit user invocation works; returned work resumes at appropriate review/verify gates |
| Replacement | Explicitly migrate capability ownership, all callers and active fixtures; retire the old dependency when safe | Required behavior retained; old entry no longer required; upgrade/rollback steps and evidence recorded |

Do not promote a user-only skill to model-invoked merely to fit an adapter. Resolve
conflicting invocation metadata conservatively before approval. Do not silently add a
second primary process for the same capability. Create a new adapter only if a genuinely
new lifecycle phase is approved; most integrations extend an existing adapter.

## 4. Minimal tooling: adoption preview, not another installer

Milestone command: `scripts/adopt-skill.mjs`, preview-only. Reuse existing functions
rather than introduce a
parallel installation or registry format.

```sh
# Preview only; it never approves, installs or applies registry changes.
node scripts/adopt-skill.mjs --state <watch-next-state.json> \
  --candidate '<repository-id>:<SKILL.md-path>' --output <preview-directory>
```

The preview command should:

1. Resolve the selected record and require an explicit exact revision, or ask for a
   deliberately selected replacement revision. Verify record/source identity afresh.
2. Validate repository, commit and relative bundle path before passing them to
   `fetchSkill()`; constrain filesystem resolution to the fetched tree.
3. Fetch using `scripts/fetch-skill.mjs`, inspect the candidate directory and confirm
   declared skill name/invocation against the proposal. Do not execute bundle scripts.
4. Reject symlinked candidate paths/files for v1: the current `dirHash()` method hashes
   regular files and ignores symlinks, so allowing them would overstate bundle coverage.
5. Use `dirHash()` from `scripts/skill-hash.mjs` for the complete skill directory.
   The watchlist's `SKILL.md` hash is not the lockfile's directory hash. Reject unresolved
   external reference files or document a reviewed packaging adaptation before proceeding.
6. Produce an adoption preview: exact source/ID/path/revision/hash, invocation class,
   proposed `dependency.md` inventory row, proposed lock entry and unresolved inputs.

The preview must match the committed tree, not merely a cached HEAD: reject tracked edits,
extra/ignored bundle files, special files and symlinks. Fetch/cache Git processes use an
isolated inspection configuration without checkout hooks, smudge filters or credentials.
Bind the preview to its candidate record, proposal, framework HEAD, registry/lock and
relevant routing bytes. `--check-preview <manifest.json>` recomputes that binding; changed
inputs require another review. A matching binding is not itself human approval.

First-milestone fetch/inspection does not execute skill instructions. Later native
validation must restrict filesystem/network/credential exposure or explicitly record the
trusted-source assumptions; a disposable directory/isolated HOME is not a security sandbox.

Default effects are limited to fetch/cache and preview output. No global installation,
registry edit, adapter invocation, git commit/push, issue creation, or PR publication.
The command must not invent capability policy or owning adapters. Explicit dependencies
missing from the approved inventory block the proposal; each new dependency needs its
own approval and pin, not recursive auto-installation.

Existing re-pin tooling remains for updates to known entries; it should not be used to
silently add an unknown skill or replace an existing skill ID.

## 5. Build one coherent adoption branch

After the user approves the proposal, create `integration/skill-<id>` from current
framework mainline. Implement the selected route using framework adapters and
`writing-for-agents` for skill/agent-doc edits.

Same adoption diff contains:

- `dependency.md`: capability, inventory, invocation/status, owning adapter, trigger or
  user-entry handoff; use the existing status vocabulary;
- `skills.lock.json`: exact repository/commit/directory path/hash/invocation, and vendored
  metadata only if the approved packaging strategy requires it;
- generated `dependency.json`;
- adapter contract/procedure or user-entry routing pointers where needed;
- active behavior cases plus dated evidence; user-facing install/migration guidance.

Keep upstream content pinned and unchanged by default. A necessary local adaptation must
be explicitly documented, tested, and represented consistently in the lock/install model.
Historical results are retained, not rewritten as if the new dependency passed them.

The preparation tool's first implementation generates preview rows/entries only. Applying
registry/routing policy stays a reviewed engineering change; automatic Markdown mutation
and adapter rewriting are not needed for the first milestone.

## 6. Isolated installation and integration validation

The user authorizes candidate evaluation as maintenance before its instructions execute.
Use a disposable project and isolated `HOME`/cache where appropriate with the existing
installer against the proposed adoption checkout. Do not overwrite unrelated global
skills, install undeclared tools, or treat physical installation as integration approval.

Acceptance cases must cover:

- installer materializes the exact bundle/hash and references;
- the skill is discoverable in a fresh OpenCode session with recorded native calls;
- required child selection, correct result/artifact shape and resume routing;
- one genuine positive trigger and one meaningful non-trigger;
- missing child/tool capability produces a named handoff, not substitution or fake proof;
- user-entry skills never load recursively;
- replacements preserve behavior and remove obsolete active requirements;
- relevant existing phase/composition/golden cases remain valid for the changed scope.

Run registry generation, `node tests/skills/check-contracts.mjs`, the script suite,
strict fresh-install smoke and relevant behavioral cases. Static/hash checks do not
substitute for behavior. Run `itp-review` with triggered specialists and `itp-verify`
with fresh evidence before claiming acceptance. PR CI must be green before merge.

## 7. Adoption and deployment close-out

Only after the adoption PR is reviewed, verified and merged does the candidate become
an approved framework dependency. Mark it `adopted` with proposal/PR/evidence pointers
and the approved source revision; do not use that label merely to hide an unevaluated
candidate from the digest.

Consuming projects pull the approved framework revision and run:

```sh
bash install.sh --refresh-upstream --strict
```

Restart their agent sessions for discovery. Integration approval does not mean every
machine is refreshed; record the installation/native validation environment separately.
Apply the repository's release/version policy for contract or routing changes.

Rollback uses a reviewed revert of capability/routing and pins, followed by installer
refresh and fresh validation. Do not edit/delete arbitrary user-global skill folders;
an obsolete global copy can remain while the framework stops approving/invoking it.

## 8. Implementation milestones and acceptance

1. **Preview vertical slice:** one explicitly selected candidate, exact source validation,
   fetch/hash reuse, preview artifacts, collision/dependency/containment checks. No writes
   to the approved registry or user globals. Confirm test seams before implementation.
2. **First real adoption:** select an actual capability gap, obtain proposal approval,
   make registry/pin/routing changes on its branch, install in isolation and run native cases.
3. **Merge and watchlist close-out:** green CI and review, merged adoption/evidence links,
   disposition update, approved installer refresh/native-discovery proof.

Final acceptance: a selected skill is not merely available in OpenCode; ITP uses it through
the approved capability/adapter or user handoff, on its documented trigger, with bounded
dependencies and fresh validation. An unapproved candidate never enters an ordinary run.

No autonomous adoption, new installer, database, dashboard, or automatic installation
workflow is part of this plan. Skill Watch rollout and Loom implementation remain separate.
