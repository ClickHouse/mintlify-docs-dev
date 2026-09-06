/** Write a validated, immutable remote-preview scope for CI. */
import fs from "node:fs";
import path from "node:path";

interface Remote { name: string; repo: string }

const root = process.cwd();
const name = (process.env.DOCS_REMOTE_NAME ?? "").trim();
const repo = (process.env.DOCS_REMOTE_REPOSITORY ?? "").trim();
const ref = (process.env.DOCS_REMOTE_REF ?? "").trim().toLowerCase();
if (!name || !repo || !ref) {
  throw new Error("write-remote-preview-scope: DOCS_REMOTE_NAME, DOCS_REMOTE_REPOSITORY and DOCS_REMOTE_REF are required");
}
if (!/^[0-9a-f]{40}$/.test(ref)) {
  throw new Error("write-remote-preview-scope: DOCS_REMOTE_REF must be an immutable 40-character commit SHA");
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "remotes.json"), "utf8")) as { remotes: Remote[] };
const remote = manifest.remotes.find((candidate) => candidate.name === name);
if (!remote) throw new Error(`write-remote-preview-scope: unknown remote "${name}"`);
if (remote.repo !== repo) {
  throw new Error(`write-remote-preview-scope: repository "${repo}" is not registered for remote "${name}"`);
}

const scope = {
  locale: "en",
  reference: false,
  remotePreview: {
    name: remote.name,
    repository: remote.repo,
    ref,
  },
};
fs.writeFileSync(path.join(root, ".preview-scope.json"), `${JSON.stringify(scope, null, 2)}\n`);
console.log(`write-remote-preview-scope: ${remote.name} <- ${remote.repo}@${ref}`);
