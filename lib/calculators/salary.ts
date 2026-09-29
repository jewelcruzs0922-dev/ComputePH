import type { CalcOutcome, FieldDef, FieldValues, ResultLine } from "@/lib/types";
import { formatNumber, formatPeso } from "@/lib/utils/money";
import {
  DEFAULT_HOURS_PER_DAY,
  DEFAULT_WORKING_DAYS_PER_MONTH,
} from "@/lib/rules/labor";

export const fields: FieldDef[] = [
  {
    kind: "segmented",
    name: "basis",
    label: "Amount you are entering is",
    options: [
      { value: "monthly", label: "Monthly" },
      { value: "daily", label: "Daily" },
      { value: "hourly", label: "Hourly" },
    ],
    defaultValue: "monthly",
  },
  {
    kind: "number",
    name: "amount",
    label: "Salary amount",
    hint: "Treated as monthly, daily, or hourly basic pay depending on the choice above.",
    prefix: "₱",
    min: 0.01,
    max: 999_999_999,
    step: "any",
    defaultValue: 25000,
    placeholder: "e.g. 25,000",
    wide: true,
    messages: {
      required: "Enter your salary amount.",
      min: "Enter an amount greater than 0.",
      max: "That amount is too large to compute.",
    },
  },
  {
    kind: "number",
    name: "daysPerMonth",
    label: "Working days per month",
    hint: "26 is the common assumption (6 days a week).",
    suffix: "days",
    min: 1,
    max: 31,
    step: 1,
    defaultValue: DEFAULT_WORKING_DAYS_PER_MONTH,
    assumption: true,
    integer: true,
    messages: {
      required: "Enter working days per month.",
      min: "Enter at least 1 day.",
      max: "A month has at most 31 days.",
      integer: "Enter a whole number of days.",
    },
  },
  {
    kind: "number",
    name: "hoursPerDay",
    label: "Working hours per day",
    hint: "8 hours is the standard Philippine workday.",
    suffix: "hrs",
    min: 1,
    max: 24,
    step: 1,
    defaultValue: DEFAULT_HOURS_PER_DAY,
    assumption: true,
    integer: true,
    messages: {
      required: "Enter working hours per day.",
      min: "Enter at least 1 hour.",
      max: "A day has at most 24 hours.",
      integer: "Enter a whole number of hours.",
    },
  },
];

export function calculate(values: FieldValues): CalcOutcome {
  const basis = values.basis as string;
  const amount = values.amount as number;
  const daysPerMonth = values.daysPerMonth as number;
  const hoursPerDay = values.hoursPerDay as number;

  if (basis !== "monthly" && basis !== "daily" && basis !== "hourly") {
    return { ok: false, error: "Choose a valid pay basis." };
  }
  if (!Number.isFinite(amount)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }
  if (amount <= 0) {
    return { ok: false, error: "Enter an amount greater than 0." };
  }
  if (!Number.isFinite(daysPerMonth) || daysPerMonth < 1) {
    return { ok: false, error: "Enter at least 1 day." };
  }
  if (!Number.isFinite(hoursPerDay) || hoursPerDay < 1) {
    return { ok: false, error: "Enter at least 1 hour." };
  }

  let monthly: number;
  let daily: number;
  let hourly: number;

  if (basis === "monthly") {
    monthly = amount;
    daily = monthly / daysPerMonth;
    hourly = daily / hoursPerDay;
  } else if (basis === "daily") {
    daily = amount;
    monthly = daily * daysPerMonth;
    hourly = daily / hoursPerDay;
  } else {
    hourly = amount;
    daily = hourly * hoursPerDay;
    monthly = daily * daysPerMonth;
  }

  if (![monthly, daily, hourly].every(Number.isFinite)) {
    return { ok: false, error: "Those values can’t be computed. Please check them." };
  }

  const inputLabel =
    basis === "monthly" ? "Your monthly salary" : basis === "daily" ? "Your daily rate" : "Your hourly rate";

  const lines: ResultLine[] = [];

  if (basis === "monthly") {
    lines.push({
      label: "Daily rate",
      value: formatPeso(daily),
      hint: `Monthly ÷ ${formatNumber(daysPerMonth, 0)} working days`,
      emphasis: true,
    });
    lines.push({
      label: "Hourly rate",
      value: formatPeso(hourly),
      hint: `Daily ÷ ${formatNumber(hoursPerDay, 0)} hours`,
    });
  } else if (basis === "daily") {
    lines.push({
      label: "Hourly rate",
      value: formatPeso(hourly),
      hint: `Daily ÷ ${formatNumber(hoursPerDay, 0)} hours`,
      emphasis: true,
    });
    lines.push({
      label: "Monthly equivalent",
      value: formatPeso(monthly),
      hint: `Daily × ${formatNumber(daysPerMonth, 0)} working days`,
    });
  } else {
    lines.push({
      label: "Daily rate",
      value: formatPeso(daily),
      hint: `Hourly × ${formatNumber(hoursPerDay, 0)} hours`,
      emphasis: true,
    });
    lines.push({
      label: "Monthly equivalent",
      value: formatPeso(monthly),
      hint: `Daily × ${formatNumber(daysPerMonth, 0)} working days`,
    });
  }

  lines.push({ label: inputLabel, value: formatPeso(amount) });

  lines.push({
    label: "Assumptions",
    value: `${formatNumber(daysPerMonth, 0)} days/mo · ${formatNumber(hoursPerDay, 0)} hrs/day`,
    hint: "Adjust the fields if your employer uses a different divisor",
  });

  return { ok: true, lines };
}
