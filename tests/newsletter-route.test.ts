import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { resetRateLimits } from "@/lib/rateLimit";

type RouteHandler = (request: Request) => Promise<Response>;

let POST: RouteHandler;
let ip = 0;

function request(
  body: unknown,
  options: { sameIp?: string; origin?: string } = {},
): Request {
  ip += 1;
  return new Request("https://computeph.test/api/newsletter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": options.sameIp ?? `198.51.100.${ip}`,
      ...(options.origin ? { origin: options.origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

function validBody() {
  return {
    email: " Reader@Example.com ",
    consent: true,
    website: "",
  };
}

function stubFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeAll(async () => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://computeph.test";
  const route = await import("@/app/api/newsletter/route");
  POST = route.POST;
});

beforeEach(() => {
  resetRateLimits();
  vi.stubEnv("BREVO_API_KEY", "test-api-key");
  vi.stubEnv("BREVO_LIST_ID", "123");
  vi.stubEnv("BREVO_DOI_TEMPLATE_ID", "456");
  vi.stubEnv("BREVO_DOI_REDIRECT_URL", "https://computeph.test/#newsletter");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  resetRateLimits();
});

describe("newsletter route", () => {
  it("sends a normalized address through Brevo DOI", async () => {
    const fetchMock = stubFetch(
      new Response("{}", {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const response = await POST(request(validBody()));
    const data = await response.json();

    expect(response.status).toBe(202);
    expect(data.ok).toBe(true);
    expect(data.status).toBe("confirmation_sent");
    expect(data.message).toContain("confirm");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
    );
    expect((init.headers as Record<string, string>)["api-key"]).toBe(
      "test-api-key",
    );
    expect(JSON.parse(String(init.body))).toEqual({
      email: "reader@example.com",
      includeListIds: [123],
      templateId: 456,
      redirectionUrl: "https://computeph.test/#newsletter",
    });
  });

  it("rejects invalid or missing email addresses", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    for (const email of ["", "not-an-email", "reader@example"]) {
      const response = await POST(request({ ...validBody(), email }));
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.ok).toBe(false);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires explicit consent", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      request({ ...validBody(), consent: false }),
    );
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("agree");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("treats an existing contact as a generic accepted signup", async () => {
    const fetchMock = stubFetch(
      new Response(
        JSON.stringify({
          code: "duplicate_parameter",
          message: "provider-only-detail",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const response = await POST(request(validBody()));
    const text = await response.text();

    expect(response.status).toBe(202);
    expect(text).toContain("accepted");
    expect(text).not.toContain("provider-only-detail");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns a safe error when Brevo fails", async () => {
    stubFetch(
      new Response(
        JSON.stringify({ message: "provider secret detail" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const response = await POST(request(validBody()));
    const text = await response.text();

    expect(response.status).toBe(502);
    expect(text).not.toContain("provider secret detail");
    expect(text).not.toContain("test-api-key");
    expect(text).toContain("temporarily unavailable");
  });

  it("handles Brevo rate limiting safely", async () => {
    stubFetch(new Response("{}", { status: 429 }));

    const response = await POST(request(validBody()));
    expect(response.status).toBe(503);
    expect(response.headers.get("Retry-After")).toBe("60");
  });

  it("handles timeouts safely", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockRejectedValue(
          Object.assign(new Error("aborted"), { name: "AbortError" }),
        ),
    );

    const response = await POST(request(validBody()));
    expect(response.status).toBe(504);
    const data = await response.json();
    expect(data.error).toContain("timed out");
  });

  it("reports missing configuration without calling Brevo", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(request(validBody()));
    expect(response.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without contacting Brevo", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      request({ ...validBody(), website: "https://spam.example" }),
    );
    const data = await response.json();

    expect(response.status).toBe(202);
    expect(data.status).toBe("accepted");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects cross-origin requests", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(
      request(validBody(), { origin: "https://evil.example" }),
    );
    expect(response.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rate limits repeated attempts", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    for (let i = 0; i < 8; i += 1) {
      const response = await POST(
        request({}, { sameIp: "203.0.113.9" }),
      );
      expect(response.status).toBe(400);
    }

    const blocked = await POST(
      request({}, { sameIp: "203.0.113.9" }),
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized streamed body without relying on Content-Length", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const oversized = JSON.stringify({
      ...validBody(),
      padding: "x".repeat(9_000),
    });
    const response = await POST(
      new Request("https://computeph.test/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-real-ip": "198.51.100.88",
        },
        body: oversized,
      }),
    );
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
