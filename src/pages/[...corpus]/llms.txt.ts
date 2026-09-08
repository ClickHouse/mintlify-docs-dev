import { config } from "virtual:nimbus/config";
import { buildCorpusShards, englishCorpusEntries } from "../../lib/corpus";

export const prerender = true;

interface Props {
  body: string;
}

export async function getStaticPaths() {
  return buildCorpusShards(await englishCorpusEntries(), config.title).map((shard) => ({
    params: { corpus: shard.path },
    props: { body: shard.body },
  }));
}

export function GET({ props }: { props: Props }) {
  return new Response(props.body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
