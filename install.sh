#!/usr/bin/env bash
# Idea-to-Production framework installer.
# Usage: install.sh [TARGET] [--menu] [--skills-scope global|repo] [--checkpoints off|phase|slice] [options]
set -euo pipefail

FS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET=""
INIT=0
DRY_RUN=0
REFRESH=0
STRICT=0
WARNINGS=0
GLOBAL_SKILLS="${HOME}/.agents/skills"
SCOPE=global
CHECKPOINTS=""
MENU=0
YES=0
ARG_COUNT=$#
STAGE=""
trap '[ -z "$STAGE" ] || rm -rf "$STAGE"' EXIT

usage() {
  cat <<'EOF'
Usage: install.sh [TARGET] [options]

Install the idea-to-production framework into TARGET (default: current directory).

Options:
  --menu               choose options interactively (or supply scripted answers)
  --yes                skip final menu confirmation (does not skip menu choices)
  --skills-scope MODE  upstream skills: global (default) or repo; ITP remains per-project
  --checkpoints MODE   seed missing ledger: off (false), phase, or slice
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
    --menu) MENU=1 ;;
    --yes) YES=1 ;;
    --skills-scope|--checkpoints)
      flag="$1"; [ "$#" -ge 2 ] || die "$flag requires a value"
      if [ "$flag" = --skills-scope ]; then SCOPE="$2"; else CHECKPOINTS="$2"; fi
      shift ;;
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
[ "$ARG_COUNT" -ne 0 ] || [ ! -t 0 ] || MENU=1
ask() {
  printf '%s [%s]: ' "$1" "$2" >&2
  IFS= read -r REPLY || die "menu input ended; installation cancelled"
  REPLY="${REPLY:-$2}"
}
if [ "$MENU" = 1 ]; then
  step "Installation menu (all choices also have flags)"
  ask "Project: 1 existing, 2 new directory + Git" 1
  case "$REPLY" in 1) ;; 2) INIT=1 ;; *) die "invalid project choice" ;; esac
  ask "Project path" "$TARGET"; TARGET="$REPLY"
  ask "Upstream skills: 1 global/shared, 2 repo-local/self-contained (ITP always project-local)" 1
  case "$REPLY" in 1) SCOPE=global ;; 2) SCOPE=repo ;; *) die "invalid skill scope" ;; esac
  if [ ! -e "$TARGET/.itp/run.md" ]; then
    ask "Checkpoint default: 1 off, 2 phase, 3 slice" 1
    case "$REPLY" in 1) CHECKPOINTS=off ;; 2) CHECKPOINTS=phase ;; 3) CHECKPOINTS=slice ;; *) die "invalid checkpoints" ;; esac
  else note "existing ledger preserved; checkpoint prompt skipped"; fi
  ask "Refresh conflicting skill content? y/n" n
  case "$REPLY" in y|yes) REFRESH=1 ;; n|no) REFRESH=0 ;; *) die "invalid refresh choice" ;; esac
  ask "Strict warnings? y/n" y
  case "$REPLY" in y|yes) STRICT=1 ;; n|no) STRICT=0 ;; *) die "invalid strict choice" ;; esac
  note "target=$TARGET; init=$INIT; scope=$SCOPE; checkpoints=${CHECKPOINTS:-preserve}; refresh=$REFRESH; strict=$STRICT; dry-run=$DRY_RUN"
  if [ "$YES" = 0 ]; then
    ask "Continue? y install, p dry-run preview, n cancel" n
    case "$REPLY" in y|yes) ;; p) DRY_RUN=1 ;; n|no) note "cancelled; target and global files unchanged"; exit 0 ;; *) die "invalid confirmation" ;; esac
  fi
fi
case "$SCOPE" in global|repo) ;; *) die "--skills-scope must be global or repo" ;; esac
case "$CHECKPOINTS" in ""|off|phase|slice) ;; *) die "--checkpoints must be off, phase or slice" ;; esac

# --- preflight ---------------------------------------------------------------
[ -f "$FS/dependency.md" ] || die "missing $FS/dependency.md"
[ -f "$FS/dependency.json" ] || die "missing $FS/dependency.json (run scripts/generate-dependency-json.mjs)"
[ -f "$FS/skills.lock.json" ] || die "missing $FS/skills.lock.json"
[ -f "$FS/.agents/skills/idea-to-production/SKILL.md" ] || die "missing framework skills in $FS/.agents/skills"

command -v node >/dev/null 2>&1 || die "Node 20+ required; no partial dependency installation"
node -e 'if(Number(process.versions.node.split(".")[0])<20)process.exit(1)' || die "Node 20+ required"
TARGET="$(node -e 'console.log(require("path").resolve(process.argv[1]))' "$TARGET")"
if [ "$SCOPE" = repo ]; then GLOBAL_SKILLS="$TARGET/.agents/skills"; fi
node "$FS/scripts/install-config.mjs" --preflight "$FS" "$TARGET" "$SCOPE" "$CHECKPOINTS" || die "project preflight failed"
if [ -f "$FS/distribution.json" ]; then node "$FS/scripts/build-install-bundle.mjs" --verify "$FS" || die "distribution verification failed"; fi

step "Idea-to-Production installer"
note "framework: $FS"
note "version:   v$(cat "$FS/VERSION")"
note "target:    $TARGET"
note "upstream scope: $SCOPE; checkpoint seed: ${CHECKPOINTS:-none}"
[ "$DRY_RUN" = 1 ] && note "mode:      dry-run"

if [ ! -d "$TARGET" ]; then
  if [ "$INIT" = 1 ]; then
    run mkdir -p "$TARGET"
  else
    die "target does not exist: $TARGET (use --init to create it)"
  fi
fi
if [ "$INIT" = 1 ] && [ ! -e "$TARGET/.git" ]; then
  command -v git >/dev/null || die "Git required only for requested new-project initialization"
  run git -C "$TARGET" init -q
fi

hash_dir() {
  node "$FS/scripts/skill-hash.mjs" "$1"
}

# --- upstream skills ---------------------------------------------------------
step "Upstream skills (${GLOBAL_SKILLS})"
LOCK_TSV=""
LOCK_TSV="$(node -e '
    const fs = require("fs");
    const lock = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    for (const s of lock.skills) {
      console.log([s.id, s.repo, s.commit, s.path, s.contentSha256, s.vendored ? 1 : 0].join("\t"));
    }
  ' "$FS/skills.lock.json")"

install_upstream() { # id repo commit path
  local id="$1" repo="$2" commit="$3" path="$4"
  local dest="$GLOBAL_SKILLS/$id" cache_dir
  if [ -d "$FS/upstream/$id" ]; then cache_dir="$FS/upstream/$id";
  else
    cache_dir="$(node "$FS/scripts/fetch-skill.mjs" "$repo" "$commit")" || die "failed to fetch $repo@$commit"
    cache_dir="$cache_dir/$path"
  fi
  [ -d "$cache_dir" ] || die "$repo@$commit has no skill directory"
  install_tree "$cache_dir" "$dest" "$sha"
}

install_tree() {
  local source="$1" dest="$2" expected="$3" previous="" staged backup
  node "$FS/scripts/install-config.mjs" --verify-skill "$source" "$expected" || die "source skill verification failed"
  node "$FS/scripts/install-config.mjs" --safe-path "$dest" || die "unsafe skill destination"
  if [ -d "$dest" ] && [ "$(hash_dir "$dest")" = "$expected" ]; then
    node "$FS/scripts/install-config.mjs" --verify-skill "$dest" "$expected" || die "installed skill contains unsafe entries"
    note "ok $(basename "$dest")"; return
  fi
  if [ -e "$dest" ] && [ "$REFRESH" = 0 ]; then
    # A project record cannot authorize replacing another project's shared skill.
    if ! { [ "$SCOPE" = global ] && [ "$(dirname "$dest")" = "$GLOBAL_SKILLS" ]; } && [ -f "$TARGET/.itp/install.json" ]; then
      previous="$(node -e 'const j=require(process.argv[1]);console.log(j.managedSkills?.[process.argv[2]]||"")' "$TARGET/.itp/install.json" "$(basename "$dest")")"
    fi
    [ -n "$previous" ] && [ -d "$dest" ] && [ "$(hash_dir "$dest")" = "$previous" ] || die "$(basename "$dest") differs from managed content; use --refresh-upstream only after review"
    node "$FS/scripts/install-config.mjs" --verify-skill "$dest" "$previous" || die "unsafe managed skill"
  fi
  if [ "$DRY_RUN" = 1 ]; then note "[dry-run] verified install $source -> $dest"; return; fi
  mkdir -p "$(dirname "$dest")"
  staged="$(mktemp -d "$(dirname "$dest")/.itp-stage.XXXXXX")"
  cp -R "$source/." "$staged/"
  if ! node "$FS/scripts/install-config.mjs" --verify-skill "$staged" "$expected"; then rm -rf "$staged"; die "staged hash mismatch; destination preserved"; fi
  backup="$staged.previous"
  if [ -e "$dest" ]; then mv "$dest" "$backup"; fi
  if ! mv "$staged" "$dest"; then
    [ ! -e "$backup" ] || mv "$backup" "$dest"
    rm -rf "$staged"; die "activation failed; previous skill restored"
  fi
  rm -rf "$backup"
}

if [ -n "$LOCK_TSV" ]; then
  while IFS=$'\t' read -r id repo commit path sha vendored; do
    [ -n "${id:-}" ] || continue
    [ "$vendored" = "1" ] && continue
    dest="$GLOBAL_SKILLS/$id"
    if [ -f "$dest/SKILL.md" ] && [ "$(hash_dir "$dest")" = "$sha" ]; then
      node "$FS/scripts/install-config.mjs" --verify-skill "$dest" "$sha" || die "unsafe existing skill"
      note "ok $id"
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
if [ "$DRY_RUN" = 0 ]; then STAGE="$(mktemp -d)"; fi
for src in "$FS"/.agents/skills/*/; do
  name="$(basename "$src")"
  dest="$TARGET/.agents/skills/$name"
  if [ -e "$dest" ] && [ "$src" -ef "$dest" ]; then
    note "ok $name (already in place)"
    continue
  fi
  if [ "$DRY_RUN" = 1 ]; then note "[dry-run] install framework $name -> $dest";
  else
    staged_source="$STAGE/$name"; cp -R "$src" "$staged_source"
    if [ "$name" = idea-to-production ]; then cp "$FS/VERSION" "$staged_source/VERSION"; fi
    install_tree "$staged_source" "$dest" "$(hash_dir "$staged_source")"
  fi
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
for f in dependency.md dependency.json skills.lock.json; do
  if [ -e "$TARGET/$f" ] && [ "$FS/$f" -ef "$TARGET/$f" ]; then
    note "ok $f (already in place)"
  else
    note "$f (configured by scope-aware metadata writer)"
  fi
done
if [ "$DRY_RUN" = 1 ]; then note "[dry-run] write scope-aware registry and seed missing ledger";
else node "$FS/scripts/install-config.mjs" --apply "$FS" "$TARGET" "$SCOPE" "$CHECKPOINTS" || die "metadata configuration failed"; fi

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
    { line = $0; sub(/\r$/, "", line) }
    line == begin { print block; skip = 1; next }
    line == end { skip = 0; next }
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
if [ "$DRY_RUN" = 0 ] && [ -f "$CHECKER" ]; then
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
