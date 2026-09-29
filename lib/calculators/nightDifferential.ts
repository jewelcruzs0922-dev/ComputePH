import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPeso } from "@/lib/utils/money";
import { NIGHT_DIFFERENTIAL_RATE, NIGHT_SHIFT_HOURS } from "@/lib/rules/labor";

export const fields: FieldDef[] = [
  {
    kind: "segmented",
    name: "rateBasis",
    label: "Your pay is given as",
    options: [
      { value: "hourly", label: "Hourly rate" },
      { value: "daily", label: "Daily rate" },
      { value: "monthly", label: "Monthly salary" },
    ],
    defaultValue: "daily",
  },
  {
    kind: "number",
    name: "rate",
    label: "Pay rate",
    hint:
      "Your regular rate before the night premium — daily rates use 8 hours per day.",
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
    kind: "number",
    name: "monthlyHours",
    label: "Working hours per month",
    hint: "Used to derive an hourly rate from your monthly salary.",
    min: 1,
    max: 744,
    step: 1,
    defaultValue: 208,
    assumption: true,
    placeholder: "e.g. 208",
    integer: true,
    showIf: { name: "rateBasis", equals: "monthly" },
    messages: {
      required: "Enter your working hours per month.",
      min: "Enter at least 1 hour.",
      max: "There are at most 744 hours in a month (31 × 24).",
      integer: "Enter a whole number of hours.",
    },
  },
  {
    kind: "number",
    name: "nightHours",
    label: "Hours worked between 10 PM and 6 AM",
    hint: "The night shift window is 8 hours long.",
    suffix: "hrs",
    min: 0,
    max: NIGHT_SHIFT_HOURS,
    step: 0.1,
    defaultValue: 4,
    placeholder: "e.g. 4",
    messages: {
      required: "Enter your night shift hours.",
      min: "Enter 0 or more night hours.",
      max: "The 10 PM–6 AM window is only 8 hours long.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const basis = values.rateBasis as string;
  const rate = values.rate as number;
  const nightHours = values.nightHours as number;

  if (basis !== "hourly" && basis !== "daily" && basis !== "monthly") {
    return { ok: false, error: "Choose a valid pay basis." };
  }
  if (!Number.isFinite(rate)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (rate <= 0) {
    return { ok: false, error: "Enter an amount greater than 0." };
  }
  if (!Number.isFinite(nightHours)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (nightHours < 0) {
    return { ok: false, error: "Enter 0 or more night hours." };
  }
  if (nightHours > NIGHT_SHIFT_HOURS) {
    return {
      ok: false,
      error: "The 10 PM–6 AM window is only 8 hours long.",
    };
  }

  let hourlyRate: number;
  if (basis === "hourly") {
    hourlyRate = rate;
  } else if (basis === "daily") {
    hourlyRate = rate / 8;
  } else {
    const monthlyHours = values.monthlyHours as number;
    if (!Number.isFinite(monthlyHours) || monthlyHours < 1) {
      return { ok: false, error: "Enter at least 1 hour." };
    }
    hourlyRate = rate / monthlyHours;
  }

  const nightPay = hourlyRate * NIGHT_DIFFERENTIAL_RATE * nightHours;

  if (!Number.isFinite(hourlyRate) || !Number.isFinite(nightPay)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const lines: ResultLine[] = [
    {
      label: "Night differential pay",
      value: formatPeso(nightPay),
      hint: `${formatNumber(nightHours, 1)} night hour${nightHours === 1 ? "" : "s"} × 10% of ${formatPeso(hourlyRate)}/hr`,
      emphasis: true,
    },
    {
      label: "Night premium per hour",
      value: formatPeso(hourlyRate * NIGHT_DIFFERENTIAL_RATE),
      hint: "Additional 10% of your hourly rate",
    },
    {
      label: "Regular hourly rate",
      value: formatPeso(hourlyRate),
      hint:
        basis === "hourly"
          ? "As entered"
          : basis === "daily"
            ? "Daily rate ÷ 8 hours"
            : "Monthly salary ÷ working hours per month",
    },
    {
      label: "Your base pay for those hours",
      value: formatPeso(hourlyRate * nightHours),
      hint: "Excludes the 10% premium shown above",
    },
  ];

  return { ok: true, lines };
}
