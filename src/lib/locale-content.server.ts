import fs from "node:fs";
import path from "node:path";

/** Content ids that have an authored translation for one locale. */
export function translatedPageIds(locale: string, sections: readonly string[]): Set<string> {
  const ids = new Set<string>();
  const localeRoot = path.join(process.cwd(), locale);
  const visit = (directory: string): void => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.mdx?$/.test(entry.name)) {
        const relative = path.relative(localeRoot, file).replaceAll(path.sep, "/");
        ids.add(relative.replace(/\.mdx?$/, "").replace(/\/index$/, ""));
      }
    }
  };
  for (const section of sections) visit(path.join(localeRoot, section));
  return ids;
}
