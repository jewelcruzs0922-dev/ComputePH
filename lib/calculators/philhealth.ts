import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatPeso } from "@/lib/utils/money";
import { computePhilHealth, RULES_PHILHEALTH } from "@/lib/rules/philhealth";

export const fields: FieldDef[] = [
  {
    kind: "number",
    name: "monthlySalary",
    label: "Monthly basic salary",
    hint: "Premiums are capped between ₱10,000 and ₱100,000.",
    prefix: "₱",
    min: 0,
    max: 999_999_999,
    step: "any",
    defaultValue: 25000,
    placeholder: "e.g. 25,000",
    wide: true,
    messages: {
      required: "Enter your monthly basic salary.",
      min: "Salary cannot be negative.",
      max: "That amount is too large to compute.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const salary = values.monthlySalary as number;

  if (!Number.isFinite(salary) || salary <= 0) {
    return {
      ok: false,
      error:
        "Enter your monthly basic salary above ₱0 — PhilHealth premiums are based on the salary actually paid, so there is nothing to compute for a ₱0 salary. For salaries from ₱1 to ₱10,000, the ₱10,000 income floor applies.",
    };
  }

  const result = computePhilHealth(salary);

  if (!Number.isFinite(result.totalPremium)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const lines: ResultLine[] = [
    {
      label: "Your PhilHealth share (employee)",
      value: formatPeso(result.employeeShare),
      hint: "2.5% of the contribution base",
      emphasis: true,
    },
    {
      label: "Employer share",
      value: formatPeso(result.employerShare),
      hint: "2.5% — the same rate as the employee",
    },
    {
      label: "Total monthly premium",
      value: formatPeso(result.totalPremium),
      hint: "5% of the contribution base",
    },
    {
      label: "Contribution base",
      value: formatPeso(result.base),
      hint:
        result.adjusted === "floor"
          ? "Adjusted up to the ₱10,000 income floor"
          : result.adjusted === "ceiling"
            ? "Adjusted down to the ₱100,000 income ceiling"
            : "Equal to your monthly basic salary",
    },
    {
      label: "Premium rate",
      value: "5% (2.5% each)",
      hint: `Schedule for ${RULES_PHILHEALTH.effective}`,
    },
  ];

  return { ok: true, lines };
}
