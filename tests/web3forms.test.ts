import { afterEach, describe, expect, it, vi } from "vitest";
import {
  submitFeedbackToWeb3Forms,
  WEB3FORMS_ENDPOINT,
} from "@/lib/web3forms";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Web3Forms feedback submission", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("submits feedback without an email", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ success: true, message: "Email sent successfully!" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitFeedbackToWeb3Forms({
      accessKey: "public-test-key",
      message: "Please add a rent calculator.",
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(WEB3FORMS_ENDPOINT);
    const body = JSON.parse(String(init.body));
    expect(body.access_key).toBe("public-test-key");
    expect(body.message).toBe("Please add a rent calculator.");
    expect(body.botcheck).toBe(false);
    expect(body.email).toBeUndefined();
  });

  it("includes an optional email", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ success: true }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await submitFeedbackToWeb3Forms({
      accessKey: "public-test-key",
      message: "Hello",
      email: "reader@example.com",
    });

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(init.body)).email).toBe("reader@example.com");
  });

  it("returns a safe error when no access key is configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitFeedbackToWeb3Forms({
      accessKey: "",
      message: "Hello",
    });

    expect(result.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not expose provider errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          { success: false, message: "provider secret detail" },
          400,
        ),
      ),
    );

    const result = await submitFeedbackToWeb3Forms({
      accessKey: "public-test-key",
      message: "Hello",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).not.toContain("provider secret");
      expect(result.error).toContain("couldn't send");
    }
  });

  it("handles provider rate limiting", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ success: false }, 429)),
    );

    const result = await submitFeedbackToWeb3Forms({
      accessKey: "public-test-key",
      message: "Hello",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("Too many");
  });

  it("handles network failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await submitFeedbackToWeb3Forms({
      accessKey: "public-test-key",
      message: "Hello",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("couldn't reach");
  });

  it("handles timeouts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(
        Object.assign(new Error("aborted"), { name: "AbortError" }),
      ),
    );

    const result = await submitFeedbackToWeb3Forms({
      accessKey: "public-test-key",
      message: "Hello",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("timed out");
  });
});
