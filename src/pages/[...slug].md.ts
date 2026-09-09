/** Canonical agent-readable representation for every English documentation page. */
import {
  getPreparedMarkdownArtifact,
  getPreparedMarkdownStaticPaths,
  type PreparedMarkdownReference,
} from "@cloudflare/nimbus-docs/build";
import { prepareAgentMarkdown } from "../lib/agent-links";
import { withBase } from "../lib/base";
import { EMIT_ENGLISH } from "../content.config";

export const prerender = true;

interface Props {
  artifact: PreparedMarkdownReference;
}

export async function getStaticPaths() {
  if (!EMIT_ENGLISH) return [];
  return (await getPreparedMarkdownStaticPaths({
    collection: "docs",
    surface: "markdown",
  })).filter(({ props }) => !props.artifact.id.startsWith("products/cloud/api-reference/"));
}

export async function GET({ props }: { props: Props }) {
  const artifact = await getPreparedMarkdownArtifact(props.artifact);
  const pagePath = withBase(`/${artifact.id}/`);
  return new Response(prepareAgentMarkdown(artifact.body, pagePath), {
    headers: { "Content-Type": artifact.mediaType },
  });
}
