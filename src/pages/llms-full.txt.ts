import { config } from "virtual:nimbus/config";
import { englishCorpusEntries, renderCorpusIndex, sectionsOf } from "../lib/corpus";

export const prerender = true;

export async function GET() {
  const sections = sectionsOf(await englishCorpusEntries());
  return new Response(renderCorpusIndex(config.title, sections, "", "llms.txt"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
