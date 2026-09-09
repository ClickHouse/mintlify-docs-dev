import type { APIRoute } from "astro";
import { getApiOperation, getApiOperations, renderApiOperationMarkdown } from "@/lib/openapi";
import { readScope } from "@/lib/scope";
import { prepareAgentMarkdown } from "@/lib/agent-links";

export const prerender = true;

export function getStaticPaths() {
  if (readScope().remotePreview) return [];
  return getApiOperations("clickstack").map((page) => ({ params: { tag: page.tagSlug, operation: page.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const page = getApiOperation("clickstack", params.tag!, params.operation!);
  const markdown = await renderApiOperationMarkdown(page);
  return new Response(prepareAgentMarkdown(markdown, `/docs/${page.route}/`), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
