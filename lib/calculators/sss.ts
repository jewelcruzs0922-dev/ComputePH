import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPeso } from "@/lib/utils/money";
import { computeSss, RULES_SSS, SSS_MPF_THRESHOLD } from "@/lib/rules/sss";

export const fields: FieldDef[] = [
  {
    kind: "number",
    name: "monthlySalary",
    label: "Monthly compensation used for the SSS estimate",
    hint: "Used to find your Monthly Salary Credit (MSC) on the SSS schedule.",
    prefix: "₱",
    min: 0,
    max: 999_999_999,
    step: "any",
    defaultValue: 25000,
    placeholder: "e.g. 25,000",
    wide: true,
    messages: {
      required: "Enter your monthly compensation used for the SSS estimate.",
      min: "Compensation cannot be negative.",
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
        "Enter monthly compensation above ₱0 — SSS contributions are based on the compensation actually paid, so there is no employee contribution to compute for a ₱0 amount.",
    };
  }

  const result = computeSss(salary);

  if (!Number.isFinite(result.total)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const atCeiling = result.msc >= 35_000;
  const atFloor = result.msc <= 5_000;

  const lines: ResultLine[] = [
    {
      label: "Your SSS contribution (employee share)",
      value: formatPeso(result.employeeShare),
      hint: "Deducted from your salary each month",
      emphasis: true,
    },
    {
      label: "Monthly Salary Credit (MSC)",
      value: formatPeso(result.msc),
      hint: atCeiling
        ? "At the ₱35,000 ceiling for salaries of ₱34,750+"
        : atFloor
          ? "Minimum MSC — salaries from ₱1 to ₱5,249 use this bracket"
          : `Your ₱${formatNumber(salary, 0)} salary falls in this bracket`,
    },
    {
      label: "Employer share",
      value: formatPeso(result.employerShare),
      hint: "10% of the MSC, paid by your employer",
    },
    {
      label: "Employers' Compensation (EC)",
      value: formatPeso(result.ec),
      hint: "Paid by the employer on top of the 10% share",
    },
    {
      label: "Total remitted to SSS",
      value: formatPeso(result.total),
      hint: "Employee + employer + EC per month",
    },
  ];

  if (result.mpfPortion > 0) {
    lines.push({
      label: "MSC portion credited to MPF",
      value: formatPeso(result.mpfPortion),
      hint: `The part of your MSC above ₱${formatNumber(SSS_MPF_THRESHOLD, 0)} — not an extra deduction. The same 15% rate (5% you, 10% employer) on this portion goes to the MySSS Pension Booster.`,
    });
  }

  lines.push({
    label: "Contribution rate",
    value: "15% of MSC",
    hint: `Schedule effective ${RULES_SSS.effective}`,
  });

  return { ok: true, lines };
}
