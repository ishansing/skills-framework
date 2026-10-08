# Issue tracker: GitHub

Issues and specs live in `ishansing/skills-framework`. Use `gh` for tracker operations;
infer the repository from the clone's remote or pass `--repo ishansing/skills-framework`.
Local framework specifications and validation cases remain valid explicit review sources.

## Operations

- Read: `gh issue view <number> --comments`.
- Discover: `gh issue list --state open --json number,title,labels`.
- Publish: `gh issue create --title "..." --body-file <path>`.
- Comment: `gh issue comment <number> --body-file <path>`.
- Labels: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- Resolve: `gh issue close <number> --comment "..."`.

These are workflow recipes, not permission to mutate the remote. Honor the user's
requested scope. Configuration and review alone do not authorize publishing.

## Pull requests as a triage surface

**PRs as a request surface: no.** External PRs are not included in issue triage.
GitHub shares an issue/PR number space; resolve ambiguous references with `gh pr view`
and fall back to `gh issue view`.

## Wayfinding operations

- Map: one issue labelled `wayfinder:map`; its body indexes decisions and open fog.
- Child: one issue per decision ticket, linked as a sub-issue; use a task-list/body
  link if native sub-issues are unavailable. Types: research, prototype, grilling, task.
- Blocking: prefer native issue dependencies; their API uses the blocker's database
  issue ID, not its displayed number. Otherwise use `Blocked by: #N` links.
- Frontier: open children with no open blockers and no assignee, in map order.
- Claim: assign the driving developer before work.
- Resolve: record the answer on the child, close it, and add a gist/link to the map.
