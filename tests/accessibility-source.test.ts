import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string): string {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

describe("privacy and accessibility source guards", () => {
  it("masks calculator inputs/results and submitted forms from Clarity", () => {
    expect(read("components/calculators/CalculatorForm.tsx")).toContain(
      'data-clarity-mask="true"',
    );
    expect(read("components/home/NewsletterSignup.tsx")).toContain(
      'data-clarity-mask="true"',
    );
    expect(read("components/home/FeedbackForm.tsx")).toContain(
      'data-clarity-mask="true"',
    );
  });

  it("does not load analytics unless consent is granted", () => {
    const consent = read("components/analytics/AnalyticsConsent.tsx");
    expect(consent).toContain('choice === "granted"');
    expect(consent).toContain("<Analytics />");
    expect(consent).toContain("<Clarity />");
  });

  it("marks calculator number inputs as required for assistive technology", () => {
    const form = read("components/calculators/CalculatorForm.tsx");
    expect(form).toContain("required={def.required !== false}");
    expect(form).toContain("aria-required={def.required !== false ? true : undefined}");
  });

  it("keeps a visible focus indicator on calculator inputs and buttons", () => {
    const form = read("components/calculators/CalculatorForm.tsx");
    expect(form).not.toContain("focus-visible:outline-none");
    expect(form).toContain("focus-within:outline-2");
    expect(form).toContain("focus-within:outline-royal");
  });
});
