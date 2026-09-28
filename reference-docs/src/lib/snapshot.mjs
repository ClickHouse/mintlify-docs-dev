import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

export const SNAPSHOT_SCHEMA_VERSION = 1;

function canonicalJson(value) {
  return `${JSON.stringify(value, Object.keys(value).sort(), 2)}\n`;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

export function loadSnapshot(root = process.env.REFERENCE_SNAPSHOT_DIR ?? "./fixtures/snapshot") {
  const resolvedRoot = path.resolve(root);
  const manifest = readJson(path.join(resolvedRoot, "manifest.json"));
  if (manifest.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(`Unsupported reference snapshot schema: ${manifest.schemaVersion}`);
  }
  if (!Array.isArray(manifest.catalogs)) {
    throw new Error("Reference snapshot manifest has no catalogs array");
  }

  const catalogs = new Map();
  for (const catalog of manifest.catalogs) {
    if (!catalog?.name || !catalog?.path || !catalog?.sha256) {
      throw new Error("Reference snapshot catalog is missing its name, path, or digest");
    }
    const file = path.resolve(resolvedRoot, catalog.path);
    if (!file.startsWith(`${resolvedRoot}${path.sep}`)) {
      throw new Error(`Reference snapshot catalog escapes its root: ${catalog.path}`);
    }
    const source = readFileSync(file, "utf8");
    if (sha256(source) !== catalog.sha256) {
      throw new Error(`Reference snapshot catalog digest mismatch: ${catalog.name}`);
    }
    const rows = JSON.parse(source);
    if (!Array.isArray(rows) || rows.length !== catalog.rows) {
      throw new Error(`Reference snapshot catalog row count mismatch: ${catalog.name}`);
    }
    catalogs.set(catalog.name, rows);
  }
  return { manifest, catalogs };
}

export function referenceFunctions(snapshot) {
  const rows = snapshot.catalogs.get("functions");
  if (!rows) throw new Error("Reference snapshot does not contain functions");
  return rows.filter((row) => row.alias_to === "" && Number(row.is_aggregate) === 0);
}

export function categorySlug(category) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function categories(snapshot) {
  return [...new Set(referenceFunctions(snapshot).map((row) => row.categories).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

export function functionsForCategory(snapshot, category) {
  return referenceFunctions(snapshot)
    .filter((row) => row.categories === category)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export { canonicalJson };
