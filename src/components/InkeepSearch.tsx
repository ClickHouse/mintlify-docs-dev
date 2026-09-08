import {
  InkeepModalSearch,
  type InkeepModalSearchProps,
} from "@inkeep/cxkit-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const SEARCH_TRIGGER = "[data-search-trigger]";

// These browser-facing keys are deliberately public. The staging key selects
// the legacy Mintlify preview index; all other hosts use the production index.
const STAGING_API_KEY = "d3e2792740610240ff7bcf2c2a78a33012812eb4f3e34d54";
const DEFAULT_API_KEY = "b25e5cf856ec9da60d250578b59dace8417359feeedcbc6b";
const MINTLIFY_PREVIEW_URL =
  /^https?:\/\/private-7c7dfe99\.mintlify\.(?:app|site)\/(?:docs(?:\/|(?=[?#]|$)))?/;

const topLevelTabs = ["Docs", "Changelogs", "Blogs", "Website", "GitHub"];
const docsSubareas = [
  "Get started",
  "Concepts",
  "Guides",
  "Reference",
  "Cloud",
  "ClickHouse Private",
  "Managed Postgres",
  "ClickStack",
  "Agentic Data Stack",
  "chDB",
  "Kubernetes Operator",
  "ClickPipes",
  "Connectors",
  "Language clients",
  "Ecosystem",
];
const docsSubareaRules = [
  ["get-started", "Get started"],
  ["concepts", "Concepts"],
  ["guides", "Guides"],
  ["reference", "Reference"],
  ["products/cloud", "Cloud"],
  ["products/bring-your-own-cloud", "Cloud"],
  ["products/clickhouse-private", "ClickHouse Private"],
  ["products/managed-postgres", "Managed Postgres"],
  ["products/agentic-data-stack", "Agentic Data Stack"],
  ["chdb", "chDB"],
  ["products/kubernetes-operator", "Kubernetes Operator"],
  ["clickstack", "ClickStack"],
  ["integrations/clickpipes", "ClickPipes"],
  ["integrations/connectors", "Connectors"],
  ["integrations/language-clients", "Language clients"],
  ["integrations", "Ecosystem"],
] as const;

function docsSubarea(url: string): string | null {
  const path = url
    .replace(/^https?:\/\/clickhouse\.com\/docs\//, "")
    .replace(/[?#].*$/, "");
  for (const [prefix, tab] of docsSubareaRules) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return tab;
  }
  return null;
}

function twoRowTabCss(): string {
  const list = ".ikp-ai-search-results__tab-list";
  const tab = ".ikp-ai-search-results__tab";
  const notTopLevel = topLevelTabs
    .map((name) => `:not([id$="-trigger-${name}"])`)
    .join("");
  const subarea = `${tab}${notTopLevel}`;
  const topLevel = `${tab}:not(${subarea.slice(tab.length)})`;
  const docsActive = `${list}:has(${tab}[id$="-trigger-Docs"][data-state="active"])`;
  const subareaActive = `${list}:has(${subarea}[data-state="active"])`;
  return [
    `${list} { flex-wrap: wrap !important; overflow-x: visible !important; row-gap: 0.375rem; }`,
    `${tab} { font-size: 0.8125rem !important; min-height: 1.75rem !important; padding-inline: 0.625rem !important; border-radius: 12px !important; }`,
    `${topLevel} { order: 0; }`,
    `${subarea} { order: 2; display: none !important; box-shadow: inset 0 0 0 1px currentColor !important; }`,
    `${subarea}:not([data-state="active"]) { background: transparent !important; opacity: 0.7; }`,
    `${docsActive} ${subarea}, ${subareaActive} ${subarea} { display: inline-flex !important; }`,
    `${docsActive}::before, ${subareaActive}::before { content: ""; order: 1; flex: 0 0 100%; height: 1px; margin-block: 0.125rem; background: currentColor; opacity: 0.18; }`,
  ].join("");
}

function usePreviewOrigin(url: string): string {
  if (!/(?:^|\.)vercel\.app$/.test(window.location.hostname)) return url;

  try {
    const source = new URL(url);
    if (
      source.hostname !== "clickhouse.com" ||
      !source.pathname.startsWith("/docs")
    )
      return url;
    return new URL(
      `${source.pathname}${source.search}${source.hash}`,
      window.location.origin,
    ).href;
  } catch {
    return url;
  }
}

function searchProps(): InkeepModalSearchProps {
  const initialQuery =
    new URLSearchParams(window.location.search).get("q") ?? "";
  const apiKey = /\.mintlify\.(?:app|site)$/.test(window.location.hostname)
    ? STAGING_API_KEY
    : DEFAULT_API_KEY;

  return {
    modalSettings: {
      triggerSelector: SEARCH_TRIGGER,
      shortcutKey: "k",
      defaultOpen: Boolean(initialQuery),
    },
    baseSettings: {
      apiKey,
      primaryBrandColor: "#fdff75",
      organizationDisplayName: "ClickHouse",
      transformSource: (source) => {
        let url = source.url;
        const isMintlifyPreview = MINTLIFY_PREVIEW_URL.test(url);
        if (isMintlifyPreview)
          url = url.replace(
            MINTLIFY_PREVIEW_URL,
            "https://clickhouse.com/docs/",
          );

        const tabs: string[] = [];
        if (isMintlifyPreview || /clickhouse\.com\/docs(\/|$)/.test(url)) {
          if (/\/resources\/changelogs(\/|$)/.test(url))
            tabs.push("Changelogs");
          else {
            tabs.push("Docs");
            const subarea = docsSubarea(url);
            if (subarea) tabs.push(subarea);
          }
        } else if (url.includes("github.com") && /\/issues(\/|$)/.test(url)) {
          tabs.push("GitHub");
        } else if (/\/blog(\/|$)/.test(url)) {
          tabs.push("Blogs");
        } else if (url.includes("clickhouse.com")) {
          tabs.push("Website");
        }

        return { tabs, url: usePreviewOrigin(url) };
      },
      colorMode: {
        sync: {
          target: document.documentElement,
          attributes: ["class"],
          isDarkMode: (attributes) =>
            attributes?.class?.includes("dark") ?? false,
        },
      },
      theme: {
        styles: [
          {
            key: "no-scrollbar-layout-shift",
            type: "style",
            value:
              "html body[data-scroll-locked] { padding-right: 0 !important; margin-right: 0 !important; }",
          },
          {
            key: "dark-search-overlay",
            type: "style",
            value:
              ".dark\\:bg-overlay-dark { background-color: rgba(0, 0, 0, 0.75) !important; }",
          },
          { key: "two-row-docs-tabs", type: "style", value: twoRowTabCss() },
        ],
      },
    },
    searchSettings: {
      placeholder: "Search ClickHouse docs...",
      defaultQuery: initialQuery,
      debounceTimeMs: 300,
      maxResults: 20,
      tabs: [...topLevelTabs, ...docsSubareas],
    },
  };
}

export default function InkeepSearch() {
  const [isOpen, setIsOpen] = useState(() =>
    Boolean(new URLSearchParams(window.location.search).get("q")),
  );
  const handleOpenChange = useCallback((open: boolean) => setIsOpen(open), []);

  // Astro replaces the page controls during client-side navigation. Delegate
  // from `document` so every trigger rendered for this route opens the modal.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      if (
        !(event.target as Element | null)?.closest(
          `${SEARCH_TRIGGER}[data-sidebar-tool]`,
        )
      )
        return;
      setIsOpen(true);
    };
    const handleClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest(SEARCH_TRIGGER);
      if (!trigger) return;
      // Pointer activation of the compact sidebar control is handled on
      // pointerdown so the modal starts painting before pointerup. Keep click
      // for keyboard activation, whose synthetic click has detail === 0.
      if (trigger.hasAttribute("data-sidebar-tool") && event.detail > 0) return;
      event.preventDefault();
      setIsOpen(true);
    };
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k")
        return;
      event.preventDefault();
      setIsOpen((open) => !open);
    };
    const handleBeforePreparation = () => {
      // Close the modal before route preparation so an in-flight opening
      // animation cannot carry its scroll lock into the incoming page.
      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener(
      "astro:before-preparation",
      handleBeforePreparation,
    );
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener(
        "astro:before-preparation",
        handleBeforePreparation,
      );
    };
  }, []);

  // The Inkeep configuration is sizeable. Keeping its object identity stable
  // avoids making the widget re-process the complete theme and search setup
  // whenever opening or closing the modal.
  const props = useMemo(() => searchProps(), []);
  const modalSettings = useMemo(
    () => ({
      isOpen,
      onOpenChange: handleOpenChange,
      shortcutKey: null,
      triggerSelector: "[data-inkeep-library-trigger]",
    }),
    [handleOpenChange, isOpen],
  );

  return <InkeepModalSearch {...props} modalSettings={modalSettings} />;
}
