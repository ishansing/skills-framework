# Marketing plan: Idea-to-Production

Status: in progress. The P0 README/docs/visual/feedback implementation is locally
verified on `feature/github-presentation`; About/topics are updated live. Documentation
publication awaits commit/merge. A fresh newcomer task, recorded demo and custom social
preview remain follow-up work. Scope: GitHub presentation, onboarding, proof assets and
an initial organic launch. Keep the existing repository URL.

Current implementation/evidence: `docs/work/ISSUE-GITHUB-PRESENTATION.md` and the
GitHub presentation sections in `docs/work/review.md` / `docs/work/verification.md`.

## 1. Goal and positioning

Make a developer understand the product in 15 seconds, find a working first-run path
within a minute, and see enough concrete evidence to try it on a small task.

Primary audience: developers already using coding agents who want more consistent
specification, implementation, review and handoffs. Start with the OpenCode users for
whom this project has actual runtime evidence. Small engineering teams maintaining
shared agent workflows are a secondary audience.

**Proposed headline:** A repeatable engineering workflow for your AI coding agent.

**Proposed supporting copy:** Idea-to-Production guides your agent from a rough idea
through specification, implementation, review and verification—with checkpoints,
resumable artifacts and pinned skills.

**Proposed GitHub About description:** Composable skills for AI coding agents:
research, specs, TDD, review, and verification in one resumable workflow.

Lead with the user problem: repeated prompting, vague requirements, lost context and
unverified completion claims. Explain the mechanism afterward: thin phase adapters
compose curated, pinned upstream skills, and existing artifacts let the workflow skip
unnecessary phases.

Use “Idea-to-Production” consistently as the product name; define ITP once. Explain
that “production” describes the engineering lifecycle, not automatic deployment.
Describe review/verification gates as agent instructions and evidence requirements;
the separate runtime enforcement harness remains unbuilt. Runtime support claims must
have named, current evidence. Upstream attribution is credit, not an endorsement.

## 2. Current presentation audit

Observed from the checked-out README and live GitHub metadata during this planning
session; counts and settings can change.

| Finding | Visitor impact | Recommended action |
|---|---|---|
| About description, website and topics are empty | Search results/sidebar do little to explain the product | Add benefit-led description and relevant topics; use an existing useful docs URL if needed |
| README is 424 lines and opens with internals and a dense validation history | New users must decode the project before trying it | Front-load value, demo, install and first run; link deeper reference material |
| README says asset-bearing release is still pending | Contradicts the working v4.0.0 installer | Update current installation/release wording, retaining accurate notes for older versions |
| No demo/banner assets were found in the audited tree; social preview is GitHub's default | Little visible evidence of the experience | Capture a real terminal demo and make a simple branded preview |
| No contribution guide or issue forms were found | First users have no obvious feedback path | Add a short contribution guide and task-focused feedback forms |
| Discussions are disabled | No dedicated Q&A/showcase space | Initially use issues; enable Discussions when there is enough activity to maintain it |
| Public page exposes extensive maintainer detail | Core workflow competes with Skill Watch/adoption tooling | Keep primary workflow prominent; link maintenance tools from advanced docs |

GitHub's community-profile health score is a repository checklist, not a marketing
success metric. Add community documents when they serve a real contribution/support need.

## 3. P0: Make the GitHub page presentable

### README information hierarchy

Target a concise landing README, roughly 150–220 lines as an editing guideline. Preserve
technical documentation and evidence through working links rather than deleting them.

1. **Hero:** product name, headline, one-sentence explanation, and three functional badges
   (CI, latest release, MIT license). Primary action: install and run the first example.
2. **Show it:** a lightweight terminal GIF or static preview linked to a short video.
   Provide descriptive alt text and a text transcript; verify dark/light readability.
3. **Why use it:** three benefits tied to behavior—clear specs before implementation,
   resumable artifacts/checkpoints, and review plus fresh verification evidence.
4. **Quick start:** live curl command, Bash/Node 20+ prerequisites, restart/discovery,
   and a copyable first prompt. Mention Git for new-project initialization and link
   detailed installation/trust guidance.
5. **First useful result:** show the example task, expected artifacts and verification
   command. Offer a small existing-project task so visitors need not start a full project.
6. **How it works:** one lifecycle diagram and a short explanation of shortcut routing.
7. **Examples and runtime support:** feature, clear bug fix, review-only; distinguish
   tested runtime/version combinations from merely format-compatible environments.
8. **Trust and boundaries:** pinned skill provenance, human decisions, behavioral
   variability and the unbuilt enforcement harness. Link detailed validation results.
9. **Documentation, contributing and credits:** compact navigation with upstream credits.

Proposed supporting document split, reusing existing pages where they fit:

- `docs/getting-started.md`: one complete first-run walkthrough and common setup pitfalls.
- `docs/installation.md`: options, scope, refresh/upgrade, offline install, prerequisites
  and checksum/publisher trust details moved from README.
- `docs/examples/`: two or three small, reproducible examples with captured outputs.
- `docs/validation.md`: concise evidence index linking existing dated result files,
  stating what was tested and what remains untested.
- Existing specification, registry, maintenance plans and test docs remain authoritative
  for their respective detail; do not copy their procedures into the marketing README.

### Visual direction and GitHub settings

- Use a restrained developer-tool style: readable typography, one accent color and a
  simple lifecycle motif. Start with a wordmark/diagram rather than a bespoke identity.
- Create a social preview at GitHub's recommended dimensions at implementation time
  (commonly 1280 × 640); preview the actual link card before launch.
- Suggested topics: `agent-skills`, `ai-coding`, `coding-agents`, `developer-tools`,
  `opencode`, `spec-driven-development`, `test-driven-development`, `code-review`.
  Add host-specific topics only when those integrations have evidence.
- Keep the Releases sidebar visible and the latest release understandable to users:
  what changed, who should upgrade, how to install, and any compatibility changes.
- Put bug/setup help and feature proposals behind simple issue forms that ask for
  runtime/version, selected skill, expected outcome and redacted reproduction.
- Add a short `CONTRIBUTING.md`: local checks, where examples/docs belong, how to propose
  a skill, and the approval/pinning expectations. Retain upstream licensing/credit.

**P0 done when:** the first screen explains who this helps and shows a next action;
v4 installation wording is accurate; documentation links resolve; mobile and dark/light
views are readable; a newcomer can locate install, first prompt and expected output
without reading framework internals. Test first-run instructions in a fresh session.

## 4. P1: Produce proof worth sharing

Create one coherent demo that can be reused across the README, video and launch posts.

**Demo task:** a small real feature in an existing sample project—for example, add a
CLI option with validation and a test. Keep the scope small enough to inspect the diff.

Show the brief → selected phases → spec/acceptance criteria → failing/passing test →
review → verification evidence. Include the human decision/checkpoint if one occurs.
Name the runtime/model and identify cuts or time compression; keep the complete
transcript and reproducible starting point linked. Report the actual outcome, including
failures or limitations, rather than editing them into a false seamless result.

Deliverables:

- 45–90 second narrated demo, with a short silent GIF/static fallback for the README.
- One screenshot of a useful artifact, not just terminal installation success.
- A reproducible example: starting commit, prompt, result diff and exact checks.
- One short case study: problem, workflow decisions, result, evidence and limitations.
- Five invitation messages to developers willing to try one small task and give feedback.

Ask testers: What did you think this did? Where did setup stall? Did the generated
artifacts/review help? Would you use it for another task? Which runtime did you use?
Use attributed quotes only with permission. Treat comparison claims as experiments:
matched task/runtime, disclosed prompts and actual results before asserting savings.

**P1 done when:** at least three invited developers attempt onboarding, observed blockers
have dispositions, and the published demo links to inspectable evidence. This is a
learning target, not a forecast or prerequisite for every small progress post.

## 5. P2: Launch to relevant communities

Start with people already feeling the workflow problem. Use one main launch artifact
with audience-specific introductions; participation and useful replies matter more than
posting the same announcement everywhere. Check each community's current submission rules.

| Priority/channel | Useful angle | Asset / call to action |
|---|---|---|
| 1. Existing contacts and OpenCode communities | “Help me test a resumable, spec-to-verification agent workflow” | Demo + one example; ask for a first-run report |
| 2. GitHub release and project/profile pins | “v4 adds a working no-clone installer and local/global scope” | Clear release notes and README quick start |
| 3. X and LinkedIn | Show a specific engineering failure and the workflow response | Short clip + artifact; invite users to try that task |
| 4. DEV/Hashnode or a personal technical blog | Explain decisions instead of listing features | Walkthrough: from vague task to spec, reviewed diff and checks |
| 5. Relevant Reddit communities | Share a real result and ask a concrete technical question | Evidence-first post; disclose authorship and follow promotion rules |
| 6. Show HN | Explain why another agent workflow is useful and discuss tradeoffs | Ready demo, readable repo and maintainer availability for replies |
| 7. Relevant curated lists and newsletters | Supply a concise, accurate description and proof | Submit only where inclusion criteria fit; disclose maintainership |

Suggested launch hook: **“I built a resumable engineering workflow for coding agents:
specs, TDD, review and verification, with a one-command installer.”** Pair it with one
specific result and a direct question about the reader's current workflow.

Sequence: invite testers first, correct onboarding friction, publish the walkthrough,
then make the larger community launch. Keep a small channel/result log; follow up with
answers, reproducible fixes and useful artifacts rather than repeated promotion.

**P2 done when:** chosen posts are published with working links, questions have owners,
and results are reviewed after one week. Public posts/settings changes require explicit
publication authorization; planning does not authorize outreach.

## 6. Additional marketing ideas, ranked

1. **“Agent workflow mistakes” series:** one real failure per post—premature completion,
   lost context, vague specs—with the artifact/checkpoint that helped. Link the example.
2. **Copyable recipes:** “review a PR,” “debug an unknown failure,” “resume yesterday's
   work.” These are useful entry points into the existing workflow, not more features.
3. **Build-in-public changelog:** show the problem behind a release, a small before/after,
   and what remains unresolved. Keep the v4 installer as the first concise walkthrough.
4. **Upstream ecosystem collaboration:** share integration examples with skill authors
   and invite corrections. Credit their work and distinguish composition from authorship.
5. **User showcases:** publish one practical community case study after repeat use exists;
   make its prompt/artifacts reproducible where the user permits.
6. **Office-hours walkthrough:** a small live session for early adopters; turn recurring
   questions into documentation and the best segment into a short clip.
7. **Later experiments:** a minimal documentation landing page, translated quick starts
   with a maintainer, and additional runtime-specific guides once verified. Add these
   when traffic, language requests or runtime demand justify the maintenance.

Prefer a strong README and real examples before paid ads, paid creator campaigns, a
separate marketing website or a broad multi-channel launch. Early feedback should
shape the pitch before spending money to amplify it.

## 7. First 30 days

Assume one maintainer with limited time; these are sequence/timeboxes, not promises.

| Window | Work | Deliverable / decision |
|---|---|---|
| Days 1–3 | README hierarchy, accurate release/install text, About/topics, essential docs links | P0 presentation PR and settings checklist |
| Days 4–7 | Record one demo, publish example artifacts, add feedback/contribution paths | One reusable proof package |
| Days 8–14 | Invite five testers, observe at least three attempts, fix first-run blockers | Onboarding notes and revised pitch |
| Days 15–21 | Publish walkthrough and selected community posts; respond to feedback | Small measured launch |
| Days 22–30 | Publish one follow-up case/recipe; inspect engagement and repeat use | Choose the next channel or onboarding improvement |

Parallelize only genuinely independent content work; one person can do this sequentially.
If visitors arrive but cannot finish setup, prioritize onboarding over more promotion.
If setup succeeds but the value remains unclear, improve the example and positioning.

## 8. Measure useful adoption

Use existing GitHub data and voluntary feedback; no installer telemetry is needed for
this first campaign. Record a baseline immediately before launch and review weekly.

| Question | Practical signal | Caveat |
|---|---|---|
| Are relevant people finding it? | GitHub unique visitors, referring sites and post responses | GitHub traffic windows are short; capture snapshots regularly |
| Are people trying it? | Clone/download trends and explicit first-run reports | Downloads and clones are not unique or successful installations |
| Does onboarding work? | Completed/attempted first runs among invited testers | Small, selected sample; report counts and reasons, not broad conversion claims |
| Is it useful beyond curiosity? | Voluntary second-task reports and concrete artifact feedback | GitHub cannot measure this automatically |
| Is community participation emerging? | Useful issues, examples, fixes and permissioned case studies | Stars are a secondary awareness signal, not retention |

Initial learning goals: five tester invitations, three observed attempts, one complete
public example, and a clear explanation of the top setup/value blocker. A useful
follow-up signal is two independent users choosing it for a second task. Adjust goals
after a baseline; do not promise star counts, download targets or performance gains.

## 9. Recommended next implementation slice

**Start with the GitHub front door:** rewrite README, move detailed installation and
validation guidance into linked docs, add one simple visual, and prepare the About/topics
changes. Follow with the recorded demo and first-run example. Marketing copy should
describe tested behavior without changing lifecycle contracts, registry or pins.

Approval decisions before public execution: final headline, featured runtime/example,
preferred posting accounts/channels, and whether the maintainer can support launch replies.
Default to the wording above, OpenCode, one small existing-project task, and organic
outreach. Repository rename, paid spend and a standalone site are outside the first slice.
