/**
 * Render multiple complete reference snapshots into one local prototype.
 *
 * This is deliberately a build orchestrator, not a runtime fallback: every
 * selected version receives its own MDX tree, navigation, and explorer index.
 * Production will receive the same inputs from private object storage.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

type VersionBuild = {
  key: string;
  snapshotDir: string;
  routePrefix: string;
  label: string;
};

const defaultBuilds: VersionBuild[] = [
  {
    key: "latest",
    snapshotDir: "/private/tmp/reference-snapshot-master-current-complete",
    routePrefix: "/reference",
    label: "Latest · 26.10",
  },
  {
    key: "26.9",
    snapshotDir: "/private/tmp/reference-snapshot-26.9-fixture",
    // URL slugs use hyphens: dots remain reserved for the immutable release
    // artifact key (`26.9`) and the human-facing label.
    routePrefix: "/reference/26-9",
    label: "26.9",
  },
];

const builds = process.env.REFERENCE_VERSION_BUILDS
  ? JSON.parse(process.env.REFERENCE_VERSION_BUILDS) as VersionBuild[]
  : defaultBuilds;
if (!Array.isArray(builds) || builds.length === 0) throw new Error("REFERENCE_VERSION_BUILDS must contain at least one snapshot build");

const root = process.cwd();
const outputRoot = path.join(root, "reference-prototype");
const settingsRoot = path.join(root, ".remote", "public-build", "reference-settings-index");
const registryPath = path.join(root, "src", "generated", "reference-prototype.versions.json");

// All three locations are derived build output. Clear them once, then let each
// snapshot renderer own only its version-specific subtree.
fs.rmSync(outputRoot, { recursive: true, force: true });
fs.rmSync(settingsRoot, { recursive: true, force: true });
fs.rmSync(registryPath, { force: true });

for (const build of builds) {
  if (!fs.existsSync(build.snapshotDir)) throw new Error(`Snapshot does not exist for ${build.key}: ${build.snapshotDir}`);
  const result = spawnSync(process.execPath, ["bin/generate-reference-prototype.ts"], {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      REFERENCE_SNAPSHOT_DIR: build.snapshotDir,
      REFERENCE_VERSION_KEY: build.key,
      REFERENCE_ROUTE_PREFIX: build.routePrefix,
      REFERENCE_VERSION_LABEL: build.label,
      REFERENCE_PROTOTYPE_OUTPUT_DIR: path.join("reference-prototype", build.key),
    },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`generate-reference-prototype-versions: rendered ${builds.map((build) => build.key).join(", ")}`);
