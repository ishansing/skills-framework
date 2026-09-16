import { test } from "node:test";
import assert from "node:assert/strict";
import { checkEntry, exitCode } from "../../scripts/check-upstream.mjs";

const PIN = "a".repeat(40);
const NEW = "b".repeat(40);

function entry(overrides = {}) {
  return {
    id: "research",
    repo: "acme/skills",
    commit: PIN,
    path: "skills/research",
    contentSha256: "0".repeat(64),
    invocationClass: "model",
    ...overrides,
  };
}

function api(routes) {
  const compiled = routes.map(([matcher, response]) => [
    matcher instanceof RegExp ? matcher : new RegExp(matcher.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    response,
  ]);
  return async (path) => {
    for (const [pattern, response] of compiled) {
      if (pattern.test(path)) return response;
    }
    throw new Error(`unexpected API path: ${path}`);
  };
}

const repoInfo = [/^\/repos\/acme\/skills$/, { default_branch: "main" }];

test("current when the pinned commit is the latest path commit", async () => {
  const result = await checkEntry(entry(), api([repoInfo, ["/commits?path=", [{ sha: PIN }]]]));
  assert.equal(result.status, "current");
});

test("current when the pin already contains the latest path change", async () => {
  // Regression: compare reports ahead_by 0 when the pin is a newer repo-wide commit.
  const result = await checkEntry(
    entry(),
    api([repoInfo, ["/commits?path=", [{ sha: NEW }]], ["/compare/", { ahead_by: 0, files: [], commits: [] }]])
  );
  assert.equal(result.status, "current");
  assert.match(result.note, /latest path change/);
});

test("updated when upstream has newer path commits", async () => {
  const result = await checkEntry(
    entry(),
    api([
      repoInfo,
      ["/commits?path=", [{ sha: NEW }]],
      ["/compare/", { ahead_by: 3, files: [{}, {}], commits: [{ commit: { message: "fix: thing\n\nbody" } }] }],
      ["/contents/", {}],
    ])
  );
  assert.equal(result.status, "updated");
  assert.equal(result.aheadBy, 3);
  assert.equal(result.changedFiles, 2);
  assert.equal(result.note, "fix: thing");
});

test("drift when the path has no commits on the default branch", async () => {
  const result = await checkEntry(entry(), api([repoInfo, ["/commits?path=", []]]));
  assert.equal(result.status, "drift");
});

test("drift when the path is missing at HEAD", async () => {
  const result = await checkEntry(
    entry(),
    api([
      repoInfo,
      ["/commits?path=", [{ sha: NEW }]],
      ["/compare/", { ahead_by: 1, commits: [] }],
      ["/contents/", { notFound: true }],
    ])
  );
  assert.equal(result.status, "drift");
});

test("unverifiable when the pinned commit is gone (history rewrite)", async () => {
  const result = await checkEntry(
    entry(),
    api([repoInfo, ["/commits?path=", [{ sha: NEW }]], ["/compare/", { notFound: true }]])
  );
  assert.equal(result.status, "unverifiable");
});

test("error when the API fails", async () => {
  const result = await checkEntry(entry(), async () => {
    throw new Error("503 rate limited");
  });
  assert.equal(result.status, "error");
  assert.match(result.note, /rate limited/);
});

test("vendor-file entries check the source file path", async () => {
  const seen = [];
  const result = await checkEntry(
    entry({
      id: "web-design-guidelines",
      repo: "acme/guidelines",
      path: ".agents/skills/web-design-guidelines",
      updateMode: "vendor-file",
      sourcePath: "command.md",
    }),
    async (path) => {
      seen.push(path);
      if (path === "/repos/acme/guidelines") return { default_branch: "main" };
      if (path.includes("/commits?path=")) return [{ sha: PIN }];
      throw new Error(`unexpected API path: ${path}`);
    }
  );
  assert.equal(result.status, "current");
  assert.ok(seen.some((path) => path.includes("command.md")));
});

test("exit codes: 0 current, 3 updates or drift, 1 errors", () => {
  assert.equal(exitCode([{ status: "current" }]), 0);
  assert.equal(exitCode([{ status: "current" }, { status: "updated" }]), 3);
  assert.equal(exitCode([{ status: "drift" }]), 3);
  assert.equal(exitCode([{ status: "error" }]), 1);
});
