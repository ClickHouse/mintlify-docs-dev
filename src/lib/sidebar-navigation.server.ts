import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import type { ConfigItem } from "./sidebar-lazy";

interface NavigationData {
  items: ConfigItem[];
  digest: string;
}

const cache = new Map<string, NavigationData>();

/** Read and parse one generated navigation tree once for the entire build. */
export function loadGeneratedNavigation(locale: string): NavigationData {
  const key = locale.toLowerCase();
  const cached = cache.get(key);
  if (cached) return cached;

  const localized = path.join(process.cwd(), "src/generated", `sidebar.items.${locale}.json`);
  const english = path.join(process.cwd(), "src/generated", "sidebar.items.json");
  const file = fs.existsSync(localized) ? localized : english;
  const source = fs.readFileSync(file, "utf8");
  const data = {
    items: JSON.parse(source) as ConfigItem[],
    digest: createHash("sha256").update(source).digest("hex"),
  };
  cache.set(key, data);
  return data;
}
