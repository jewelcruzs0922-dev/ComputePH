import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatPeso } from "@/lib/utils/money";
import { THIRTEENTH_MONTH_DIVISOR } from "@/lib/rules/labor";

export const fields: FieldDef[] = [
  {
    kind: "number",
    name: "monthlySalary",
    label: "Monthly basic salary",
    hint:
      "Basic pay only — exclude overtime, night differential, and allowances. Assumes this same salary every month worked; if it changed during the year, enter your average (total basic earned ÷ months worked).",
    prefix: "₱",
    min: 0.01,
    max: 999_999_999,
    step: "any",
    defaultValue: 25000,
    placeholder: "e.g. 25,000",
    wide: true,
    messages: {
      required: "Enter your monthly basic salary.",
      min: "Enter an amount greater than 0.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "number",
    name: "monthsWorked",
    label: "Months worked this year",
    hint: "Use 12 for a full year. Partial months above 1 prorate automatically (e.g. 7.5).",
    min: 1,
    max: 12,
    step: 0.1,
    defaultValue: 12,
    assumption: true,
    integer: false,
    messages: {
      required: "Enter the months you worked.",
      min: "Enter at least 1 month — partial months like 1.5 or 7.5 are fine.",
      max: "There are only 12 months in a calendar year.",
      integer: "Enter months like 12 or 7.5.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const salary = values.monthlySalary as number;
  const months = values.monthsWorked as number;

  if (!Number.isFinite(salary)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (salary <= 0) {
    return { ok: false, error: "Enter an amount greater than 0." };
  }
  if (!Number.isFinite(months) || months < 1) {
    return {
      ok: false,
      error: "Enter at least 1 month — partial months like 1.5 or 7.5 are fine.",
    };
  }
  if (months > 12) {
    return { ok: false, error: "There are only 12 months in a calendar year." };
  }

  const totalBasic = salary * months;
  const thirteenth = totalBasic / THIRTEENTH_MONTH_DIVISOR;

  if (!Number.isFinite(thirteenth) || thirteenth < 0) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const lines: ResultLine[] = [
    {
      label: "Estimated 13th month pay",
      value: formatPeso(thirteenth),
      hint: "One-twelfth of your total basic salary for the year",
      emphasis: true,
    },
    {
      label: "Total basic salary earned",
      value: formatPeso(totalBasic),
      hint: `₱${salary.toLocaleString("en-PH")} × ${months} month${months === 1 ? "" : "s"}`,
    },
    { label: "13th month divisor", value: "12 months" },
    {
      label: "Payment deadline",
      value: "On or before Dec 24",
      hint: "Per DOLE, employers may also pay half before the school year opens",
    },
  ];

  return { ok: true, lines };
}
