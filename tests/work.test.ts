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

describe("13th month pay", () => {
  const calc = engine("13th-month-pay");

  it("pays one month for a full year", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 25000, monthsWorked: 12 })),
    );
    expect(emphasisValue(lines)).toBe("₱25,000.00");
    expect(valueOf(lines, "Total basic salary earned")).toBe("₱300,000.00");
  });

  it("prorates partial years", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 20000, monthsWorked: 6 })),
    );
    expect(emphasisValue(lines)).toBe("₱10,000.00");
  });

  it("rounds to centavos", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 25000, monthsWorked: 7 })),
    );
    expect(emphasisValue(lines)).toBe("₱14,583.33");
  });

  it("accepts partial (decimal) months", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { monthlySalary: 25000, monthsWorked: 7.5 }),
      ),
    );
    expect(valueOf(lines, "Total basic salary earned")).toBe("₱187,500.00");
    expect(emphasisValue(lines)).toBe("₱15,625.00");
  });

  it("handles large salaries", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 999999999, monthsWorked: 12 })),
    );
    expect(emphasisValue(lines)).toBe("₱999,999,999.00");
  });

  it("handles a decimal salary", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { monthlySalary: 25000.5, monthsWorked: 12 }),
      ),
    );
    expect(valueOf(lines, "Total basic salary earned")).toBe("₱300,006.00");
    expect(emphasisValue(lines)).toBe("₱25,000.50");
  });

  it("rejects zero months at the engine level", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { monthlySalary: 25000, monthsWorked: 0 }),
    );
    expectError(
      outcome,
      "Enter at least 1 month — partial months like 1.5 or 7.5 are fine.",
    );
  });

  it("rejects zero months at the field level", () => {
    const raw = defaultRawValues(calc.fields);
    raw.monthsWorked = "0";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.monthsWorked).toBe(
        "Enter at least 1 month — partial months like 1.5 or 7.5 are fine.",
      );
    }
  });

  it("rejects fractional months below 1 at the field level", () => {
    for (const v of ["0.01", "0.5", "0.99"]) {
      const raw = defaultRawValues(calc.fields);
      raw.monthsWorked = v;
      const result = validateFields(calc.fields, raw);
      expect(result.ok, `monthsWorked=${v}`).toBe(false);
    }
  });

  it("accepts 1, 1.5, and 12 months at the field level", () => {
    for (const v of ["1", "1.5", "12"]) {
      const raw = defaultRawValues(calc.fields);
      raw.monthsWorked = v;
      const result = validateFields(calc.fields, raw);
      expect(result.ok, `monthsWorked=${v}`).toBe(true);
    }
  });

  it("rejects more than 12 months", () => {
    const raw = defaultRawValues(calc.fields);
    raw.monthsWorked = "13";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.monthsWorked).toBe(
        "There are only 12 months in a calendar year.",
      );
    }
  });

  it("returns a readable error for non-finite salary", () => {
    const outcome = calc.calculate({
      monthlySalary: Number.NaN,
      monthsWorked: 12,
    });
    expect(outcome.ok).toBe(false);
  });
});

describe("overtime pay", () => {
  const calc = engine("overtime-pay");

  it("pays 125% of hourly on an ordinary day", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          rateBasis: "daily",
          rate: 640,
          dayType: "ordinary",
          overtimeHours: 3,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱300.00");
    expect(valueOf(lines, "Overtime rate per hour")).toBe("₱100.00");
    expect(valueOf(lines, "Regular hourly rate")).toBe("₱80.00");
  });

  it("pays 169% on a rest day", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          rate: 640,
          dayType: "rest-day",
          overtimeHours: 2,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱270.40");
  });

  it("pays 260% on a regular holiday", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          rate: 640,
          dayType: "regular-holiday",
          overtimeHours: 2,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱416.00");
  });

  it("pays 338% on a regular holiday that is also a rest day", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          rate: 640,
          dayType: "holiday-rest",
          overtimeHours: 2,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱540.80");
  });

  it("accepts an hourly rate directly", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          rateBasis: "hourly",
          rate: 100,
          dayType: "ordinary",
          overtimeHours: 1,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱125.00");
  });

  it("handles decimal overtime hours", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          rate: 640,
          dayType: "ordinary",
          overtimeHours: 1.5,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱150.00");
  });

  it("rejects an unknown day type", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { dayType: "not-a-day" }),
    );
    expectError(outcome, "Choose a valid type of day.");
  });

  it("computes zero pay for zero overtime hours", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { overtimeHours: 0 })),
    );
    expect(emphasisValue(lines)).toBe("₱0.00");
  });

  it("accepts 16 overtime hours (24-hour day minus the regular 8)", () => {
    const raw = defaultRawValues(calc.fields);
    raw.overtimeHours = "16";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(true);
  });

  it("rejects more than 16 overtime hours", () => {
    const raw = defaultRawValues(calc.fields);
    raw.overtimeHours = "17";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.overtimeHours).toBe(
        "For this calculator, overtime is limited to 16 hours so the modeled workday does not exceed 24 hours.",
      );
    }
  });

  it("rejects 24 overtime hours (the old unrealistic maximum)", () => {
    const raw = defaultRawValues(calc.fields);
    raw.overtimeHours = "24";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(false);
  });

  it("accepts 0 overtime hours at the field level", () => {
    const raw = defaultRawValues(calc.fields);
    raw.overtimeHours = "0";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(true);
  });
});

describe("night differential", () => {
  const calc = engine("night-differential");

  it("adds 10% for daily-rate night hours", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { rateBasis: "daily", rate: 640, nightHours: 4 }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱32.00");
    expect(valueOf(lines, "Night premium per hour")).toBe("₱8.00");
  });

  it("works from an hourly rate", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { rateBasis: "hourly", rate: 100, nightHours: 8 }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱80.00");
  });

  it("works from a monthly salary over 208 hours", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          rateBasis: "monthly",
          rate: 25000,
          monthlyHours: 208,
          nightHours: 4,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱48.08");
  });

  it("handles decimal night hours", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { rateBasis: "daily", rate: 640, nightHours: 2.5 }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱20.00");
  });

  it("computes zero premium for zero night hours", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { nightHours: 0 })),
    );
    expect(emphasisValue(lines)).toBe("₱0.00");
  });

  it("rejects more than 8 night hours", () => {
    const raw = defaultRawValues(calc.fields);
    raw.nightHours = "9";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.nightHours).toBe(
        "The 10 PM–6 AM window is only 8 hours long.",
      );
    }
  });

  it("accepts 0 night hours at the field level", () => {
    const raw = defaultRawValues(calc.fields);
    raw.nightHours = "0";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(true);
  });
});

describe("daily/hourly salary conversion", () => {
  const calc = engine("daily-hourly-salary");

  it("converts monthly to daily and hourly (26-day divisor)", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { basis: "monthly", amount: 25000 })),
    );
    expect(valueOf(lines, "Daily rate")).toBe("₱961.54");
    expect(valueOf(lines, "Hourly rate")).toBe("₱120.19");
    expect(emphasisValue(lines)).toBe("₱961.54");
  });

  it("converts daily to hourly and monthly", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { basis: "daily", amount: 1000 })),
    );
    expect(emphasisValue(lines)).toBe("₱125.00");
    expect(valueOf(lines, "Monthly equivalent")).toBe("₱26,000.00");
  });

  it("converts hourly back up to daily and monthly", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { basis: "hourly", amount: 150 })),
    );
    expect(emphasisValue(lines)).toBe("₱1,200.00");
    expect(valueOf(lines, "Monthly equivalent")).toBe("₱31,200.00");
  });

  it("respects custom divisors", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, { basis: "monthly", amount: 30000, daysPerMonth: 30 }),
      ),
    );
    expect(valueOf(lines, "Daily rate")).toBe("₱1,000.00");
  });

  it("handles decimal rates", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { basis: "daily", amount: 850.5 })),
    );
    expect(emphasisValue(lines)).toBe("₱106.31");
    expect(valueOf(lines, "Monthly equivalent")).toBe("₱22,113.00");
  });

  it("rejects a zero amount at the engine level", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { basis: "monthly", amount: 0 }),
    );
    expectError(outcome, "Enter an amount greater than 0.");
  });

  it("handles very large amounts without NaN", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { basis: "monthly", amount: 999999999 })),
    );
    expect(emphasisValue(lines)).toBe("₱38,461,538.42");
    expect(valueOf(lines, "Your monthly salary")).toBe("₱999,999,999.00");
    expect(valueOf(lines, "Hourly rate")).not.toMatch(/NaN|Infinity/);
  });
});
