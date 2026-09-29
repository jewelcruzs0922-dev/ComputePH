/**
 * Philippine labor pay rules used by ComputePH calculators.
 *
 * Sources (verified 2026-09):
 * - Labor Code of the Philippines, Arts. 86–87 (night shift differential, overtime)
 * - DOLE Labor Advisory No. 16-2025, "Guidelines on the Payment of the
 *   Thirteenth Month Pay" (issued Nov 2025; same 1/12 formula as prior years)
 * - DOLE holiday pay rules: regular holiday = 200% first 8 hours,
 *   special non-working day = 130%, rest day = 130%, both = 150%,
 *   regular holiday + rest day = 260%; overtime adds 30% of the day's hourly rate.
 *
 * This file is the single source of truth for labor multipliers — do not
 * hard-code them inside components.
 */

export const RULES_LABOR = {
  lastUpdated: "2026-09-28",
  sources: [
    {
      label:
        "DOLE Labor Advisory No. 16-2025 — Guidelines on the Payment of the Thirteenth Month Pay",
      url: "https://dole.gov.ph/php_assets/uploads/2025/11/Labor-Advisory-No.-16-25-Guidelines-on-the-Payment-of-the-Thirteenth-Month-Pay.pdf",
      effective: "Calendar year 2025",
    },
    {
      label: "Labor Code of the Philippines, Article 86 (night shift differential)",
      url: "https://www.officialgazette.gov.ph/1974/05/01/presidential-decree-no-442-s-1974/",
      effective: "As amended",
    },
    {
      label:
        "DOLE Handbook on Workers' Statutory Monetary Benefits (overtime, premium and holiday pay)",
      url: "https://nwpc.dole.gov.ph/wp-content/uploads/2024/11/Workers-Statutory-Monetary-Benefits-Handbook-2024-Edition.pdf",
      effective: "2024 edition",
    },
  ],
} as const;

/** 13th month pay = total basic salary earned in the calendar year ÷ 12. */
export const THIRTEENTH_MONTH_DIVISOR = 12;

/** Hours in the legally defined night shift window (10:00 PM – 6:00 AM). */
export const NIGHT_SHIFT_HOURS = 8;

/** Night shift differential: additional 10% of the hourly rate per night hour. */
export const NIGHT_DIFFERENTIAL_RATE = 0.1;

export type DayType =
  | "ordinary"
  | "rest-day"
  | "special-day"
  | "special-rest"
  | "regular-holiday"
  | "holiday-rest";

export type DayTypeRule = {
  id: DayType;
  label: string;
  /** Pay for the first 8 hours, as a multiple of the daily rate. */
  firstEightMultiplier: number;
  /** Overtime pay per hour beyond 8, as a multiple of the REGULAR hourly rate. */
  overtimeMultiplier: number;
  description: string;
};

export const DAY_TYPES: DayTypeRule[] = [
  {
    id: "ordinary",
    label: "Ordinary day",
    firstEightMultiplier: 1,
    overtimeMultiplier: 1.25,
    description: "Normal working day — overtime adds 25%.",
  },
  {
    id: "rest-day",
    label: "Rest day",
    firstEightMultiplier: 1.3,
    overtimeMultiplier: 1.69,
    description: "Work on your scheduled rest day (130% × 130%).",
  },
  {
    id: "special-day",
    label: "Special non-working day",
    firstEightMultiplier: 1.3,
    overtimeMultiplier: 1.69,
    description: "Declared special day (130% × 130%).",
  },
  {
    id: "special-rest",
    label: "Special day that is also your rest day",
    firstEightMultiplier: 1.5,
    overtimeMultiplier: 1.95,
    description: "Special non-working day falling on your rest day (150% × 130%).",
  },
  {
    id: "regular-holiday",
    label: "Regular holiday",
    firstEightMultiplier: 2,
    overtimeMultiplier: 2.6,
    description: "Declared regular holiday (200% × 130%).",
  },
  {
    id: "holiday-rest",
    label: "Regular holiday that is also your rest day",
    firstEightMultiplier: 2.6,
    overtimeMultiplier: 3.38,
    description: "Regular holiday falling on your rest day (260% × 130%).",
  },
];

const DAY_TYPE_MAP = new Map(DAY_TYPES.map((d) => [d.id, d]));

export function getDayType(id: string): DayTypeRule | undefined {
  return DAY_TYPE_MAP.get(id as DayType);
}

/** Standard working-day divisor used to derive a daily rate from monthly pay. */
export const DEFAULT_WORKING_DAYS_PER_MONTH = 26;
export const DEFAULT_HOURS_PER_DAY = 8;
