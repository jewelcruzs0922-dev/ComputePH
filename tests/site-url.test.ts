import { afterEach, describe, expect, it, vi } from "vitest";

async function loadSiteUrl(): Promise<Record<string, unknown>> {
  vi.resetModules();
  return (await import("@/lib/site")) as Record<string, unknown>;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("NEXT_PUBLIC_SITE_URL handling", () => {
  it("normalizes a valid origin (trailing slash stripped, host lowercased)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://Example.com/");
    const mod = await loadSiteUrl();
    expect(mod.SITE_URL).toBe("https://example.com");
  });

  it("rejects sub-paths (origin-only rule)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/tools/");
    await expect(loadSiteUrl()).rejects.toThrow(
      /Use the origin only.*sub-paths are not supported/,
    );
  });

  it("rejects a non-URL value with a clear error", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    await expect(loadSiteUrl()).rejects.toThrow(/Invalid NEXT_PUBLIC_SITE_URL/);
  });

  it("rejects non-http(s) protocols", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "ftp://example.com");
    await expect(loadSiteUrl()).rejects.toThrow(/Only http\(s\)/);
  });

  it("rejects query strings and fragments", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/?utm=1");
    await expect(loadSiteUrl()).rejects.toThrow(/query string or fragment/);
  });

  it("requires the variable on Vercel deployments", async () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    await expect(loadSiteUrl()).rejects.toThrow(
      /NEXT_PUBLIC_SITE_URL is required on Vercel deployments/,
    );
  });

  it("rejects a non-HTTPS origin on Vercel deployments", async () => {
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://example.com");
    await expect(loadSiteUrl()).rejects.toThrow(
      /must be an HTTPS URL on Vercel deployments/,
    );
  });

  it("accepts HTTP origins outside Vercel (local production smoke)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3001");
    const mod = await loadSiteUrl();
    expect(mod.SITE_URL).toBe("http://localhost:3001");
  });

  it("defaults to localhost in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const mod = await loadSiteUrl();
    expect(mod.SITE_URL).toBe("http://localhost:3000");
  });

  it("falls back to the documented default outside dev, with a warning", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const mod = await loadSiteUrl();
    expect(mod.SITE_URL).toBe("https://computeph.ph");
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("NEXT_PUBLIC_SITE_URL is not set"),
    );
  });

  it("explicit values win over every fallback", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://real-domain.gov.ph");
    vi.stubEnv("VERCEL", "1");
    const mod = await loadSiteUrl();
    expect(mod.SITE_URL).toBe("https://real-domain.gov.ph");
  });
});
