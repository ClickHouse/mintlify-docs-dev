import { useEffect, useState } from "react";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// Share the reference Code component's Shiki themes; load only playground languages.
const highlighter = createHighlighterCore({
  themes: [
    import("shiki/themes/github-light.mjs"),
    import("shiki/themes/github-dark.mjs"),
  ],
  langs: [
    import("shiki/langs/bash.mjs"),
    import("shiki/langs/javascript.mjs"),
    import("shiki/langs/python.mjs"),
    import("shiki/langs/json.mjs"),
  ],
  engine: createJavaScriptRegexEngine(),
});
export default function PlaygroundCode({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [rendered, setRendered] = useState<{
    code: string;
    language: string;
    html: string;
  }>();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    highlighter
      .then((h) => {
        const html = h.codeToHtml(code, {
          lang: language,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
        });
        if (active) {
          setRendered({ code, language, html });
          setError("");
        }
      })
      .catch((e) => {
        if (active) setError(`Code highlighting failed: ${e.message}`);
      });
    return () => {
      active = false;
    };
  }, [code, language]);
  return (
    <div className="pg-code">
      {error && <p role="alert">{error}</p>}
      {rendered?.code === code && rendered.language === language ? (
        <div dangerouslySetInnerHTML={{ __html: rendered.html }} />
      ) : (
        <pre>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
