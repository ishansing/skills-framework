import { test } from "node:test";
import assert from "node:assert/strict";
import { chmodSync, cpSync, existsSync, linkSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const script = fileURLToPath(new URL("../../.agents/skills/babysit-pr/scripts/pr-wait", import.meta.url));
const fake = fileURLToPath(new URL("../skills/fixtures/pr-wait-gh.py", import.meta.url));
const HEAD = "a".repeat(40), BASE = "b".repeat(40);
function fixture(mode = "pending") {
  const root = mkdtempSync(join(tmpdir(), "itp-pr-wait-"));
  mkdirSync(join(root, "bin"));
  cpSync(fake, join(root, "bin/gh"));
  // The fake is invoked as a normal installed command, never a real GitHub fallback.
  chmodSync(join(root, "bin/gh"), 0o755);
  writeFileSync(join(root, "monitor-fixture.json"), JSON.stringify({ mode }));
  const env = { ...process.env, HOME: root, XDG_STATE_HOME: join(root, "state"), PATH: `${join(root, "bin")}:${process.env.PATH}` };
  const args = [script, "https://github.com/fixture-owner/fixture-repo/pull/7", "--head", HEAD, "--base", BASE, "--timeout", "1"];
  return { root, env, args, run(extra = []) { return spawnSync("python3", [...args, ...extra], { cwd: root, env, encoding: "utf8", timeout: 5000 }); } };
}

test("watch budget terminates a hung gh subprocess group and returns no merge approval", () => {
  const f = fixture("hang");
  try {
    const started = Date.now(), result = f.run();
    assert.equal(result.status, 124, result.stdout + result.stderr);
    assert.ok(Date.now() - started < 4000);
    const output = JSON.parse(result.stdout.trim().split("\n").at(-1));
    assert.equal(output.outcome, "deadline");
    assert.equal(output.merge_readiness, "unknown");
    assert.equal(output.context.repo, "fixture-owner/fixture-repo");
    assert.equal(output.context.expected_head, HEAD);
    const pid = readFileSync(join(f.root, "hung-child.pid"), "utf8").trim();
    const stat = `/proc/${pid}/stat`;
    if (existsSync(stat)) assert.equal(readFileSync(stat, "utf8").split(") ")[1][0], "Z", "owned descendant must not keep running");
  } finally {
    const pid = join(f.root, "hung-child.pid");
    if (existsSync(pid)) { try { process.kill(Number(readFileSync(pid, "utf8")), "SIGKILL"); } catch {} }
    rmSync(f.root, { recursive: true, force: true });
  }
});

test("watch stops on head/base drift rather than accepting stale context", () => {
  const f = fixture();
  try {
    writeFileSync(join(f.root, "monitor-fixture.json"), JSON.stringify({ head: "c".repeat(40) }));
    const result = f.run();
    assert.equal(result.status, 1, result.stdout + result.stderr);
    const output = JSON.parse(result.stdout.trim().split("\n").at(-1));
    assert.equal(output.outcome, "blocked");
    assert.match(output.reason, /head|base/);
    assert.equal(output.merge_readiness, "unknown");
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("URL/repository mismatch is refused before any GitHub lookup", () => {
  const f = fixture();
  try {
    const result = f.run(["--repo", "other-owner/other-repo"]);
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.equal(existsSync(join(f.root, "gh-reads.jsonl")), false);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("observer refuses legacy readiness modes before GitHub access", () => {
  const f = fixture();
  try {
    const result = f.run(["--until", "ready"]);
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.equal(existsSync(join(f.root, "gh-reads.jsonl")), false);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("private bounded baseline resumes new metadata without exposing comment bodies", () => {
  const f = fixture();
  try {
    assert.equal(f.run().status, 124);
    const state = join(f.root, "state/pr-wait");
    assert.equal(existsSync(state), true, "honor the standard XDG state path");
    assert.equal(statSync(state).mode & 0o777, 0o700);
    const file = join(state, "fixture-owner__fixture-repo__7.json");
    assert.equal(statSync(file).mode & 0o777, 0o600);
    writeFileSync(join(f.root, "monitor-fixture.json"), JSON.stringify({ mode: "comment" }));
    const result = f.run();
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE synthetic|ignore rules/);
    const events = result.stdout.trim().split("\n").map(line => JSON.parse(line));
    assert.ok(events.some(event => event.type === "event" && event.message.includes("comment")));
    assert.equal(events.at(-1).outcome, "observed");
    assert.equal(events.at(-1).merge_readiness, "unknown");
    assert.equal(events.at(-1).context.head, HEAD);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("unsafe state links are refused without overwriting unrelated files", () => {
  for (const name of ["fixture-owner__fixture-repo__7.lock", "fixture-owner__fixture-repo__7.json", null]) {
    const f = fixture();
    try {
      const unrelated = join(f.root, "unrelated");
      writeFileSync(unrelated, "preserve this file");
      mkdirSync(join(f.root, "state"));
      if (name) {
        mkdirSync(join(f.root, "state/pr-wait"), { mode: 0o700 });
        symlinkSync(unrelated, join(f.root, "state/pr-wait", name));
      } else {
        mkdirSync(join(f.root, "external"), { mode: 0o700 });
        symlinkSync(join(f.root, "external"), join(f.root, "state/pr-wait"));
      }
      const result = f.run();
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.equal(JSON.parse(result.stdout.trim().split("\n").at(-1)).outcome, "blocked");
      assert.equal(readFileSync(unrelated, "utf8"), "preserve this file");
    } finally { rmSync(f.root, { recursive: true, force: true }); }
  }
});

test("corrupt and different-context saved state disclose a fresh baseline", () => {
  const f = fixture();
  try {
    assert.equal(f.run().status, 124);
    const file = join(f.root, "state/pr-wait/fixture-owner__fixture-repo__7.json");
    const saved = JSON.parse(readFileSync(file, "utf8"));
    for (const content of ["{corrupt", JSON.stringify({ ...saved, context: { ...saved.context, head: "c".repeat(40) } })]) {
      writeFileSync(file, content);
      writeFileSync(join(f.root, "monitor-fixture.json"), JSON.stringify({ mode: "comment" }));
      const result = f.run();
      assert.equal(result.status, 124, result.stdout + result.stderr);
      assert.match(result.stderr, /new observation baseline.*corrupt.*different-context/);
      assert.doesNotMatch(result.stdout, /"type": "event"/);
      assert.equal(JSON.parse(readFileSync(file, "utf8")).context.head, HEAD);
    }
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("cancellation stops owned CLI descendants and releases exclusive watch ownership", async () => {
  const f = fixture();
  let child;
  try {
    // Establish a baseline, then hang inside a poll while its lock is held.
    assert.equal(f.run().status, 124);
    writeFileSync(join(f.root, "monitor-fixture.json"), JSON.stringify({ mode: "hang-poll" }));
    child = spawn("python3", [...f.args, "--timeout", "4"], { cwd: f.root, env: f.env });
    let output = "";
    child.stdout.on("data", chunk => { output += chunk; });
    const closed = new Promise(resolve => child.on("close", code => resolve(code)));
    const marker = join(f.root, "hung-child.pid");
    for (let i = 0; i < 60 && !existsSync(marker); i++) await delay(25);
    assert.equal(existsSync(marker), true, "first watcher reached its owned poll");
    const duplicate = f.run(["--repo", "Fixture-Owner/Fixture-Repo"]);
    assert.equal(duplicate.status, 2, duplicate.stdout + duplicate.stderr);
    assert.match(duplicate.stdout, /another watcher owns/);
    child.kill("SIGTERM");
    assert.equal(await closed, 130);
    assert.equal(JSON.parse(output.trim().split("\n").at(-1)).outcome, "stopped");
    const pid = readFileSync(marker, "utf8").trim();
    if (existsSync(`/proc/${pid}/stat`)) assert.equal(readFileSync(`/proc/${pid}/stat`, "utf8").split(") ")[1][0], "Z");
    writeFileSync(join(f.root, "monitor-fixture.json"), JSON.stringify({ mode: "comment" }));
    assert.equal(f.run().status, 0, "a new watch can acquire the released lock");
  } finally {
    child?.kill("SIGKILL");
    const marker = join(f.root, "hung-child.pid");
    if (existsSync(marker)) { try { process.kill(Number(readFileSync(marker, "utf8")), "SIGKILL"); } catch {} }
    rmSync(f.root, { recursive: true, force: true });
  }
});

test("denied or malformed API reads block without exposing raw server responses", () => {
  for (const mode of ["api-denied", "malformed", "malformed-url", "malformed-threads"]) {
    const f = fixture(mode);
    try {
      const result = f.run();
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE synthetic|ignore rules|Traceback/);
      const output = JSON.parse(result.stdout.trim().split("\n").at(-1));
      assert.equal(output.outcome, "blocked");
      assert.equal(output.merge_readiness, "unknown");
    } finally { rmSync(f.root, { recursive: true, force: true }); }
  }
});

test("head movement during check sampling blocks the observation", () => {
  const f = fixture("drift-on-checks");
  try {
    const result = f.run();
    assert.equal(result.status, 1, result.stdout + result.stderr);
    const output = JSON.parse(result.stdout.trim().split("\n").at(-1));
    assert.equal(output.outcome, "blocked");
    assert.match(output.reason, /head\/base changed/);
    assert.equal(output.context.head, "c".repeat(40));
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("a conflicting GitHub host is refused before any lookup", () => {
  const f = fixture();
  try {
    f.env.GH_HOST = "unapproved.example.invalid";
    const result = f.run();
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.equal(existsSync(join(f.root, "gh-reads.jsonl")), false);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("denied policy reads remain unknown rather than an empty configured gate", () => {
  const f = fixture("policy-denied");
  try {
    const result = f.run();
    assert.equal(result.status, 124, result.stdout + result.stderr);
    assert.match(result.stderr, /required.check policy unknown/);
    assert.doesNotMatch(result.stderr, /none set|every CI check gates/);
    assert.equal(JSON.parse(result.stdout.trim().split("\n").at(-1)).merge_readiness, "unknown");
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("invalid finite arguments are rejected before reads and base drift blocks", () => {
  const f = fixture();
  try {
    for (const extra of [["--timeout", "0"], ["--timeout", "-1"], ["--timeout", "nan"], ["--timeout", "inf"], ["--head", "abc"], ["--base", "abc"]]) {
      assert.equal(f.run(extra).status, 2, JSON.stringify(extra));
      assert.equal(existsSync(join(f.root, "gh-reads.jsonl")), false);
    }
    writeFileSync(join(f.root, "monitor-fixture.json"), JSON.stringify({ base: "c".repeat(40) }));
    const result = f.run();
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.equal(JSON.parse(result.stdout.trim().split("\n").at(-1)).context.base, "c".repeat(40));
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("failed checks and conflicts are blocked observations, never readiness", () => {
  for (const response of [{ mode: "failed-check" }, { merge_state: "DIRTY" }]) {
    const f = fixture();
    try {
      writeFileSync(join(f.root, "monitor-fixture.json"), JSON.stringify(response));
      const result = f.run();
      assert.equal(result.status, 1, result.stdout + result.stderr);
      const output = JSON.parse(result.stdout.trim().split("\n").at(-1));
      assert.equal(output.outcome, "blocked");
      assert.equal(output.merge_readiness, "unknown");
      assert.ok(readFileSync(join(f.root, "gh-reads.jsonl"), "utf8").trim().split("\n").map(JSON.parse).every(read => read.allowed));
    } finally { rmSync(f.root, { recursive: true, force: true }); }
  }
});

test("stale and oversized state are disclosed new baselines, not resumed evidence", () => {
  const f = fixture();
  try {
    assert.equal(f.run().status, 124);
    const file = join(f.root, "state/pr-wait/fixture-owner__fixture-repo__7.json");
    const old = new Date(Date.now() - 7 * 3600 * 1000);
    utimesSync(file, old, old);
    for (const oversized of [false, true]) {
      if (oversized) writeFileSync(file, " ".repeat(1024 * 1024 + 1));
      const result = f.run();
      assert.equal(result.status, 124, result.stdout + result.stderr);
      assert.match(result.stderr, /new observation baseline.*stale.*oversized/);
      assert.ok(statSync(file).size < 1024 * 1024);
    }
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});

test("nonprivate and multiply linked state files are refused before truncation", () => {
  for (const unsafe of ["mode", "hardlink"]) {
    const f = fixture();
    try {
      const state = join(f.root, "state/pr-wait");
      mkdirSync(state, { recursive: true, mode: 0o700 });
      const file = join(state, "fixture-owner__fixture-repo__7.lock");
      const unrelated = join(f.root, "unrelated");
      writeFileSync(unrelated, "preserve unrelated", { mode: 0o600 });
      if (unsafe === "hardlink") linkSync(unrelated, file);
      else { writeFileSync(file, "preserve lock"); chmodSync(file, 0o644); }
      const result = f.run();
      assert.equal(result.status, 2, result.stdout + result.stderr);
      assert.match(result.stdout, /private.*owned regular/);
      assert.equal(readFileSync(unrelated, "utf8"), "preserve unrelated");
      assert.equal(readFileSync(file, "utf8"), unsafe === "mode" ? "preserve lock" : "preserve unrelated");
    } finally { rmSync(f.root, { recursive: true, force: true }); }
  }
});

test("transient retry backoff stays within the original finite budget", () => {
  const f = fixture("transient");
  try {
    const started = Date.now(), result = f.run();
    assert.equal(result.status, 124, result.stdout + result.stderr);
    assert.ok(Date.now() - started < 4000);
    assert.doesNotMatch(result.stdout + result.stderr, /PRIVATE synthetic|ignore rules/);
    assert.equal(JSON.parse(result.stdout.trim().split("\n").at(-1)).outcome, "deadline");
    assert.equal(readFileSync(join(f.root, "gh-reads.jsonl"), "utf8").trim().split("\n").length, 1);
  } finally { rmSync(f.root, { recursive: true, force: true }); }
});
