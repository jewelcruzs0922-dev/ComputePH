import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { CALCULATORS, CATEGORIES } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it("includes every intended public route exactly once", () => {
    expect(urls).toHaveLength(5 + CATEGORIES.length + CALCULATORS.length + 1);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("uses the canonical origin and no trailing slashes", () => {
    expect(urls[0]).toBe(SITE_URL);
    for (const url of urls) {
      expect(url === SITE_URL || url.startsWith(`${SITE_URL}/`)).toBe(true);
      expect(url.endsWith("/")).toBe(false);
    }
  });

  it("includes the calculator hub, categories, calculators, and guide", () => {
    expect(urls).toContain(`${SITE_URL}/calculators`);
    for (const category of CATEGORIES) {
      expect(urls).toContain(`${SITE_URL}/calculators/${category.anchor}`);
    }
    for (const calculator of CALCULATORS) {
      expect(urls).toContain(`${SITE_URL}/calculators/${calculator.slug}`);
    }
    expect(urls).toContain(`${SITE_URL}/guides/13th-month-pay-philippines`);
  });
});
