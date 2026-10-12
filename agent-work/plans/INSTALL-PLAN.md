# Install Plan — curl bootstrap + CLI menu

Status: proposed, not implemented. Scope: one-line install with no clone, plus an
interactive menu replacing flag-memorization. Flags keep working (CI depends on them);
the menu is additive.

```sh
curl -fsSL https://github.com/ishansing/skills-framework/releases/latest/download/bootstrap.sh | bash
```

## 1. Release artifact (prerequisite)

`release.yml` today publishes notes only — no tarball, so curl has nothing stable to
fetch. Add a build step before `gh release create`:

- `idea-to-production-vX.Y.Z.tar.gz` — `install.sh`, `scripts/`, `.agents/skills/`,
  `dependency.md/json`, `skills.lock.json`, `VERSION`, `LICENSE`, `README.md`.
  No tests, no workflows.
- `SHA256SUMS` covering the tarball. Upload both as release assets.

Until the first asset-bearing release ships, bootstrap resolves `latest` and fails
clearly on older versions. No silent fallback to source zips — different layout,
different trust story. Trust is HTTPS-only; no signatures. State that in the README,
not as a guarantee.

## 2. `bootstrap.sh` (~60 lines, bash + curl + tar + sha256sum only)

1. Resolve version: CLI arg, then `$ITP_VERSION`, else follow `/releases/latest`.
2. Download tarball + `SHA256SUMS` to a temp dir, verify the hash, extract.
3. `exec` the extracted `install.sh`, passing through all args
   (`bash -s -- <target>` works through the pipe).
4. No network beyond github.com; temp dir cleaned on exit; `--dry-run` passes
   straight through for inspection before trusting it.

## 3. Menu in `install.sh` (new `--menu` + auto-menu)

Auto-menu fires only when stdin is a TTY **and** no target/flags were given — CI and
scripts never see it. `--menu` forces it. Every choice maps to existing code paths
(no duplicated logic):

1. **Target** — existing repo path, or new project (path → `mkdir` + `git init`,
   i.e. today's `--init`).
2. **Skills location** — global `~/.agents/skills` (default, shared) vs
   project-local `TARGET/.agents/skills` (self-contained; sets `GLOBAL_SKILLS`
   override). See §6: ships marked experimental until the status wording is resolved.
3. **Checkpoints** — seed `.itp/run.md` with `off` / `phase` / `slice` (new projects;
   offered on existing repos only if no ledger exists).
4. **Refresh + strict** — yes/no prompts mapping to `--refresh-upstream` / `--strict`.
5. **Summary + confirm** (`--yes` skips; dry-run preview offered first).

## 4. Tests (no new deps)

Bash menu stays thin (prompt → variables → existing paths). Test by piping answers
into `--menu --dry-run` and asserting the echoed actions — runnable in CI with zero
new tooling. `bash -n` coverage extends to `bootstrap.sh`. One live end-to-end (temp
HOME, tarball from a draft pre-release) before merging.

## 5. Docs

README `## Install` becomes curl-first with the menu walkthrough; flags table stays
for CI/scripting; troubleshooting gains checksum-mismatch and version-not-found rows.

## 6. The checker wording problem

`dependency.md` documents every upstream skill's status as `installed-global`
("discovered from a global skill source"). The contract checker
(`tests/skills/check-contracts.mjs:128-133,148-152`) treats that string as "pinned
and loadable" — but it verifies registry↔lockfile consistency only. It never checks
*where* the skill lives on disk.

Project-local install breaks the meaning of that string three ways:

1. **The registry lies.** A skill installed under `TARGET/.agents/skills/` is
   documented as global. Any agent or human following `dependency.md` looks in
   `~/.agents/skills/` and finds nothing.
2. **The checker gives false confidence.** It still passes — it cannot see location —
   so a green check no longer means what it says.
3. **Discovery splits.** Some harnesses read repo-local skills, some read global;
   the framework's routing and verification language assumes the global path, so the
   two modes can disagree about what is installed.

Resolution, in order of preference:

- (a) Introduce a real status value (e.g. `installed-local`), teach the checker to
  enforce location per mode, and verify the target accordingly. Then project-local
  is supported, not experimental. **Implemented:** `installed-local` is a pinned
  status; the checker requires `<root>/.agents/skills/<id>/SKILL.md` with a matching
  frontmatter name, with red→green fixture coverage in
  `tests/scripts/check-contracts.test.mjs`. End-to-end project-local installs
  (installer/menu support) remain follow-up work.
- (b) Until (a) exists, the menu offers project-local marked **experimental**, with
  the wording gap stated in the menu text itself.

Do not ship project-local as a silent equal of global. A passing check must keep
meaning what it claims.

## Acceptance

- [ ] Fresh machine, no clone: curl pipe installs to new and existing targets.
- [ ] Menu walkthrough test green; flags-only paths unchanged (existing CI).
- [ ] Checksum mismatch aborts before extraction.
- [ ] Contract checker passes on both skills-location modes (or project-local ships
      flagged experimental per §6).
- [ ] Release workflow publishes tarball + checksums; bootstrap resolves latest and
      pinned versions.

Suggested slice order: release assets → bootstrap → menu → tests/docs.
