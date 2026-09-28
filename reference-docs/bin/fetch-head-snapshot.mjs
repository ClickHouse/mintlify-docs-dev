import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// A Cloudflare R2 custom domain, or a build-authorized R2 read gateway. The
// build downloads Head once; releases are never read through this input.
const origin = process.env.REFERENCE_HEAD_R2_ORIGIN?.replace(/\/$/, "");
const destination = path.resolve(".cache/reference-head-snapshot");

function snapshotUrl(relativePath) {
  const relative = relativePath.replace(/^\/+/, "");
  if (relative.includes("..")) throw new Error(`Snapshot path escapes its root: ${relativePath}`);
  return `${origin}/${relative}`;
}

async function download(relativePath) {
  const response = await fetch(snapshotUrl(relativePath), { redirect: "error" });
  if (!response.ok) throw new Error(`Could not read Head snapshot ${relativePath}: ${response.status}`);
  const destinationFile = path.resolve(destination, relativePath);
  if (!destinationFile.startsWith(`${destination}${path.sep}`)) throw new Error(`Snapshot path escapes its root: ${relativePath}`);
  await mkdir(path.dirname(destinationFile), { recursive: true });
  await writeFile(destinationFile, Buffer.from(await response.arrayBuffer()));
}

if (!origin) {
  // The initial project intentionally deploys without a configured R2 origin.
  // Astro still emits the static unavailable Head landing page; no fixture or
  // stale local snapshot may accidentally become deployable content.
  await rm(destination, { recursive: true, force: true });
  console.log("fetch-head-snapshot: REFERENCE_HEAD_R2_ORIGIN is not configured; emitting no Head content pages");
  process.exit(0);
}

await rm(destination, { recursive: true, force: true });
await download("manifest.json");
const manifest = JSON.parse(await readFile(path.join(destination, "manifest.json"), "utf8"));
if (!Array.isArray(manifest.catalogs)) throw new Error("Head snapshot manifest has no catalogs array");
for (const catalog of manifest.catalogs) {
  if (typeof catalog?.path !== "string") throw new Error("Head snapshot catalog has no path");
  await download(catalog.path);
}
console.log(`fetch-head-snapshot: fetched ${manifest.catalogs.length} catalogs from the configured build input`);
