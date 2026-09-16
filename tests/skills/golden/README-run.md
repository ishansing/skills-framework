# Golden Case - How To Run

The golden case (`add-collaborator-invitations.md`) needs a repository with real code and
tests, so it runs in `sandbox/golden-app` (untracked; see the framework repo `.gitignore`).

## Setup

```sh
cd sandbox/golden-app
git status          # a tiny Node app with one passing test suite
```

## Run

Start a fresh OpenCode session with `sandbox/golden-app` as the working directory, then use
exactly this prompt:

```text
Load the `idea-to-production` skill. Goal: an owner can invite a collaborator by email, and
the invitee can accept the invitation to become a member. The app is the invitation store in
src/invites.js with tests in test/invites.test.js. Build this end to end.
```

During the run, answer the phase questions like a product owner (alignment will interview
you). Do not add instructions beyond the answers.

## What to record

Copy `add-collaborator-invitations.md` expectations and fill in:

- required adapters and children actually loaded, in order
- conditional triggers evaluated (differential-review should trigger on invitation tokens)
- artifacts produced under `docs/product/`, `docs/architecture/`, `docs/work/`, `.itp/run.md`
- whether `itp-verify` ran commands in that session before any completion claim
- anything forbidden that happened (runtime skill install, recursive `to-spec`)

Then record the outcome in `tests/skills/results/` with the date. The sandbox stays local and
is never committed.
