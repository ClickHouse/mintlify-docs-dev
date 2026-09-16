import { mount } from "@cloudflare/nimbus-docs/client";

const FEEDBACK_ENDPOINT = "https://sql-clickhouse.clickhouse.com";
const INSERT_QUERY = "INSERT INTO docs_feedback.feedback FORMAT JSONEachRow";

type Sentiment = "Positive" | "Negative";

function googleAnalyticsId(): string {
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("_ga="))
    ?.slice(4);
  const parts = cookie?.split(".").slice(-2);
  return parts?.length === 2 ? parts.join("-") : "anonymous";
}

function feedbackRow(sentiment: Sentiment, reason = "", comment = "") {
  return {
    page_url: window.location.href,
    date: new Date().toISOString().replace("T", " ").slice(0, 19),
    sentiment,
    reason,
    google_id: googleAnalyticsId(),
    comment,
  };
}

async function sendFeedback(sentiment: Sentiment, reason = "", comment = "") {
  const url = new URL(FEEDBACK_ENDPOINT);
  url.searchParams.set("query", INSERT_QUERY);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-ndjson",
      "x-clickhouse-user": "docs_feedback",
      "x-clickhouse-key": "",
    },
    body: `${JSON.stringify(feedbackRow(sentiment, reason, comment))}\n`,
  });

  if (!response.ok) {
    throw new Error(`Feedback submission failed with status ${response.status}`);
  }
}

mount("[data-ch-feedback]", (root) => {
  const positive = root.querySelector<HTMLButtonElement>("[data-ch-feedback-positive]");
  const negative = root.querySelector<HTMLButtonElement>("[data-ch-feedback-negative]");
  const form = root.querySelector<HTMLFormElement>("[data-ch-feedback-form]");
  const panel = root.querySelector<HTMLElement>("[data-popover-content]");
  const close = root.querySelector<HTMLButtonElement>("[data-ch-feedback-close]");
  const question = root.querySelector<HTMLElement>("[data-ch-feedback-question]");
  const status = root.querySelector<HTMLElement>("[data-ch-feedback-status]");
  const submit = form?.querySelector<HTMLButtonElement>("[type=submit]");
  if (!positive || !negative || !form || !panel || !close || !question || !status || !submit) {
    return () => {};
  }

  const controller = new AbortController();
  const { signal } = controller;
  let submitted = false;

  const select = (button: HTMLButtonElement) => {
    for (const candidate of [positive, negative]) {
      const selected = candidate === button;
      candidate.toggleAttribute("data-selected", selected);
      candidate.setAttribute("aria-pressed", String(selected));
    }
  };

  const finish = () => {
    submitted = true;
    positive.disabled = true;
    negative.disabled = true;
    question.textContent = root.dataset.thankYouLabel ?? "Thanks for your feedback!";
    if (panel.matches(":popover-open")) panel.hidePopover();
  };

  const reportError = () => {
    status.textContent = root.dataset.errorLabel ?? "Feedback could not be sent. Please try again.";
    positive.disabled = false;
    negative.disabled = false;
    submit.disabled = false;
  };

  positive.addEventListener("click", () => {
    if (submitted) return;
    select(positive);
    positive.disabled = true;
    negative.disabled = true;
    void sendFeedback("Positive").then(finish, reportError);
  }, { signal });

  negative.addEventListener("click", () => {
    if (!submitted) select(negative);
  }, { signal });

  close.addEventListener("click", () => panel.hidePopover(), { signal });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitted) return;
    const data = new FormData(form);
    submit.disabled = true;
    status.textContent = root.dataset.submittingLabel ?? "Sending…";
    void sendFeedback(
      "Negative",
      String(data.get("reason") ?? ""),
      String(data.get("comment") ?? ""),
    ).then(finish, reportError);
  }, { signal });

  return () => controller.abort();
});
