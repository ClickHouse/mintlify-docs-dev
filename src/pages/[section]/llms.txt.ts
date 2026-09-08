import {
  getPreparedLlmsArtifact,
  getPreparedLlmsStaticPaths,
  type PreparedLlmsReference,
} from "@cloudflare/nimbus-docs/build";

export const prerender = true;

interface Props {
  artifact: PreparedLlmsReference;
}

export async function getStaticPaths() {
  return getPreparedLlmsStaticPaths();
}

export async function GET({ props }: { props: Props }) {
  const artifact = await getPreparedLlmsArtifact(props.artifact);
  return new Response(artifact.body, {
    headers: { "Content-Type": artifact.mediaType },
  });
}
