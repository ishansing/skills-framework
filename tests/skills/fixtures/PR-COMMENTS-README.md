# Reproduce the native PR-comment cases

Inputs are in `pr-comments-inputs.json`: exact prompts, synthetic identities/review,
application before/after bytes and agent permission configuration. No real private data,
credentials or review clearance is included. `pr-comments-gh.py` is the networkless fake
tool. `setup-pr-comments.py` only creates a new local fixture/Git seed; it never installs,
invokes a model, fetches GitHub or overwrites an existing destination.

Prerequisites: an explicitly authorized disposable **strict repo-local installation** of
the proposed framework, Python 3, Git, Node and the tested OpenCode/model with existing
provider authentication. Source base for the recorded integration is `cc49991` plus its
proposed changes; exact adapted bytes are in the lock. Do not use a personal project as
the source. Building/installing a local bundle uses the existing approved installer; the
setup helper copies only installed skills/agent/registry/instruction paths, not personal
code or credentials. Use the same reviewed source revision when repeating a recorded case.

Run from the framework checkout, substituting the already-installed disposable path:

```bash
set -e
FRAMEWORK="$PWD"
INSTALLED=/path/to/disposable/strict-repo-local-install
RUN="$(mktemp -d /tmp/opencode/pr-comment-native-XXXXXX)"
mkdir -p "$RUN/bin" "$RUN/home" "$RUN/config/opencode" "$RUN/state"
install -m 755 tests/skills/fixtures/pr-comments-gh.py "$RUN/bin/gh"
printf '%s\n' '{"$schema":"https://opencode.ai/config.json","update":"disable"}' > "$RUN/config/opencode/opencode.json"
python3 tests/skills/fixtures/setup-pr-comments.py "$INSTALLED" "$RUN/cases" positive
cd "$RUN/cases/positive"
HOME="$RUN/home" XDG_CONFIG_HOME="$RUN/config" XDG_STATE_HOME="$RUN/state" PATH="$RUN/bin:$PATH" \
  timeout 300 opencode run --standalone --model openai/gpt-6.1-sol --agent comment-probe \
  --format json "$(cat prompt.txt)" > "$RUN/positive.jsonl" 2> "$RUN/positive.stderr"
```

Keep the existing `XDG_DATA_HOME`/provider-auth setup if using the same authentication as
the recorded runs; no credentials are copied. This permits provider traffic/session
storage and is **not OS isolation**. Only fake `gh` is allowed for GitHub operations.
Check the selected source directory in native skill output and inspect fake request logs,
not only a final success sentence. Record host/model/revision, session and actual outputs.

For another case, run the setup helper with the case key and the same fresh parent, then
execute the saved prompt in its directory. All keys are explicit in the JSON. Missing-skill
setup moves only that fixture's copy outside skill discovery; incomplete-context setup
removes fake-GitHub permissions. No real-global skill is removed or changed.

`positive` now allows the separate delivery record. To reproduce the earlier denied-record
observation, remove only the `edit docs/work/delivery.md` allow rule from that fixture's
config **before** running. After its single successful fake post and safe handoff, restore
that rule and resume the recorded session with:

```text
The fixture now permits docs/work/delivery.md. Resume only the blocked local delivery-record write and final result using the existing actual synthetic receipt. Do not post or call gh again; the comment was already delivered once. Keep verification and delivery status separate.
```

Use `--session <actual-session-id>` and capture a separate resume trace. Combined request
logs must still contain exactly one post. `author-harness-fallback` retains the initial
ambiguous context that caused unwanted body expansion; the `-delimited` variant is the
controlled correction, not a hidden replacement. Neither simulates an entire unknown-model
host: it tests supplied original-author metadata separately from the formatter's own model.

Retain denied/blocked/deviating traces and distinguish direct-specialist preflight from
composed verification. No live publishing or repeatability claim follows from one run.

## Ordinary small-golden regression

The changed adapter contract also needs the existing `small-localized-change` regression
without any comment grant. `pr-comments-golden.json` preserves its actual prompt, config
and synthetic context files. After an explicitly authorized isolated install, use the
existing `tests/skills/golden/setup-sandbox.sh` with the proposed framework/bundle and a
fresh target (HOME must be temporary: that script defaults upstream installation to global
within that HOME). Overlay `files` plus `config` as opencode.json from the saved JSON;
write its `prompt` to a file, then invoke the same bounded CLI with agent `process-golden`
in that target. Its setup/seed remains in the existing golden script, not another runner.

This recorded config denies edit/delegation tools for reviewers but still allows local
Git staging/commit shell commands. Reviewers are instructed to be read-only; do not call
that deterministic read-only enforcement. Capture actual reviewer calls, source selection,
red/green tests and fresh verification. With no comment authorization the new specialist
must not load and no posting tool may run. Preserve the untracked notes exactly.
