# Skill Watch implementation

Approved scope: `agent-work/plans/SKILL-WATCH-PLAN.md`. Branch: feature/skill-watch.
Architecture: one collector/comparison module and a separate publication boundary;
reuse upstream pin checker. HTML and YAML parsers handle external structured input;
no discovered code is executed. State stays on automation/skill-watch, outside master.

Acceptance criteria:
- AC-1: inventory/release/pin reports detect changes without baseline floods or false
  removals from incomplete/error scans; human dispositions survive collection.
- AC-2: all four named sources have tested extractors and bounded primary verification;
  inaccessible sources and unverified leads remain explicit, with observed metrics.
- AC-3: fetching obeys configured source hosts, robots rules, delays, limits and retries;
  rejects private destinations and redirects, escapes external report text.
- AC-4: publication is opt-in and idempotent; state advances only after publication;
  initial/new/weekly/high-priority notifications do not duplicate on retries.
- AC-5: daily/manual workflow, dry-run report and documentation work; tests and workflow
  lint pass; live read-only scan has observed results. Remote publication is not performed
  during implementation; rollout flag remains off until an authorized live proof.

Approved test seams: extracted source responses, full scan/report/state with simulated
HTTP, and issue/state publication against a fake API. Pass bar: test suite exit 0 with
these cases, plus actual dry-run evidence and independent review/fresh verification.
Documentation impact: README usage and source/coverage limitations; saved plan retained.
Security differential review triggers on the outbound-fetch/publication trust boundary.
