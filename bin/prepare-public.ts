/**
 * Build the public asset view consumed by Astro.
 *
 * Full builds retain the existing public trees. A remote preview exposes only
 * shared chrome icons and explicitly declared assets from its selected mount,
 * preventing Astro from copying the entire documentation image corpus.
 */
import fs from "node:fs";
import path from "node:path";
import { readScope } from "../src/lib/scope.ts";

interface RemoteAsset { source: string; mount: string }
interface Remote { name: string; repo: string; mount: string; assets?: RemoteAsset[] }

const root = process.cwd();
const scope = readScope(root);
const output = path.join(root, ".remote", "public-build");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "remotes.json"), "utf8")) as { remotes: Remote[] };

function relativeManifestPath(value: string, field: string): string {
  const normalized = value.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
  if (!normalized || normalized.split("/").includes("..")) {
    throw new Error(`prepare-public: ${field} must be a non-empty relative path`);
  }
  return normalized;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rewriteRemoteAssetUrls(remote: Remote): number {
  const assets = (remote.assets ?? []).map((asset, index) => ({
    source: relativeManifestPath(asset.source, `${remote.name}.assets[${index}].source`),
    mount: relativeManifestPath(asset.mount, `${remote.name}.assets[${index}].mount`),
  }));
  if (!assets.length) return 0;

  const directory = path.join(root, remote.mount);
  let changed = 0;
  const visit = (current: string): void => {
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

function materialize(source: string, destination: string): void {
  if (!fs.existsSync(source)) throw new Error(`prepare-public: asset source does not exist: ${source}`);
  if (fs.existsSync(destination)) {
    throw new Error(`prepare-public: asset destination collides: ${destination}`);
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const resolvedSource = fs.realpathSync(source);
  const sourceStat = fs.statSync(resolvedSource);
  if (sourceStat.isDirectory()) {
    fs.cpSync(resolvedSource, destination, { recursive: true, dereference: true });
  } else {
    fs.copyFileSync(resolvedSource, destination);
  }
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

if (scope.remotePreview) {
  materialize(path.join(root, "public", "favicon.svg"), path.join(output, "favicon.svg"));
  materialize(path.join(root, "images", "icons"), path.join(output, "images", "icons"));
} else {
  for (const entry of fs.readdirSync(path.join(root, "public"))) {
    materialize(path.join(root, "public", entry), path.join(output, entry));
  }
}

for (const remote of manifest.remotes) {
  if (scope.remotePreview && scope.remotePreview.name !== remote.name) continue;
  const stateFile = path.join(root, ".remote", `${remote.name}.json`);
  if (!fs.existsSync(stateFile)) throw new Error(`prepare-public: missing fetch state for remote "${remote.name}"`);
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8")) as {
    name?: string;
    repo?: string;
    skipped?: boolean;
    reason?: string;
  };
  if (state.name !== remote.name || state.repo !== remote.repo) {
    throw new Error(`prepare-public: fetch state for remote "${remote.name}" does not match remotes.json`);
  }
  if (state.skipped) {
    if (state.reason === "excluded-from-untrusted-vercel-preview") continue;
    throw new Error(`prepare-public: remote "${remote.name}" was omitted but its assets were requested`);
  }

  const rewrittenAssetReferences = rewriteRemoteAssetUrls(remote);
  if (rewrittenAssetReferences) {
    console.log(`prepare-public: rewrote asset references in ${rewrittenAssetReferences} ${remote.name} files`);
  }

  for (const [index, asset] of (remote.assets ?? []).entries()) {
    const source = relativeManifestPath(asset.source, `${remote.name}.assets[${index}].source`);
    const mount = relativeManifestPath(asset.mount, `${remote.name}.assets[${index}].mount`);
    materialize(path.join(root, remote.mount, source), path.join(output, mount));
  }
}

console.log(`prepare-public: ${scope.remotePreview ? `remote preview ${scope.remotePreview.name}` : "full site"} -> ${path.relative(root, output)}`);
