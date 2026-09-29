import { RULES_INCOME_TAX } from "./incomeTax";
import { RULES_LABOR } from "./labor";
import { RULES_PAGIBIG } from "./pagibig";
import { RULES_PHILHEALTH } from "./philhealth";
import { RULES_SSS } from "./sss";

export type RuleSource = {
  label: string;
  url: string;
  effective?: string;
};

export type RuleMeta = {
  lastUpdated: string;
  effective?: string;
  sources: readonly RuleSource[];
};

/**
 * Maps calculator slugs to the official rules their computations follow.
 * Only calculators flagged `usesRules` in the registry appear here.
 */
export const RULES_BY_SLUG: Record<string, RuleMeta> = {
  "13th-month-pay": RULES_LABOR,
  "overtime-pay": RULES_LABOR,
  "night-differential": RULES_LABOR,
  sss: RULES_SSS,
  philhealth: RULES_PHILHEALTH,
  "pag-ibig": RULES_PAGIBIG,
  "income-tax": RULES_INCOME_TAX,
};
