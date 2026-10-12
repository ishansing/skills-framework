import { test } from "node:test";
import assert from "node:assert/strict";
import { extractSource, createClient, compareScan, scanWatch, renderReport } from "../../scripts/skill-watch.mjs";
import { publishWatch } from "../../scripts/skill-watch-publish.mjs";
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));

test("human dispositions survive verification and apply to report status/filtering", () => {
  const candidate = { name: "review", repo: "acme/skills", path: "skills/review/SKILL.md", leadKey: "lead:hash", verified: true, hash: "current" };
  const state = { pending: [], sources: { "discovery:test": { entries: { "42:skills/review/SKILL.md": candidate } } }, scannedAt: "now" };
  for (const key of ["acme/skills:skills/review/SKILL.md", "lead:acme/skills:review"]) {
    assert.ok(!renderReport(state, { dispositions: { [key]: { status: "rejected" } } }).includes("**review**"));
    assert.ok(renderReport(state, { dispositions: { [key]: { status: "evaluating" } } }).includes("primary verified; evaluating"));
    const previous = { version: 1, sources: { "discovery:test": { entries: {} } }, pending: [], notified: [] };
    assert.deepEqual(compareScan(previous, state.sources, { [key]: { status: "rejected" } }).pending, []);
  }
});

test("compacted upstream identities recover aliases and possible moves retain dependency impact", () => {
  const previous = { version: 1, sources: { "upstream:acme/skills": { repository: "acme/skills", revision: "a".repeat(40), complete: true,
    entries: { "42:old/SKILL.md": { name: "helper", hash: "old" } } } }, pending: [], notified: [] };
  const gone = { "upstream:acme/skills": { repository: "acme/skills", revision: "b".repeat(40), complete: true, entries: {} } };
  assert.deepEqual(compareScan(previous, gone, { "acme/skills:old/SKILL.md": { status: "rejected" } }).pending, []);
  const moved = structuredClone(gone);
  moved["upstream:acme/skills"].entries["42:new/SKILL.md"] = { name: "helper", hash: "new" };
  assert.equal(compareScan(previous, moved).pending[0].kind, "possible-move");
  previous.sources["upstream:acme/skills"].entries["42:old/SKILL.md"].approved = true;
  const impact = compareScan(previous, moved).pending[0];
  assert.equal(impact.priority, "high"); assert.equal(impact.approved, true);
  moved["upstream:acme/skills"].entries["42:other/SKILL.md"] = { name: "helper", hash: "other" };
  const ambiguous = compareScan(previous, moved);
  assert.equal(ambiguous.pending.filter(e => e.kind === "possible-move").length, 0);
  assert.equal(ambiguous.pending.find(e => e.kind === "removed").priority, "high");
});

test("robots wildcard processing is bounded even for adversarial repeated stars", () => {
  const script = `import {createClient} from './scripts/skill-watch.mjs';
    const client=createClient({delay:0,sleep:async()=>{},fetchImpl:async url=>new Response(url.endsWith('robots.txt')?'User-agent: *\\nDisallow: /'+ '*'.repeat(100)+'Z\\n':'listing')});
    if(await client.get('https://awesomeskill.ai/api/agent/skills/search?sort=latest&limit=50&q=',{robots:true})!=='listing')process.exit(1);`;
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], { cwd: ROOT, timeout: 3000, encoding: "utf8" });
  assert.equal(result.status, 0, result.error?.message || result.stderr);
});

test("oversized website headings cannot produce oversized candidate state", () => {
  const html = `<a href="/evil/repo/review"><h3>${"x".repeat(3_100_000)}</h3>evil/repo</a>`;
  const entries = extractSource("skills-sh", html);
  assert.ok(entries.every(e => e.name.length <= 256));
  assert.ok(Buffer.byteLength(JSON.stringify(entries)) < 10_000);
});

test("repeated cards retain one bounded observation per candidate and source page", async () => {
  const root = mkdtempSync(join(tmpdir(), "watch-observations-"));
  const config = JSON.parse(readFileSync(join(ROOT, "skill-watch.json"), "utf8"));
  config.sources = [{ kind: "skills-sh", enabled: true, pages: ["https://skills.sh/trending"] }];
  writeFileSync(join(root, "skills.lock.json"), '{"skills":[]}');
  const html = '<a href="/evil/repo/review">1<h3>review</h3>evil/repo</a>'.repeat(30_000);
  const client = { cache: {}, get: async () => html, api: async (path) => {
    if (path === "/repos/evil/repo") return { id: 7, full_name: "evil/repo", private: false, default_branch: "main" };
    if (path.includes("/commits/")) return { sha: "b".repeat(40) };
    if (path.includes("/git/trees/")) return { tree: [], truncated: false };
    throw new Error(`unexpected ${path}`);
  } };
  try {
    const result = await scanWatch({ config, root, client });
    const entries = Object.values(result.state.sources["discovery:skills-sh"].entries);
    assert.equal(entries.length, 1); assert.equal(entries[0].observations.length, 1);
    assert.ok(Buffer.byteLength(JSON.stringify(result.state)) < 100_000);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("publication bounds issue bodies and emits only one weekly digest", async () => {
  const issues = [], comments = [];
  let sha = "state0", writes = 0;
  const api = async (method, path, body) => {
    if (path === "/repos/acme/project") return { default_branch: "master" };
    if (path.includes("/contents/") && method === "GET") return { sha };
    if (path.includes("/issues?") && method === "GET") return issues;
    if (path.endsWith("/issues") && method === "POST") { const issue = { ...body, number: 1, user: { login: "github-actions[bot]" } }; issues.push(issue); return issue; }
    if (path.endsWith("/issues/1") && method === "GET") return issues[0];
    if (path.endsWith("/issues/1") && method === "PATCH") { issues[0].body = body.body; return {}; }
    if (path.includes("/comments") && method === "GET") return comments;
    if (path.endsWith("/comments") && method === "POST") { comments.push({ ...body, user: { login: "github-actions[bot]" } }); return {}; }
    if (path.includes("/git/ref/")) return { object: { sha: "head" } };
    if (path.includes("/contents/") && method === "PUT") { assert.equal(body.sha, sha); sha = `state${++writes}`; return {}; }
    throw new Error(`unexpected ${method} ${path}`);
  };
  const config = { publication: { enabled: true, repository: "acme/project", publisherLogin: "github-actions[bot]", issueTitle: "Watch", stateBranch: "automation/watch" } };
  const event = (id, priority = "medium") => ({ id: id.repeat(64), priority, name: "update", kind: "changed" });
  const initial = { version: 1, pending: [event("a")], notified: [], scannedAt: "2026-10-12T06:00:00Z" };
  const report = "detail\n".repeat(80_000);
  const first = await publishWatch({ config, state: initial, report, api, expectedStateSha: sha });
  assert.ok(Buffer.byteLength(issues[0].body) < 65_536);
  assert.equal(comments.length, 1);
  const second = await publishWatch({ config, state: { ...first, pending: [event("b")] }, report, api, expectedStateSha: sha });
  assert.equal(comments.length, 1);
  assert.equal(second.pending.length, 1);
  await publishWatch({ config, state: { ...second, pending: [...second.pending, event("c", "high")] }, report, api, expectedStateSha: sha });
  assert.equal(comments.length, 2);
  assert.ok(comments[1].body.includes("High-impact update"));
});

test("all four discovery sources preserve primary identity and labelled metrics", () => {
  const awesome = extractSource("awesomeskill", { skills: [{ name: "review", githubRepo: "acme/skills", sourceUrl: "https://github.com/acme/skills", url: "https://localhost:9876/review", githubStars: 5 }] });
  assert.equal(awesome[0].repo, "acme/skills");
  assert.equal(awesome[0].listingUrl, null);
  const leaderboard = extractSource("skills-sh", '<a href="/acme/skills/review"><span>12</span><h3>review</h3><span>acme/skills</span><span>1.2K</span></a>');
  assert.equal(leaderboard[0].metric.rank, 12);
  assert.equal(leaderboard[0].metric.raw, "1.2K");
  const mp = extractSource("skillsmp", '<a href="/creators/acme/skills/skills-review"><h3>re<mark>view</mark></h3><span>Source</span><span>acme/skills/skills/re<mark>view</mark>/SKILL.md</span><span>Updated2026-10-01</span></a>');
  assert.equal(mp[0].path, "skills/review/SKILL.md");
  const catalog = extractSource("voltagent", '[skills](https://github.com/acme/skills) [ignore](http://127.0.0.1/a)');
  assert.equal(catalog[0].repo, "acme/skills");
  assert.equal(catalog.length, 1);
});

test("captured public cards retain nested text and source paths", () => {
  const sh = extractSource("skills-sh", readFileSync(new URL("./fixtures/skill-watch-skills-sh.html", import.meta.url), "utf8"), "https://skills.sh/trending");
  assert.equal(sh[0].name, "ai-image-generation"); assert.equal(sh[0].metric.rank, 1); assert.equal(sh[0].metric.trending, true);
  const mp = extractSource("skillsmp", readFileSync(new URL("./fixtures/skill-watch-skillsmp.html", import.meta.url), "utf8"), "https://skillsmp.com/search?q=review");
  assert.equal(mp[0].path, ".agents/skills/test-audit/SKILL.md"); assert.equal(mp[0].metric.updatedLabel, "2026-08-15");
});

test("retry and conditional cache preserve actual responses with bounded requests", async () => {
  let requests = 0;
  const waits = [];
  const client = createClient({ delay: 0, sleep: async (ms) => waits.push(ms), fetchImpl: async (_url, options) => {
    requests++;
    if (requests === 1) return new Response(null, { status: 429, headers: { "retry-after": "1" } });
    if (requests === 2) return new Response('{"skills":[]}', { headers: { etag: "v1" } });
    assert.equal(options.headers["If-None-Match"], "v1");
    return new Response(null, { status: 304 });
  } });
  assert.deepEqual(await client.get("https://awesomeskill.ai/api/agent/skills/search", { json: true }), { skills: [] });
  assert.deepEqual(await client.get("https://awesomeskill.ai/api/agent/skills/search", { json: true }), { skills: [] });
  assert.ok(waits.includes(1000)); assert.equal(requests, 3);
});

test("HTML parsing errors do not become successful empty website inventories", () => {
  assert.throws(() => extractSource("awesomeskill", {}), /skills array/);
  assert.equal(extractSource("skills-sh", "<html>challenge</html>").length, 0);
  // The scanner, not the parser, classifies this zero-candidate nonempty listing as a source error.
});

test("issue publication retries after state failure without duplicating high alerts", async () => {
  const issues = [], comments = [], stored = [];
  let failState = true;
  const api = async (method, path, body) => {
    if (path === "/repos/acme/project") return { default_branch: "master" };
    if (path.includes("/issues?") && method === "GET") return issues;
    if (path.endsWith("/issues") && method === "POST") { const issue = { number: 1, body: body.body, title: body.title, user: { login: "github-actions[bot]" } }; issues.push(issue); return issue; }
    if (path.endsWith("/issues/1") && method === "PATCH") return {};
    if (path.includes("/issues/1/comments") && method === "GET") return comments;
    if (path.endsWith("/issues/1/comments") && method === "POST") { comments.push({ ...body, user: { login: "github-actions[bot]" } }); return {}; }
    if (path.includes("/git/ref/")) return { object: { sha: "a".repeat(40) } };
    if (path.includes("/contents/") && method === "GET") return { sha: "old" };
    if (path.includes("/contents/") && method === "PUT") { if (failState) throw new Error("state unavailable"); stored.push(body); return {}; }
    throw new Error(`unexpected ${method} ${path}`);
  };
  const config = { publication: { enabled: true, publisherLogin: "github-actions[bot]", repository: "acme/project", issueTitle: "Watch", stateBranch: "automation/skill-watch" } };
  const state = { version: 1, scannedAt: "2026-10-08T00:00:00Z", pending: [{ id: "e".repeat(64), priority: "high", name: "gone", kind: "removed", key: "a" }], notified: [] };
  await assert.rejects(publishWatch({ config, state, report: "report", api, expectedStateSha: "old" }), /state unavailable/);
  assert.equal(state.pending.length, 1);
  failState = false;
  const next = await publishWatch({ config, state, report: "report", api, expectedStateSha: "old" });
  assert.equal(issues.length, 1);
  assert.equal(comments.length, 1);
  assert.equal(stored.length, 1);
  assert.deepEqual(next.pending, []);
  await assert.rejects(publishWatch({ config, state, report: "report", api, expectedStateSha: "stale" }), /state changed/);
});

test("baseline, partial inventory, dispositions and repeated scans do not flood alerts", () => {
  const old = { version: 1, sources: { upstream: { complete: true, entries: { a: { name: "old", hash: "aaa", invocation: "model", approved: true } } } }, pending: [], notified: [] };
  const changed = { complete: true, entries: { b: { name: "new", hash: "bbb", invocation: "model" } } };
  assert.equal(compareScan({}, { upstream: changed }).pending.length, 0);
  assert.equal(compareScan(old, { upstream: { ...changed, complete: false } }).pending.filter(e => e.kind === "removed").length, 0);
  const next = compareScan(old, { upstream: changed }, { b: { status: "rejected" } });
  assert.deepEqual(next.pending.map(e => e.kind), ["removed"]);
  assert.equal(compareScan(next, { upstream: changed }).pending.length, 1);
  assert.equal(compareScan({ ...next, pending: [], notified: next.pending.map(e => e.id) }, { upstream: changed }).pending.length, 0);
  const broken = compareScan(old, { upstream: { error: "503" } });
  assert.deepEqual(broken.sources.upstream.entries, old.sources.upstream.entries);
});

test("fetch boundary blocks disallowed crawling and private redirects before following", async () => {
  const calls = [];
  const client = createClient({ token: "private-token", delay: 0, sleep: async () => {}, fetchImpl: async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("robots.txt")) return new Response("User-agent: *\nDisallow: /api/\nAllow: /\n");
    return new Response(null, { status: 302, headers: { location: "http://127.0.0.1/private" } });
  } });
  await assert.rejects(client.get("https://skills.sh/api/hidden", { robots: true }), /robots/);
  await assert.rejects(client.get("https://skills.sh/trending", { robots: true }), /destination/);
  await assert.rejects(client.get("https://localhost/"), /destination/);
  assert.equal(calls.length, 2);
  assert.ok(calls.every((c) => !c.options.headers.Authorization));
});

test("incomplete upstream inventories retain the last known paths until confirmed removal", () => {
  const previous = { version: 1, sources: { "upstream:repo": { complete: true, entries: { a: { name: "approved", hash: "one", approved: true } } } }, pending: [], notified: [] };
  const partial = compareScan(previous, { "upstream:repo": { complete: false, entries: {} } });
  assert.equal(partial.pending.length, 0);
  const confirmed = compareScan(partial, { "upstream:repo": { complete: true, entries: {} } }, { a: { status: "adopted" } });
  assert.equal(confirmed.pending[0].kind, "removed");
  assert.equal(confirmed.pending[0].priority, "high");
});

test("major releases and declared contract changes have explicit priorities", () => {
  const before = { version: 1, sources: { repo: { entries: {
    release1: { release: true, major: 1 }, skill: { name: "s", hash: "a", approved: true, invocation: "model", dependencies: [] },
  } } }, pending: [], notified: [] };
  const next = compareScan(before, { repo: { entries: {
    release1: { release: true, major: 1 }, release2: { name: "v2.0.0", release: true, major: 2 },
    skill: { name: "s", hash: "b", approved: true, invocation: "user", dependencies: [] },
  } } });
  assert.equal(next.pending.find(e => e.kind === "major-release").priority, "medium");
  assert.equal(next.pending.find(e => e.kind === "invocation-changed").priority, "high");
});

test("full scan verifies primary files, establishes baseline, and reuses stable identities", async () => {
  const root = mkdtempSync(join(tmpdir(), "watch-scan-"));
  const config = JSON.parse(readFileSync(new URL("../../skill-watch.json", import.meta.url)));
  config.sources = [{ kind: "awesomeskill", enabled: true }]; config.queries = ["review"];
  const pin = "a".repeat(40), revision = "b".repeat(40), blob = "c".repeat(40);
  writeFileSync(join(root, "skills.lock.json"), JSON.stringify({ skills: [{ id: "review", repo: "watch/skills", path: "skills/review", commit: pin, invocationClass: "model" }] }));
  const client = { cache: {}, get: async () => ({ skills: [{ name: "review", githubRepo: "watch/skills", url: "https://localhost:9876/no" }] }), api: async (path) => {
    if (path === "/repos/watch/skills") return { id: 42, full_name: "watch/skills", default_branch: "main", private: false };
    if (path.includes("/commits?")) return [{ sha: pin }];
    if (path.includes("/commits/")) return { sha: revision };
    if (path.includes("/git/trees/")) return { truncated: false, tree: [{ type: "blob", path: "skills/review/SKILL.md", sha: blob }] };
    if (path.includes("/git/blobs/")) return { encoding: "base64", content: Buffer.from("---\nname: review\ndescription: Read code safely\n---\n").toString("base64") };
    if (path.includes("/releases?")) return [];
    throw new Error(`unexpected ${path}`);
  } };
  try {
    const first = await scanWatch({ config, root, client, now: "2026-10-08T00:00:00Z" });
    assert.equal(first.usable, true); assert.deepEqual(first.state.pending, []);
    const entry = first.state.sources["discovery:awesomeskill"].entries["42:skills/review/SKILL.md"];
    assert.equal(entry.verified, true); assert.equal(entry.revision, revision);
    assert.equal(entry.listingUrl, null); assert.match(entry.contentSha256, /^[a-f0-9]{64}$/);
    const second = await scanWatch({ config, root, client, previous: first.state, now: "2026-10-09T00:00:00Z" });
    assert.deepEqual(second.state.pending, []);
    assert.match(renderReport(second.state, config), /partial discovery/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("robots honors groups naming this crawler, not substring coincidences", async () => {
  const bodies = {
    "https://skills.sh/allow": "User-agent: SkillWatch\nDisallow: /\n",
    "https://skillsmp.com/deny": "User-agent: skill\nDisallow: /\n",
    "https://awesomeskill.ai/open": "User-agent: otherbot\nDisallow: /\n",
  };
  for (const [origin, body] of Object.entries(bodies)) {
    const client = createClient({ delay: 0, sleep: async () => {}, fetchImpl: async (url) =>
      url.endsWith("/robots.txt") ? new Response(body) : new Response("<html></html>") });
    if (origin === "https://awesomeskill.ai/open") {
      assert.equal(await client.get(`${origin}/private`, { robots: true }), "<html></html>");
    } else {
      await assert.rejects(client.get(`${origin}/private`, { robots: true }), /robots denies/);
    }
  }
});

test("dispositions accept human-readable repo:path and lead aliases", () => {
  const previous = { version: 1, sources: { s: { entries: {} } }, pending: [], notified: [] };
  const scans = { s: { complete: true, entries: {
    verified: { name: "review", hash: "b", repo: "Acme/Skills", path: "skills/review/SKILL.md" },
    lead: { name: "helper", hash: "c", repo: "Acme/Other", leadKey: "lead:xyz" },
  } } };
  const byAlias = compareScan(previous, scans, {
    "acme/skills:skills/review/SKILL.md": { status: "rejected" },
    "lead:acme/other:helper": { status: "deferred" },
  });
  assert.deepEqual(byAlias.pending, []);
});

test("same-repo renames pair into possible-move instead of new plus removed", () => {
  const previous = { version: 1, sources: { s: { complete: true, entries: {
    old: { name: "helper", hash: "a", repo: "acme/skills", path: "old/SKILL.md" },
  } } }, pending: [], notified: [] };
  const next = compareScan(previous, { s: { complete: true, entries: {
    new: { name: "helper", hash: "b", repo: "acme/skills", path: "new/SKILL.md" },
  } } });
  assert.deepEqual(next.pending.map((e) => e.kind), ["possible-move"]);
  assert.match(next.pending[0].detail, /old\/SKILL\.md -> new\/SKILL\.md/);
});

test("config-get exposes validated configuration without scanning", () => {
  const expected = JSON.parse(readFileSync(join(ROOT, "skill-watch.json"), "utf8")).publication.enabled;
  const out = execFileSync(process.execPath, ["scripts/skill-watch.mjs", "--config-get", "publication.enabled"], { encoding: "utf8", cwd: ROOT });
  assert.equal(out.trim(), JSON.stringify(expected));
  assert.throws(() => execFileSync(process.execPath, ["scripts/skill-watch.mjs", "--config-get", "publication.missing"], { encoding: "utf8", cwd: ROOT, stdio: "pipe" }));
});

test("CLI refuses contradictory dry-run/publication and state modes before scanning", () => {
  for (const [args, message] of [
    [["--dry-run", "--publish"], /conflict/],
    [["--publish"], /requires --remote-state/],
    [["--state", "missing.json", "--remote-state"], /conflict/],
  ]) {
    const result = spawnSync(process.execPath, ["scripts/skill-watch.mjs", ...args], { cwd: ROOT, encoding: "utf8", timeout: 5000 });
    assert.equal(result.status, 1); assert.match(result.stderr, message);
  }
});

test("YAML alias bombs are rejected before metadata use", async () => {
  const root = mkdtempSync(join(tmpdir(), "watch-yaml-"));
  try {
    writeFileSync(join(root, "skills.lock.json"), JSON.stringify({ skills: [
      { id: "evil", repo: "evil/repo", path: "s", commit: "a".repeat(40), invocationClass: "model" },
    ] }));
    const bomb = '---\nname: evil\ndescription: x\na: &x [1]\n' +
      Array.from({ length: 50 }, (_, i) => `k${i}: *x\n`).join("") + "---\ncontent\n";
    const client = { cache: {}, get: async () => { throw new Error("unused"); }, api: async (path) => {
      if (path === "/repos/evil/repo") return { id: 7, full_name: "evil/repo", default_branch: "main", private: false };
      if (path.includes("/commits/")) return { sha: "b".repeat(40) };
      if (path.includes("/git/trees/")) return { truncated: false, tree: [{ type: "blob", path: "s/SKILL.md", sha: "c".repeat(40) }] };
      if (path.includes("/git/blobs/")) return { encoding: "base64", content: Buffer.from(bomb).toString("base64") };
      if (path.includes("/releases?")) return [];
      throw new Error(`unexpected ${path}`);
    } };
    const config = JSON.parse(readFileSync(join(ROOT, "skill-watch.json"), "utf8"));
    config.sources = [];
    const { scanWatch: run } = await import("../../scripts/skill-watch.mjs");
    const result = await run({ config, root, client, now: "2026-10-08T00:00:00Z" });
    const scan = result.state.sources["upstream:evil/repo"];
    assert.ok(scan.error && /alias/i.test(scan.error), `expected alias rejection, got: ${scan.error}`);
    assert.deepEqual(result.state.pending, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test("report text cannot create Markdown headings, HTML, or GitHub mentions", () => {
  const state = { pending: [{ priority: "high", name: "<script>@someone\n# injected", kind: "removed", detail: "[click](javascript:bad)", url: "http://localhost/" }], sources: {}, scannedAt: "now", pins: [] };
  const report = renderReport(state, { dispositions: {} });
  assert.ok(!report.includes("<script>")); assert.ok(!report.includes("@someone"));
  assert.ok(!report.includes("[source](http://localhost")); assert.ok(!report.includes("\n# injected"));
});

test("partial discovery disappearance and verification recovery do not reannounce seen identities", () => {
  const sample = (entries) => ({ discovery: { entries, complete: false } });
  const baseline = compareScan({}, sample({ primary: { name: "review", hash: "same", leadKey: "lead:review" } }));
  const gone = compareScan(baseline, sample({}));
  const unavailable = compareScan(gone, sample({ "lead:review": { name: "review", verified: false } }));
  const recovered = compareScan(unavailable, sample({ primary: { name: "review", hash: "same", leadKey: "lead:review" } }));
  assert.deepEqual(recovered.pending, []);
});

test("all simultaneous contract changes and unapproved removals are recorded", () => {
  const previous = compareScan({}, { repo: { entries: { a: { name: "a", hash: "1", invocation: "model", dependencies: [], approved: true }, b: { name: "b", hash: "2" } }, complete: true } });
  const next = compareScan(previous, { repo: { entries: { a: { name: "renamed", hash: "3", invocation: "user", dependencies: ["new"], approved: true } }, complete: true } });
  assert.deepEqual(next.pending.map(e => e.kind).sort(), ["dependencies-changed", "invocation-changed", "name-changed", "removed"]);
  assert.equal(next.pending.find(e => e.key === "b").priority, "medium");
});

test("large snapshots and backlogs are bounded without advancing past unpublished changes", () => {
  const many = Object.fromEntries(Array.from({ length: 10_000 }, (_, i) => [`skill${i}`, { name: `skill${i}`, hash: "1", upstream: true }]));
  const baseline = compareScan({}, { repo: { complete: true, entries: {} } });
  const limited = compareScan(baseline, { repo: { complete: true, entries: many } }, {}, "2026-10-08T00:00:00Z", { snapshotEntries: 50, pendingEvents: 10, historyEntries: 100 });
  assert.equal(limited.pending.length, 10);
  assert.equal(limited.baselinesHeld, true);
  assert.deepEqual(limited.sources, baseline.sources);
  const drained = { ...limited, pending: [], notified: limited.pending.map(e => e.id) };
  const replay = compareScan(drained, { repo: { complete: true, entries: many } }, {}, "2026-10-09T00:00:00Z", { snapshotEntries: 50, pendingEvents: 10, historyEntries: 100 });
  assert.equal(replay.pending.length, 10);
  assert.ok(replay.pending.every(e => !drained.notified.includes(e.id)));
  assert.ok(Buffer.byteLength(JSON.stringify(limited)) < 100_000);
});

test("a website cannot redirect into authenticated GitHub reads or cache their bodies", async () => {
  const calls = [];
  const client = createClient({ token: "secret-token", delay: 0, sleep: async () => {}, fetchImpl: async (url, options) => {
    calls.push({ url, headers: options.headers });
    if (url.startsWith("https://skillsmp.com/")) return new Response(null, { status: 302, headers: { location: "https://api.github.com/repos/acme/private/contents/secret" } });
    return new Response("PRIVATE-DATA", { headers: { etag: "private" } });
  } });
  await assert.rejects(client.get("https://skillsmp.com/search"), /boundary/);
  assert.equal(calls.length, 1); assert.deepEqual(client.cache, {});
  assert.ok(!calls[0].headers.Authorization);
});

test("attacker markers cannot select the managed issue or suppress an alert", async () => {
  const posted = [], patched = [];
  const id = "a".repeat(64), marker = "<!-- skill-watch:managed-v1 -->\n";
  const forged = { number: 666, title: "Watch", body: marker, user: { login: "attacker" } };
  const api = async (method, path, body) => {
    if (path === "/repos/acme/project") return { default_branch: "master" };
    if (path.includes("/contents/") && method === "GET") return { sha: "old" };
    if (path.includes("/issues?") && method === "GET") return [forged];
    if (path.endsWith("/issues") && method === "POST") return { ...body, number: 1, user: { login: "github-actions[bot]" } };
    if (/\/issues\/\d+$/.test(path) && method === "PATCH") { patched.push(path); return {}; }
    if (path.includes("/comments?") && method === "GET") return [{ user: { login: "attacker" }, body: `<!-- skill-watch:notification-v1 -->\n<!-- skill-watch:event:${id} -->` }];
    if (path.endsWith("/comments") && method === "POST") { posted.push(body); return {}; }
    if (path.includes("/git/ref/")) return { object: { sha: "main" } };
    if (path.includes("/contents/") && method === "PUT") return {};
    throw new Error(`unexpected ${method} ${path}`);
  };
  const config = { publication: { enabled: true, publisherLogin: "github-actions[bot]", repository: "acme/project", issueTitle: "Watch", stateBranch: "automation/watch" } };
  await publishWatch({ config, api, expectedStateSha: "old", report: "report", state: { pending: [{ id, priority: "high", name: "changed" }], notified: [], scannedAt: "2026-10-08T00:00:00Z" } });
  assert.ok(!patched.some(p => p.endsWith("/666"))); assert.equal(posted.length, 1);
});
