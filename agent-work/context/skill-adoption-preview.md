# Adoption preview handoff

Branch: `feature/skill-adoption-preview`, based on Skill Watch commit `ce3c5bf`.
Plan: `agent-work/plans/SKILL-INTEGRATION-PLAN.md`; slice/criteria:
`docs/work/ISSUE-SKILL-ADOPTION-PREVIEW.md`. This is maintenance, not a lifecycle
installation or automatic approval of a discovered skill.

Loose planning/design inputs now live under `agent-work/plans/`; `agent-work/INDEX.md`
is the entry pointer. Docs, README, runtime instructions and test evidence stay in place.
The shared fetch helper accepts optional inspection environment/cache settings; other
callers retain their existing defaults.

The CLI writes preview.md/manifest.json only after committed-tree verification and
computes a binding over candidate, proposal, framework basis, lock/row and inspection
facts. Recheck with the same snapshot/proposal plus `--check-preview` and preferably
`--expected-binding` copied from the reviewed artifact. No automatic adoption follows.

Read-only smoke inspected the previously discovered playwright-best-practices candidate,
public repository 1143589800 at 283d5cbc5d11aac1abda058b16ad22c317d54dc0:
59 regular committed files, 762190 bytes, full-directory hash
845507e8ad13656076108ac7f9a8c04d64461f2b4cf58e41d43f9837e137052d.
It remains needs-human: role/capability/owner, dependency and license review, and unresolved
local references are outstanding. Candidate instructions were not invoked or installed.
Temporary smoke files are under /tmp/opencode; their existence is not required to resume.

## Independent review — done

A differently-framed independent session (`ses_ed1020c8dffemn550bAAdpHZLP`,
defensive verification wording after the adversarial worker tripped a content
filter) verified all eight safety properties against exact lines plus /tmp-only
exercises: occupied-cache preservation, Git config rejection + env isolation,
pre-hash symlink/submodule/traversal/LFS rejection, committed bytes/modes
comparison, output-path protection, manifest binding, pre-checkout budgets, and
unaffected default fetch callers. All 18 preview tests pass. Verdict: **approve**,
no blockers. Stated non-blocking notes: mode-only tamper has no dedicated test,
bare `$HOME` itself is not blocked (only skill/cache subdirs), non-`.md`
framework file modes don't alter the hash, and the count/mode API path is
code-covered but unexercised. No network, installs, commits, or publications
were performed.

Next: finish verification (independent review done — see below). Milestone 2 requires selecting a genuine
capability gap and approving a proposal; native execution needs separate isolation and
authorization. This session does not merge/push the Skill Watch PR or refresh globals.
