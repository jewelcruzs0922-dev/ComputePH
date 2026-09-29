import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPercent, formatPeso } from "@/lib/utils/money";
import {
  BENEFITS_EXEMPTION_CEILING,
  computeIncomeTax,
  RULES_INCOME_TAX,
} from "@/lib/rules/incomeTax";

export const fields: FieldDef[] = [
  {
    kind: "number",
    name: "monthlyGross",
    label: "Monthly gross compensation",
    hint: "Basic salary plus taxable allowances, before deductions.",
    prefix: "₱",
    min: 0,
    max: 99_999_999,
    step: "any",
    defaultValue: 40000,
    placeholder: "e.g. 40,000",
    messages: {
      required: "Enter your monthly gross compensation.",
      min: "Amount cannot be negative.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "number",
    name: "monthlyContributions",
    label: "Monthly contributions",
    hint: "Employee share of SSS + PhilHealth + Pag-IBIG. Enter 0 if unsure.",
    prefix: "₱",
    min: 0,
    max: 999_999,
    step: "any",
    defaultValue: 0,
    placeholder: "e.g. 2,450",
    assumption: true,
    messages: {
      required: "Enter your monthly contributions (0 if none).",
      min: "Contributions cannot be negative.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "number",
    name: "annualBenefits",
    label: "13th month pay & other benefits (full year)",
    hint: `Tax-exempt up to ₱${formatNumber(BENEFITS_EXEMPTION_CEILING, 0)} per year. Enter 0 if not applicable.`,
    prefix: "₱",
    min: 0,
    max: 99_999_999,
    step: "any",
    defaultValue: 0,
    placeholder: "e.g. 40,000",
    assumption: true,
    wide: true,
    messages: {
      required: "Enter your annual 13th month and benefits (0 if none).",
      min: "Benefits cannot be negative.",
      max: "That amount is too large to compute.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const monthlyGross = values.monthlyGross as number;
  const monthlyContributions = values.monthlyContributions as number;
  const annualBenefits = values.annualBenefits as number;

  if (
    !Number.isFinite(monthlyGross) ||
    !Number.isFinite(monthlyContributions) ||
    !Number.isFinite(annualBenefits)
  ) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (monthlyGross < 0) {
    return { ok: false, error: "Amount cannot be negative." };
  }
  if (monthlyContributions < 0) {
    return { ok: false, error: "Contributions cannot be negative." };
  }
  if (annualBenefits < 0) {
    return { ok: false, error: "Benefits cannot be negative." };
  }

  const result = computeIncomeTax({
    monthlyGross,
    monthlyContributions,
    annualBenefits,
  });

  if (!Number.isFinite(result.annualTax) || !Number.isFinite(result.monthlyTax)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const lines: ResultLine[] = [
    {
      label: "Estimated monthly withholding tax",
      value: formatPeso(result.monthlyTax),
      hint: "Estimate only — annual tax ÷ 12; actual payroll withholding can differ",
      emphasis: true,
    },
    {
      label: "Estimated annual Philippine income tax",
      value: formatPeso(result.annualTax),
    },
    {
      label: "Annual taxable income",
      value: formatPeso(result.taxableIncome),
      hint: `Gross ${formatPeso(result.annualGross)} − contributions ${formatPeso(result.annualContributions)} + taxable benefits ${formatPeso(result.taxableBenefits)}`,
    },
    {
      label: "Tax-exempt benefits",
      value: formatPeso(result.exemptBenefits),
      hint: `First ₱${formatNumber(BENEFITS_EXEMPTION_CEILING, 0)} of 13th month pay and benefits is exempt`,
    },
    {
      label: "Effective tax rate",
      value: formatPercent(result.effectiveRate, 2),
      hint: "Tax ÷ gross compensation",
    },
    {
      label: "Estimated monthly take-home",
      value: formatPeso(result.takeHomeMonthly),
      hint: "Gross − contributions − withholding tax",
    },
    {
      label: "Rates used",
      value: "TRAIN graduated rates",
      hint: `In effect since ${RULES_INCOME_TAX.effective}`,
    },
  ];

  return { ok: true, lines };
}
