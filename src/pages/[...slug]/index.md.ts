import {
  getPreparedMarkdownArtifact,
  getPreparedMarkdownStaticPaths,
  type PreparedMarkdownReference,
} from "@cloudflare/nimbus-docs/build";
import { absolutizeAgentMarkdownLinks } from "../../lib/agent-links";
import { withBase } from "../../lib/base";

export const prerender = true;

interface Props {
  artifact: PreparedMarkdownReference;
}

export async function getStaticPaths() {
  return (await getPreparedMarkdownStaticPaths({
    collection: "docs",
    surface: "markdown",
  })).filter(({ props }) => !props.artifact.id.startsWith("products/cloud/api-reference/"));
}

export async function GET({ props }: { props: Props }) {
  const artifact = await getPreparedMarkdownArtifact(props.artifact);
  const pagePath = withBase(artifact.id === "index" ? "/" : `/${artifact.id}/`);
  return new Response(absolutizeAgentMarkdownLinks(artifact.body, pagePath), {
    headers: { "Content-Type": artifact.mediaType },
  });
}
