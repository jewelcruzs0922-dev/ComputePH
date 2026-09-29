/**
 * SSS contribution rules — Schedule of Contributions effective January 1, 2025
 * (in force for 2026), under RA 11199 (Social Security Act of 2018) and
 * SSS Circular No. 2024-006.
 *
 * Verified 2026-09-28 against the official SSS contribution table:
 * - Total contribution rate: 15% of the Monthly Salary Credit (MSC)
 *   employer 10% + employee 5%
 * - MSC floor ₱5,000, MSC ceiling ₱35,000
 * - Compensation ranges step by ₱500: each MSC m covers salaries from
 *   m − 250 up to m + 249.99 (salaries below ₱5,250 map to MSC ₱5,000)
 * - Employees' Compensation (EC): employer pays ₱10/month if MSC < ₱15,000,
 *   ₱30/month if MSC ≥ ₱15,000
 * - The portion of MSC above ₱20,000 is credited to the Mandatory Provident
 *   Fund (MPF / MySSS Pension Booster) at the same rates.
 */

export const RULES_SSS = {
  lastUpdated: "2026-09-28",
  effective: "January 1, 2025 (schedule in force for 2026)",
  sources: [
    {
      label:
        "SSS Schedule of Contributions, Circular No. 2024-006 (effective January 2025)",
      url: "https://www.sss.gov.ph/sss-contribution-table",
      effective: "January 1, 2025",
    },
    {
      label: "RA 11199 — Social Security Act of 2018 (SSS full text)",
      url: "https://www.sss.gov.ph/wp-content/uploads/2022/04/Booklet_SS-ACT-OF-2018_05172019_2.pdf",
      effective: "2018",
    },
  ],
} as const;

export const SSS_RATE = 0.15;
export const SSS_EMPLOYEE_RATE = 0.05;
export const SSS_EMPLOYER_RATE = 0.1;
export const SSS_MIN_MSC = 5_000;
export const SSS_MAX_MSC = 35_000;
export const SSS_MSC_STEP = 500;
export const SSS_MPF_THRESHOLD = 20_000;

/** EC is employer-paid for employed members. */
export function sssEcAmount(msc: number): number {
  return msc >= 15_000 ? 30 : 10;
}

/** Maps a monthly salary to the Monthly Salary Credit on the SSS schedule. */
export function sssMonthlySalaryCredit(monthlySalary: number): number {
  if (!Number.isFinite(monthlySalary)) return SSS_MIN_MSC;
  if (monthlySalary < SSS_MIN_MSC + 250) return SSS_MIN_MSC;
  const raw =
    Math.floor((monthlySalary + SSS_MSC_STEP / 2) / SSS_MSC_STEP) *
    SSS_MSC_STEP;
  return Math.min(Math.max(raw, SSS_MIN_MSC), SSS_MAX_MSC);
}

export type SssComputation = {
  msc: number;
  employeeShare: number;
  employerShare: number;
  ec: number;
  total: number;
  /** Portion of MSC credited to the Mandatory Provident Fund (above ₱20,000). */
  mpfPortion: number;
};

export function computeSss(monthlySalary: number): SssComputation {
  const msc = sssMonthlySalaryCredit(monthlySalary);
  const employeeShare = msc * SSS_EMPLOYEE_RATE;
  const employerShare = msc * SSS_EMPLOYER_RATE;
  const ec = sssEcAmount(msc);
  return {
    msc,
    employeeShare,
    employerShare,
    ec,
    total: employeeShare + employerShare + ec,
    mpfPortion: Math.max(0, msc - SSS_MPF_THRESHOLD),
  };
}
