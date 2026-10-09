/**
 * Create a deliberately synthetic versioned snapshot for local renderer tests.
 * It is not release data: it starts from a real snapshot, changes its version,
 * and removes one record to exercise snapshot-authoritative routing/content.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type Catalog = { name: string; path: string; rows: number; sha256: string };
type Manifest = { schemaVersion: number; clickhouseVersion: string; catalogs: Catalog[] };

const sourceRoot = path.resolve(process.env.REFERENCE_SNAPSHOT_SOURCE ?? "/private/tmp/reference-snapshot-master-current-complete");
const destinationRoot = path.resolve(process.env.REFERENCE_SNAPSHOT_FIXTURE ?? "/private/tmp/reference-snapshot-26.9-fixture");
const fixtureVersion = process.env.REFERENCE_SNAPSHOT_FIXTURE_VERSION ?? "26.9.0-fixture";
const removedSetting = "ai_function_allow_insecure_endpoint";

if (!fs.existsSync(sourceRoot)) throw new Error(`Source snapshot does not exist: ${sourceRoot}`);
if (fs.existsSync(destinationRoot)) throw new Error(`Fixture destination already exists: ${destinationRoot}`);

fs.cpSync(sourceRoot, destinationRoot, { recursive: true });
const manifestPath = path.join(destinationRoot, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Manifest;
const settingsCatalog = manifest.catalogs.find((catalog) => catalog.name === "settings");
if (!settingsCatalog) throw new Error("Source snapshot has no settings catalog");

const settingsPath = path.join(destinationRoot, settingsCatalog.path);
const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8")) as Array<{ name: string }>;
const filteredSettings = settings.filter((setting) => setting.name !== removedSetting);
if (filteredSettings.length === settings.length) throw new Error(`Fixture source does not contain ${removedSetting}`);

const serializedSettings = `${JSON.stringify(filteredSettings, null, 2)}\n`;
fs.writeFileSync(settingsPath, serializedSettings);
settingsCatalog.rows = filteredSettings.length;
settingsCatalog.sha256 = createHash("sha256").update(serializedSettings).digest("hex");
manifest.clickhouseVersion = fixtureVersion;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
// Versioned metadata must be regenerated against the fixture manifest.
fs.rmSync(path.join(destinationRoot, "metadata"), { recursive: true, force: true });

console.log(`create-reference-snapshot-fixture: ${fixtureVersion} at ${destinationRoot}; removed ${removedSetting}`);
