/**
 * Build the site on Vercel without exposing GitHub credentials to remote MDX.
 *
 * The approved workflow in the calling repository mints a short-lived
 * ClickHouse GitHub App installation token and passes it to this deployment as
 * `DOCS_REMOTE_TOKEN`. Only `fetch-remotes.ts` receives the token; preparation,
 * Astro compilation, and post-processing run with it removed.
 */
import { execFileSync } from "node:child_process";

const root = process.cwd();
let remoteToken = (process.env.DOCS_REMOTE_TOKEN ?? "").trim();
if (!remoteToken) {
  throw new Error(
    "vercel-build: DOCS_REMOTE_TOKEN must be supplied by the approved calling-repository workflow",
  );
}

function sanitizedEnvironment(): NodeJS.ProcessEnv {
  const environment = { ...process.env };
  for (const name of ["DOCS_REMOTE_TOKEN", "GH_TOKEN", "GITHUB_TOKEN"]) {
    delete environment[name];
    delete process.env[name];
  }
  return environment;
}

function run(command: string, args: string[], environment: NodeJS.ProcessEnv): void {
  execFileSync(command, args, { cwd: root, env: environment, stdio: "inherit" });
}

// Remove the token from this process before starting any child that can parse
// or compile remote-authored content. The fetch child receives the only copy.
const cleanEnvironment = sanitizedEnvironment();
const fetchEnvironment: NodeJS.ProcessEnv = { ...cleanEnvironment, GH_TOKEN: remoteToken };

run(process.execPath, ["bin/fetch-remotes.ts"], fetchEnvironment);
delete fetchEnvironment.GH_TOKEN;
remoteToken = "";

run("pnpm", ["run", "prepare:site"], cleanEnvironment);
run("pnpm", ["exec", "astro", "build"], cleanEnvironment);
run(process.execPath, ["bin/postbuild.ts"], cleanEnvironment);
