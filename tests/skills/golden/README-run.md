# Golden Case - How To Run

The golden case (`add-collaborator-invitations.md`) needs a repository with real code and
tests, plus a human to answer the alignment interview. `install.sh` prepares one.

## Sandbox

`~/itp-golden-app` is a tiny Node app with the framework installed: `src/members.js` (direct
membership only), `test/members.test.js`, `AGENTS.md`, and the framework skills. No invitation
feature exists yet.

To recreate it from scratch:

```sh
bash /path/to/I2P/install.sh --init ~/itp-golden-app --strict
```

## Run

1. `cd ~/itp-golden-app && git status` - should be clean, on `master`.
2. Start a fresh agent session in that directory.
3. Paste exactly this prompt:

   ```text
   Load the `idea-to-production` skill. Goal: owners can invite a collaborator by email; the
   invitee accepts the invitation and becomes a member; an email that was not invited cannot
   become a member. Build this end to end.
   ```

4. Answer the alignment/grilling questions as the product owner. Otherwise do not add
   instructions.

## What to record

Score the run against `add-collaborator-invitations.md`:

- required adapters and children actually loaded, in order
- conditional triggers evaluated (`differential-review` should fire on invitation tokens; it
  is installed)
- artifacts produced under `docs/product/`, `docs/architecture/`, `docs/work/`, `.itp/run.md`
- whether `itp-verify` ran commands in that session before any completion claim
- anything forbidden that happened (runtime skill install, recursive `to-spec`)
- the final `git log` / `git diff` in the sandbox

Then record the outcome in `tests/skills/results/` with the date. The sandbox is a separate
repository outside the framework repo; keep or delete it afterwards.
