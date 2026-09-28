/** Serve local body-only artifacts with the same read-only contract as R2. */
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.env.REFERENCE_ARCHIVE_OUTPUT_DIR ?? "/private/tmp/reference-artifacts");
const port = Number(process.env.REFERENCE_ARCHIVE_PORT ?? "4323");
const types: Record<string, string> = { ".html": "text/html; charset=utf-8", ".json": "application/json; charset=utf-8" };

createServer((request, response) => {
  const relative = decodeURIComponent(new URL(request.url ?? "/", "http://local").pathname).replace(/^\/+/, "");
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${root}${path.sep}`) || relative.includes("..") || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404, { "access-control-allow-origin": "*" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "content-type": types[path.extname(file)] ?? "application/octet-stream",
    "access-control-allow-origin": "*",
    "cache-control": "no-store",
  });
  fs.createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`serve-reference-artifacts: http://127.0.0.1:${port} → ${root}`);
});
