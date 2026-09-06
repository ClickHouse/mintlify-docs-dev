// Fetches docs owned by other repositories into their mount directories so the
// primary collection builds them at their current URLs. Sources, in order:
//   1. a GitHub tarball authenticated by GH_TOKEN / GITHUB_TOKEN,
//   2. a shallow GitHub SSH checkout for local development.
// Production always reads each repository's `main` branch. A pull-request
// preview may replace exactly one source with an immutable commit SHA and omits
// the other remote sources. Private remotes fail closed without credentials.
// Usage: node bin/fetch-remotes.ts
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { readScope } from "../src/lib/scope.ts";

interface RemoteAsset { source: string; mount: string }
interface Remote { name: string; repo: string; path: string; mount: string; assets?: RemoteAsset[]; private?: boolean }
const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "remotes.json"), "utf8")) as { remotes: Remote[] };
const scope = readScope(root);
const stateDir = path.join(root, ".remote");
const usePrefetchedRemotes = process.env.DOCS_REMOTES_PREFETCHED === "1";
fs.mkdirSync(stateDir, { recursive: true });

function cleanMount(mount: string) {
  fs.rmSync(mount, { recursive: true, force: true });
  fs.mkdirSync(mount, { recursive: true });
}

function copyTree(src: string, dst: string) {
  let n = 0;
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.name === ".git" || e.name === "node_modules" || e.name === ".idea") continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); n += copyTree(s, d); }
    else if (/\.(mdx?|json|png|jpe?g|gif|svg|webp)$/i.test(e.name)) { fs.copyFileSync(s, d); n++; }
  }
  return n;
}

function relativeManifestPath(value: string, field: string): string {
  const normalized = value.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
  if (!normalized || normalized.split("/").includes("..")) {
    throw new Error(`fetch-remotes: ${field} must be a non-empty relative path`);
  }
  return normalized;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rewriteAssetUrls(directory: string, remote: Remote): number {
  const assets = (remote.assets ?? []).map((asset, index) => ({
    source: relativeManifestPath(asset.source, `${remote.name}.assets[${index}].source`),
    mount: relativeManifestPath(asset.mount, `${remote.name}.assets[${index}].mount`),
  }));
  if (!assets.length) return 0;

  let changed = 0;
  const visit = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.mdx?$/.test(entry.name)) {
        const original = fs.readFileSync(file, "utf8");
        let rewritten = original;
        for (const asset of assets) {
          const pattern = new RegExp(`(^|[^A-Za-z0-9/_-])/${escapeRegExp(asset.source)}/`, "gm");
          rewritten = rewritten.replace(pattern, (_match, prefix: string) => `${prefix}/${asset.mount}/`);
        }
        if (rewritten !== original) {
          fs.writeFileSync(file, rewritten);
          changed++;
        }
      }
    }
  };
  visit(directory);
  return changed;
}

const remoteNames = new Set(manifest.remotes.map((remote) => remote.name));
if (scope.remotePreview && !remoteNames.has(scope.remotePreview.name)) {
  throw new Error(`fetch-remotes: preview scope names unknown remote "${scope.remotePreview.name}"`);
}

for (const r of manifest.remotes) {
  const mount = path.join(root, r.mount);
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

  if (selectedPreview && selectedPreview.repository !== r.repo) {
    throw new Error(
      `fetch-remotes: repository "${selectedPreview.repository}" is not registered for remote "${r.name}"`,
    );
  }
  const ref = selectedPreview?.ref ?? "main";
  if (usePrefetchedRemotes) {
    const stateFile = path.join(stateDir, `${r.name}.json`);
    if (!fs.existsSync(stateFile)) throw new Error(`fetch-remotes: prefetched state missing for ${r.name}`);
    const state = JSON.parse(fs.readFileSync(stateFile, "utf8")) as {
      name?: string;
      repo?: string;
      ref?: string;
      skipped?: boolean;
    };
    if (state.skipped || state.name !== r.name || state.repo !== r.repo || state.ref !== ref) {
      throw new Error(`fetch-remotes: prefetched state for ${r.name} does not match ${r.repo}@${ref}`);
    }
    if (!fs.existsSync(mount)) throw new Error(`fetch-remotes: prefetched mount missing for ${r.name}: ${mount}`);
    console.log(`fetch-remotes: ${r.name} using prefetched artifact ${r.repo}@${ref}`);
    continue;
  }

  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
  let source: string | null = null;
  let sourceKind: "github-api" | "github-ssh" | null = null;
  let temporaryDirectory: string | null = null;
  let commit = "unknown";

  try {
    if (token || !r.private) {
      const tmp = fs.mkdtempSync(path.join(stateDir, `${r.name}-`));
      temporaryDirectory = tmp;
      const tar = path.join(tmp, "src.tgz");
      const headers = token ? ["-H", `Authorization: Bearer ${token}`] : [];
      execFileSync(
        "curl",
        [
          "-sSfL",
          ...headers,
          "-H",
          "Accept: application/vnd.github+json",
          `https://api.github.com/repos/${r.repo}/tarball/${encodeURIComponent(ref)}`,
          "-o",
          tar,
        ],
        { stdio: "inherit" },
      );
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
        ["clone", "--depth", "1", "--branch", ref, `git@github.com:${r.repo}.git`, checkout],
        { stdio: "inherit" },
      );
      source = path.join(checkout, r.path);
      sourceKind = "github-ssh";
      commit = execFileSync("git", ["-C", checkout, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    }

    if (!source) {
      throw new Error(
        `fetch-remotes: private remote ${r.name} (${r.repo}@${ref}) requires GH_TOKEN/GITHUB_TOKEN or an explicit false entry in the preview scope`,
      );
    }
    if (!fs.existsSync(source)) throw new Error(`fetch-remotes: source path does not exist for ${r.name}: ${source}`);

    cleanMount(mount);
    const files = copyTree(source, mount);
    const rewrittenAssetReferences = rewriteAssetUrls(mount, r);
    fs.writeFileSync(
      path.join(stateDir, `${r.name}.json`),
      JSON.stringify({ name: r.name, repo: r.repo, ref, source: sourceKind, commit, fetchedAt: new Date().toISOString(), files, rewrittenAssetReferences }, null, 2),
    );
    console.log(`fetch-remotes: ${r.name} <- ${sourceKind} ${r.repo}@${ref} (${commit.slice(0, 12)}): ${files} files into ${r.mount}`);
  } finally {
    if (temporaryDirectory) fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}
