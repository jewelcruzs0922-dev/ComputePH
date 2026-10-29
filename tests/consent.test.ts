import { describe, expect, it } from "vitest";
import { parseAnalyticsConsent } from "@/lib/consent";

describe("analytics consent storage values", () => {
  it("accepts only the two explicit choices", () => {
    expect(parseAnalyticsConsent("granted")).toBe("granted");
    expect(parseAnalyticsConsent("denied")).toBe("denied");
  });

  it("treats missing, corrupted, or legacy values as no choice", () => {
    expect(parseAnalyticsConsent(null)).toBeNull();
    expect(parseAnalyticsConsent("")).toBeNull();
    expect(parseAnalyticsConsent("true")).toBeNull();
    expect(parseAnalyticsConsent("accepted")).toBeNull();
  });
});
