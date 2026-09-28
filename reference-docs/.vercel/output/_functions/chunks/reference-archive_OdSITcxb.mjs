import { S as createAstro, d as maybeRenderHead, f as renderHead, p as addAttribute, s as renderSlot, u as renderTemplate, y as unescapeHTML } from "./server_D2OWSy6H.mjs";
import { t as createComponent } from "./compiler_Bc_ETuh6.mjs";
//#region src/components/ReferenceBody.astro
createAstro("https://clickhouse.com");
var $$ReferenceBody = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ReferenceBody;
	const { html } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<main class="reference-body">${unescapeHTML(html)}</main>`;
}, "/Users/sstruw/Desktop/mintlify-docs-dev-reference-prototype/reference-docs/src/components/ReferenceBody.astro", void 0);
//#endregion
//#region src/layouts/ReferenceLayout.astro
createAstro("https://clickhouse.com");
var $$ReferenceLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ReferenceLayout;
	const { title, version } = Astro.props;
	return renderTemplate`<html lang="en" data-astro-cid-dvqy4skj><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title} | ClickHouse Reference</title><meta name="description"${addAttribute(`ClickHouse ${version} reference documentation`, "content")}>${renderHead($$result)}</head><body data-astro-cid-dvqy4skj><header class="reference-header" data-astro-cid-dvqy4skj><a href="/docs/reference" data-astro-cid-dvqy4skj>ClickHouse Docs</a><span data-astro-cid-dvqy4skj>Reference${version ? ` · ${version}` : ""}</span></header>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "/Users/sstruw/Desktop/mintlify-docs-dev-reference-prototype/reference-docs/src/layouts/ReferenceLayout.astro", void 0);
//#endregion
//#region src/components/ReferenceUnavailable.astro
createAstro("https://clickhouse.com");
var $$ReferenceUnavailable = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ReferenceUnavailable;
	const { reason } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<main class="reference-unavailable" data-astro-cid-5l5y7zed><p class="eyebrow" data-astro-cid-5l5y7zed>Reference documentation</p><h1 data-astro-cid-5l5y7zed>Reference content is not available yet</h1><p data-astro-cid-5l5y7zed>${reason}</p></main>`;
}, "/Users/sstruw/Desktop/mintlify-docs-dev-reference-prototype/reference-docs/src/components/ReferenceUnavailable.astro", void 0);
//#endregion
//#region src/lib/reference-archive.mjs
var DEFAULT_PREFIX = "sites";
function trimSlashes(value) {
	return String(value ?? "").replace(/^\/+|\/+$/g, "");
}
function archiveVersion(versionSlug) {
	if (!/^\d+(?:-\d+)+$/.test(versionSlug)) return null;
	return versionSlug.replaceAll("-", ".");
}
function bodyUrl(origin, version, slug, locale = "en", prefix = DEFAULT_PREFIX) {
	const path = trimSlashes(slug).split("/").filter(Boolean);
	const key = [
		trimSlashes(prefix),
		encodeURIComponent(version),
		encodeURIComponent(locale)
	];
	key.push(...path.map(encodeURIComponent), "body.html");
	return `${origin.replace(/\/$/, "")}/${key.join("/")}`;
}
async function fetchArchivedBody({ origin, version, slug, fetchImpl = fetch }) {
	if (!origin) return { state: "unconfigured" };
	const url = bodyUrl(origin, version, slug, process.env.REFERENCE_ARCHIVE_LOCALE ?? "en", process.env.REFERENCE_ARCHIVE_R2_PREFIX ?? DEFAULT_PREFIX);
	try {
		const response = await fetchImpl(url, {
			headers: { accept: "text/html" },
			redirect: "error",
			signal: AbortSignal.timeout(5e3)
		});
		if (response.status === 404) return {
			state: "missing",
			url
		};
		if (!response.ok) return {
			state: "unavailable",
			url
		};
		return {
			state: "ready",
			html: await response.text(),
			url
		};
	} catch {
		return {
			state: "unavailable",
			url
		};
	}
}
//#endregion
export { $$ReferenceBody as a, $$ReferenceLayout as i, fetchArchivedBody as n, $$ReferenceUnavailable as r, archiveVersion as t };
