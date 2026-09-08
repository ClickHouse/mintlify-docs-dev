/**
 * Build the site on Vercel without exposing GitHub credentials to remote MDX.
 *
 * `fetch-remotes.ts` exchanges the deployment's OIDC identity for a short-lived,
 * repository-scoped token through Vercel Connect. It is the only child process
 * allowed to see that identity. Preparation, Astro compilation, and
 * post-processing run after every credential has been removed.
 */
import { execFileSync } from "node:child_process";

const root = process.cwd();
const credentialVariables = [
  "DOCS_REMOTE_TOKEN",
  "GH_TOKEN",
  "GITHUB_TOKEN",
  "VERCEL_OIDC_TOKEN",
] as const;

const forwardedGitHubCredentials = ["DOCS_REMOTE_TOKEN", "GH_TOKEN", "GITHUB_TOKEN"]
  .filter((name) => (process.env[name] ?? "").trim());
if (process.env.VERCEL === "1" && forwardedGitHubCredentials.length) {
  throw new Error(
    `vercel-build: ${forwardedGitHubCredentials.join(", ")} must not be passed to Vercel; configure Vercel Connect instead`,
  );
}

function sanitizedEnvironment(): NodeJS.ProcessEnv {
  const environment = { ...process.env };
  for (const name of credentialVariables) {
    delete environment[name];
    delete process.env[name];
  }
  return environment;
}

function assertCredentialFree(environment: NodeJS.ProcessEnv): void {
  const exposed = credentialVariables.filter((name) => environment[name] || process.env[name]);
  if (exposed.length) {
    throw new Error(`vercel-build: credential boundary failed for ${exposed.join(", ")}`);
  }
}

function run(command: string, args: string[], environment: NodeJS.ProcessEnv): void {
  execFileSync(command, args, { cwd: root, env: environment, stdio: "inherit" });
}

// The fetch child is the only process allowed to see the deployment OIDC
// identity. It downloads bytes but never parses or imports remote-authored MDX.
run(process.execPath, ["bin/fetch-remotes.ts"], { ...process.env });

// Cross the credential boundary before any generator, Vite plugin, or Astro
// integration can parse or execute remote-authored content.
const cleanEnvironment = sanitizedEnvironment();
assertCredentialFree(cleanEnvironment);

run("pnpm", ["run", "prepare:site"], cleanEnvironment);
run("pnpm", ["exec", "astro", "build"], cleanEnvironment);
run(process.execPath, ["bin/postbuild.ts"], cleanEnvironment);
