import { buttonVariants } from "@/components/ui/button/variants";
// Owns endpoint-scoped request state. Fields and raw JSON intentionally keep separate drafts.
import PlaygroundOutput from "./PlaygroundOutput";
import { createPortal } from "react-dom";
import { useId, useState } from "react";
import Field from "./PlaygroundField";
import { usePlaygroundRequest } from "./usePlaygroundRequest";
import {
  authType,
  bodySchema,
  buildRequest,
  requestSample,
  resolve,
  type PlaygroundConfig,
  type RequestState,
} from "./playground-model";

function Description({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <p className="pg-description">
      {text.split(/(https?:\/\/[^\s<>]+|`[^`]+`)/g).map((part, i) =>
        part.startsWith("http") ? (
          <a key={i} href={part}>
            {part}
          </a>
        ) : part.startsWith("`") ? (
          <code key={i}>{part.slice(1, -1)}</code>
        ) : (
          part
        ),
      )}
    </p>
  );
}
function AuthField({
  name,
  label,
  value,
  onChange,
  secret = false,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  secret?: boolean;
}) {
  const id = useId();
  return (
    <div className="pg-auth-row">
      <label htmlFor={id}>
        <strong>{name}</strong> <small>string</small>
        <em>required</em>
      </label>
      <input
        id={id}
        aria-label={label}
        required
        autoComplete="off"
        type={secret ? "password" : "text"}
        placeholder={secret ? "enter password" : "enter username"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export default function Playground({ config }: { config: PlaygroundConfig }) {
  const [state, setState] = useState<RequestState>({
    server: config.document.servers?.[0]?.url.startsWith("http")
      ? config.document.servers[0].url
      : "",
    parameters: {},
    body: config.bodyExample,
    username: "",
    password: "",
    token: "",
  });
  const [language, setLanguage] = useState("cURL");
  const [mode, setMode] = useState("Fields");
  const [jsonBody, setJsonBody] = useState(
    () => JSON.stringify(config.bodyExample, null, 2) ?? "",
  );
  let activeBody = state.body;
  let jsonError = "";
  if (mode === "JSON") {
    try {
      activeBody = jsonBody.trim() ? JSON.parse(jsonBody) : undefined;
    } catch {
      jsonError = "Enter valid JSON.";
    }
  }
  const activeState = { ...state, body: activeBody };
  const { error, sending, response, send, cancel } = usePlaygroundRequest(
    config,
    activeState,
    jsonError,
  );
  const update = (part: Partial<RequestState>) =>
    setState((s) => ({ ...s, ...part }));
  let sample = "",
    setupError = "",
    auth: ReturnType<typeof authType> = "none";
  try {
    auth = authType(config);
    if (jsonError) throw new Error(jsonError);
    sample = requestSample(buildRequest(config, activeState, false), language);
  } catch (e) {
    setupError = (e as Error).message;
  }
  const schema = bodySchema(config);
  const parameters = config.parameters.map((p) => resolve(p, config.document));
  return (
    <form
      id="pg-request-form"
      className="pg-app"
      onSubmit={async (e) => {
        e.preventDefault();
        void send();
      }}
    >
      <>
        {createPortal(
          <div className="pg-request-bar pg-app">
            <div className="pg-endpoint">
              <span className={`pg-method is-${config.method.toLowerCase()}`}>
                {config.method.toUpperCase()}
              </span>
              <code>{config.path}</code>
            </div>
            {sending ? (
              <button
                className={buttonVariants({ size: "sm" })}
                type="button"
                onClick={cancel}
              >
                Cancel request
              </button>
            ) : (
              <button
                className={buttonVariants({ variant: "primary", size: "sm" })}
                type="submit"
                form="pg-request-form"
                disabled={!!setupError}
              >
                Send
              </button>
            )}
          </div>,
          document.querySelector("[data-playground-toolbar]")!,
        )}
      </>
      <div className="pg-columns">
        <div className="pg-inputs">
          <header className="pg-intro">
            <h3>{config.title}</h3>
            <div
              className="pg-description"
              dangerouslySetInnerHTML={{ __html: config.descriptionHtml ?? "" }}
            />
          </header>
          {auth !== "none" && (
            <details className="pg-panel" open>
              <summary>Authorization</summary>
              <div className="pg-panel-content">
                <Description
                  text={Object.values(
                    config.document.components?.securitySchemes ?? {},
                  )
                    .filter((s) =>
                      auth === "basic"
                        ? s.scheme === "basic"
                        : s.scheme === "bearer",
                    )
                    .map((s) => String(s.description ?? ""))
                    .filter(Boolean)
                    .join("\n")}
                />
                {auth === "basic" ? (
                  <>
                    <AuthField
                      name="Authorization.username"
                      label="Key ID"
                      value={state.username}
                      onChange={(username) => update({ username })}
                    />
                    <AuthField
                      name="Authorization.password"
                      label="Key secret"
                      secret
                      value={state.password}
                      onChange={(password) => update({ password })}
                    />
                  </>
                ) : (
                  <AuthField
                    name="Authorization"
                    label="API key"
                    secret
                    value={state.token}
                    onChange={(token) => update({ token })}
                  />
                )}
              </div>
            </details>
          )}
          {["path", "query", "header"].map(
            (location) =>
              parameters.some((p) => p.in === location) && (
                <details className="pg-panel" open key={location}>
                  <summary>
                    {location === "path"
                      ? "Path parameters"
                      : location === "query"
                        ? "Query parameters"
                        : "Headers"}
                  </summary>
                  <div className="pg-panel-content">
                    {parameters
                      .filter((p) => p.in === location)
                      .map((p) => (
                        <Field
                          key={p.name}
                          name={p.name!}
                          input={{
                            ...p.schema,
                            description: p.description ?? p.schema?.description,
                          }}
                          required={p.required || location === "path"}
                          value={state.parameters[`${location}:${p.name}`]}
                          doc={config.document}
                          onChange={(v) =>
                            update({
                              parameters: {
                                ...state.parameters,
                                [`${location}:${p.name}`]: v,
                              },
                            })
                          }
                        />
                      ))}
                  </div>
                </details>
              ),
          )}
          {schema && (
            <section className="pg-panel pg-body-panel">
              <div className="pg-section-title">
                <h3>Body</h3>
                <select
                  aria-label="Body editor"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option>Fields</option>
                  <option>JSON</option>
                </select>
              </div>
              <p className="pg-hint">
                Fields and JSON are separate drafts. The selected mode is sent.
              </p>
              {mode === "JSON" ? (
                <>
                  <textarea
                    aria-label="Request body JSON"
                    spellCheck={false}
                    value={jsonBody}
                    onChange={(e) => setJsonBody(e.target.value)}
                  />
                  {jsonError && (
                    <span role="alert" className="pg-error">
                      {jsonError}
                    </span>
                  )}
                </>
              ) : (
                <Field
                  name="Request body"
                  input={schema}
                  value={state.body}
                  required={config.operation.requestBody?.required}
                  doc={config.document}
                  onChange={(body) => update({ body })}
                />
              )}
            </section>
          )}
          <details className="pg-panel pg-server-settings" open={!state.server}>
            <summary>Server settings</summary>
            <div className="pg-panel-content">
              <label className="pg-server">
                API server URL
                <input
                  aria-label="API server URL"
                  type="url"
                  required
                  value={state.server}
                  placeholder="https://your-api-host"
                  onChange={(e) => update({ server: e.target.value })}
                />
              </label>
            </div>
          </details>
        </div>
        <PlaygroundOutput
          config={config}
          response={response}
          error={error || setupError}
          sending={sending}
          sample={sample || setupError}
          language={language}
          setLanguage={setLanguage}
        />
      </div>
    </form>
  );
}
