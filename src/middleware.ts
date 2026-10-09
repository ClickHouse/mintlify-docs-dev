import { defineMiddleware } from "astro:middleware";

// Local equivalent of the future Vercel edge rewrite. Astro middleware runs
// before its static-route resolver, unlike Vite middleware. The browser keeps
// the clean historical URL while the one head-built page handles the request.
export const onRequest = defineMiddleware((context, next) => {
  if (!import.meta.env.DEV) return next();
  const base = context.url.pathname.startsWith("/docs") ? "/docs" : "";
  const match = context.url.pathname.match(new RegExp(`^${base}/reference/(\\d+(?:[-.]\\d+)+)(?:/(.*))?/?$`));
  if (!match) return next();

  // Preserve the original release and reference-relative route for the shell
  // at render time. The browser address remains the clean historical URL.
  context.locals.archivedReference = {
    version: match[1].replace(/-/g, "."),
    path: match[2] ?? "",
  };
  const shell = new URL(`${base}/reference/version-shell`, context.url);
  return context.rewrite(shell);
});
