/**
 * PhilHealth premium rules — Universal Health Care Act (RA 11223) premium
 * schedule for Calendar Year 2026.
 *
 * Verified 2026-09-28:
 * - Premium rate: 5% of monthly basic salary (the final scheduled step under
 *   RA 11223); announced by PhilHealth as unchanged for 2026 (PIA, May 2026)
 * - Income floor: ₱10,000 — salaries at or below are computed on ₱10,000
 * - Income ceiling: ₱100,000 — salaries above are computed on ₱100,000
 * - Employed members: shared equally, 2.5% employee + 2.5% employer
 * - Monthly premium ranges from ₱500 to ₱5,000
 */

export const RULES_PHILHEALTH = {
  lastUpdated: "2026-09-28",
  effective: "Calendar Year 2026",
  sources: [
    {
      label:
        "PhilHealth advisory: 5% premium rate for 2026 (Philippine Information Agency)",
      url: "https://pia.gov.ph/news/philhealth-sets-5-premium-contribution-rate-for-2026/",
      effective: "CY 2026",
    },
    {
      label: "RA 11223 — Universal Health Care Act",
      url: "https://www.officialgazette.gov.ph/2019/02/20/republic-act-no-11223/",
      effective: "2019",
    },
  ],
} as const;

export const PHIC_RATE = 0.05;
export const PHIC_EMPLOYEE_SHARE = 0.025;
export const PHIC_EMPLOYER_SHARE = 0.025;
export const PHIC_FLOOR = 10_000;
export const PHIC_CEILING = 100_000;

export type PhilHealthComputation = {
  base: number;
  totalPremium: number;
  employeeShare: number;
  employerShare: number;
  /** True when the floor or ceiling adjusted the computation base. */
  adjusted: "floor" | "ceiling" | null;
};

export function computePhilHealth(monthlyBasicSalary: number): PhilHealthComputation {
  const salary = Number.isFinite(monthlyBasicSalary) ? monthlyBasicSalary : 0;
  const base = Math.min(Math.max(salary, PHIC_FLOOR), PHIC_CEILING);
  const totalPremium = base * PHIC_RATE;
  return {
    base,
    totalPremium,
    employeeShare: totalPremium * 0.5,
    employerShare: totalPremium * 0.5,
    adjusted: salary < PHIC_FLOOR ? "floor" : salary > PHIC_CEILING ? "ceiling" : null,
  };
}
