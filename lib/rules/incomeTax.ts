/**
 * Philippine individual income tax rules for compensation income.
 *
 * Verified 2026-09-28:
 * - Graduated rates of RA 10963 (TRAIN Law), effective January 1, 2023 and
 *   onwards, confirmed still applicable for 2026 (KPMG TIES 2026; BIR)
 * - First ₱250,000 of annual taxable income is exempt (0%)
 * - 13th month pay and other benefits are exempt up to ₱90,000 per year;
 *   anything above is added to taxable income (RR 11-2018)
 * - Mandatory contributions (SSS, PhilHealth, Pag-IBIG employee share,
 *   union dues) are excluded from taxable compensation
 * - Monthly withholding follows the BIR table in RR 11-2018 Annex E; this
 *   calculator estimates the monthly figure as annual tax ÷ 12 — actual
 *   payroll withholding can differ (payroll period, bonuses, benefits,
 *   employer annualization)
 */

export const RULES_INCOME_TAX = {
  lastUpdated: "2026-09-28",
  effective: "January 1, 2023 onwards (applies to 2026 income)",
  sources: [
    {
      label:
        "BIR RR 11-2018, Annex E — Revised Withholding Tax Table (effective Jan 1, 2023)",
      url: "https://bir-cdn.bir.gov.ph/local/pdf/Annex%20E%20RR%2011-2018.pdf",
      effective: "January 1, 2023",
    },
    {
      label: "RA 10963 — TRAIN Law individual income tax rates",
      url: "https://www.officialgazette.gov.ph/2017/12/19/republic-act-no-10963/",
      effective: "January 1, 2018",
    },
  ],
} as const;

export type TaxBracket = {
  /** Exclusive lower bound. */
  min: number;
  /** Inclusive upper bound; Infinity for the top bracket. */
  max: number;
  /** Tax due on income equal to `min`. */
  baseTax: number;
  /** Rate applied to the excess over `min`. */
  rate: number;
};

/** TRAIN-law graduated annual rates, 2023 onwards. */
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 250_000, baseTax: 0, rate: 0 },
  { min: 250_000, max: 400_000, baseTax: 0, rate: 0.15 },
  { min: 400_000, max: 800_000, baseTax: 22_500, rate: 0.2 },
  { min: 800_000, max: 2_000_000, baseTax: 102_500, rate: 0.25 },
  { min: 2_000_000, max: 8_000_000, baseTax: 402_500, rate: 0.3 },
  { min: 8_000_000, max: Infinity, baseTax: 2_202_500, rate: 0.35 },
];

/** Annual income tax due on taxable compensation income. */
export function computeAnnualIncomeTax(taxableIncome: number): number {
  const income = Number.isFinite(taxableIncome)
    ? Math.max(0, taxableIncome)
    : 0;
  const bracket =
    TAX_BRACKETS.find((b) => income > b.min && income <= b.max) ??
    TAX_BRACKETS[0];
  return bracket.baseTax + (income - bracket.min) * bracket.rate;
}

/** 13th month pay and other benefits exempt from tax each year. */
export const BENEFITS_EXEMPTION_CEILING = 90_000;

/** Annual taxable income exempt from tax. */
export const ANNUAL_EXEMPTION = 250_000;

export type IncomeTaxComputation = {
  annualGross: number;
  annualContributions: number;
  annualBenefits: number;
  taxableBenefits: number;
  exemptBenefits: number;
  taxableIncome: number;
  annualTax: number;
  monthlyTax: number;
  takeHomeMonthly: number;
  effectiveRate: number;
};

export function computeIncomeTax(input: {
  monthlyGross: number;
  monthlyContributions: number;
  annualBenefits: number;
}): IncomeTaxComputation {
  const annualGross = Math.max(0, input.monthlyGross) * 12;
  const annualContributions = Math.max(0, input.monthlyContributions) * 12;
  const annualBenefits = Math.max(0, input.annualBenefits);
  const exemptBenefits = Math.min(annualBenefits, BENEFITS_EXEMPTION_CEILING);
  const taxableBenefits = annualBenefits - exemptBenefits;
  const taxableIncome = Math.max(
    0,
    annualGross - annualContributions + taxableBenefits,
  );
  const annualTax = computeAnnualIncomeTax(taxableIncome);
  const monthlyTax = annualTax / 12;
  const takeHomeMonthly =
    input.monthlyGross - input.monthlyContributions - monthlyTax;
  const effectiveRate = annualGross > 0 ? (annualTax / annualGross) * 100 : 0;

  return {
    annualGross,
    annualContributions,
    annualBenefits,
    taxableBenefits,
    exemptBenefits,
    taxableIncome,
    annualTax,
    monthlyTax,
    takeHomeMonthly,
    effectiveRate,
  };
}
