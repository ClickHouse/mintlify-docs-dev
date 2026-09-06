/** Deploy the current build to the Worker belonging to its single locale. */
import path from "node:path";
import { execFileSync } from "node:child_process";
import { readScope } from "../src/lib/scope.ts";

const root = process.cwd();
const action = process.argv[2];
// Package managers may preserve their standalone `--` argument when forwarding
// flags to a script. Wrangler must receive only the actual flags.
const extraArguments = process.argv.slice(3).filter((argument) => argument !== "--");
if (action !== "deploy" && action !== "preview") {
  throw new Error("wrangler-locale: expected deploy or preview");
}

const scope = readScope(root);
const workerName = `clickhouse-docs-${scope.locale.toLowerCase()}`;
const wrangler = path.join(root, "node_modules", ".bin", process.platform === "win32" ? "wrangler.cmd" : "wrangler");
const argumentsForWrangler = action === "deploy"
  ? ["deploy", "--name", workerName]
  : ["versions", "upload", "--name", workerName];

if (action === "preview") {
  const previewAlias = (process.env.DOCS_PREVIEW_ALIAS ?? "").trim().toLowerCase();
  if (!previewAlias || !/^[a-z](?:[a-z0-9-]*[a-z0-9])?$/.test(previewAlias)) {
    throw new Error("wrangler-locale: DOCS_PREVIEW_ALIAS must begin with a letter and contain lowercase letters, digits and hyphens");
  }
  if (`${previewAlias}-${workerName}`.length > 63) {
    throw new Error("wrangler-locale: preview alias and Worker name must be at most 63 characters combined");
  }
  argumentsForWrangler.push("--preview-alias", previewAlias);
}

console.log(`wrangler-locale: ${action} ${workerName}`);
execFileSync(wrangler, [...argumentsForWrangler, ...extraArguments], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});
