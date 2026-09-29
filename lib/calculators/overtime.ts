import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPeso } from "@/lib/utils/money";
import { DAY_TYPES, getDayType } from "@/lib/rules/labor";

export const fields: FieldDef[] = [
  {
    kind: "segmented",
    name: "rateBasis",
    label: "Your pay is given as",
    options: [
      { value: "hourly", label: "Hourly rate" },
      { value: "daily", label: "Daily rate" },
    ],
    defaultValue: "daily",
  },
  {
    kind: "number",
    name: "rate",
    label: "Pay rate",
    hint:
      "Your regular rate before any overtime premium. Daily rates are converted using 8 hours per day.",
    prefix: "₱",
    min: 0.01,
    max: 999_999_999,
    step: "any",
    defaultValue: 640,
    placeholder: "e.g. 640",
    messages: {
      required: "Enter your pay rate.",
      min: "Enter an amount greater than 0.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "select",
    name: "dayType",
    label: "Type of day",
    hint: "Overtime premiums differ for rest days and holidays.",
    options: DAY_TYPES.map((d) => ({ value: d.id, label: d.label })),
    defaultValue: "ordinary",
    wide: true,
  },
  {
    kind: "number",
    name: "overtimeHours",
    label: "Overtime hours",
    hint:
      "Hours worked beyond the first 8 regular hours of that day — capped at 16 by this calculator's 24-hour-day model.",
    suffix: "hrs",
    min: 0,
    max: 16,
    step: 0.1,
    defaultValue: 2,
    placeholder: "e.g. 2",
    messages: {
      required: "Enter the number of overtime hours.",
      min: "Enter 0 or more overtime hours.",
      max: "For this calculator, overtime is limited to 16 hours so the modeled workday does not exceed 24 hours.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const basis = values.rateBasis as string;
  const rate = values.rate as number;
  const hours = values.overtimeHours as number;
  const dayType = getDayType(values.dayType as string);

  if (!dayType) {
    return { ok: false, error: "Choose a valid type of day." };
  }
  if (basis !== "hourly" && basis !== "daily") {
    return { ok: false, error: "Choose a valid pay basis." };
  }
  if (!Number.isFinite(rate)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (rate <= 0) {
    return { ok: false, error: "Enter an amount greater than 0." };
  }
  if (!Number.isFinite(hours)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (hours < 0) {
    return { ok: false, error: "Enter 0 or more overtime hours." };
  }
  if (hours > 16) {
    return {
      ok: false,
      error:
        "For this calculator, overtime is limited to 16 hours so the modeled workday does not exceed 24 hours.",
    };
  }

  const hourlyRate = basis === "hourly" ? rate : rate / 8;
  const otRatePerHour = hourlyRate * dayType.overtimeMultiplier;
  const overtimePay = otRatePerHour * hours;

  if (
    !Number.isFinite(hourlyRate) ||
    !Number.isFinite(otRatePerHour) ||
    !Number.isFinite(overtimePay)
  ) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const lines: ResultLine[] = [
    {
      label: "Overtime pay",
      value: formatPeso(overtimePay),
      hint: `${formatNumber(hours, 1)} OT hour${hours === 1 ? "" : "s"} × ${formatPeso(otRatePerHour)}/hr`,
      emphasis: true,
    },
    {
      label: "Overtime rate per hour",
      value: formatPeso(otRatePerHour),
      hint: `${dayType.label} — ${formatNumber(dayType.overtimeMultiplier * 100, 0)}% of your hourly rate`,
    },
    {
      label: "Regular hourly rate",
      value: formatPeso(hourlyRate),
      hint: basis === "daily" ? "Daily rate ÷ 8 hours" : "As entered",
    },
    {
      label: "First 8 hours would pay",
      value: formatPeso(hourlyRate * 8 * dayType.firstEightMultiplier),
      hint: `${formatNumber(dayType.firstEightMultiplier * 100, 0)}% of the daily rate for that day type`,
    },
  ];

  return { ok: true, lines };
}
