# Idea-to-Production

A composable **Agent Skills framework** that drives an engineering idea through a full
lifecycle:

```text
research -> align -> spec -> architecture -> slice -> implement -> review -> verify
```

Each phase is a thin `itp-*` adapter that loads approved upstream skills (`research`,
`tdd`, `code-review`, ...), passes artifacts forward, and stops for a human when a decision
or missing capability blocks it. The lifecycle is a router, not a waterfall: existing
artifacts let it skip phases.

| Document | Role |
|---|---|
| `SKILL-FRAMEWORK.md` | The specification (this repo implements it) |
| `dependency.md` | Authoritative registry: approved skills, invocation classes, statuses |
| `skills.lock.json` | Pinned upstream content (repo, commit, content hash) |
| `install.sh` | One-command installer for any project |
| `tests/skills/` | Behavioral validation cases + static contract check |

Status: **Stage 1 framework validation, complete**. Campaign 1 (routing, fresh-session
resume, user-entry recursion, runtime-install refusal, verification gate, review routing), the
standard golden, the small-tier golden (review -> implement -> re-review), and the greenfield
golden (same loop), and campaign 2 (tdd/domain-modeling isolation, spec -> design
composition, conditional recovery, conflict resolution, missing-skill handoff), campaign 3
(small-golden repeat, bug-fix routing, slice and implement isolation, slice -> implement
handoff) all passed, as did campaign 4 (review composition, ambiguous-requirement
handling, architecture and align isolation) and campaign 5 (full recovery loop,
repeat-failure stop), and campaign 6 (grilling question quality, artifact use,
domain-modeling trigger), and campaign 7 (spec-first routing, repeat-after-attempt bound);
see `tests/skills/results/`. The §25 human-run conditions were closed 2026-10-01
(standard repeat, greenfield repeat, full grilling interview, FAIL-07 both paths);
the bullet-by-bullet judgment is in
`tests/skills/results/2026-09-27-readiness-gate.md` with closure recorded in
`tests/skills/results/2026-10-01-readiness-gate-closed.md` (**GATE MET**).
There is no runtime enforcement harness yet
(`agent-work/plans/CUSTOM-HARNESS.md` is deliberately unbuilt; the harness build order is now open
per `SKILL-FRAMEWORK.md` sections 25 and 27).

## What is in the framework

| Skill | Role |
|---|---|
| `idea-to-production` | Root router; invoke this one explicitly |
| `itp-research` | External evidence with provenance |
| `itp-align` | Pressure-test high-impact decisions |
| `itp-spec` | Agent-readable spec + acceptance criteria |
| `itp-architecture` | Boundaries, interfaces, ADRs |
| `itp-slice` | Independently testable vertical slices |
| `itp-implement` | Test-first implementation loop |
| `itp-review` | Standards + spec review, specialist triggers |
| `itp-verify` | Fresh completion evidence (hard gate) |
| `itp-incident` | Failures/regressions with unknown cause |
| `verification-before-completion` | Vendored (obra/superpowers, MIT) |
| `web-design-guidelines` | Pinned local adapter over a vendored guidelines snapshot |

Upstream skills (Matt Pocock core, Trail of Bits, Vercel, Anthropic, awesome-copilot) are
listed with status and provenance in `dependency.md` and `skills.lock.json`. Install them
machine-global in `~/.agents/skills/` (shared) or repo-local in `.agents/skills/`
(self-contained); the framework itself is always installed per repo.

## Install

Once an **asset-bearing release** is published, install without cloning:

```sh
curl -fsSL https://github.com/ishansing/skills-framework/releases/latest/download/bootstrap.sh | bash
```

The menu selects an existing/new project, global/repo-local upstream skills, checkpoint
defaults, refresh and strict mode, then offers install, dry-run preview or cancellation.
The curl pipe reads answers from `/dev/tty`. An existing `.itp/run.md` is preserved;
otherwise `--checkpoints off|phase|slice` seeds the preference (`off` writes `false`).

For scripts, pass a target and flags; pin the bootstrap URL **and** archive version for
reproducibility (replace `X.Y.Z` with an asset-bearing release):

```sh
curl -fsSL https://github.com/ishansing/skills-framework/releases/download/vX.Y.Z/bootstrap.sh |
  bash -s -- --version X.Y.Z /path/to/repo --skills-scope repo --checkpoints phase --strict
```

`--version` overrides `$ITP_VERSION`; otherwise bootstrap resolves the latest release.
Older releases have no installation assets; these URLs will not work until the first
asset-bearing release ships. Bootstrap fails clearly rather than falling back to a source zip.
Downloads follow HTTPS redirects (including GitHub's asset CDN); SHA-256 checks detect
corruption, **not independent publisher authenticity**. There are no signatures. For
inspection, download `bootstrap.sh` first and run it with `--dry-run`; the pipe executes
the bootstrap immediately. `ITP_RELEASE_BASE_URL` overrides the HTTPS release origin for
controlled fixtures or mirrors; setting it trusts that origin and its checksums.

From an existing framework checkout or extracted release bundle:

```sh
bash /path/to/I2P/install.sh /path/to/your/repo      # existing project
bash /path/to/I2P/install.sh --init ~/code/new-proj  # new project (creates dir + git init)
bash /path/to/I2P/install.sh --menu                 # interactive choices
```

Re-run the same command to upgrade. The installer records managed hashes in
`.itp/install.json`; unexpected edits to managed registries or subagents stop the install.
Unchanged managed repo-local skills can upgrade automatically; conflicting shared global
skills always require explicit refresh. Review skill conflicts before using refresh.
Older installs without ownership records may require backing up conflicting files first.

| Option | Effect |
|---|---|
| `--menu` | Force the menu; accepts scripted answers on stdin |
| `--yes` | Skip final menu confirmation, retaining the option prompts |
| `--skills-scope global\|repo` | Choose upstream location (default global); ITP stays per-project |
| `--checkpoints off\|phase\|slice` | Seed a missing ledger; never overwrite an existing one |
| `--init` | Create the target directory and `git init` if it does not exist |
| `--dry-run` | Print every action; change nothing |
| `--refresh-upstream` | Reinstall upstream skills that fail the lockfile hash check |
| `--strict` | Exit non-zero if any warning was reported (used by CI) |
| `--check-version` | Compare the framework version with the latest release, then exit |

What it does:

1. **Upstream skills** — installs verified pinned bytes into the selected location.
   Release bundles include these bytes and need no client clones. A source checkout
   fetches missing bytes at the locked commit into `~/.cache/idea-to-production/`.
   Conflicts stop without overwriting unless explicitly refreshed. Repo-local registries
   use `installed-local`; global registries use `installed-global`. Switching repo to
   global removes only unchanged, recorded local copies after global copies are verified.
   Repo-local installs leave shared global copies alone; ensure your harness resolves
   duplicate names appropriately if both locations already contain a skill.
2. **Framework skills** — copies `.agents/skills/{idea-to-production,itp-*,verification-before-completion,web-design-guidelines}`
   into `<repo>/.agents/skills/`, plus `dependency.md` and `skills.lock.json` into the repo
   root.
3. **Subagent** — copies `adversarial-modeler` into `<repo>/.opencode/agents/` (used by
   `differential-review` for high-risk changes).
4. **AGENTS.md** — inserts the framework rules between
   `<!-- idea-to-production:begin/end -->` markers, creating the file if absent and
   replacing the block on re-run, so rules never duplicate.
5. **Verification** — runs the contract check against the installed copy and reports the
   result.

Requirements: Bash and **Node 20+**; bootstrap also requires curl, tar and `sha256sum` or
`shasum`. Git is needed for `--init` and for fetching missing upstream bytes from a
source checkout, not for installing an extracted release into an existing project.
Release bundles include the standalone contract verifier, but not behavioral suites or
workflows. After downloading, bundle installs work offline. Unrelated files and skills
are preserved; installation paths containing symlinks are rejected.

Afterwards:

1. Restart your agent session so the new skills are discovered.
2. Optional once per repo: run Matt's `setup-matt-pocock-skills`, which configures the
   issue tracker that `code-review` uses. Without it, `itp-review` hands off and asks for
   it.
3. Start a lifecycle:

   ```text
   Load the `idea-to-production` skill. Goal: <what you want built>.
   ```

### Manual install (offline / no script)

```sh
FS=/path/to/I2P
TARGET=/path/to/your/repo

mkdir -p "$TARGET/.agents/skills"
cp -r "$FS/.agents/skills/idea-to-production" "$FS"/.agents/skills/itp-* \
      "$FS/.agents/skills/verification-before-completion" \
      "$FS/.agents/skills/web-design-guidelines" "$TARGET/.agents/skills/"
cp "$FS/dependency.md" "$FS/skills.lock.json" "$TARGET/"
mkdir -p "$TARGET/.opencode/agents"
cp "$FS/.opencode/agents/adversarial-modeler.md" "$TARGET/.opencode/agents/"
```

Install upstream skills from `skills.lock.json` (each entry has `repo`, `commit`,
`path`): clone every repository, check out the pinned commit, and copy that `path` to
`~/.agents/skills/<id>/`. Append the rules block from `install.sh` (between the
`idea-to-production` markers) to the target `AGENTS.md`.

## Running the lifecycle

Invoke the root explicitly; it is not selected automatically.

| Situation | What to prompt | Expected route |
|---|---|---|
| New feature from scratch | "Load `idea-to-production`. Goal: add collaborator invitations." | research -> align -> spec -> architecture -> slice -> implement -> review -> verify |
| Bug with a clear repro | "Load `itp-implement`. Fix this failing auth test (repro: ...)." | implement -> diagnosing-bugs -> tdd -> review |
| Unknown production failure | "Load `itp-incident`. Invitations are sent twice, cause unknown." | incident -> diagnosing-bugs -> implement |
| Review only | "Load `itp-review`. Review this branch since `main`." | review -> code-review (+ specialists) |
| Research only | "Load `itp-research`. Does the API support webhooks?" | research, then stops |

During a run, expect:

- artifacts written to `docs/product/`, `docs/architecture/` (with `ADR/`),
  `docs/work/` (`ISSUE-<n>.md`, `review.md`, `verification.md`), and the ledger
  `.itp/run.md`;
- a structured `skill_result` per phase (status, artifacts, findings,
  `recommended_next`) - see `.agents/skills/idea-to-production/references/artifacts.md`;
- `needs-human` handoffs with options and a `resume_with` point when a decision, user-entry
  workflow, or missing skill blocks progress;
- no completion claim until `itp-verify` has run commands in that session.

Approve the skill-load prompts your runtime shows. To steer, answer the adapter's
questions; do not re-implement an adapter's procedure by hand.

### Checkpoints

By default the lifecycle advances phase to phase automatically. To review progress after each
phase, ask for checkpoints:

```text
Use checkpoint mode: stop after each phase and tell me what's implemented and what's next.
```

The root records `checkpoints: true` in `.itp/run.md` and stops at every phase boundary with a
report:

- the phase completed and the run's scale;
- what exists now - artifacts written or updated, and code and tests changed;
- phases skipped or completed as no-ops, with the reason;
- documentation-impact status and any recorded waivers;
- open questions and unresolved findings;
- the next phase and what it will do;
- the resume point (`next_phase`).

`checkpoints` accepts `false`, `phase` (one stop per phase boundary), or `slice` (also one stop
after each implementation slice, only when its tests are green). Ask to "stop after each slice"
for the latter - recommended for large or greenfield work, never automatic.

While paused the ledger shows `awaiting: user`. If a phase also needs a human decision, you get
one merged report - the handoff takes precedence and includes the checkpoint summary. At a
checkpoint you can say `continue`, describe changes you want (what and where), or `turn
checkpoints off`. Requested changes route back to the phase that owns the artifact, which re-runs
with your feedback (at most twice per phase); the ledger records the amendment and the run stays
paused until you say continue. Because checkpoint state lives in the ledger, it survives session
restarts - a fresh session can continue from the same stop.

### Documentation

Every slice declares its **documentation impact** - which user-facing docs change (README, API
docs, usage guide, examples, changelog), or `none` for invisible changes. `itp-implement` makes
those updates with the code, `itp-review` checks the declaration against the diff, and
`itp-verify` counts them as evidence. Docs follow your project's existing layout; if there are
none, the minimum is a README usage section.

## Right-sizing

The root classifies each run once and records `scale` in `.itp/run.md`; when unsure it uses
`standard`:

| Scale | Use | Effect |
|---|---|---|
| `small` | one module, no new interface or boundary, no security/data/destructive/migration surface, clear requirements | align only if a decision is open (no interview otherwise), one-page spec with acceptance criteria in the ISSUE, no architecture unless a boundary moves, code-review only, verification scoped to those criteria |
| `standard` | default; multi-module or new interface, some ambiguity | full lifecycle and artifact set |
| `full` | cross-cutting, security-critical, migrations, domain ambiguity | standard plus every applicable specialist |

Review and verify always run. A security or migration surface upgrades a small run to standard
automatically; scale can rise mid-run but never drops without a recorded reason.

## Maintaining an install

- **Upgrade a repo:** re-run `install.sh` against it.
- **Repair a machine:** re-run with `--refresh-upstream`.
- **Upstream moved?** See "Updating the framework" below.
- **Adding or removing a specialist?** Update `dependency.md` status, the adapter's
  `conditional_children`, and the lockfile together; the checker enforces consistency.
- **Keep runs reproducible:** never edit `dependency.md` or `skills.lock.json` during a
  lifecycle run.

## Updating the framework

### Matt v1.3 compatibility

The current lockfile targets the reviewed v1.3.0 release for existing Matt dependencies.
The retired `resolving-merge-conflicts` skill is no longer installed or invoked by this
framework; `itp-implement` resolves conflicts directly by spec and change intent.
An older global copy may remain on your machine: the installer does not delete skills
it no longer owns.

Domain glossaries now use `GLOSSARY.md` / `GLOSSARY-MAP.md`. When upgrading a project,
rename an existing domain glossary and update its links and agent-doc pointers. Check
the contents first: a `CONTEXT.md` containing a session handoff or implementation notes
is not a domain glossary and should not be renamed automatically. Historical framework
results retain the filenames used in their original runs.

Three new capabilities are pinned and installed with the framework:

- `pr` formats a PR body after verification passes, when requested or authorized by the
  delivery workflow. It does not grant permission to publish, merge, or deploy.
- `implement-spec` is a user-invoked parallel alternative for an approved spec with a
  ticket dependency graph. The root hands off rather than calling it recursively; its
  integration branch returns through framework review and fresh verification.
- `retro` is a user-invoked session retrospective focused on the agent environment.
  It is optional, outside the completion gate.

Sequential implementation remains the default. Changed behavioral contracts require
targeted revalidation; prior §25 results describe the previous baseline. Use the regular
maintenance installer to materialize new pins, then restart the agent session for discovery.

Installed projects record the framework version at
`.agents/skills/idea-to-production/VERSION`. To check whether this framework checkout is
behind:

```sh
bash install.sh --check-version
```

Upstream pins are checked automatically on the first of each month by
`.github/workflows/upstream-check.yml` (also runnable via `workflow_dispatch`):

- clean updates are re-pinned on the `automation/upstream` branch, verified (contract check +
  fresh install with hash verification), and proposed as a PR with a validation checklist;
- renamed, deleted, or history-rewritten pins open an `upstream-drift` issue instead;
- nothing is auto-merged.

Locally:

```sh
node scripts/check-upstream.mjs      # report: current / updated / drift (exit 3 when not all current)
node scripts/repin.mjs --all         # re-pin clean updates; refuses renames, writes skills.lock.json
bash install.sh --refresh-upstream   # materialize the new pins on this machine
```

### Periodic skill stocktake

Audit installed skills on a cadence (monthly with the upstream check, or before each
release), Quick Scan vs Full:

- Quick Scan (changed skills only): `node tests/skills/check-contracts.mjs` enforces the
  150-line SKILL.md budget; trim or split anything over budget before merge.
- Full (all skills): a size report via `wc -l .agents/skills/*/SKILL.md`, plus a review of
  `dependency.md` triggers for stale or overlapping entries. Scanned paths, stated up front:
  `~/.agents/skills/` (global) and `.agents/skills/` (project).

To cut a release, run the `Release` workflow with a version (semver: MAJOR = contract or
lifecycle change, MINOR = upstream re-pin or adaptation, PATCH = fix). It opens a
`release/x.y.z` pull request with the `VERSION` bump, waits for CI, merges, tags `vX.Y.Z`,
and publishes release notes with the pinned-commit table. Never tag or release manually.
Consumers upgrade by pulling this repo and re-running `install.sh` against each installed
project.

## Testing the framework itself

Install the script parsers first with `npm ci --ignore-scripts`. Run `npm test` for the
script regression suite. The skill installer itself remains independent of npm packages.

- Static: `node tests/skills/check-contracts.mjs [TARGET]` (defaults to this repo).
- Behavioral: cases in `tests/skills/{isolation,composition,recursion,failure,golden}/`
  run manually, one per fresh session, per `tests/skills/README.md`. Record outcomes in each
  case's `Result:` line. Model behavior is nondeterministic: treat these as regression
  signals, not proofs.

## Skill Watch

Skill Watch is maintenance/discovery automation, separate from the lifecycle and monthly
re-pin workflow. It monitors approved upstream repositories and samples four discovery
sources (AwesomeSkill API, Skills.sh trending, SkillsMP public search, VoltAgent catalog),
verifying candidates against primary `SKILL.md` files. It never installs or invokes a
discovered skill. Design, source coverage, limits, and rollout: `agent-work/plans/SKILL-WATCH-PLAN.md`.

```sh
npm ci --ignore-scripts
node scripts/skill-watch.mjs --dry-run
```

Dry runs write reports under `.skill-watch/` (gitignored) and change nothing remotely.
Human candidate dispositions use human-readable keys (`owner/repo:path`, or
`lead:owner/repo:name` for unverified leads); see the plan for the full contract.
Publication is opt-in (`publication.enabled: false` by default) and persists state only
after successful issue updates — enable it solely through the reviewed rollout proof.

## Adoption preview (integration milestone 1)

Agent-facing plans/context/prompts are indexed in `agent-work/INDEX.md`; the integration
plan is `agent-work/plans/SKILL-INTEGRATION-PLAN.md`. The maintenance CLI prepares inspection
data, not approval or installation:

```sh
node scripts/adopt-skill.mjs --help
node scripts/adopt-skill.mjs --state .skill-watch/next-state.json \
  --candidate '<repository-id>:<directory>/SKILL.md'
```

Default output is gitignored `agent-work/previews/<id>-<commit-prefix>/`, containing
`preview.md` and `manifest.json`. Existing artifacts are not overwritten; use a fresh
`--output DIR` for another preview. An optional `--proposal JSON` supplies capability,
role (`primary`, `specialist`, `user-entry`), owning adapter, triggers, required child IDs,
and dependency/license review acknowledgments. Those are user-provided inputs, not proof
of approval; absent policy stays unresolved. Root-level bundles require a packaging review.

```sh
node scripts/adopt-skill.mjs --state .skill-watch/next-state.json \
  --candidate '<repository-id>:<directory>/SKILL.md' --proposal proposal.json \
  --check-preview <manifest.json> --expected-binding <reviewed-binding>
```

Revalidation needs the original snapshot/proposal and unchanged source/framework inputs.
The reviewed digest detects stale or edited previews; it is not a signature or authorization
to adopt. The CLI reads public GitHub metadata and committed source data with a dedicated
inspection cache (`--cache DIR` can override it), rejecting cache edits/extra files, local
Git filters, symlinks and unsafe bundle paths. Source scripts/hooks are not executed;
registry, pins, adapters and global skill installations are untouched.

Full-directory lock hashing uses the existing method, not the watchlist's individual-file
hash. Reference scanning covers inline Markdown file links only; manual bundle/dependency
and packaging review remains necessary. Native skill validation and real adoption are
later milestones, with separate execution isolation and authorization.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Skills missing from the session | Restart the session; confirm `.agents/skills/<name>/SKILL.md` or `~/.agents/skills/<name>/SKILL.md`; names must be unique across locations |
| Duplicate skill names | Remove or rename one copy (project vs global) |
| Archive checksum mismatch | Installation aborted before extraction; discard the download and retry from a trusted release origin |
| Version not found / release has no install assets | Choose an asset-bearing release; older releases contain notes only |
| Installer reports different managed content | Back up and review edits; skill refresh is explicit, while registry/subagent conflicts require resolving the file first |
| Installer warns the content hash differs after fetching | The pin or cache is stale; delete `~/.cache/idea-to-production/` and re-run with `--refresh-upstream` |
| No network on a fresh machine | Transfer a verified release bundle and run its `install.sh` offline, or use the manual install |
| Adapter returns `needs-human` citing a missing skill | Install it from `skills.lock.json`; this is by design, not a bug |
| `itp-review` says the issue tracker is unconfigured | Run `setup-matt-pocock-skills` in the target repo once |
| `playwright-generate-test` / `webapp-testing` fail | They need Playwright MCP / a browser+Python environment; configure it or expect a `needs-human` handoff |
| Verification refuses to pass | That is the gate working: run the named checks, or route back to `itp-implement` |
| Validation session slow or skill output garbled | Output-compressing plugins (for example caveman) can mangle `skill`/`task` tool results; exclude those tools from compression or disable the plugin during lifecycle runs |
