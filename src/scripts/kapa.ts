/** Nimbus-owned bootstrap for the ClickHouse Kapa Ask AI widget. */

export {};

declare global {
  interface Window {
    kapaSettings?: { user: { uniqueClientId?: string } };
    Kapa?: { open: (options: { mode: "ai" }) => void };
  }
}

const OPEN_RETRY_INTERVAL_MS = 50;
const OPEN_RETRY_LIMIT = 60;
const WIDGET_CONTAINER_ID = "kapa-widget-container";
let openRetryTimer: number | undefined;
let bodyObserver: MutationObserver | undefined;

function cookie(name: string): string | undefined {
  const prefix = `${name}=`;
  for (const value of decodeURIComponent(document.cookie).split(";")) {
    const trimmed = value.trim();
    if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
  }
  return undefined;
}

function googleAnalyticsUserId(): string | undefined {
  const parts = cookie("_ga")?.split(".").slice(-2);
  return parts?.length === 2 ? parts.join("-") : undefined;
}

function isUnsupportedIos(): boolean {
  if (!/iPad|iPhone/.test(navigator.userAgent)) return false;
  const match = navigator.userAgent.match(/OS (\d+)(?:_(\d+))?/);
  if (!match) return true;
  const major = Number.parseInt(match[1], 10);
  const minor = Number.parseInt(match[2] ?? "0", 10);
  return major < 16 || (major === 16 && minor <= 4);
}

function boot(): void {
  if (isUnsupportedIos()) return;
  window.kapaSettings = { user: { uniqueClientId: googleAnalyticsUserId() } };
}

function preserveWidgetContainer(): void {
  const runtime = document.getElementById("kapa-runtime");
  if (!runtime) throw new Error("Kapa runtime host is missing");

  const container = document.getElementById(WIDGET_CONTAINER_ID);
  if (container && container.parentElement !== runtime)
    runtime.append(container);
}

function watchWidgetContainer(): void {
  bodyObserver?.disconnect();
  preserveWidgetContainer();
  bodyObserver = new MutationObserver(preserveWidgetContainer);
  bodyObserver.observe(document.body, { childList: true });
}

function openKapa(): void {
  if (window.Kapa) {
    if (openRetryTimer !== undefined) {
      window.clearInterval(openRetryTimer);
      openRetryTimer = undefined;
    }
    window.Kapa.open({ mode: "ai" });
    return;
  }

  boot();
  if (openRetryTimer !== undefined) return;

  let attempts = 0;
  openRetryTimer = window.setInterval(() => {
    attempts += 1;
    if (window.Kapa) {
      openKapa();
    } else if (attempts >= OPEN_RETRY_LIMIT) {
      window.clearInterval(openRetryTimer);
      openRetryTimer = undefined;
    }
  }, OPEN_RETRY_INTERVAL_MS);
}

document.addEventListener(
  "pointerdown",
  (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    if (
      !(event.target as Element | null)?.closest(
        "[data-kapa-trigger][data-sidebar-tool]",
      )
    )
      return;
    openKapa();
  },
  true,
);

document.addEventListener("click", (event) => {
  const trigger = (event.target as Element | null)?.closest(
    "[data-kapa-trigger]",
  );
  if (!trigger) return;
  // Pointer activation of the sidebar control opens on pointerdown; retain
  // click for keyboard activation and non-sidebar triggers.
  if (trigger.hasAttribute("data-sidebar-tool") && event.detail > 0) return;
  event.preventDefault();
  openKapa();
});

if (document.readyState === "loading")
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      boot();
      watchWidgetContainer();
    },
    { once: true },
  );
else {
  boot();
  watchWidgetContainer();
}

document.addEventListener("astro:page-load", () => {
  boot();
  watchWidgetContainer();
});
