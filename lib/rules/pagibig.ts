/**
 * Pag-IBIG (HDMF) contribution rules — HDMF Circular No. 460, effective
 * February 2024 and in force for 2026.
 *
 * Verified 2026-09-28:
 * - Maximum Fund Salary (monthly compensation used for computation):
 *   ₱10,000 (raised from ₱5,000 by Circular 460)
 * - Employee share: 2% of the fund salary, but only 1% when monthly
 *   compensation is ₱1,500 or below → max employee share ₱200
 * - Employer share: 2% of the fund salary → max ₱200
 * - Maximum mandatory contribution: ₱200 employee + ₱200 employer = ₱400
 */

export const RULES_PAGIBIG = {
  lastUpdated: "2026-09-28",
  effective: "February 2024 (in force for 2026)",
  sources: [
    {
      label:
        "HDMF Circular No. 460 rates, as implemented by DBM Circular Letter No. 2024-2",
      url: "https://www.dbm.gov.ph/wp-content/uploads/Issuances/2024/Circular-Letter/CIRCULAR-LETTER-NO-2024-2-DATED-FEBRUARY-01-2024.pdf",
      effective: "February 2024",
    },
    {
      label: "RA 9679 — Home Development Mutual Fund Law",
      url: "https://www.officialgazette.gov.ph/2009/08/07/republic-act-no-9679/",
      effective: "2009",
    },
  ],
} as const;

export const PAGIBIG_FUND_SALARY_CAP = 10_000;
export const PAGIBIG_LOW_TIER_THRESHOLD = 1_500;
export const PAGIBIG_EMPLOYEE_RATE = 0.02;
export const PAGIBIG_EMPLOYEE_RATE_LOW = 0.01;
export const PAGIBIG_EMPLOYER_RATE = 0.02;

export type PagibigComputation = {
  fundSalary: number;
  employeeShare: number;
  employerShare: number;
  total: number;
  /** True when the ₱10,000 fund-salary cap adjusted the base. */
  capped: boolean;
};

export function computePagibig(monthlyCompensation: number): PagibigComputation {
  const salary = Number.isFinite(monthlyCompensation) ? monthlyCompensation : 0;
  const fundSalary = Math.min(salary, PAGIBIG_FUND_SALARY_CAP);
  const employeeRate =
    salary <= PAGIBIG_LOW_TIER_THRESHOLD
      ? PAGIBIG_EMPLOYEE_RATE_LOW
      : PAGIBIG_EMPLOYEE_RATE;
  const employeeShare = fundSalary * employeeRate;
  const employerShare = fundSalary * PAGIBIG_EMPLOYER_RATE;
  return {
    fundSalary,
    employeeShare,
    employerShare,
    total: employeeShare + employerShare,
    capped: salary > PAGIBIG_FUND_SALARY_CAP,
  };
}
