import { beforeEach, describe, expect, it } from "vitest";
import {
  getClientIp,
  rateLimit,
  resetRateLimits,
} from "@/lib/rateLimit";

describe("in-memory rate limit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests up to the limit and then blocks", () => {
    const now = 1_000;
    for (let i = 0; i < 3; i += 1) {
      expect(rateLimit("ip", 3, 60_000, now).ok).toBe(true);
    }
    const blocked = rateLimit("ip", 3, 60_000, now);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) expect(blocked.retryAfterSeconds).toBe(60);
  });

  it("resets after the window", () => {
    expect(rateLimit("ip", 1, 1_000, 0).ok).toBe(true);
    expect(rateLimit("ip", 1, 1_000, 500).ok).toBe(false);
    expect(rateLimit("ip", 1, 1_000, 1_001).ok).toBe(true);
  });

  it("keeps separate keys independent", () => {
    expect(rateLimit("one", 1, 1_000, 0).ok).toBe(true);
    expect(rateLimit("two", 1, 1_000, 0).ok).toBe(true);
    expect(rateLimit("one", 1, 1_000, 0).ok).toBe(false);
    expect(rateLimit("two", 1, 1_000, 0).ok).toBe(false);
  });

  it("extracts a stable client IP", () => {
    const request = new Request("http://localhost/", {
      headers: { "x-forwarded-for": "203.0.113.4, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.4");
  });

  it("prefers the platform-set x-real-ip header", () => {
    const request = new Request("http://localhost/", {
      headers: {
        "x-real-ip": "198.51.100.7",
        "x-forwarded-for": "203.0.113.4, 10.0.0.1",
      },
    });
    expect(getClientIp(request)).toBe("198.51.100.7");
  });
});
