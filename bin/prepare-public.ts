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
interface Remote { name: string; mount: string; assets?: RemoteAsset[] }

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

function link(source: string, destination: string): void {
  if (!fs.existsSync(source)) throw new Error(`prepare-public: asset source does not exist: ${source}`);
  if (fs.existsSync(destination) || fs.lstatSync(path.dirname(destination), { throwIfNoEntry: false })?.isSymbolicLink()) {
    throw new Error(`prepare-public: asset destination collides: ${destination}`);
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const resolvedSource = fs.realpathSync(source);
  fs.symlinkSync(path.relative(path.dirname(destination), resolvedSource), destination);
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

if (scope.remotePreview) {
  link(path.join(root, "public", "favicon.svg"), path.join(output, "favicon.svg"));
  link(path.join(root, "images", "icons"), path.join(output, "images", "icons"));
} else {
  for (const entry of fs.readdirSync(path.join(root, "public"))) {
    link(path.join(root, "public", entry), path.join(output, entry));
  }
}

for (const remote of manifest.remotes) {
  if (scope.remotePreview && scope.remotePreview.name !== remote.name) continue;
  const stateFile = path.join(root, ".remote", `${remote.name}.json`);
  if (!fs.existsSync(stateFile)) throw new Error(`prepare-public: missing fetch state for remote "${remote.name}"`);
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8")) as { skipped?: boolean };
  if (state.skipped) throw new Error(`prepare-public: remote "${remote.name}" was omitted but its assets were requested`);

  for (const [index, asset] of (remote.assets ?? []).entries()) {
    const source = relativeManifestPath(asset.source, `${remote.name}.assets[${index}].source`);
    const mount = relativeManifestPath(asset.mount, `${remote.name}.assets[${index}].mount`);
    link(path.join(root, remote.mount, source), path.join(output, mount));
  }
}

console.log(`prepare-public: ${scope.remotePreview ? `remote preview ${scope.remotePreview.name}` : "full site"} -> ${path.relative(root, output)}`);
