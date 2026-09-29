import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPercent, formatPeso } from "@/lib/utils/money";

export const fields: FieldDef[] = [
  {
    kind: "number",
    name: "price",
    label: "Original price",
    prefix: "₱",
    min: 0.01,
    max: 999_999_999,
    step: "any",
    defaultValue: 1500,
    placeholder: "e.g. 1,500",
    messages: {
      required: "Enter the original price.",
      min: "Enter an amount greater than 0.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "number",
    name: "discountRate",
    label: "Discount rate",
    hint:
      "The discount percentage off the original price. Common rates: 10%, 15%, and 20%.",
    suffix: "%",
    min: 0,
    max: 100,
    step: "any",
    defaultValue: 20,
    placeholder: "e.g. 20",
    messages: {
      required: "Enter the discount rate.",
      min: "Discount rate cannot be negative.",
      max: "A discount cannot be more than 100%.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const price = values.price as number;
  const rate = values.discountRate as number;

  if (!Number.isFinite(price)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (price <= 0) {
    return { ok: false, error: "Enter an amount greater than 0." };
  }
  if (!Number.isFinite(rate)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (rate < 0) {
    return { ok: false, error: "Discount rate cannot be negative." };
  }
  if (rate > 100) {
    return { ok: false, error: "A discount cannot be more than 100%." };
  }

  const savings = (price * rate) / 100;
  const finalPrice = price - savings;

  if (!Number.isFinite(savings) || !Number.isFinite(finalPrice)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const lines: ResultLine[] = [
    {
      label: "You pay",
      value: formatPeso(finalPrice),
      hint: `After a ${formatPercent(rate, rate % 1 === 0 ? 0 : 1)} discount`,
      emphasis: true,
    },
    {
      label: "You save",
      value: formatPeso(savings),
      hint: `₱${formatNumber(price, 2)} × ${formatNumber(rate, rate % 1 === 0 ? 0 : 1)}%`,
    },
    { label: "Original price", value: formatPeso(price) },
    {
      label: "You pay per ₱100",
      value: formatPeso(100 - rate),
      hint: "Quick mental-check figure",
    },
  ];

  return { ok: true, lines };
}
