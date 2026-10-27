#!/usr/bin/env python3
"""Create a new local fixture from a trusted strict-installed framework; never run an agent."""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

source, output, name = sys.argv[1:]
source, output = Path(source).resolve(), Path(output).resolve()
data = json.loads(Path(__file__).with_name("pr-comments-inputs.json").read_text())
case = data["cases"][name]
if output in (Path("/"), Path.home()) or source == output or source in output.parents:
    raise ValueError("choose a disposable fixture parent outside home/root/source")
target = output / name
target.mkdir(parents=True, exist_ok=False)
for item in [".agents/skills", ".opencode/agents", "AGENTS.md", "dependency.md", "dependency.json", "skills.lock.json"]:
    origin, destination = source / item, target / item
    destination.parent.mkdir(parents=True, exist_ok=True)
    if origin.is_dir():
        shutil.copytree(origin, destination, symlinks=True)
    else:
        shutil.copyfile(origin, destination)

def write(files):
    for relative, text in files.items():
        path = Path(relative)
        if path.is_absolute() or ".." in path.parts:
            raise ValueError("fixture path must be contained")
        destination = target / path
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(text)

write(data["before"])
env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
env.update(GIT_CONFIG_NOSYSTEM="1", GIT_CONFIG_GLOBAL="/dev/null")
for args in [["init", "-q"], ["add", "."], ["-c", "user.name=I2P Fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "Seed comment fixture"]]:
    subprocess.run(["git", "-c", "core.hooksPath=/dev/null", "-C", str(target), *args], env=env, check=True)
write(data["after"])
if case.get("context"):
    write({"delivery-context.md": case["context"]})
config = data["config"]
if case.get("deny_gh"):
    permissions = config["agents"]["comment-probe"]["permissions"]
    config["agents"]["comment-probe"]["permissions"] = [p for p in permissions if not (p["action"] == "shell" and p["resource"].startswith("gh "))]
if case.get("missing_skill"):
    (target / ".agents/skills/leaving-pr-comments").rename(target / ".unavailable-comment-skill")
write({"opencode.json": json.dumps(config, indent=2) + "\n", ".fixture-mode": case["mode"] + "\n", "prompt.txt": case["prompt"]})
print(target)
