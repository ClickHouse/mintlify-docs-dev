/**
 * Local release-archive prototype.
 *
 * It reads complete, already rendered reference pages and writes only their
 * document-article HTML plus navigation data and a small manifest. A release
 * job supplies REFERENCE_ARCHIVE_BUILD_DIR (the completed static output); the
 * HTTP input is retained solely for the fast local prototype.
 */
import fs from "node:fs";
import path from "node:path";

const version = process.env.REFERENCE_ARCHIVE_VERSION ?? "26.9";
const origin = (process.env.REFERENCE_ARCHIVE_ORIGIN ?? "http://127.0.0.1:4321/docs").replace(/\/$/, "");
const sourceRoot = path.join(process.cwd(), "reference-prototype", version);
const finalOutputRoot = path.resolve(process.env.REFERENCE_ARCHIVE_OUTPUT_DIR ?? "/private/tmp/reference-artifacts", version, "en");
const outputRoot = `${finalOutputRoot}.staging`;
const buildRoot = process.env.REFERENCE_ARCHIVE_BUILD_DIR
  ? path.resolve(process.env.REFERENCE_ARCHIVE_BUILD_DIR)
  : undefined;
const articleOpen = '<article class="docs-content max-w-none">';

function files(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? files(target) : entry.name.endsWith(".mdx") ? [target] : [];
  });
}

function routeFor(file: string) {
  const relative = path.relative(sourceRoot, file).replace(/\.mdx$/, "").split(path.sep).join("/");
  return relative === "index" ? "" : relative.replace(/\/index$/, "");
}

function titleFor(file: string) {
  const source = fs.readFileSync(file, "utf8");
  const match = source.match(/^title:\s*("(?:[^"\\]|\\.)*")\s*$/m);
  return match ? JSON.parse(match[1]) as string : routeFor(file) || "Reference";
}

const settingsExplorerRoutes: Record<string, string> = {
  "settings/session-settings": "session-settings",
  "settings/server-settings/settings": "server-settings",
  "settings/merge-tree-settings": "merge-tree-settings",
};

function normalizeBody(body: string, route: string) {
  // The archive is a content contract, never an Astro build artifact. Strip
  // component scope IDs and turn callouts into a stable semantic marker that
  // the live reference shell can style in future releases.
  const explorer = settingsExplorerRoutes[route];
  const normalized = body
    .replace(/\sdata-astro-cid-[^\s=>]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/g, "")
    // Client islands are build artifacts. A historical body is inserted into
    // the current shell, where these scripts cannot (and must not) hydrate.
    // Replace the settings island with a stable semantic mount point instead.
    .replace(/<style>astro-island,astro-slot,astro-static-slot\{display:contents\}<\/style>/gi, "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<astro-island\b[\s\S]*?<\/astro-island>/gi, explorer
      ? `<div data-reference-settings-explorer data-reference-settings-index="${explorer}"></div>`
      : "")
    .replace(/<aside\b([^>]*)>/gi, (_match, attributes: string) => {
      const label = attributes.match(/\baria-label=(?:"([^"]*)"|'([^']*)')/i)?.slice(1).find(Boolean)?.toLowerCase() ?? "note";
      const type = /^(info|tip|caution|danger|note)\b/.exec(label)?.[1] ?? "note";
      return `<aside data-reference-callout="${type}">`;
    });
  return normalized;
}

function bodyFor(html: string, route: string) {
  const start = html.indexOf(articleOpen);
  const end = start === -1 ? -1 : html.indexOf("</article>", start + articleOpen.length);
  if (start === -1 || end === -1) throw new Error(`Could not extract rendered article from ${route || "reference root"}`);
  return normalizeBody(html.slice(start + articleOpen.length, end).trim(), route) + "\n";
}

function renderedFileFor(route: string) {
  if (!buildRoot) return undefined;
  // Astro normally emits the site's base path *outside* `outDir`, but CI
  // artifact assembly sometimes passes the enclosing directory instead. Be
  // explicit about the two supported roots rather than guessing routes.
  const candidates = [
    path.join(buildRoot, "reference", version, route, "index.html"),
    path.join(buildRoot, "docs", "reference", version, route, "index.html"),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}

async function renderedPageFor(route: string) {
  const renderedFile = renderedFileFor(route);
  if (renderedFile) {
    if (!fs.existsSync(renderedFile)) {
      throw new Error(`Static reference output is missing ${path.relative(buildRoot!, renderedFile)}`);
    }
    return fs.readFileSync(renderedFile, "utf8");
  }

  const response = await fetch(`${origin}/reference/${version}${route ? `/${route}` : ""}`);
  if (!response.ok) throw new Error(`Could not archive ${route || "reference root"}: ${response.status}`);
  return response.text();
}

function writeNavigation() {
  const navigationFile = process.env.REFERENCE_ARCHIVE_NAVIGATION_FILE;
  let navigation: unknown;
  if (navigationFile) {
    navigation = JSON.parse(fs.readFileSync(path.resolve(navigationFile), "utf8"));
  } else {
    // This fallback exists only for the local fixture. Release CI supplies a
    // snapshot-derived navigation JSON explicitly; the archive never needs
    // the historical Astro UI to render it.
    const registry = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/generated/reference-prototype.versions.json"), "utf8")) as {
      versions: Record<string, { navigation: unknown }>;
    };
    navigation = registry.versions[version]?.navigation;
  }
  if (navigation === undefined) throw new Error(`No navigation data was supplied for ${version}`);
  fs.writeFileSync(path.join(outputRoot, "navigation.json"), JSON.stringify({ schemaVersion: 1, version, locale: "en", navigation }, null, 2) + "\n");
}

function writeSettingsIndexes() {
  // The explorer is snapshot data, just like navigation. Copy only the
  // immutable JSON index; the live shell provides its React/UI implementation.
  const source = path.join(process.cwd(), ".remote", "public-build", "reference-settings-index", version);
  if (!fs.existsSync(source)) throw new Error(`Settings explorer indexes are missing for ${version}: ${source}`);
  fs.cpSync(source, path.join(outputRoot, "settings-index"), { recursive: true });
}

function writeVersionsIndex() {
  const archiveRoot = path.dirname(path.dirname(finalOutputRoot));
  const versions = fs.readdirSync(archiveRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d+(?:\.\d+)+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left, undefined, { numeric: true }))
    .map((key) => ({ version: key, label: key, routeSlug: key.replace(/\./g, "-") }));
  fs.writeFileSync(path.join(archiveRoot, "versions.json"), JSON.stringify({ schemaVersion: 1, versions }, null, 2) + "\n");
}

const pages = files(sourceRoot).map((file) => ({ file, route: routeFor(file), title: titleFor(file) }));
fs.rmSync(outputRoot, { recursive: true, force: true });

const concurrency = 8;
let next = 0;
async function worker() {
  while (next < pages.length) {
    const page = pages[next++];
    const output = path.join(outputRoot, page.route, "body.html");
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, bodyFor(await renderedPageFor(page.route), page.route));
  }
}

await Promise.all(Array.from({ length: concurrency }, worker));
fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(path.join(outputRoot, "manifest.json"), JSON.stringify({
  schemaVersion: 1,
  version,
  locale: "en",
  pages: pages.map(({ route, title }) => ({ route, title })),
}, null, 2) + "\n");
writeNavigation();
writeSettingsIndexes();
// Publish only after every fragment, manifest, and navigation payload has
// been produced. An interrupted release job therefore leaves the prior
// release archive intact.
fs.rmSync(finalOutputRoot, { recursive: true, force: true });
fs.renameSync(outputRoot, finalOutputRoot);
writeVersionsIndex();

console.log(`archive-reference-bodies: wrote ${pages.length} body fragments and navigation for ${version} to ${finalOutputRoot}`);
