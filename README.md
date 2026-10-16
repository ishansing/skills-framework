# Idea-to-Production

**A repeatable engineering workflow for your AI coding agent.**

Guide your agent from a rough idea through specification, implementation, review and
verification—with checkpoints, resumable artifacts and pinned skills.

[![CI](https://github.com/ishansing/skills-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/ishansing/skills-framework/actions/workflows/ci.yml) [![Latest release](https://img.shields.io/github/v/release/ishansing/skills-framework)](https://github.com/ishansing/skills-framework/releases/latest) [![License: MIT](https://img.shields.io/github/license/ishansing/skills-framework)](https://github.com/ishansing/skills-framework/blob/master/LICENSE)

<img src="https://raw.githubusercontent.com/ishansing/skills-framework/master/docs/assets/lifecycle.svg" width="960" height="320" alt="Clarify the work with research and specifications, build in tested slices, then review and verify the result.">

[Get started](#get-started) · [First task](#try-one-small-task) · [Documentation](#documentation) · [Contribute](#contributing)

## Spend less time re-explaining the process

Coding agents can write code. Getting them to clarify requirements, preserve context,
review changes and show verification evidence takes a repeatable workflow.

Idea-to-Production (ITP) composes curated Agent Skills into that workflow:

- **Specify before building.** Turn a vague request into acceptance criteria and
  independently testable slices.
- **Keep a resumable trail.** Specs, decisions, review findings and the run ledger live
  in your repository. Checkpoints let you steer before the next phase.
- **Ask for evidence before completion.** Review and verification instructions require
  fresh checks and make unresolved findings explicit.

Start with an existing project, use an individual phase, or invoke the full lifecycle.
Existing artifacts let the workflow skip unnecessary phases.

## Get started

Install into an existing project or create a new one—no framework clone required:

```sh
curl -fsSL https://github.com/ishansing/skills-framework/releases/latest/download/bootstrap.sh | bash
```

The menu asks for your project, global or repo-local upstream skills, checkpoint
defaults and confirmation. Framework adapters are always installed per project.

**Requirements:** Bash, Node 20+, curl, tar, and `sha256sum` or `shasum`. Git is needed
when creating a new Git project. Some specialist skills need additional tools.

Restart your agent session after installation so it discovers the skills. **OpenCode is
the primary runtime used for validation**; other Agent-Skills-compatible runtimes need
their own discovery and behavior checks.

The curl command executes the downloaded bootstrap. Downloads use HTTPS and SHA-256
checksums, without signatures. Read the
[installation and trust details](https://github.com/ishansing/skills-framework/blob/master/docs/reference.md#install)
for script inspection, version pinning, offline installation and upgrades.

## Try one small task

In a clean or backed-up working tree in your project, give your agent a bounded goal:

```text
Load the idea-to-production skill.
Goal: Add a --limit option to this project's CLI. It must accept a positive integer,
reject invalid values with a helpful error, and have tests for both cases.
Use phase checkpoints so I can review the plan before implementation.
```

Adapt the task to your project. The agent should inspect the code, clarify any material
ambiguity and choose the phases the work needs. At each checkpoint, review the artifacts
and say `continue` or request a change.

Look for:

- A specification with testable acceptance criteria.
- The implementation and tests for your actual stack.
- Review findings and verification commands with observed results.
- `.itp/run.md` recording progress and the resume point.

For a guided first run, setup help and the expected artifact paths, use
[Getting started](https://github.com/ishansing/skills-framework/blob/master/docs/getting-started.md).
This is a suggested exercise, not a recorded demonstration or a performance benchmark.

## How it works

```text
research → align → spec → architecture → slice → implement → review → verify
```

The `idea-to-production` root routes the work. Thin `itp-*` adapters load approved,
pinned skills for each phase; they do not reproduce those skills' procedures.
Use the whole route or start at the phase that matches your existing evidence.

| Your task | Entry point |
|---|---|
| Develop an idea or feature | `idea-to-production` |
| Implement an approved slice or fix a clear bug | `itp-implement` |
| Diagnose an unknown failure | `itp-incident` |
| Review a diff against its spec | `itp-review` |
| Gather evidence for an external question | `itp-research` |

The root is explicitly invoked. Missing capabilities or decisions that require a person
produce a handoff; checkpoints are optional. See the
[workflow reference](https://github.com/ishansing/skills-framework/blob/master/docs/reference.md#running-the-lifecycle)
for prompts, right-sizing, checkpoints and phase details.

## What to expect

- **A skills framework, not an enforcement runtime.** Gates guide the agent's behavior;
  model compliance varies. The separate runtime enforcement harness is not implemented.
- **Inspectable dependencies.** The registry and lockfile record approved skills,
  invocation classes, exact upstream revisions and content hashes.
- **Human control.** Installation, workflow checkpoints, product decisions and release
  authorization remain explicit. Verified code changes do not imply deployment.
- **Evidence with scope.** Script/contract checks and dated behavioral runs cover
  different things. Read the [validation overview](https://github.com/ishansing/skills-framework/blob/master/docs/validation.md)
  for tested paths and limitations.

## Documentation

| Read | For |
|---|---|
| [Getting started](https://github.com/ishansing/skills-framework/blob/master/docs/getting-started.md) | Install, discover skills and complete a first task |
| [Installation reference](https://github.com/ishansing/skills-framework/blob/master/docs/reference.md#install) | Flags, scope, offline use, trust and troubleshooting |
| [Workflow reference](https://github.com/ishansing/skills-framework/blob/master/docs/reference.md#running-the-lifecycle) | Phase routing, checkpoints, artifacts and right-sizing |
| [Validation overview](https://github.com/ishansing/skills-framework/blob/master/docs/validation.md) | Automated checks and dated behavioral evidence |
| [Framework specification](https://github.com/ishansing/skills-framework/blob/master/SKILL-FRAMEWORK.md) | Lifecycle contracts and design |
| [Dependency registry](https://github.com/ishansing/skills-framework/blob/master/dependency.md) | Approved skills, provenance and invocation classes |
| [Maintenance reference](https://github.com/ishansing/skills-framework/blob/master/docs/reference.md#updating-the-framework) | Re-pins, releases, Skill Watch and adoption previews |

## Contributing

Try a small task and tell us where setup or the workflow became unclear. Open a
[setup/bug report or feature proposal](https://github.com/ishansing/skills-framework/issues/new/choose),
or follow the [contribution guide](https://github.com/ishansing/skills-framework/blob/master/CONTRIBUTING.md)
for documentation, examples, tests and skill-integration changes.

## Credits and license

ITP composes upstream work from Matt Pocock, Trail of Bits, Vercel, Anthropic, OpenAI,
awesome-copilot and others. See the
[registry](https://github.com/ishansing/skills-framework/blob/master/dependency.md) and
[lockfile](https://github.com/ishansing/skills-framework/blob/master/skills.lock.json)
for exact sources and pins. Credit does not imply endorsement; upstream license terms
remain applicable.

The framework is [MIT licensed](https://github.com/ishansing/skills-framework/blob/master/LICENSE).
