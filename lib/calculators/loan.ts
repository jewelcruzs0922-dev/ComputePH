import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPeso } from "@/lib/utils/money";

export const fields: FieldDef[] = [
  {
    kind: "number",
    name: "principal",
    label: "Loan amount",
    hint: "The amount you borrow (the principal).",
    prefix: "₱",
    min: 0.01,
    max: 999_999_999_999,
    step: "any",
    defaultValue: 500000,
    placeholder: "e.g. 500,000",
    messages: {
      required: "Enter the loan amount.",
      min: "Enter an amount greater than 0.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "number",
    name: "annualRate",
    label: "Annual interest rate",
    hint: "Use 0 for a 0% interest loan.",
    suffix: "%",
    min: 0,
    max: 100,
    step: "any",
    defaultValue: 12,
    placeholder: "e.g. 12",
    messages: {
      required: "Enter the annual interest rate.",
      min: "Interest rate cannot be negative.",
      max: "Rates above 100% are not supported.",
    },
  },
  {
    kind: "number",
    name: "termValue",
    label: "Loan term",
    hint: "Enter 1–50 years or 1–600 months — whichever unit you pick below.",
    min: 1,
    max: 600,
    step: 1,
    defaultValue: 5,
    placeholder: "e.g. 5",
    maxWhen: [
      {
        field: "termUnit",
        equals: "years",
        value: 50,
        message:
          "That term is too long — enter at most 50 years (600 months).",
      },
    ],
    messages: {
      required: "Enter the loan term.",
      min: "Enter a term of at least 1 (1 month or 1 year).",
      max: "That term is too long — the maximum is 600 months (50 years).",
    },
    integerWhen: [
      {
        field: "termUnit",
        equals: "months",
        message: "Enter a whole number of months.",
      },
    ],
  },
  {
    kind: "select",
    name: "termUnit",
    label: "Term unit",
    options: [
      { value: "years", label: "Years" },
      { value: "months", label: "Months" },
    ],
    defaultValue: "years",
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const principal = values.principal as number;
  const annualRate = values.annualRate as number;
  const termUnit = values.termUnit as string;
  const termValue = values.termValue as number;

  if (termUnit !== "years" && termUnit !== "months") {
    return { ok: false, error: "Choose a valid loan term unit." };
  }
  if (!Number.isFinite(principal) || principal <= 0) {
    return {
      ok: false,
      error: Number.isFinite(principal)
        ? "Enter an amount greater than 0."
        : "Those values can’t be computed. Please check them.",
    };
  }
  if (!Number.isFinite(annualRate) || annualRate < 0) {
    return {
      ok: false,
      error: Number.isFinite(annualRate)
        ? "Interest rate cannot be negative."
        : "Those values can’t be computed. Please check them.",
    };
  }
  if (annualRate > 100) {
    return { ok: false, error: "Rates above 100% are not supported." };
  }
  if (!Number.isFinite(termValue)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (termUnit === "months" && !Number.isInteger(termValue)) {
    return { ok: false, error: "Enter a whole number of months." };
  }

  const months = Math.round(termUnit === "years" ? termValue * 12 : termValue);
  if (months < 1) {
    return { ok: false, error: "Enter a loan term of at least one month." };
  }
  if (months > 600) {
    return {
      ok: false,
      error:
        "The loan term must be 600 months (50 years) or less. Reduce the term and recalculate.",
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  let monthly: number;
  if (monthlyRate === 0) {
    monthly = principal / months;
  } else {
    monthly =
      (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
  }

  const totalPayment = monthly * months;
  const totalInterest = totalPayment - principal;

  if (
    !Number.isFinite(monthly) ||
    !Number.isFinite(totalPayment) ||
    !Number.isFinite(totalInterest)
  ) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const termLabel =
    termUnit === "months"
      ? `${formatNumber(months, 0)} month${months === 1 ? "" : "s"}`
      : `${termValue % 1 === 0 ? formatNumber(termValue, 0) : String(termValue)} year${termValue === 1 ? "" : "s"} (${formatNumber(months, 0)} months)`;

  const lines: ResultLine[] = [
    {
      label: "Monthly amortization",
      value: formatPeso(monthly),
      hint: `${formatNumber(months, 0)} monthly payments`,
      emphasis: true,
    },
    {
      label: "Total interest",
      value: formatPeso(totalInterest),
      hint:
        annualRate === 0
          ? "0% interest loan — you pay no interest"
          : `${formatNumber(annualRate, annualRate % 1 === 0 ? 0 : 2)}% annual rate, amortized monthly`,
    },
    {
      label: "Total amount repaid",
      value: formatPeso(totalPayment),
      hint: "Principal plus interest over the full term",
    },
    { label: "Loan amount (principal)", value: formatPeso(principal) },
    {
      label: "Term",
      value: termLabel,
    },
  ];

  return { ok: true, lines };
}
