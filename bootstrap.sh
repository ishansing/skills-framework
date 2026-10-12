#!/usr/bin/env bash
# Release bootstrap. Installer logic lives in the verified archive.
set -euo pipefail
version="${ITP_VERSION:-}"
base="${ITP_RELEASE_BASE_URL:-https://github.com/ishansing/skills-framework}"
args=()
while [ "$#" -gt 0 ]; do
  case "$1" in
    --version) [ "$#" -ge 2 ] || { printf 'error: --version needs a value\n' >&2; exit 1; }; version="$2"; shift ;;
    --help|-h) printf 'Usage: bootstrap.sh [--version X.Y.Z] [TARGET] [installer options]\nNo arguments opens the menu when a terminal is available. Requires Bash, curl, tar, Node 20+ and a SHA-256 utility.\n'; exit 0 ;;
    *) args+=("$1") ;;
  esac
  shift
done
for tool in curl tar node; do command -v "$tool" >/dev/null || { printf 'error: %s is required\n' "$tool" >&2; exit 1; }; done
node -e 'if(Number(process.versions.node.split(".")[0])<20)process.exit(1)' || { printf 'error: Node 20+ required\n' >&2; exit 1; }
case "$base" in https://*) ;; *) printf 'error: release base must use HTTPS\n' >&2; exit 1 ;; esac
base="${base%/}"
temp="$(mktemp -d)"
trap 'rm -rf "$temp"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
download() { curl --proto '=https' --proto-redir '=https' --fail --silent --show-error --location --connect-timeout 20 --max-time 300 "$1" -o "$2"; }
if [ -z "$version" ]; then
  location="$(curl --proto '=https' --proto-redir '=https' -fsSL --connect-timeout 20 --max-time 60 -o /dev/null -w '%{url_effective}' "$base/releases/latest")"
  version="${location##*/}"
fi
version="${version#v}"
[[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { printf 'error: invalid release version\n' >&2; exit 1; }
archive="idea-to-production-v$version.tar.gz"
asset="$base/releases/download/v$version"
download "$asset/SHA256SUMS" "$temp/SHA256SUMS" || { printf 'error: release has no install assets; use an asset-bearing release\n' >&2; exit 1; }
download "$asset/$archive" "$temp/$archive"
expected="$(awk -v file="$archive" '$2 == file {print $1}' "$temp/SHA256SUMS")"
[[ "$expected" =~ ^[a-fA-F0-9]{64}$ ]] || { printf 'error: missing/ambiguous archive checksum\n' >&2; exit 1; }
if command -v sha256sum >/dev/null; then actual="$(sha256sum "$temp/$archive")";
elif command -v shasum >/dev/null; then actual="$(shasum -a 256 "$temp/$archive")";
else printf 'error: sha256sum or shasum required\n' >&2; exit 1; fi
[ "${actual%% *}" = "$expected" ] || { printf 'error: archive checksum mismatch\n' >&2; exit 1; }
tar tzf "$temp/$archive" > "$temp/entries"
while IFS= read -r path; do
  case "$path" in idea-to-production|idea-to-production/|idea-to-production/*) ;; *) printf 'error: unsafe archive root\n' >&2; exit 1 ;; esac
  clean="${path%/}"
  case "/$clean/" in *'/../'*|*'/./'*|*'//'*) printf 'error: unsafe archive path\n' >&2; exit 1 ;; esac
done < "$temp/entries"
tar tvzf "$temp/$archive" | while IFS= read -r entry; do
  case "$entry" in d*|-*) ;; *) printf 'error: archive links/special entries rejected\n' >&2; exit 1 ;; esac
done
tar xzf "$temp/$archive" -C "$temp"
package="$temp/idea-to-production"
[ "$(tr -d '\r\n' < "$package/VERSION")" = "$version" ] || { printf 'error: release version differs from package\n' >&2; exit 1; }
tty_menu=0
if [ "${#args[@]}" -eq 0 ]; then args+=(--menu); tty_menu=1;
elif [ -z "${BASH_SOURCE[0]:-}" ]; then
  for arg in "${args[@]}"; do [ "$arg" != --menu ] || tty_menu=1; done
fi
if [ "$tty_menu" = 1 ]; then
  if (exec 9</dev/tty) 2>/dev/null; then bash "$package/install.sh" "${args[@]}" </dev/tty;
  else printf 'error: no terminal; pass TARGET and options, or run with --menu and scripted input\n' >&2; exit 1; fi
else bash "$package/install.sh" "${args[@]}"; fi
