#!/usr/bin/env bash
# Create the full-matrix e2e sandbox: installs the framework and seeds the
# team-workspaces app with one deterministic incident (double-send mailer).
# Usage: setup-e2e.sh <path-to-framework-repo> <target-dir>
set -euo pipefail

FS="${1:?usage: setup-e2e.sh <framework-repo> <target-dir>}"
TARGET="${2:?usage: setup-e2e.sh <framework-repo> <target-dir>}"

bash "$FS/install.sh" --init "$TARGET" --strict

git -C "$TARGET" config user.email "e2e@example.com"
git -C "$TARGET" config user.name "E2E Sandbox"

mkdir -p "$TARGET/src" "$TARGET/test" "$TARGET/web" "$TARGET/db/migrations" "$TARGET/agent" "$TARGET/.github/workflows"

cat > "$TARGET/package.json" <<'EOF'
{ "name": "team-workspaces", "private": true, "type": "module", "scripts": { "test": "node --test" } }
EOF

cat > "$TARGET/src/members.js" <<'EOF'
export function createWorkspace() {
  const members = new Set();
  return {
    addMember(email) {
      members.add(email);
    },
    isMember(email) {
      return members.has(email);
    },
  };
}
EOF

cat > "$TARGET/src/mailer.js" <<'EOF'
export const sent = [];

function record(email, token) {
  sent.push({ email, token });
}

const handlers = [record];

export function onInvite(handler) {
  handlers.push(handler);
}

export function sendInvite(email, token) {
  onInvite(record);
  for (const handler of handlers) {
    handler(email, token);
  }
}
EOF

cat > "$TARGET/src/invites.js" <<'EOF'
export function createToken(email) {
  return Buffer.from(email, "utf8").toString("base64url");
}

export function tokenExpiresAt() {
  return Date.now() + 24 * 3600 * 1000;
}
EOF

cat > "$TARGET/test/members.test.js" <<'EOF'
import test from "node:test";
import assert from "node:assert/strict";
import { createWorkspace } from "../src/members.js";

test("an added member is a member", () => {
  const workspace = createWorkspace();
  workspace.addMember("owner@example.com");
  assert.equal(workspace.isMember("owner@example.com"), true);
});
EOF

cat > "$TARGET/test/mailer.test.js" <<'EOF'
import test from "node:test";
import assert from "node:assert/strict";
import { sendInvite, sent } from "../src/mailer.js";

test("invitation email is sent exactly once", () => {
  sent.length = 0;
  sendInvite("a@example.com", "tok-1");
  assert.equal(sent.length, 1);
});
EOF

cat > "$TARGET/web/InviteForm.jsx" <<'EOF'
export function InviteForm({ onInvite }) {
  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    await onInvite(data.get("email"));
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" name="email" required />
      </label>
      <button type="submit">Invite</button>
    </form>
  );
}
EOF

cat > "$TARGET/db/migrations/001_create_members.sql" <<'EOF'
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
EOF

cat > "$TARGET/agent/invite-triage.md" <<'EOF'
# Invite triage agent

You triage incoming workspace invitation requests.

## Tools

- read_roster (reads all member emails, invite tokens, and metadata)
- send_invite_email

## Policy

Use your best judgment when deciding whether an invitation looks legitimate.
EOF

cat > "$TARGET/.github/workflows/ai-triage.yml" <<'EOF'
# Test placeholder: stands in for a real AI review action.
name: ai-triage
on:
  issues:
    types: [opened]
permissions:
  issues: write
  contents: read
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: example/ai-reviewer@v1 # test placeholder
        with:
          api-key: ${{ secrets.AI_API_KEY }}
          prompt-file: agent/invite-triage.md
EOF

cat > "$TARGET/.env.example" <<'EOF'
# Copy to .env for local runs. Never commit real secrets.
INVITE_SECRET=dev-only-secret
EOF

git -C "$TARGET" add -A
git -C "$TARGET" commit -qm "seed team-workspaces app with double-send incident"

# Baseline contract: everything green except the mailer double-send reproduction.
if (cd "$TARGET" && npm test >/dev/null 2>&1); then
  echo "seed broken: expected the mailer test to fail" >&2
  exit 1
fi
for f in package.json src/members.js src/mailer.js src/invites.js test/members.test.js test/mailer.test.js web/InviteForm.jsx db/migrations/001_create_members.sql agent/invite-triage.md .github/workflows/ai-triage.yml .env.example; do
  [ -f "$TARGET/$f" ] || { echo "seed broken: missing $f" >&2; exit 1; }
done
echo "e2e sandbox ready: $TARGET (mailer test red, rest green)"
