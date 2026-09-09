// Fetches docs owned by other repositories into their mount directories so the
// primary collection builds them at their current URLs. Sources, in order:
//   1. a GitHub tarball authenticated by a Vercel Connect token,
//   2. a GitHub tarball authenticated by GH_TOKEN / GITHUB_TOKEN outside Vercel,
//   3. an anonymous GitHub tarball for public repositories,
//   4. a shallow GitHub SSH checkout for local development.
// Production always reads each repository's `main` branch. A source-repository
// preview replaces exactly one source with an immutable commit SHA and omits
// the other remote sources. Base-repository previews omit every remote. Only
// production and the `connect-preview` custom environment may use Vercel
// Connect. Remote content is copied but never parsed or imported here.
// Usage: node bin/fetch-remotes.ts
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { getToken } from "@vercel/connect";
import { readScope } from "../src/lib/scope.ts";

interface Remote { name: string; repo: string; path: string; mount: string; private?: boolean }
const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "remotes.json"), "utf8")) as { remotes: Remote[] };
const scope = readScope(root);
const stateDir = path.join(root, ".remote");
const usePrefetchedRemotes = process.env.DOCS_REMOTES_PREFETCHED === "1";
const vercelTarget = (process.env.VERCEL_TARGET_ENV ?? process.env.VERCEL_ENV ?? "").trim();
if (process.env.VERCEL === "1" && !vercelTarget) {
  throw new Error(
    "fetch-remotes: VERCEL_TARGET_ENV/VERCEL_ENV is required; enable Vercel system environment variables",
  );
}
const isCredentialFreeVercelEnvironment = process.env.VERCEL === "1"
  && vercelTarget !== "production"
  && vercelTarget !== "connect-preview";
fs.mkdirSync(stateDir, { recursive: true });

type Authentication = "anonymous" | "environment-token" | "vercel-connect";

async function githubAuthentication(remote: Remote, repository: string): Promise<{
  authentication: Authentication;
  token?: string;
}> {
  const environmentToken = (process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN ?? "").trim();
  if (environmentToken) {
    if (process.env.VERCEL === "1") {
      throw new Error(
        "fetch-remotes: GH_TOKEN/GITHUB_TOKEN must not be passed to Vercel; configure Vercel Connect instead",
      );
    }
    return { authentication: "environment-token", token: environmentToken };
  }

  const connector = (process.env.DOCS_GITHUB_CONNECTOR ?? "").trim();
  const oidcToken = (process.env.VERCEL_OIDC_TOKEN ?? "").trim();
  if (connector && remote.private) {
    if (!oidcToken) {
      throw new Error(
        "fetch-remotes: VERCEL_OIDC_TOKEN is required when DOCS_GITHUB_CONNECTOR is configured",
      );
    }
    if (isCredentialFreeVercelEnvironment) {
      throw new Error(
        `fetch-remotes: Vercel Connect is not allowed in the ${vercelTarget || "unknown"} environment`,
      );
    }
    const token = await getToken(connector, {
      subject: { type: "app" },
      authorizationDetails: [
        {
          type: "github_app_installation",
          repositories: [repository],
          permissions: ["contents:read"],
        },
      ],
    });
    return { authentication: "vercel-connect", token };
  }

  return { authentication: "anonymous" };
}

async function downloadGitHubArchive(
  remote: Remote,
  repository: string,
  ref: string,
  destination: string,
): Promise<Authentication> {
  let { authentication, token } = await githubAuthentication(remote, repository);
  try {
    if (remote.private && !token) {
      throw new Error(
        `fetch-remotes: private remote ${remote.name} requires Vercel Connect or an explicit GitHub token`,
      );
    }
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(
      `https://api.github.com/repos/${repository}/tarball/${encodeURIComponent(ref)}`,
      { headers, redirect: "follow" },
    );
    if (!response.ok) {
      throw new Error(
        `fetch-remotes: GitHub archive request failed for ${repository}@${ref}: ${response.status} ${response.statusText}`,
      );
    }
    fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
    return authentication;
  } finally {
    token = undefined;
  }
}

function cleanMount(mount: string) {
  fs.rmSync(mount, { recursive: true, force: true });
  fs.mkdirSync(mount, { recursive: true });
}

function copyTree(src: string, dst: string) {
  let n = 0;
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules" || e.name === ".idea") continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isSymbolicLink()) {
      throw new Error(`fetch-remotes: symbolic links are not allowed in remote content: ${s}`);
    }
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); n += copyTree(s, d); }
    else if (/\.(mdx?|json|png|jpe?g|gif|svg|webp)$/i.test(e.name)) { fs.copyFileSync(s, d); n++; }
  }
  return n;
}

const remoteNames = new Set(manifest.remotes.map((remote) => remote.name));
if (scope.remotePreview && !remoteNames.has(scope.remotePreview.name)) {
  throw new Error(`fetch-remotes: preview scope names unknown remote "${scope.remotePreview.name}"`);
}

for (const r of manifest.remotes) {
  const mount = path.join(root, r.mount);
  if (!scope.remotes) {
    cleanMount(mount);
    const reason = "excluded-from-base-preview";
    fs.writeFileSync(
      path.join(stateDir, `${r.name}.json`),
      JSON.stringify({ name: r.name, repo: r.repo, ref: "main", skipped: true, reason }, null, 2),
    );
    console.log(`fetch-remotes: ${r.name} omitted by build scope (${reason})`);
    continue;
  }

  const selectedPreview = scope.remotePreview?.name === r.name ? scope.remotePreview : undefined;
  const excludedFromRemotePreview = Boolean(scope.remotePreview && !selectedPreview);
  if (excludedFromRemotePreview) {
    cleanMount(mount);
    const reason = "excluded-from-remote-preview";
    fs.writeFileSync(
      path.join(stateDir, `${r.name}.json`),
      JSON.stringify({ name: r.name, repo: r.repo, ref: "main", skipped: true, reason }, null, 2),
    );
    console.log(`fetch-remotes: ${r.name} omitted by build scope (${reason})`);
    continue;
  }

  if (isCredentialFreeVercelEnvironment && r.private) {
    if (selectedPreview) {
      throw new Error(
        `fetch-remotes: private remote ${r.name} previews must target the connect-preview Vercel environment`,
      );
    }
    cleanMount(mount);
    const reason = "excluded-from-untrusted-vercel-preview";
    fs.writeFileSync(
      path.join(stateDir, `${r.name}.json`),
      JSON.stringify({ name: r.name, repo: r.repo, ref: "main", skipped: true, reason }, null, 2),
    );
    console.log(`fetch-remotes: ${r.name} omitted by build scope (${reason})`);
    continue;
  }

  if (selectedPreview && selectedPreview.repository !== r.repo) {
    throw new Error(
      `fetch-remotes: repository "${selectedPreview.repository}" is not registered for remote "${r.name}"`,
    );
  }
  const ref = selectedPreview?.ref ?? "main";
  const sourceRepository = selectedPreview?.sourceRepository ?? r.repo;
  if (usePrefetchedRemotes) {
    const stateFile = path.join(stateDir, `${r.name}.json`);
    if (!fs.existsSync(stateFile)) throw new Error(`fetch-remotes: prefetched state missing for ${r.name}`);
    const state = JSON.parse(fs.readFileSync(stateFile, "utf8")) as {
      name?: string;
      repo?: string;
      sourceRepository?: string;
      ref?: string;
      skipped?: boolean;
    };
    if (
      state.skipped
      || state.name !== r.name
      || state.repo !== r.repo
      || (state.sourceRepository ?? state.repo) !== sourceRepository
      || state.ref !== ref
    ) {
      throw new Error(`fetch-remotes: prefetched state for ${r.name} does not match ${sourceRepository}@${ref}`);
    }
    if (!fs.existsSync(mount)) throw new Error(`fetch-remotes: prefetched mount missing for ${r.name}: ${mount}`);
    console.log(`fetch-remotes: ${r.name} using prefetched artifact ${sourceRepository}@${ref}`);
    continue;
  }

  let source: string | null = null;
  let sourceKind: "github-api" | "github-ssh" | null = null;
  let authentication: Authentication | "ssh" | null = null;
  let temporaryDirectory: string | null = null;
  let commit = "unknown";

  try {
    const canUseGitHubApi = Boolean(
      process.env.GH_TOKEN
      || process.env.GITHUB_TOKEN
      || process.env.DOCS_GITHUB_CONNECTOR
      || process.env.VERCEL_OIDC_TOKEN
      || !r.private,
    );
    if (canUseGitHubApi) {
      const tmp = fs.mkdtempSync(path.join(stateDir, `${r.name}-`));
      temporaryDirectory = tmp;
      const tar = path.join(tmp, "src.tgz");
      authentication = await downloadGitHubArchive(r, sourceRepository, ref, tar);
      execFileSync("tar", ["-xzf", tar, "-C", tmp]);
      const extracted = fs.readdirSync(tmp).find((directory) => directory !== "src.tgz");
      if (!extracted) throw new Error(`fetch-remotes: archive for ${r.name} contained no root directory`);
      source = path.join(tmp, extracted, r.path);
      sourceKind = "github-api";
      commit = extracted.split("-").pop() ?? "unknown";
    } else if (!process.env.CI) {
      const tmp = fs.mkdtempSync(path.join(stateDir, `${r.name}-`));
      temporaryDirectory = tmp;
      const checkout = path.join(tmp, "checkout");
      execFileSync(
        "git",
        ["clone", "--depth", "1", "--branch", ref, `git@github.com:${sourceRepository}.git`, checkout],
        { stdio: "inherit" },
      );
      source = path.join(checkout, r.path);
      sourceKind = "github-ssh";
      authentication = "ssh";
      commit = execFileSync("git", ["-C", checkout, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    }

    if (!source) {
      throw new Error(
        `fetch-remotes: private remote ${r.name} (${sourceRepository}@${ref}) requires Vercel Connect, GH_TOKEN/GITHUB_TOKEN, or local SSH access`,
      );
    }
    if (!fs.existsSync(source)) throw new Error(`fetch-remotes: source path does not exist for ${r.name}: ${source}`);

    cleanMount(mount);
    const files = copyTree(source, mount);
    fs.writeFileSync(
      path.join(stateDir, `${r.name}.json`),
      JSON.stringify({ name: r.name, repo: r.repo, sourceRepository, ref, source: sourceKind, authentication, commit, fetchedAt: new Date().toISOString(), files }, null, 2),
    );
    console.log(`fetch-remotes: ${r.name} <- ${sourceKind}/${authentication} ${sourceRepository}@${ref} (${commit.slice(0, 12)}): ${files} files into ${r.mount}`);
  } finally {
    if (temporaryDirectory) fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}
