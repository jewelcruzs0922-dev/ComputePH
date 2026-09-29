import { describe, expect, it } from "vitest";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { defaultValues, expectError, valuesWith } from "./helpers";

const engine = (slug: string) => CALCULATOR_ENGINES[slug];

/**
 * The pure engines must never silently fall through on invalid internal enum
 * values — they must return a readable error through the normal outcome type.
 */
describe("enum hardening in calculation engines", () => {
  it("rejects an invalid loan term unit", () => {
    const calc = engine("loan");
    const out = calc.calculate(
      valuesWith(calc, { termUnit: "fortnights" }),
    );
    expectError(out, "Choose a valid loan term unit.");
  });

  it("still accepts both valid loan term units", () => {
    const calc = engine("loan");
    expect(calc.calculate(valuesWith(calc, { termUnit: "years" })).ok).toBe(true);
    expect(calc.calculate(valuesWith(calc, { termUnit: "months" })).ok).toBe(true);
  });

  it("rejects an invalid interest type", () => {
    const calc = engine("interest");
    const out = calc.calculate(
      valuesWith(calc, { interestType: "weird" }),
    );
    expectError(out, "Choose a valid interest type.");
  });

  it("rejects an invalid interest term unit", () => {
    const calc = engine("interest");
    const out = calc.calculate(valuesWith(calc, { termUnit: "centuries" }));
    expectError(out, "Choose a valid term unit.");
  });

  it("rejects an invalid compounding frequency", () => {
    const calc = engine("interest");
    const out = calc.calculate(
      valuesWith(calc, { interestType: "compound", compounding: "7" }),
    );
    expectError(out, "Choose a valid compounding frequency.");
  });

  it("still accepts every valid compounding frequency", () => {
    const calc = engine("interest");
    for (const n of ["1", "2", "4", "12", "365"]) {
      const out = calc.calculate(
        valuesWith(calc, { interestType: "compound", compounding: n }),
      );
      expect(out.ok, `compounding ${n}`).toBe(true);
    }
  });

  it("rejects an invalid installment method", () => {
    const calc = engine("installment");
    const out = calc.calculate(valuesWith(calc, { method: "lease" }));
    expectError(out, "Choose a valid payment method.");
  });

  it("still accepts both installment methods", () => {
    const calc = engine("installment");
    expect(calc.calculate(valuesWith(calc, { method: "addon" })).ok).toBe(true);
    expect(calc.calculate(valuesWith(calc, { method: "amortized" })).ok).toBe(true);
  });

  it("rejects an invalid salary basis", () => {
    const calc = engine("daily-hourly-salary");
    const out = calc.calculate(valuesWith(calc, { basis: "weekly" }));
    expectError(out, "Choose a valid pay basis.");
  });

  it("still accepts every salary basis", () => {
    const calc = engine("daily-hourly-salary");
    for (const b of ["monthly", "daily", "hourly"]) {
      expect(calc.calculate(valuesWith(calc, { basis: b })).ok, b).toBe(true);
    }
  });

  it("rejects an invalid night-differential basis", () => {
    const calc = engine("night-differential");
    const out = calc.calculate(valuesWith(calc, { rateBasis: "weekly" }));
    expectError(out, "Choose a valid pay basis.");
  });

  it("still accepts every night-differential basis", () => {
    const calc = engine("night-differential");
    expect(
      calc.calculate(valuesWith(calc, { rateBasis: "hourly" })).ok,
    ).toBe(true);
    expect(
      calc.calculate(valuesWith(calc, { rateBasis: "daily" })).ok,
    ).toBe(true);
    expect(
      calc.calculate(
        valuesWith(calc, { rateBasis: "monthly", monthlyHours: 208 }),
      ).ok,
    ).toBe(true);
  });

  it("rejects an invalid overtime basis (no silent daily fallthrough)", () => {
    const calc = engine("overtime-pay");
    const out = calc.calculate(valuesWith(calc, { rateBasis: "monthly" }));
    expectError(out, "Choose a valid pay basis.");
  });

  it("still accepts both overtime bases", () => {
    const calc = engine("overtime-pay");
    expect(calc.calculate(valuesWith(calc, { rateBasis: "hourly" })).ok).toBe(true);
    expect(calc.calculate(valuesWith(calc, { rateBasis: "daily" })).ok).toBe(true);
  });

  it("engines without enums keep working from defaults", () => {
    for (const slug of [
      "13th-month-pay",
      "sss",
      "philhealth",
      "pag-ibig",
      "income-tax",
      "discount",
    ]) {
      const calc = engine(slug);
      const out = calc.calculate(defaultValues(calc));
      expect(out.ok, slug).toBe(true);
    }
  });
});
