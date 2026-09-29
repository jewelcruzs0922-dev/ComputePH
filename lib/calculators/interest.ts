import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPeso } from "@/lib/utils/money";

export const fields: FieldDef[] = [
  {
    kind: "segmented",
    name: "interestType",
    label: "Interest type",
    hint: "Simple interest earns only on the principal. Compound interest also earns on previously earned interest.",
    options: [
      { value: "simple", label: "Simple" },
      { value: "compound", label: "Compound" },
    ],
    defaultValue: "compound",
  },
  {
    kind: "number",
    name: "principal",
    label: "Principal amount",
    prefix: "₱",
    min: 0.01,
    max: 999_999_999_999,
    step: "any",
    defaultValue: 100000,
    placeholder: "e.g. 100,000",
    messages: {
      required: "Enter the principal amount.",
      min: "Enter an amount greater than 0.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "number",
    name: "annualRate",
    label: "Annual interest rate",
    suffix: "%",
    min: 0,
    max: 1000,
    step: "any",
    defaultValue: 6,
    placeholder: "e.g. 6",
    messages: {
      required: "Enter the annual interest rate.",
      min: "Interest rate cannot be negative.",
      max: "That rate is too large to compute.",
    },
  },
  {
    kind: "select",
    name: "termUnit",
    label: "Term is expressed in",
    options: [
      { value: "years", label: "Years" },
      { value: "months", label: "Months" },
    ],
    defaultValue: "years",
  },
  {
    kind: "number",
    name: "termValue",
    label: "Term length",
    hint: "Limits: up to 100 years (1,200 months).",
    min: 0.01,
    max: 1200,
    step: "any",
    defaultValue: 5,
    placeholder: "e.g. 5",
    maxWhen: [
      {
        field: "termUnit",
        equals: "years",
        value: 100,
        message:
          "That term is too long — enter at most 100 years (1,200 months).",
      },
    ],
    messages: {
      required: "Enter the term length.",
      min: "Enter a term greater than 0.",
      max: "That term is too long — the maximum is 1,200 months (100 years).",
    },
  },
  {
    kind: "select",
    name: "compounding",
    label: "Compounding frequency",
    hint: "How often interest is added to the balance (compound interest only).",
    options: [
      { value: "1", label: "Annually (1×/year)" },
      { value: "2", label: "Semi-annually (2×/year)" },
      { value: "4", label: "Quarterly (4×/year)" },
      { value: "12", label: "Monthly (12×/year)" },
      { value: "365", label: "Daily (365×/year)" },
    ],
    defaultValue: "12",
    showIf: { name: "interestType", equals: "compound" },
    wide: true,
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const type = values.interestType as string;
  const principal = values.principal as number;
  const annualRate = values.annualRate as number;
  const termUnit = values.termUnit as string;
  const termValue = values.termValue as number;

  if (type !== "simple" && type !== "compound") {
    return { ok: false, error: "Choose a valid interest type." };
  }
  if (termUnit !== "years" && termUnit !== "months") {
    return { ok: false, error: "Choose a valid term unit." };
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
  if (annualRate > 1000) {
    return { ok: false, error: "That rate is too large to compute." };
  }
  if (!Number.isFinite(termValue) || termValue <= 0) {
    return {
      ok: false,
      error: Number.isFinite(termValue)
        ? "Enter a term greater than 0."
        : "Those values can’t be computed. Please check them.",
    };
  }
  const termMonths = termUnit === "years" ? termValue * 12 : termValue;
  if (termMonths > 1200) {
    return {
      ok: false,
      error: "That term is too long — the maximum is 1,200 months (100 years).",
    };
  }
  if (
    values.compounding !== undefined &&
    values.compounding !== null &&
    `${values.compounding}` !== ""
  ) {
    const rawN = Number(values.compounding);
    if (!Number.isInteger(rawN) || ![1, 2, 4, 12, 365].includes(rawN)) {
      return { ok: false, error: "Choose a valid compounding frequency." };
    }
  }

  const years = termUnit === "years" ? termValue : termValue / 12;
  const rate = annualRate / 100;

  let interest: number;
  let finalAmount: number;

  if (type === "simple") {
    interest = principal * rate * years;
    finalAmount = principal + interest;
  } else {
    const n = Number(values.compounding ?? 12);
    if (!Number.isInteger(n) || ![1, 2, 4, 12, 365].includes(n)) {
      return { ok: false, error: "Choose a valid compounding frequency." };
    }
    finalAmount = principal * (1 + rate / n) ** (n * years);
    interest = finalAmount - principal;
  }

  if (!Number.isFinite(interest) || !Number.isFinite(finalAmount)) {
    return {
      ok: false,
      error:
        "Those values can’t be computed — that rate and term would grow past what this tool can display. Try a shorter term or a lower rate.",
    };
  }

  const termLabel = `${formatNumber(termValue, termValue % 1 === 0 ? 0 : 2)} ${termUnit}`;

  const lines: ResultLine[] = [
    {
      label: "Interest earned",
      value: formatPeso(interest),
      hint: `${type === "simple" ? "Simple" : "Compound"} interest over ${termLabel}`,
      emphasis: true,
    },
    { label: "Final amount", value: formatPeso(finalAmount) },
    { label: "Principal", value: formatPeso(principal) },
    {
      label: "Annual rate",
      value: `${formatNumber(annualRate, annualRate % 1 === 0 ? 0 : 2)}%`,
      hint:
        type === "compound"
          ? `Compounded ${compoundingLabel(Number(values.compounding ?? 12))}`
          : "Paid on the original principal only",
    },
    {
      label: "Total term",
      value: `${termLabel}${termUnit === "months" ? "" : ""}`,
      hint:
        termUnit === "months"
          ? `≈ ${formatNumber(years, 2)} year${years === 1 ? "" : "s"}`
          : undefined,
    },
  ];

  return { ok: true, lines };
}

function compoundingLabel(n: number): string {
  switch (n) {
    case 1:
      return "annually";
    case 2:
      return "semi-annually";
    case 4:
      return "quarterly";
    case 12:
      return "monthly";
    case 365:
      return "daily";
    default:
      return `${n}× per year`;
  }
}
