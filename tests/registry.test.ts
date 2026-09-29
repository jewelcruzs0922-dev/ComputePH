import { describe, expect, it } from "vitest";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { CONTENT } from "@/lib/content";
import { CALCULATORS, popularCalculators, relatedCalculators } from "@/lib/registry";
import { RULES_BY_SLUG } from "@/lib/rules";
import { defaultValues, expectOk } from "./helpers";

describe("registry integrity", () => {
  it("lists 12 calculators with unique slugs", () => {
    expect(CALCULATORS).toHaveLength(12);
    const slugs = CALCULATORS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has an engine for every registered calculator", () => {
    for (const c of CALCULATORS) {
      expect(CALCULATOR_ENGINES[c.slug], `engine for ${c.slug}`).toBeDefined();
    }
  });

  it("has content for every registered calculator", () => {
    for (const c of CALCULATORS) {
      expect(CONTENT[c.slug], `content for ${c.slug}`).toBeDefined();
    }
  });

  it("has no orphaned engines or content entries", () => {
    const slugs = new Set(CALCULATORS.map((c) => c.slug));
    for (const key of Object.keys(CALCULATOR_ENGINES)) {
      expect(slugs.has(key), `engine "${key}" not in registry`).toBe(true);
    }
    for (const key of Object.keys(CONTENT)) {
      expect(slugs.has(key), `content "${key}" not in registry`).toBe(true);
    }
  });

  it("maps rules exactly to calculators flagged usesRules", () => {
    const expected = CALCULATORS.filter((c) => c.usesRules)
      .map((c) => c.slug)
      .sort();
    expect(Object.keys(RULES_BY_SLUG).sort()).toEqual(expected);
  });

  it("gives every calculator SEO metadata", () => {
    for (const c of CALCULATORS) {
      expect(c.title.length).toBeGreaterThan(10);
      expect(c.description.length).toBeGreaterThan(50);
      expect(c.keywords.length).toBeGreaterThanOrEqual(3);
      expect(c.aliases.length).toBeGreaterThanOrEqual(2);
      expect(c.summary.length).toBeGreaterThan(10);
    }
  });

  it("marks popular calculators as a subset", () => {
    const popular = popularCalculators();
    expect(popular.length).toBeGreaterThanOrEqual(4);
    const slugs = new Set(CALCULATORS.map((c) => c.slug));
    for (const p of popular) expect(slugs.has(p.slug)).toBe(true);
  });

  it("returns explicit related links when set, category fallback otherwise", () => {
    for (const c of CALCULATORS) {
      const related = relatedCalculators(c, 3);
      expect(related.length).toBeGreaterThan(0);
      const slugs = related.map((r) => r.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      expect(slugs).not.toContain(c.slug);
      if (c.related) {
        expect(slugs).toEqual(c.related.filter((s) => s !== c.slug));
      } else {
        for (const r of related) expect(r.category).toBe(c.category);
      }
    }
  });

  it("follows the specified related-link mapping", () => {
    const slugsFor = (slug: string) =>
      relatedCalculators(CALCULATORS.find((c) => c.slug === slug)!, 3).map(
        (r) => r.slug,
      );
    expect(slugsFor("13th-month-pay")).toEqual([
      "daily-hourly-salary",
      "overtime-pay",
      "income-tax",
    ]);
    expect(slugsFor("loan")).toEqual(["interest", "installment", "discount"]);
    expect(slugsFor("discount")).toEqual(["installment", "loan", "interest"]);
  });
});

describe("page content completeness", () => {
  it("has substantial content on every page", () => {
    for (const c of CALCULATORS) {
      const content = CONTENT[c.slug];
      expect(content.intro.length, c.slug).toBeGreaterThanOrEqual(2);
      expect(content.howItWorks.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(content.formula.lines.length, c.slug).toBeGreaterThanOrEqual(2);
      expect(content.example.steps.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(content.notes.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(content.faqs.length, c.slug).toBeGreaterThanOrEqual(3);
      expect(content.example.answer.length, c.slug).toBeGreaterThan(10);
      for (const faq of content.faqs) {
        expect(faq.q.endsWith("?"), `${c.slug}: ${faq.q}`).toBe(true);
        expect(faq.a.length, `${c.slug}: ${faq.q}`).toBeGreaterThan(20);
      }
    }
  });
});

describe("engine smoke test", () => {
  it("computes a result from default values for every calculator", () => {
    for (const c of CALCULATORS) {
      const engine = CALCULATOR_ENGINES[c.slug];
      const values = defaultValues(engine);
      const lines = expectOk(engine.calculate(values));
      expect(lines.length, c.slug).toBeGreaterThan(0);
      for (const line of lines) {
        expect(line.value, `${c.slug}: ${line.label}`).not.toMatch(
          /NaN|Infinity|undefined/,
        );
      }
    }
  });
});
