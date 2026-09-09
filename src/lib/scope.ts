/**
 * Build scope for Vercel's combined site and independently deployed locale
 * Workers.
 *
 * `DOCS_LOCALES` keeps English active and adds zero, one, several, or every
 * translated collection to the same Vercel artifact. Vercel production always
 * builds every translation, even when the variable is omitted. `DOCS_LOCALE`
 * retains the singular build contract used by locale Workers.
 *
 *   {
 *     "locale": "en",
 *     "reference": false,
 *     "remotePreview": {
 *       "name": "clickhouse-private",
 *       "repository": "ClickHouse/airgap-docs",
 *       "sourceRepository": "contributor/airgap-docs",
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
  /** Registered upstream repository from remotes.json. */
  repository: string;
  /** Repository that owns the immutable preview SHA; differs for fork PRs. */
  sourceRepository: string;
  ref: string;
}

export interface BuildScope {
  /** Primary locale; non-English only for a singular locale Worker build. */
  locale: BuildLocale;
  /** Non-English collections included in this artifact. */
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

function parseLocales(value: unknown, source: string): Locale[] {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${source} must be none, all, or a comma-separated locale list`);
  }

  const requested = value.trim().toLowerCase();
  if (requested === "none" || requested === "en") return [];
  if (requested === "all") return [...ALL_LOCALES];

  const selected = new Set<Locale>();
  for (const entry of value.split(",")) {
    const normalized = entry.trim().toLowerCase();
    const locale = ALL_LOCALES.find((candidate) => candidate.toLowerCase() === normalized);
    if (!locale) {
      throw new Error(`${source} must contain only: ${ALL_LOCALES.join(", ")}`);
    }
    selected.add(locale);
  }
  return ALL_LOCALES.filter((locale) => selected.has(locale));
}

function parseRemotePreview(value: unknown, source: string): RemotePreview | undefined {
  if (value === undefined) return undefined;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${source} must contain name, repository and ref`);
  }
  const candidate = value as Record<string, unknown>;
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  const repository = typeof candidate.repository === "string" ? candidate.repository.trim() : "";
  const sourceRepository = typeof candidate.sourceRepository === "string"
    ? candidate.sourceRepository.trim()
    : repository;
  const ref = typeof candidate.ref === "string" ? candidate.ref.trim().toLowerCase() : "";
  if (!name || !repository || !sourceRepository || !ref) {
    throw new Error(`${source} must contain non-empty name, repository and ref values`);
  }
  const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
  if (!repositoryPattern.test(repository) || !repositoryPattern.test(sourceRepository)) {
    throw new Error(`${source} repositories must use the owner/name form`);
  }
  if (!/^[0-9a-f]{40}$/.test(ref)) {
    throw new Error(`${source}.ref must be an immutable 40-character commit SHA`);
  }
  return { name, repository, sourceRepository, ref };
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
  const envLocales = (process.env.DOCS_LOCALES ?? "").trim();
  const envReference = (process.env.DOCS_REFERENCE ?? "").trim().toLowerCase();
  const envRemoteName = (process.env.DOCS_REMOTE_NAME ?? "").trim();
  const envRemoteRepository = (process.env.DOCS_REMOTE_REPOSITORY ?? "").trim();
  const envRemoteSourceRepository = (process.env.DOCS_REMOTE_SOURCE_REPOSITORY ?? "").trim();
  const envRemoteRef = (process.env.DOCS_REMOTE_REF ?? "").trim();
  const file = path.join(root, ".preview-scope.json");
  const fileScope = fs.existsSync(file)
    ? (JSON.parse(fs.readFileSync(file, "utf8")) as ScopeFile)
    : null;

  if (envLocale && envLocales) {
    throw new Error("DOCS_LOCALE and DOCS_LOCALES are mutually exclusive");
  }

  const remoteEnvironmentValues = [envRemoteName, envRemoteRepository, envRemoteRef];
  const hasRemoteEnvironment = remoteEnvironmentValues.some(Boolean);
  if (hasRemoteEnvironment && !remoteEnvironmentValues.every(Boolean)) {
    throw new Error(
      "DOCS_REMOTE_NAME, DOCS_REMOTE_REPOSITORY and DOCS_REMOTE_REF must be set together",
    );
  }
  if (envRemoteSourceRepository && !hasRemoteEnvironment) {
    throw new Error(
      "DOCS_REMOTE_SOURCE_REPOSITORY requires DOCS_REMOTE_NAME, DOCS_REMOTE_REPOSITORY and DOCS_REMOTE_REF",
    );
  }

  let source: BuildScope["source"] = fileScope ? "file" : "default";
  const vercelTarget = (process.env.VERCEL_TARGET_ENV ?? process.env.VERCEL_ENV ?? "")
    .trim()
    .toLowerCase();
  const isVercelProduction = process.env.VERCEL === "1" && vercelTarget === "production";

  const locale = envLocales
    ? "en"
    : envLocale
      ? parseLocale(envLocale, "DOCS_LOCALE")
      : fileScope?.locale !== undefined
        ? parseLocale(fileScope.locale, ".preview-scope.json locale")
        : "en";
  let locales: Locale[] = envLocales
    ? parseLocales(envLocales, "DOCS_LOCALES")
    : locale === "en"
      ? []
      : [locale];

  if (isVercelProduction) {
    if (locale !== "en") {
      throw new Error("Vercel production builds use DOCS_LOCALES=all, not DOCS_LOCALE");
    }
    if (envLocales && locales.length !== ALL_LOCALES.length) {
      throw new Error("Vercel production builds must include every translation with DOCS_LOCALES=all");
    }
    locales = [...ALL_LOCALES];
  }
  const reference = envReference
    ? parseReference(envReference, "DOCS_REFERENCE")
    : fileScope?.reference !== undefined
      ? parseReference(fileScope.reference, ".preview-scope.json reference")
      : true;
  const remotePreview = hasRemoteEnvironment
    ? parseRemotePreview(
        {
          name: envRemoteName,
          repository: envRemoteRepository,
          sourceRepository: envRemoteSourceRepository || envRemoteRepository,
          ref: envRemoteRef,
        },
        "remote preview environment",
      )
    : parseRemotePreview(fileScope?.remotePreview, ".preview-scope.json remotePreview");

  if (remotePreview && (locale !== "en" || locales.length > 0)) {
    throw new Error("Remote pull-request previews are English-only; omit DOCS_LOCALES");
  }
  if (envLocale || envLocales || envReference || hasRemoteEnvironment) source = "env";
  return {
    locale,
    locales,
    reference,
    remotePreview,
    source,
  };
}
