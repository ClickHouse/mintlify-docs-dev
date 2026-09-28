const DEFAULT_PREFIX = "sites";

function trimSlashes(value) {
  return String(value ?? "").replace(/^\/+|\/+$/g, "");
}

export function archiveVersion(versionSlug) {
  if (!/^\d+(?:-\d+)+$/.test(versionSlug)) return null;
  return versionSlug.replaceAll("-", ".");
}

export function bodyUrl(origin, version, slug, locale = "en", prefix = DEFAULT_PREFIX) {
  const path = trimSlashes(slug).split("/").filter(Boolean);
  const key = [trimSlashes(prefix), encodeURIComponent(version), encodeURIComponent(locale)];
  key.push(...path.map(encodeURIComponent), "body.html");
  return `${origin.replace(/\/$/, "")}/${key.join("/")}`;
}

export async function fetchArchivedBody({ origin, version, slug, fetchImpl = fetch }) {
  if (!origin) return { state: "unconfigured" };
  const url = bodyUrl(origin, version, slug, process.env.REFERENCE_ARCHIVE_LOCALE ?? "en", process.env.REFERENCE_ARCHIVE_R2_PREFIX ?? DEFAULT_PREFIX);
  try {
    const response = await fetchImpl(url, {
      headers: { accept: "text/html" },
      redirect: "error",
      signal: AbortSignal.timeout(5_000),
    });
    if (response.status === 404) return { state: "missing", url };
    if (!response.ok) return { state: "unavailable", url };
    return { state: "ready", html: await response.text(), url };
  } catch {
    return { state: "unavailable", url };
  }
}
