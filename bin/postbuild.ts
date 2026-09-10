// Post-build pipeline (runs as `pnpm postbuild`):
//  1. rewrite any stray site-root URLs under /docs,
//  2. generate `__redirects` next to the site,
//  3. nest the site under <outDir>/docs so asset paths equal request paths.
// Honours DOCS_OUT_DIR like astro.config.ts.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ALL_LOCALES } from "../src/lib/scope.ts";
import { localeRouteName } from "../src/util/locales.ts";

const root = process.cwd();
const outDir = path.resolve(root, process.env.DOCS_OUT_DIR ?? "dist");
const nested = path.join(outDir, "docs");
const topLevelSiteEntries = fs.existsSync(outDir)
  ? fs.readdirSync(outDir).filter((name) => name !== "__redirects" && name !== ".assetsignore")
  : [];
const alreadyNested = fs.existsSync(nested)
  && topLevelSiteEntries.length === 1
  && topLevelSiteEntries[0] === "docs";
if (alreadyNested) {
  console.log("postbuild: already nested, nothing to do");
} else {
  // 1. stray URL rebase
  execFileSync(process.execPath, [path.join(root, "bin/postbuild-rebase.ts"), outDir], { stdio: "inherit" });

  // 3. nest under /docs (everything except __redirects and .assetsignore)
  fs.mkdirSync(nested, { recursive: true });
  for (const name of fs.readdirSync(outDir)) {
    if (name === "docs" || name === "__redirects" || name === ".assetsignore") continue;
    fs.renameSync(path.join(outDir, name), path.join(nested, name));
  }
  // 2. redirects at the top level (imported by the Worker; not served as an asset)
  execFileSync(process.execPath, [path.join(root, "bin/gen-redirects.ts"), outDir], { stdio: "inherit" });
  fs.copyFileSync(path.join(root, ".assetsignore"), path.join(outDir, ".assetsignore"));
}

// Workers static assets: 25 MiB per file, 100k files per version. Agent corpora
// target 24 MiB and split recursively, while this remains a final guard for all
// generated assets. Vercel does not share the per-file limit.
if (process.env.VERCEL !== "1") {
  const limit = 25 * 1024 * 1024;
  const oversized: string[] = [];
  (function scan(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) scan(p);
      else if (fs.statSync(p).size > limit) {
        oversized.push(`${path.relative(outDir, p)} (${(fs.statSync(p).size / 1048576).toFixed(1)} MB)`);
      }
    }
  })(outDir);
  if (oversized.length) {
    console.error(`postbuild: ${oversized.length} file(s) exceed the 25 MiB Workers asset limit:\n  ${oversized.join("\n  ")}`);
    process.exitCode = 1;
  }
}

interface OutputFile {
  relativePath: string;
  bytes: number;
}

interface OutputStats {
  files: number;
  bytes: number;
}

function collectFiles(dir: string): OutputFile[] {
  const output: OutputFile[] = [];
  (function scan(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        scan(absolutePath);
      } else {
        output.push({
          relativePath: path.relative(outDir, absolutePath).split(path.sep).join("/"),
          bytes: fs.statSync(absolutePath).size,
        });
      }
    }
  })(dir);
  return output;
}

function summarize(files: OutputFile[]): OutputStats {
  return {
    files: files.length,
    bytes: files.reduce((total, file) => total + file.bytes, 0),
  };
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KiB", "MiB", "GiB"];
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / (1024 ** unit);
  return `${value.toFixed(unit === 0 ? 0 : value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[unit]}`;
}

function printTable(headers: string[], rows: string[][]): void {
  const widths = headers.map((header, column) =>
    Math.max(header.length, ...rows.map((row) => row[column]?.length ?? 0))
  );
  console.log(headers.map((header, column) => header.padEnd(widths[column])).join("  "));
  console.log(widths.map((width) => "-".repeat(width)).join("  "));
  for (const row of rows) {
    console.log(row.map((value, column) => value.padEnd(widths[column])).join("  "));
  }
}

function printOutputReport(files: OutputFile[]): void {
  const total = summarize(files);
  const imageExtensions = new Set([".avif", ".bmp", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".tif", ".tiff", ".webp"]);
  const typeBuckets = new Map<string, OutputFile[]>([
    ["HTML", []],
    ["Markdown", []],
    ["JavaScript", []],
    ["CSS", []],
    ["Images", []],
    ["Other", []],
  ]);

  for (const file of files) {
    const extension = path.extname(file.relativePath).toLowerCase();
    const type = extension === ".html" || extension === ".htm"
      ? "HTML"
      : extension === ".md" || extension === ".mdx"
        ? "Markdown"
        : extension === ".js" || extension === ".mjs" || extension === ".cjs"
          ? "JavaScript"
          : extension === ".css"
            ? "CSS"
            : imageExtensions.has(extension)
              ? "Images"
              : "Other";
    typeBuckets.get(type)!.push(file);
  }

  const localeRows: string[][] = [];
  const localeFiles = new Set<OutputFile>();
  for (const locale of ALL_LOCALES) {
    const routeName = localeRouteName(locale);
    const routePrefix = `docs/${routeName}/`;
    const assetsPrefix = `docs/_astro-${locale.toLowerCase()}/`;
    const matching = files.filter((file) =>
      file.relativePath.startsWith(routePrefix) || file.relativePath.startsWith(assetsPrefix)
    );
    if (matching.length === 0) continue;
    for (const file of matching) localeFiles.add(file);
    const routeStats = summarize(matching.filter((file) => file.relativePath.startsWith(routePrefix)));
    const assetStats = summarize(matching.filter((file) => file.relativePath.startsWith(assetsPrefix)));
    const combined = summarize(matching);
    localeRows.push([
      routeName,
      formatCount(routeStats.files),
      formatBytes(routeStats.bytes),
      formatCount(assetStats.files),
      formatBytes(assetStats.bytes),
      formatCount(combined.files),
      formatBytes(combined.bytes),
    ]);
  }
  const englishAndShared = files.filter((file) => !localeFiles.has(file));
  const englishRouteStats = summarize(englishAndShared.filter((file) =>
    file.relativePath.startsWith("docs/")
      && !file.relativePath.startsWith("docs/_astro/")
      && [".html", ".md", ".mdx"].includes(path.extname(file.relativePath).toLowerCase())
  ));
  const sharedAstroStats = summarize(englishAndShared.filter((file) => file.relativePath.startsWith("docs/_astro/")));
  const englishCombined = summarize(englishAndShared);
  localeRows.unshift([
    "en + shared",
    formatCount(englishRouteStats.files),
    formatBytes(englishRouteStats.bytes),
    formatCount(sharedAstroStats.files),
    formatBytes(sharedAstroStats.bytes),
    formatCount(englishCombined.files),
    formatBytes(englishCombined.bytes),
  ]);

  const localeAstroFiles = files.filter((file) => /^docs\/_astro-[^/]+\//.test(file.relativePath));
  const localeAstroStats = summarize(localeAstroFiles);

  console.log("\npostbuild: Vercel output report");
  console.log(`Total: ${formatCount(total.files)} files, ${formatBytes(total.bytes)} (${formatCount(total.bytes)} bytes)`);

  console.log("\nBy file type");
  printTable(
    ["Type", "Files", "Bytes"],
    [...typeBuckets].map(([type, bucket]) => {
      const stats = summarize(bucket);
      return [type, formatCount(stats.files), formatBytes(stats.bytes)];
    }),
  );

  console.log("\nBy locale (route tree plus its locale-specific _astro directory)");
  printTable(
    ["Locale", "Route files", "Route bytes", "_astro files", "_astro bytes", "Total files", "Total bytes"],
    localeRows,
  );

  console.log("\nAstro assets");
  printTable(
    ["Scope", "Files", "Bytes"],
    [
      ["Base/shared (_astro)", formatCount(sharedAstroStats.files), formatBytes(sharedAstroStats.bytes)],
      ["Locale-specific (_astro-*)", formatCount(localeAstroStats.files), formatBytes(localeAstroStats.bytes)],
      ...localeRows.slice(1).map((row) => [`${row[0]} (_astro-${row[0].toLowerCase()})`, row[3], row[4]]),
    ],
  );
}

const outputFiles = collectFiles(outDir);
printOutputReport(outputFiles);
const files = outputFiles.length;
console.log(
  process.env.VERCEL === "1"
    ? `postbuild: site nested under ${path.relative(root, nested)}; ${files} files total`
    : `postbuild: site nested under ${path.relative(root, nested)}; ${files} files total (Workers static-asset limit: 100,000)`,
);
