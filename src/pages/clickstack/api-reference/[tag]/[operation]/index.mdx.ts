import type { APIRoute } from "astro";
import { getApiOperation, getApiOperations, renderApiOperationMarkdown } from "@/lib/openapi";
import { readScope } from "@/lib/scope";

export const prerender = true;

export function getStaticPaths() {
  if (readScope().remotePreview) return [];
  return getApiOperations("clickstack").map((page) => ({ params: { tag: page.tagSlug, operation: page.slug } }));
}

export const GET: APIRoute = async ({ params }) => new Response(
  await renderApiOperationMarkdown(getApiOperation("clickstack", params.tag!, params.operation!)),
  { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
);
