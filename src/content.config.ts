import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineDocSchema } from "@cloudflare/nimbus-docs/schemas";
import { withNimbusMarkdown } from "@cloudflare/nimbus-docs/content";
import { readScope } from "./lib/scope";
import { staleSiblingPages } from "./lib/stale-siblings";
import fs from "node:fs";

/** Top-level English content directories (the Mintlify tabs' sources). */
export const SECTIONS = [
  "get-started",
  "concepts",
  "guides",
  "reference",
  "products",
  "clickstack",
  "integrations",
  "resources",
  "chdb",
];

/**
 * DOCS_INCLUDE=comma,separated,globs restricts the primary collection to a
 * slice of the tree (P0 spike, scoped previews).
 */
function splitPatterns(value: string): string[] {
  const patterns: string[] = [];
  let current = "";
  let braceDepth = 0;

  for (const character of value) {
    if (character === "{") braceDepth++;
    if (character === "}") braceDepth = Math.max(0, braceDepth - 1);

    if (character === "," && braceDepth === 0) {
      const pattern = current.trim();
      if (pattern) patterns.push(pattern);
      current = "";
      continue;
    }

    current += character;
  }

  const pattern = current.trim();
  if (pattern) patterns.push(pattern);
  return patterns;
}

const scope = readScope();
const include = splitPatterns(process.env.DOCS_INCLUDE ?? "");
const remoteManifest = JSON.parse(fs.readFileSync("./remotes.json", "utf8")) as {
  remotes: Array<{ name: string; mount: string }>;
};
const previewRemote = scope.remotePreview
  ? remoteManifest.remotes.find((remote) => remote.name === scope.remotePreview?.name)
  : undefined;
if (scope.remotePreview && !previewRemote) {
  throw new Error(`Unknown remote preview source "${scope.remotePreview.name}"`);
}

// Preview builds omit the reference section (`reference: false` in the scope):
// no clickhouse binary is needed and the build is a fraction of the size.
const scopedSections = SECTIONS.filter((s) => scope.reference || s !== "reference");
const docsPattern = previewRemote
  ? [`${previewRemote.mount}/**/*.{md,mdx}`]
  : include.length
    ? include
    : [`{${scopedSections.join(",")}}/**/*.{md,mdx}`];
// The homepage (`index.mdx`, `mode: custom`, inline React with hooks) is not
// part of the collection: it is rebuilt natively as src/pages/index.astro.

/**
 * URL id = file path without extension, exactly as Mintlify does it. The
 * `slug` frontmatter key is stale Docusaurus data and is deliberately ignored
 * (Astro's default generateId would otherwise turn it into the URL).
 */
export function pathId({ entry }: { entry: string }): string {
  // Mintlify serves `folder/index.mdx` at both `/folder` and `/folder/index`;
  // its sitemap canonical is `/folder`, so that is the page id here and
  // `/folder/index` becomes a redirect (bin/gen-redirects.ts). The root
  // `index.mdx` keeps the id `index`, which Nimbus expects.
  const id = entry.replace(/\.(mdx?|md)$/i, "");
  return id === "index" ? id : id.replace(/\/index$/, "");
}

/** Frontmatter keys the current content uses that Nimbus's base schema lacks. */
const clickhouseFields = {
  // A few pages (the homepage, some landing pages) have no `title`; Nimbus
  // requires one. Made optional here; the route falls back to sidebarTitle/id.
  title: z.string().optional(),
  sidebarTitle: z.string().optional(),
  doc_type: z.string().optional(),
  keywords: z.union([z.string(), z.array(z.string())]).optional(),
  toc_max_heading_level: z.number().optional(),
  // Mintlify supports `wide`; Nimbus only `doc` | `custom`. Handled in the route.
  // Lenient: a few pages carry stray values.
  mode: z.any().optional().transform((v) => (v === "custom" || v === "wide" ? v : "doc")),
  // Docusaurus leftovers that Mintlify ignores but Nimbus would act on:
  // `sidebar: sqlreference` / `sidebar: false` (Nimbus: object | false) and
  // `draft: true` (Nimbus drops the page). Neutralised for URL parity.
  sidebar: z.any().optional().transform((v) => (v && typeof v === "object" ? v : undefined)),
  draft: z.any().optional().transform(() => false),
  slug: z.string().optional(),
  tag: z.string().optional(),
  openapi: z.string().optional(),
  integration: z.any().optional(),
  tags: z.any().optional(),
  date: z.any().optional(),
  show_related_blogs: z.any().optional(),
  rss: z.any().optional(),
  icon: z.string().optional(),
  audience: z.any().optional(),
};

const schema = defineDocSchema({ fields: clickhouseFields, strictFrontmatter: false });

const changelogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  products: z.array(z.string()).min(1),
  channel: z.string().optional(),
  hidden: z.boolean().default(false),
});

/** All translated trees; each is its own collection mounted at /<locale>. */
export const LOCALES = ["ar", "es", "fr", "ja", "ko", "pt-BR", "ru", "zh"] as const;
export type LocaleCollectionName = "ar" | "es" | "fr" | "ja" | "ko" | "pt-br" | "ru" | "zh";

/**
 * Locales come from the build scope (`DOCS_LOCALES` for a combined Vercel
 * artifact, `DOCS_LOCALE` for one locale shard, or `.preview-scope.json` for
 * remote previews; see src/lib/scope.ts). Collection names deliberately avoid
 * the `docs-<x>` prefix, which Nimbus reserves for versions.
 */
export const ACTIVE_LOCALES: string[] = [...scope.locales];
/** Locales present in the final merged artifact and exposed by language links. */
export const AVAILABLE_LOCALES: string[] = [...scope.availableLocales];
/** English routes are emitted only by the English build shard. */
export const EMIT_ENGLISH = scope.emitEnglish;
/** English content may also be loaded solely to emit untranslated locale fallbacks. */
export const LOAD_ENGLISH = scope.loadEnglish;
/** Missing translations are emitted by the artifact which owns locale routes. */
export const EMIT_LOCALE_FALLBACKS = scope.emitLocaleFallbacks;

/**
 * Collection names are lowercase even when the canonical URL segment is not.
 * In particular, the `pt-BR` directory uses the `pt-br` collection while its
 * route remains `/pt-BR/`, matching the deployed Mintlify documentation.
 */
export const localeCollectionName = (locale: string): LocaleCollectionName =>
  locale.toLowerCase() as LocaleCollectionName;

/** Patterns for one tree: the section globs minus stale `X.mdx` siblings of `X/index.mdx`. */
function treePattern(baseDir: string): string[] {
  return [...docsPattern, ...staleSiblingPages(baseDir, scopedSections).map((p) => `!${p}`)];
}

function localeCollection(locale: (typeof LOCALES)[number]) {
  const active = ACTIVE_LOCALES.includes(locale);
  return defineCollection({
    loader: withNimbusMarkdown(glob({
      base: `./${locale}`,
      pattern: active ? treePattern(`./${locale}`) : "__inactive_locale__/**/*.{md,mdx}",
      generateId: pathId,
    })),
    schema,
  });
}

const partialSchema = z.object({
  params: z.array(z.string()).optional(),
}).passthrough();

export const collections = {
  docs: defineCollection({
    loader: withNimbusMarkdown(glob({
      base: ".",
      pattern: LOAD_ENGLISH ? treePattern(".") : "__inactive_english__/**/*.{md,mdx}",
      generateId: pathId,
    })),
    // Non-strict: the content carries Docusaurus-era keys we do not model.
    schema,
  }),
  changelog: defineCollection({
    loader: withNimbusMarkdown(glob({
      base: ".remote/changelog",
      pattern: !EMIT_ENGLISH || scope.remotePreview ? "__inactive_changelog__/**/*.mdx" : "**/*.mdx",
      generateId: pathId,
    })),
    schema: changelogSchema,
  }),
  partials: defineCollection({
    loader: withNimbusMarkdown(glob({
      base: "./src/content/partials",
      pattern: "**/*.{md,mdx}",
      generateId: pathId,
    })),
    schema: partialSchema,
  }),
  ar: localeCollection("ar"),
  es: localeCollection("es"),
  fr: localeCollection("fr"),
  ja: localeCollection("ja"),
  ko: localeCollection("ko"),
  "pt-br": localeCollection("pt-BR"),
  ru: localeCollection("ru"),
  zh: localeCollection("zh"),
};
