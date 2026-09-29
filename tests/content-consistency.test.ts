import { describe, expect, it } from "vitest";
import { CONTENT } from "@/lib/content";
import { CALCULATORS } from "@/lib/registry";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";

/**
 * Content-consistency regressions: explanatory text must agree with the
 * configured rules. A correct calculator with wrong explanatory content is
 * not production-ready.
 */
describe("Pag-IBIG content matches the configured rules", () => {
  const c = CONTENT["pag-ibig"];
  const allText = [
    ...c.intro,
    ...c.howItWorks,
    c.formula.summary,
    ...c.formula.lines,
    c.example.scenario,
    ...c.example.steps,
    c.example.answer,
    ...c.notes,
    ...c.faqs.flatMap((f) => [f.q, f.a]),
  ].join(" \n ");

  it("never describes the employer share as 'matching' the employee share", () => {
    expect(allText).not.toMatch(/match(?:es|ing)?\s+your\s+share/i);
    expect(allText).not.toMatch(/matching\s+contribution/i);
    expect(allText.toLowerCase()).not.toContain("employer matches");
  });

  it("never presents 2% as applying to the full monthly compensation", () => {
    expect(allText).not.toMatch(/2%\s+of\s+monthly\s+compensation/i);
  });

  it("states both employee rates: 1% at/below ₱1,500 and 2% otherwise", () => {
    expect(allText).toMatch(/1%/);
    expect(allText).toMatch(
      /(₱1,500 or below|compensation ≤ ₱1,500|earning ₱1,500 or below)/,
    );
    expect(c.intro.join(" ")).toMatch(/2%/);
  });

  it("describes the employer as paying 2% of the fund salary", () => {
    expect(allText).toMatch(/employer[^.]*2%/i);
    expect(allText).toMatch(/fund salary/);
  });

  it("explains the ₱10,000 fund-salary cap and the ₱200/₱400 maximums", () => {
    expect(allText).toContain("₱10,000");
    expect(allText).toMatch(/max ₱200/);
    expect(allText).toMatch(/₱400/);
  });

  it("keeps the formula steps in agreement with the summary", () => {
    expect(c.formula.summary).toMatch(/1% if compensation ≤ ₱1,500/);
    expect(c.formula.lines.join(" ")).toMatch(/1% if compensation ≤ ₱1,500/);
    expect(c.formula.lines.join(" ")).toMatch(/Employer share = fund salary × 2%/);
  });

  it("keeps the mandatory contribution explanation consistent", () => {
    expect(allText).toMatch(/₱10,000/);
    expect(allText).toMatch(/2%/);
    expect(allText).toMatch(/max ₱200/);
    expect(allText).toMatch(/₱400/);
  });

  it("does not claim an unsupported ₱5,000 voluntary-savings maximum", () => {
    expect(allText).not.toMatch(/₱5,000/);
    expect(allText).toMatch(
      /voluntary savings in addition to your mandatory contribution/i,
    );
    expect(allText).toMatch(/separate, voluntary program/);
  });
});

describe("13th month content matches the statutory presentation", () => {
  const c = CONTENT["13th-month-pay"];
  const allText = [...c.intro, ...c.howItWorks, ...c.notes, ...c.faqs.flatMap((f) => [f.q, f.a])].join(" \n ");

  it("explains the proportional assumption for fractional months", () => {
    expect(allText).toMatch(/earned proportionally/);
    expect(allText).toMatch(/7\.5/);
  });

  it("tells users with changing salaries how to handle it", () => {
    expect(allText).toMatch(/total basic earned ÷ months worked/);
  });

  it("uses the verified DOLE no-exemption wording without the outdated exception", () => {
    expect(allText).toContain(
      "No request or application for exemption from payment of 13th month pay",
    );
    expect(allText).not.toMatch(/distressed employers/i);
  });

  it("keeps the statutory ÷ 12 formula", () => {
    expect(c.formula.summary).toContain("÷ 12");
  });
});

describe("search metadata stays truthful", () => {
  it("does not target keywords the calculators do not implement", () => {
    const all = CALCULATORS.flatMap((m) => [...m.keywords, ...m.aliases]).map(
      (k) => k.toLowerCase(),
    );
    expect(all).not.toContain("mp2");
    expect(all).not.toContain("atm installment");
    expect(all).not.toContain("senior citizen discount");
    expect(all).not.toContain("pwd discount");
    expect(all).not.toContain("3rd party payee");
    expect(all).not.toContain("third party payee");
  });

  it("keeps the discount calculator positioned as generic percentage math", () => {
    const discount = CALCULATORS.find((m) => m.slug === "discount")!;
    const text = [discount.summary, discount.description, ...discount.keywords].join(" ").toLowerCase();
    expect(text).toContain("percentage");
    expect(CONTENT["discount"].intro.join(" ")).toMatch(/generic percentage discount/i);
  });
});

describe("deployment-quality wording fixes", () => {
  it("does not claim a ₱1,000/month Pag-IBIG membership threshold", () => {
    const c = CONTENT["pag-ibig"];
    const allText = [...c.intro, ...c.notes, ...c.faqs.flatMap((f) => [f.q, f.a])].join(" \n ");
    expect(allText).not.toMatch(/₱1,000 per month/);
    expect(allText).not.toMatch(/mandatory for employees earning at least/i);
    expect(allText).toMatch(
      /membership and contribution rules vary by membership category/i,
    );
    expect(allText).toMatch(
      /intended for standard employee mandatory contributions/i,
    );
  });

  it("labels the SSS input as compensation used for the estimate", () => {
    const sss = CALCULATOR_ENGINES["sss"];
    const sssField = sss.fields.find((f) => f.name === "monthlySalary")!;
    expect(sssField.kind).toBe("number");
    expect(sssField.label).toBe(
      "Monthly compensation used for the SSS estimate",
    );
    if (sssField.kind !== "number") throw new Error("unreachable");
    expect(sssField.messages?.required).toBe(
      "Enter your monthly compensation used for the SSS estimate.",
    );
    expect(CONTENT.sss.howItWorks[0]).toMatch(
      /monthly compensation used for the SSS estimate/i,
    );
    expect(CONTENT.sss.howItWorks.join(" ")).not.toMatch(/monthly basic salary/i);
  });

  it("frames the 16-hour overtime cap as a calculator modeling constraint", () => {
    const ot = CALCULATOR_ENGINES["overtime-pay"];
    const hoursField = ot.fields.find((f) => f.name === "overtimeHours")!;
    expect(hoursField.kind).toBe("number");
    if (hoursField.kind !== "number") throw new Error("unreachable");
    const maxMessage = hoursField.messages?.max;
    expect(maxMessage).toMatch(/^For this calculator, overtime is limited to 16 hours/);
    expect(maxMessage).not.toMatch(/statutory|legal maximum|Labor Code|DOLE/i);
  });

  it("keeps the 13th-month transparency wording", () => {
    const c = CONTENT["13th-month-pay"];
    const intro = c.intro.join(" ");
    expect(intro).toMatch(/estimat/i);
    expect(intro).toMatch(/monthly basic salary/);
    expect(intro).toMatch(/months you worked/);
    expect(intro).toMatch(/For partial months or changing salaries/);
  });
});
