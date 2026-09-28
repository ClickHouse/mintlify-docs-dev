import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import { microfrontends } from "@vercel/microfrontends/experimental/vite";

export default defineConfig({
  site: "https://clickhouse.com",
  base: "/docs",
  // Head pages are prerendered during the deployment build. Archived releases
  // use a small request-time route, so one deployment can serve every release
  // without adding them to the build graph.
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [microfrontends()],
  },
});
