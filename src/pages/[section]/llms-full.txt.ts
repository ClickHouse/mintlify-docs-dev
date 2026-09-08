// Compatibility pointer: full section corpora are canonical at /<section>/llms.txt.
import { config } from "virtual:nimbus/config";
import { englishCorpusEntries, sectionsOf } from "../../lib/corpus";
import { withBase } from "../../lib/base";

export const prerender = true;

export async function getStaticPaths() {
  return sectionsOf(await englishCorpusEntries()).map((section) => ({ params: { section } }));
}

export async function GET({ params }: { params: { section: string } }) {
  const target = new URL(withBase(`/${params.section}/llms.txt`), config.site).href;
  const body = `# ${config.title} / ${params.section}\n\nThe full-text corpus is available at [${target}](${target}).\n`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
