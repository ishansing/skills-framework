# Contributing to Idea-to-Production

Start with a small task and share what was useful or unclear. Documentation fixes,
reproducible examples, regression tests and well-scoped integration proposals are welcome.

## Report or propose

Use [the issue forms](https://github.com/ishansing/skills-framework/issues/new/choose)
for setup/bugs and feature proposals. Include the framework version, runtime/model,
selected skill, expected outcome and a minimal reproduction. Redact credentials,
private code and personal information from logs and screenshots.

For a larger change, describe the user problem, proposed scope and acceptance criteria
before implementation. See `agent-work/INDEX.md` for active plans; avoid duplicating
an existing effort. A proposal is not approval to adopt a new skill.

## Local checks

Use Node 20+ and Bash:

```sh
npm ci --ignore-scripts
npm test
node tests/skills/check-contracts.mjs
bash -n install.sh bootstrap.sh
git diff --check
```

CI also runs pinned actionlint and fresh source/release-bundle installation smokes.
For installer changes, use isolated homes/projects; never test by overwriting your
personal installed skills. See the existing distribution tests for the fixture seam.

## What belongs where

- User-facing overview and first steps: `README.md` and `docs/`.
- Framework contracts and routing: `SKILL-FRAMEWORK.md` and `.agents/skills/itp-*/`.
- Approved skill inventory and pins: `dependency.md`, generated `dependency.json`,
  and `skills.lock.json`.
- Script regressions: `tests/scripts/`; behavioral agent cases: `tests/skills/`.
- Implementation plans and handoffs: `agent-work/`, linked from its index.

Examples should name the runtime/model, starting point, prompt, exact checks and
observed results. Label illustrative examples and edited/time-compressed recordings.
Use reproducible evidence for comparative claims; do not imply an untested runtime is supported.
README documentation/image URLs point to GitHub so the compact release bundle's README
does not depend on a documentation tree that it does not ship.

## Skills and lifecycle changes

Keep adapters thin and compose approved skills rather than copying their procedures.
Skill integrations require provenance/license review, exact revision/content hashes,
appropriate invocation class and trigger, registry/lock updates, and relevant validation.
Do not install or substitute unapproved skills during a lifecycle run.

Run the static contract check after adapter, registry or lock changes. Upstream re-pins
and lifecycle/contract changes also need affected behavioral cases and a golden run,
with model/date and scope recorded. Automated script tests alone do not replace these.
Use the existing [behavioral guide](tests/skills/README.md) and [validation overview](docs/validation.md).

## Pull requests and releases

Explain the problem, change, documentation impact, checks and remaining limits. Follow
the PR template and keep intended files separate from unrelated local work.
Preserve upstream credit and license notices; the framework is MIT licensed.

Releases are maintainer-dispatched through the Release workflow after review and checks.
Do not manually tag/publish or assume a code contribution authorizes deployment.
