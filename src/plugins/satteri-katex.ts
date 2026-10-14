import katex from "katex";
import { defineHastPlugin, defineMdastPlugin, type HastPluginDefinition, type MdastPluginDefinition } from "satteri";

const markerProperty = "dataReferenceMath";

/**
 * Sätteri parses `$...$` and `$$...$$`, but its default HTML conversion emits
 * them as plaintext code. Mark the math nodes first, then replace only those
 * markers with KaTeX's escaped, server-rendered HTML in the HAST phase.
 */
export const katexMathMarkers: MdastPluginDefinition = defineMdastPlugin({
  name: "clickhouse:katex-math-markers",
  math(node) {
    return {
      type: "clickhouseMath",
      children: [{ type: "text", value: node.value }],
      data: { hName: "div", hProperties: { [markerProperty]: "display" } },
    } as never;
  },
  inlineMath(node) {
    return {
      type: "clickhouseMath",
      children: [{ type: "text", value: node.value }],
      data: { hName: "span", hProperties: { [markerProperty]: "inline" } },
    } as never;
  },
});

export const katexMathRenderer: HastPluginDefinition = defineHastPlugin({
  name: "clickhouse:katex-math-renderer",
  element: {
    filter: ["div", "span"],
    visit(node, ctx) {
      const mode = node.properties?.[markerProperty];
      if (mode !== "display" && mode !== "inline") return;
      return {
        type: "raw",
        value: katex.renderToString(ctx.textContent(node), {
          displayMode: mode === "display",
          throwOnError: false,
        }),
      };
    },
  },
});
