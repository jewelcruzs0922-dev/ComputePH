import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatPeso } from "@/lib/utils/money";
import { computePagibig, RULES_PAGIBIG } from "@/lib/rules/pagibig";

export const fields: FieldDef[] = [
  {
    kind: "number",
    name: "monthlySalary",
    label: "Monthly compensation",
    hint: "Contributions are based on a fund salary capped at ₱10,000.",
    prefix: "₱",
    min: 0,
    max: 999_999_999,
    step: "any",
    defaultValue: 25000,
    placeholder: "e.g. 25,000",
    wide: true,
    messages: {
      required: "Enter your monthly compensation.",
      min: "Salary cannot be negative.",
      max: "That amount is too large to compute.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const salary = values.monthlySalary as number;

  if (!Number.isFinite(salary)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (salary < 0) {
    return { ok: false, error: "Compensation cannot be negative." };
  }

  const result = computePagibig(salary);

  if (!Number.isFinite(result.total)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const lines: ResultLine[] = [
    {
      label: "Your Pag-IBIG share (employee)",
      value: formatPeso(result.employeeShare),
      hint:
        salary <= 1500
          ? "1% rate for compensation of ₱1,500 or below"
          : "2% of your fund salary",
      emphasis: true,
    },
    {
      label: "Employer share",
      value: formatPeso(result.employerShare),
      hint: "2% of the applicable fund salary",
    },
    {
      label: "Total monthly savings",
      value: formatPeso(result.total),
      hint: "Credited to your Pag-IBIG account each month",
    },
    {
      label: "Fund salary used",
      value: formatPeso(result.fundSalary),
      hint: result.capped
        ? "Capped at the ₱10,000 Maximum Fund Salary"
        : "Equal to your monthly compensation",
    },
    {
      label: "Maximum possible contribution",
      value: "₱200 + ₱200",
      hint: `Circular 460 schedule (${RULES_PAGIBIG.effective})`,
    },
  ];

  return { ok: true, lines };
}
