# Skill Watch — implementation plan

Status: implemented on `feature/skill-watch`; publication and scheduled collection remain
off pending an authorized live publication proof. No automatic adoption. Scope: monitor
major upstream changes and discover new/trending
agent skills, including website API and HTML discovery.

## 1. Goal and relationship to existing automation

Provide a durable GitHub watchlist with provenance, actionable update alerts, and a
bounded discovery digest. Reuse `scripts/check-upstream.mjs` for existing pins.
The current monthly upstream-check/re-pin workflow retains its existing responsibility;
Skill Watch reports broader findings without changing pins or installing skills.

## 2. Discovery websites — initial source list

Interfaces below were inspected on 2026-10-08. Robots rules and terms must be checked
again when implementing and periodically thereafter; access today is not a permanent
guarantee. Each source reports exactly which pages/queries were covered.

| Website / entry points | Collection method | Useful signal | Observed limits |
|---|---|---|---|
| **AwesomeSkill**: https://awesomeskill.ai/ ; https://awesomeskill.ai/docs/api | Documented read-only `/api/agent/skills/search` API, with optional `q`, `limit`, `sort` parameters | Skill metadata and GitHub source links; repository stars are context | OpenAPI documents `latest`/`stars`, limit 1–50, and no pagination parameters; queries are bounded partial samples. Broken localhost marketplace links are rejected. Its discovery index advertises a search skill, not the full catalog |
| **Skills.sh**: https://skills.sh/trending ; https://skills.sh/hot ; https://skills.sh/ | Extract the public rendered leaderboard or reliable embedded structured data; API/feed only if documented and permitted | Per-skill source listing, displayed rank and installs, source-labelled popularity window | Trending page verified. It groups some same-repository entries behind “more” links, so visible cards are not a complete inventory. Robots allows public pages but disallows `/api/` and `/search`; do not crawl those routes. Preserve source window labels rather than assuming lifetime counts |
| **SkillsMP**: https://skillsmp.com/search ; https://skillsmp.com/categories ; https://skillsmp.com/timeline | Scrape allowed public search listing pages, using narrowly scoped extraction and bounded pagination (category-index breadth deferred to a follow-up; timeline is aggregate activity, never inventory) | Repository/path references, descriptions, repository stars, displayed update dates | Public search verified. Robots disallows API crawling; v1 uses allowed public pages. A separately authorized documented API client can be considered later. Timeline is aggregate repository last-push activity, not an inventory or authoritative skill creation date |
| **VoltAgent curated catalog**: https://github.com/VoltAgent/awesome-agent-skills | GitHub API read of the catalog at a resolved commit; extract primary repository/skill links | Newly added curated entries and official/community publisher leads | Repository existence verified. Curated inclusion is a discovery lead, not popularity, quality approval, or installation consent |

Additional sources require a reviewed code change, not configuration alone: the fetch
host allowlist is a security boundary, and each source needs a tested extractor. No
arbitrary web-wide crawler or runtime skill search tool is required. GitHub API
verification follows website leads to primary source files.

## 3. Collection tracks

### A. Approved upstream monitoring

Derive distinct repositories from `skills.lock.json`; include vendor-file sources without
assuming each is a skill collection. Resolve one revision per repository per scan.

- Fetch releases since the previous successful scan and compare skill inventories.
- Discover paths ending in `SKILL.md` and read their frontmatter and linked references
  as data. Detect added/removed IDs, possible moves, invocation changes, and dependency
  changes where explicitly declared.
- Reuse the current pin checker rather than duplicate drift/path-comparison logic.
- Compare pinned source with observed revision for affected approved skills; retain
  exact paths, hashes, release links, and evidence snippets.
- GitHub tree truncation or missing pages means incomplete inventory. Do not classify
  disappearance as removal until an authoritative complete comparison succeeds.

### B. Website discovery

API/feed first; allowed public HTML as a fallback. Use small source-specific extractors,
with shared fetching, normalization, verification, comparison, and reporting.

- AwesomeSkill: bounded configured queries and permitted latest/listing retrieval once
  its sorting/pagination contract is verified. Keyword search is explicitly partial.
- Skills.sh: observe a bounded leaderboard sample and resolve relevant detail links;
  report grouped/omitted entries and never infer complete coverage.
- SkillsMP: bounded public searches/categories; parse source repository/path references.
- VoltAgent: compare catalog entries; verify linked source repositories before reporting
  an entry as a confirmed skill.

Default discovery queries: review, testing, debugging, architecture, security, agents,
CI, database, frontend, research. Queries and source selection are configurable.
Deterministic capability-tag matching may suggest relevance; it is not expert evaluation.

### C. Primary source verification

For each candidate, resolve its canonical repository and an actual `SKILL.md` at a
specific commit, then record its declared name, description, invocation metadata, path,
and content hash. Respect file/response size and request bounds.

Listings without a verifiable primary skill remain `unverified` leads. A repo containing
several same-named skills requires exact-path resolution, not an arbitrary match.
Non-GitHub sources remain explicit leads in v1 unless a supported primary-file adapter
can verify them. Do not execute install commands, scripts, MCP tools, or skills.

## 4. Identity and ranking

Use canonical repository identity plus exact skill path as the verified candidate key;
store name separately. Merge multiple website observations for the same key and retain
all provenance. Same names across repositories are distinct candidates. Matching names
moving paths are possible moves; identical copied content is a possible duplicate, not
automatic evidence of common authorship or endorsement.

- **New:** first observed by this watchlist after baseline, not necessarily newly authored.
- **Trending:** a source explicitly lists it as trending/hot, or comparable observations
  show a meaningful movement. Retain raw metric, rank, timestamp, and metric window.
- **Rising:** default alert for a newly observed top-20 entry or a rise of at least ten
  places within the same comparable leaderboard. Tune after observing a baseline.
- Repository stars support context only. They do not measure an individual skill's use.
- Rounded display counts are approximate. Rolling-window installs cannot be subtracted
  and called lifetime installation growth. Unknown metric windows are marked unknown.

Avoid one opaque cross-site score. Prioritize current-dependency impact, evidence,
framework relevance, then labelled source popularity. Limit the digest to ten discovery
candidates, with links to the complete bounded scan artifact.

## 5. Major-update alert rules

| Priority | Alert condition |
|---|---|
| High | Confirmed removal/rename of an approved dependency; invocation-class or explicit dependency-contract change; documented breaking change affecting the framework |
| Medium | New upstream major release; new skill in a watched publisher; substantive changed procedure requiring review |
| Low | Metadata/docs-only changes and discovery candidates without known dependency impact |

Major version is a release signal, not proof every skill changed. Mark substantive-change
classification uncertain when it cannot be determined from explicit metadata/diff/release
notes. Do not claim semantic compatibility based only on text presence or version numbers.

## 6. Cadence, state, and notifications

- Daily scan at 06:00 UTC plus manual dispatch; daily sampling suits short trending windows.
- One digest issue: **Skill Watch — updates and candidates**. Refresh the issue body with
  current actionable items and source status. Send one weekly digest comment on Monday
  when something changed; high-impact dependency alerts get immediate comments.
- First successful run establishes source baselines. Present the initial sampled catalog,
  but do not announce every existing skill as newly created. Existing dependency drift
  against pins can still be reported on the first run.
- Store bounded snapshot/history on `automation/skill-watch`, not on `master`. Keep schema
  version, timestamps, source coverage, verified identities, metrics, and notified event IDs.
  Publication bounds: at most 40 notification events per comment batch, 2000 retained
  notified IDs, 3 MB state payload.
- Durable human dispositions live in reviewed `skill-watch.json`: evaluating, deferred,
  rejected, adopted, with reasons. Keys may be canonical verified identities or
  human-readable aliases (`owner/repo:path`, `lead:owner/repo:name`); the scanner checks
  both. Adoption is reconciled with the dependency registry;
  a popularity spike does not silently revive a rejected candidate.
- Deduplicate updates by source revision/release ID and candidate identity. Do not ping
  unchanged findings. Partial source failures preserve that source's last successful state.
- Publish with stable event markers, then advance state after successful publication.
  If publication or state persistence fails, retry without losing alerts or reposting
  existing marked comments. Emit a workflow failure for an unusable overall scan.

Publisher ownership uses configured `publisherLogin` (default `github-actions[bot]`)
and persisted issue identity; text markers from other users cannot claim the issue or
suppress notifications. Weekly delivery has a publisher-owned date marker: later Monday
runs only deliver new high-priority events, leaving other backlog for a later digest.
Issue bodies are capped below GitHub's text limit; complete results remain in artifacts.
Workflow concurrency serializes supported runs. Do not run independent CLI publishers
concurrently; cross-process atomic notification delivery is not claimed.

Candidate dispositions apply to event creation, pending alerts, and digest filtering/status,
including lead-name aliases after verification and compacted upstream path identities.
Possible moves require an unambiguous one-to-one same-repository/name match; approved
dependency impact remains high. Ambiguous additions stay separate from removals.

GitHub workflow concurrency serializes scans and publication. Permissions:
`contents: write` for the state branch and `issues: write` for the digest. No release,
pull-request, installation, or registry mutation permissions are needed for the watchlist.
It does not create a PR and wait on approval-gated CI.

## 7. Bounded fetching and source integrity

- Default: at most ten discovery pages/queries per website and fifty candidate primary
  verifications per run; approved-dependency monitoring gets priority if budget is scarce.
- Cache with conditional requests where supported; sequential per-host crawling with
  explicit User-Agent, timeouts, robots delay, bounded backoff, and `Retry-After` handling.
- Never bypass authentication, anti-bot challenges, or disallowed crawling routes.
- Follow only validated HTTPS URLs; reject localhost/private-network destinations from
  scraped links and redirects. This handles AwesomeSkill's observed broken links without
  fetching local services. Valid GitHub primary links remain usable.
- Prefer structured data to brittle layout selectors. For HTML, use a small tested parser
  if needed; do not hand-build a general HTML parser. A layout change is a source error,
  not proof its skills disappeared.
- Robots wildcard matching uses bounded literal-segment processing rather than a
  backtracking regex. Listing fields and observations are bounded; repeated cards retain
  one observation per candidate/page, preventing optional data from blocking publication.
- External text is report data, never workflow instructions. Escape Markdown/HTML and
  bound excerpts. No LLM, discovered code, or install command executes in the scan.

## 8. Files and implementation slices

Follow existing Node `.mjs` and stdlib patterns. Reuse `checkAll()` from the upstream
checker. Only introduce a parser dependency if verified HTML extraction requires it.

| File | Ownership |
|---|---|
| `scripts/skill-watch.mjs` | Collection, verification, comparison, JSON/Markdown reports, CLI |
| `skill-watch.json` | Website sources, queries, limits, thresholds, human dispositions |
| `.github/workflows/skill-watch.yml` | Schedule, state retrieval/persistence, idempotent issue publication |
| `tests/scripts/skill-watch.test.mjs` plus captured source fixtures | Parser, comparison, limits, partial-failure and notification tests |
| `README.md` | Watchlist operation, coverage, interpretation, adoption process |

1. **Upstream vertical slice:** dry-run reports for approved-repository releases and new
   skill inventory, tested against current/added/removed/changed fixture data.
2. **Website slice:** AwesomeSkill API, Skills.sh public trending, SkillsMP allowed public
   search, and VoltAgent catalog; normalized candidates verified against primary sources.
3. **Trend/state slice:** baseline and comparable rank observations, cross-source identity,
   disposition preservation, bounded history, partial-source failures.
4. **Notification slice:** dry-run publication preview, then state branch + one digest issue,
   weekly/immediate notification deduplication and retries; enable schedule after manual proof.

Each slice includes its relevant checks and docs. No database, browser automation,
dashboard, or autonomous evaluator is included in v1.

## 9. Acceptance and rollout

- Detect major-release signals and added/removed/changed skills in watched repositories.
- Discover verifiable candidates from the listed supported sources; report inaccessible
  sources and partial coverage rather than silently claiming comprehensive discovery.
- Preserve primary links/revisions, source metrics/windows, and candidate dispositions.
- Treat incomplete trees, grouped lists, rate limits, and parser failures without false
  removal alerts. Reject localhost/private source links without losing valid GitHub leads.
- Two equivalent scans produce no duplicate notification; a failed publication retries
  idempotently; an initial baseline produces no flood of “new” alerts.
- Discovery never changes pins, approved skills, or installed content.
- Fixture tests pass, then existing contract/script checks and workflow lint pass.
- Manual dry run validates the report, then an authorized publication run proves issue
  and state behavior before scheduling. Run `itp-verify` with fresh evidence before completion.

The schedule may start with one temporarily unavailable site only if its disabled status
and coverage gap are explicit. Do not silently substitute a different site or declare the
four-source implementation complete when an extractor has not been validated.
