/**
 * Download the one immutable snapshot selected for the Head reference build.
 *
 * This runs before `vercel-build.ts` removes the deployment's OIDC identity.
 * It handles only CI-produced JSON, writes it to a local build directory, and
 * leaves rendering and validation to the credential-free reference generator.
 */
import { get } from "@vercel/blob";
import fs from "node:fs";
import path from "node:path";

type Catalog = { name: string; path: string; rows: number; sha256: string };
type Manifest = { schemaVersion: number; clickhouseVersion: string; catalogs: Catalog[] };
type BuildInput = { snapshot: string; clickhouseVersion?: string; source?: string };

const root = process.cwd();
const descriptorPath = process.env.REFERENCE_HEAD_SNAPSHOT_DESCRIPTOR ?? "snapshots/head/build-input.json";
const outputRoot = path.resolve(process.env.REFERENCE_HEAD_SNAPSHOT_DIR ?? path.join(root, ".reference-snapshots", "head"));

function assertRelativePath(value: string, label: string): void {
  if (!value || value.startsWith("/") || value.includes("\\") || value.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

function outputPath(relativePath: string): string {
  assertRelativePath(relativePath, "snapshot path");
  const target = path.resolve(outputRoot, relativePath);
  if (!target.startsWith(`${outputRoot}${path.sep}`)) throw new Error(`Snapshot path escapes its build directory: ${relativePath}`);
  return target;
}

async function readBlob(pathname: string, fresh = false): Promise<Buffer> {
  const result = await get(pathname, { access: "private", useCache: !fresh });
  if (!result || result.statusCode !== 200) throw new Error(`Reference snapshot blob not found: ${pathname}`);
  return Buffer.from(await new Response(result.stream).arrayBuffer());
}

async function download(pathname: string, destination: string, fresh = false): Promise<void> {
  const bytes = await readBlob(pathname, fresh);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, bytes);
}

assertRelativePath(descriptorPath, "Head snapshot descriptor path");
fs.mkdirSync(outputRoot, { recursive: true });

const descriptorBytes = await readBlob(descriptorPath, true);
const buildInput = JSON.parse(descriptorBytes.toString("utf8")) as BuildInput;
if (!/^snapshots\/head\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(buildInput.snapshot ?? "")) {
  throw new Error("Head build input must select an immutable snapshots/head/<key> directory");
}

const manifestBlobPath = `${buildInput.snapshot}/manifest.json`;
const manifestBytes = await readBlob(manifestBlobPath);
const manifest = JSON.parse(manifestBytes.toString("utf8")) as Manifest;
if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.catalogs) || !manifest.clickhouseVersion) {
  throw new Error(`Unsupported reference snapshot manifest: ${manifestBlobPath}`);
}
if (buildInput.clickhouseVersion && buildInput.clickhouseVersion !== manifest.clickhouseVersion) {
  throw new Error(`Head build input declares ${buildInput.clickhouseVersion}, but its manifest declares ${manifest.clickhouseVersion}`);
}

fs.writeFileSync(outputPath("build-input.json"), descriptorBytes);
fs.writeFileSync(outputPath("manifest.json"), manifestBytes);
// `reference-site.json` describes the versioned route and navigation contract.
// It is deliberately separate from the system-table catalogs, so it is not a
// manifest catalog entry but is nevertheless a required renderer input.
await download(`${buildInput.snapshot}/metadata/reference-site.json`, outputPath("metadata/reference-site.json"));
for (const catalog of manifest.catalogs) {
  assertRelativePath(catalog.path, `catalog path for ${catalog.name}`);
  await download(`${buildInput.snapshot}/${catalog.path}`, outputPath(catalog.path));
}

console.log(`fetch-reference-snapshot: downloaded ${manifest.catalogs.length} catalogs for ClickHouse ${manifest.clickhouseVersion}`);
