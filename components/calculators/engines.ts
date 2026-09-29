import type { CalculatorEngine } from "@/lib/types";
import * as discount from "@/lib/calculators/discount";
import * as installment from "@/lib/calculators/installment";
import * as interest from "@/lib/calculators/interest";
import * as loan from "@/lib/calculators/loan";
import * as nightDifferential from "@/lib/calculators/nightDifferential";
import * as overtime from "@/lib/calculators/overtime";
import * as pagibig from "@/lib/calculators/pagibig";
import * as philhealth from "@/lib/calculators/philhealth";
import * as salary from "@/lib/calculators/salary";
import * as sss from "@/lib/calculators/sss";
import * as thirteenthMonth from "@/lib/calculators/thirteenthMonth";
import * as incomeTax from "@/lib/calculators/incomeTax";

/**
 * Maps each calculator slug to its pure calculation engine. Every engine is
 * plain TypeScript — no React — so it stays testable and easy to update.
 */
export const CALCULATOR_ENGINES: Record<string, CalculatorEngine> = {
  "13th-month-pay": {
    fields: thirteenthMonth.fields,
    calculate: thirteenthMonth.calculate,
  },
  "overtime-pay": { fields: overtime.fields, calculate: overtime.calculate },
  "night-differential": {
    fields: nightDifferential.fields,
    calculate: nightDifferential.calculate,
  },
  "daily-hourly-salary": { fields: salary.fields, calculate: salary.calculate },
  sss: { fields: sss.fields, calculate: sss.calculate },
  philhealth: { fields: philhealth.fields, calculate: philhealth.calculate },
  "pag-ibig": { fields: pagibig.fields, calculate: pagibig.calculate },
  "income-tax": { fields: incomeTax.fields, calculate: incomeTax.calculate },
  loan: { fields: loan.fields, calculate: loan.calculate },
  interest: { fields: interest.fields, calculate: interest.calculate },
  discount: { fields: discount.fields, calculate: discount.calculate },
  installment: {
    fields: installment.fields,
    calculate: installment.calculate,
  },
};
