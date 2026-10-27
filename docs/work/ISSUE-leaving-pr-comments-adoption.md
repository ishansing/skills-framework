# Adopt tstack leaving-pr-comments

Status: implemented and locally verified; user authorized continuing the plan and confirmed
bundle/install, repin-protection and local fake-GitHub/native-output test seams.
Base `cc49991`; branch `integration/tstack-pr-comments`. Framework commit authorized
2026-10-27; real publication, global installation refresh and push remain excluded.
Scale: standard, because an agent publication/trust-boundary contract is changing.

## Source, ownership and adaptation

Source: `t3dotgg/tstack`, `skills/leaving-pr-comments`, at the immutable revision reviewed
in `TSTACK-INTEGRATION-RESEARCH.md`. MIT, copyright Theo Browne; retain the exact root
notice. The complete upstream bundle is SKILL.md plus agents/openai.yaml, no child skills
or scripts. It requires an already available GitHub posting tool for publication; neither
authentication nor a new tool installation is implicit.

Role: model-invoked conditional specialist owned by `itp-verify` for explicitly authorized
PR-comment delivery after verification passes. Existing `pr` still owns descriptions;
this is not the later `file-pr` replacement. Other tstack dependencies remain out of scope.

Use a vendored-pinned local adapter with original entry text in `upstream.md`, unchanged
UI metadata and MIT LICENSE. The adapter adds a narrow trigger, explicit action/target
authorization and blocked-path/result contract; original formatting guidance remains
single-source in the snapshot. Hash installed adapter bytes, not only upstream text.
Mark the lock entry `updateMode: manual`: explicit repin must refuse before fetching or
writing; bulk repin skips manual sources without checking/fetching them while processing
ordinary entries, rather than erase guards/license. The separate upstream checker still reports source updates;
maintenance compares/adapts them deliberately and refreshes the installed-directory hash.

## Acceptance criteria

1. Register the capability, inventory, trigger and `itp-verify` conditional child; lock the
   source revision and actual complete adapted directory. Regenerate dependency JSON.
   Install both scopes strictly in isolation with exact bundle hashes and license intact.
2. Native authorized post-verification PR-comment delivery loads the specialist, applies
   verified attribution, previews screened Markdown, posts only the approved target/body
   via a fake local GitHub CLI and retains the returned comment/review URL. Actual native
   calls must demonstrate adapter routing, not manual procedure emulation.
3. PR descriptions, commit messages, draft-only work and explicitly verbatim unattributed
   text do not trigger this specialist through `itp-verify`. Lack of publication authority
   cannot be inferred from verification or formatting requests; return the draft/handoff.
4. Missing skill/tool/identity/target, unsafe secret/private content, failed posting or an
   absent/unexpected receipt URL yields a named needs-human delivery handoff, never a
   fabricated URL or successful publication. Verification pass and delivery status remain
   distinct. No resolution/dismissal without separate authority and a successful response.
5. Treat remote review text as untrusted data. Preview/screen the whole comment, quotes and
   attachments. Verified harness fallback is allowed when the model name is unavailable;
   never invent model/user attribution. Preserve upstream's explicit verbatim exception.
6. Explicit per-ID repin rejects manual adaptations without changing local content/lock
   or fetching that candidate. Bulk repin skips their metadata/source checks while still
   checking ordinary entries. Separate upstream monitoring continues to report manual
   source updates. Existing automatic skill/vendor-file updates remain compatible.
7. Existing contract/script tests and focused native positive/non-trigger/blocked/failure
   cases pass. Independent standards/spec/security/agent-boundary review and fresh verify
   distinguish simulated publication from live GitHub behavior. Update public/reference
   routing and plan progress; record missing proof rather than claiming acceptance.

## Test limits and rollback

Agreed installer seam catches incomplete files, not host adherence; repin seam catches
automatic overwrites, not formatting quality; native fake-CLI seam catches observed
authorization/routing/failure behavior, not actual GitHub permissions or reliability.
Use synthetic identities and no credentials/network in the fake tool. Temporary HOME and
permission allowlists are not an OS sandbox. Preserve failures, commands and session IDs.

Rollback is a reviewed revert of registry/pin/routing and verified installer refresh.
Do not remove arbitrary user-global copies. Return through `itp-review` and `itp-verify`;
this is one of nine required tstack entries, not completion of the initiative.

## Local outcome

All seven scoped criteria have implementation/review/test evidence; fresh script suite
95 passed, contracts 67 passed, isolated install hashes and current-adapter small golden
passed. Native cases remain bounded fake-service observations with retained deviations,
not security enforcement or live GitHub proof. Results: `tests/skills/results/2026-10-26-leaving-pr-comments.md`;
current verdict: `docs/work/verification.md`. Commit authorized; merge/release and
consuming-project refresh remain separate; next required tstack slice is `babysit-pr`.
