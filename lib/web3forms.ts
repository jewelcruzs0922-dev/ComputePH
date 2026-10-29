export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type SubmitFeedbackOptions = {
  accessKey: string;
  message: string;
  email?: string;
  botcheck?: boolean;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

export type FeedbackSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

const SAFE_SEND_ERROR =
  "We couldn't send your feedback. Please try again.";

export async function submitFeedbackToWeb3Forms({
  accessKey,
  message,
  email,
  botcheck = false,
  fetchImpl = fetch,
  timeoutMs = 12000,
}: SubmitFeedbackOptions): Promise<FeedbackSubmitResult> {
  const key = accessKey.trim();
  if (!key) {
    return {
      ok: false,
      error: "Feedback is temporarily unavailable. Please try again later.",
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: key,
        subject: "ComputePH community feedback",
        from_name: "ComputePH feedback",
        message,
        botcheck,
        ...(email ? { email } : {}),
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (response.status === 429) {
      return {
        ok: false,
        error: "Too many feedback attempts. Please try again later.",
      };
    }

    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (!response.ok) return { ok: false, error: SAFE_SEND_ERROR };
    if (
      typeof payload === "object" &&
      payload !== null &&
      "success" in payload &&
      payload.success === true
    ) {
      return { ok: true };
    }

    return { ok: false, error: SAFE_SEND_ERROR };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        ok: false,
        error: "The feedback request timed out. Please try again.",
      };
    }
    return {
      ok: false,
      error:
        "We couldn't reach the feedback service. Check your connection and try again.",
    };
  } finally {
    clearTimeout(timer);
  }
}
