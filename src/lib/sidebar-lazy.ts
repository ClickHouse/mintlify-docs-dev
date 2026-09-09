/**
 * Lazy sidebar groups. Collapsed groups without the active page render as a
 * placeholder that fetches its children from a prebuilt HTML fragment
 * (`/nav/<key>/`) on first expand; without this every page carries the
 * whole section tree twice (desktop rail + mobile drawer), ~1.2 MB.
 *
 * Keys are label paths below the tab level, so the fragment route (built from
 * the generated config tree) and the page rail (Nimbus's rendered tree, whose
 * top level is already the active tab's children) agree.
 */
import type { SidebarItem } from "@cloudflare/nimbus-docs/types";
import { withBase } from "./base";

/** Groups with fewer children than this are rendered inline even when collapsed. */
export const LAZY_MIN_CHILDREN = 6;

export const TAB_LABELS = new Set(["Home", "Database", "Solutions", "Integrations", "Resources"]);

export type ConfigItem =
  | { label: string; link: string; badge?: import("@cloudflare/nimbus-docs/types").SidebarBadge; icon?: string; hidden?: boolean }
  | { label: string; items: ConfigItem[]; collapsed?: boolean; segment?: string; landing?: string; icon?: string };

export function slugifyLabel(label: string): string {
  return label
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "group";
}

/** Deduplicate sibling keys deterministically (same order on both sides). */
function siblingKeys(labels: string[]): string[] {
  const seen = new Map<string, number>();
  return labels.map((l) => {
    const base = slugifyLabel(l);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  });
}

export type LazyGroup = { key: string; label: string; items: ConfigItem[]; path: string[] };

type ConfigGroup = Extract<ConfigItem, { items: ConfigItem[] }>;
type NavigationLocation = {
  tabIndex: number;
  railItems: ConfigItem[];
  railPath: string[];
};
type NavigationIndex = {
  locations: Map<string, NavigationLocation>;
  tabs: ConfigGroup[];
  firstLinks: string[];
};

const navigationIndexes = new WeakMap<ConfigItem[], NavigationIndex>();
const normPath = (value: string): string => value.replace(/\/+$/, "") || "/";

function internalLinks(nodes: ConfigItem[]): string[] {
  const links: string[] = [];
  for (const node of nodes) {
    if ("items" in node) links.push(...internalLinks(node.items));
    else if (!/^(https?:)?\/\//.test(node.link)) links.push(normPath(withBase(node.link)));
  }
  return links;
}

/** Index every page's rail selection once instead of rescanning the tree per page. */
function navigationIndex(items: ConfigItem[]): NavigationIndex {
  const cached = navigationIndexes.get(items);
  if (cached) return cached;

  const tabs = items.filter((item): item is ConfigGroup => "items" in item);
  const locations = new Map<string, NavigationLocation>();
  tabs.forEach((tab, tabIndex) => {
    const tabLocation = { tabIndex, railItems: tab.items, railPath: [] };
    for (const link of internalLinks(tab.items)) locations.set(link, tabLocation);

    const topGroups = tab.items.filter((item): item is ConfigGroup => "items" in item);
    const topKeys = siblingKeys(topGroups.map((group) => group.label));
    topGroups.forEach((topGroup, topIndex) => {
      const topLocation = {
        tabIndex,
        railItems: topGroup.items,
        railPath: [topKeys[topIndex]],
      };
      for (const link of internalLinks(topGroup.items)) locations.set(link, topLocation);

      if (tab.label !== "Solutions") return;
      const productGroups = topGroup.items.filter((item): item is ConfigGroup => "items" in item);
      const productKeys = siblingKeys(productGroups.map((group) => group.label));
      productGroups.forEach((productGroup, productIndex) => {
        const productLocation = {
          tabIndex,
          railItems: productGroup.items,
          railPath: [topKeys[topIndex], productKeys[productIndex]],
        };
        for (const link of internalLinks(productGroup.items)) locations.set(link, productLocation);
      });
    });
  });

  const index = {
    locations,
    tabs,
    firstLinks: tabs.map((tab) => internalLinks(tab.items)[0] ?? "/"),
  };
  navigationIndexes.set(items, index);
  return index;
}

/** Every group in the config tree with its fragment key. Tabs are skipped. */
export function collectGroups(items: ConfigItem[], path: string[] = [], out: LazyGroup[] = [], depth = 0): LazyGroup[] {
  const groups = items.filter((i): i is Extract<ConfigItem, { items: ConfigItem[] }> => "items" in i);
  const keys = siblingKeys(groups.map((g) => g.label));
  groups.forEach((g, idx) => {
    // The generator always emits the tabs at the top level (labels are
    // translated in locale trees, so detection is structural, not by label).
    const isTab = depth === 0;
    const nextPath = isTab ? path : [...path, keys[idx]];
    if (!isTab) out.push({ key: nextPath.join("/"), label: g.label, items: g.items, path: nextPath });
    collectGroups(g.items, nextPath, out, depth + 1);
  });
  return out;
}

/** Config items -> the rendered SidebarItem shape the UI components take. */
export function toRendered(items: ConfigItem[], path: string[]): SidebarItem[] {
  const groups = items.filter((i): i is Extract<ConfigItem, { items: ConfigItem[] }> => "items" in i);
  const keys = siblingKeys(groups.map((g) => g.label));
  let gi = 0;
  return items.flatMap((item, order) => {
    if ("items" in item) {
      const key = [...path, keys[gi++]].join("/");
      const group = {
        type: "group" as const,
        label: item.label,
        order,
        collapsed: item.collapsed ?? true,
        children: toRendered(item.items, key.split("/")),
        indexHref: item.landing ? withBase(item.landing) : undefined,
        segment: item.segment,
        icon: item.icon,
      } as SidebarItem & { _lazyKey?: string };
      group._lazyKey = key;
      return [group];
    }
    if (item.hidden) return [];
    const href = /^(https?:)?\/\//.test(item.link) ? item.link : withBase(item.link);
    return [
      /^(https?:)?\/\//.test(item.link)
        ? ({ type: "external", label: item.label, href, order, badge: item.badge, icon: item.icon } as SidebarItem)
        : ({ type: "link", label: item.label, href, order, badge: item.badge, icon: item.icon } as SidebarItem),
    ];
  });
}

/** Annotate Nimbus's rendered tree with the same keys (rail side). */
export function assignLazyKeys<T extends SidebarItem>(items: T[], path: string[] = []): T[] {
  const groups = items.filter((i) => i.type === "group") as Array<Extract<SidebarItem, { type: "group" }>>;
  const keys = siblingKeys(groups.map((g) => g.label));
  let gi = 0;
  return items.map((item) => {
    if (item.type !== "group") return item;
    const isTab = path.length === 0 && TAB_LABELS.has(item.label);
    const key = isTab ? [] : [...path, keys[gi]];
    gi++;
    const next = { ...item, children: assignLazyKeys(item.children, key) } as T & { _lazyKey?: string };
    if (!isTab) next._lazyKey = key.join("/");
    return next;
  });
}

/**
 * Rail built directly from the generated config tree, scoped to the active
 * top-navigation menu entry rather than the whole tab. For example, pages in
 * `Solutions > ClickHouse Cloud` receive the Cloud rail, never the Managed
 * Postgres, ClickStack, or other Solutions trees. `keyPrefix` namespaces the
 * lazy fragments (`/nav/<locale>/...`).
 */
export function buildRailFromConfig(items: ConfigItem[], currentPath: string, keyPrefix: string[] = []): SidebarItem[] {
  const target = normPath(currentPath);
  const index = navigationIndex(items);
  const location = index.locations.get(target);
  const railItems = location?.railItems ?? index.tabs[0]?.items;
  if (!railItems) return [];
  const railPath = [...keyPrefix, ...(location?.railPath ?? [])];

  const rendered = toRendered(railItems, railPath);
  const mark = (nodes: SidebarItem[]): boolean => {
    let any = false;
    for (const n of nodes) {
      if (n.type === "link") {
        if (normPath(n.href) === target) { (n as { isCurrent?: boolean }).isCurrent = true; any = true; }
      } else if (n.type === "group") {
        const hit = mark(n.children);
        // SidebarGroup uses the active path for the initial server-rendered
        // state. Do not overwrite the authored collapsed value here.
        if (hit) any = true;
      }
    }
    return any;
  };
  mark(rendered);
  return rendered;
}

/** Top-level sections (tabs) for the header, from the generated config tree. */
export function sectionsFromConfig(items: ConfigItem[], currentPath: string): Array<{ label: string; href: string; isActive: boolean }> {
  const target = normPath(currentPath);
  const index = navigationIndex(items);
  const activeTab = index.locations.get(target)?.tabIndex ?? -1;
  return index.tabs.map((tab, tabIndex) => ({
    label: tab.label,
    href: index.firstLinks[tabIndex],
    isActive: tabIndex === activeTab,
  }));
}
