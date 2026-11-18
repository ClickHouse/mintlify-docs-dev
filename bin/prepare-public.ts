/**
 * Build the public asset view consumed by Astro.
 *
 * Full builds retain the existing public trees. Nimbus resolves external docs
 * into `.nimbus/sources`; this step copies only explicitly declared source
 * assets into their public mount.
 */
import fs from "node:fs";
import path from "node:path";
import { interpolateDocsVariables, readDocsVariables } from "../src/lib/docs-variables.ts";
import { readScope } from "../src/lib/scope.ts";

interface RemoteAsset { source: string; mount: string }
interface Remote { name: string; repo: string; path: string; mount: string; assets?: RemoteAsset[] }

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

function interpolateRemoteVariables(remote: Remote, directory: string): { files: number; replacements: number } {
  const configFile = path.join(directory, "docs.json");
  if (!fs.existsSync(configFile)) return { files: 0, replacements: 0 };

  const config = JSON.parse(fs.readFileSync(configFile, "utf8")) as { variables?: unknown };
  const variables = readDocsVariables(config.variables, `${remote.name}/docs.json`);
  if (!variables) return { files: 0, replacements: 0 };

  let files = 0;
  let replacements = 0;
  const visit = (current: string): void => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.mdx?$/.test(entry.name)) {
        const original = fs.readFileSync(file, "utf8");
        const result = interpolateDocsVariables(original, variables, path.relative(root, file));
        if (result.replacements) {
          fs.writeFileSync(file, result.content);
          files++;
          replacements += result.replacements;
        }
      }
    }
  };
  visit(directory);
  return { files, replacements };
}

function rewriteRemoteAssetUrls(remote: Remote, directory: string): number {
  const assets = (remote.assets ?? []).map((asset, index) => ({
    source: relativeManifestPath(asset.source, `${remote.name}.assets[${index}].source`),
    mount: relativeManifestPath(asset.mount, `${remote.name}.assets[${index}].mount`),
  }));
  if (!assets.length) return 0;

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

/** The source selected by Nimbus during the preceding `astro sync`. */
function sourceDirectory(remote: Remote): string | undefined {
  const currentFile = path.join(root, ".nimbus", "sources", "current.json");
  if (!fs.existsSync(currentFile)) return undefined;
  const current = JSON.parse(fs.readFileSync(currentFile, "utf8")) as {
    version?: number;
    sources?: Record<string, { dir?: string; path?: string }>;
  };
  const source = current.sources?.[remote.name];
  if (!source?.dir) return undefined;
  const snapshot = path.resolve(root, source.dir);
  const sourcesRoot = path.resolve(root, ".nimbus", "sources");
  if (!snapshot.startsWith(`${sourcesRoot}${path.sep}`)) {
    throw new Error(`prepare-public: source snapshot for ${remote.name} escapes .nimbus/sources`);
  }
  return path.join(snapshot, source.path ?? (remote.path === "." ? "" : remote.path));
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

if (scope.deployTarget === "translations") {
  // Locale routes reference the shared `/docs/images` and `/docs/img` paths,
  // which the default English application owns. Do not copy that corpus into
  // the translation project's build workspace or deployment.
} else if (scope.remotePreview) {
  materialize(path.join(root, "public", "favicon.svg"), path.join(output, "favicon.svg"));
  materialize(path.join(root, "images", "logo.svg"), path.join(output, "images", "logo.svg"));
  materialize(path.join(root, "images", "icons"), path.join(output, "images", "icons"));
} else {
  for (const entry of fs.readdirSync(path.join(root, "public"))) {
    if (entry === "images" || entry === "img") continue;
    materialize(path.join(root, "public", entry), path.join(output, entry));
  }
  materialize(path.join(root, "images"), path.join(output, "images"));
  materialize(path.join(root, "img"), path.join(output, "img"));
}

for (const remote of manifest.remotes) {
  if (!scope.remotes || (scope.remotePreview && scope.remotePreview.name !== remote.name)) continue;
  const directory = sourceDirectory(remote);
  // `astro sync` is deliberately non-fatal when a local credential is absent;
  // the following full build reports Nimbus's source-specific error.
  if (!directory) continue;
  if (!fs.existsSync(directory)) {
    throw new Error(`prepare-public: Nimbus selected a missing source directory for ${remote.name}: ${directory}`);
  }

  const interpolatedVariables = interpolateRemoteVariables(remote, directory);
  if (interpolatedVariables.replacements) {
    console.log(
      `prepare-public: interpolated ${interpolatedVariables.replacements} ${remote.name} variable references in ${interpolatedVariables.files} files`,
    );
  }

  const rewrittenAssetReferences = rewriteRemoteAssetUrls(remote, directory);
  if (rewrittenAssetReferences) {
    console.log(`prepare-public: rewrote asset references in ${rewrittenAssetReferences} ${remote.name} files`);
  }

  if (scope.deployTarget !== "translations") {
    for (const [index, asset] of (remote.assets ?? []).entries()) {
      const source = relativeManifestPath(asset.source, `${remote.name}.assets[${index}].source`);
      const mount = relativeManifestPath(asset.mount, `${remote.name}.assets[${index}].mount`);
      materialize(path.join(directory, source), path.join(output, mount));
    }
  }
}

const scopeLabel = scope.remotePreview
  ? `source preview ${scope.remotePreview.name}`
  : scope.remotes
    ? "full site"
    : "base preview";
console.log(`prepare-public: ${scopeLabel} -> ${path.relative(root, output)}`);
