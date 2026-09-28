/** Sidebar runtime: filter, persistence, "/" shortcut. */

import { mount } from "@cloudflare/nimbus-docs/client";

const STORAGE_KEY = "sidebar-state";

interface SidebarState {
  hash: string;
  open: Record<string, boolean>;
  scroll: number;
  /** Retain an active filter while following a result to another page. */
  filter?: string;
}

function readStoredState(): SidebarState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<SidebarState>;
    return typeof value.hash === "string" && typeof value.open === "object" && typeof value.scroll === "number"
      ? value as SidebarState
      : null;
  } catch {
    return null;
  }
}

function saveFilter(root: HTMLElement, filter: string): void {
  const hash = root.dataset.nbSidebarHash ?? "";
  if (!hash) return;
  try {
    const previous = readStoredState();
    const state: SidebarState = previous?.hash === hash
      ? previous
      : { hash, open: {}, scroll: 0 };
    state.filter = filter || undefined;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function ownedTrigger(group: HTMLElement): HTMLElement | undefined {
  return Array.from(group.querySelectorAll<HTMLElement>("[data-nb-collapsible-trigger]"))
    .find((candidate) => candidate.closest("[data-nb-sidebar-group]") === group);
}

function ownedLabel(group: HTMLElement): HTMLElement | undefined {
  return Array.from(group.querySelectorAll<HTMLElement>("[data-nb-sidebar-group-label]"))
    .find((candidate) => candidate.closest("[data-nb-sidebar-group]") === group);
}

function ownedContent(group: HTMLElement): HTMLElement | undefined {
  return Array.from(group.querySelectorAll<HTMLElement>("[data-nb-collapsible-content]"))
    .find((candidate) => candidate.closest("[data-nb-sidebar-group]") === group);
}

function groupKey(group: HTMLElement): string {
  const labels: string[] = [];
  let current: HTMLElement | null = group;
  while (current) {
    const label = ownedLabel(current)?.textContent?.trim().replace(/\s+/g, " ") ?? "";
    labels.unshift(label);
    current = current.parentElement?.closest<HTMLElement>("[data-nb-sidebar-group]") ?? null;
  }
  return labels.join("\u001f");
}

export function initSidebar(root: HTMLElement): () => void {
  const teardowns: Array<() => void> = [];
  const persist = root.hasAttribute("data-nb-sidebar-persist");

  const filterTeardown = initFilter(root);
  if (filterTeardown) teardowns.push(filterTeardown);

  if (persist) {
    const persistTeardown = initPersistence(root);
    if (persistTeardown) teardowns.push(persistTeardown);
  }

  return () => teardowns.forEach((t) => t());
}

// ---------------------------------------------------------------------------
// Filter
// ---------------------------------------------------------------------------

function initFilter(root: HTMLElement): (() => void) | null {
  const input = root.querySelector<HTMLInputElement>("[data-nb-sidebar-filter-input]");
  // SidebarFilter sits above the scroll container that owns Sidebar. Resolve
  // it from the enclosing navigation region so the desktop rail and the
  // cloned mobile drawer share the same binding path.
  const inputElement =
    input ?? root.closest("nav")?.querySelector<HTMLInputElement>("[data-nb-sidebar-filter-input]") ?? null;
  if (!inputElement) return null;

  function handleInput() {
    const rawQuery = inputElement!.value.trim();
    const query = rawQuery.toLowerCase();
    saveFilter(root, rawQuery);
    if (!query) {
      resetFilter(root);
      return;
    }
    applyFilter(root, query);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      inputElement!.value = "";
      handleInput();
      inputElement!.blur();
    }
  }

  inputElement.addEventListener("input", handleInput);
  inputElement.addEventListener("keydown", handleKeydown);

  // Astro replaces the page while following a filtered result. Restore the
  // query on the replacement rail so the user stays in the same navigation
  // context instead of being dropped into an unfiltered tree.
  const storedFilter = readStoredState();
  const savedFilter = storedFilter && storedFilter.hash === root.dataset.nbSidebarHash
    ? storedFilter.filter
    : undefined;
  if (savedFilter) {
    inputElement.value = savedFilter;
    handleInput();
  }

  return () => {
    inputElement.removeEventListener("input", handleInput);
    inputElement.removeEventListener("keydown", handleKeydown);
    // Teardown also runs during Astro route swaps. A persisted reference
    // explorer is deliberately retained through those swaps, so mutating its
    // disclosure state here would make all of its top-level entries jump.
    // `resetFilter` is reserved for an explicit user clear instead.
  };
}

function collapseAllGroups(root: HTMLElement): void {
  // Clearing a filter returns the explorer to a compact starting point. Do
  // not retain the collection of branches that were opened only to reveal
  // matches (or an active branch that was opened by a route transition).
  // Descendants must close before their parents; a collapsed parent marks its
  // panel inert, which would otherwise prevent a nested trigger from closing.
  Array.from(root.querySelectorAll<HTMLElement>("[data-nb-sidebar-group]"))
    .reverse()
    .forEach((group) => {
      const trigger = ownedTrigger(group);
      // Section headings such as "Reference" use the same container markup
      // but intentionally have no trigger. They are the always-visible
      // wrapper around the actual expandable tabs, not a tab themselves.
      if (!trigger) return;
      if (trigger?.getAttribute("data-nb-state") === "open") trigger.click();
      // Active pages initially open their ancestors on the server. Clearing a
      // filter is an explicit request to leave that state, so enforce the
      // collapsed DOM state after the disclosure callback has run.
      group.setAttribute("data-nb-default-open", "false");
      trigger.setAttribute("data-nb-state", "closed");
      trigger.setAttribute("aria-expanded", "false");
      ownedLabel(group)?.setAttribute("data-nb-state", "closed");
      const content = ownedContent(group);
      content?.setAttribute("data-nb-state", "closed");
      content?.toggleAttribute("inert", true);
      group.removeAttribute("data-nb-opened-by-filter");
    });
}

function resetFilter(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("[data-nb-sidebar-hidden]").forEach((el) => {
    el.removeAttribute("data-nb-sidebar-hidden");
  });
  collapseAllGroups(root);
  // Disclosure bindings and the cloned mobile rail can finish their own
  // updates later in this event turn. Make the explicit reset win after they
  // have settled.
  requestAnimationFrame(() => {
    if (root.isConnected) collapseAllGroups(root);
  });
}

function applyFilter(root: HTMLElement, query: string): void {
  const links = root.querySelectorAll<HTMLElement>("[data-nb-sidebar-link]");
  const groups = root.querySelectorAll<HTMLElement>("[data-nb-sidebar-group]");

  links.forEach((link) => link.setAttribute("data-nb-sidebar-hidden", ""));
  groups.forEach((group) => group.setAttribute("data-nb-sidebar-hidden", ""));

  links.forEach((link) => {
    const text = link.textContent?.toLowerCase() ?? "";
    if (!text.includes(query)) return;
    link.removeAttribute("data-nb-sidebar-hidden");
    revealAncestors(link, root);
  });

  groups.forEach((group) => {
    const label = group.querySelector("[data-nb-sidebar-group-label]");
    const text = label?.textContent?.toLowerCase() ?? "";
    if (!text.includes(query)) return;
    group.removeAttribute("data-nb-sidebar-hidden");
    openGroup(group);
    group.querySelectorAll<HTMLElement>("[data-nb-sidebar-link], [data-nb-sidebar-group]")
      .forEach((child) => child.removeAttribute("data-nb-sidebar-hidden"));
  });
}

function revealAncestors(el: HTMLElement, scope: Element): void {
  let parent: HTMLElement | null = el.parentElement;
  while (parent && parent !== scope) {
    if (parent.hasAttribute("data-nb-sidebar-group")) {
      parent.removeAttribute("data-nb-sidebar-hidden");
      openGroup(parent);
    }
    parent = parent.parentElement;
  }
}

function openGroup(group: HTMLElement): void {
  const trigger = ownedTrigger(group);
  if (!trigger) return;
  if (trigger.getAttribute("data-nb-state") === "open") return;
  group.setAttribute("data-nb-opened-by-filter", "");
  trigger.click();
}

function normalizePagePath(value: string): string {
  try {
    return new URL(value, window.location.origin).pathname.replace(/\/+$/, "") || "/";
  } catch {
    return value.replace(/\/+$/, "") || "/";
  }
}

/**
 * A snapshot reference rail is preserved across Astro route swaps to avoid
 * rebuilding its expanded branches (which visibly moves top-level rows).
 * Keep its lightweight active marker current without changing disclosure
 * state or the tree's dimensions.
 */
function syncPersistedSidebarCurrentPage(root: HTMLElement): void {
  const currentPath = normalizePagePath(window.location.pathname);
  const links = root.querySelectorAll<HTMLAnchorElement>(
    "[data-nb-sidebar-link], [data-nb-sidebar-group-landing] > a",
  );
  links.forEach((link) => {
    const current = normalizePagePath(link.href) === currentPath;
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");

    const landing = link.closest<HTMLElement>("[data-nb-sidebar-group-landing]");
    if (landing) {
      landing.classList.toggle("bg-accent", current);
      landing.classList.toggle("text-foreground", current);
      landing.classList.toggle("font-semibold", current);
    }
  });

  root.querySelectorAll<HTMLElement>("[data-nb-sidebar-group]").forEach((group) => {
    const hasCurrent = Boolean(group.querySelector("[aria-current='page']"));
    ownedLabel(group)?.classList.toggle("is-active", hasCurrent);
  });
}

// ---------------------------------------------------------------------------
// Persistence (open state + scroll)
// ---------------------------------------------------------------------------

function initPersistence(root: HTMLElement): (() => void) | null {
  // The fixed <aside> clips overflow; the nested navigation pane owns the
  // actual scrollbar. Persist that pane so its position survives route swaps.
  const scrollHost: HTMLElement =
    root.closest<HTMLElement>(".ch-sidebar-scroll") ??
    root.closest<HTMLElement>("aside") ??
    root;
  const hash = root.dataset.nbSidebarHash ?? "";

  function preserveDisclosureDefault(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const trigger = target.closest<HTMLElement>("[data-nb-collapsible-trigger]");
    const group = trigger?.closest<HTMLElement>("[data-nb-sidebar-group]");
    if (!trigger || !group || !root.contains(group)) return;

    // Nimbus remounts disclosure controls after an Astro navigation. Preserve
    // the user's selection as their new default so a persisted tree does not
    // silently collapse the branch that contains the destination page.
    requestAnimationFrame(() => {
      if (!group.isConnected) return;
      group.setAttribute(
        "data-nb-default-open",
        trigger.getAttribute("data-nb-state") === "open" ? "true" : "false",
      );
    });
  }

  function handleLandingPageClick(event: MouseEvent): void {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>("[data-nb-sidebar-group-landing] > a");
    if (!link || !root.contains(link) || link.target === "_blank") return;

    // Selecting a group's landing page also selects that group. Open it before
    // Astro captures disclosure state for the route swap; unrelated groups
    // retain the exact state chosen by the user.
    const group = link.closest<HTMLElement>("[data-nb-sidebar-group]");
    const trigger = group && ownedTrigger(group);
    if (trigger?.getAttribute("data-nb-state") === "closed") trigger.click();
  }

  root.addEventListener("click", handleLandingPageClick);
  root.addEventListener("click", preserveDisclosureDefault);

  function readState(): SidebarState {
    const groups = root.querySelectorAll<HTMLElement>("[data-nb-sidebar-group]");
    const open: Record<string, boolean> = {};
    groups.forEach((group) => {
      const trigger = ownedTrigger(group);
      // Fixed section headings have no disclosure trigger and always remain
      // open. Recording them as open also repairs state written by older code.
      open[groupKey(group)] = !trigger || trigger.getAttribute("data-nb-state") === "open";
    });
    const previous = readStoredState();
    return {
      hash,
      open,
      scroll: scrollHost.scrollTop,
      filter: previous?.hash === hash ? previous.filter : undefined,
    };
  }

  function save() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(readState()));
    } catch {}
  }

  // Observe the whole tree so disclosures inserted by lazy navigation
  // fragments are persisted too.
  const observer = new MutationObserver(save);
  observer.observe(root, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-nb-state"],
  });

  function handleVisibility() {
    if (document.visibilityState === "hidden") save();
  }
  document.addEventListener("visibilitychange", handleVisibility);
  document.addEventListener("astro:before-swap", save);
  window.addEventListener("pagehide", save);

  let raf = 0;
  function handleScroll() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(save);
  }
  scrollHost.addEventListener("scroll", handleScroll);

  return () => {
    observer.disconnect();
    root.removeEventListener("click", handleLandingPageClick);
    root.removeEventListener("click", preserveDisclosureDefault);
    document.removeEventListener("visibilitychange", handleVisibility);
    document.removeEventListener("astro:before-swap", save);
    window.removeEventListener("pagehide", save);
    scrollHost.removeEventListener("scroll", handleScroll);
    cancelAnimationFrame(raf);
  };
}

// ---------------------------------------------------------------------------
// Global `/` shortcut — bound once at module load
// ---------------------------------------------------------------------------

(function bindFilterShortcut() {
  if (document.documentElement.hasAttribute("data-nb-sidebar-shortcut-bound")) return;
  document.documentElement.setAttribute("data-nb-sidebar-shortcut-bound", "");

  document.addEventListener("keydown", (e) => {
    if (e.key !== "/") return;
    const active = document.activeElement as HTMLElement | null;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable)
    ) {
      return;
    }
    const desktopInput = document.querySelector<HTMLInputElement>(
      "[data-nb-sidebar-persist] ~ * [data-nb-sidebar-filter-input], [data-nb-desktop-sidebar] [data-nb-sidebar-filter-input]",
    );
    if (!desktopInput) return;
    e.preventDefault();
    desktopInput.focus();
  });
})();

mount("[data-nb-sidebar]", initSidebar);

if (!document.documentElement.hasAttribute("data-nb-sidebar-current-bound")) {
  document.documentElement.setAttribute("data-nb-sidebar-current-bound", "");
  const sync = () => document
    .querySelectorAll<HTMLElement>("[data-nb-sidebar-persist]")
    .forEach(syncPersistedSidebarCurrentPage);
  document.addEventListener("astro:after-swap", sync);
  document.addEventListener("astro:page-load", sync);
  sync();
}
