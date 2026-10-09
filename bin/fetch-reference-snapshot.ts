/**
 * Materialize the Head reference snapshot for the static docs build.
 *
 * ClickHouse CI overwrites one private Blob object after each trusted nightly
 * export: `snapshots/head/reference-snapshot.tar.zst`. A docs build reads one
 * complete revision of that archive, validates it in a staging directory, and
 * promotes it only when all renderer inputs are coherent. It never combines
 * independently fetched catalogs from different Head revisions.
 */
import { get } from "@vercel/blob";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type Catalog = { name: string; path: string; rows: number; sha256: string };
type Manifest = { schemaVersion: number; clickhouseVersion: string; catalogs: Catalog[] };
type ReferenceMetadata = { schemaVersion: number; clickhouseVersion: string };

const root = process.cwd();
const archivePathname = process.env.REFERENCE_HEAD_SNAPSHOT_PATH ?? "snapshots/head/reference-snapshot.tar.zst";
const localArchive = process.env.REFERENCE_HEAD_SNAPSHOT_ARCHIVE;
const outputRoot = path.resolve(process.env.REFERENCE_HEAD_SNAPSHOT_DIR ?? path.join(root, ".reference-snapshots", "head"));

function assertRelativePath(value: string, label: string): void {
  if (!value || value.startsWith("/") || value.includes("\\") || value.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

function outputPath(snapshotRoot: string, relativePath: string): string {
  assertRelativePath(relativePath, "snapshot path");
  const target = path.resolve(snapshotRoot, relativePath);
  if (!target.startsWith(`${snapshotRoot}${path.sep}`)) throw new Error(`Snapshot path escapes its build directory: ${relativePath}`);
  return target;
}

function run(command: string, args: string[]): Buffer {
  try {
    return execFileSync(command, args, {
      encoding: "buffer",
      stdio: ["ignore", "pipe", "pipe"],
    }) as Buffer;
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    throw new Error(`Reference snapshot preparation failed while running ${command}: ${details}`);
  }
}

async function downloadArchive(destination: string): Promise<void> {
  if (localArchive) {
    if (process.env.VERCEL === "1") {
      throw new Error("REFERENCE_HEAD_SNAPSHOT_ARCHIVE is a local-development override and cannot be used on Vercel");
    }
    const source = path.resolve(localArchive);
    if (!fs.statSync(source).isFile()) throw new Error(`Local reference snapshot archive does not exist: ${source}`);
    fs.copyFileSync(source, destination);
    return;
  }

  // A mutable Blob pathname can otherwise be served from the CDN for up to a
  // minute. The build needs the latest completed Head archive, not a cached
  // prior generation.
  const result = await get(archivePathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) throw new Error(`Head reference snapshot blob not found: ${archivePathname}`);
  fs.writeFileSync(destination, Buffer.from(await new Response(result.stream).arrayBuffer()));
}

function archiveEntries(tarPath: string): void {
  const entries = run("tar", ["-tvf", tarPath]).toString("utf8").trim().split("\n").filter(Boolean);
  if (!entries.length) throw new Error("Reference snapshot archive is empty");
  for (const entry of entries) {
    const type = entry[0];
    if (type === "l" || type === "h") throw new Error(`Reference snapshot archive contains a link entry: ${entry}`);
    // Both GNU tar and bsdtar put the member name after the final whitespace
    // field. The exporter writes only simple, whitespace-free member paths;
    // reject anything that does not retain that safety property.
    const member = entry.trim().split(/\s+/).at(-1)?.replace(/^\.\//, "").replace(/\/$/, "") ?? "";
    assertRelativePath(member, "archive member path");
  }
}

function digest(file: string): string {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function validateSnapshot(snapshotRoot: string): Manifest {
  const manifestPath = outputPath(snapshotRoot, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Manifest;
  if (manifest.schemaVersion !== 1 || !manifest.clickhouseVersion || !Array.isArray(manifest.catalogs)) {
    throw new Error("Unsupported reference snapshot manifest");
  }

  const metadataPath = outputPath(snapshotRoot, "metadata/reference-site.json");
  if (!fs.existsSync(metadataPath)) {
    throw new Error("Reference snapshot is missing metadata/reference-site.json");
  }
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8")) as ReferenceMetadata;
  if (metadata.schemaVersion !== 1 || metadata.clickhouseVersion !== manifest.clickhouseVersion) {
    throw new Error("Reference snapshot routing metadata does not match its manifest");
  }

  const catalogNames = new Set<string>();
  for (const catalog of manifest.catalogs) {
    if (!catalog.name || catalogNames.has(catalog.name)) throw new Error(`Invalid duplicate reference catalog: ${catalog.name}`);
    catalogNames.add(catalog.name);
    if (!Number.isInteger(catalog.rows) || catalog.rows < 0 || !/^[a-f0-9]{64}$/.test(catalog.sha256)) {
      throw new Error(`Invalid manifest entry for reference catalog ${catalog.name}`);
    }
    const catalogPath = outputPath(snapshotRoot, catalog.path);
    if (!fs.statSync(catalogPath).isFile()) throw new Error(`Reference snapshot catalog is missing: ${catalog.path}`);
    if (digest(catalogPath) !== catalog.sha256) throw new Error(`Reference snapshot catalog digest mismatch: ${catalog.name}`);
    const rows = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
    if (!Array.isArray(rows) || rows.length !== catalog.rows) throw new Error(`Reference snapshot catalog row count mismatch: ${catalog.name}`);
  }
  return manifest;
}

function promoteSnapshot(snapshotRoot: string): void {
  const backupRoot = `${outputRoot}.previous-${process.pid}`;
  let movedPrevious = false;
  try {
    if (fs.existsSync(outputRoot)) {
      fs.rmSync(backupRoot, { recursive: true, force: true });
      fs.renameSync(outputRoot, backupRoot);
      movedPrevious = true;
    }
    fs.renameSync(snapshotRoot, outputRoot);
    if (movedPrevious) fs.rmSync(backupRoot, { recursive: true, force: true });
  } catch (error) {
    if (movedPrevious && !fs.existsSync(outputRoot) && fs.existsSync(backupRoot)) fs.renameSync(backupRoot, outputRoot);
    throw error;
  }
}

assertRelativePath(archivePathname, "Head snapshot archive path");
fs.mkdirSync(path.dirname(outputRoot), { recursive: true });
const stagingRoot = fs.mkdtempSync(path.join(path.dirname(outputRoot), ".head-staging-"));
const archiveFile = path.join(stagingRoot, "reference-snapshot.tar.zst");
const tarFile = path.join(stagingRoot, "reference-snapshot.tar");
const unpackedRoot = path.join(stagingRoot, "unpacked");
// Praktika archives the snapshot directory itself, rather than its contents.
// Pin that layout so an unexpected archive cannot silently change the build
// input root.
const snapshotRoot = path.join(unpackedRoot, "reference-snapshot");

try {
  await downloadArchive(archiveFile);
  run("zstd", ["--decompress", "--force", "-o", tarFile, archiveFile]);
  archiveEntries(tarFile);
  fs.mkdirSync(unpackedRoot);
  run("tar", ["-xf", tarFile, "-C", unpackedRoot]);
  if (!fs.statSync(snapshotRoot).isDirectory()) {
    throw new Error("Reference snapshot archive must contain a reference-snapshot directory");
  }
  const manifest = validateSnapshot(snapshotRoot);
  promoteSnapshot(snapshotRoot);
  console.log(`fetch-reference-snapshot: materialized ${manifest.catalogs.length} catalogs for ClickHouse ${manifest.clickhouseVersion}`);
} finally {
  fs.rmSync(stagingRoot, { recursive: true, force: true });
}
