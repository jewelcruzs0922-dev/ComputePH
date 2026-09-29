import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPercent, formatPeso } from "@/lib/utils/money";

export const fields: FieldDef[] = [
  {
    kind: "number",
    name: "price",
    label: "Item price",
    prefix: "₱",
    min: 0.01,
    max: 999_999_999,
    step: "any",
    defaultValue: 30000,
    placeholder: "e.g. 30,000",
    messages: {
      required: "Enter the item price.",
      min: "Enter an amount greater than 0.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "number",
    name: "downPayment",
    label: "Down payment",
    hint: "Cash you pay upfront. Enter 0 if there is none.",
    prefix: "₱",
    min: 0,
    max: 999_999_999,
    step: "any",
    defaultValue: 5000,
    placeholder: "e.g. 5,000",
    lessThanField: {
      name: "price",
      message: "Down payment must be less than the item price.",
    },
    messages: {
      required: "Enter the down payment (0 if none).",
      min: "Down payment cannot be negative.",
      max: "Down payment cannot exceed the item price.",
    },
  },
  {
    kind: "select",
    name: "method",
    label: "Interest method",
    hint: "Add-on is common in retail installment plans; amortized is how most banks compute loans.",
    options: [
      { value: "addon", label: "Add-on interest" },
      { value: "amortized", label: "Amortized (reducing balance)" },
    ],
    defaultValue: "addon",
    wide: true,
  },
  {
    kind: "number",
    name: "annualRate",
    label: "Annual interest / add-on rate",
    hint: "Enter 0 for a 0% installment plan.",
    suffix: "%",
    min: 0,
    max: 100,
    step: "any",
    defaultValue: 12,
    placeholder: "e.g. 12",
    messages: {
      required: "Enter the interest rate.",
      min: "Interest rate cannot be negative.",
      max: "Rates above 100% are not supported.",
    },
  },
  {
    kind: "number",
    name: "months",
    label: "Number of monthly payments",
    suffix: "mos",
    min: 1,
    max: 600,
    step: 1,
    integer: true,
    defaultValue: 12,
    placeholder: "e.g. 12",
    messages: {
      required: "Enter the number of monthly payments.",
      min: "Enter at least 1 monthly payment.",
      max: "Terms above 600 months are not supported.",
      integer: "Enter a whole number of monthly payments.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const price = values.price as number;
  const downPayment = values.downPayment as number;
  const method = values.method as string;
  const annualRate = values.annualRate as number;
  const months = values.months as number;

  if (method !== "addon" && method !== "amortized") {
    return { ok: false, error: "Choose a valid payment method." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return {
      ok: false,
      error: Number.isFinite(price)
        ? "Enter an amount greater than 0."
        : "Those values can’t be computed. Please check them.",
    };
  }
  if (!Number.isFinite(downPayment) || downPayment < 0) {
    return {
      ok: false,
      error: Number.isFinite(downPayment)
        ? "Down payment cannot be negative."
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
  if (!Number.isFinite(months) || months < 1) {
    return {
      ok: false,
      error: Number.isFinite(months)
        ? "Enter at least 1 monthly payment."
        : "Those values can’t be computed. Please check them.",
    };
  }
  if (!Number.isInteger(months)) {
    return { ok: false, error: "Enter a whole number of monthly payments." };
  }
  if (months > 600) {
    return { ok: false, error: "Terms above 600 months are not supported." };
  }

  if (downPayment >= price) {
    return {
      ok: false,
      error: "Down payment must be less than the item price.",
    };
  }

  const financed = price - downPayment;
  let monthly: number;
  let totalInterest: number;
  let totalPayments: number;

  if (method === "addon") {
    const interest = (financed * annualRate * months) / 100 / 12;
    totalInterest = interest;
    const totalAmortized = financed + interest;
    monthly = totalAmortized / months;
    totalPayments = totalAmortized + downPayment;
  } else {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) {
      monthly = financed / months;
    } else {
      monthly = (financed * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
    }
    totalPayments = monthly * months + downPayment;
    totalInterest = totalPayments - price;
  }

  if (
    ![monthly, totalInterest, totalPayments].every(Number.isFinite)
  ) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const markup = price > 0 ? (totalInterest / price) * 100 : 0;

  const lines: ResultLine[] = [
    {
      label: "Monthly amortization",
      value: formatPeso(monthly),
      hint: `${formatNumber(months, 0)} payment${months === 1 ? "" : "s"} of ₱${formatNumber(financed, 2)} financed`,
      emphasis: true,
    },
    {
      label: "Total interest / finance charge",
      value: formatPeso(totalInterest),
      hint:
        method === "addon"
          ? "Add-on interest: charged on the full financed amount upfront"
          : "Amortized: charged on the reducing balance",
    },
    {
      label: "Total amount paid",
      value: formatPeso(totalPayments),
      hint: "Including your down payment",
    },
    { label: "Amount financed", value: formatPeso(financed) },
    {
      label: "Total cost vs. price",
      value: formatPercent(markup, 1),
      hint: `Extra cost on top of the ₱${formatNumber(price, 2)} price`,
    },
  ];

  return { ok: true, lines };
}
