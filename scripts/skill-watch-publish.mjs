// Remote mutation boundary. Collection/dry runs never call this publisher.
const ISSUE_MARKER = "<!-- skill-watch:managed-v1 -->";
const COMMENT_MARKER = "<!-- skill-watch:notification-v1 -->";
const escapeReportText = (s) => String(s || "").replace(/@/g, "&#64;").replace(/[<>`*\[\]\r\n]/g, " ").slice(0, 200);
function issueBody(report) {
  const body = `${ISSUE_MARKER}\n${report}`;
  if (Buffer.byteLength(body) <= 60_000) return body;
  const prefix = Buffer.from(body).subarray(0, 59_000).toString("utf8");
  const end = prefix.lastIndexOf("\n");
  return `${end >= 0 ? prefix.slice(0, end) : prefix}\n\nDigest truncated to fit GitHub. Complete bounded details remain in the run report.json artifact.\n`;
}

export function writeApi(token, fetchImpl = fetch) {
  if (!token) throw new Error("GitHub authentication required for publication");
  return async (method, path, body) => {
    if (!path.startsWith("/repos/")) throw new Error("unsupported publication API path");
    const response = await fetchImpl(`https://api.github.com${path}`, {
      method, redirect: "error", signal: AbortSignal.timeout(30_000),
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json", "User-Agent": "SkillWatch/1.0" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) { const error = new Error(`publication API HTTP ${response.status}`); error.status = response.status; throw error; }
    return response.status === 204 ? null : response.json();
  };
}

export async function publishWatch({ config, state, report, api, expectedStateSha = null }) {
  const options = config.publication;
  if (!options?.enabled) throw new Error("publication disabled; authorize rollout in skill-watch.json first");
  if (!/^[\w.-]+\/[\w.-]+$/.test(options.repository) || !/^automation\/[\w/-]+$/.test(options.stateBranch)) throw new Error("invalid publication repository/state branch");
  if (typeof options.publisherLogin !== "string" || !/^[\w-]+(?:\[bot\])?$/.test(options.publisherLogin)) throw new Error("trusted publisher identity required");
  const repo = `/repos/${options.repository}`, branch = encodeURIComponent(options.stateBranch);
  const next = structuredClone(state);
  if (Buffer.byteLength(JSON.stringify(next)) > 3_000_000) throw new Error("state size exceeds publication budget");
  const info = await api("GET", repo);
  if (info.default_branch === options.stateBranch) throw new Error("state branch must not be default branch");
  let existing;
  try { existing = await api("GET", `${repo}/contents/skill-watch-state.json?ref=${branch}`); }
  catch (err) { if (err.status !== 404) throw err; }
  if ((existing?.sha || null) !== expectedStateSha) throw new Error("remote state changed since scan; reload before publishing");
  async function pages(path) {
    const rows = [];
    for (let page = 1; page <= 10; page++) {
      const batch = await api("GET", `${repo}${path}${path.includes("?") ? "&" : "?"}per_page=100&page=${page}`);
      if (!Array.isArray(batch)) throw new Error("unexpected issue/comment response");
      rows.push(...batch);
      if (batch.length < 100) return rows;
    }
    throw new Error("publication pagination limit; refusing incomplete deduplication");
  }
  const owned = (record) => record.user?.login?.toLowerCase() === options.publisherLogin.toLowerCase();
  const validIssue = (i) => !i.pull_request && owned(i) && i.title === options.issueTitle && i.body?.startsWith(`${ISSUE_MARKER}\n`);
  let issue;
  if (state.issueNumber) {
    if (!Number.isSafeInteger(state.issueNumber) || state.issueNumber <= 0) throw new Error("invalid stored issue identity");
    issue = await api("GET", `${repo}/issues/${state.issueNumber}`);
    if (!validIssue(issue)) throw new Error("stored watch issue is not publisher-owned");
  } else issue = (await pages("/issues?state=all")).find(validIssue);
  const body = issueBody(report);
  if (!issue) {
    issue = await api("POST", `${repo}/issues`, { title: options.issueTitle, body });
    if (!owned(issue)) throw new Error("token identity differs from configured publisher; state not advanced");
  }
  else if (issue.state === "closed") throw new Error(`watch issue #${issue.number} is closed; reopen it explicitly`);
  else await api("PATCH", `${repo}/issues/${issue.number}`, { body });
  const comments = await pages(`/issues/${issue.number}/comments`);
  const published = new Set(comments.filter((c) => owned(c) && c.body?.startsWith(`${COMMENT_MARKER}\n`)).flatMap((c) => [...c.body.matchAll(/<!-- skill-watch:event:([a-f0-9]{64}) -->/g)].map((m) => m[1])));
  const observed = new Date(next.scannedAt);
  if (!Number.isFinite(observed.getTime())) throw new Error("invalid observation timestamp");
  const week = observed.toISOString().slice(0, 10);
  const weekMarker = `<!-- skill-watch:week:${week} -->`;
  const weekly = observed.getUTCDay() === 1 && !comments.some((c) => owned(c) && c.body?.startsWith(`${COMMENT_MARKER}\n`) && c.body.includes(weekMarker));
  const ready = next.pending.filter((e) => e.priority === "high" || weekly).sort((a, b) => Number(b.priority === "high") - Number(a.priority === "high")).slice(0, 40);
  if (ready.some((e) => !/^[a-f0-9]{64}$/.test(e.id))) throw new Error("invalid notification event identity");
  const unseen = ready.filter((e) => !published.has(e.id));
  if (unseen.length) {
    const lines = unseen.map((e) => `<!-- skill-watch:event:${e.id} -->\n- ${escapeReportText(e.priority)} / ${escapeReportText(e.kind)}: ${escapeReportText(e.name)}`);
    await api("POST", `${repo}/issues/${issue.number}/comments`, {
      body: `${COMMENT_MARKER}\n${weekly ? `${weekMarker}\nWeekly digest` : "High-impact update"}\n\n${lines.join("\n")}\n\nFull details are in the managed issue and run artifact.`,
    });
  }
  next.notified = [...new Set([...next.notified, ...ready.map((e) => e.id)])].slice(-2000);
  next.pending = next.pending.filter((e) => !ready.some((r) => r.id === e.id));
  next.issueNumber = issue.number;
  try { await api("GET", `${repo}/git/ref/heads/${branch}`); }
  catch (err) {
    if (err.status !== 404) throw err;
    const tip = await api("GET", `${repo}/git/ref/heads/${encodeURIComponent(info.default_branch)}`);
    await api("POST", `${repo}/git/refs`, { ref: `refs/heads/${options.stateBranch}`, sha: tip.object.sha });
  }
  await api("PUT", `${repo}/contents/skill-watch-state.json`, {
    message: "Update Skill Watch observation state", branch: options.stateBranch,
    content: Buffer.from(JSON.stringify(next, null, 2) + "\n").toString("base64"), ...(existing?.sha ? { sha: existing.sha } : {}),
  });
  return next;
}
