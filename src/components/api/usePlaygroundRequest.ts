// Owns fetch, cancellation, and response state; never persists credentials or sends on render.
import { useEffect, useRef, useState } from "react";
import {
  buildRequest,
  type PlaygroundConfig,
  type RequestState,
} from "./playground-model";

export type PlaygroundResponse = {
  status: number;
  statusText: string;
  time: number;
  body: string;
  rawBody: string;
  contentType: string;
  headers: string;
};

export function usePlaygroundRequest(
  config: PlaygroundConfig,
  activeState: RequestState,
  jsonError: string,
) {
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState<PlaygroundResponse>();
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  async function send() {
    setError("");
    try {
      if (jsonError) throw new Error(jsonError);
      const request = buildRequest(config, activeState);
      const controller = new AbortController();
      abort.current = controller;
      setSending(true);
      setResponse(undefined);
      const start = performance.now();
      const result = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        signal: controller.signal,
        credentials: "omit",
        redirect: "error",
      });
      const raw = await result.text();
      let body = raw;
      if (result.headers.get("content-type")?.includes("json") && raw)
        body = JSON.stringify(JSON.parse(raw), null, 2);
      setResponse({
        status: result.status,
        statusText: result.statusText,
        time: Math.round(performance.now() - start),
        body,
        rawBody: raw,
        contentType: result.headers.get("content-type") || "text/plain",
        headers: Array.from(result.headers)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n"),
      });
    } catch (e) {
      setError(
        (e as Error).name === "AbortError"
          ? "Request cancelled."
          : (e as Error).message,
      );
    } finally {
      setSending(false);
      abort.current = null;
    }
  }
  return {
    error,
    sending,
    response,
    send,
    cancel: () => abort.current?.abort(),
  };
}
