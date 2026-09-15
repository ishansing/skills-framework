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
| `tests/skills/` | Behavioral validation cases + static contract check |

Status: **Stage 1 framework validation**. There is no runtime enforcement harness yet
(`CUSTOM-HARNESS.md` is deliberately not built until the readiness gate in
`SKILL-FRAMEWORK.md` section 25 is met).

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
listed with status and provenance in `dependency.md` and `skills.lock.json`.

## Requirements

- An Agent-Skills-compatible runtime with on-demand skill loading (validated on
  **OpenCode**; see `SKILL-FRAMEWORK.md` section 3.4 for porting checks).
- Upstream skills installed **before** a run. A running skill never installs, upgrades, or
  substitutes dependencies; a missing one produces a `needs-human` handoff instead.
- Git, and the target project's own test/build tooling.

## Use it in a real repository

### 1. Copy the framework into the target repo

```sh
FS=/path/to/I2P            # this framework repo
TARGET=/path/to/your/repo

mkdir -p "$TARGET/.agents/skills"
cp -r "$FS/.agents/skills/idea-to-production"      "$TARGET/.agents/skills/"
cp -r "$FS"/.agents/skills/itp-*                   "$TARGET/.agents/skills/"
cp -r "$FS/.agents/skills/verification-before-completion" "$TARGET/.agents/skills/"
cp -r "$FS/.agents/skills/web-design-guidelines"   "$TARGET/.agents/skills/"
cp "$FS/dependency.md" "$FS/skills.lock.json"      "$TARGET/"
```

`web-design-guidelines` reads `command.md` from its own directory and
`verification-before-completion` is vendored, so both travel with the copy. Keep them
project-local if you want the framework versioned with the repo.

Prefer one global install for every repo instead? Copy those same four entries into
`~/.agents/skills/` once and skip the per-repo skill copies. You still copy `dependency.md`
and `skills.lock.json` into each target repo (the root reads them from the repo root).

OpenCode discovers project skills from `.agents/skills/<name>/SKILL.md` (also
`.opencode/skills/` and `.claude/skills/`). Restart the session after copying.

### 2. Make the upstream dependencies discoverable

On this machine they are already installed in `~/.agents/skills/`. On a new machine,
install each skill from `skills.lock.json` (never `latest`):

```sh
# example: install one skill at its locked commit
git clone https://github.com/mattpocock/skills /tmp/matt-skills
git -C /tmp/matt-skills checkout 959a8e9f1edc3adbe2f7e3054bb6fbefa6696260
cp -r /tmp/matt-skills/skills/engineering/tdd ~/.agents/skills/tdd
```

Each lock entry has `repo`, `commit`, and `path`; copy that `path` to
`<skills-root>/<id>/`. Sources: `mattpocock/skills`, `anthropics/skills`,
`trailofbits/skills`, `vercel-labs/agent-skills`, `github/awesome-copilot`,
`obra/superpowers` (vendored, already in step 1), and
`vercel-labs/web-interface-guidelines` (vendored, already in step 1).

For `differential-review`'s high-risk phase, also install the subagent (project-local
`.opencode/agents/` or global `~/.config/opencode/agents/`):

```sh
mkdir -p "$TARGET/.opencode/agents"
cp ~/.config/opencode/agents/adversarial-modeler.md "$TARGET/.opencode/agents/"
```

### 3. Add the framework rules to the target repo's `AGENTS.md`

```markdown
- The lifecycle root is `idea-to-production`. Invoke it explicitly; it is not auto-invoked.
- Use framework adapters (`itp-*`) rather than reproducing their procedures manually.
- Use only pre-installed skills listed in `dependency.md` / `skills.lock.json`.
- Do not install, upgrade, search for, or substitute skills during a run.
- Prefer Matt Pocock skills for primary engineering process.
- Add specialist skills only when their documented trigger applies.
- Never recursively invoke skills classified as user entry points.
- If the same failure recurs without new evidence, stop and ask the user.
- Do not claim completion until `itp-verify` runs with fresh evidence.
```

### 4. One-time target-repo setup

Run Matt's `setup-matt-pocock-skills` in the target repo once (user-entry, invoke
explicitly). It configures the issue tracker that `code-review` uses. Without it,
`itp-review` hands off to `needs-human` and tells you to run it.

### 5. Verify the install

- Start a new session in the target repo and ask the agent to list its available skills:
  you should see `idea-to-production`, the nine `itp-*` adapters, and
  `verification-before-completion`.
- From the framework repo (or the copy), run the static graph check:

  ```sh
  node tests/skills/check-contracts.mjs
  ```

  It verifies every child skill ID resolves in `dependency.md`, required children are
  pinned, no user-entry skill is loaded recursively, and the lockfile covers every
  installed skill. It checks the graph, not behavior.

## Running the lifecycle

Invoke the root explicitly; it is not selected automatically:

```text
Load the `idea-to-production` skill.
Goal: <what you want built>.
Existing artifacts: <paths, or "none">.
```

Examples:

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

- **Upstream moved?** Re-pin deliberately: check out the new commit, copy the skill,
  recompute the content hash, update `dependency.md` / `skills.lock.json`, rerun
  `check-contracts.mjs`, and re-run the relevant behavioral cases.
- **Adding or removing specialist?** Update `dependency.md` status, the adapter's
  `conditional_children`, and the lockfile together; the checker enforces consistency.
- **Keep runs reproducible:** never edit `dependency.md` or `skills.lock.json` during a
  lifecycle run.

## Testing the framework itself

- Static: `node tests/skills/check-contracts.mjs`
- Behavioral: cases in `tests/skills/{isolation,composition,recursion,failure,golden}/`
  run manually, one per fresh session, per `tests/skills/README.md`. Record outcomes in each
  case's `Result:` line. Model behavior is nondeterministic: treat these as regression
  signals, not proofs.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Skills missing from the session | Restart the session; confirm `.agents/skills/<name>/SKILL.md` or `~/.agents/skills/<name>/SKILL.md`; names must be unique across locations |
| Duplicate skill names | Remove or rename one copy (project vs global) |
| Adapter returns `needs-human` citing a missing skill | Install it from `skills.lock.json`; this is by design, not a bug |
| `itp-review` says the issue tracker is unconfigured | Run `setup-matt-pocock-skills` in the target repo once |
| `playwright-generate-test` / `webapp-testing` fail | They need Playwright MCP / a browser+Python environment; configure it or expect a `needs-human` handoff |
| Verification refuses to pass | That is the gate working: run the named checks, or route back to `itp-implement` |
| Framework skill edits made mid-run | Don't; contracts and pins are curation changes |
