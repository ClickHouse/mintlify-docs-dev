/** Fail closed before a repository dispatch can influence a docs deployment. */
import fs from "node:fs";
import path from "node:path";
import { ALL_LOCALES } from "../src/lib/scope.ts";

interface Remote {
  name: string;
  repo: string;
}

const root = process.cwd();
const locale = (process.env.DOCS_LOCALE ?? "").trim();
const name = (process.env.DOCS_REMOTE_NAME ?? "").trim();
const repository = (process.env.DOCS_REMOTE_REPOSITORY ?? "").trim();
const ref = (process.env.DOCS_REMOTE_REF ?? "").trim().toLowerCase();
const previewAlias = (process.env.DOCS_PREVIEW_ALIAS ?? "").trim().toLowerCase();
const validLocales = new Set(["en", ...ALL_LOCALES.map((candidate) => candidate.toLowerCase())]);

if (!validLocales.has(locale.toLowerCase())) {
  throw new Error(`validate-deploy-request: DOCS_LOCALE must be one of: en, ${ALL_LOCALES.join(", ")}`);
}
if (Boolean(ref) !== Boolean(previewAlias)) {
  throw new Error("validate-deploy-request: DOCS_REMOTE_REF and DOCS_PREVIEW_ALIAS must be set together");
}
if (ref && locale.toLowerCase() !== "en") {
  throw new Error("validate-deploy-request: remote pull-request previews are English-only");
}
if (ref && !/^[0-9a-f]{40}$/.test(ref)) {
  throw new Error("validate-deploy-request: DOCS_REMOTE_REF must be an immutable 40-character commit SHA");
}
if (previewAlias && !/^[a-z](?:[a-z0-9-]*[a-z0-9])?$/.test(previewAlias)) {
  throw new Error("validate-deploy-request: DOCS_PREVIEW_ALIAS must begin with a letter and contain lowercase letters, digits and hyphens");
}

const remoteValues = [name, repository];
if (remoteValues.some(Boolean) && !remoteValues.every(Boolean)) {
  throw new Error("validate-deploy-request: DOCS_REMOTE_NAME and DOCS_REMOTE_REPOSITORY must be set together");
}
if (ref && !remoteValues.every(Boolean)) {
  throw new Error("validate-deploy-request: a remote preview requires its registered name and repository");
}

if (name) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "remotes.json"), "utf8")) as { remotes: Remote[] };
  const remote = manifest.remotes.find((candidate) => candidate.name === name);
  if (!remote) throw new Error(`validate-deploy-request: unknown remote "${name}"`);
  if (remote.repo !== repository) {
    throw new Error(`validate-deploy-request: repository "${repository}" is not registered for remote "${name}"`);
  }
}

console.log(`validate-deploy-request: ${previewAlias ? `preview ${previewAlias}` : "production"} locale=${locale}`);
