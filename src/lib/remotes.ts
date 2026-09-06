import fs from "node:fs";
import path from "node:path";

interface RemoteDefinition {
  name: string;
  repo: string;
  path: string;
  mount: string;
  editPattern: string;
}

interface RemoteState {
  name: string;
  repo: string;
  ref: string;
  skipped?: boolean;
}

interface ContentEntry {
  id: string;
  filePath?: string;
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

function readRemoteDefinitions(root: string): RemoteDefinition[] {
  const file = path.join(root, "remotes.json");
  const manifest = JSON.parse(fs.readFileSync(file, "utf8")) as { remotes?: RemoteDefinition[] };
  if (!Array.isArray(manifest.remotes)) throw new Error("remotes.json must contain a remotes array");
  return manifest.remotes;
}

function sourcePathWithinMount(entry: ContentEntry, mount: string): string {
  if (!entry.filePath) {
    throw new Error(`Remote entry "${entry.id}" has no source file path`);
  }

  const filePath = entry.filePath.replaceAll("\\", "/");
  const normalizedMount = trimSlashes(mount);
  if (filePath.startsWith(`${normalizedMount}/`)) return filePath.slice(normalizedMount.length + 1);

  const marker = `/${normalizedMount}/`;
  const markerIndex = filePath.indexOf(marker);
  if (markerIndex !== -1) return filePath.slice(markerIndex + marker.length);

  throw new Error(`Remote entry "${entry.id}" has source path outside its mount: ${entry.filePath}`);
}

/**
 * Resolve the source repository edit URL for fetched remote content.
 *
 * The fetched state is authoritative for the ref. This keeps preview links
 * pinned to the same revision that supplied the rendered page instead of
 * silently pointing at the remote's default branch.
 */
export function getRemoteEditUrl(entry: ContentEntry, root = process.cwd()): string | undefined {
  const remote = readRemoteDefinitions(root).find(({ mount }) => {
    const normalizedMount = trimSlashes(mount);
    return entry.id === normalizedMount || entry.id.startsWith(`${normalizedMount}/`);
  });
  if (!remote) return undefined;
  if (!remote.editPattern?.includes("{path}")) {
    throw new Error(`Remote "${remote.name}" must define an editPattern containing {path}`);
  }

  const stateFile = path.join(root, ".remote", `${remote.name}.json`);
  if (!fs.existsSync(stateFile)) {
    throw new Error(`Remote entry "${entry.id}" has no fetch state at ${stateFile}`);
  }
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8")) as RemoteState;
  if (state.skipped) throw new Error(`Remote entry "${entry.id}" belongs to a remote omitted by the build scope`);
  if (state.name !== remote.name || state.repo !== remote.repo || typeof state.ref !== "string" || !state.ref) {
    throw new Error(`Fetch state for remote "${remote.name}" does not match remotes.json`);
  }

  const relativePath = sourcePathWithinMount(entry, remote.mount);
  const sourcePath = path.posix.join(remote.path === "." ? "" : trimSlashes(remote.path), relativePath);
  return remote.editPattern
    .replaceAll("{repo}", remote.repo)
    .replaceAll("{ref}", state.ref)
    .replaceAll("{path}", sourcePath);
}
