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

Status: **Stage 1 framework validation, in progress**. Campaign 1 (routing, fresh-session
resume, user-entry recursion, runtime-install refusal, verification gate) passed; see
`tests/skills/results/`. Remaining gate items: broader routing and adapter isolation,
composition, recursion bounds, review routing, TDD loop termination, and the golden
end-to-end case. There is no runtime enforcement harness yet (`CUSTOM-HARNESS.md` is
deliberately not built until the readiness gate in `SKILL-FRAMEWORK.md` section 25 is met).

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
listed with status and provenance in `dependency.md` and `skills.lock.json`. They live
machine-global in `~/.agents/skills/`; the framework itself is installed per repo so each
project pins its version.

## Install

```sh
bash /path/to/I2P/install.sh /path/to/your/repo      # existing project
bash /path/to/I2P/install.sh --init ~/code/new-proj  # new project (creates dir + git init)
```

Re-run the same command to upgrade; the installer is idempotent.

| Option | Effect |
|---|---|
| `--init` | Create the target directory and `git init` if it does not exist |
| `--dry-run` | Print every action; change nothing |
| `--refresh-upstream` | Reinstall upstream skills that fail the lockfile hash check |
| `--strict` | Exit non-zero if any warning was reported (used by CI) |
| `--check-version` | Compare the framework version with the latest release, then exit |

What it does:

1. **Upstream skills** — installs each pinned skill into `~/.agents/skills/` once per
   machine, fetching missing ones at their locked commit into
   `~/.cache/idea-to-production/`, and verifies every content hash against
   `skills.lock.json`. Existing skills with mismatched content are left alone and warned
   about unless `--refresh-upstream` is passed.
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

Requirements: `git` (only to fetch missing upstream skills) and `node` (lockfile parsing,
hash checks, verification). No network is needed when the upstream skills are already
installed and verified. The installer never touches unrelated skills or files.

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

## Maintaining an install

- **Upgrade a repo:** re-run `install.sh` against it.
- **Repair a machine:** re-run with `--refresh-upstream`.
- **Upstream moved?** See "Updating the framework" below.
- **Adding or removing a specialist?** Update `dependency.md` status, the adapter's
  `conditional_children`, and the lockfile together; the checker enforces consistency.
- **Keep runs reproducible:** never edit `dependency.md` or `skills.lock.json` during a
  lifecycle run.

## Updating the framework

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

To cut a release, run the `Release` workflow with a version (semver: MAJOR = contract or
lifecycle change, MINOR = upstream re-pin or adaptation, PATCH = fix). It bumps `VERSION`,
tags `vX.Y.Z`, and publishes release notes with the pinned-commit table. Consumers upgrade by
pulling this repo and re-running `install.sh` against each installed project.

## Testing the framework itself

- Static: `node tests/skills/check-contracts.mjs [TARGET]` (defaults to this repo).
- Behavioral: cases in `tests/skills/{isolation,composition,recursion,failure,golden}/`
  run manually, one per fresh session, per `tests/skills/README.md`. Record outcomes in each
  case's `Result:` line. Model behavior is nondeterministic: treat these as regression
  signals, not proofs.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Skills missing from the session | Restart the session; confirm `.agents/skills/<name>/SKILL.md` or `~/.agents/skills/<name>/SKILL.md`; names must be unique across locations |
| Duplicate skill names | Remove or rename one copy (project vs global) |
| Installer warns a skill has different content | Something else owns that global skill; run `install.sh --refresh-upstream` to restore the locked version, or remove the local copy |
| Installer warns the content hash differs after fetching | The pin or cache is stale; delete `~/.cache/idea-to-production/` and re-run with `--refresh-upstream` |
| No network on a fresh machine | Pre-populate `~/.agents/skills/` from any verified copy, or use the manual install; the installer skips fetching when hashes already match |
| Adapter returns `needs-human` citing a missing skill | Install it from `skills.lock.json`; this is by design, not a bug |
| `itp-review` says the issue tracker is unconfigured | Run `setup-matt-pocock-skills` in the target repo once |
| `playwright-generate-test` / `webapp-testing` fail | They need Playwright MCP / a browser+Python environment; configure it or expect a `needs-human` handoff |
| Verification refuses to pass | That is the gate working: run the named checks, or route back to `itp-implement` |
