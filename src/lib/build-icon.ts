import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicRoot = path.resolve(fileURLToPath(new URL("../../.remote/public-build/", import.meta.url)));
const cache = new Map<string, string>();
const mimeTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

/** Embed a checked-in public icon in the generated HTML as a data URL. */
export function inlinePublicIcon(source: string): string {
  if (source.startsWith("data:")) return source;
  if (source.startsWith("http://") || source.startsWith("https://")) {
    throw new Error(`External icon URLs are not supported: ${source}`);
  }
  if (!source.startsWith("/")) {
    throw new Error(`Public icon paths must start with a slash: ${source}`);
  }

  const cached = cache.get(source);
  if (cached) return cached;

  const pathname = decodeURIComponent(source.split(/[?#]/, 1)[0] ?? source);
  const filePath = path.resolve(publicRoot, `.${pathname}`);
  if (!filePath.startsWith(publicRoot + path.sep)) {
    throw new Error(`Icon path escapes the public directory: ${source}`);
  }

  const mimeType = mimeTypes[path.extname(filePath).toLowerCase()];
  if (!mimeType) throw new Error(`Unsupported icon format: ${source}`);
  const dataUrl = `data:${mimeType};base64,${fs.readFileSync(filePath).toString("base64")}`;
  cache.set(source, dataUrl);
  return dataUrl;
}
