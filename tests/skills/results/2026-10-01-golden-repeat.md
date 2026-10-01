# Golden Repeat Result - 2026-10-01 (standard)

Case: `add-collaborator-invitations` (`tests/skills/golden/add-collaborator-invitations.md`)
run in a fresh `~/itp-golden-app` (framework v2.1.0 installed by `install.sh`, 62/62
contract checks at install). One human answered the alignment interview and two
in-run decisions (tracker setup, security-fix direction).

Verdict: **pass**.

| Expectation | Observed |
|---|---|
| required adapters/children | align+grilling, spec+writing-for-agents, architecture+codebase-design (+poka-yoke consulted), slice, implement+tdd, review+code-review, verify+verification-before-completion — all evidenced by artifacts and the run ledger |
| `research` phase | skipped with a recorded reason (no external question); same as the 2026-09-16 run |
| conditional trigger | `differential-review` triggered on the token access-control surface; findings recorded in `docs/work/review.md` (see variance note) |
| forbidden | no runtime skill install (sandbox still has exactly the 12 framework skills); no recursive `to-spec` |
| artifacts | `decisions.md`, `spec.md` (REQ-1..REQ-9), `acceptance-criteria.md` (AC-1..AC-10), `architecture.md`, `ADR/0001-*`, `ISSUE-1.md`, `review.md`, `verification.md`, `.itp/run.md`, plus tracker setup (`docs/agents/*`, AGENTS.md block) |
| review before verify | `review.md` verdict **approve**, `recommended_next: itp-verify`; `verification.md` verdict **pass** with in-session evidence (`node --test` 10/10, exit 0) |
| fresh evidence | `node --test` re-run after the fact: 10 tests, 10 pass, exit 0 |
| user-entry handling | `setup-matt-pocock-skills` loaded only after an explicit user instruction (local-markdown tracker, default triage labels), recorded in the ledger |
| ledger | `next_phase: complete`, completed phases listed, evidence recorded, open questions empty |

## Notable: review caught a real defect
Unlike the 2026-09-16 run (clean review), this run's `differential-review` found a
CRITICAL: the retained `addMember` helper let any caller join without a token,
violating the goal. Verdict went `changes-requested` → product owner chose
owner-gated `addMember(email, caller)` → fix + regression test (AC-8b) → re-review
approved. Standards and Spec axes reported 0 findings. This is the loop working as
designed, not a failure.

## Variance vs 2026-09-16
- Interview: owner chose time-boxed expiry (7 days) over the recommended none, and
  `acceptInvite(token)`; spec carries 9 REQs / 10 ACs (vs 14 AC-refs originally).
- Review findings live in `review.md` rather than a separate `differential-review.md`;
  same function, slimmer artifact shape.
- No `CONTEXT.md` was created (domain-modeling never triggered; lazy creation held).
- Merge-gate and pass-bar conventions from the U9 upgrade appear verbatim in
  `ISSUE-1.md` and were followed at verify.

## Metrics (per artifacts.md)
- scale: standard (access-control surface); phases: align, spec, architecture, slice,
  implement, review, verify (research skipped with reason).
- skills loaded (17): idea-to-production, itp-align, grilling, itp-spec,
  writing-for-agents, itp-architecture, codebase-design, poka-yoke, itp-slice,
  itp-implement, tdd, itp-review, code-review, differential-review,
  setup-matt-pocock-skills, itp-verify, verification-before-completion.
- artifacts written: 14 (ledger + 13 files). Code changed: `src/members.js` +40/-5,
  `test/members.test.js` +73 (10 tests). Docs ≈ 340 lines → doc-to-code ratio ≈ 3:1,
  expected for a golden (review artifacts dominate the tiny diff).
- duration: single session, checkpoints off.

## Still open for section 25
Greenfield golden repeat, one full grilling interview (this run's interview was
scoped to four decisions, not a full session), FAIL-07 or permanently-blocked record.

Sandbox history (`~/itp-golden-app`, keep or delete): `97ec6e4` seed →
`80a63d8` implement → `df136ea` tracker setup → `e0cc028` review+fix →
`2333ca5` verify.
