import { config } from "virtual:nimbus/config";
import { buildCorpusShards, englishCorpusEntries } from "../../lib/corpus";
import { EMIT_ENGLISH } from "../../content.config";
import { createHash } from "node:crypto";

export const prerender = true;

interface Props {
  body: string;
}

export async function getStaticPaths() {
  if (!EMIT_ENGLISH) return [];
  return buildCorpusShards(await englishCorpusEntries(), config.title).map((shard) => ({
    params: { corpus: shard.path },
    props: { body: shard.body },
    cacheKey: createHash("sha256").update(shard.body).digest("hex"),
  }));
}

export function GET({ props }: { props: Props }) {
  return new Response(props.body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
