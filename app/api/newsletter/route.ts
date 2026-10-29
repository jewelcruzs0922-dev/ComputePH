import { validateEmail } from "@/lib/forms";
import { getClientIp, rateLimit } from "@/lib/rateLimit";
import { SITE_URL } from "@/lib/site";

const BREVO_DOI_ENDPOINT =
  "https://api.brevo.com/v3/contacts/doubleOptinConfirmation";
const RATE_LIMIT = 8;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 8192;

const CONFIRMATION_MESSAGE =
  "Check your inbox to confirm your subscription to the Money Brief.";
const ACCEPTED_MESSAGE =
  "If this email needs confirmation, check your inbox for the next step.";
const UNAVAILABLE_MESSAGE =
  "Newsletter signup is temporarily unavailable. Please try again later.";

type BrevoConfig = {
  apiKey: string;
  listId: number;
  templateId: number;
  redirectUrl: string;
};

function json(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {},
): Response {
  return Response.json(body, {
    status: init.status ?? 200,
    headers: {
      "Cache-Control": "no-store",
      ...init.headers,
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getBrevoConfig(): BrevoConfig | null {
  const apiKey = process.env.BREVO_API_KEY?.trim() ?? "";
  const listId = Number(process.env.BREVO_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const redirectRaw =
    process.env.BREVO_DOI_REDIRECT_URL?.trim() || `${SITE_URL}/#newsletter`;

  let redirectUrl: string;
  try {
    const parsed = new URL(redirectRaw);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    redirectUrl = parsed.toString();
  } catch {
    return null;
  }

  if (
    !apiKey ||
    !Number.isSafeInteger(listId) ||
    listId <= 0 ||
    !Number.isSafeInteger(templateId) ||
    templateId <= 0
  ) {
    return null;
  }

  return { apiKey, listId, templateId, redirectUrl };
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

async function readBodyWithLimit(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; text: string } | { ok: false }> {
  const body = request.body;
  if (!body) return { ok: true, text: "" };

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        return { ok: false };
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true, text: new TextDecoder().decode(merged) };
}

export async function POST(request: Request): Promise<Response> {
  if (!sameOrigin(request)) {
    return json(
      { ok: false, error: "Request rejected." },
      { status: 403 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json(
      { ok: false, error: "Request is too large." },
      { status: 413 },
    );
  }

  const limit = rateLimit(
    `newsletter:${getClientIp(request)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS,
  );
  if (!limit.ok) {
    return json(
      {
        ok: false,
        error: "Too many signup attempts. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    const rawBody = await readBodyWithLimit(request, MAX_BODY_BYTES);
    if (!rawBody.ok) {
      return json({ ok: false, error: "Request is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody.text);
  } catch {
    return json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (!isRecord(body)) {
    return json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json(
      { ok: true, status: "accepted", message: ACCEPTED_MESSAGE },
      { status: 202 },
    );
  }

  if (body.consent !== true) {
    return json(
      {
        ok: false,
        error: "Please agree to receive the ComputePH Money Brief.",
      },
      { status: 400 },
    );
  }

  const email = validateEmail(body.email);
  if (!email.ok) {
    return json({ ok: false, error: email.error }, { status: 400 });
  }

  const config = getBrevoConfig();
  if (!config) {
    return json(
      { ok: false, error: UNAVAILABLE_MESSAGE },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const brevoResponse = await fetch(BREVO_DOI_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        email: email.email,
        includeListIds: [config.listId],
        templateId: config.templateId,
        redirectionUrl: config.redirectUrl,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (brevoResponse.ok) {
      return json(
        {
          ok: true,
          status: "confirmation_sent",
          message: CONFIRMATION_MESSAGE,
        },
        { status: 202 },
      );
    }

    let providerBody: unknown = null;
    try {
      providerBody = await brevoResponse.json();
    } catch {
      providerBody = null;
    }

    if (
      brevoResponse.status === 400 &&
      isRecord(providerBody) &&
      (providerBody.code === "duplicate_parameter" ||
        providerBody.code === "duplicate_request")
    ) {
      return json(
        { ok: true, status: "accepted", message: ACCEPTED_MESSAGE },
        { status: 202 },
      );
    }

    if (brevoResponse.status === 429) {
      return json(
        {
          ok: false,
          error: "Newsletter signup is busy right now. Please try again later.",
        },
        { status: 503, headers: { "Retry-After": "60" } },
      );
    }

    return json(
      { ok: false, error: UNAVAILABLE_MESSAGE },
      { status: 502 },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return json(
        {
          ok: false,
          error: "Newsletter signup timed out. Please try again.",
        },
        { status: 504 },
      );
    }
    return json(
      { ok: false, error: UNAVAILABLE_MESSAGE },
      { status: 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}
