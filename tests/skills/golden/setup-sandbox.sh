#!/usr/bin/env bash
# Create a golden-case sandbox: installs the framework and seeds the tiny members app.
# Usage: setup-sandbox.sh <path-to-framework-repo> <target-dir>
set -euo pipefail

FS="${1:?usage: setup-sandbox.sh <framework-repo> <target-dir>}"
TARGET="${2:?usage: setup-sandbox.sh <framework-repo> <target-dir>}"

bash "$FS/install.sh" --init "$TARGET" --strict

mkdir -p "$TARGET/src" "$TARGET/test"
cat > "$TARGET/package.json" <<'EOF'
{ "name": "golden-app", "private": true, "type": "module", "scripts": { "test": "node --test" } }
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

git -C "$TARGET" config user.email "golden@example.com"
git -C "$TARGET" config user.name "Golden Sandbox"
git -C "$TARGET" add -A
git -C "$TARGET" commit -qm "initial workspace app with direct membership"
echo "sandbox ready: $TARGET"
