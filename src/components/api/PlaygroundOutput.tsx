import { layerCard, layerCardHeader } from "@/components/ui/layer-card/styles";
import { buttonVariants } from "@/components/ui/button/variants";
// Presentation only: request samples, example responses, and completed request results.
import { useState } from "react";
import PlaygroundCode from "./PlaygroundCode";
import type { PlaygroundConfig } from "./playground-model";
import type { PlaygroundResponse } from "./usePlaygroundRequest";

function Copy({ text }: { text: string }) {
  const [status, setStatus] = useState("Copy");
  return (
    <button
      className={buttonVariants({ size: "sm" })}
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setStatus("Copied");
        } catch {
          setStatus("Copy failed");
        }
      }}
      onBlur={() => setStatus("Copy")}
    >
      {status}
    </button>
  );
}
interface Props {
  config: PlaygroundConfig;
  response?: PlaygroundResponse;
  error: string;
  sending: boolean;
  sample: string;
  language: string;
  setLanguage: (language: string) => void;
}
export default function PlaygroundOutput({
  config,
  response,
  error,
  sending,
  sample,
  language,
  setLanguage,
}: Props) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const examples = (config.responses ?? []).filter(
    (r) => r.example !== undefined,
  );
  const example = examples[exampleIndex]?.example;
  const exampleText = example
    ? typeof example.value === "string" && !example.mediaType.includes("json")
      ? example.value
      : JSON.stringify(example.value, null, 2)
    : "";
  const [responseTab, setResponseTab] = useState("Body");
  const shownResponse =
    responseTab === "Headers" ? response?.headers : response?.body;
  return (
    <aside className="pg-output">
      <div aria-live="polite">
        {error && (
          <p role="alert" className="pg-error">
            {error}
          </p>
        )}
        {sending && <p role="status">Sending request…</p>}
      </div>
      {response && (
        <section
          className={`${layerCard} pg-code-card`}
          aria-label="Actual response"
        >
          <div className={`${layerCardHeader} pg-section-title`}>
            <span className={response.status < 400 ? "pg-success" : "pg-error"}>
              {response.status} — {response.statusText}
            </span>
            <small>{response.time} ms</small>
            <select
              aria-label="Response section"
              value={responseTab}
              onChange={(e) => setResponseTab(e.target.value)}
            >
              <option>Body</option>
              <option>Headers</option>
            </select>
            <button
              type="button"
              className={buttonVariants({ size: "xs" })}
              onClick={() => {
                const url = URL.createObjectURL(new Blob([response.rawBody], { type: response.contentType }));
                const link = document.createElement("a");
                link.href = url;
                link.download = `response-${response.status}.${response.contentType.includes("json") ? "json" : "txt"}`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              }}
            >
              Download
            </button>
            <Copy text={shownResponse ?? ""} />
          </div>
          <PlaygroundCode
            code={shownResponse || "(empty response)"}
            language={
              responseTab === "Body" && /^[\s]*[\[{]/.test(shownResponse ?? "")
                ? "json"
                : "text"
            }
          />
        </section>
      )}
      <section className={`${layerCard} pg-code-card`}>
        <div className={`${layerCardHeader} pg-section-title`}>
          <h3>{config.title}</h3>
          <select
            aria-label="Playground sample language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {["cURL", "JavaScript", "Python"].map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <Copy text={sample} />
        </div>
        <PlaygroundCode
          code={sample}
          language={language === "cURL" ? "bash" : language.toLowerCase()}
        />
      </section>
      {examples.length > 0 && (
        <section
          className={`${layerCard} pg-code-card`}
          aria-label="Response examples"
        >
          <div className={`${layerCardHeader} pg-section-title`}>
            <span className="pg-hint">Response example</span>
            <div
              className="pg-status-tabs"
              role="tablist"
              aria-label="Example response status"
            >
              {examples.map((r, i) => (
                <button
                  className={buttonVariants({ variant: "ghost", size: "xs" })}
                  key={r.status}
                  id={`pg-example-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === exampleIndex}
                  aria-controls="pg-example-panel"
                  tabIndex={i === exampleIndex ? 0 : -1}
                  onClick={() => setExampleIndex(i)}
                  onKeyDown={(e) => {
                    if (
                      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                        e.key,
                      )
                    )
                      return;
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? examples.length - 1
                          : (i +
                              (e.key === "ArrowRight" ? 1 : -1) +
                              examples.length) %
                            examples.length;
                    setExampleIndex(next);
                    document.getElementById(`pg-example-tab-${next}`)?.focus();
                  }}
                >
                  {r.status}
                </button>
              ))}
            </div>
            <Copy text={exampleText} />
          </div>
          <div
            id="pg-example-panel"
            role="tabpanel"
            aria-labelledby={`pg-example-tab-${exampleIndex}`}
          >
            <PlaygroundCode
              code={exampleText}
              language={example?.mediaType.includes("json") ? "json" : "text"}
            />
          </div>
        </section>
      )}
    </aside>
  );
}
