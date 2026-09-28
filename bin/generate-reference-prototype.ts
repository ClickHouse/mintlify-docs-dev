/**
 * Render a validated ClickHouse reference snapshot into Nimbus-friendly MDX.
 * This is a visual prototype; production will put the same contract behind
 * the reference microfrontend rather than committing the derived MDX.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type Catalog = { name: string; path: string; rows: number; sha256: string };
type SnapshotRow = Record<string, unknown> & { name: string; description?: string; syntax?: string; examples?: string; introduced_in?: string; related?: string[] };
type FunctionRow = SnapshotRow & { categories?: string; alias_to?: string; is_aggregate?: number | boolean; arguments?: string; returned_value?: string };
type DocumentationRow = SnapshotRow & { type: string; source?: string };
type NavigationItem = { label: string; link?: string; items?: NavigationItem[]; collapsed?: boolean };
type ReferenceVersionRegistry = {
  schemaVersion: number;
  defaultKey: string;
  versions: Record<string, { label: string; routePrefix: string; clickhouseVersion: string; navigation: NavigationItem[] }>;
};

const snapshotRoot = process.env.REFERENCE_SNAPSHOT_DIR;
if (!snapshotRoot) throw new Error("REFERENCE_SNAPSHOT_DIR must point to a reference snapshot");
const resolvedSnapshotRoot = path.resolve(snapshotRoot);
const manifest = JSON.parse(fs.readFileSync(path.join(resolvedSnapshotRoot, "manifest.json"), "utf8")) as { schemaVersion: number; clickhouseVersion: string; catalogs: Catalog[] };
if (manifest.schemaVersion !== 1) throw new Error(`Unsupported reference snapshot schema: ${manifest.schemaVersion}`);

function catalog<T extends SnapshotRow>(name: string): T[] {
  const details = manifest.catalogs.find((entry) => entry.name === name);
  if (!details) throw new Error(`Reference snapshot does not contain ${name}`);
  const catalogPath = path.resolve(resolvedSnapshotRoot, details.path);
  if (!catalogPath.startsWith(`${resolvedSnapshotRoot}${path.sep}`)) throw new Error(`Reference snapshot catalog escapes its root: ${details.path}`);
  const source = fs.readFileSync(catalogPath, "utf8");
  if (createHash("sha256").update(source).digest("hex") !== details.sha256) throw new Error(`Reference snapshot ${name} catalog digest mismatch`);
  const rows = JSON.parse(source) as T[];
  if (rows.length !== details.rows) throw new Error(`Reference snapshot ${name} catalog row count mismatch`);
  return rows;
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const heading = (value: string) => slug(value) || "reference";
const code = (value: string) => `\`\`\`sql\n${value.trim()}\n\`\`\``;
const section = (title: string, value: string | undefined) => value?.trim() ? `**${title}**\n\n${value.trim()}` : "";
const escapeHtml = (value: unknown) => String(value).replace(/[&<>"'{}\r\n\t]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "{": "&#123;", "}": "&#125;", "\r": "&#13;", "\n": "&#10;", "\t": "&#9;" })[character]!);
const versionKey = process.env.REFERENCE_VERSION_KEY ?? "latest";
if (!/^[a-z0-9][a-z0-9._-]*$/i.test(versionKey)) throw new Error(`Invalid reference version key: ${versionKey}`);
const routePrefix = (process.env.REFERENCE_ROUTE_PREFIX ?? "/reference").replace(/\/$/, "");
if (!routePrefix.startsWith("/")) throw new Error(`Reference route prefix must start with '/': ${routePrefix}`);
const routeUrl = (relativePath = "") => `${routePrefix}${relativePath ? `/${relativePath.replace(/^\//, "")}` : ""}`;
const prototypeRoot = path.resolve(process.cwd(), process.env.REFERENCE_PROTOTYPE_OUTPUT_DIR ?? path.join("reference-prototype", versionKey));
const settingsIndexRoot = path.resolve(process.cwd(), ".remote", "public-build", "reference-settings-index", versionKey);
const settingsIndexUrl = `/reference-settings-index/${versionKey}`;
type RouteContractEntry = {
  route: string;
  disposition: "snapshot" | "redirect" | "snapshot-omitted" | "feature-gated" | "derived" | "retained-historical" | "retained-template";
  snapshotEntity?: { type: string; name: string };
  redirectFrom?: string[];
  redirectTo?: string;
  feature?: string;
  note: string;
};
type LegacyRoute = { route: string; title?: string; keys: string[]; embeddedKeys: string[] };
type SettingsGroup = { label: string; prefix?: string; route: string };
type ReferenceSnapshotMetadata = {
  schemaVersion: number;
  clickhouseVersion: string;
  routeContract: { entries: RouteContractEntry[] };
  legacyRoutes: Record<string, LegacyRoute[]>;
  settingsGroups: { session: SettingsGroup[]; server: SettingsGroup[]; mergeTree: SettingsGroup[] };
  sourceOwnedFunctionPages: Array<{ title: string; route: string; description: string; body: string }>;
  functionRouteOverrides: Record<string, string>;
  windowFunctionNames: string[];
};

// This is the versioned source of reference routing/navigation. Once loaded,
// the renderer deliberately performs no reads from the authored reference tree.
const metadataPath = path.join(resolvedSnapshotRoot, "metadata", "reference-site.json");
if (!fs.existsSync(metadataPath)) throw new Error(`Reference snapshot is missing metadata/reference-site.json: ${metadataPath}`);
const referenceMetadata = JSON.parse(fs.readFileSync(metadataPath, "utf8")) as ReferenceSnapshotMetadata;
if (referenceMetadata.schemaVersion !== 1) throw new Error(`Unsupported reference metadata schema: ${referenceMetadata.schemaVersion}`);
if (referenceMetadata.clickhouseVersion !== manifest.clickhouseVersion) throw new Error("Reference metadata ClickHouse version does not match its snapshot manifest");
const routeContractEntries = referenceMetadata.routeContract.entries;
// The explorer data is a first-class static build asset. This prototype emits
// it beside the local site; production will emit the same versioned JSON from
// the snapshot CI artifact, rather than reconstructing it from rendered MDX.
// This directory is entirely derived from one snapshot. Start clean so a
// removed system-table record cannot survive into a later static build.
fs.rmSync(prototypeRoot, { recursive: true, force: true });
fs.rmSync(settingsIndexRoot, { recursive: true, force: true });

type SettingsExplorerGroup = {
  label: string;
  count: number;
  settings: Array<{ name: string; href: string; default?: string }>;
};

function writeSettingsExplorerIndex({
  name,
  displayPath,
  groups,
  assignments,
}: {
  name: string;
  displayPath: string;
  groups: Array<{ label: string; route: string }>;
  assignments: Map<string, SnapshotRow[]>;
}) {
  const payload = {
    schemaVersion: 1,
    clickhouseVersion: manifest.clickhouseVersion,
    displayPath,
    groups: groups.map<SettingsExplorerGroup>((group) => {
      const settings = assignments.get(group.route)!.map((row) => ({
        name: row.name,
        href: `${routeUrl(group.route)}#${heading(row.name)}`,
        ...(row.default !== undefined && row.default !== "" ? { default: String(row.default) } : {}),
      }));
      return { label: group.label, count: settings.length, settings };
    }),
  };
  fs.mkdirSync(settingsIndexRoot, { recursive: true });
  fs.writeFileSync(path.join(settingsIndexRoot, `${name}.json`), JSON.stringify(payload) + "\n");
}

const settingsExplorer = (name: string) =>
  `<SettingsExplorer client:load indexUrl="${settingsIndexUrl}/${name}.json" />`;
const settingsExplorerImport = (relativePath: string) =>
  `import { SettingsExplorer } from "${path.relative(
    path.dirname(path.join(prototypeRoot, `${relativePath}.mdx`)),
    path.join(process.cwd(), "src", "components", "SettingsExplorer"),
  ).split(path.sep).join("/")}";`;

function frontmatter(title: string, description: string, generated = true) {
  return ["---", `title: ${JSON.stringify(title)}`, `description: ${JSON.stringify(description)}`, "noindex: true", "searchable: false", "referenceSnapshot: true", `referenceSnapshotKey: ${JSON.stringify(versionKey)}`, `referenceSnapshotVersion: ${JSON.stringify(manifest.clickhouseVersion)}`, `generatedFromSystemTables: ${generated}`, "---", ""].join("\n");
}
function writePage(relativePath: string, title: string, description: string, body: string, generated = true, imports: string[] = []) {
  const output = path.join(prototypeRoot, `${relativePath}.mdx`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${frontmatter(title, description, generated)}${imports.join("\n")}${imports.length ? "\n\n" : ""}${body.trim()}\n`);
}
// Embedded documentation owns its internal hierarchy. Nest it beneath the
// catalog-item heading so sibling entries retain a useful TOC. Convert only
// the two Docusaurus constructs that MDX rejects outside code fences: HTML
// comments and literal comparison/heart characters beginning with `<`.
function normalizeEmbeddedMarkdown(markdown: string) {
  let fenced = false;
  return markdown.split("\n").map((line) => {
    if (/^(```|~~~)/.test(line.trimStart())) fenced = !fenced;
    if (fenced) return line;
    if (/^\s*import\s+.+?\s+from\s+['"][^'"]+['"];?\s*$/.test(line)) return "";
    let normalized = line
      .replace(/<!--(.*?)-->/g, "{/*$1*/}")
      .replace(/<(?!\/?[A-Za-z][\w.-]*(?:\s|\/?>))/g, "&lt;")
      // Docusaurus `<TabItem>` has different props from Nimbus's component.
      .replace(/<TabItem\b(?=[^>]*\bvalue="([^"]+)")(?=[^>]*\blabel="([^"]+)")[^>]*>/g, '<TabItem label="$2">')
      .replace(/<TabItem\b(?=[^>]*\bvalue="([^"]+)")[^>]*>/g, '<TabItem label="$1">');
    // These components and snippets are authored-site dependencies, not part
    // of the binary snapshot. Preserve the fact that a notice existed without
    // emitting duplicate/undefined imports into one combined MDX document.
    normalized = normalized.replace(/<(?:Cloud(?:NotSupported|Only|Supported)Badge|ExperimentalBadge|BetaBadge|PrivatePreviewBadge|DeprecatedBadge|ScalePlanFeatureBadge)\b[^>]*\/?>(?:<\/(?:Cloud(?:NotSupported|Only|Supported)Badge|ExperimentalBadge|BetaBadge|PrivatePreviewBadge|DeprecatedBadge|ScalePlanFeatureBadge)>)?/g, "");
    normalized = normalized.replace(/<(?:WhenToUseJson|DataTypeMapping|DataTypesMatching|PrettyFormatSettings|RowBinaryFormatSettings|CloudDetails)\b[^>]*\/?>(?:<\/(?:WhenToUseJson|DataTypeMapping|DataTypesMatching|PrettyFormatSettings|RowBinaryFormatSettings|CloudDetails)>)?/g, "");
    // Angle-bracket placeholders such as `<Engine>` are prose, not registered
    // MDX components. Keep the visible text while avoiding undefined JSX.
    normalized = normalized.replace(/<(\/?)(?!Note\b|Info\b|Tip\b|Warning\b|Danger\b|Check\b|Tabs\b|Tab\b|TabItem\b|Steps\b|Step\b|Card\b|CardGroup\b|Accordion\b|AccordionGroup\b|Expandable\b|Frame\b|Badge\b|Tooltip\b|Columns\b|Update\b|Icon\b|View\b|Visibility\b|CodeBlock\b|Aside\b|Render\b|PackageManagers\b)([A-Z][\w.-]*)(?=[\s/>])/g, "&lt;$1$2");
    return normalized;
  }).join("\n");
}
const nestMarkdown = (markdown: string) => normalizeEmbeddedMarkdown(markdown).replace(/^(#{1,5})(?=\s)/gm, "#$1");
function renderRecord(row: SnapshotRow, extra: string[] = [], includeRecordHeading = true, metadata: string[] = []) {
  // A record page already receives its H1 from frontmatter. Snapshot prose
  // commonly begins with an H1 of its own, so discard that one only for an
  // un-nested leaf. Its following H2 sections then become the normal sections
  // directly beneath the page title.
  const description = row.description?.trim()
    ? (includeRecordHeading
      ? nestMarkdown(row.description.trim())
      : normalizeEmbeddedMarkdown(row.description.trim()).replace(/^\s*#\s+[^\n]+\n+/, ""))
    : "";
  return [
    includeRecordHeading ? `## ${row.name} {#${heading(row.name)}}` : "",
    row.introduced_in ? `Introduced in: v${row.introduced_in}` : "",
    ...metadata,
    description,
    section("Syntax", row.syntax ? code(row.syntax) : undefined),
    ...extra,
    row.examples?.trim() ? section("Examples", row.examples) : "",
    row.related?.length ? `**Related**\n\n${row.related.map((name) => `- \`${name}\``).join("\n")}` : "",
  ].filter(Boolean).join("\n\n");
}
type CatalogEntry = { row: SnapshotRow; route: string; recordSlug: string };

function legacyRouteIndex(relativeDirectory: string): LegacyRoute[] {
  const routes = referenceMetadata.legacyRoutes[relativeDirectory];
  if (!routes) throw new Error(`Reference snapshot metadata does not define ${relativeDirectory} routing`);
  return routes;
}

function legacyRouteFor(row: SnapshotRow, relativeDirectory: string) {
  const name = routeKey(row.name);
  const directCandidates = legacyRouteIndex(relativeDirectory)
    .filter((route) => route.keys.includes(name))
    .map((route) => route.route);
  if (directCandidates.length === 1) return directCandidates[0];
  const embeddedCandidates = legacyRouteIndex(relativeDirectory)
    .filter((route) => route.embeddedKeys.includes(name))
    .map((route) => route.route);
  return embeddedCandidates.length === 1 ? embeddedCandidates[0] : undefined;
}

function legacyTitleFor(route: string, relativeDirectory: string, fallback: string) {
  return legacyRouteIndex(relativeDirectory).find((entry) => entry.route === route)?.title ?? fallback;
}

/**
 * A number of historical routes are collection pages whose names cannot be
 * inferred from a system-table row (for example `array-functions`).  Their
 * generated bodies provide the stable contract: choose the legacy page that
 * contains the most records from this collection.
 */
function legacyCollectionRouteFor(rows: SnapshotRow[], relativeDirectory: string, fallback: string) {
  const recordKeys = new Set(rows.map((row) => routeKey(row.name)));
  const candidates = legacyRouteIndex(relativeDirectory)
    .map((entry) => ({ entry, matches: entry.embeddedKeys.filter((key) => recordKeys.has(key)).length }))
    .filter(({ matches }) => matches > 0)
    .sort((left, right) => right.matches - left.matches);
  if (!candidates.length) return fallback;
  if (candidates.length > 1 && candidates[0].matches === candidates[1].matches) return fallback;
  return candidates[0].entry.route;
}

function writeLegacyParentCollections(entries: CatalogEntry[], legacyDirectory: string, description: string) {
  const byParent = new Map<string, CatalogEntry[]>();
  for (const entry of entries) {
    const parent = path.posix.dirname(entry.route);
    if (parent !== legacyDirectory && legacyRouteIndex(legacyDirectory).some((route) => route.route === parent)) {
      byParent.set(parent, [...(byParent.get(parent) ?? []), entry]);
    }
  }
  for (const [route, children] of byParent) {
    const title = legacyTitleFor(route, legacyDirectory, path.posix.basename(route));
    writePage(route, title, description, [
      `Browse ${children.length} ${title.toLowerCase()} from this ClickHouse snapshot.`,
      "",
      ...children.sort((left, right) => left.row.name.localeCompare(right.row.name)).map(({ row, route: childRoute }) => `- [${row.name}](${routeUrl(childRoute)})`),
    ].join("\n"));
  }
}

/**
 * Temporary representation of the route metadata that will ship inside a
 * release snapshot.  A record name is not sufficient to recover every public
 * URL: some routes have deliberately retained historical naming.
 */
type CatalogRouteOverrides = ReadonlyMap<string, string>;

function renderCatalog(
  relativePath: string,
  title: string,
  rows: SnapshotRow[],
  description: string,
  legacyDirectory = relativePath,
  routeOverrides: CatalogRouteOverrides = new Map(),
) {
  const documented = rows.filter((row) => row.description?.trim()).sort((a, b) => a.name.localeCompare(b.name));
  const routeCounts = new Map<string, number>();
  const entries = documented.map((row) => {
    const baseSlug = slug(row.name);
    const route = routeOverrides.get(row.name) ?? legacyRouteFor(row, legacyDirectory) ?? `${relativePath}/${baseSlug}`;
    const occurrence = (routeCounts.get(route) ?? 0) + 1;
    routeCounts.set(route, occurrence);
    // System-table names can differ only by case (for example ArrowFlight and
    // arrowFlight). Keep both documented records with stable, distinct URLs.
    return { row, route: occurrence === 1 ? route : `${route}-${occurrence}`, recordSlug: occurrence === 1 ? baseSlug : `${baseSlug}-${occurrence}` };
  });
  const entriesByRoute = new Map<string, CatalogEntry[]>();
  for (const entry of entries) entriesByRoute.set(entry.route, [...(entriesByRoute.get(entry.route) ?? []), entry]);
  const legacyTitles = new Map(legacyRouteIndex(legacyDirectory).map((entry) => [entry.route, entry.title]));
  for (const [route, groupedEntries] of entriesByRoute) {
    const collection = groupedEntries.length > 1;
    const pageTitle = collection ? legacyTitles.get(route) ?? title : groupedEntries[0].row.name;
    // The frontmatter title is already the page H1. A detail page should begin
    // with its documentation, unlike catalog pages where each record needs an
    // H2 to distinguish it from its siblings.
    writePage(
      route,
      pageTitle,
      `${pageTitle} reference for ClickHouse ${manifest.clickhouseVersion}.`,
      collection
        ? groupedEntries.map(({ row }) => renderRecord(row)).join("\n\n")
        : renderRecord(groupedEntries[0].row, [], false),
    );
  }
  writePage(relativePath, title, description, [
    `Browse ${documented.length} ${title.toLowerCase()} from this ClickHouse snapshot.`,
    "",
    ...entries.map(({ row, route }) => `- [${row.name}](${routeUrl(route)})`),
  ].join("\n"));
  return entries;
}

const functions = catalog<FunctionRow>("functions");
const documentation = catalog<DocumentationRow>("documentation");
const docsOfType = (type: string) => documentation.filter((row) => row.type === type);
const visibleFunctions = functions.filter((fn) => fn.alias_to === "" && fn.categories && fn.categories !== "Internal");
const documentedFunctions = visibleFunctions.filter((fn) => Number(fn.is_aggregate) === 0);
const aggregateFunctions = visibleFunctions.filter((fn) => Number(fn.is_aggregate) === 1);
const functionCategories = [...new Set(documentedFunctions.map((fn) => fn.categories!))].sort((left, right) => left.localeCompare(right));

const routeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
type FunctionEntry = { row: FunctionRow; route: string };

// A handful of historical URLs represent renamed aggregate functions. Keep
// their public route stable while rendering the authoritative current record.
// In production this belongs in snapshot route metadata, alongside redirects.
const legacyFunctionRouteOverrides = new Map(
  Object.entries(referenceMetadata.functionRouteOverrides).map(([name, route]) => [routeKey(name), route]),
);

// The public function URLs predate the snapshot renderer and frequently keep
// punctuation or casing that cannot be reconstructed from system.functions.
// Prefer the existing path whenever its filename matches the function name;
// the slug fallback is solely for newly introduced functions.
function currentFunctionRoutes(relativeDirectory: string) {
  const routes = new Map<string, string>();
  for (const route of legacyRouteIndex(relativeDirectory)) {
    if (path.posix.dirname(route.route) !== relativeDirectory) continue;
    routes.set(routeKey(path.posix.basename(route.route)), route.route);
  }
  return routes;
}

function writeSourceOwnedFunctionPage(page: { title: string; route: string; description: string; body: string }) {
  writePage(page.route, page.title, page.description, normalizeEmbeddedMarkdown(page.body), false);
  return { title: page.title, route: page.route };
}

function writeFunctionDetails(relativeDirectory: string, rows: FunctionRow[], sourceOwnedKeys: Set<string>) {
  const legacyRoutes = currentFunctionRoutes(relativeDirectory);
  const routeCounts = new Map<string, number>();
  const entries: FunctionEntry[] = [];
  for (const row of rows.filter((fn) => !sourceOwnedKeys.has(routeKey(fn.name))).sort((a, b) => a.name.localeCompare(b.name))) {
    const baseRoute = legacyFunctionRouteOverrides.get(routeKey(row.name))
      ?? legacyRouteFor(row, relativeDirectory)
      ?? legacyRoutes.get(routeKey(row.name))
      ?? `${relativeDirectory}/${slug(row.name)}`;
    const occurrence = (routeCounts.get(baseRoute) ?? 0) + 1;
    routeCounts.set(baseRoute, occurrence);
    const route = occurrence === 1 ? baseRoute : `${baseRoute}-${occurrence}`;
    writePage(route, row.name, `${row.name} reference for ClickHouse ${manifest.clickhouseVersion}.`, renderRecord(row, [section("Arguments", row.arguments), section("Returned value", row.returned_value)].filter(Boolean) as string[], false));
    entries.push({ row, route });
  }
  return entries;
}

function writeFunctionReferenceIndex(relativePath: string, title: string, entries: FunctionEntry[]) {
  const sorted = [...entries].sort((left, right) => left.row.name.localeCompare(right.row.name));
  writePage(relativePath, title, `Browsable ${title.toLowerCase()} from ClickHouse ${manifest.clickhouseVersion}.`, [
    `Browse ${sorted.length} ${title.toLowerCase()} from this ClickHouse snapshot.`,
    "",
    ...sorted.map(({ row, route }) => `- [${row.name}](${routeUrl(route)})`),
  ].join("\n"));
}

const sourceOwnedFunctionPages = referenceMetadata.sourceOwnedFunctionPages.map(writeSourceOwnedFunctionPage);
const sourceOwnedAggregateDetails = sourceOwnedFunctionPages
  .filter(({ route }) => route.startsWith("functions/aggregate-functions/") && !["combinators", "grouping_function", "parametric-functions"].includes(route.split("/").at(-1)!));
const sourceOwnedWindowDetails = sourceOwnedFunctionPages
  .filter(({ route }) => route.startsWith("functions/window-functions/") && !route.endsWith("window-functions"));

function writeFunctionCollection(relativePath: string, title: string, description: string, entries: FunctionRow[], introduction = "") {
  const body = [
    introduction,
    ...entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((fn) => renderRecord(fn, [section("Arguments", fn.arguments), section("Returned value", fn.returned_value)].filter(Boolean) as string[])),
  ].filter(Boolean).join("\n\n");
  writePage(relativePath, title, description, body);
}

const functionCollectionRoutes = new Map<string, string>();
for (const category of functionCategories) {
  const entries = documentedFunctions.filter((fn) => fn.categories === category);
  const fallback = `functions/regular-functions/${slug(category)}-functions`;
  const route = legacyCollectionRouteFor(entries, "functions/regular-functions", fallback);
  functionCollectionRoutes.set(category, route);
  writeFunctionCollection(
    route,
    legacyTitleFor(route, "functions/regular-functions", `${category} functions`),
    `ClickHouse ${manifest.clickhouseVersion} ${category.toLowerCase()} function reference.`,
    entries,
  );
}

// Window functions are marked as aggregate functions in system.functions. They
// need their own navigation and generated page, however, because users browse
// them as a distinct SQL feature. Keep this rule explicit and versioned with
// the renderer rather than assuming a non-existent system-table category.
const windowFunctionNames = new Set(referenceMetadata.windowFunctionNames);
const sourceOwnedAggregateKeys = new Set(sourceOwnedAggregateDetails.map(({ route }) => routeKey(route.split("/").at(-1)!)));
const sourceOwnedWindowKeys = new Set(sourceOwnedWindowDetails.map(({ route }) => routeKey(route.split("/").at(-1)!)));
const aggregateRowsByName = new Map<string, FunctionRow>();
for (const row of [...aggregateFunctions, ...docsOfType("Aggregate Function")]) {
  if (!aggregateRowsByName.has(routeKey(row.name))) aggregateRowsByName.set(routeKey(row.name), row);
}
const aggregateFunctionEntries = writeFunctionDetails("functions/aggregate-functions", [...aggregateRowsByName.values()], sourceOwnedAggregateKeys);
const windowFunctionEntries = writeFunctionDetails(
  "functions/window-functions",
  functions.filter((fn) => windowFunctionNames.has(fn.name) && fn.alias_to === ""),
  sourceOwnedWindowKeys,
);
const sourceOwnedEntry = ({ title, route }: { title: string; route: string }): FunctionEntry => ({ row: { name: title }, route });
writeFunctionReferenceIndex(
  "functions/aggregate-functions/reference-index",
  "Aggregate function reference",
  [...aggregateFunctionEntries, ...sourceOwnedAggregateDetails.map(sourceOwnedEntry)],
);
writeFunctionReferenceIndex(
  "functions/window-functions/reference-index",
  "Window function reference",
  [...windowFunctionEntries, ...sourceOwnedWindowDetails.map(sourceOwnedEntry)],
);

const statements = catalog<SnapshotRow>("statements");
const statementEntries = renderCatalog(
  "statements",
  "ClickHouse SQL statements",
  docsOfType("Statement").filter((row) => statements.some((statement) => statement.name === row.name)),
  `SQL statement documentation from ClickHouse ${manifest.clickhouseVersion}.`,
  "statements",
  new Map([["ORDER BY", "statements/select/order-by"]]),
);
const dictionaryLayoutEntries = renderCatalog("statements/create/dictionary/layouts", "Dictionary layouts", docsOfType("Dictionary Layout"), `Dictionary layout documentation from ClickHouse ${manifest.clickhouseVersion}.`);
const dictionarySourceEntries = renderCatalog(
  "statements/create/dictionary/sources",
  "Dictionary sources",
  docsOfType("Dictionary Source"),
  `Dictionary source documentation from ClickHouse ${manifest.clickhouseVersion}.`,
  "statements/create/dictionary/sources",
  new Map([
    ["executable", "statements/create/dictionary/sources/executable-file"],
    ["file", "statements/create/dictionary/sources/local-file"],
  ]),
);
const dataTypeEntries = renderCatalog("data-types", "Data types", catalog<SnapshotRow>("data_type_families").filter((row) => row.alias_to === ""), `Data type documentation from ClickHouse ${manifest.clickhouseVersion}.`);

const integerDataTypes = dataTypeEntries
  .map(({ row }) => row)
  .filter((row) => /^(u?int|int128|uint128|int256|uint256)/i.test(row.name));
const integerRoute = legacyCollectionRouteFor(integerDataTypes, "data-types", "data-types/int-uint");
if (integerDataTypes.length) {
  const title = legacyTitleFor(integerRoute, "data-types", "Integer types");
  writePage(integerRoute, title, `Integer data types in ClickHouse ${manifest.clickhouseVersion}.`, integerDataTypes
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((row) => renderRecord(row))
    .join("\n\n"));
}

const tableEngines = renderCatalog("engines/table-engines", "Table engines", catalog<SnapshotRow>("table_engines"), `Table engine documentation from ClickHouse ${manifest.clickhouseVersion}.`);
writeLegacyParentCollections(tableEngines, "engines/table-engines", `Table engine documentation from ClickHouse ${manifest.clickhouseVersion}.`);
const databaseEngines = renderCatalog("engines/database-engines", "Database engines", catalog<SnapshotRow>("database_engines"), `Database engine documentation from ClickHouse ${manifest.clickhouseVersion}.`);
const tableFunctions = renderCatalog("functions/table-functions", "Table functions", catalog<SnapshotRow>("table_functions"), `Table function documentation from ClickHouse ${manifest.clickhouseVersion}.`);
const formatEntries = renderCatalog("formats", "Formats", catalog<SnapshotRow>("formats"), `Format documentation from ClickHouse ${manifest.clickhouseVersion}.`);

function documentedSettings(catalogName: string) {
  return catalog<SnapshotRow>(catalogName)
    .filter((row) => row.description?.trim() && (!row.alias_for || row.alias_for === "") && Number(row.is_obsolete ?? 0) === 0)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function settingAttributes(row: SnapshotRow) {
  const attributes = [
    row.type ? `type="${escapeHtml(row.type)}"` : "",
    row.default !== undefined && row.default !== "" ? `defaultValue="${escapeHtml(row.default)}"` : "",
    row.tier && row.tier !== "Production" ? `tier="${escapeHtml(row.tier)}"` : "",
  ].filter(Boolean);

  return attributes.length ? `<SettingMetadata ${attributes.join(" ")} />` : "";
}

function sessionSettingsGroups(): Array<{ label: string; prefix?: string; route: string }> {
  return referenceMetadata.settingsGroups.session;
}

function prefixSettingsGroups(kind: "server" | "mergeTree"): SettingsGroup[] {
  return referenceMetadata.settingsGroups[kind];
}

function renderPrefixSettings({
  catalogName,
  indexName,
  settingsGroupKind,
  overviewRoute,
  title,
  settingKind,
  systemTable,
  displayPath,
}: {
  catalogName: string;
  indexName: string;
  settingsGroupKind: "server" | "mergeTree";
  overviewRoute: string;
  title: string;
  settingKind: string;
  systemTable: string;
  displayPath: string;
}) {
  const rows = documentedSettings(catalogName);
  const groups = prefixSettingsGroups(settingsGroupKind);
  const assignments = new Map(groups.map((group) => [group.route, [] as SnapshotRow[]]));
  const prefixes = groups
    .filter((group): group is { label: string; prefix: string; route: string } => Boolean(group.prefix))
    .sort((left, right) => right.prefix.length - left.prefix.length);
  const other = groups.find((group) => !group.prefix);
  if (!other) throw new Error(`${settingsGroupKind} settings route contract is missing its Other group`);

  for (const row of rows) {
    const group = prefixes.find((candidate) => row.name === candidate.prefix || row.name.startsWith(`${candidate.prefix}_`)) ?? other;
    assignments.get(group.route)!.push(row);
  }

  // Sidebar prefixes evolve independently of a particular release. Do not
  // publish an empty generated page when a historical prefix has no records
  // in this snapshot.
  const populatedGroups = groups.filter((group) => assignments.get(group.route)!.length > 0);
  const systemTableRoute = slug(systemTable.replace("system.", ""));
  for (const group of populatedGroups) {
    const entries = assignments.get(group.route)!;
    writePage(group.route, `${group.label} ${settingKind}`, `${entries.length} ClickHouse ${settingKind} in the ${group.label} group.`, [
      `These settings are available in [${systemTable}](${routeUrl(`system-tables/${systemTableRoute}`)}) and are autogenerated from the ClickHouse snapshot.`,
      "",
      ...entries.map((row) => {
        const attributes = settingAttributes(row);
        return renderRecord(row, [], true, attributes ? [attributes] : []);
      }),
    ].join("\n\n"));
  }

  writeSettingsExplorerIndex({ name: indexName, displayPath, groups: populatedGroups, assignments });

  writePage(overviewRoute, title, `Autogenerated ${title.toLowerCase()} for ClickHouse ${manifest.clickhouseVersion}.`, [
    `These settings are available in [${systemTable}](${routeUrl(`system-tables/${systemTableRoute}`)}) and are autogenerated from this ClickHouse snapshot.`,
    "",
    settingsExplorer(indexName),
  ].join("\n"), true, [settingsExplorerImport(overviewRoute)]);

  return populatedGroups.map((group) => ({ label: group.label, link: routeUrl(group.route) }));
}

function renderSessionSettings() {
  const relativePath = "settings/session-settings";
  const rows = documentedSettings("settings");
  const groups = sessionSettingsGroups();
  const assignments = new Map(groups.map((group) => [group.route, [] as SnapshotRow[]]));
  const prefixes = groups
    .filter((group): group is { label: string; prefix: string; route: string } => Boolean(group.prefix))
    .sort((left, right) => right.prefix.length - left.prefix.length);
  const other = groups.find((group) => !group.prefix);
  if (!other) throw new Error("Session-settings route contract is missing its Other group");

  for (const row of rows) {
    const group = prefixes.find((candidate) => row.name === candidate.prefix || row.name.startsWith(`${candidate.prefix}_`)) ?? other;
    assignments.get(group.route)!.push(row);
  }

  for (const group of groups) {
    const entries = assignments.get(group.route)!;
    writePage(group.route, `${group.label} session settings`, `${entries.length} ClickHouse session settings in the ${group.label} group.`, [
      `These settings are available in [system.settings](${routeUrl("system-tables/settings")}) and are autogenerated from the ClickHouse snapshot.`,
      "",
      ...entries.map((row) => {
        const attributes = settingAttributes(row);
        return renderRecord(row, [], true, attributes ? [attributes] : []);
      }),
    ].join("\n\n"));
  }

  writeSettingsExplorerIndex({ name: "session-settings", displayPath: "/session-settings", groups, assignments });

  writePage(relativePath, "Session settings", `Autogenerated session settings for ClickHouse ${manifest.clickhouseVersion}.`, [
    `These settings are available in [system.settings](${routeUrl("system-tables/settings")}) and are autogenerated from this ClickHouse snapshot.`,
    "",
    settingsExplorer("session-settings"),
  ].join("\n"), true, [settingsExplorerImport(relativePath)]);

  return groups.map((group) => ({ label: group.label, link: routeUrl(group.route) }));
}

// Keep the historical category routes when a generated legacy page already
// defines the membership. This covers the format, experimental, and older
// prefix collections that are more precise than a simple setting-name prefix.
function renderLegacySettingCollections(catalogName: string, settingKind: string, systemTable: string) {
  const rows = documentedSettings(catalogName);
  const byKey = new Map(rows.map((row) => [routeKey(row.name), row]));
  const systemTableRoute = slug(systemTable.replace("system.", ""));
  for (const legacy of legacyRouteIndex("settings")) {
    const entries = legacy.embeddedKeys
      .map((key) => byKey.get(key))
      .filter((row): row is SnapshotRow => Boolean(row));
    if (!entries.length) continue;
    const title = legacy.title ?? `${settingKind} settings`;
    writePage(legacy.route, title, `${entries.length} ClickHouse ${settingKind} from the current snapshot.`, [
      `These settings are available in [${systemTable}](${routeUrl(`system-tables/${systemTableRoute}`)}) and are autogenerated from the ClickHouse snapshot.`,
      "",
      ...entries.map((row) => {
        const attributes = settingAttributes(row);
        return renderRecord(row, [], true, attributes ? [attributes] : []);
      }),
    ].join("\n\n"));
  }
}

const sessionSettingsNavigation = renderSessionSettings();
const serverSettingsNavigation = renderPrefixSettings({
  catalogName: "server_settings",
  indexName: "server-settings",
  settingsGroupKind: "server",
  overviewRoute: "settings/server-settings/settings",
  title: "Server settings",
  settingKind: "server settings",
  systemTable: "system.server_settings",
  displayPath: "/server-settings",
});
const mergeTreeSettingsNavigation = renderPrefixSettings({
  catalogName: "merge_tree_settings",
  indexName: "merge-tree-settings",
  settingsGroupKind: "mergeTree",
  overviewRoute: "settings/merge-tree-settings",
  title: "MergeTree table settings",
  settingKind: "MergeTree table settings",
  systemTable: "system.merge_tree_settings",
  displayPath: "/merge-tree-settings",
});
renderLegacySettingCollections("settings", "session settings", "system.settings");
renderLegacySettingCollections("server_settings", "server settings", "system.server_settings");
renderLegacySettingCollections("merge_tree_settings", "MergeTree settings", "system.merge_tree_settings");
writePage("settings", "Settings", `Autogenerated settings documentation for ClickHouse ${manifest.clickhouseVersion}.`, [
  "Choose a settings catalog.",
  "",
  `- [Session settings](${routeUrl("settings/session-settings")})`,
  `- [Server settings](${routeUrl("settings/server-settings/settings")})`,
  `- [MergeTree settings](${routeUrl("settings/merge-tree-settings")})`,
].join("\n"));
const systemTableEntries = renderCatalog(
  "system-tables",
  "System tables",
  docsOfType("System Table"),
  `System table documentation from ClickHouse ${manifest.clickhouseVersion}.`,
  "system-tables",
  new Map([["delta_lake_metadata_log", "system-tables/delta_metadata_log"]]),
);

const dataLakePattern = /deltalake|iceberg|hudi|datalake/i;
const dataLakeRows = [
  ...tableEngines,
  ...databaseEngines,
  ...tableFunctions,
].filter(({ row }) => dataLakePattern.test(row.name) || dataLakePattern.test(row.description ?? ""));
writePage("datalakes", "Data lakes", `Data lake engines and table functions from ClickHouse ${manifest.clickhouseVersion}.`, [
  "This snapshot-derived taxonomy links to the canonical generated engine and table-function pages.",
  "",
  ...dataLakeRows.sort((left, right) => left.row.name.localeCompare(right.row.name)).map(({ row, route }) => `- [${row.name}](${routeUrl(route)})`),
].join("\n"));
// No `Interface` entity exists in the system-table contract. Keep this gap
// visible instead of falsely claiming the source-owned page is generated.
writePage("interfaces", "Interfaces", "Interface documentation is not currently exposed by ClickHouse system tables.", "This reference category is source-owned until ClickHouse exposes structured interface documentation through the snapshot contract.", false);
writePage("engines", "Engines", `Autogenerated engine documentation for ClickHouse ${manifest.clickhouseVersion}.`, [
  "Browse engine catalogs from this ClickHouse snapshot.",
  "",
  `- [Table engines](${routeUrl("engines/table-engines")})`,
  `- [Database engines](${routeUrl("engines/database-engines")})`,
].join("\n"));

const linkEntries = (entries: CatalogEntry[]): NavigationItem[] => entries.map(({ row, route }) => ({ label: row.name, link: routeUrl(route) }));
const functionLinks = (entries: FunctionEntry[]): NavigationItem[] => entries
  .sort((left, right) => left.row.name.localeCompare(right.row.name))
  .map(({ row, route }) => ({ label: row.name, link: routeUrl(route) }));
const partitionEntries = (entries: CatalogEntry[], groups: Array<{ label: string; matches: (row: SnapshotRow) => boolean }>, fallback?: string): NavigationItem[] => {
  const remaining = new Set(entries);
  const sections: NavigationItem[] = [];
  for (const group of groups) {
    const matched = entries.filter((entry) => remaining.has(entry) && group.matches(entry.row));
    if (!matched.length) continue;
    matched.forEach((entry) => remaining.delete(entry));
    sections.push({ label: group.label, items: linkEntries(matched) });
  }
  const unmatched = entries.filter((entry) => remaining.has(entry));
  if (unmatched.length) {
    if (fallback) sections.push({ label: fallback, items: linkEntries(unmatched) });
    else sections.push(...linkEntries(unmatched));
  }
  return sections;
};

const statementNavigation = partitionEntries(statementEntries, [
  { label: "ALTER", matches: (row) => row.name.startsWith("ALTER") },
  { label: "CREATE", matches: (row) => row.name.startsWith("CREATE") },
  { label: "SELECT", matches: (row) => new Set(["ALL", "APPLY modifier", "ARRAY JOIN", "DISTINCT", "EXCEPT", "EXCEPT modifier", "FORMAT", "FROM", "GROUP BY", "HAVING", "INTERSECT", "INTO OUTFILE", "JOIN", "LIMIT", "LIMIT BY", "OFFSET FETCH", "ORDER BY", "PIPE OPERATORS", "PREWHERE", "QUALIFY", "REPLACE modifier", "SAMPLE", "SELECT", "UNION", "WHERE", "WITH"]).has(row.name) },
]);
const dataTypeNavigation = partitionEntries(dataTypeEntries, [
  { label: "Numeric types", matches: (row) => /^(u?int|float|decimal|bfloat|bool)/i.test(row.name) },
  { label: "String types", matches: (row) => /string/i.test(row.name) },
  { label: "Date and time types", matches: (row) => /^(date|datetime|time)/i.test(row.name) },
  { label: "Network types", matches: (row) => /^ipv/i.test(row.name) },
  { label: "Composite types", matches: (row) => /^(array|tuple|map|nested)$/i.test(row.name) },
  { label: "Semi-structured types", matches: (row) => /^(json|dynamic|variant)$/i.test(row.name) },
  { label: "Nullable and optional types", matches: (row) => /^(nullable|lowcardinality)$/i.test(row.name) },
  { label: "Specialized types", matches: (row) => /^(uuid|enum|geometry|point|ring|linestring|polygon|multipoint|multilinestring|multipolygon|qbit)$/i.test(row.name) },
  { label: "Aggregate function types", matches: (row) => /aggregatefunction/i.test(row.name) },
  { label: "Special data types", matches: (row) => /^(interval|nothing)/i.test(row.name) },
], "Other types");
const tableEngineNavigation = partitionEntries(tableEngines, [
  { label: "Integrations", matches: (row) => /^(arrowflight|azure|bigquery|cosn|deltalake|embeddedrocksdb|hdfs|hive|hudi|iceberg|jdbc|kafka|materializedpostgresql|mongodb|mysql|nats|odbc|paimon|postgresql|rabbitmq|redis|s3|sqlite|timeseries|ytsaurus)/i.test(row.name) },
  { label: "Log Family", matches: (row) => /^(log|stripelog|tinylog)$/i.test(row.name) },
  { label: "MergeTree Family", matches: (row) => /mergetree/i.test(row.name) },
  { label: "Special", matches: (row) => /^(alias|buffer|dictionary|distributed|executable|executablepool|file|filelog|generaterandom|join|keepermap|loop|memory|merge|null|queryrunner|set|url|view)$/i.test(row.name) },
], "Other table engines");
const formatNavigation = partitionEntries(formatEntries, [
  { label: "Arrow", matches: (row) => /^arrow/i.test(row.name) },
  { label: "Avro", matches: (row) => /^avro/i.test(row.name) },
  { label: "CSV", matches: (row) => /^csv/i.test(row.name) },
  { label: "CustomSeparated", matches: (row) => /^customseparated/i.test(row.name) },
  { label: "JSON", matches: (row) => /^json|^prettyjson/i.test(row.name) },
  { label: "LineAsString", matches: (row) => /^lineasstring/i.test(row.name) },
  { label: "Parquet", matches: (row) => /^parquet/i.test(row.name) },
  { label: "Pretty", matches: (row) => /^pretty(?!json)/i.test(row.name) },
  { label: "Protobuf", matches: (row) => /^protobuf/i.test(row.name) },
  { label: "Puffin", matches: (row) => /^puffin/i.test(row.name) },
  { label: "RowBinary", matches: (row) => /^rowbinary/i.test(row.name) },
  { label: "TabSeparated", matches: (row) => /^(tabseparated|tskv)/i.test(row.name) },
  { label: "Template", matches: (row) => /^template/i.test(row.name) },
]);

const navigation: NavigationItem[] = [{ label: "Reference", items: [
  { label: "Reference", link: routeUrl() },
  { label: "SQL Reference", items: [{ label: "Statements", items: [{ label: "Overview", link: routeUrl("statements") }, ...statementNavigation] }] },
  { label: "Data Types", items: [{ label: "Overview", link: routeUrl("data-types") }, ...dataTypeNavigation] },
  { label: "Engines", items: [
    { label: "Overview", link: routeUrl("engines") },
    { label: "Table Engines", items: [{ label: "Overview", link: routeUrl("engines/table-engines") }, ...tableEngineNavigation] },
    { label: "Database Engines", items: [{ label: "Overview", link: routeUrl("engines/database-engines") }, ...linkEntries(databaseEngines)] },
  ] },
  { label: "Functions", items: [
    { label: "Regular functions", items: functionCategories.map((category) => ({ label: `${category} functions`, link: routeUrl(functionCollectionRoutes.get(category)!) })) },
    { label: "Aggregate Functions", items: [
      { label: "Overview", link: routeUrl("functions/aggregate-functions") },
      { label: "Combinators", link: routeUrl("functions/aggregate-functions/combinators") },
      { label: "GROUPING", link: routeUrl("functions/aggregate-functions/grouping_function") },
      { label: "Parametric", link: routeUrl("functions/aggregate-functions/parametric-functions") },
      { label: "Reference", items: [{ label: "Overview", link: routeUrl("functions/aggregate-functions/reference-index") }, ...functionLinks([...aggregateFunctionEntries, ...sourceOwnedAggregateDetails.map(sourceOwnedEntry)])] },
    ] },
    { label: "Table functions", items: [{ label: "Overview", link: routeUrl("functions/table-functions") }, ...linkEntries(tableFunctions)] },
    { label: "Window functions", items: [
      { label: "Overview", link: routeUrl("functions/window-functions") },
      ...functionLinks([...windowFunctionEntries, ...sourceOwnedWindowDetails.map(sourceOwnedEntry)]),
    ] },
  ] },
  { label: "Formats", items: [{ label: "Overview", link: routeUrl("formats") }, ...formatNavigation] },
  { label: "Interfaces", items: [{ label: "Overview", link: routeUrl("interfaces") }] },
  { label: "Settings", items: [
    { label: "Overview", link: routeUrl("settings") },
    { label: "Session settings", items: [{ label: "Overview", link: routeUrl("settings/session-settings") }, ...sessionSettingsNavigation] },
    { label: "Server settings", items: [{ label: "Settings", link: routeUrl("settings/server-settings/settings") }, ...serverSettingsNavigation] },
    { label: "MergeTree settings", items: [{ label: "Overview", link: routeUrl("settings/merge-tree-settings") }, ...mergeTreeSettingsNavigation] },
  ] },
  { label: "System Tables", items: [{ label: "Overview", link: routeUrl("system-tables") }, ...linkEntries(systemTableEntries)] },
  { label: "Data Lakes", items: [{ label: "Overview", link: routeUrl("datalakes") }] },
] }];
const navigationOutput = path.join(process.cwd(), "src", "generated", "reference-prototype.versions.json");
const latestNavigationOutput = path.join(process.cwd(), "src", "generated", "reference-prototype.latest.json");
fs.mkdirSync(path.dirname(navigationOutput), { recursive: true });
const registry = fs.existsSync(navigationOutput)
  ? JSON.parse(fs.readFileSync(navigationOutput, "utf8")) as ReferenceVersionRegistry
  : { schemaVersion: 1, defaultKey: "latest", versions: {} } satisfies ReferenceVersionRegistry;
if (registry.schemaVersion !== 1) throw new Error(`Unsupported reference version registry schema: ${registry.schemaVersion}`);
registry.versions[versionKey] = {
  label: process.env.REFERENCE_VERSION_LABEL ?? (versionKey === "latest" ? `Latest · ${manifest.clickhouseVersion.match(/^\d+\.\d+/)?.[0] ?? manifest.clickhouseVersion}` : versionKey),
  routePrefix,
  clickhouseVersion: manifest.clickhouseVersion,
  navigation,
};
if (versionKey === "latest") registry.defaultKey = versionKey;
fs.writeFileSync(navigationOutput, JSON.stringify(registry, null, 2) + "\n");
// The deployable Head site imports only this latest navigation. The complete
// registry is a local snapshot-production aid; archived versions load their
// own navigation from object storage at request time.
if (versionKey === "latest") {
  fs.writeFileSync(latestNavigationOutput, JSON.stringify({
    label: registry.versions[versionKey].label,
    routePrefix,
    clickhouseVersion: manifest.clickhouseVersion,
    navigation,
  }, null, 2) + "\n");
}
// Keep a standalone versioned navigation artifact next to the snapshot
// metadata. The Astro import above is only a local-build copy; deployment can
// mount this file directly from the selected snapshot/build input.
fs.writeFileSync(path.join(resolvedSnapshotRoot, "metadata", "reference-navigation.json"), JSON.stringify({
  schemaVersion: 1,
  clickhouseVersion: manifest.clickhouseVersion,
  navigation,
}, null, 2) + "\n");
fs.writeFileSync(path.join(prototypeRoot, "route-contract.json"), JSON.stringify({
  schemaVersion: 1,
  clickhouseVersion: manifest.clickhouseVersion,
  entries: routeContractEntries,
}, null, 2) + "\n");
fs.mkdirSync(settingsIndexRoot, { recursive: true });
fs.writeFileSync(path.join(settingsIndexRoot, "legacy-redirects.json"), JSON.stringify({
  schemaVersion: 1,
  clickhouseVersion: manifest.clickhouseVersion,
  redirects: routeContractEntries
    .filter((entry) => entry.disposition === "redirect" && entry.redirectTo)
    .map((entry) => ({ from: entry.route, to: entry.redirectTo })),
}, null, 2) + "\n");
writePage("index", "ClickHouse reference prototype", `Autogenerated reference documentation for ClickHouse ${manifest.clickhouseVersion}.`, [
  `This temporary reference navigation is generated from the ClickHouse ${manifest.clickhouseVersion} snapshot.`, "", "## Generated catalogs", "", `- [SQL statements](${routeUrl("statements")})`, `- [Data types](${routeUrl("data-types")})`, `- [Table engines](${routeUrl("engines/table-engines")})`, `- [Formats](${routeUrl("formats")})`, `- [Session settings](${routeUrl("settings/session-settings")})`, `- [System tables](${routeUrl("system-tables")})`,
].join("\n"));
console.log(`generate-reference-prototype: functions plus SQL, types, engines, formats, settings, system tables, and data lakes from ${manifest.clickhouseVersion}`);
