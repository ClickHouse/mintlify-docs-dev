const SITE_ORIGIN = "https://clickhouse.com";
const DOCS_BASE = "/docs";

const ABSOLUTE_SCHEME = /^[a-z][a-z0-9+.-]*:/iu;
const DOCUMENTATION_INDEX_URL = `${SITE_ORIGIN}${DOCS_BASE}/llms.txt`;

/** Replace Nimbus's generic two-line discovery prompt with ClickHouse's canonical index link. */
export function prepareAgentMarkdown(markdown: string, pagePath?: string): string {
  const withIndexLink = markdown.replace(
    /> Fetch the complete documentation index at: [^\n]+\n> Use this file to discover all available pages before exploring further\./g,
    `> A complete documentation index can be fetched from [${DOCUMENTATION_INDEX_URL}](${DOCUMENTATION_INDEX_URL})`,
  );
  return absolutizeAgentMarkdownLinks(withIndexLink, pagePath);
}

/**
 * Make links in agent-facing Markdown self-contained. Unlike a browser, an
 * agent may receive a Markdown file without its response URL, so root-relative
 * documentation links need to carry the production origin explicitly.
 *
 * `pagePath` also lets ordinary relative Markdown links resolve against the
 * canonical web page that produced the artifact. Leave it undefined for a
 * multi-page corpus, where only root-relative links can be resolved safely.
 */
export function absolutizeAgentMarkdownLinks(markdown: string, pagePath?: string): string {
  const protectedChunks: string[] = [];
  const tokenPrefix = "\0CLICKHOUSE_AGENT_LINK_CODE_";
  const tokenSuffix = "\0";

  const store = (chunk: string): string => {
    const token = `${tokenPrefix}${protectedChunks.length}${tokenSuffix}`;
    protectedChunks.push(chunk);
    return token;
  };

  // Examples often contain Markdown link syntax. Never rewrite executable or
  // explanatory code while making the surrounding document self-contained.
  let guarded = markdown.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, store);
  guarded = guarded.replace(/`[^`\n]+`/g, store);

  const rewrite = (target: string): string => {
    if (
      target === "" ||
      target.startsWith("#") ||
      target.startsWith("//") ||
      ABSOLUTE_SCHEME.test(target) ||
      target.includes("{")
    ) {
      return target;
    }

    if (target.startsWith("/")) {
      const alreadyBased = target === DOCS_BASE ||
        target.startsWith(`${DOCS_BASE}/`) ||
        target.startsWith(`${DOCS_BASE}#`) ||
        target.startsWith(`${DOCS_BASE}?`);
      const path = alreadyBased
        ? target
        : `${DOCS_BASE}${target}`;
      return new URL(path, SITE_ORIGIN).href;
    }

    if (!pagePath) return target;

    const canonicalPath = pagePath === DOCS_BASE || pagePath.startsWith(`${DOCS_BASE}/`)
      ? pagePath
      : `${DOCS_BASE}/${pagePath.replace(/^\/+/, "")}`;
    const directory = canonicalPath.endsWith("/") ? canonicalPath : `${canonicalPath}/`;
    return new URL(target, new URL(directory, SITE_ORIGIN)).href;
  };

  // Inline links and images: [label](target), ![alt](target).
  guarded = guarded.replace(
    /(\]\(\s*)(<?)([^\s)>]+)(>?)(?=[\s)])/g,
    (_match, prefix: string, open: string, target: string, close: string) =>
      `${prefix}${open}${rewrite(target)}${close}`,
  );

  // Reference definitions: [name]: target "optional title".
  guarded = guarded.replace(
    /^(\s{0,3}\[[^\]]+\]:\s*)(<?)([^\s>]+)(>?)/gm,
    (_match, prefix: string, open: string, target: string, close: string) =>
      `${prefix}${open}${rewrite(target)}${close}`,
  );

  // HTML left in generated Markdown can carry links and images too.
  guarded = guarded.replace(
    /\b(href|src)\s*=\s*(["'])([^"']+)\2/giu,
    (_match, attribute: string, quote: string, target: string) =>
      `${attribute}=${quote}${rewrite(target)}${quote}`,
  );

  return guarded.replace(
    new RegExp(`${tokenPrefix}(\\d+)${tokenSuffix}`, "g"),
    (_match, index: string) => protectedChunks[Number(index)] ?? "",
  );
}
