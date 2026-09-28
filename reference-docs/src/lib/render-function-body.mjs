function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function functionAnchor(name) {
  return `function-${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
}

function field(title, value, language) {
  if (!value) return "";
  const rendered = language
    ? `<pre><code class="language-${language}">${escapeHtml(value)}</code></pre>`
    : `<div class="reference-prose">${escapeHtml(value).replaceAll("\n", "<br>")}</div>`;
  return `<section><h3>${escapeHtml(title)}</h3>${rendered}</section>`;
}

/**
 * Render a deliberately narrow and safe first body contract.  Source fields
 * are Markdown today, so this preserves their text rather than treating them
 * as trusted HTML.  Production can replace the field renderer with the shared
 * Satteri pipeline without changing snapshot shape or page routing.
 */
export function renderFunctionBody(functions) {
  return functions.map((fn) => {
    const aliases = Array.isArray(fn.aliases) ? fn.aliases : [];
    return `<article class="reference-function" id="${functionAnchor(fn.name)}">
      <h2>${escapeHtml(fn.name)}</h2>
      ${fn.introduced_in ? `<p class="introduced">Introduced in v${escapeHtml(fn.introduced_in)}</p>` : ""}
      ${field("Description", fn.description)}
      ${field("Syntax", fn.syntax, "sql")}
      ${aliases.length ? `<p><strong>Aliases:</strong> ${aliases.map(escapeHtml).join(", ")}</p>` : ""}
      ${field("Arguments", fn.arguments)}
      ${field("Returned value", fn.returned_value)}
      ${field("Examples", fn.examples, "sql")}
    </article>`;
  }).join("\n");
}
