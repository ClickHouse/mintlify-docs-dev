/**
 * Build the site on Vercel without exposing GitHub credentials to remote MDX.
 *
 * `fetch-remotes.ts` exchanges the deployment's OIDC identity for a short-lived,
 * repository-scoped token through Vercel Connect. It is the only child process
 * allowed to see that identity. Preparation, Astro compilation, and
 * post-processing run after every credential has been removed.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { readScope, type Locale } from "../src/lib/scope.ts";
import { localeRouteName } from "../src/util/locales.ts";

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

function shardEnvironment(
  environment: NodeJS.ProcessEnv,
  locale: "en" | Locale,
  availableLocales: Locale[],
  outDir: string,
  options: {
    emitEnglish: boolean;
    loadEnglish: boolean;
    emitLocaleFallbacks: boolean;
    includePublic: boolean;
  },
): NodeJS.ProcessEnv {
  const child = { ...environment };
  delete child.DOCS_LOCALES;
  child.DOCS_BUILD_SHARD = "1";
  child.DOCS_LOCALE = locale;
  child.DOCS_AVAILABLE_LOCALES = availableLocales.join(",") || "none";
  child.DOCS_EMIT_ENGLISH = options.emitEnglish ? "true" : "false";
  child.DOCS_LOAD_ENGLISH = options.loadEnglish ? "true" : "false";
  child.DOCS_EMIT_LOCALE_FALLBACKS = options.emitLocaleFallbacks ? "true" : "false";
  child.DOCS_OUT_DIR = outDir;
  child.DOCS_CACHE_DIR = path.join(
    root,
    "node_modules",
    ".astro",
    child.DOCS_DEPLOY_TARGET ?? "combined",
    locale.toLowerCase(),
  );
  if (options.includePublic) delete child.DOCS_SKIP_PUBLIC;
  else child.DOCS_SKIP_PUBLIC = "1";
  return child;
}

function copyDirectory(source: string, destination: string, merge = false): void {
  if (!fs.existsSync(source)) {
    throw new Error(`vercel-build: expected shard output ${path.relative(root, source)} does not exist`);
  }
  if (!merge && fs.existsSync(destination)) {
    throw new Error(`vercel-build: refusing to overwrite merged output ${path.relative(root, destination)}`);
  }
  fs.cpSync(source, destination, { recursive: true, force: merge, errorOnExist: !merge });
}

function copyLocaleOutput(locale: Locale, outDir: string, finalOutDir: string): void {
  const routeName = localeRouteName(locale);
  copyDirectory(path.join(outDir, routeName), path.join(finalOutDir, routeName), true);
  copyDirectory(
    path.join(outDir, `_astro-${locale.toLowerCase()}`),
    path.join(finalOutDir, `_astro-${locale.toLowerCase()}`),
  );
  const localeNavigation = path.join(outDir, "nav", routeName);
  if (fs.existsSync(localeNavigation)) {
    copyDirectory(localeNavigation, path.join(finalOutDir, "nav", routeName), true);
  }
}

// The fetch child is the only process allowed to see the deployment OIDC
// identity. It downloads bytes but never parses or imports remote-authored MDX.
run(process.execPath, ["bin/fetch-remotes.ts"], { ...process.env });

// Cross the credential boundary before any generator, Vite plugin, or Astro
// integration can parse or execute remote-authored content.
const cleanEnvironment = sanitizedEnvironment();
assertCredentialFree(cleanEnvironment);

run("pnpm", ["run", "prepare:site"], cleanEnvironment);

const scope = readScope(root);
const finalOutDir = path.resolve(root, cleanEnvironment.DOCS_OUT_DIR ?? "dist");
if (scope.deployTarget === "english" || (scope.deployTarget === "combined" && scope.locales.length === 0)) {
  const environment = shardEnvironment(
    cleanEnvironment,
    "en",
    scope.availableLocales,
    finalOutDir,
    {
      emitEnglish: true,
      loadEnglish: true,
      emitLocaleFallbacks: scope.deployTarget === "combined" && scope.availableLocales.length > 0,
      includePublic: true,
    },
  );
  run("pnpm", ["exec", "astro", "build"], environment);
  run(process.execPath, ["bin/postbuild.ts"], environment);
  process.exit(0);
}

// Each locale gets its own process, module graph, content collection, output,
// and persistent Astro cache. Peak memory is bounded by one locale build while
// the final deployment remains a single Vercel artifact.
const shardsRoot = path.join(root, ".vercel-build", "shards");
fs.rmSync(shardsRoot, { recursive: true, force: true });
fs.mkdirSync(shardsRoot, { recursive: true });
fs.mkdirSync(path.join(root, ".remote", "public-empty"), { recursive: true });

let englishOutDir: string | undefined;
if (scope.deployTarget === "combined") {
  englishOutDir = path.join(shardsRoot, "en");
  run(
    "pnpm",
    ["exec", "astro", "build"],
    shardEnvironment(cleanEnvironment, "en", scope.locales, englishOutDir, {
      emitEnglish: true,
      loadEnglish: true,
      emitLocaleFallbacks: true,
      includePublic: true,
    }),
  );
}

const localeOutputs: Array<{ locale: Locale; outDir: string }> = [];
for (const locale of scope.locales) {
  const outDir = path.join(shardsRoot, locale.toLowerCase());
  run(
    "pnpm",
    ["exec", "astro", "build"],
    shardEnvironment(cleanEnvironment, locale, scope.locales, outDir, {
      emitEnglish: false,
      loadEnglish: scope.deployTarget === "translations",
      emitLocaleFallbacks: scope.deployTarget === "translations",
      includePublic: false,
    }),
  );
  localeOutputs.push({ locale, outDir });
}

fs.rmSync(finalOutDir, { recursive: true, force: true });
if (englishOutDir) copyDirectory(englishOutDir, finalOutDir);
else fs.mkdirSync(finalOutDir, { recursive: true });
for (const { locale, outDir } of localeOutputs) {
  copyLocaleOutput(locale, outDir, finalOutDir);
}

const postbuildEnvironment = { ...cleanEnvironment, DOCS_OUT_DIR: finalOutDir };
run(process.execPath, ["bin/postbuild.ts"], postbuildEnvironment);
fs.rmSync(shardsRoot, { recursive: true, force: true });
