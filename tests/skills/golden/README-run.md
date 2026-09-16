# Golden Cases - How To Run

Both golden cases need a repository with real code and tests; the standard one also needs a
human to answer the alignment interview.

## Sandboxes

Create or recreate either sandbox (outside the framework repo):

```sh
bash tests/skills/golden/setup-sandbox.sh /path/to/I2P ~/itp-golden-app
bash tests/skills/golden/setup-sandbox.sh /path/to/I2P ~/itp-small-app
```

Each is a tiny Node app (`src/members.js`, `test/members.test.js`) with the framework
installed and one passing test.

## Standard case (`add-collaborator-invitations.md`)

1. `cd ~/itp-golden-app && git status` - clean, on `master`.
2. Start a fresh agent session in that directory and paste:

   ```text
   Load the `idea-to-production` skill. Goal: owners can invite a collaborator by email; the
   invitee accepts the invitation and becomes a member; an email that was not invited cannot
   become a member. Build this end to end.
   ```

3. Answer the alignment/grilling questions as the product owner.

## Small case (`small-localized-change.md`)

1. `cd ~/itp-small-app && git status` - clean, on `master`.
2. Start a fresh session there and paste:

   ```text
   Load the `idea-to-production` skill. Goal: normalize emails in src/members.js - trim and
   lowercase on add and lookup, and reject non-string input.
   ```

3. No interview is expected; the run should skip align's grilling and architecture per the
   small tier.

## What to record

Score each run against its fixture and record it in `tests/skills/results/` with the date,
including the metrics from `.agents/skills/idea-to-production/references/artifacts.md`: scale,
phases completed, skills loaded, artifacts written, code lines changed, doc-to-code ratio, and
approximate duration.
