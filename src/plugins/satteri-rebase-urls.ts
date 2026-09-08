import type { HastPluginDefinition } from "satteri";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Prefixes Astro's `base` onto site-root-relative URLs in the rendered
 * content. The Mintlify content is written against `clickhouse.com/docs`
 * mounted at `/`, i.e. every internal link is `/reference/...`, so under
 * `base: "/docs"` they must become `/docs/reference/...`. For a remote source,
 * the source's registered mount is inserted first, matching Mintlify's
 * sourceRef behavior. Astro only rebases its own asset URLs, never content
 * links.
 *
 * Covers HTML elements (`a`, `img`, `source`, `video`, `iframe`) and the URL
 * props of MDX JSX components (`href`, `src`, `img`, `to`, `link`, `url`, …).
 */
export interface RebaseUrlsOptions {
  base: string;
  /** Remote source mount directories, relative to the repository root. */
  remoteMounts?: string[];
  /** Repository root used to identify the source file's remote mount. */
  root?: string;
  /** JSX component names whose string props are rebased. */
  components?: string[];
  /** Prop names treated as URLs on those components. */
  props?: string[];
}

// Lowercase HTML written as JSX inside MDX (`<img src="/images/...">`) arrives
// as an MDX JSX node, not a hast element, so the tags are listed here too.
const HTML_AS_JSX = ["a", "img", "source", "video", "iframe", "link"];
const DEFAULT_COMPONENTS = [
  "Image", "Card", "CUICard", "TrackedLink", "GalaxyTrackedLink", "PrimaryButton",
  "SecondaryButton", "Video", "Install", "LinkCard", "Frame", "Embed", "Update",
  "QuickstartPill", "HeroCard", "McpLink", "AskAILink", "IntegrationsBanner", "CsCard",
];
const DEFAULT_PROPS = ["href", "src", "img", "to", "link", "url", "image", "thumbnail", "poster"];

export function rebaseUrls(options: RebaseUrlsOptions): HastPluginDefinition {
  const base = options.base.replace(/\/+$/, "");
  const props = new Set(options.props ?? DEFAULT_PROPS);
  const root = path.resolve(options.root ?? process.cwd());
  const remoteMounts = (options.remoteMounts ?? [])
    .map((mount) => mount.replaceAll("\\", "/").replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);

  const sourceMount = (fileURL: URL | undefined): string | undefined => {
    if (!fileURL || fileURL.protocol !== "file:") return undefined;
    const relativePath = path.relative(root, fileURLToPath(fileURL)).replaceAll("\\", "/");
    if (relativePath.startsWith("../") || path.isAbsolute(relativePath)) return undefined;
    return remoteMounts.find((mount) => relativePath === mount || relativePath.startsWith(`${mount}/`));
  };

  const rebase = (value: unknown, fileURL: URL | undefined): unknown => {
    if (typeof value !== "string") return value;
    // Root-relative, not protocol-relative, not already under the base.
    if (!value.startsWith("/") || value.startsWith("//")) return value;
    // Index pages are canonical at `/folder` (see pathId); `/folder/index` is a redirect.
    let rewritten = value.replace(/^(\/(?:[^#?]*\/)?)index(?=$|[#?])/, (_m, dir: string) => (dir === "/" ? "/" : dir.replace(/\/$/, "")));
    if (rewritten === base || rewritten.startsWith(base + "/") || rewritten.startsWith(base + "#") || rewritten.startsWith(base + "?")) return rewritten;

    // A root-relative link in a remote source is relative to that source's
    // namespace. Mintlify applies the sourceRef mount automatically; because
    // Astro loads the fetched files as one collection, insert the mount here.
    const mount = sourceMount(fileURL);
    const mountPath = mount ? `/${mount}` : undefined;
    const alreadyMounted = mountPath && (
      rewritten === mountPath
      || rewritten.startsWith(`${mountPath}/`)
      || rewritten.startsWith(`${mountPath}#`)
      || rewritten.startsWith(`${mountPath}?`)
    );
    if (mountPath && !alreadyMounted) {
      rewritten = `${mountPath}${rewritten}`;
    }
    return base + rewritten;
  };

  return {
    name: "clickhouse:rebase-urls",
    element: {
      filter: ["a", "img", "source", "video", "iframe", "link"],
      visit(node, ctx) {
        for (const key of ["href", "src", "poster"]) {
          const v = node.properties?.[key];
          const r = rebase(v, ctx.fileURL);
          if (r !== v) ctx.setProperty(node, key, r);
        }
      },
    },
    mdxJsxFlowElement: {
      filter: [...HTML_AS_JSX, ...(options.components ?? DEFAULT_COMPONENTS)],
      visit(node, ctx) {
        return rebaseJsx(node, props, (value) => rebase(value, ctx.fileURL));
      },
    },
    mdxJsxTextElement: {
      filter: [...HTML_AS_JSX, ...(options.components ?? DEFAULT_COMPONENTS)],
      visit(node, ctx) {
        return rebaseJsx(node, props, (value) => rebase(value, ctx.fileURL));
      },
    },
  };
}

function rebaseJsx<N extends { attributes?: unknown[] }>(node: Readonly<N>, props: Set<string>, rebase: (v: unknown) => unknown): N | void {
  const attrs = (node.attributes ?? []) as Array<{ type: string; name?: string; value?: unknown }>;
  let changed = false;
  const next = attrs.map((a) => {
    if (a.type !== "mdxJsxAttribute" || !a.name || !props.has(a.name) || typeof a.value !== "string") return a;
    const r = rebase(a.value);
    if (r === a.value) return a;
    changed = true;
    return { ...a, value: r };
  });
  if (!changed) return;
  return { ...(node as N), attributes: next };
}
