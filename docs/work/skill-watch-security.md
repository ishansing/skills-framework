# Skill Watch differential security review

Baseline `6230ad0`, uncommitted feature working tree. Risk-first review covered the new
HTTP/HTML/YAML collection and GitHub issue/state publication boundaries, their workflow
permissions, direct callers, and regression tests. Both collector/publisher production
entry points have one CLI caller; workflow is the supported serialized scheduler.

## Concrete findings resolved

- Website redirects could cross into authenticated GitHub reads. Separate public-web
  and authenticated-API contexts now reject cross-boundary redirects before requesting;
  API bodies are never persisted in HTTP caches. Regression covers token non-forwarding.
- Forged issue/comment markers could select or suppress alerts. Only the configured
  publisher's exact managed issue/header and comment markers are accepted; stored issue
  identity is revalidated, stale state refused, and event delivery deduplicated.
- Robots wildcard regex backtracking could block the event loop. Literal-segment matcher
  with body/rule bounds replaces regex expansion. The repeated-star child-process test
  failed with timeout before correction and passed afterward.
- Oversized listing names could exceed the state budget and block all publishing.
  Field-size bounds stop this; the reviewer replayed a 3.1 MB heading through the real
  scanner with fake HTTP, observing bounded name/state and zero authenticated cache data.
- Duplicate cards could inflate a single candidate's observation array to 30,000 entries.
  Per-page deduplication and observation caps fix the original 1.71 MB payload; independent
  recheck measured one observation and 16,652-byte state instead of 5,926,455 bytes.
- YAML aliases and dependency strings are bounded before storing metadata. Markdown and
  mentions are escaped, discovery links/redirect hosts restricted, and HTTP retries,
  response sizes and run budgets bounded.

## Final disposition and limits

Adversarial reviewer `ses_ed4127fb4ffesLp5LQ3cjGatFH`: **approve** for the targeted
pre-commit scope, no remaining demonstrated blocking vulnerability. Coverage includes
local fake-API payload replay and public read-only source scans, not actual remote writes.
No adversarial probe accessed hostile live destinations or private repository content.

Publication stays off. Workflow concurrency does not serialize independent local CLI
publishers; simultaneous operator CLI writes remain unsupported, and CAS protects state
updates but is not an atomic notification lock. Live permissions, issue creation/state
persistence, remote CI, and rollout must be demonstrated separately with authorization.
