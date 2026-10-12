# Adoption proposal: security-threat-model (approved)

Status: user-approved 2026-10-12. Milestone 2 first real adoption.

## Candidate
- Skill: `security-threat-model`, repo `openai/skills`
- Path: `skills/.curated/security-threat-model/SKILL.md`
- Revision: `49f948faa9258a0c61caceaf225e179651397431`
  (`[codex] Update skill installer post-install guidance (#507)`)
- Watchlist key: `1103643573:skills/.curated/security-threat-model/SKILL.md`
  (primary verified, model-invoked)
- License: Apache-2.0 (`LICENSE.txt` in bundle; preserve notice on install)

## Capability gap
ITP reviews diffs for security issues (`differential-review`) and mistake-proofs
high-consequence designs (`poka-yoke`), but no skill *produces* a repository-grounded
threat model (trust boundaries, assets, abuse paths, mitigations) during architecture.
This is an addition, not a replacement; no existing capability is retired.

## Integration route: conditional specialist
- Owner: `itp-architecture` (conditional child).
- Trigger: architecture touches auth, PII/credentials, trust boundaries, or external
  exposure.
- Non-trigger: general architecture summaries, code review, non-security design work
  (per the skill's own description).
- Expected artifact: concise Markdown threat model linked from `architecture.md`/ADR;
  assumptions explicit, claims evidence-anchored.
- Blocked path: threat-model request with no repo access or no user to confirm
  assumptions → `needs-human`, no invented components or controls.

## Dependencies and compatibility
- Declared child dependencies: none observed in frontmatter (preview re-verifies).
- Runtime tools: none beyond file reads and user interview.
- OpenCode compatibility: Markdown procedure, no harness-specific calls.
- Whole-bundle dependency/license review still required at preview time.

## Acceptance cases
- Positive trigger: security-sensitive architecture loads the skill and yields an
  evidence-anchored threat model artifact.
- Non-trigger: pure structural refactor architecture does not load it
  (recorded as considered-not-triggered).
- Missing capability path: n/a (no required children), but unconfirmed assumptions
  must stop for the human rather than invent controls.
- Existing `itp-architecture` composition cases remain valid for the changed scope.
