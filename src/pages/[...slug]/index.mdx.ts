import {
  getPreparedMarkdownArtifact,
  getPreparedMarkdownStaticPaths,
  type PreparedMarkdownReference,
} from "@cloudflare/nimbus-docs/build";

export const prerender = true;

interface Props {
  artifact: PreparedMarkdownReference;
}

export async function getStaticPaths() {
  return (await getPreparedMarkdownStaticPaths({
    collection: "docs",
    surface: "source",
  })).filter(({ props }) => !props.artifact.id.startsWith("products/cloud/api-reference/"));
}

export async function GET({ props }: { props: Props }) {
  const artifact = await getPreparedMarkdownArtifact(props.artifact);
  return new Response(artifact.body, {
    headers: { "Content-Type": artifact.mediaType },
  });
}
