// Local-only static server for the reference prototype. Astro emits each page
// as a directory `index.html`; production supplies the extensionless-to-slash
// redirect, so reproduce it here for sidebar links.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "/private/tmp/reference-nimbus-preview");
const port = Number(process.env.PORT ?? 4321);
const redirectManifestPath = path.join(root, "reference-settings-index", "legacy-redirects.json");
const redirects = fs.existsSync(redirectManifestPath)
  ? new Map(JSON.parse(fs.readFileSync(redirectManifestPath, "utf8")).redirects.map(({ from, to }) => [from, to]))
  : new Map();
const contentTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const pathname = decodeURIComponent(url.pathname);
  // The preview is mounted under /docs while the reference microfrontend's
  // route contract is base-independent. Apply the same redirect manifest that
  // a deployment adapter will turn into Vercel redirects.
  const base = pathname === "/docs" || pathname.startsWith("/docs/") ? "/docs" : "";
  const contractPath = base ? pathname.slice(base.length) || "/" : pathname;
  const redirect = redirects.get(contractPath);
  if (redirect) {
    response.writeHead(308, { Location: `${base}${redirect}${url.hash}` });
    response.end();
    return;
  }
  let target = path.resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }

  fs.stat(target, (error, stats) => {
    if (error) {
      response.writeHead(404).end("Not found");
      return;
    }
    if (stats.isDirectory()) {
      // Astro emits directory index files. Serve them for both `/page` and
      // `/page/`: some embedded local browsers do not reliably follow a 308
      // response while navigating sidebar links.
      target = path.join(target, "index.html");
    }
    fs.stat(target, (fileError, fileStats) => {
      if (fileError || !fileStats.isFile()) {
        response.writeHead(404).end("Not found");
        return;
      }
      // This server exists only for rapid local iteration. Prevent the
      // embedded browser from retaining an older generated rail or client
      // bundle after a static rebuild.
      response.writeHead(200, {
        "Content-Type": contentTypes[path.extname(target)] ?? "application/octet-stream",
        "Cache-Control": "no-store",
      });
      fs.createReadStream(target).pipe(response);
    });
  });
}).listen(port, "127.0.0.1", () => {
  console.log(`Reference preview: http://localhost:${port}/docs/reference`);
});
