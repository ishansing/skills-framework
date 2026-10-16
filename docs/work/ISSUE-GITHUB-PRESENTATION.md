# GitHub presentation refresh

Approved direction: `agent-work/plans/MARKETING-PLAN.md`, P0 and the next implementation
slice. Baseline: `5b3c992` (v4.0.0); branch `feature/github-presentation`.
Scope: presentable GitHub README, preserved linked technical reference, first-task guide,
validation/support overview, simple lifecycle visual, contribution/feedback paths, and
repository About/topics. No lifecycle, dependency, installer or runtime behavior changes.

## Acceptance criteria

- AC-1: README leads with benefits, install and a bounded first task; the live v4 install
  is described accurately, and historical evidence moves behind links.
- AC-2: Detailed original guidance remains accessible; new local/GitHub documentation
  links and anchors resolve against the intended repository tree. Absolute GitHub URLs
  keep the compact release README usable without changing bundle contents.
- AC-3: Visual is readable, self-contained and accessible with alternative text; README
  is inspected at desktop/mobile sizes and light/dark backgrounds using rendered Markdown.
- AC-4: Runtime support and evidence limits remain accurate; the suggested first task
  is labeled illustrative, not represented as a newly observed runtime demonstration.
- AC-5: Contribution guide and valid setup/bug and proposal issue forms provide a clear
  feedback path. Repository About/topics match approved positioning.
- AC-6: Documentation/link/YAML/render checks and existing contracts pass; review and
  fresh verification record actual results and remaining launch work.

Documentation-only validation: use rendered Markdown, link/anchor checks, form schema
checks and browser screenshots, not unit tests mirroring prose. A fresh newcomer task,
recorded native demo and custom social-preview upload are follow-up launch work; no new
native-runtime compatibility proof is claimed by this presentation change.
