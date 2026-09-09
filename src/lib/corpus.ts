/**
 * Chunked agent corpora. A single `llms-full.txt` for the whole site exceeds
 * the 25 MiB Workers asset limit (26.3 MB for English alone), so the corpus is
 * emitted per top-level section (and per locale), and the root file is an index.
 */
import { renderEntryAsMarkdown } from "@cloudflare/nimbus-docs";
import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content";
import fs from "node:fs";
import path from "node:path";
import { config } from "virtual:nimbus/config";
import { prepareAgentMarkdown } from "./agent-links";
import { withBase } from "./base";

export const PRIMARY = "docs";
/** Leave one MiB of headroom below Cloudflare's 25 MiB static-asset limit. */
export const CORPUS_MAX_BYTES = 24 * 1024 * 1024;

/** What the agent surfaces need per page (a subset of Nimbus's IndexedEntry). */
export interface IndexedEntry {
  entry: CollectionEntry<CollectionKey>;
  collection: string;
  title: string;
  description: string | undefined;
  /** Site-relative page URL without base, trailing slash. */
  url: string;
}

export function sectionOf(entry: IndexedEntry): string {
  if (entry.collection === "changelog") return "changelog";
  return entry.entry.id.split("/")[0] ?? "";
}

/** English documentation plus the separately generated changelog collection. */
export async function englishCorpusEntries(): Promise<IndexedEntry[]> {
  const [docs, changelog] = await Promise.all([entriesFor(PRIMARY), entriesFor("changelog")]);
  return [...docs, ...changelog];
}

/**
 * Pages of one collection. Read straight from Astro: Nimbus's own index only
 * covers collections declared statically in content.config.ts, and the locale
 * collections are generated from the build scope.
 */
export async function entriesFor(collection: string): Promise<IndexedEntry[]> {
  const entries = (await getCollection(collection as CollectionKey)) as CollectionEntry<CollectionKey>[];
  const prefix = collection === PRIMARY ? "" : `/${collection}`;
  return entries
    .filter((e) => e.id !== "index" && !(e.data as { draft?: boolean }).draft)
    .map((e) => {
      const d = e.data as { title?: string; sidebarTitle?: string; description?: string };
      return {
        entry: e,
        collection,
        title: d.title ?? d.sidebarTitle ?? e.id.split("/").pop() ?? e.id,
        description: d.description || undefined,
        url: `${prefix}/${e.id}/`,
      };
    });
}

export function sectionsOf(entries: IndexedEntry[]): string[] {
  return [...new Set(entries.map(sectionOf))].sort();
}

/** Nimbus's markdown rendering, minus the ESM imports and MDX comments of the source. */
function expandAgentSnippetImports(body: string): string {
  const imports = new Map<string, string>();
  for (const match of body.matchAll(/^import\s+([A-Z][A-Za-z0-9_]*)\s+from\s+["'](\/[^"']+\.mdx)["'];?\s*$/gm)) {
    imports.set(match[1], match[2]);
  }

  return body.replace(/<Visibility\b([^>]*)\bfor=["']agents["']([^>]*)>([\s\S]*?)<\/Visibility>/g, (_block, before, after, children) => {
    let expanded = children as string;
    for (const [name, source] of imports) {
      const component = new RegExp(`<${name}\\s*\\/>`, "g");
      if (!component.test(expanded)) continue;
      const file = path.join(process.cwd(), source.slice(1));
      const snippet = fs.readFileSync(file, "utf8").replace(/^---\n[\s\S]*?\n---\n?/, "");
      expanded = expanded.replace(component, snippet);
    }
    return `<Visibility${before} for="agents"${after}>${expanded}</Visibility>`;
  });
}

/** Markdown twins expose agent-only content and exclude web-only content. */
export function cleanMarkdown(entry: IndexedEntry["entry"]): string {
  const body = expandAgentSnippetImports(entry.body ?? "");
  return renderEntryAsMarkdown(
    { body },
    {
      componentMap: {
        Visibility: ({ attrs, children }) => attrs.for === "agents" ? children : "",
        View: ({ attrs, children }) => typeof attrs.title === "string" ? `**${attrs.title}**\n\n${children}` : children,
      },
    },
  )
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .split("\n")
    .filter((line) => !/^import\s.+\sfrom\s+["'][^"']+["'];?\s*$/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

/** One `#`-block per page, sorted by URL; deterministic across rebuilds. */
export function renderCorpus(entries: IndexedEntry[], title: string, indexPath: string): string {
  const sorted = [...entries].sort((a, b) => a.url.localeCompare(b.url));
  const blocks = sorted.map((i) => {
    const url = new URL(withBase(i.url), config.site).href;
    const markdown = prepareAgentMarkdown(cleanMarkdown(i.entry), withBase(i.url));
    return `# ${i.title}\n\nSource: ${url}\n\n${markdown}\n`;
  });
  return [
    `# ${title}`,
    "",
    `> Full-text corpus of one documentation section. Index: ${new URL(withBase(indexPath), config.site).href}`,
    "",
    ...blocks,
  ].join("\n");
}

function markdownUrl(entry: IndexedEntry): string {
  return new URL(withBase(`${entry.url.replace(/\/+$/, "")}/index.md`), config.site).href;
}

function corpusUrl(pathname: string): string {
  return new URL(withBase(`/${pathname.replace(/^\/+/, "")}`), config.site).href;
}

function corpusPathSegments(entry: IndexedEntry): string[] {
  return entry.url.split("/").filter(Boolean);
}

function corpusByteLength(body: string): number {
  return new TextEncoder().encode(body).byteLength;
}

function assertCorpusSize(body: string, pathname: string): void {
  const bytes = corpusByteLength(body);
  if (bytes >= CORPUS_MAX_BYTES) {
    throw new Error(
      `Agent corpus ${pathname} is ${(bytes / 1048576).toFixed(1)} MiB; ` +
      `the maximum generated size is ${CORPUS_MAX_BYTES / 1048576} MiB`,
    );
  }
}

export interface CorpusShard {
  /** Route below `/docs`, without a leading slash or `/llms.txt`. */
  path: string;
  body: string;
  split: boolean;
}

function renderSplitCorpus(
  entries: IndexedEntry[],
  title: string,
  pathname: string,
  children: string[],
  indexPath: string,
): string {
  const depth = pathname.split("/").filter(Boolean).length;
  const directPages = entries
    .filter((entry) => corpusPathSegments(entry).length === depth)
    .sort((a, b) => a.url.localeCompare(b.url));
  const lines = [
    `# ${title}`,
    "",
    "> This corpus is split into smaller files so every response stays below the deployment asset limit.",
    "",
    `Page index: ${new URL(withBase(indexPath), config.site).href}`,
    "",
  ];
  if (directPages.length) {
    lines.push(
      "## Pages",
      "",
      ...directPages.map((entry) => `- [${entry.title}](${markdownUrl(entry)})`),
      "",
    );
  }
  if (children.length) {
    lines.push(
      "## Subsections",
      "",
      ...children.map((child) => `- [${child}](${corpusUrl(`${child}/llms.txt`)})`),
      "",
    );
  }
  const body = lines.join("\n");
  assertCorpusSize(body, `/${pathname}/llms.txt`);
  return body;
}

function buildCorpusShard(
  entries: IndexedEntry[],
  siteTitle: string,
  segments: string[],
  indexPath: string,
): CorpusShard[] {
  const pathname = segments.join("/");
  const title = `${siteTitle} / ${segments.join(" / ")}`;
  const fullBody = renderCorpus(entries, title, indexPath);
  if (corpusByteLength(fullBody) < CORPUS_MAX_BYTES) {
    return [{ path: pathname, body: fullBody, split: false }];
  }

  const depth = segments.length;
  const childNames = [...new Set(
    entries
      .map((entry) => corpusPathSegments(entry)[depth])
      .filter((segment): segment is string => Boolean(segment)),
  )].sort();
  const childPaths = childNames.map((child) => [...segments, child].join("/"));
  const children = childNames.flatMap((child) => {
    const childEntries = entries.filter((entry) => corpusPathSegments(entry)[depth] === child);
    return buildCorpusShard(childEntries, siteTitle, [...segments, child], indexPath);
  });
  const body = renderSplitCorpus(entries, title, pathname, childPaths, indexPath);
  return [{ path: pathname, body, split: true }, ...children];
}

/**
 * Build one full-text corpus per top-level section. Oversized sections become
 * indexes whose children are split recursively until every asset is safe.
 */
export function buildCorpusShards(
  entries: IndexedEntry[],
  siteTitle: string,
  indexPath = "/llms.txt",
): CorpusShard[] {
  return sectionsOf(entries).flatMap((section) =>
    buildCorpusShard(
      entries.filter((entry) => sectionOf(entry) === section),
      siteTitle,
      [section],
      indexPath,
    )
  );
}

export function renderCorpusIndex(
  title: string,
  sections: string[],
  prefix: string,
  filename = "llms-full.txt",
): string {
  const lines = [
    `# ${title}: full-text corpus`,
    "",
    "> The corpus is split by section so each file stays below the deployment asset limit. Fetch the sections you need:",
    "",
    ...sections.map((section) => `- [${section}](${new URL(withBase(`${prefix}/${section}/${filename}`), config.site).href})`),
    "",
    `Page index: ${new URL(withBase(`${prefix}/llms.txt`), config.site).href}`,
    "",
  ];
  const body = lines.join("\n");
  assertCorpusSize(body, `${prefix}/llms-full.txt`);
  return body;
}
