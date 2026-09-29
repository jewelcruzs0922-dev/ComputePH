import { describe, expect, it } from "vitest";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { CALCULATORS } from "@/lib/registry";
import { defaultValues } from "./helpers";

const engine = (slug: string) => CALCULATOR_ENGINES[slug];

/**
 * §20/§24 audit regressions: hostile inputs must never throw and must never
 * surface NaN, Infinity, or undefined in a result line.
 */
describe("engine robustness against hostile inputs", () => {
  const hostile = [
    Number.NaN,
    Number.POSITIVE_INFINITY,
    -1,
    -0.5,
    0,
    0.001,
    1e15,
  ];

  it("never throws and never renders NaN/Infinity/undefined", () => {
    for (const meta of CALCULATORS) {
      const calc = engine(meta.slug);
      const base = defaultValues(calc);
      for (const def of calc.fields) {
        if (def.kind !== "number") continue;
        for (const v of hostile) {
          const values = { ...base, [def.name]: v };
          const outcome = calc.calculate(values);
          if (outcome.ok) {
            expect(outcome.lines.length, meta.slug).toBeGreaterThan(0);
            for (const line of outcome.lines) {
              expect(
                line.value,
                `${meta.slug}.${def.name}=${String(v)} → ${line.label}`,
              ).not.toMatch(/NaN|Infinity|undefined/);
            }
          } else {
            expect(
              outcome.error.length,
              `${meta.slug}.${def.name}=${String(v)}`,
            ).toBeGreaterThan(10);
          }
        }
      }
    }
  });

  it("produces ok outcomes from every calculator's default values", () => {
    for (const meta of CALCULATORS) {
      const calc = engine(meta.slug);
      const outcome = calc.calculate(defaultValues(calc));
      expect(outcome.ok, meta.slug).toBe(true);
    }
  });
});

describe("content does not claim features the calculators lack", () => {
  it("discount metadata mentions no preset", () => {
    const meta = CALCULATORS.find((c) => c.slug === "discount");
    expect(meta).toBeDefined();
    expect(`${meta!.summary} ${meta!.description}`).not.toMatch(/preset/i);
  });
});
