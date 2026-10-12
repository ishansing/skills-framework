import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, cpSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync, spawnSync, spawn } from "node:child_process";
import { createServer } from "node:https";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { buildDistribution } from "../../scripts/build-install-bundle.mjs";
import { dirHash } from "../../scripts/skill-hash.mjs";
import { buildRegistry } from "../../scripts/generate-dependency-json.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
async function fixture() {
  const base = mkdtempSync(join(tmpdir(), "itp-dist-")), source = join(base, "source"), upstream = join(base, "upstream"), out = join(base, "assets");
  mkdirSync(join(source, ".agents/skills/idea-to-production"), { recursive: true });
  writeFileSync(join(source, ".agents/skills/idea-to-production/SKILL.md"), '---\nname: idea-to-production\ndescription: Root fixture\nmetadata:\n  invocation-class: user\n---\n# Root\n');
  mkdirSync(join(upstream, "skills/sample"), { recursive: true });
  writeFileSync(join(upstream, "skills/sample/SKILL.md"), '---\nname: "sample"\ndescription: Upstream fixture\n---\n' + 'reference\n'.repeat(170));
  const dep = '# Idea-to-Production - Dependency Map\n\n## Upstream inventory\n\n| Skill ID | Source | Invocation class | Status | Used by |\n|---|---|---|---|---|\n| sample | acme/skills | model | installed-global | none |\n';
  writeFileSync(join(source, "dependency.md"), dep);
  writeFileSync(join(source, "dependency.json"), JSON.stringify(buildRegistry(dep)));
  const lock = { version: 1, framework: "idea-to-production@2", skills: [{ id: "sample", repo: "acme/skills", commit: "a".repeat(40), path: "skills/sample", contentSha256: dirHash(join(upstream, "skills/sample")), invocationClass: "model" }] };
  writeFileSync(join(source, "skills.lock.json"), JSON.stringify(lock));
  mkdirSync(join(source, ".opencode/agents"), { recursive: true });
  writeFileSync(join(source, ".opencode/agents/adversarial-modeler.md"), "# Agent fixture\n");
  for (const file of ["VERSION", "LICENSE", "README.md"]) writeFileSync(join(source, file), file === "VERSION" ? "1.2.3\n" : "Fixture\n");
  for (const file of ["install.sh", "bootstrap.sh"]) cpSync(join(ROOT, file), join(source, file));
  cpSync(join(ROOT, "scripts"), join(source, "scripts"), { recursive: true });
  mkdirSync(join(source, "tests/skills"), { recursive: true });
  cpSync(join(ROOT, "tests/skills/check-contracts.mjs"), join(source, "tests/skills/check-contracts.mjs"));
  await buildDistribution({ root: source, output: out, fetchRepository: () => upstream });
  const extracted = join(base, "extracted"); mkdirSync(extracted);
  execFileSync("tar", ["xzf", join(out, "idea-to-production-v1.2.3.tar.gz"), "-C", extracted]);
  return { base, source, upstream, out, package: join(extracted, "idea-to-production"), lock };
}

test("release bundle installs quoted/large upstream skills repo-local without cloning", async () => {
  const f = await fixture();
  try {
    const home = join(f.base, "home"), target = join(f.base, "project"), bin = join(f.base, "bin");
    mkdirSync(home); mkdirSync(target); mkdirSync(bin);
    writeFileSync(join(bin, "git"), '#!/bin/sh\nprintf "Git must not run for this install" >&2\nexit 88\n', { mode: 0o755 });
    const run = spawnSync("bash", [join(f.package, "install.sh"), target, "--skills-scope", "repo", "--checkpoints", "slice", "--strict"], {
      encoding: "utf8", env: { ...process.env, HOME: home, PATH: `${bin}:${process.env.PATH}` },
    });
    assert.equal(run.status, 0, run.stdout + run.stderr);
    assert.equal(dirHash(join(target, ".agents/skills/sample")), f.lock.skills[0].contentSha256);
    assert.equal(JSON.parse(readFileSync(join(target, "dependency.json"))).skills.sample.status, "installed-local");
    assert.match(readFileSync(join(target, ".itp/run.md"), "utf8"), /checkpoints: slice/);
    assert.equal(existsSync(join(home, ".agents/skills")), false);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("managed upgrades preserve changes on conflict, reject symlink paths and protect subagent files", async () => {
  const f = await fixture();
  try {
    const home = join(f.base, "home"), target = join(f.base, "project"); mkdirSync(home); mkdirSync(target);
    const env = { ...process.env, HOME: home };
    const run = () => spawnSync("bash", [join(f.package, "install.sh"), target, "--skills-scope", "repo", "--strict"], { encoding: "utf8", env });
    assert.equal(run().status, 0);
    writeFileSync(join(target, ".agents/skills/sample/SKILL.md"), "My edits\n");
    assert.notEqual(run().status, 0);
    assert.equal(readFileSync(join(target, ".agents/skills/sample/SKILL.md"), "utf8"), "My edits\n");
    cpSync(join(f.package, "upstream/sample/SKILL.md"), join(target, ".agents/skills/sample/SKILL.md"));
    writeFileSync(join(target, ".opencode/agents/adversarial-modeler.md"), "Personal agent\n");
    assert.notEqual(run().status, 0);
    assert.equal(readFileSync(join(target, ".opencode/agents/adversarial-modeler.md"), "utf8"), "Personal agent\n");
    cpSync(join(f.package, ".opencode/agents/adversarial-modeler.md"), join(target, ".opencode/agents/adversarial-modeler.md"));
    rmSync(join(target, ".agents/skills/sample"), { recursive: true }); symlinkSync(join(f.upstream, "skills/sample"), join(target, ".agents/skills/sample"));
    assert.notEqual(run().status, 0);
    rmSync(join(target, ".agents/skills/sample"));
    writeFileSync(join(f.source, ".agents/skills/idea-to-production/SKILL.md"), readFileSync(join(f.source, ".agents/skills/idea-to-production/SKILL.md"), "utf8") + "Updated root\n");
    writeFileSync(join(f.source, "VERSION"), "1.2.4\n");
    const out = join(f.base, "upgrade"); await buildDistribution({ root: f.source, output: out, fetchRepository: () => f.upstream });
    execFileSync("tar", ["xzf", join(out, "idea-to-production-v1.2.4.tar.gz"), "-C", join(f.base, "extracted")]);
    const result = run(); assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(readFileSync(join(target, ".agents/skills/idea-to-production/SKILL.md"), "utf8"), /Updated root/);
    assert.equal(readFileSync(join(target, ".agents/skills/idea-to-production/VERSION"), "utf8"), "1.2.4\n");
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("a project ownership record cannot authorize replacement of a conflicting global skill", async () => {
  const f = await fixture();
  try {
    const home = join(f.base, "home"), target = join(f.base, "project"), skill = join(home, ".agents/skills/sample");
    mkdirSync(skill, { recursive: true }); mkdirSync(join(target, ".itp"), { recursive: true });
    const policy = "---\nname: sample\ndescription: Shared policy\n---\nRequire approval.\n";
    writeFileSync(join(skill, "SKILL.md"), policy);
    for (const scope of ["repo", "global"]) {
      writeFileSync(join(target, ".itp/install.json"), JSON.stringify({ version: 1, scope, managedSkills: { sample: dirHash(skill) } }));
      const result = spawnSync("bash", [join(f.package, "install.sh"), target, "--strict"], { encoding: "utf8", env: { ...process.env, HOME: home } });
      assert.notEqual(result.status, 0); assert.match(result.stderr, /use --refresh-upstream/);
      assert.equal(readFileSync(join(skill, "SKILL.md"), "utf8"), policy);
    }
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

function child(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, options); let output = "";
    proc.stdout.on("data", data => { output += data; }); proc.stderr.on("data", data => { output += data; });
    proc.on("error", reject); proc.on("close", status => resolve({ status, output }));
    proc.stdin.end(options.input || "");
  });
}

test("real HTTPS bootstrap: latest, pinned, corrupt checksum, unsafe archive, piped TTY menu and cleanup", async () => {
  const f = await fixture(); let server;
  try {
    const home = join(f.base, "home"), temp = join(f.base, "temps"), cert = join(f.base, "cert.pem"), key = join(f.base, "key.pem"); mkdirSync(home); mkdirSync(temp);
    execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", key, "-out", cert, "-days", "1", "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost"], { stdio: "ignore" });
    let corrupt = false, unsafe = false; const requests = [];
    const archiveName = "idea-to-production-v1.2.3.tar.gz";
    const bad = join(f.base, "unsafe.tar.gz");
    symlinkSync("/etc/passwd", join(f.package, "unsafe-link"));
    execFileSync("tar", ["czf", bad, "-C", join(f.base, "extracted"), "idea-to-production"]);
    rmSync(join(f.package, "unsafe-link"));
    server = createServer({ key: readFileSync(key), cert: readFileSync(cert) }, (req, res) => {
      requests.push(req.url);
      if (req.url === "/releases/latest") { res.writeHead(302, { Location: "/releases/tag/v1.2.3" }); res.end(); return; }
      if (req.url === "/releases/tag/v1.2.3") { res.end("release fixture"); return; }
      if (req.url === "/releases/download/v1.2.3/bootstrap.sh") { res.end(readFileSync(join(f.out, "bootstrap.sh"))); return; }
      if (req.url === "/releases/download/v1.2.3/SHA256SUMS") {
        res.end(corrupt ? `${"0".repeat(64)}  ${archiveName}\n` : unsafe ? `${createHash("sha256").update(readFileSync(bad)).digest("hex")}  ${archiveName}\n` : readFileSync(join(f.out, "SHA256SUMS"))); return;
      }
      if (req.url === `/releases/download/v1.2.3/${archiveName}`) { res.end(readFileSync(unsafe ? bad : join(f.out, archiveName))); return; }
      res.writeHead(404); res.end();
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const base = `https://localhost:${server.address().port}`;
    const env = { ...process.env, HOME: home, TMPDIR: temp, CURL_CA_BUNDLE: cert, ITP_RELEASE_BASE_URL: base };
    for (const versionArgs of [[], ["--version", "1.2.3"]]) {
      requests.length = 0;
      const target = join(f.base, versionArgs.length ? "pinned" : "latest"); mkdirSync(target);
      const result = await child("bash", [join(ROOT, "bootstrap.sh"), ...versionArgs, target, "--skills-scope", "repo", "--strict"], { env });
      assert.equal(result.status, 0, result.output);
      assert.equal(requests.includes("/releases/latest"), !versionArgs.length);
      assert.equal(existsSync(join(target, ".agents/skills/sample/SKILL.md")), true); assert.deepEqual(readdirSync(temp), []);
    }
    const untouched = join(f.base, "untouched");
    corrupt = true;
    let result = await child("bash", [join(ROOT, "bootstrap.sh"), "--version", "1.2.3", untouched, "--init"], { env });
    assert.notEqual(result.status, 0); assert.match(result.output, /checksum mismatch/); assert.equal(existsSync(untouched), false); assert.deepEqual(readdirSync(temp), []);
    corrupt = false; unsafe = true;
    result = await child("bash", [join(ROOT, "bootstrap.sh"), "--version", "1.2.3", untouched, "--init"], { env });
    assert.notEqual(result.status, 0); assert.match(result.output, /links\/special entries rejected/); assert.equal(existsSync(untouched), false); assert.deepEqual(readdirSync(temp), []);
    unsafe = false;
    result = await child("bash", [join(ROOT, "bootstrap.sh"), "--version", "9.9.9", untouched], { env });
    assert.notEqual(result.status, 0); assert.match(result.output, /no install assets/); assert.deepEqual(readdirSync(temp), []);
    // A real controlling terminal, with stdin occupied by curl's script pipe.
    const python = `import os, pty, select, sys, time
pid, fd = pty.fork()
if pid == 0:
    os.execvp('bash', ['bash', '-c', 'curl -fsSL "$ITP_RELEASE_BASE_URL/releases/download/v1.2.3/bootstrap.sh" | bash ' + sys.argv[2]])
os.write(fd, sys.argv[1].encode())
end = time.time() + 30
while time.time() < end:
    ready, _, _ = select.select([fd], [], [], 0.1)
    if ready:
        try: data = os.read(fd, 65536)
        except OSError: break
        if not data: break
        sys.stdout.buffer.write(data); sys.stdout.flush()
else:
    os.kill(pid, 9)
_, status = os.waitpid(pid, 0)
sys.exit(os.waitstatus_to_exitcode(status))`;
    for (const flags of ["", "-s -- --menu"]) {
      const ttyTarget = join(f.base, flags ? "explicit tty project" : "tty project");
      result = await child("python3", ["-c", python, `2\n${ttyTarget}\n2\n2\nn\ny\ny\n`, flags], { env });
      assert.equal(result.status, 0, result.output); assert.match(result.output, /Installation menu/);
      assert.equal(existsSync(join(ttyTarget, ".git")), true); assert.match(readFileSync(join(ttyTarget, ".itp/run.md"), "utf8"), /checkpoints: phase/);
      assert.deepEqual(readdirSync(temp), []);
    }
  } finally { if (server) await new Promise(resolve => server.close(resolve)); rmSync(f.base, { recursive: true, force: true }); }
});

test("global install is idempotent and preserves existing ledger and personal agent rules", async () => {
  const f = await fixture();
  try {
    const home = join(f.base, "home"), target = join(f.base, "project"); mkdirSync(home); mkdirSync(join(target, ".itp"), { recursive: true });
    writeFileSync(join(target, "AGENTS.md"), "# Personal rules\r\nKeep my notes.\r\n<!-- idea-to-production:begin -->\r\nObsolete framework rules\r\n<!-- idea-to-production:end -->\r\n");
    writeFileSync(join(target, ".itp/run.md"), "run:\n  goal: existing work\n  checkpoints: slice\n");
    const before = readFileSync(join(target, ".itp/run.md"), "utf8");
    const args = [join(f.package, "install.sh"), target, "--skills-scope", "global", "--checkpoints", "phase", "--strict"];
    for (let i = 0; i < 2; i++) {
      const result = spawnSync("bash", args, { encoding: "utf8", env: { ...process.env, HOME: home } });
      assert.equal(result.status, 0, result.stdout + result.stderr);
    }
    assert.equal(readFileSync(join(target, ".itp/run.md"), "utf8"), before);
    const agents = readFileSync(join(target, "AGENTS.md"), "utf8");
    assert.ok(agents.includes("Keep my notes.")); assert.equal(agents.split("idea-to-production:begin").length - 1, 1);
    assert.ok(!agents.includes("Obsolete framework rules"));
    assert.equal(dirHash(join(home, ".agents/skills/sample")), f.lock.skills[0].contentSha256);
    assert.equal(JSON.parse(readFileSync(join(target, "dependency.json"))).skills.sample.status, "installed-global");
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("menu cancellation/dry-run maps choices without touching projects or global skills", async () => {
  const f = await fixture();
  try {
    const home = join(f.base, "home"), target = join(f.base, "new project"); mkdirSync(home);
    const answers = (confirm) => `2\n${target}\n2\n3\nn\ny\n${confirm}\n`;
    for (const confirm of ["n", "p"]) {
      const result = spawnSync("bash", [join(f.package, "install.sh"), "--menu"], { input: answers(confirm), encoding: "utf8", env: { ...process.env, HOME: home } });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.ok(result.stdout.includes("scope=repo")); assert.ok(result.stdout.includes("checkpoints=slice"));
      assert.equal(existsSync(target), false); assert.equal(existsSync(join(home, ".agents")), false);
    }
    const invalid = spawnSync("bash", [join(f.package, "install.sh"), "--menu"], { input: "invalid\n", encoding: "utf8", env: { ...process.env, HOME: home } });
    assert.notEqual(invalid.status, 0); assert.equal(existsSync(target), false);
    const install = spawnSync("bash", [join(f.package, "install.sh"), "--menu", "--yes"], { input: `2\n${target}\n2\n1\nn\ny\n`, encoding: "utf8", env: { ...process.env, HOME: home } });
    assert.equal(install.status, 0, install.stdout + install.stderr);
    assert.match(readFileSync(join(target, ".itp/run.md"), "utf8"), /checkpoints: false/);
    assert.equal(existsSync(join(target, ".git")), true);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("tampered package or unowned registry fails before installing any content", async () => {
  const f = await fixture();
  try {
    const home = join(f.base, "home"), target = join(f.base, "project"); mkdirSync(home); mkdirSync(target);
    writeFileSync(join(target, "dependency.md"), "Personal dependency notes\n");
    let run = spawnSync("bash", [join(f.package, "install.sh"), target, "--strict"], { encoding: "utf8", env: { ...process.env, HOME: home } });
    assert.notEqual(run.status, 0); assert.match(run.stderr, /existing dependency.md/);
    assert.equal(readFileSync(join(target, "dependency.md"), "utf8"), "Personal dependency notes\n");
    rmSync(join(target, "dependency.md"));
    writeFileSync(join(f.package, "upstream/sample/SKILL.md"), "tampered\n");
    run = spawnSync("bash", [join(f.package, "install.sh"), target, "--strict"], { encoding: "utf8", env: { ...process.env, HOME: home } });
    assert.notEqual(run.status, 0); assert.match(run.stderr + run.stdout, /integrity mismatch/);
    assert.equal(existsSync(join(target, ".agents")), false); assert.equal(existsSync(join(home, ".agents")), false);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});

test("changing repo to global scope removes only previously managed unchanged local copies", async () => {
  const f = await fixture();
  try {
    const home = join(f.base, "home"), target = join(f.base, "project"); mkdirSync(home); mkdirSync(target);
    const run = (scope) => spawnSync("bash", [join(f.package, "install.sh"), target, "--skills-scope", scope, "--strict"], { encoding: "utf8", env: { ...process.env, HOME: home } });
    assert.equal(run("repo").status, 0);
    mkdirSync(join(target, ".agents/skills/personal")); writeFileSync(join(target, ".agents/skills/personal/SKILL.md"), "---\nname: personal\ndescription: User skill\n---\n");
    const result = run("global"); assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.equal(existsSync(join(target, ".agents/skills/sample")), false);
    assert.equal(existsSync(join(target, ".agents/skills/personal/SKILL.md")), true);
    assert.equal(existsSync(join(home, ".agents/skills/sample/SKILL.md")), true);
  } finally { rmSync(f.base, { recursive: true, force: true }); }
});
