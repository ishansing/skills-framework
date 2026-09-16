#!/usr/bin/env bash
# Idea-to-Production framework installer.
# Usage: install.sh [TARGET] [--init] [--dry-run] [--refresh-upstream]
set -euo pipefail

FS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET=""
INIT=0
DRY_RUN=0
REFRESH=0
STRICT=0
WARNINGS=0
GLOBAL_SKILLS="${HOME}/.agents/skills"

usage() {
  cat <<'EOF'
Usage: install.sh [TARGET] [options]

Install the idea-to-production framework into TARGET (default: current directory).

Options:
  --init               create TARGET (and git init) if it does not exist
  --dry-run            print every action; change nothing
  --refresh-upstream   reinstall upstream skills that fail the lockfile hash check
  --strict             exit non-zero if any warning was reported
  --check-version      compare the framework version with the latest release, then exit
  -h, --help           show this help
EOF
}

die() { printf 'error: %s\n' "$*" >&2; exit 1; }
note() { printf '  %s\n' "$*"; }
step() { printf '\n%s\n' "$*"; }
warn() { WARNINGS=$((WARNINGS + 1)); printf 'warning: %s\n' "$*" >&2; }

run() {
  if [ "$DRY_RUN" = 1 ]; then
    printf '  [dry-run] %s\n' "$*"
  else
    "$@"
  fi
}

while [ $# -gt 0 ]; do
  case "$1" in
    --check-version) node "$FS/scripts/check-framework-version.mjs" "$(cat "$FS/VERSION")"; exit $? ;;
    --init) INIT=1 ;;
    --dry-run) DRY_RUN=1 ;;
    --refresh-upstream) REFRESH=1 ;;
    --strict) STRICT=1 ;;
    -h|--help) usage; exit 0 ;;
    --*) die "unknown option: $1" ;;
    *) [ -z "$TARGET" ] || die "unexpected argument: $1"; TARGET="$1" ;;
  esac
  shift
done
TARGET="${TARGET:-$PWD}"

# --- preflight ---------------------------------------------------------------
[ -f "$FS/dependency.md" ] || die "missing $FS/dependency.md"
[ -f "$FS/skills.lock.json" ] || die "missing $FS/skills.lock.json"
[ -f "$FS/.agents/skills/idea-to-production/SKILL.md" ] || die "missing framework skills in $FS/.agents/skills"

HAS_NODE=0
command -v node >/dev/null 2>&1 && HAS_NODE=1

step "Idea-to-Production installer"
note "framework: $FS"
note "version:   v$(cat "$FS/VERSION")"
note "target:    $TARGET"
[ "$DRY_RUN" = 1 ] && note "mode:      dry-run"

if [ ! -d "$TARGET" ]; then
  if [ "$INIT" = 1 ]; then
    run mkdir -p "$TARGET"
    run git -C "$TARGET" init -q
  else
    die "target does not exist: $TARGET (use --init to create it)"
  fi
fi

hash_dir() {
  node "$FS/scripts/skill-hash.mjs" "$1"
}

# --- upstream skills ---------------------------------------------------------
step "Upstream skills (${GLOBAL_SKILLS})"
LOCK_TSV=""
if [ "$HAS_NODE" = 1 ]; then
  LOCK_TSV="$(node -e '
    const fs = require("fs");
    const lock = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    for (const s of lock.skills) {
      console.log([s.id, s.repo, s.commit, s.path, s.contentSha256, s.vendored ? 1 : 0].join("\t"));
    }
  ' "$FS/skills.lock.json")"
else
  warn "node not found: skipping upstream dependency installation"
fi

install_upstream() { # id repo commit path
  local id="$1" repo="$2" commit="$3" path="$4"
  local dest="$GLOBAL_SKILLS/$id" cache_dir
  cache_dir="$(node "$FS/scripts/fetch-skill.mjs" "$repo" "$commit")" ||
    die "failed to fetch $repo@$commit"
  [ -d "$cache_dir/$path" ] || die "$repo@$commit has no path $path"
  printf '  fetching %s from %s@%s\n' "$id" "$repo" "${commit:0:12}"
  rm -rf "$dest.tmp.$$"
  mkdir -p "$(dirname "$dest")"
  cp -r "$cache_dir/$path" "$dest.tmp.$$"
  rm -rf "$dest"
  mv "$dest.tmp.$$" "$dest"
}

if [ -n "$LOCK_TSV" ]; then
  while IFS=$'\t' read -r id repo commit path sha vendored; do
    [ -n "${id:-}" ] || continue
    [ "$vendored" = "1" ] && continue
    dest="$GLOBAL_SKILLS/$id"
    if [ -f "$dest/SKILL.md" ] && [ "$(hash_dir "$dest")" = "$sha" ]; then
      note "ok $id"
      continue
    fi
    if [ -f "$dest/SKILL.md" ] && [ "$REFRESH" != 1 ]; then
      warn "$id exists with different content; leaving it (use --refresh-upstream)"
      continue
    fi
    if [ "$DRY_RUN" = 1 ]; then
      note "[dry-run] install $id from $repo@${commit:0:12}"
      continue
    fi
    install_upstream "$id" "$repo" "$commit" "$path"
    [ "$(hash_dir "$dest")" = "$sha" ] || warn "$id installed but content hash differs from the lockfile"
    note "installed $id"
  done <<< "$LOCK_TSV"
fi

# --- framework skills --------------------------------------------------------
step "Framework skills -> $TARGET/.agents/skills"
run mkdir -p "$TARGET/.agents/skills"
for src in "$FS"/.agents/skills/*/; do
  name="$(basename "$src")"
  dest="$TARGET/.agents/skills/$name"
  if [ -e "$dest" ] && [ "$src" -ef "$dest" ]; then
    note "ok $name (already in place)"
    continue
  fi
  run rm -rf "$dest"
  run cp -r "$src" "$dest"
  note "$name"
done

step "Framework version"
if [ "$FS" -ef "$TARGET" ]; then
  note "skipped: target is the framework repo itself"
else
  run mkdir -p "$TARGET/.agents/skills/idea-to-production"
  run cp "$FS/VERSION" "$TARGET/.agents/skills/idea-to-production/VERSION"
  note "v$(cat "$FS/VERSION")"
fi

step "Registry"
for f in dependency.md skills.lock.json; do
  if [ -e "$TARGET/$f" ] && [ "$FS/$f" -ef "$TARGET/$f" ]; then
    note "ok $f (already in place)"
  else
    run cp "$FS/$f" "$TARGET/$f"
    note "$f"
  fi
done

# --- subagent ----------------------------------------------------------------
AGENT_SRC="$FS/.opencode/agents/adversarial-modeler.md"
if [ -f "$AGENT_SRC" ]; then
  step "Subagent"
  run mkdir -p "$TARGET/.opencode/agents"
  if [ -e "$TARGET/.opencode/agents/adversarial-modeler.md" ] &&
     [ "$AGENT_SRC" -ef "$TARGET/.opencode/agents/adversarial-modeler.md" ]; then
    note "ok adversarial-modeler (already in place)"
  else
    run cp "$AGENT_SRC" "$TARGET/.opencode/agents/adversarial-modeler.md"
    note "adversarial-modeler (for differential-review)"
  fi
fi

# --- AGENTS.md ---------------------------------------------------------------
AGENTS_BLOCK="$(cat <<'EOF'
<!-- idea-to-production:begin -->
## Idea-to-Production Framework Rules

- The lifecycle root is `idea-to-production`. Invoke it explicitly; it is not auto-invoked.
- Use framework adapters (`itp-*`) rather than reproducing their procedures manually.
- Use only pre-installed skills listed in `dependency.md` / `skills.lock.json`.
- Do not install, upgrade, search for, or substitute skills during a run.
- Prefer Matt Pocock skills for primary engineering process.
- Add specialist skills only when their documented trigger applies.
- Never recursively invoke skills classified as user entry points.
- If the same failure recurs without new evidence, stop and ask the user.
- Do not claim completion until `itp-verify` runs with fresh evidence.
<!-- idea-to-production:end -->
EOF
)"
step "AGENTS.md rules"
AGENTS_FILE="$TARGET/AGENTS.md"
if [ "$FS" -ef "$TARGET" ]; then
  note "skipped: target is the framework repo itself"
elif [ "$DRY_RUN" = 1 ]; then
  note "[dry-run] upsert rules block in $AGENTS_FILE"
elif [ ! -f "$AGENTS_FILE" ]; then
  printf '%s\n' "$AGENTS_BLOCK" > "$AGENTS_FILE"
  note "created $AGENTS_FILE"
elif grep -q 'idea-to-production:begin' "$AGENTS_FILE"; then
  tmp="$AGENTS_FILE.tmp.$$"
  awk -v begin='<!-- idea-to-production:begin -->' -v end='<!-- idea-to-production:end -->' -v block="$AGENTS_BLOCK" '
    $0 == begin { print block; skip = 1; next }
    $0 == end { skip = 0; next }
    !skip { print }
  ' "$AGENTS_FILE" > "$tmp" && mv "$tmp" "$AGENTS_FILE"
  note "updated rules block in $AGENTS_FILE"
else
  printf '\n%s\n' "$AGENTS_BLOCK" >> "$AGENTS_FILE"
  note "appended rules block to $AGENTS_FILE"
fi

# --- verification ------------------------------------------------------------
step "Verification"
CHECKER="$FS/tests/skills/check-contracts.mjs"
if [ "$DRY_RUN" = 0 ] && [ "$HAS_NODE" = 1 ] && [ -f "$CHECKER" ]; then
  if out="$(node "$CHECKER" "$TARGET" 2>&1)"; then
    note "contract check passed ($(printf '%s' "$out" | grep -c '^ok') checks)"
  else
    printf '%s\n' "$out" >&2
    warn "contract check reported failures (see above)"
  fi
else
  note "skipped (dry-run, or node/checker unavailable)"
fi

step "Next steps"
cat <<EOF
  1. Restart your agent session so the new skills are discovered.
  2. Optional once per repo: run setup-matt-pocock-skills (configures the issue tracker
     that code-review uses).
  3. Start a lifecycle:
     Load the \`idea-to-production\` skill. Goal: <what you want built>.
EOF

if [ "$STRICT" = 1 ] && [ "$WARNINGS" -gt 0 ]; then
  printf '\nerror: %s warning(s) in --strict mode\n' "$WARNINGS" >&2
  exit 1
fi
