# Your first Idea-to-Production task

Use a small change in a project you know. This guide is a suggested walkthrough;
recorded validation results are linked from [Validation](validation.md).

## 1. Install into the project

Have Bash, Node 20+, curl, tar and a SHA-256 utility available. Use a clean or backed-up
working tree, then run:

```sh
curl -fsSL https://github.com/ishansing/skills-framework/releases/latest/download/bootstrap.sh | bash
```

Choose an existing project, repo-local upstream skills for a self-contained installation,
and phase checkpoints. Review the summary before confirming. Global scope is also
available if you want to share upstream skills between projects.

The command executes a downloaded script. For inspection, pinned versions, offline use,
scope conflicts and additional requirements, read the [installation reference](reference.md#install).

Restart the agent session in the installed project. Confirm the runtime can discover
`idea-to-production` and its `itp-*` skills. OpenCode is the primary validated runtime;
do not assume that another runtime discovers identical paths or honors identical metadata.

## 2. Give it one bounded goal

For a project with a CLI, try:

```text
Load the idea-to-production skill.
Goal: Add a --limit option to this project's CLI. It must accept a positive integer,
reject invalid values with a helpful error, and have tests for both cases.
Use phase checkpoints so I can review the plan before implementation.
```

If your project has no CLI, choose an equally small change: a validation rule or a
clearly described bug. Name the behavior you want, not a speculative architecture.

The agent should inspect existing code and artifacts, select the appropriate scale,
and ask about meaningful unresolved decisions. It may skip research, architecture or
other phases when existing evidence makes them unnecessary.

At a checkpoint, inspect what exists before saying `continue`. You can ask for a change
or say `turn checkpoints off`. A missing capability or human decision can produce a
`needs-human` handoff instead of continued implementation.

## 3. Inspect the result

Depending on scale, look for these repository artifacts:

| Artifact | What to inspect |
|---|---|
| `docs/product/` or the slice's issue/spec | Acceptance criteria match your request |
| `docs/architecture/` when needed | Decisions and module boundaries fit the project |
| Code and tests | Valid and invalid values are both covered in the existing stack |
| `docs/work/review.md` | Findings are resolved or explicitly handed off |
| `docs/work/verification.md` | Commands, observed results and remaining limits |
| `.itp/run.md` | Progress, open questions and the next phase |

Follow the actual artifact pointers in the ledger; smaller tasks need fewer documents.
Review and fresh verification are still required. If issue-tracker setup is missing
when review needs it, the adapter will ask you to run `setup-matt-pocock-skills` once
for the target project.

The first useful outcome is a small inspected diff with meaningful tests and verification
evidence. A “done” message without that evidence is a reason to inspect the workflow,
not a substitute for the checks. Deployment remains a separate authorized action.

## 4. Resume or use one phase

For a new session in the same project:

```text
Read .itp/run.md and its artifact pointers.
Load idea-to-production and resume the run from the recorded checkpoint.
```

For a review-only task:

```text
Load itp-review. Review this branch against main and the approved specification at
<path-to-your-spec>. Report concrete findings with evidence.
```

Replace `main` with your project's actual base branch. The installed framework does
not grant permission to publish a PR, merge, release or deploy.

## If you get stuck

- **Skill missing:** restart the session, check the installed location, and inspect the
  runtime's discovery rules. Resolve duplicate global/repo names explicitly.
- **Install conflict:** inspect and back up changed content before refreshing. A shared
  global conflict requires explicit refresh; the installer preserves existing ledgers.
- **Specialist unavailable:** some skills need browser/MCP or other stack-specific tools.
  Follow the handoff rather than assuming every specialist works in a fresh environment.
- **Unexpected behavior:** include runtime/model, framework version, prompt, expected
  behavior and a redacted trace in a [report](https://github.com/ishansing/skills-framework/issues/new/choose).

More: [reference and troubleshooting](reference.md#troubleshooting) ·
[validation evidence](validation.md) · [project overview](../README.md).
