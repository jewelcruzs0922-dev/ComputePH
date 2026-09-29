import { describe, expect, it } from "vitest";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { defaultRawValues, validateFields } from "@/lib/utils/validate";
import {
  emphasisValue,
  expectError,
  expectOk,
  valueOf,
  valuesWith,
} from "./helpers";

const engine = (slug: string) => CALCULATOR_ENGINES[slug];

describe("loan amortization", () => {
  const calc = engine("loan");

  it("matches the worked example (₱500k, 12%, 5 years)", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { principal: 500000, annualRate: 12, termValue: 5, termUnit: "years" }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱11,122.22");
    expect(valueOf(lines, "Total interest")).toBe("₱167,333.43");
    expect(valueOf(lines, "Total amount repaid")).toBe("₱667,333.43");
    expect(valueOf(lines, "Term")).toBe("5 years (60 months)");
  });

  it("handles a 0% loan with no interest", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { principal: 12000, annualRate: 0, termValue: 12, termUnit: "months" }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱1,000.00");
    expect(valueOf(lines, "Total interest")).toBe("₱0.00");
    expect(valueOf(lines, "Total amount repaid")).toBe("₱12,000.00");
  });

  it("supports a single-month term", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { principal: 10000, annualRate: 0, termValue: 1, termUnit: "months" }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱10,000.00");
  });

  it("computes large amounts without overflow", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { principal: 999999999999, annualRate: 1, termValue: 600, termUnit: "months" }),
      ),
    );
    expect(emphasisValue(lines)).not.toMatch(/NaN|Infinity/);
  });

  it("rejects sub-month terms", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { termValue: 0, termUnit: "months" }),
    );
    expectError(outcome, "Enter a loan term of at least one month.");
  });

  it("rejects a zero principal at the engine level", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { principal: 0, annualRate: 0, termValue: 12, termUnit: "months" }),
    );
    expectError(outcome, "Enter an amount greater than 0.");
  });

  describe("term limits (1–600 months / 1–50 years)", () => {
    const overLimit =
      "The loan term must be 600 months (50 years) or less. Reduce the term and recalculate.";

    it("accepts a 1-month term", () => {
      const lines = expectOk(
        calc.calculate(valuesWith(calc, { annualRate: 0, termValue: 1, termUnit: "months" })),
      );
      expect(valueOf(lines, "Term")).toBe("1 month");
    });

    it("accepts a 12-month term", () => {
      const lines = expectOk(
        calc.calculate(valuesWith(calc, { annualRate: 0, termValue: 12, termUnit: "months" })),
      );
      expect(valueOf(lines, "Term")).toBe("12 months");
    });

    it("accepts a 60-month term", () => {
      const lines = expectOk(
        calc.calculate(valuesWith(calc, { annualRate: 0, termValue: 60, termUnit: "months" })),
      );
      expect(valueOf(lines, "Term")).toBe("60 months");
    });

    it("accepts a 600-month term", () => {
      const lines = expectOk(
        calc.calculate(
          valuesWith(calc, { principal: 600000, annualRate: 0, termValue: 600, termUnit: "months" }),
        ),
      );
      expect(emphasisValue(lines)).toBe("₱1,000.00");
      expect(valueOf(lines, "Term")).toBe("600 months");
    });

    it("rejects 601 months in calculate", () => {
      const outcome = calc.calculate(
        valuesWith(calc, { termValue: 601, termUnit: "months" }),
      );
      expectError(outcome, overLimit);
    });

    it("rejects 601 months at the field level", () => {
      const raw = defaultRawValues(calc.fields);
      raw.termUnit = "months";
      raw.termValue = "601";
      const result = validateFields(calc.fields, raw);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.termValue).toBe(
          "That term is too long — the maximum is 600 months (50 years).",
        );
      }
    });

    it("applies the unit-aware limits at the field level", () => {
      // 60 years = 720 months → over the 50-year cap even though 60 < 600.
      const tooManyYears = defaultRawValues(calc.fields);
      tooManyYears.termUnit = "years";
      tooManyYears.termValue = "60";
      const yearsResult = validateFields(calc.fields, tooManyYears);
      expect(yearsResult.ok).toBe(false);
      if (!yearsResult.ok) {
        expect(yearsResult.errors.termValue).toBe(
          "That term is too long — enter at most 50 years (600 months).",
        );
      }

      const atYearLimit = defaultRawValues(calc.fields);
      atYearLimit.termUnit = "years";
      atYearLimit.termValue = "50";
      expect(validateFields(calc.fields, atYearLimit).ok).toBe(true);

      const atMonthLimit = defaultRawValues(calc.fields);
      atMonthLimit.termUnit = "months";
      atMonthLimit.termValue = "600";
      expect(validateFields(calc.fields, atMonthLimit).ok).toBe(true);

      const underYearLimit = defaultRawValues(calc.fields);
      underYearLimit.termUnit = "years";
      underYearLimit.termValue = "5";
      expect(validateFields(calc.fields, underYearLimit).ok).toBe(true);
    });

    it("accepts 50 years (600 months)", () => {
      const lines = expectOk(
        calc.calculate(valuesWith(calc, { annualRate: 0, termValue: 50, termUnit: "years" })),
      );
      expect(valueOf(lines, "Term")).toBe("50 years (600 months)");
    });

    it("rejects 51 years in calculate", () => {
      const outcome = calc.calculate(
        valuesWith(calc, { termValue: 51, termUnit: "years" }),
      );
      expectError(outcome, overLimit);
    });

    it("accepts decimal years that fit the limit", () => {
      const lines = expectOk(
        calc.calculate(valuesWith(calc, { annualRate: 0, termValue: 1.5, termUnit: "years" })),
      );
      expect(valueOf(lines, "Term")).toBe("1.5 years (18 months)");
    });

    it("rejects invalid and sub-1 field values", () => {
      const raw = defaultRawValues(calc.fields);
      raw.termValue = "abc";
      const invalid = validateFields(calc.fields, raw);
      expect(invalid.ok).toBe(false);
      if (!invalid.ok) expect(invalid.errors.termValue).toBe("Enter a valid number.");

      const raw2 = defaultRawValues(calc.fields);
      raw2.termValue = "0.5";
      const tooSmall = validateFields(calc.fields, raw2);
      expect(tooSmall.ok).toBe(false);
      if (!tooSmall.ok) {
        expect(tooSmall.errors.termValue).toBe(
          "Enter a term of at least 1 (1 month or 1 year).",
        );
      }
    });
  });
});

describe("interest", () => {
  const calc = engine("interest");

  it("computes simple interest", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          interestType: "simple",
          principal: 100000,
          annualRate: 6,
          termUnit: "years",
          termValue: 5,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱30,000.00");
    expect(valueOf(lines, "Final amount")).toBe("₱130,000.00");
  });

  it("computes monthly compound interest", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          interestType: "compound",
          principal: 100000,
          annualRate: 6,
          termUnit: "years",
          termValue: 5,
          compounding: "12",
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱34,885.02");
    expect(valueOf(lines, "Final amount")).toBe("₱134,885.02");
  });

  it("computes annual compounding", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          interestType: "compound",
          principal: 100000,
          annualRate: 6,
          termUnit: "years",
          termValue: 5,
          compounding: "1",
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱33,822.56");
  });

  it("accepts a term in months", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          interestType: "simple",
          principal: 10000,
          annualRate: 10,
          termUnit: "months",
          termValue: 12,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱1,000.00");
    expect(valueOf(lines, "Total term")).toContain("12 months");
  });

  it("handles a 0% rate", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          interestType: "simple",
          principal: 5000,
          annualRate: 0,
          termUnit: "years",
          termValue: 3,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱0.00");
    expect(valueOf(lines, "Final amount")).toBe("₱5,000.00");
  });

  it("rejects a zero principal at the engine level", () => {
    const outcome = calc.calculate(
      valuesWith(calc, {
        interestType: "simple",
        principal: 0,
        annualRate: 10,
        termUnit: "years",
        termValue: 1,
      }),
    );
    expectError(outcome, "Enter an amount greater than 0.");
  });

  it("returns a readable error instead of Infinity on extreme values", () => {
    const outcome = calc.calculate(
      valuesWith(calc, {
        interestType: "compound",
        principal: 999999999999,
        annualRate: 1000,
        termUnit: "years",
        termValue: 100,
        compounding: "12",
      }),
    );
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toContain("computed");
      expect(outcome.error).toContain("shorter term or a lower rate");
    }
  });

  it("applies unit-aware term limits at the field level", () => {
    const atYearLimit = defaultRawValues(calc.fields);
    atYearLimit.termUnit = "years";
    atYearLimit.termValue = "100";
    expect(validateFields(calc.fields, atYearLimit).ok).toBe(true);

    const overYears = defaultRawValues(calc.fields);
    overYears.termUnit = "years";
    overYears.termValue = "101";
    const yearsResult = validateFields(calc.fields, overYears);
    expect(yearsResult.ok).toBe(false);
    if (!yearsResult.ok) {
      expect(yearsResult.errors.termValue).toBe(
        "That term is too long — enter at most 100 years (1,200 months).",
      );
    }

    const atMonthLimit = defaultRawValues(calc.fields);
    atMonthLimit.termUnit = "months";
    atMonthLimit.termValue = "1200";
    expect(validateFields(calc.fields, atMonthLimit).ok).toBe(true);

    const overMonths = defaultRawValues(calc.fields);
    overMonths.termUnit = "months";
    overMonths.termValue = "1201";
    const monthsResult = validateFields(calc.fields, overMonths);
    expect(monthsResult.ok).toBe(false);
    if (!monthsResult.ok) {
      expect(monthsResult.errors.termValue).toBe(
        "That term is too long — the maximum is 1,200 months (100 years).",
      );
    }
  });
});

describe("discount", () => {
  const calc = engine("discount");

  it("matches the worked example (20% off)", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { price: 1500, discountRate: 20 })),
    );
    expect(emphasisValue(lines)).toBe("₱1,200.00");
    expect(valueOf(lines, "You save")).toBe("₱300.00");
    expect(valueOf(lines, "Original price")).toBe("₱1,500.00");
    expect(valueOf(lines, "You pay per ₱100")).toBe("₱80.00");
  });

  it("handles a 0% discount", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { price: 1500, discountRate: 0 })),
    );
    expect(emphasisValue(lines)).toBe("₱1,500.00");
    expect(valueOf(lines, "You save")).toBe("₱0.00");
  });

  it("handles a 100% discount", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { price: 999.99, discountRate: 100 })),
    );
    expect(emphasisValue(lines)).toBe("₱0.00");
    expect(valueOf(lines, "You save")).toBe("₱999.99");
  });

  it("rejects a zero price at the engine level", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { price: 0, discountRate: 20 }),
    );
    expectError(outcome, "Enter an amount greater than 0.");
  });

  it("rounds large amounts to exact centavos", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { price: 999999999, discountRate: 10 }),
      ),
    );
    expect(valueOf(lines, "You save")).toBe("₱99,999,999.90");
    expect(emphasisValue(lines)).toBe("₱899,999,999.10");
  });
});

describe("installment", () => {
  const calc = engine("installment");

  it("matches the add-on worked example", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          price: 30000,
          downPayment: 5000,
          method: "addon",
          annualRate: 12,
          months: 12,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱2,333.33");
    expect(valueOf(lines, "Total interest / finance charge")).toBe("₱3,000.00");
    expect(valueOf(lines, "Total amount paid")).toBe("₱33,000.00");
    expect(valueOf(lines, "Amount financed")).toBe("₱25,000.00");
    expect(valueOf(lines, "Total cost vs. price")).toBe("10.0%");
  });

  it("computes amortized payments on the reducing balance", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          price: 30000,
          downPayment: 5000,
          method: "amortized",
          annualRate: 12,
          months: 12,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱2,221.22");
    expect(valueOf(lines, "Total interest / finance charge")).toBe("₱1,654.64");
    expect(valueOf(lines, "Total amount paid")).toBe("₱31,654.64");
  });

  it("adds no charge at 0%", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          price: 30000,
          downPayment: 5000,
          method: "addon",
          annualRate: 0,
          months: 12,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱2,083.33");
    expect(valueOf(lines, "Total interest / finance charge")).toBe("₱0.00");
    expect(valueOf(lines, "Total amount paid")).toBe("₱30,000.00");
  });

  it("rejects a down payment equal to the price", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { price: 30000, downPayment: 30000 }),
    );
    expectError(outcome, "Down payment must be less than the item price.");
  });

  it("rejects a down payment above the price", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { price: 10000, downPayment: 15000 }),
    );
    expectError(outcome, "Down payment must be less than the item price.");
  });

  it("handles a full-financing plan (zero down)", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          price: 12000,
          downPayment: 0,
          method: "addon",
          annualRate: 0,
          months: 12,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱1,000.00");
    expect(valueOf(lines, "Total amount paid")).toBe("₱12,000.00");
  });

  it("treats a zero price as an invalid plan", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { price: 0, downPayment: 0 }),
    );
    expectError(outcome, "Enter an amount greater than 0.");
  });

  it("computes large plans without NaN", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          price: 999999999,
          downPayment: 0,
          method: "addon",
          annualRate: 100,
          months: 600,
        }),
      ),
    );
    expect(emphasisValue(lines)).not.toMatch(/NaN|Infinity/);
    expect(valueOf(lines, "Total amount paid")).not.toMatch(/NaN|Infinity/);
  });

  it("rejects a down payment at or above the price at the field level", () => {
    const equal = defaultRawValues(calc.fields);
    equal.price = "30000";
    equal.downPayment = "30000";
    const equalResult = validateFields(calc.fields, equal);
    expect(equalResult.ok).toBe(false);
    if (!equalResult.ok) {
      expect(equalResult.errors.downPayment).toBe(
        "Down payment must be less than the item price.",
      );
    }

    const above = defaultRawValues(calc.fields);
    above.price = "30000";
    above.downPayment = "40000";
    const aboveResult = validateFields(calc.fields, above);
    expect(aboveResult.ok).toBe(false);
    if (!aboveResult.ok) {
      expect(aboveResult.errors.downPayment).toBe(
        "Down payment must be less than the item price.",
      );
    }

    const valid = defaultRawValues(calc.fields);
    valid.price = "30000";
    valid.downPayment = "5000";
    expect(validateFields(calc.fields, valid).ok).toBe(true);
  });
});
