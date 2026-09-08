import { getPreparedLlmsArtifact } from "@cloudflare/nimbus-docs/build";
import { prepareAgentMarkdown } from "../lib/agent-links";

export const prerender = true;

export async function GET() {
  const artifact = await getPreparedLlmsArtifact({ scope: "site", surface: "full" });
  return new Response(prepareAgentMarkdown(artifact.body), {
    headers: { "Content-Type": artifact.mediaType },
  });
}
