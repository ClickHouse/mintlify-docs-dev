/**
 * Build scope for one independently deployed locale.
 *
 * Production builds select only `DOCS_LOCALE`; every registered remote is
 * fetched from its `main` branch. A remote pull-request preview additionally
 * supplies one registered source and its immutable head SHA. CI may materialise
 * the same values in `.preview-scope.json` between its credentialed fetch job
 * and its unprivileged build job.
 *
 *   {
 *     "locale": "en",
 *     "reference": false,
 *     "remotePreview": {
 *       "name": "clickhouse-private",
 *       "repository": "ClickHouse/airgapped-docs",
 *       "ref": "<40-character commit SHA>"
 *     }
 *   }
 */
import fs from "node:fs";
import path from "node:path";

export const ALL_LOCALES = ["ar", "es", "fr", "ja", "ko", "pt-BR", "ru", "zh"] as const;
export type Locale = (typeof ALL_LOCALES)[number];
export type BuildLocale = "en" | Locale;

export interface RemotePreview {
  name: string;
  repository: string;
  ref: string;
}

export interface BuildScope {
  /** The locale Worker produced by this build. */
  locale: BuildLocale;
  /** Non-English collection to build; retained for the Astro route generators. */
  locales: Locale[];
  /** Whether `reference/**` is part of the build. */
  reference: boolean;
  /** Build only this registered remote at an immutable preview revision. */
  remotePreview?: RemotePreview;
  source: "env" | "file" | "default";
}

interface ScopeFile {
  locale?: unknown;
  reference?: unknown;
  remotePreview?: unknown;
}

function parseLocale(value: unknown, source: string): BuildLocale {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${source} must name exactly one locale`);
  }
  const requested = value.trim().toLowerCase();
  if (requested === "en") return "en";
  const locale = ALL_LOCALES.find((candidate) => candidate.toLowerCase() === requested);
  if (!locale) {
    throw new Error(`${source} must be one of: en, ${ALL_LOCALES.join(", ")}`);
  }
  return locale;
}

function parseRemotePreview(value: unknown, source: string): RemotePreview | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${source} must contain name, repository and ref`);
  }
  const candidate = value as Record<string, unknown>;
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  const repository = typeof candidate.repository === "string" ? candidate.repository.trim() : "";
  const ref = typeof candidate.ref === "string" ? candidate.ref.trim().toLowerCase() : "";
  if (!name || !repository || !ref) {
    throw new Error(`${source} must contain non-empty name, repository and ref values`);
  }
  if (!/^[0-9a-f]{40}$/.test(ref)) {
    throw new Error(`${source}.ref must be an immutable 40-character commit SHA`);
  }
  return { name, repository, ref };
}

function parseReference(value: unknown, source: string): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") {
    throw new Error(`${source} must be on, off, true or false`);
  }
  switch (value.trim().toLowerCase()) {
    case "on":
    case "true":
      return true;
    case "off":
    case "false":
      return false;
    default:
      throw new Error(`${source} must be on, off, true or false`);
  }
}

export function readScope(root = process.cwd()): BuildScope {
  const envLocale = (process.env.DOCS_LOCALE ?? "").trim();
  const envReference = (process.env.DOCS_REFERENCE ?? "").trim().toLowerCase();
  const envRemoteName = (process.env.DOCS_REMOTE_NAME ?? "").trim();
  const envRemoteRepository = (process.env.DOCS_REMOTE_REPOSITORY ?? "").trim();
  const envRemoteRef = (process.env.DOCS_REMOTE_REF ?? "").trim();
  const file = path.join(root, ".preview-scope.json");
  const fileScope = fs.existsSync(file)
    ? (JSON.parse(fs.readFileSync(file, "utf8")) as ScopeFile)
    : null;

  const remoteEnvironmentValues = [envRemoteName, envRemoteRepository, envRemoteRef];
  const hasRemoteEnvironment = remoteEnvironmentValues.some(Boolean);
  if (hasRemoteEnvironment && !remoteEnvironmentValues.every(Boolean)) {
    throw new Error(
      "DOCS_REMOTE_NAME, DOCS_REMOTE_REPOSITORY and DOCS_REMOTE_REF must be set together",
    );
  }

  let source: BuildScope["source"] = fileScope ? "file" : "default";
  const locale = envLocale
    ? parseLocale(envLocale, "DOCS_LOCALE")
    : fileScope?.locale !== undefined
      ? parseLocale(fileScope.locale, ".preview-scope.json locale")
      : "en";
  const locales: Locale[] = locale === "en" ? [] : [locale];
  const reference = envReference
    ? parseReference(envReference, "DOCS_REFERENCE")
    : fileScope?.reference !== undefined
      ? parseReference(fileScope.reference, ".preview-scope.json reference")
      : true;
  const remotePreview = hasRemoteEnvironment
    ? parseRemotePreview(
        { name: envRemoteName, repository: envRemoteRepository, ref: envRemoteRef },
        "remote preview environment",
      )
    : parseRemotePreview(fileScope?.remotePreview, ".preview-scope.json remotePreview");

  if (remotePreview && locale !== "en") {
    throw new Error("Remote pull-request previews are English-only; set DOCS_LOCALE=en");
  }
  if (envLocale || envReference || hasRemoteEnvironment) source = "env";
  return {
    locale,
    locales,
    reference,
    remotePreview,
    source,
  };
}
