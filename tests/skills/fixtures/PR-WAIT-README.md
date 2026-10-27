# Reproduce bounded PR observations

Use an explicitly authorized disposable strict repo-local installation of the proposed
framework, Python 3, Git, Node and the existing OpenCode/model/provider authentication.
No real PR operations or global refresh are authorized. `pr-wait-inputs.json` retains
prompts/config and synthetic context; `pr-wait-gh.py` is the networkless read-only tool.
The local arithmetic diff and synthetic review are reused from the existing PR-comment
setup; they are test data, not independent review or live head correspondence.

From this framework checkout, set `INSTALLED` to that disposable installation and create
a fresh `RUN` directory under `/tmp/opencode`. Set `CASE` to one explicit JSON case key.
The following setup reuses the existing fixture seed without another setup runner:

```bash
mkdir -p "$RUN/bin" "$RUN/home" "$RUN/config/opencode" "$RUN/state"
install -m 755 tests/skills/fixtures/pr-wait-gh.py "$RUN/bin/gh"
python3 tests/skills/fixtures/setup-pr-comments.py "$INSTALLED" "$RUN/$CASE" positive
python3 - "$RUN/$CASE/positive" "$CASE" <<'PY'
import json, sys
from pathlib import Path
target, key = Path(sys.argv[1]), sys.argv[2]
data = json.loads(Path('tests/skills/fixtures/pr-wait-inputs.json').read_text())
case = data['cases'][key]
for name, text in {
    'opencode.json': json.dumps(data['config'], indent=2),
    'monitor-context.md': data['context'],
    'monitor-fixture.json': json.dumps({'mode': 'pending' if case.get('baseline') else case['mode'], **({'head': case['head']} if 'head' in case else {})}),
    'prompt.txt': data['common'] + case['prompt'],
}.items():
    (target / name).write_text(text + '\n')
PY
```

For `positive` only, record a pending baseline first by running the bundled command in
that target with the isolated HOME/state/PATH, expected SHAs above and `--timeout 1`.
Keep exit 124 and raw output as setup evidence, then change only `monitor-fixture.json`
to `{"mode":"comment"}` before the native invocation. This deliberately creates a new
synthetic comment between watches; it is not a live event or timing reliability test.

Run from the case target, with the same state/PATH used for baseline setup:

```bash
HOME="$RUN/home" XDG_CONFIG_HOME="$RUN/config" XDG_STATE_HOME="$RUN/state" PATH="$RUN/bin:$PATH" \
  timeout 240 opencode run --standalone --model openai/gpt-6.1-sol --agent monitor-probe \
  --format json "$(cat prompt.txt)" > "$RUN/$CASE.jsonl" 2> "$RUN/$CASE.stderr"
```

Use a different `RUN` per case so state does not cross cases. Keep existing provider-auth
storage without copying credentials; provider traffic/session storage is not OS isolation.
Set the global isolated OpenCode config to `{"update":"disable"}` as in the comment
guide. Retain actual native source selection, skill/tool calls, watcher result, local
verification and any deviation/denial. Fake read logs must show allowed reads only.
No observation proves deterministic prompt resistance or cross-host authorization.

The affected `small-localized-change` golden reuses `pr-comments-golden.json` and the
existing golden setup procedure; with no monitoring grant, `babysit-pr` must not load.
