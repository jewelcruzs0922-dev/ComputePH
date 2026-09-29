import { describe, expect, it } from "vitest";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { computeAnnualIncomeTax } from "@/lib/rules/incomeTax";
import { defaultRawValues, validateFields } from "@/lib/utils/validate";
import {
  emphasisValue,
  expectOk,
  valueOf,
  valuesWith,
} from "./helpers";

const engine = (slug: string) => CALCULATOR_ENGINES[slug];

describe("SSS contribution (schedule eff. Jan 1, 2025)", () => {
  const calc = engine("sss");

  it("computes the employee share on the MSC bracket", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 25000 })),
    );
    expect(emphasisValue(lines)).toBe("₱1,250.00");
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱25,000.00");
    expect(valueOf(lines, "Employer share")).toBe("₱2,500.00");
    expect(valueOf(lines, "Employers' Compensation (EC)")).toBe("₱30.00");
    expect(valueOf(lines, "Total remitted to SSS")).toBe("₱3,780.00");
    expect(valueOf(lines, "MSC portion credited to MPF")).toBe(
      "₱5,000.00",
    );
  });

  it("rounds salary up to the nearest ₱500 bracket", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 22400 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱22,500.00");
    expect(emphasisValue(lines)).toBe("₱1,125.00");
  });

  it("maps salary 5,249 to the floor MSC", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 5249 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱5,000.00");
    expect(emphasisValue(lines)).toBe("₱250.00");
    expect(valueOf(lines, "Employers' Compensation (EC)")).toBe("₱10.00");
  });

  it("maps salary 5,250 to MSC 5,500", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 5250 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱5,500.00");
  });

  it("caps at the ₱35,000 ceiling", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 10000000 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱35,000.00");
    expect(emphasisValue(lines)).toBe("₱1,750.00");
    expect(valueOf(lines, "Total remitted to SSS")).toBe("₱5,280.00");
    expect(valueOf(lines, "MSC portion credited to MPF")).toBe(
      "₱15,000.00",
    );
  });

  it("rejects a zero salary instead of applying the contribution floor", () => {
    const outcome = calc.calculate(valuesWith(calc, { monthlySalary: 0 }));
    expect(outcome.ok).toBe(false);
    if (!outcome.ok)
      expect(outcome.error).toContain("Enter monthly compensation above ₱0");
  });

  it("rejects a non-finite salary", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { monthlySalary: Number.NaN }),
    );
    expect(outcome.ok).toBe(false);
  });

  it("rejects a negative salary", () => {
    const outcome = calc.calculate(valuesWith(calc, { monthlySalary: -1000 }));
    expect(outcome.ok).toBe(false);
    if (!outcome.ok)
      expect(outcome.error).toContain("Enter monthly compensation above ₱0");
  });

  it("applies the minimum MSC to a real salary of ₱1", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 1 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱5,000.00");
    expect(emphasisValue(lines)).toBe("₱250.00");
    expect(valueOf(lines, "Employers' Compensation (EC)")).toBe("₱10.00");
  });

  it("reports ₱30 EC and ₱3,030 total at MSC ₱20,000 (FAQ regression)", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 20000 })),
    );
    expect(valueOf(lines, "Employers' Compensation (EC)")).toBe("₱30.00");
    expect(valueOf(lines, "Total remitted to SSS")).toBe("₱3,030.00");
  });

  it("switches EC from ₱10 to ₱30 at the MSC ₱15,000 boundary", () => {
    const below = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 14749 })),
    );
    expect(valueOf(below, "Monthly Salary Credit (MSC)")).toBe("₱14,500.00");
    expect(valueOf(below, "Employers' Compensation (EC)")).toBe("₱10.00");

    const at = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 14750 })),
    );
    expect(valueOf(at, "Monthly Salary Credit (MSC)")).toBe("₱15,000.00");
    expect(valueOf(at, "Employers' Compensation (EC)")).toBe("₱30.00");
  });

  it("flags a negative salary at the field level", () => {
    const raw = defaultRawValues(calc.fields);
    raw.monthlySalary = "-500";
    const result = validateFields(calc.fields, raw);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.monthlySalary).toBe(
        "Compensation cannot be negative.",
      );
    }
  });

  it("rounds 34,749 down to MSC 34,500", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 34749 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱34,500.00");
    expect(emphasisValue(lines)).toBe("₱1,725.00");
    expect(valueOf(lines, "MSC portion credited to MPF")).toBe(
      "₱14,500.00",
    );
  });

  it("rounds 34,750 up to the ₱35,000 ceiling", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 34750 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱35,000.00");
    expect(emphasisValue(lines)).toBe("₱1,750.00");
    expect(valueOf(lines, "Total remitted to SSS")).toBe("₱5,280.00");
    expect(valueOf(lines, "MSC portion credited to MPF")).toBe(
      "₱15,000.00",
    );
  });

  it("shows no MPF line at the ₱20,000 threshold", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 20000 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱20,000.00");
    expect(emphasisValue(lines)).toBe("₱1,000.00");
    expect(
      lines.some((line) => line.label.startsWith("MSC portion credited to MPF")),
    ).toBe(false);
  });

  it("adds a ₱500 MPF portion just above the threshold", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 20250 })),
    );
    expect(valueOf(lines, "Monthly Salary Credit (MSC)")).toBe("₱20,500.00");
    expect(emphasisValue(lines)).toBe("₱1,025.00");
    expect(valueOf(lines, "MSC portion credited to MPF")).toBe(
      "₱500.00",
    );
  });
});

describe("PhilHealth premium (CY 2026, 5%)", () => {
  const calc = engine("philhealth");

  it("splits the 5% premium equally for an employed member", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 25000 })),
    );
    expect(emphasisValue(lines)).toBe("₱625.00");
    expect(valueOf(lines, "Employer share")).toBe("₱625.00");
    expect(valueOf(lines, "Total monthly premium")).toBe("₱1,250.00");
    expect(valueOf(lines, "Contribution base")).toBe("₱25,000.00");
  });

  it("applies the ₱10,000 income floor", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 8000 })),
    );
    expect(valueOf(lines, "Contribution base")).toBe("₱10,000.00");
    expect(valueOf(lines, "Total monthly premium")).toBe("₱500.00");
    expect(emphasisValue(lines)).toBe("₱250.00");
  });

  it("does not adjust salaries already at the floor", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 10000 })),
    );
    expect(valueOf(lines, "Contribution base")).toBe("₱10,000.00");
    expect(valueOf(lines, "Total monthly premium")).toBe("₱500.00");
  });

  it("applies the ₱100,000 income ceiling", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 150000 })),
    );
    expect(valueOf(lines, "Contribution base")).toBe("₱100,000.00");
    expect(valueOf(lines, "Total monthly premium")).toBe("₱5,000.00");
    expect(emphasisValue(lines)).toBe("₱2,500.00");
  });

  it("rejects a zero salary instead of applying the income floor", () => {
    const outcome = calc.calculate(valuesWith(calc, { monthlySalary: 0 }));
    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.error).toContain("₱0 salary");
  });

  it("rejects a non-finite salary", () => {
    const outcome = calc.calculate(
      valuesWith(calc, { monthlySalary: Number.NaN }),
    );
    expect(outcome.ok).toBe(false);
  });

  it("applies the income floor to a real salary of ₱1", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 1 })),
    );
    expect(valueOf(lines, "Contribution base")).toBe("₱10,000.00");
    expect(valueOf(lines, "Total monthly premium")).toBe("₱500.00");
    expect(emphasisValue(lines)).toBe("₱250.00");
  });

  it("pulls a salary just below the floor up to ₱10,000", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 9999 })),
    );
    expect(valueOf(lines, "Contribution base")).toBe("₱10,000.00");
    expect(valueOf(lines, "Total monthly premium")).toBe("₱500.00");
    expect(emphasisValue(lines)).toBe("₱250.00");
  });

  it("pulls a salary just above the ceiling down to ₱100,000", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 100001 })),
    );
    expect(valueOf(lines, "Contribution base")).toBe("₱100,000.00");
    expect(valueOf(lines, "Total monthly premium")).toBe("₱5,000.00");
    expect(emphasisValue(lines)).toBe("₱2,500.00");
  });

  it("keeps an unadjusted salary inside the brackets", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 99999 })),
    );
    expect(valueOf(lines, "Contribution base")).toBe("₱99,999.00");
    expect(valueOf(lines, "Total monthly premium")).toBe("₱4,999.95");
    expect(emphasisValue(lines)).toBe("₱2,499.98");
  });
});

describe("Pag-IBIG contribution (Circular 460)", () => {
  const calc = engine("pag-ibig");

  it("caps the fund salary at ₱10,000", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 25000 })),
    );
    expect(emphasisValue(lines)).toBe("₱200.00");
    expect(valueOf(lines, "Employer share")).toBe("₱200.00");
    expect(valueOf(lines, "Total monthly savings")).toBe("₱400.00");
    expect(valueOf(lines, "Fund salary used")).toBe("₱10,000.00");
  });

  it("uses the 1% rate at or below ₱1,500", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 1500 })),
    );
    expect(emphasisValue(lines)).toBe("₱15.00");
    expect(valueOf(lines, "Employer share")).toBe("₱30.00");
    expect(valueOf(lines, "Total monthly savings")).toBe("₱45.00");
  });

  it("uses the 1% rate for salaries below ₱1,500", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 1200 })),
    );
    expect(emphasisValue(lines)).toBe("₱12.00");
    expect(valueOf(lines, "Total monthly savings")).toBe("₱36.00");
  });

  it("switches to 2% just above ₱1,500", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 1501 })),
    );
    expect(emphasisValue(lines)).toBe("₱30.02");
    expect(valueOf(lines, "Total monthly savings")).toBe("₱60.04");
  });

  it("handles a zero salary", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 0 })),
    );
    expect(emphasisValue(lines)).toBe("₱0.00");
    expect(valueOf(lines, "Total monthly savings")).toBe("₱0.00");
  });

  it("caps exactly at the ₱10,000 fund salary", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 10000 })),
    );
    expect(emphasisValue(lines)).toBe("₱200.00");
    expect(valueOf(lines, "Total monthly savings")).toBe("₱400.00");
    expect(valueOf(lines, "Fund salary used")).toBe("₱10,000.00");
  });

  it("caps salaries just above ₱10,000", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 10001 })),
    );
    expect(valueOf(lines, "Fund salary used")).toBe("₱10,000.00");
    expect(emphasisValue(lines)).toBe("₱200.00");
    expect(valueOf(lines, "Total monthly savings")).toBe("₱400.00");
  });

  it("applies 1% to salary just below ₱1,500", () => {
    const lines = expectOk(
      calc.calculate(valuesWith(calc, { monthlySalary: 1499 })),
    );
    expect(emphasisValue(lines)).toBe("₱14.99");
    expect(valueOf(lines, "Employer share")).toBe("₱29.98");
    expect(valueOf(lines, "Total monthly savings")).toBe("₱44.97");
  });
});

describe("income tax (TRAIN graduated rates)", () => {
  const calc = engine("income-tax");

  it("matches the worked example: ₱40,000/month with contributions", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          monthlyGross: 40000,
          monthlyContributions: 2450,
          annualBenefits: 40000,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱2,718.33");
    expect(valueOf(lines, "Estimated annual Philippine income tax")).toBe("₱32,620.00");
    expect(valueOf(lines, "Annual taxable income")).toBe("₱450,600.00");
    expect(valueOf(lines, "Tax-exempt benefits")).toBe("₱40,000.00");
  });

  it("charges no tax below the ₱250,000 annual exemption", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          monthlyGross: 20000,
          monthlyContributions: 0,
          annualBenefits: 0,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱0.00");
    expect(valueOf(lines, "Annual taxable income")).toBe("₱240,000.00");
  });

  it("adds only the benefits above ₱90,000 to taxable income", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          monthlyGross: 30000,
          monthlyContributions: 0,
          annualBenefits: 100000,
        }),
      ),
    );
    expect(valueOf(lines, "Tax-exempt benefits")).toBe("₱90,000.00");
    expect(valueOf(lines, "Annual taxable income")).toBe("₱370,000.00");
    expect(valueOf(lines, "Estimated annual Philippine income tax")).toBe("₱18,000.00");
    expect(emphasisValue(lines)).toBe("₱1,500.00");
  });

  it("stays tax-free when excess benefits keep income below ₱250,000", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          monthlyGross: 0,
          monthlyContributions: 0,
          annualBenefits: 100000,
        }),
      ),
    );
    expect(valueOf(lines, "Tax-exempt benefits")).toBe("₱90,000.00");
    expect(valueOf(lines, "Annual taxable income")).toBe("₱10,000.00");
    expect(emphasisValue(lines)).toBe("₱0.00");
  });

  it("exempts benefits exactly at the ₱90,000 ceiling", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          monthlyGross: 0,
          monthlyContributions: 0,
          annualBenefits: 90000,
        }),
      ),
    );
    expect(valueOf(lines, "Annual taxable income")).toBe("₱0.00");
    expect(emphasisValue(lines)).toBe("₱0.00");
  });

  it("deducts contributions from taxable income", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          monthlyGross: 30000,
          monthlyContributions: 1500,
          annualBenefits: 0,
        }),
      ),
    );
    expect(valueOf(lines, "Annual taxable income")).toBe("₱342,000.00");
    expect(valueOf(lines, "Estimated annual Philippine income tax")).toBe("₱13,800.00");
    expect(emphasisValue(lines)).toBe("₱1,150.00");
  });

  it("handles an all-zero salary", () => {
    const lines = expectOk(
      calc.calculate(
        valuesWith(calc, {
          monthlyGross: 0,
          monthlyContributions: 0,
          annualBenefits: 0,
        }),
      ),
    );
    expect(emphasisValue(lines)).toBe("₱0.00");
  });
});


describe("annual income tax bracket boundaries", () => {
  it("is zero through the ₱250,000 exemption", () => {
    expect(computeAnnualIncomeTax(0)).toBe(0);
    expect(computeAnnualIncomeTax(250000)).toBe(0);
  });

  it("enters the 15% bracket immediately above ₱250,000", () => {
    expect(computeAnnualIncomeTax(250001)).toBeCloseTo(0.15, 6);
    expect(computeAnnualIncomeTax(400000)).toBe(22500);
  });

  it("enters the 20% bracket immediately above ₱400,000", () => {
    expect(computeAnnualIncomeTax(400001)).toBeCloseTo(22500.2, 6);
    expect(computeAnnualIncomeTax(800000)).toBe(102500);
  });

  it("enters the 25% bracket immediately above ₱800,000", () => {
    expect(computeAnnualIncomeTax(800001)).toBeCloseTo(102500.25, 6);
    expect(computeAnnualIncomeTax(2000000)).toBe(402500);
  });

  it("enters the 30% bracket immediately above ₱2,000,000", () => {
    expect(computeAnnualIncomeTax(2000001)).toBeCloseTo(402500.3, 6);
    expect(computeAnnualIncomeTax(8000000)).toBe(2202500);
  });

  it("enters the 35% bracket immediately above ₱8,000,000", () => {
    expect(computeAnnualIncomeTax(8000001)).toBeCloseTo(2202500.35, 6);
    expect(computeAnnualIncomeTax(10000000)).toBe(2902500);
  });

  it("clamps negative and non-finite income to zero", () => {
    expect(computeAnnualIncomeTax(-1)).toBe(0);
    expect(computeAnnualIncomeTax(Number.NaN)).toBe(0);
    expect(computeAnnualIncomeTax(Number.POSITIVE_INFINITY)).toBe(0);
  });
});
