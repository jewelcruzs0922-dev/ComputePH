import { describe, expect, it } from "vitest";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import {
  formatNumber,
  formatPercent,
  formatPeso,
  roundTo,
} from "@/lib/utils/money";
import {
  defaultRawValues,
  formRawValues,
  isVisible,
  parseNumeric,
  validateFields,
} from "@/lib/utils/validate";

describe("roundTo", () => {
  it("rounds half away from zero at 2 decimals", () => {
    expect(roundTo(2.675, 2)).toBe(2.68);
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(14583.3333333, 2)).toBe(14583.33);
    expect(roundTo(14583.335, 2)).toBe(14583.34);
  });

  it("returns 0 for non-finite input", () => {
    expect(roundTo(Number.NaN)).toBe(0);
    expect(roundTo(Number.POSITIVE_INFINITY)).toBe(0);
    expect(roundTo(Number.NEGATIVE_INFINITY)).toBe(0);
  });

  it("passes through very large numbers unchanged", () => {
    expect(roundTo(1e20 + 0.123, 2)).toBe(1e20 + 0.123);
  });

  it("rounds to whole numbers at 0 decimals", () => {
    expect(roundTo(5.5, 0)).toBe(6);
    expect(roundTo(-5.5, 0)).toBe(-6);
  });
});

describe("formatNumber", () => {
  it("groups thousands and fixes decimals", () => {
    expect(formatNumber(25000, 2)).toBe("25,000.00");
    expect(formatNumber(1234567.891, 2)).toBe("1,234,567.89");
    expect(formatNumber(1234567, 0)).toBe("1,234,567");
    expect(formatNumber(0, 2)).toBe("0.00");
  });

  it("keeps the sign outside the grouping", () => {
    expect(formatNumber(-1234.5, 2)).toBe("-1,234.50");
    expect(formatNumber(-1234567, 0)).toBe("-1,234,567");
  });

  it("never returns NaN or Infinity", () => {
    expect(formatNumber(Number.NaN)).toBe("0.00");
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe("0.00");
  });

  it("handles amounts beyond 15 digits without throwing", () => {
    const out = formatNumber(1e21, 2);
    expect(out).not.toMatch(/NaN|Infinity/);
  });

  it("keeps the requested decimals beyond 15 digits", () => {
    expect(formatNumber(1e21, 2)).toBe("1,000,000,000,000,000,000,000.00");
    expect(formatNumber(1e16, 2)).toBe("10,000,000,000,000,000.00");
    expect(formatNumber(-1e16, 0)).toBe("-10,000,000,000,000,000");
    expect(formatPeso(1e16)).toBe("₱10,000,000,000,000,000.00");
    expect(formatPeso(2.4118812742666143e18)).toBe(
      "₱2,411,881,274,266,614,300.00",
    );
  });
});

describe("formatPeso", () => {
  it("prefixes the peso sign", () => {
    expect(formatPeso(25000)).toBe("₱25,000.00");
    expect(formatPeso(0)).toBe("₱0.00");
    expect(formatPeso(0.005)).toBe("₱0.01");
  });

  it("puts a minus before the peso sign for negatives", () => {
    expect(formatPeso(-125)).toBe("-₱125.00");
    expect(formatPeso(-0.005)).toBe("-₱0.01");
  });

  it("supports custom precision", () => {
    expect(formatPeso(1234.5678, 4)).toBe("₱1,234.5678");
    expect(formatPeso(1234.5, 0)).toBe("₱1,235");
  });

  it("never emits NaN", () => {
    expect(formatPeso(Number.NaN)).toBe("₱0.00");
  });
});

describe("formatPercent", () => {
  it("formats percentages", () => {
    expect(formatPercent(12.5, 1)).toBe("12.5%");
    expect(formatPercent(100, 0)).toBe("100%");
    expect(formatPercent(0, 2)).toBe("0.00%");
  });
});

describe("parseNumeric", () => {
  it("accepts real-world input", () => {
    expect(parseNumeric("₱1,000.50")).toBe(1000.5);
    expect(parseNumeric("12%")).toBe(12);
    expect(parseNumeric(" 25000 ")).toBe(25000);
    expect(parseNumeric("1_000")).toBe(1000);
    expect(parseNumeric("0")).toBe(0);
  });

  it("rejects empty and non-numeric input", () => {
    expect(parseNumeric("")).toBeNull();
    expect(parseNumeric("abc")).toBeNull();
    expect(parseNumeric("12abc")).toBeNull();
    expect(parseNumeric("₱")).toBeNull();
  });

  it("rejects values beyond the finite range", () => {
    expect(parseNumeric("Infinity")).toBeNull();
  });
});

describe("validateFields", () => {
  const calc = CALCULATOR_ENGINES["discount"];

  it("parses defaults successfully", () => {
    const raw = defaultRawValues(calc.fields);
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.values.price).toBe(1500);
      expect(result.values.discountRate).toBe(20);
    }
  });

  it("flags missing required fields with the custom message", () => {
    const result = validateFields(calc.fields, { price: "", discountRate: "20" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.price).toBe("Enter the original price.");
  });

  it("flags missing fields with the generic message when none is set", () => {
    const result = validateFields(calc.fields, { price: "1000", discountRate: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.discountRate).toBe("Enter the discount rate.");
  });

  it("flags non-numeric input", () => {
    const result = validateFields(calc.fields, { price: "abc", discountRate: "20" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.price).toBe("Enter a valid number.");
  });

  it("enforces custom min and max messages", () => {
    const low = validateFields(calc.fields, { price: "0", discountRate: "20" });
    expect(low.ok).toBe(false);
    if (!low.ok) expect(low.errors.price).toBe("Enter an amount greater than 0.");

    const high = validateFields(calc.fields, { price: "1000", discountRate: "150" });
    expect(high.ok).toBe(false);
    if (!high.ok) expect(high.errors.discountRate).toBe("A discount cannot be more than 100%.");

    const negative = validateFields(calc.fields, { price: "1000", discountRate: "-5" });
    expect(negative.ok).toBe(false);
    if (!negative.ok) expect(negative.errors.discountRate).toBe("Discount rate cannot be negative.");
  });

  it("enforces integer fields", () => {
    const salary = CALCULATOR_ENGINES["daily-hourly-salary"];
    const result = validateFields(salary.fields, {
      basis: "monthly",
      amount: "25000",
      daysPerMonth: "26.5",
      hoursPerDay: "8",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.daysPerMonth).toBe("Enter a whole number of days.");
  });

  it("skips fields hidden by showIf", () => {
    const interest = CALCULATOR_ENGINES["interest"];
    const raw = defaultRawValues(interest.fields);
    raw.interestType = "simple";
    raw.compounding = "not-a-real-option";

    expect(isVisible(interest.fields.find((f) => f.name === "compounding")!, raw)).toBe(false);

    const result = validateFields(interest.fields, raw);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.values.compounding).toBeUndefined();
  });

  it("validates select options", () => {
    const loan = CALCULATOR_ENGINES["loan"];
    const raw = defaultRawValues(loan.fields);
    raw.termUnit = "centuries";
    const result = validateFields(loan.fields, raw);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.termUnit).toBe("Choose a valid option.");
  });
});

describe("formRawValues", () => {
  it("empties personal amount fields (with example placeholders) on every calculator", () => {
    for (const [slug, engine] of Object.entries(CALCULATOR_ENGINES)) {
      const raw = formRawValues(engine.fields);
      for (const def of engine.fields) {
        if (def.kind !== "number") continue;
        if (def.assumption) {
          expect(raw[def.name], `${slug}.${def.name}`).toBe(
            String(def.defaultValue),
          );
        } else {
          expect(raw[def.name], `${slug}.${def.name}`).toBe("");
          expect(
            def.placeholder,
            `${slug}.${def.name} needs an example placeholder`,
          ).toBeTruthy();
        }
      }
    }
  });

  it("keeps option defaults", () => {
    const raw = formRawValues(CALCULATOR_ENGINES["loan"].fields);
    expect(raw.termUnit).toBe("years");
    expect(raw.principal).toBe("");
  });

  it("requires emptied fields until the user types", () => {
    const sss = CALCULATOR_ENGINES["sss"];
    const result = validateFields(sss.fields, formRawValues(sss.fields));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.monthlySalary).toBe(
        "Enter your monthly compensation used for the SSS estimate.",
      );
    }
  });

  it("keeps labeled assumptions usable as-is", () => {
    const salary = CALCULATOR_ENGINES["daily-hourly-salary"];
    const result = validateFields(
      salary.fields,
      formRawValues(salary.fields),
    );
    expect(result.ok).toBe(false); // amount still required
    if (!result.ok) {
      expect(result.errors.amount).toBe("Enter your salary amount.");
      expect(result.errors.daysPerMonth).toBeUndefined();
      expect(result.errors.hoursPerDay).toBeUndefined();
    }
  });
});
