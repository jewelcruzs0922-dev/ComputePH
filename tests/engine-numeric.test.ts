import { describe, expect, it } from "vitest";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { defaultRawValues, validateFields } from "@/lib/utils/validate";
import { emphasisValue, expectError, expectOk, valuesWith } from "./helpers";


const engine = (slug: string) => CALCULATOR_ENGINES[slug];

const GENERIC = "Those values can’t be computed. Please check them.";

/** Every ok outcome must contain no negative money lines. */
function expectNoNegativeValues(
  lines: ReturnType<typeof expectOk>,
  label: string,
) {
  for (const line of lines) {
    expect(line.value, `${label} → ${line.label}`).not.toMatch(/-₱/);
  }
}

describe("13th month engine-level validation", () => {
  const calc = engine("13th-month-pay");

  it("rejects months below 1 (0, 0.5, 0.99) when called directly", () => {
    for (const m of [0, 0.5, 0.99]) {
      const out = calc.calculate(
        valuesWith(calc, { monthlySalary: 25000, monthsWorked: m }),
      );
      expectError(
        out,
        "Enter at least 1 month — partial months like 1.5 or 7.5 are fine.",
      );
    }
  });

  it("rejects more than 12 months", () => {
    const out = calc.calculate(
      valuesWith(calc, { monthlySalary: 25000, monthsWorked: 12.1 }),
    );
    expectError(out, "There are only 12 months in a calendar year.");
  });

  it("rejects zero and negative salaries", () => {
    for (const s of [0, -1]) {
      const out = calc.calculate(
        valuesWith(calc, { monthlySalary: s, monthsWorked: 12 }),
      );
      expectError(out, "Enter an amount greater than 0.");
    }
  });

  it("rejects a non-finite salary", () => {
    const out = calc.calculate(
      valuesWith(calc, { monthlySalary: Number.NaN, monthsWorked: 12 }),
    );
    expectError(out, GENERIC);
  });

  it("accepts 1, 1.5, 7.5, and 12 months", () => {
    for (const m of [1, 1.5, 7.5, 12]) {
      const out = calc.calculate(
        valuesWith(calc, { monthlySalary: 25000, monthsWorked: m }),
      );
      expect(out.ok, `months=${m}`).toBe(true);
    }
  });
});

describe("Pag-IBIG engine-level validation", () => {
  const calc = engine("pag-ibig");

  it("rejects a negative compensation", () => {
    const out = calc.calculate(valuesWith(calc, { monthlySalary: -1 }));
    expectError(out, "Compensation cannot be negative.");
  });

  it("rejects a non-finite compensation", () => {
    const out = calc.calculate(
      valuesWith(calc, { monthlySalary: Number.POSITIVE_INFINITY }),
    );
    expectError(out, GENERIC);
  });

  it("handles zero salary explicitly as ₱0 (no negative contribution)", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 0 })),
    );
    expect(emphasisValue(lines)).toBe("₱0.00");
    expectNoNegativeValues(lines, "pag-ibig zero");
  });

  it("computes correct decimal contributions without negatives", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 1500.5 })),
    );
    expect(emphasisValue(lines)).toBe("₱30.01");
    expectNoNegativeValues(lines, "pag-ibig decimal");
  });
});

describe("overtime engine-level validation", () => {
  const calc = engine("overtime-pay");

  it("rejects negative hours", () => {
    const out = calc.calculate(valuesWith(calc, { overtimeHours: -1 }));
    expectError(out, "Enter 0 or more overtime hours.");
  });

  it("rejects hours above the 16-hour modeling limit", () => {
    const out = calc.calculate(valuesWith(calc, { overtimeHours: 17 }));
    expectError(
      out,
      "For this calculator, overtime is limited to 16 hours so the modeled workday does not exceed 24 hours.",
    );
  });

  it("rejects zero and negative rates", () => {
    for (const r of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { rate: r }));
      expectError(out, "Enter an amount greater than 0.");
    }
  });

  it("accepts 0 and 16 hours and decimal hours", () => {
    for (const h of [0, 16, 1.5]) {
      const out = calc.calculate(valuesWith(calc, { overtimeHours: h }));
      expect(out.ok, `hours=${h}`).toBe(true);
    }
  });
});

describe("night differential engine-level validation", () => {
  const calc = engine("night-differential");

  it("rejects zero and negative rates", () => {
    for (const r of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { rate: r }));
      expectError(out, "Enter an amount greater than 0.");
    }
  });

  it("rejects negative night hours", () => {
    const out = calc.calculate(valuesWith(calc, { nightHours: -1 }));
    expectError(out, "Enter 0 or more night hours.");
  });

  it("rejects hours beyond the 8-hour night window", () => {
    const out = calc.calculate(valuesWith(calc, { nightHours: 9 }));
    expectError(out, "The 10 PM–6 AM window is only 8 hours long.");
  });

  it("rejects a zero monthly-hours divisor on the monthly basis", () => {
    const out = calc.calculate(
      valuesWith(calc, { rateBasis: "monthly", rate: 30000, monthlyHours: 0 }),
    );
    expectError(out, "Enter at least 1 hour.");
  });

  it("accepts boundary hours 0 and 8", () => {
    for (const h of [0, 8]) {
      const out = calc.calculate(valuesWith(calc, { nightHours: h }));
      expect(out.ok, `hours=${h}`).toBe(true);
    }
  });
});

describe("daily/hourly salary engine-level validation", () => {
  const calc = engine("daily-hourly-salary");

  it("rejects zero and negative amounts", () => {
    for (const a of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { amount: a }));
      expectError(out, "Enter an amount greater than 0.");
    }
  });

  it("rejects zero working days and hours", () => {
    expectError(
      calc.calculate(valuesWith(calc, { daysPerMonth: 0 })),
      "Enter at least 1 day.",
    );
    expectError(
      calc.calculate(valuesWith(calc, { hoursPerDay: 0 })),
      "Enter at least 1 hour.",
    );
  });

  it("accepts decimal amounts", () => {
    const out = calc.calculate(valuesWith(calc, { amount: 850.5 }));
    expect(out.ok).toBe(true);
  });
});

describe("discount engine-level validation", () => {
  const calc = engine("discount");

  it("rejects zero and negative prices", () => {
    for (const p of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { price: p }));
      expectError(out, "Enter an amount greater than 0.");
    }
  });

  it("rejects a negative discount rate", () => {
    const out = calc.calculate(valuesWith(calc, { discountRate: -1 }));
    expectError(out, "Discount rate cannot be negative.");
  });

  it("rejects a discount rate above 100%", () => {
    const out = calc.calculate(valuesWith(calc, { discountRate: 101 }));
    expectError(out, "A discount cannot be more than 100%.");
  });

  it("never prices above the original at the 0% and 100% boundaries", () => {
    const at0 = expectOk(
      calc.calculate(valuesWith(calc, { price: 1500, discountRate: 0 })),
    );
    expect(emphasisValue(at0)).toBe("₱1,500.00");
    const at100 = expectOk(
      calc.calculate(valuesWith(calc, { price: 1500, discountRate: 100 })),
    );
    expect(emphasisValue(at100)).toBe("₱0.00");
  });
});

describe("installment engine-level validation", () => {
  const calc = engine("installment");

  it("rejects zero and negative prices", () => {
    for (const p of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { price: p }));
      expectError(out, "Enter an amount greater than 0.");
    }
  });

  it("rejects a negative down payment", () => {
    const out = calc.calculate(valuesWith(calc, { downPayment: -1 }));
    expectError(out, "Down payment cannot be negative.");
  });

  it("rejects negative and above-100% rates", () => {
    expectError(
      calc.calculate(valuesWith(calc, { annualRate: -1 })),
      "Interest rate cannot be negative.",
    );
    expectError(
      calc.calculate(valuesWith(calc, { annualRate: 101 })),
      "Rates above 100% are not supported.",
    );
  });

  it("rejects zero and above-600-month terms", () => {
    expectError(
      calc.calculate(valuesWith(calc, { months: 0 })),
      "Enter at least 1 monthly payment.",
    );
    expectError(
      calc.calculate(valuesWith(calc, { months: 601 })),
      "Terms above 600 months are not supported.",
    );
  });

  it("rejects fractional payment counts at the field level", () => {
    for (const v of ["0", "-1", "12.5", "24.5", "600.5", "601"]) {
      const raw = defaultRawValues(calc.fields);
      raw.months = v;
      const result = validateFields(calc.fields, raw);
      expect(result.ok, `months=${v}`).toBe(false);
    }
  });

  it("accepts whole payment counts at the field level", () => {
    for (const v of ["1", "2", "12", "24", "60", "600"]) {
      const raw = defaultRawValues(calc.fields);
      raw.months = v;
      const result = validateFields(calc.fields, raw);
      expect(result.ok, `months=${v}`).toBe(true);
    }
  });

  it("rejects fractional payment counts at the engine level", () => {
    expectError(
      calc.calculate(valuesWith(calc, { months: -1 })),
      "Enter at least 1 monthly payment.",
    );
    for (const m of [12.5, 24.5, 600.5]) {
      expectError(
        calc.calculate(valuesWith(calc, { months: m })),
        "Enter a whole number of monthly payments.",
      );
    }
    expectError(
      calc.calculate(valuesWith(calc, { months: 601 })),
      "Terms above 600 months are not supported.",
    );
  });

  it("accepts whole payment counts at the engine level", () => {
    for (const m of [1, 2, 12, 24, 60, 600]) {
      const out = calc.calculate(valuesWith(calc, { months: m }));
      expect(out.ok, `months=${m}`).toBe(true);
    }
  });

  it("accepts zero down payment and 0% plans with no negative balance", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          price: 12000,
          downPayment: 0,
          annualRate: 0,
          months: 12,
        }),
      ),
    );
    expectNoNegativeValues(lines, "installment zero-down");
    expect(emphasisValue(lines)).toBe("₱1,000.00");
  });
});

describe("loan engine-level validation", () => {
  const calc = engine("loan");

  it("rejects zero and negative principals", () => {
    for (const p of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { principal: p }));
      expectError(out, "Enter an amount greater than 0.");
    }
  });

  it("rejects negative and above-100% rates", () => {
    expectError(
      calc.calculate(valuesWith(calc, { annualRate: -1 })),
      "Interest rate cannot be negative.",
    );
    expectError(
      calc.calculate(valuesWith(calc, { annualRate: 101 })),
      "Rates above 100% are not supported.",
    );
  });

  it("rejects a zero or negative term", () => {
    const out = calc.calculate(
      valuesWith(calc, { termValue: 0, termUnit: "months" }),
    );
    expectError(out, "Enter a loan term of at least one month.");
  });

  it("accepts a decimal principal and a 0% rate", () => {
    const out = calc.calculate(
      valuesWith(calc, { principal: 12345.67, annualRate: 0 }),
    );
    expect(out.ok).toBe(true);
  });

  it("accepts whole month terms at both levels", () => {
    for (const v of ["1", "2", "12", "24", "60", "600"]) {
      const raw = defaultRawValues(calc.fields);
      raw.termUnit = "months";
      raw.termValue = v;
      expect(validateFields(calc.fields, raw).ok, `field months=${v}`).toBe(
        true,
      );
      const out = calc.calculate(
        valuesWith(calc, { termUnit: "months", termValue: Number(v) }),
      );
      expect(out.ok, `engine months=${v}`).toBe(true);
    }
  });

  it("rejects fractional month terms at both levels", () => {
    for (const v of ["12.5", "24.5", "600.5"]) {
      const raw = defaultRawValues(calc.fields);
      raw.termUnit = "months";
      raw.termValue = v;
      const fieldResult = validateFields(calc.fields, raw);
      expect(fieldResult.ok, `field months=${v}`).toBe(false);
      if (!fieldResult.ok) {
        expect(fieldResult.errors.termValue).toBe(
          "Enter a whole number of months.",
        );
      }
      expectError(
        calc.calculate(
          valuesWith(calc, { termUnit: "months", termValue: Number(v) }),
        ),
        "Enter a whole number of months.",
      );
    }
  });

  it("rejects zero and negative month terms", () => {
    for (const v of ["0", "-1"]) {
      const raw = defaultRawValues(calc.fields);
      raw.termUnit = "months";
      raw.termValue = v;
      expect(validateFields(calc.fields, raw).ok, `field months=${v}`).toBe(
        false,
      );
    }
    for (const v of [0, -1]) {
      expectError(
        calc.calculate(
          valuesWith(calc, { termUnit: "months", termValue: v }),
        ),
        "Enter a loan term of at least one month.",
      );
    }
  });

  it("rejects month terms above 600 at both levels", () => {
    const raw = defaultRawValues(calc.fields);
    raw.termUnit = "months";
    raw.termValue = "601";
    expect(validateFields(calc.fields, raw).ok).toBe(false);
    expectError(
      calc.calculate(
        valuesWith(calc, { termUnit: "months", termValue: 601 }),
      ),
      "The loan term must be 600 months (50 years) or less. Reduce the term and recalculate.",
    );
  });

  it("keeps decimal years valid at both levels", () => {
    const raw = defaultRawValues(calc.fields);
    raw.termUnit = "years";
    raw.termValue = "1.5";
    expect(validateFields(calc.fields, raw).ok).toBe(true);
    const out = calc.calculate(
      valuesWith(calc, { termUnit: "years", termValue: 1.5 }),
    );
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.lines.find((l) => l.label === "Term")?.value).toBe(
        "1.5 years (18 months)",
      );
    }
  });
});

describe("interest engine-level validation", () => {
  const calc = engine("interest");

  it("rejects zero and negative principals", () => {
    for (const p of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { principal: p }));
      expectError(out, "Enter an amount greater than 0.");
    }
  });

  it("rejects negative and above-1000% rates", () => {
    expectError(
      calc.calculate(valuesWith(calc, { annualRate: -1 })),
      "Interest rate cannot be negative.",
    );
    expectError(
      calc.calculate(valuesWith(calc, { annualRate: 1001 })),
      "That rate is too large to compute.",
    );
  });

  it("rejects zero and negative terms", () => {
    for (const t of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { termValue: t }));
      expectError(out, "Enter a term greater than 0.");
    }
  });

  it("rejects terms beyond 1,200 months (100 years)", () => {
    const out = calc.calculate(
      valuesWith(calc, { termUnit: "years", termValue: 101 }),
    );
    expectError(
      out,
      "That term is too long — the maximum is 1,200 months (100 years).",
    );
  });

  it("rejects an invalid compounding frequency even for simple interest", () => {
    const out = calc.calculate(
      valuesWith(calc, { interestType: "simple", compounding: "7" }),
    );
    expectError(out, "Choose a valid compounding frequency.");
  });

  it("accepts a decimal principal at 0%", () => {
    const out = calc.calculate(
      valuesWith(calc, { principal: 5000.75, annualRate: 0 }),
    );
    expect(out.ok).toBe(true);
  });
});

describe("SSS and PhilHealth engine-level validation", () => {
  it("SSS rejects zero and negative compensation", () => {
    const calc = engine("sss");
    for (const s of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { monthlySalary: s }));
      expect(out.ok).toBe(false);
      if (!out.ok) expect(out.error).toContain("Enter monthly compensation above ₱0");
    }
  });

  it("PhilHealth rejects zero and negative salary", () => {
    const calc = engine("philhealth");
    for (const s of [0, -1]) {
      const out = calc.calculate(valuesWith(calc, { monthlySalary: s }));
      expect(out.ok).toBe(false);
      if (!out.ok) expect(out.error).toContain("Enter your monthly basic salary above ₱0");
    }
  });
});

describe("income tax engine-level validation", () => {
  const calc = engine("income-tax");

  it("rejects negative gross, contributions, and benefits", () => {
    expectError(
      calc.calculate(valuesWith(calc, { monthlyGross: -1 })),
      "Amount cannot be negative.",
    );
    expectError(
      calc.calculate(valuesWith(calc, { monthlyContributions: -1 })),
      "Contributions cannot be negative.",
    );
    expectError(
      calc.calculate(valuesWith(calc, { annualBenefits: -1 })),
      "Benefits cannot be negative.",
    );
  });

  it("rejects non-finite inputs", () => {
    const out = calc.calculate(
      valuesWith(calc, { monthlyGross: Number.NaN }),
    );
    expectError(out, GENERIC);
  });

  it("accepts zero gross, contributions, and benefits", () => {
    const out = calc.calculate(
      valuesWith(calc, {
        monthlyGross: 0,
        monthlyContributions: 0,
        annualBenefits: 0,
      }),
    );
    expect(out.ok).toBe(true);
  });
});
