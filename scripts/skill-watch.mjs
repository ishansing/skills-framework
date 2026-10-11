#!/usr/bin/env node
import { parse as parseHTML } from "parse5";
import { parse as parseYAML } from "yaml";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { checkAll, githubToken, loadLock } from "./check-upstream.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const hash = (value) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const suppressedStatuses = new Set(["rejected", "deferred", "adopted"]);
// Human-authorable aliases: canonical keys embed numeric repo IDs or hashes, so also
// honor owner/repo:path (verified) and lead:owner/repo:name-or-path (unverified).
function dispositionKeys(key, entry = {}) {
  const keys = [key, ...(entry.aliases || [])];
  const repo = typeof entry.repo === "string" && /^[\w.-]+\/[\w.-]+$/.test(entry.repo) ? entry.repo.toLowerCase() : null;
  if (repo && entry.path) keys.push(`${repo}:${entry.path}`);
  else if (repo && entry.name) keys.push(`${repo}:${entry.name}`);
  if (repo) {
    if (entry.name) keys.push(`lead:${repo}:${entry.name}`);
    if (entry.path) keys.push(`lead:${repo}:${entry.path}`);
  }
  return [...new Set(keys)];
}
function disposition(key, entry, dispositions) {
  const matches = dispositionKeys(key, entry).map((k) => dispositions[k]).filter(Boolean);
  return matches.find((d) => suppressedStatuses.has(d.status)) || matches[0];
}
const isSuppressed = (key, entry, dispositions) => suppressedStatuses.has(disposition(key, entry, dispositions)?.status);
function restoreIdentity(key, entry, snapshot) {
  return { ...entry, repo: entry.repo || snapshot?.repository,
    path: entry.path || key.match(/^\d+:(.*SKILL\.md)$/)?.[1] };
}
const text = (node) => node.nodeName === "#text" ? node.value : (node.childNodes || []).map(text).join("");
function descendants(node, tag) {
  return [...(node.tagName === tag ? [node] : []), ...(node.childNodes || []).flatMap((c) => descendants(c, tag))];
}
function anchorBasics(a) {
  return {
    href: a.attrs.find((p) => p.name === "href")?.value || "",
    heading: descendants(a, "h3")[0],
  };
}
function publicLink(value, base) {
  try {
    const url = new URL(value, base);
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
        !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname) || /(?:^|\.)(?:localhost|local|internal)$/i.test(url.hostname)) return null;
    return url.href.length <= 4096 ? url.href : null;
  } catch { return null; }
}
function githubIdentity(value) {
  const url = publicLink(value);
  if (!url || new URL(url).hostname !== "github.com") return null;
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  if (parts.length < 2 || !parts.slice(0, 2).every((p) => /^[\w.-]+$/.test(p))) return null;
  return { repo: parts.slice(0, 2).join("/").replace(/\.git$/, ""),
    path: parts[2] === "blob" && parts.slice(4).join("/").endsWith("SKILL.md") ? decodeURIComponent(parts.slice(4).join("/")) : null };
}

function extractAwesomeSkill(body) {
  if (!Array.isArray(body.skills)) throw new Error("skills array missing");
  return body.skills.map((s) => {
    const identity = githubIdentity(s.sourceUrl) || githubIdentity(`https://github.com/${s.githubRepo}`);
    return { ...identity, name: String(s.name || "").slice(0, 256), description: String(s.description || "").slice(0, 1000), listingUrl: publicLink(s.url),
      metric: { repoStars: Number.isSafeInteger(s.githubStars) ? s.githubStars : null } };
  });
}
function extractVoltagent(body) {
  const seen = new Set();
  return [...body.matchAll(/https:\/\/github\.com\/[\w.-]+\/[\w./%-]+/g)].flatMap(([link]) => {
    const identity = githubIdentity(link);
    if (!identity || seen.has(`${identity.repo}:${identity.path}`)) return [];
    seen.add(`${identity.repo}:${identity.path}`);
    return [{ ...identity, name: null, listingUrl: link, metric: {} }];
  });
}
function extractSkillsSh(body, url) {
  const document = parseHTML(body);
  return descendants(document, "a").flatMap((a) => {
    const { href, heading } = anchorBasics(a);
    const match = href.match(/^\/([\w.-]+)\/([\w.-]+)\/([\w.-]+)$/);
    if (!match || !heading) return [];
    const fullName = text(heading).trim(), name = fullName.slice(0, 256), repo = `${match[1]}/${match[2]}`, all = text(a);
    if (repo.length > 255) return [];
    const rank = Number(all.slice(0, all.indexOf(fullName)).match(/\d+/)?.[0]) || null;
    const raw = all.slice(all.lastIndexOf(repo) + repo.length).trim().slice(0, 100);
    return [{ repo, path: null, name, listingUrl: publicLink(href, url), metric: {
      rank, raw, window: "unknown", label: new URL(url).pathname, approximate: true,
      trending: ["/trending", "/hot"].includes(new URL(url).pathname),
    } }];
  });
}
function extractSkillsMp(body, url) {
  const document = parseHTML(body);
  return descendants(document, "a").flatMap((a) => {
    const { href, heading } = anchorBasics(a);
    if (!href.startsWith("/creators/") || !heading) return [];
    const all = text(a), match = all.match(/Source\s*([\w.-]+\/[\w.-]+\/[^\s]*?SKILL\.md)/);
    if (!match) return [];
    const [owner, repo, ...path] = match[1].split("/");
    if (`${owner}/${repo}`.length > 255 || path.join("/").length > 1024) return [];
    return [{ repo: `${owner}/${repo}`, path: path.join("/"), name: text(heading).trim().slice(0, 256),
      listingUrl: publicLink(href, url), metric: { updatedLabel: all.match(/Updated\s*(\d{4}-\d{2}-\d{2})/)?.[1] || null } }];
  });
}
const sourceExtractors = {
  awesomeskill: (body) => extractAwesomeSkill(body),
  voltagent: (body) => extractVoltagent(body),
  "skills-sh": (body, url) => extractSkillsSh(body, url),
  skillsmp: (body, url) => extractSkillsMp(body, url),
};
export function extractSource(kind, body, url = "https://example.com/") {
  const extract = sourceExtractors[kind];
  if (!extract) throw new Error(`unsupported source ${kind}`);
  return extract(body, url);
}

const HOSTS = new Set(["api.github.com", "awesomeskill.ai", "www.awesomeskill.ai", "skills.sh", "www.skills.sh", "skillsmp.com", "www.skillsmp.com"]);
function fetchURL(value) {
  const link = publicLink(value);
  if (!link || !HOSTS.has(new URL(link).hostname)) throw new Error("blocked fetch destination");
  return new URL(link);
}
function robotPathMatches(pattern, path) {
  // Literal segments with ordered wildcard gaps; no backtracking regex on external rules.
  const anchored = pattern.endsWith("$");
  const parts = (anchored ? pattern.slice(0, -1) : pattern).split("*");
  if (!path.startsWith(parts[0])) return false;
  let position = parts[0].length;
  if (parts.length === 1) return !anchored || position === path.length;
  const end = anchored ? path.length - parts.at(-1).length : path.length;
  if (anchored && !path.endsWith(parts.at(-1))) return false;
  for (const part of parts.slice(1, anchored ? -1 : undefined)) {
    if (!part) continue;
    const found = path.indexOf(part, position);
    if (found < 0 || found + part.length > end) return false;
    position = found + part.length;
  }
  return position <= end;
}
function robotPolicy(body, path) {
  if (Buffer.byteLength(body) > 512_000) throw new Error("robots size exceeds policy budget");
  const groups = [];
  let group = { agents: [], rules: [], delay: 0 }, hasRules = false;
  for (const raw of body.split("\n")) {
    const line = raw.split("#")[0].trim(), colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.slice(0, colon).toLowerCase(), value = line.slice(colon + 1).trim();
    if (key === "user-agent") {
      if (hasRules) { groups.push(group); group = { agents: [], rules: [], delay: 0 }; hasRules = false; }
      group.agents.push(value.toLowerCase());
    } else if (["allow", "disallow", "crawl-delay"].includes(key)) {
      hasRules = true;
      if (key === "crawl-delay") group.delay = Math.max(group.delay, Number(value) * 1000 || 0);
      else if (value) {
        if (value.length > 8192) throw new Error("robots rule exceeds policy budget");
        group.rules.push({ allow: key === "allow", path: value });
      }
    }
  }
  groups.push(group);
  // RFC 9309 matching: a group binds this crawler when our product token starts
  // with the agent value (or names it with a longer variant); "*" is fallback only.
  const UA = "skillwatch";
  const specific = groups.filter((g) => g.agents.some((a) => a !== "*" && UA.startsWith(a)));
  const selected = specific.length ? specific : groups.filter((g) => g.agents.includes("*"));
  const rules = selected.flatMap((g) => g.rules);
  if (rules.length > 4096) throw new Error("robots rule count exceeds policy budget");
  const matching = rules.filter((r) => robotPathMatches(r.path, path))
    .sort((a, b) => b.path.replaceAll("*", "").length - a.path.replaceAll("*", "").length || Number(b.allow) - Number(a.allow));
  return { allowed: matching[0]?.allow !== false, delay: Math.max(0, ...selected.map((g) => g.delay)) };
}

export function createClient({ token = "", fetchImpl = fetch, cache = {}, delay = 1000,
  maxRequests = 500, maxBytes = 4_000_000, sleep = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  const robots = new Map(), last = new Map();
  let requests = 0;
  async function get(value, { json = false, robots: obeyRobots = false } = {}, redirects = 0, github = false) {
    const url = fetchURL(value);
    if ((url.hostname === "api.github.com") !== github) throw new Error("blocked authenticated API destination boundary");
    let spacing = url.hostname === "api.github.com" ? 0 : delay;
    if (obeyRobots) {
      if (!robots.has(url.origin)) {
        const response = await get(`${url.origin}/robots.txt`);
        robots.set(url.origin, response.notFound ? "" : response);
      }
      const policy = robotPolicy(robots.get(url.origin), url.pathname + url.search);
      if (!policy.allowed) throw new Error(`robots denies ${url.pathname}`);
      spacing = Math.max(spacing, policy.delay);
      if (spacing > 30_000) throw new Error("robots crawl delay exceeds run budget");
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      if (++requests > maxRequests) throw new Error("HTTP request budget exhausted");
      await sleep(Math.max(0, spacing - (Date.now() - (last.get(url.host) || 0))));
      last.set(url.host, Date.now());
      const headers = { "User-Agent": "SkillWatch/1.0", Accept: json ? "application/json" : "text/html" };
      if (url.hostname === "api.github.com" && token) headers.Authorization = `Bearer ${token}`;
      if (cache[url.href]?.etag) headers["If-None-Match"] = cache[url.href].etag;
      const response = await fetchImpl(url.href, { headers, redirect: "manual", signal: AbortSignal.timeout(30_000) });
      if (response.status === 304 && cache[url.href]) return json ? JSON.parse(cache[url.href].body) : cache[url.href].body;
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        if (redirects >= 3) throw new Error("redirect limit exceeded");
        const next = fetchURL(new URL(response.headers.get("location"), url).href);
        return get(next.href, { json, robots: obeyRobots }, redirects + 1, github);
      }
      if ([429, 502, 503, 504].includes(response.status) && attempt < 2) {
        const retry = response.headers.get("retry-after");
        const wait = retry ? (/^\d+$/.test(retry) ? Number(retry) * 1000 : Date.parse(retry) - Date.now()) : 1000 * 2 ** attempt;
        if (!Number.isFinite(wait) || wait > 30_000) throw new Error("retry wait exceeds run budget");
        await sleep(Math.max(0, wait)); continue;
      }
      if (response.status === 404) return { notFound: true };
      if (!response.ok) throw new Error(`HTTP ${response.status} from ${url.hostname}${url.pathname}`);
      const chunks = [];
      let size = 0;
      for await (const chunk of response.body) {
        size += chunk.length;
        if (size > maxBytes) throw new Error("HTTP response size limit exceeded");
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks).toString("utf8"), etag = response.headers.get("etag");
      // Persist only unauthenticated website caches, never token-readable API bodies.
      if (!github && etag && size <= 500_000) cache[url.href] = { etag, body };
      return json ? JSON.parse(body) : body;
    }
  }
  return { get: (url, options) => get(url, options), api: (path) => get(`https://api.github.com${path}`, { json: true }, 0, true), cache };
}

function boundBacklog(next, previous, maxPending = 500) {
  if (next.pending.length > maxPending) {
    const order = { high: 0, medium: 1, low: 2 };
    next.pending.sort((a, b) => order[a.priority] - order[b.priority]);
    next.pending = next.pending.slice(0, maxPending);
    // Keep baselines/history unchanged so undispatched changes are rediscovered after draining.
    next.sources = { ...previous.sources }; next.seen = { ...previous.seen };
    next.baselinesHeld = true;
  }
  return next;
}

export function compareScan(previous = {}, scans, dispositions = {}, now = new Date().toISOString(), limits = {}) {
  if (previous.version && previous.version !== 1) throw new Error("unsupported watch state version");
  const next = { version: 1, scannedAt: now, sources: { ...previous.sources },
    pending: [...(previous.pending || [])], notified: [...(previous.notified || [])], seen: { ...previous.seen }, historyLimit: limits.historyEntries || 5000 };
  for (const snapshot of Object.values(previous.sources || {})) for (const [key, entry] of Object.entries(snapshot.entries || {})) {
    next.seen[hash(key)] ||= previous.scannedAt || now;
    if (entry.leadKey) next.seen[hash(entry.leadKey)] ||= previous.scannedAt || now;
  }
  const observedBefore = new Set(Object.keys(next.seen));
  const seen = new Set([...next.notified, ...next.pending.map((e) => e.id)]);
  const emit = (kind, key, entry, priority, source, revision = entry.hash || "") => {
    const snapshot = kind === "removed" ? previous.sources?.[source] : next.sources[source];
    entry = restoreIdentity(key, entry, snapshot);
    const id = hash([kind, key, revision]);
    if (seen.has(id) || !entry.approved && isSuppressed(key, entry, dispositions)) return;
    seen.add(id);
    const path = key.match(/^\d+:(.*SKILL\.md)$/)?.[1];
    const primary = path && snapshot?.repository && snapshot.revision ? `https://github.com/${snapshot.repository}/blob/${snapshot.revision}/${path.split("/").map(encodeURIComponent).join("/")}` : null;
    next.pending.push({ id, kind, key, priority, source, name: entry.name || key,
      url: entry.url || entry.listingUrl || primary, observedAt: now, detail: entry.detail || "", approved: !!entry.approved,
      repo: entry.repo || null, path: entry.path || null, aliases: dispositionKeys(key, entry) });
  };
  for (const [source, rawScan] of Object.entries(scans)) {
    const cap = limits.snapshotEntries || 500;
    const entries = Object.entries(rawScan.entries || {}).sort((a, b) => Number(!!b[1].approved) - Number(!!a[1].approved));
    const scan = { ...rawScan, entries: Object.fromEntries(entries.slice(0, cap)), complete: rawScan.complete && entries.length <= cap };
    if (entries.length > cap) scan.coverage = `${scan.coverage || "inventory"}; snapshot limited to ${cap}/${entries.length} entries; removals unconfirmed`;
    const old = previous.sources?.[source];
    if (scan.error) { next.sources[source] = { ...old, error: scan.error, attemptedPages: scan.attemptedPages }; continue; }
    const retained = source.startsWith("upstream:") && !scan.complete ? old?.entries || {} : {};
    const snapshotEntries = Object.fromEntries(Object.entries({ ...retained, ...scan.entries }).sort((a, b) => Number(!!b[1].approved) - Number(!!a[1].approved)).slice(0, cap));
    next.sources[source] = { ...scan, entries: snapshotEntries,
      lastSuccess: now, error: null };
    for (const [key, entry] of Object.entries(scan.entries)) {
      next.seen[hash(key)] = now;
      if (entry.leadKey) next.seen[hash(entry.leadKey)] = now;
    }
    if (!old?.entries) continue;
    for (const [key, entry] of Object.entries(scan.entries || {})) {
      const before = old.entries[key];
      if (!before) {
        const oldMajors = Object.values(old.entries).filter((e) => e.release && e.major).map((e) => e.major);
        const major = entry.release && entry.major && oldMajors.length && entry.major > Math.max(...oldMajors);
        if (!observedBefore.has(hash(key))) emit(major ? "major-release" : entry.release ? "release" : "new", key, entry, entry.release || entry.upstream ? "medium" : "low", source);
      } else {
        let contractChanged = false;
        for (const [kind, changed] of [
          ["name-changed", before.invocation && entry.invocation && before.name !== entry.name],
          ["invocation-changed", before.invocation && entry.invocation && before.invocation !== entry.invocation],
          ["dependencies-changed", before.dependencies && entry.dependencies && JSON.stringify(before.dependencies) !== JSON.stringify(entry.dependencies)],
        ]) if (changed) { contractChanged = true; emit(kind, key, entry, entry.approved ? "high" : "medium", source); }
        if (!contractChanged && before.hash && entry.hash && before.hash !== entry.hash) emit("content-changed", key, { ...entry, detail: "Content changed; semantic significance requires review." }, "medium", source);
      }
      for (const observation of entry.observations || [{ metric: entry.metric }]) {
        const metric = observation.metric;
        const prior = (before?.observations || [{ metric: before?.metric }]).find((o) => o.sourcePage === observation.sourcePage)?.metric;
        if (metric?.trending && metric.rank && (!observedBefore.has(hash(key)) && metric.rank <= 20 ||
          prior?.rank && metric.window !== "unknown" && prior.window === metric.window && prior.label === metric.label && prior.rank - metric.rank >= 10)) {
          emit("rising", key, entry, "low", source, `${observation.sourcePage || metric.label}:${Math.floor(metric.rank / 10)}`);
        }
      }
    }
    if (scan.complete) {
      for (const [key, entry] of Object.entries(old.entries)) {
        if (!scan.entries[key] && !entry.release) emit("removed", key, entry, entry.approved ? "high" : "medium", source, entry.hash);
      }
    }
  }
  // Pair same-repo removals and additions under one name as a possible move rather
  // than separate new/removed alerts. Requires same source, repo, and name with
  // different paths, both emitted by this scan.
  const fresh = new Map(next.pending.filter((e) => e.observedAt === now).map((e) => [e.id, e]));
  for (const removed of [...fresh.values()].filter((e) => e.kind === "removed" && e.repo && e.path)) {
    const additions = [...fresh.values()].filter((e) => e.kind === "new" && e.id !== removed.id &&
      e.source === removed.source && e.repo === removed.repo && e.name === removed.name && e.path && e.path !== removed.path);
    const removals = [...fresh.values()].filter((e) => e.kind === "removed" && e.source === removed.source && e.repo === removed.repo && e.name === removed.name);
    if (additions.length !== 1 || removals.length !== 1) continue;
    const moved = additions[0], approved = !!(removed.approved || moved.approved);
    const id = hash(["possible-move", moved.key, moved.url || ""]);
    if (seen.has(id)) continue;
    seen.add(id);
    next.pending = next.pending.filter((e) => e.id !== removed.id && e.id !== moved.id);
    fresh.delete(removed.id); fresh.delete(moved.id);
    next.pending.push({ id, kind: "possible-move", key: moved.key, priority: approved ? "high" : "medium", source: moved.source,
      name: moved.name, url: moved.url, observedAt: now,
      detail: `Possible move: ${removed.path} -> ${moved.path}; verify before treating as a rename.`,
      approved, repo: moved.repo, path: moved.path, aliases: [...dispositionKeys(moved.key, moved), ...dispositionKeys(removed.key, removed)] });
  }
  next.pending = next.pending.filter((e) => e.approved || !isSuppressed(e.key, restoreIdentity(e.key, e, next.sources[e.source]), dispositions));
  next.seen = Object.fromEntries(Object.entries(next.seen).reverse().sort((a, b) => b[1].localeCompare(a[1])).slice(0, next.historyLimit));
  return boundBacklog(next, previous, limits.pendingEvents || 500);
}

function skillMetadata(body) {
  const match = body.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error("SKILL.md has no frontmatter");
  // Bound alias expansion before parsing untrusted frontmatter (billion-laughs guard).
  const fm = parseYAML(match[1], { maxAliasCount: 10, merge: false });
  if (!fm || typeof fm.name !== "string" || typeof fm.description !== "string") throw new Error("skill name/description missing");
  if (fm.name.length > 256 || Array.isArray(fm.dependencies) && fm.dependencies.length > 100) throw new Error("skill metadata exceeds bounds");
  const dependencies = Array.isArray(fm.dependencies) ? fm.dependencies.filter((v) => typeof v === "string").sort() : [];
  if (dependencies.some((d) => d.length > 256)) throw new Error("dependency metadata exceeds bounds");
  return { name: fm.name, description: fm.description.slice(0, 1000), contentSha256: hash(body), dependencies,
    invocation: fm["disable-model-invocation"] === true || fm.metadata?.["invocation-class"] === "user" ? "user" : "model" };
}
function relevance(entry, queries) {
  const words = `${entry.name || ""} ${entry.description || ""}`.toLowerCase().split(/[^\w]+/);
  return queries.filter((q) => words.includes(q.toLowerCase()));
}
function decodeFile(result) {
  if (result.notFound || result.encoding !== "base64" || typeof result.content !== "string") throw new Error("primary file unavailable");
  const body = Buffer.from(result.content, "base64").toString("utf8");
  if (Buffer.byteLength(body) > 150_000) throw new Error("primary skill size limit exceeded");
  return body;
}

export async function scanWatch({ config, previous = {}, root = ROOT, client = createClient(), now = new Date().toISOString() }) {
  const lock = loadLock(root), scans = {}, repoCache = new Map();
  const approved = new Set(lock.skills.map((s) => `${s.repo.toLowerCase()}:${s.path.replace(/\/$/, "")}/SKILL.md`));
  async function repoData(repo) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error("invalid primary repository");
    const key = repo.toLowerCase();
    if (!repoCache.has(key)) repoCache.set(key, (async () => {
      const info = await client.api(`/repos/${repo}`);
      if (info.private) {
        delete client.cache?.[`https://api.github.com/repos/${repo}`];
        throw new Error("private repositories are not monitored");
      }
      if (!Number.isSafeInteger(info.id) || !info.full_name || !info.default_branch) throw new Error("repository unavailable");
      const tip = await client.api(`/repos/${info.full_name}/commits/${encodeURIComponent(info.default_branch)}`);
      if (!/^[a-f0-9]{40}$/.test(tip.sha)) throw new Error("repository revision unavailable");
      const tree = await client.api(`/repos/${info.full_name}/git/trees/${tip.sha}?recursive=1`);
      if (!Array.isArray(tree.tree)) throw new Error("repository tree unavailable");
      return { ...info, revision: tip.sha, complete: !tree.truncated,
        skills: tree.tree.filter((f) => f.type === "blob" && /(?:^|\/)SKILL\.md$/.test(f.path)) };
    })());
    return repoCache.get(key);
  }
  async function readSkill(repo, file) {
    const data = await client.api(`/repos/${repo.full_name}/git/blobs/${file.sha}`);
    return skillMetadata(decodeFile(data));
  }
  for (const name of new Set(lock.skills.map((s) => s.repo))) {
    const id = `upstream:${name}`;
    try {
      const repo = await repoData(name), entries = {};
      let sampled = 0;
      for (const file of repo.skills) {
        const key = `${repo.id}:${file.path}`, isApproved = approved.has(`${name.toLowerCase()}:${file.path}`);
        const prior = previous.sources?.[id]?.entries?.[key];
        let metadata = {};
        if (prior?.hash === file.sha) metadata = prior;
        else if (isApproved || sampled++ < config.limits.upstreamMetadata) metadata = await readSkill(repo, file);
        entries[key] = { ...metadata, name: metadata.name || file.path, hash: file.sha, approved: isApproved, upstream: true,
          repo: repo.full_name, path: file.path, revision: repo.revision,
          url: `https://github.com/${repo.full_name}/blob/${repo.revision}/${file.path.split("/").map(encodeURIComponent).join("/")}` };
      }
      const releases = await client.api(`/repos/${repo.full_name}/releases?per_page=30`);
      if (!Array.isArray(releases)) throw new Error("release response unavailable");
      for (const r of releases.filter((r) => !r.draft && !r.prerelease)) {
        entries[`release:${repo.id}:${r.id}`] = { name: `${repo.full_name} ${r.tag_name}`, hash: String(r.id), release: true,
          major: Number(r.tag_name?.match(/(?:^|@)v?(\d+)\.\d+\.\d+$/)?.[1]) || null,
          url: publicLink(r.html_url), detail: (r.body || "").slice(0, 1000) };
      }
      scans[id] = { repository: repo.full_name, revision: repo.revision, entries, complete: repo.complete, coverage: `${repo.skills.length} skill paths; bounded metadata; latest ${releases.length} releases; tree ${repo.complete ? "complete" : "truncated"}` };
    } catch (err) { scans[id] = { error: err.message }; }
  }
  // Approved pins get the request budget before any optional discovery verification.
  const pins = await checkAll(root, async (path) => {
    const info = path.match(/^\/repos\/([^/]+\/[^/?]+)$/);
    if (info) { const repo = await repoData(info[1]); return { ...repo, default_branch: repo.revision }; }
    return client.api(path);
  });
  const sourceLeads = [];
  for (const source of config.sources) {
    const id = `discovery:${source.kind}`, leads = [], pages = [];
    try {
      if (!source.enabled) { scans[id] = { ...previous.sources?.[id], error: "disabled by configuration" }; continue; }
      if (source.kind === "voltagent") {
        const repo = await repoData("VoltAgent/awesome-agent-skills");
        pages.push(`https://github.com/${repo.full_name}/blob/${repo.revision}/README.md`);
        const file = await client.api(`/repos/${repo.full_name}/contents/README.md?ref=${repo.revision}`);
        // Catalog is larger than an individual skill; still bounded by HTTP limits.
        if (file.encoding !== "base64") throw new Error("catalog unavailable");
        leads.push(...extractSource(source.kind, Buffer.from(file.content, "base64").toString("utf8"), source.url));
      } else {
        // Verified AwesomeSkill contract (openapi.json): sort enum latest/stars,
        // limit 1..50, no pagination — each query is a bounded partial sample.
        const wanted = source.kind === "awesomeskill" ? ["", ...config.queries] :
          source.kind === "skillsmp" ? config.queries : source.pages;
        const urls = (source.kind === "awesomeskill" ? wanted.map((q) =>
          `https://awesomeskill.ai/api/agent/skills/search?sort=latest&limit=50&q=${encodeURIComponent(q)}`) :
          source.kind === "skillsmp" ? wanted.map((q) =>
            `https://skillsmp.com/search?q=${encodeURIComponent(q)}`) : wanted).slice(0, config.limits.pagesPerSite);
        if (wanted.length > urls.length) pages.push(`(budget covers ${urls.length}/${wanted.length} pages/queries; remainder unsampled this run)`);
        for (const url of urls) {
          pages.push(url);
          const body = await client.get(url, { json: source.kind === "awesomeskill", robots: true });
          if (body.notFound) throw new Error("listing not found");
          const extracted = extractSource(source.kind, body, url);
          if (!extracted.length && source.kind !== "awesomeskill" && !/\b0\s+results\b/i.test(body)) throw new Error("listing layout yielded no candidates");
          leads.push(...extracted.map((l) => ({ ...l, sourcePage: url })));
        }
      }
      scans[id] = { entries: {}, complete: false, pages, rawListings: leads.length, coverage: `partial discovery: ${leads.length} extracted listing occurrences; ${source.kind === "voltagent" ? "catalog links" : "bounded public queries/pages"}` };
      const unique = new Map();
      for (const lead of leads) {
        const key = `${lead.repo}:${lead.path || lead.name}`;
        const observation = { sourcePage: lead.sourcePage || pages[0], listingUrl: lead.listingUrl, metric: lead.metric };
        const prior = unique.get(key);
        if (prior) {
          if (prior.observations.length < config.limits.pagesPerSite && !prior.observations.some((o) => o.sourcePage === observation.sourcePage)) prior.observations.push(observation);
        }
        else unique.set(key, { ...lead, observations: [observation] });
      }
      sourceLeads.push({ id, leads: [...unique.values()].sort((a, b) => relevance(b, config.queries).length - relevance(a, config.queries).length || (a.metric?.rank || Infinity) - (b.metric?.rank || Infinity)).slice(0, config.limits.leadsPerSite) });
    } catch (err) { scans[id] = { error: err.message, attemptedPages: pages }; }
  }
  let remaining = config.limits.candidateVerifications;
  // Round-robin source leads so the first marketplace cannot consume the whole budget.
  for (let i = 0; sourceLeads.some((s) => i < s.leads.length); i++) {
    for (const source of sourceLeads) {
      const lead = source.leads[i];
      if (!lead) continue;
      const leadKey = `lead:${hash([lead.repo, lead.path, lead.name])}`;
      const fallback = { ...lead, leadKey, name: lead.name || lead.repo || "Unverified listing", verified: false,
        detail: "Primary verification budget exhausted or unsupported source." };
      if (!lead.repo || remaining-- <= 0) { scans[source.id].entries[leadKey] = fallback; continue; }
      try {
        const repo = await repoData(lead.repo);
        const matches = repo.skills.filter((f) => lead.path ? f.path === lead.path : lead.name ? f.path.split("/").at(-2) === lead.name : true);
        if (matches.length !== 1) throw new Error(matches.length ? "ambiguous skill path; exact resolution required" : "matching primary path not found");
        const file = matches[0], key = `${repo.id}:${file.path}`;
        const upstream = scans[`upstream:${lead.repo}`]?.entries?.[key];
        const metadata = upstream?.contentSha256 ? upstream : await readSkill(repo, file);
        if (lead.name && metadata.name !== lead.name) throw new Error("listing name differs from primary skill");
        scans[source.id].entries[key] = { ...metadata, ...lead, leadKey, name: metadata.name, description: metadata.description,
          verified: true, hash: file.sha, contentSha256: metadata.contentSha256, repo: repo.full_name,
          path: file.path, revision: repo.revision,
          relevance: relevance(metadata, config.queries),
          approved: Object.values(scans).some((s) => s.entries?.[key]?.approved),
          url: `https://github.com/${repo.full_name}/blob/${repo.revision}/${file.path.split("/").map(encodeURIComponent).join("/")}` };
      } catch (err) { scans[source.id].entries[leadKey] = { ...fallback, detail: err.message }; }
    }
  }
  const state = compareScan(previous, scans, config.dispositions, now, config.limits);
  const seen = new Set([...state.notified, ...state.pending.map((e) => e.id)]);
  for (const pin of pins) {
    if (["current", "error"].includes(pin.status)) continue;
    const id = hash(["pin", pin.id, pin.pinned, pin.latest, pin.status]);
    if (!seen.has(id)) state.pending.push({ id, kind: `pin-${pin.status}`, key: `pin:${pin.id}`, name: pin.id,
      priority: pin.status === "updated" ? "medium" : "high", approved: true, observedAt: now,
      source: pin.repo, url: `https://github.com/${pin.repo}`, detail: pin.note });
  }
  state.pins = pins;
  for (const entry of lock.skills) {
    const current = Object.values(scans[`upstream:${entry.repo}`]?.entries || {}).find((s) => s.path === `${entry.path}/SKILL.md`);
    if (!current?.invocation) continue;
    for (const [kind, changed] of [["pin-invocation-changed", current.invocation !== entry.invocationClass], ["pin-name-changed", current.name !== entry.id]]) {
      const id = hash([kind, entry.id, current.hash]);
      if (changed && !seen.has(id)) state.pending.push({ id, kind, key: `pin:${entry.id}`, name: entry.id, priority: "high", approved: true,
        observedAt: now, source: entry.repo, url: current.url, detail: "Declared name/invocation differs from the approved pin contract." });
    }
  }
  let size = 0;
  state.httpCache = Object.fromEntries(Object.entries(client.cache || {}).reverse().filter(([, v]) => {
    size += Buffer.byteLength(v.body); return size <= config.limits.cacheBytes;
  }));
  boundBacklog(state, previous, config.limits.pendingEvents);
  // Immutable repository/revision fields are shared at source level, not repeated per path.
  for (const [source, snapshot] of Object.entries(state.sources)) {
    if (!source.startsWith("upstream:")) continue;
    for (const entry of Object.values(snapshot.entries || {})) {
      if (!entry.approved && !entry.release) for (const field of ["repo", "path", "url", "revision"]) delete entry[field];
    }
  }
  return { state, usable: Object.values(scans).some((s) => !s.error), errors: Object.entries(scans).filter(([, s]) => s.error).map(([id, s]) => ({ source: id, error: s.error })) };
}

const escape = (value) => String(value ?? "").slice(0, 1200).replace(/@/g, "&#64;").replace(/[\\`*_{}\[\]()<>!|#]/g, "\\$&").replace(/[\r\n]+/g, " ");
export function renderReport(state, config) {
  const order = { high: 0, medium: 1, low: 2 };
  const events = [...state.pending].sort((a, b) => order[a.priority] - order[b.priority]);
  const lines = [`# Skill Watch`, "", `Observed: ${state.scannedAt}`, "", "Discovery reports candidates; it does not approve or install skills.", "", "## Actionable changes", ""];
  for (const e of events.filter((e) => e.priority !== "low")) lines.push(`- **${e.priority} / ${escape(e.kind)}**: ${escape(e.name)} — ${escape(e.detail)}${publicLink(e.url) ? ` ([source](${encodeURI(e.url).replace(/\)/g, "%29")}))` : ""}`);
  if (!events.some((e) => e.priority !== "low")) lines.push("No new actionable change alerts. Check source failures below before interpreting this as no changes.");
  lines.push("", "## Current approved-pin status", "");
  for (const pin of (state.pins || []).filter((p) => p.status !== "current")) lines.push(`- ${escape(pin.id)}: **${escape(pin.status)}** — ${escape(pin.note)}`);
  lines.push("", "## Discovery sample", "", "First observed is not necessarily newly authored. Repo stars are not skill popularity.", "");
  const candidates = new Map();
  for (const [source, snapshot] of Object.entries(state.sources)) {
    if (!source.startsWith("discovery:")) continue;
    for (const [key, item] of Object.entries(snapshot.entries || {})) {
      const prior = candidates.get(key);
      candidates.set(key, { ...prior, ...item, observations: [...(prior?.observations || []), ...(item.observations || [])], metric: { ...prior?.metric, ...item.metric }, key, sources: [...(prior?.sources || []), source] });
    }
  }
  for (const c of [...candidates.values()].filter((c) => !c.approved && !isSuppressed(c.key, c, config.dispositions)).sort((a, b) => Number(b.verified) - Number(a.verified) || (b.relevance?.length || 0) - (a.relevance?.length || 0) || Number(!!b.metric?.trending) - Number(!!a.metric?.trending) || b.sources.length - a.sources.length).slice(0, 10)) {
    lines.push(`- **${escape(c.name)}** (${c.verified ? "primary verified" : "unverified lead"}; ${escape(disposition(c.key, c, config.dispositions)?.status || "unreviewed")}) — ${escape(c.sources.join(", "))}`);
    if (c.url && publicLink(c.url)) lines.push(`  - Primary: ${publicLink(c.url).replace(/\)/g, "%29")}`);
    for (const o of c.observations || []) if (o.metric?.rank) lines.push(`  - ${escape(o.sourcePage)}: rank ${o.metric.rank}; displayed metric ${escape(o.metric.raw)}; window ${escape(o.metric.window)}; ${o.metric.trending ? "source-labelled trending/hot" : "listing"}.`);
    if (c.metric?.repoStars != null) lines.push(`  - Repository stars: ${escape(c.metric.repoStars)} (context only).`);
    if (c.relevance?.length) lines.push(`  - Keyword relevance: ${escape(c.relevance.join(", "))} (not quality evaluation).`);
    if (!c.verified) lines.push(`  - ${escape(c.detail)}`);
  }
  lines.push("", "## Source health and coverage", "");
  for (const [source, snapshot] of Object.entries(state.sources)) lines.push(`- **${escape(source)}**: ${snapshot.error ? `unavailable: ${escape(snapshot.error)}; last successful data retained` : escape(snapshot.coverage)}; last success ${escape(snapshot.lastSuccess || "never")}`);
  for (const [source, snapshot] of Object.entries(state.sources)) for (const page of snapshot.attemptedPages || snapshot.pages || []) lines.push(`  - ${escape(source)} page/query: ${escape(page)}`);
  if (state.baselinesHeld) lines.push("Change backlog limit reached: prior baselines/history held so remaining alerts can be rediscovered after notification backlog drains.");
  lines.push(`Identity history is bounded to ${state.historyLimit || 5000} recently observed identities; new means absent from retained history, not newly authored.`);
  lines.push("", "Full bounded results and identities are in the run report.json artifact. Metadata/dependency classification is limited to sampled frontmatter; semantic compatibility requires review.");
  return lines.join("\n") + "\n";
}

export function validateConfig(config) {
  if (!config || !Array.isArray(config.sources) || !Array.isArray(config.queries) || !config.dispositions) throw new Error("invalid Skill Watch configuration");
  const kinds = new Set();
  for (const s of config.sources) {
    if (!["awesomeskill", "skills-sh", "skillsmp", "voltagent"].includes(s.kind) || kinds.has(s.kind) || typeof s.enabled !== "boolean") throw new Error("invalid or duplicate source");
    kinds.add(s.kind);
    if (s.kind === "skills-sh" && (!Array.isArray(s.pages) || !s.pages.length)) throw new Error("leaderboard pages missing");
    for (const page of s.pages || []) fetchURL(page);
  }
  for (const key of ["pagesPerSite", "leadsPerSite", "candidateVerifications", "upstreamMetadata", "httpRequests", "responseBytes", "cacheBytes", "snapshotEntries", "historyEntries", "pendingEvents"]) {
    if (!Number.isSafeInteger(config.limits?.[key]) || config.limits[key] <= 0) throw new Error(`invalid limit ${key}`);
  }
  if (config.queries.some((q) => typeof q !== "string" || q.length > 100)) throw new Error("invalid discovery query");
  for (const d of Object.values(config.dispositions)) if (!["new", "evaluating", "rejected", "deferred", "adopted"].includes(d.status)) throw new Error("invalid candidate disposition");
  if (!/^[\w.-]+\/[\w.-]+$/.test(config.publication?.repository) || !/^automation\/[\w/-]+$/.test(config.publication.stateBranch)) throw new Error("invalid state repository/branch");
  return config;
}

async function main() {
  const args = process.argv.slice(2), options = { output: ".skill-watch", config: join(ROOT, "skill-watch.json") };
  for (let i = 0; i < args.length; i++) {
    if (["--output", "--config", "--state", "--config-get"].includes(args[i])) {
      if (!args[i + 1] || args[i + 1].startsWith("--")) throw new Error(`missing value for ${args[i]}`);
      options[args[i].slice(2)] = args[++i];
    } else if (["--publish", "--remote-state", "--dry-run"].includes(args[i])) options[args[i].slice(2)] = true;
    else throw new Error(`unknown option ${args[i]}`);
  }
  if (options.publish && options["dry-run"]) throw new Error("--publish and --dry-run conflict");
  if (options.publish && !options["remote-state"]) throw new Error("publication requires --remote-state");
  if (options.state && options["remote-state"]) throw new Error("--state and --remote-state conflict");
  const config = validateConfig(JSON.parse(readFileSync(options.config, "utf8")));
  if (options["config-get"]) {
    const value = options["config-get"].split(".").reduce((o, k) => o?.[k], config);
    if (value === undefined) throw new Error(`unknown config path ${options["config-get"]}`);
    console.log(typeof value === "string" ? value : JSON.stringify(value));
    return;
  }
  if (options.publish && !config.publication.enabled) throw new Error("publication disabled in configuration");
  const token = githubToken();
  const client = createClient({ token, maxRequests: config.limits.httpRequests, maxBytes: config.limits.responseBytes });
  let previous = {}, stateSha = null;
  if (options["remote-state"]) {
    const result = await client.api(`/repos/${config.publication.repository}/contents/skill-watch-state.json?ref=${encodeURIComponent(config.publication.stateBranch)}`);
    if (!result.notFound) {
      const data = result.encoding === "base64" ? result : await client.api(`/repos/${config.publication.repository}/git/blobs/${result.sha}`);
      previous = JSON.parse(Buffer.from(data.content, "base64").toString("utf8")); stateSha = result.sha;
    }
  } else if (options.state) previous = JSON.parse(readFileSync(options.state, "utf8"));
  if (options.state || stateSha) {
    if (previous.version !== 1 || !previous.sources || !Array.isArray(previous.pending) || !Array.isArray(previous.notified)) throw new Error("invalid or unsupported watch state");
  }
  Object.assign(client.cache, Object.fromEntries(Object.entries(previous.httpCache || {}).filter(([url]) => new URL(url).hostname !== "api.github.com")));
  const result = await scanWatch({ config, previous, client });
  const report = renderReport(result.state, config);
  mkdirSync(options.output, { recursive: true });
  writeFileSync(join(options.output, "report.json"), JSON.stringify(result, null, 2) + "\n");
  writeFileSync(join(options.output, "next-state.json"), JSON.stringify(result.state, null, 2) + "\n");
  writeFileSync(join(options.output, "report.md"), report);
  console.log(`Skill Watch: ${result.usable ? "scan usable" : "all sources unavailable"}; ${result.errors.length} unavailable sources; ${result.state.pending.length} pending events. Reports: ${options.output}`);
  if (!result.usable) throw new Error("all collection sources unavailable; state not advanced");
  if (options.publish) {
    const { publishWatch, writeApi } = await import("./skill-watch-publish.mjs");
    result.state = await publishWatch({ config, state: result.state, report, api: writeApi(token), expectedStateSha: stateSha });
    writeFileSync(join(options.output, "published-state.json"), JSON.stringify(result.state, null, 2) + "\n");
    console.log("Managed issue updated; remote state persisted.");
  } else console.log("Dry run: no issue, branch, registry, pin, or installation mutations.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(`skill-watch: ${error.message}`); process.exitCode = 1; });
}
