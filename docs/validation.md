# Validation and support scope

Idea-to-Production is a skills framework with automated checks and manually observed
agent behavior. These provide different evidence; neither guarantees that every model
or runtime will follow every instruction.

## Runtime support

**OpenCode is the primary runtime used for behavioral validation.** The framework uses
Agent Skills files, but other runtimes need their own discovery, metadata, tool and
workflow validation. This project does not claim an independently verified compatibility
matrix across all coding agents. See the runtime/model notes in each dated result.

The separate enforcement harness described in the framework plans is not implemented.
Review and verification gates are instructions and artifact contracts, not a sandbox
or an independent mechanism that forces model compliance.

## Automated checks

From a framework checkout:

```sh
npm ci --ignore-scripts
npm test
node tests/skills/check-contracts.mjs
bash -n install.sh bootstrap.sh
```

The script suite covers helpers, installation/distribution, discovery and adoption-preview
behavior. The contract checker verifies registry/lock consistency, invocation classes,
adapter structure, vendored hashes and installed-local location/name requirements.
Its global status checks do not independently prove every machine-global skill exists.

[CI](https://github.com/ishansing/skills-framework/actions/workflows/ci.yml) also performs
workflow lint and isolated source/bundle installation checks. Passing CI is not proof
of native skill invocation or successful completion of an arbitrary project.

## Behavioral evidence

The [behavioral case guide](../tests/skills/README.md) explains isolation, composition,
failure and end-to-end cases. Dated results record the prompts, environment and observed
outcomes. Historical evidence applies to its tested baseline, not automatically to
every subsequent pin or model.

Useful entry points:

- [Readiness-gate closure](../tests/skills/results/2026-10-01-readiness-gate-closed.md):
  historical framework campaign closure, with its original scope.
- [Matt v1.3 native follow-up](../tests/skills/results/2026-10-08-matt-v1.3-native.md):
  runtime evidence and explicit conformance limits.
- [Review record](work/review.md) and [verification record](work/verification.md):
  dated implementation reviews and measured results, including curl installation.
- [Curl distribution security review](work/curl-install-security.md): resolved ownership
  finding, reviewed safeguards and remaining operational limits.

The v4.0.0 release workflow built installation assets and smoke-tested both scopes.
Public latest/repo-local and pinned/global curl installs were also exercised in isolated
homes/projects during rollout. See [release CI](https://github.com/ishansing/skills-framework/actions/runs/38261526375)
and the [release](https://github.com/ishansing/skills-framework/releases/tag/v4.0.0).
This is installation evidence, not a claim that arbitrary engineering tasks are solved.

## Reporting a problem

Use a [setup/bug report](https://github.com/ishansing/skills-framework/issues/new/choose)
with the framework version, runtime/model, selected skill, expected outcome and a
redacted reproduction. Separate discovery/setup failures from model instruction-following
failures where possible. The [contribution guide](../CONTRIBUTING.md) explains which
changes need fresh behavioral validation.
