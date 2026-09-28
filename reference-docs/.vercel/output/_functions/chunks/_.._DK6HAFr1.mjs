import { r as __exportAll } from "./rolldown-runtime_BMI-E3GI.mjs";
import { S as createAstro, i as renderComponent, u as renderTemplate } from "./server_D2OWSy6H.mjs";
import { t as createComponent } from "./compiler_Bc_ETuh6.mjs";
import { a as $$ReferenceBody, i as $$ReferenceLayout, n as fetchArchivedBody, r as $$ReferenceUnavailable, t as archiveVersion } from "./reference-archive_OdSITcxb.mjs";
//#region src/pages/reference/[version]/[...slug].astro
var ____slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Component,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
createAstro("https://clickhouse.com");
var $$Component = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Component;
	const version = archiveVersion(Astro2.params.version);
	if (!version) Astro2.response.status = 404;
	const result = version ? await fetchArchivedBody({
		origin: void 0,
		version,
		slug: Astro2.params.slug
	}) : { state: "missing" };
	const reason = result.state === "unconfigured" ? "The archived-reference R2 origin has not been configured for this deployment." : result.state === "missing" ? "This page does not exist in the selected release archive." : "The archived reference content could not be reached. Please try again shortly.";
	if (result.state !== "ready") Astro2.response.status = result.state === "missing" ? 404 : 503;
	Astro2.response.headers.set("cache-control", result.state === "ready" ? "public, s-maxage=60, stale-while-revalidate=300" : "no-store");
	return renderTemplate`${renderComponent($$result, "ReferenceLayout", $$ReferenceLayout, {
		"title": "ClickHouse Reference",
		"version": version ?? "unknown"
	}, { "default": ($$result2) => renderTemplate`${result.state === "ready" ? renderTemplate`${renderComponent($$result2, "ReferenceBody", $$ReferenceBody, { "html": result.html })}` : renderTemplate`${renderComponent($$result2, "ReferenceUnavailable", $$ReferenceUnavailable, { "reason": reason })}`}` })}`;
}, "/Users/sstruw/Desktop/mintlify-docs-dev-reference-prototype/reference-docs/src/pages/reference/[version]/[...slug].astro", void 0);
var $$file = "/Users/sstruw/Desktop/mintlify-docs-dev-reference-prototype/reference-docs/src/pages/reference/[version]/[...slug].astro";
var $$url = "/docs/reference/[version]/[...slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/reference/[version]/[...slug]@_@astro
var page = () => ____slug__exports;
//#endregion
export { page };
