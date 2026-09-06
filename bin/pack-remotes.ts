/** Package fetched remote content for the credential-free build job. */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { readScope } from "../src/lib/scope.ts";

interface Remote {
  name: string;
  mount: string;
}

const root = process.cwd();
const scope = readScope(root);
const manifest = JSON.parse(fs.readFileSync(path.join(root, "remotes.json"), "utf8")) as { remotes: Remote[] };
const selected = scope.remotePreview
  ? manifest.remotes.filter((remote) => remote.name === scope.remotePreview?.name)
  : manifest.remotes;
if (!selected.length) throw new Error("pack-remotes: build scope selected no registered remote sources");

const entries: string[] = [];
if (scope.remotePreview) {
  if (!fs.existsSync(path.join(root, ".preview-scope.json"))) {
    throw new Error("pack-remotes: remote preview scope was not materialised");
  }
  entries.push(".preview-scope.json");
}

for (const remote of selected) {
  const state = `.remote/${remote.name}.json`;
  if (!fs.existsSync(path.join(root, state))) throw new Error(`pack-remotes: missing ${state}`);
  if (!fs.existsSync(path.join(root, remote.mount))) {
    throw new Error(`pack-remotes: missing fetched mount ${remote.mount}`);
  }
  entries.push(state, remote.mount);
}

const archive = path.resolve(root, process.env.DOCS_REMOTE_ARCHIVE ?? "tmp/remotes.tgz");
fs.mkdirSync(path.dirname(archive), { recursive: true });
execFileSync("tar", ["-czf", archive, ...entries], { cwd: root, stdio: "inherit" });
console.log(`pack-remotes: ${selected.map((remote) => remote.name).join(", ")} -> ${path.relative(root, archive)}`);
