# Curl installation differential security review — 2026-10-12

Baseline: `86750bc`; uncommitted installer/distribution change. Independent reviewer:
`ses_ed008475fffehk2KEJn7Ay6YEU`. Review included bootstrap, installer, distribution
builder, metadata writer, hash/checker helpers, tests and release/CI workflows; baseline
blame traced the removed upstream-conflict guard to `d48f998` and release tagging to
`00e6a6b`. All review reproductions used isolated homes/projects, with no remote mutation.

## Resolved MEDIUM: project record crossed the global ownership boundary

Original trigger: a project supplier knew the hash of a publicly available conflicting
global skill and supplied `.itp/install.json` with that hash as `managedSkills[id]`.
The installer treated this project-controlled claim as permission to overwrite the
global directory without `--refresh-upstream`. This removed the shared policy content
with publisher-pinned bytes; arbitrary attacker payload installation was not demonstrated.
Both direct installer and bootstrap entrypoints were affected, with 24 nonvendored
dependencies potentially shared across projects.

Fix: `install_tree` never consults a project's record to authorize shared global
replacement. Global conflicts require explicit refresh; project-local managed upgrades
remain hash-guarded. Regression tests reject forged `repo` and `global` records while
preserving the shared policy. Independent re-review confirmed the test's causal boundary
by reproducing the attack with only the guard removed in memory, and confirmed legitimate
local upgrades/explicit global refresh still work. No remaining concrete security finding.

## Reviewed safeguards

- HTTPS-only initial requests/redirects; numeric release versions; SHA-256 checked
  before extraction and package version matched afterward.
- Tar root/traversal checks; links and special entries rejected before extraction.
- Manifest verification and full directory pin hashes; copied staging checked before
  activation; destination ancestry and skill trees reject symlinks/special entries.
- Scope cleanup deletes only recorded unchanged local copies after verifying global pins.
- Release assets build from the release PR's exact merge commit; tag uses that checkout.
- Independent production-bundle install with Git blocked passed 63 global / 111 repo
  contract checks. Focused security regression run passed 15/15 tests, including all eight
  distribution tests; parent also ran the entire repository suite.

## Nonblocking operational limits

- Installation activates one skill at a time, not as a whole-project transaction.
  A later conflict/interruption can leave earlier successful changes without final metadata.
- Concurrent writers, hardlink aliasing, disk-full/interruption recovery and all platform
  tar implementations were not exhaustively tested; path checks are not race protection.
- Tag creation precedes GitHub release upload. If publication fails after tagging, an
  operator must inspect the existing tag and resume release asset publication; a normal
  rerun refuses an existing tag. Existing CI approval gates can also require intervention.
- Same-origin HTTPS/checksums trust the publisher or configured mirror; no signatures or
  independent bootstrap authenticity. These choices are explicit in README.
- No live release/public URL proof was authorized or performed.
