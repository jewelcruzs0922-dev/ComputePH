/**
 * Explanatory content rendered on each calculator page below the tool:
 * how it works, the formula, a worked example, important notes, and FAQs.
 * Kept separate from `lib/registry.ts` (SEO metadata) so both stay readable.
 */

export type Faq = { q: string; a: string };

export type CalculatorContent = {
  intro: string[];
  howItWorks: string[];
  formula: { summary: string; lines: string[] };
  example: { scenario: string; steps: string[]; answer: string };
  notes: string[];
  faqs: Faq[];
};

export const CONTENT: Record<string, CalculatorContent> = {
  "13th-month-pay": {
    intro: [
      "13th month pay is a mandatory cash benefit for rank-and-file employees in the private sector — one-twelfth of your basic salary for the year, due on or before December 24.",
      "Estimate your 13th month pay from your monthly basic salary and the months you worked this year. For partial months or changing salaries, enter your average to prorate the year.",
    ],
    howItWorks: [
      "Multiply your monthly basic salary by the number of months you worked this year; a partial year is earned proportionally (for example 7.5 months).",
      "Divide that total by 12 — the statutory divisor, regardless of how many months you actually worked.",
      "Overtime pay, night differential, holiday pay, allowances, and other non-regular earnings are excluded. Only basic salary counts.",
      "If your salary changed during the year, enter an average (total basic earned ÷ months worked), or compute each period separately and add the results.",
    ],
    formula: {
      summary: "13th month pay = total basic salary earned during the year ÷ 12",
      lines: [
        "Total basic salary = monthly basic salary × months worked",
        "13th month pay = total basic salary ÷ 12",
        "Partial year example: (₱18,000 × 6 months) ÷ 12 = ₱9,000",
      ],
    },
    example: {
      scenario:
        "Maria earns ₱25,000 per month and worked the full year (12 months).",
      steps: [
        "Total basic salary = ₱25,000 × 12 = ₱300,000",
        "13th month pay = ₱300,000 ÷ 12 = ₱25,000",
        "If she only worked 8 months: (₱25,000 × 8) ÷ 12 = ₱16,666.67",
      ],
      answer:
        "A full year at ₱25,000/month yields ₱25,000 of 13th month pay — exactly one month's basic salary.",
    },
    notes: [
      "This calculator assumes the same basic monthly salary throughout the period. If your salary changed during the year, enter your average — total basic salary earned for the year ÷ months worked — for a more accurate estimate.",
      "Entitled: all rank-and-file employees in the private sector who worked at least one month during the calendar year, regardless of position or employment status.",
      "Payment is due on or before December 24. Employers may pay half before the regular school year opens and the remaining half on or before December 24.",
      "13th month pay and other benefits are exempt from income tax up to ₱90,000 per year. Larger amounts are added to your taxable income.",
      "Public-sector (government) employees are covered by a different pay system and are not covered by this rule.",
      "No request or application for exemption from payment of 13th month pay, or for deferment of its payment, is accepted or allowed (DOLE Labor Advisory No. 16-2025).",
    ],
    faqs: [
      {
        q: "Is 13th month pay taxable?",
        a: "13th month pay and other benefits are exempt from income tax up to ₱90,000 per calendar year. Anything above that amount is added to your taxable compensation.",
      },
      {
        q: "Do allowances count toward 13th month pay?",
        a: "No. Only basic salary is included. Overtime pay, night differential, holiday pay, profit sharing, and cash allowances are excluded unless they form part of your basic salary by company practice or agreement.",
      },
      {
        q: "What if I only worked part of the year?",
        a: "Your 13th month pay is simply prorated: total basic salary earned in the year divided by 12. Six months at ₱20,000/month gives (₱20,000 × 6) ÷ 12 = ₱10,000.",
      },
      {
        q: "When should my employer pay it?",
        a: "On or before December 24. If it is not paid, you may file a complaint with the nearest DOLE Regional or Field Office.",
      },
    ],
  },

  "overtime-pay": {
    intro: [
      "Overtime pay is the premium Filipino employees receive for work beyond eight hours in a day. Under the Labor Code, overtime is paid at a higher rate depending on the type of day you worked it — an ordinary day, your rest day, a special non-working day, or a regular holiday.",
      "Enter your rate, the day type, and your overtime hours to see exactly what you are owed, along with the hourly overtime rate used.",
    ],
    howItWorks: [
      "Start from your regular hourly rate. If you are paid daily, divide by 8. If you are paid monthly, divide by 26 for a daily rate first, then by 8 — the calculator accepts hourly or daily rates.",
      "Pick the type of day where the overtime happened — this determines the premium.",
      "We multiply your hourly rate by the required overtime multiplier for that day type (125% on an ordinary day up to 338% on a regular holiday that is also your rest day).",
      "Multiply the overtime rate by your overtime hours to get the amount owed.",
    ],
    formula: {
      summary: "Overtime pay = hourly rate × overtime multiplier × overtime hours",
      lines: [
        "Hourly rate = daily rate ÷ 8",
        "Ordinary day: hourly rate × 125% per OT hour",
        "Rest day: hourly rate × 169% (130% × 130%)",
        "Special non-working day: hourly rate × 169%",
        "Regular holiday: hourly rate × 260% (200% × 130%)",
        "Regular holiday on your rest day: hourly rate × 338% (260% × 130%)",
      ],
    },
    example: {
      scenario:
        "Joel earns ₱640 per day and worked 3 overtime hours on a Monday (an ordinary day).",
      steps: [
        "Hourly rate = ₱640 ÷ 8 = ₱80",
        "Ordinary-day OT multiplier = 125%",
        "Overtime rate = ₱80 × 1.25 = ₱100 per hour",
        "Overtime pay = ₱100 × 3 hours = ₱300",
      ],
      answer: "Joel is owed ₱300 for his 3 hours of overtime.",
    },
    notes: [
      "Overtime must be authorized or tolerated by the employer to be claimable — keep records of your actual hours.",
      "The 8-hour standard applies to the day; rest breaks are generally not counted as work time.",
      "Monthly-paid employees are still entitled to overtime on top of their salary when they work beyond 8 hours.",
      "If your overtime falls at night, the 10% night differential is paid on top of the overtime rate — see the night differential calculator.",
      "Holiday and rest-day rules differ for managerial employees and certain undertakings; verify with DOLE for your situation.",
    ],
    faqs: [
      {
        q: "How much is overtime on a regular day?",
        a: "At least 125% of your hourly rate for each overtime hour — that is your normal rate plus a 25% premium.",
      },
      {
        q: "Is overtime on Sunday automatically higher?",
        a: "Only if Sunday is your scheduled rest day — then the rest-day rules apply (169% per OT hour). If you normally work Sundays, ordinary-day overtime at 125% applies.",
      },
      {
        q: "Do I get overtime pay if I work 9 hours on a holiday?",
        a: "Yes. The first 8 hours are paid at the holiday rate (200% for a regular holiday), and the 9th hour is overtime at 130% of that day's hourly rate — 260% in total for that hour.",
      },
      {
        q: "Does night differential apply to overtime?",
        a: "Yes. If your overtime hours fall between 10 PM and 6 AM, the 10% night differential is paid on top of the overtime rate for those hours.",
      },
    ],
  },

  "night-differential": {
    intro: [
      "Night shift differential (NSD) is the additional 10% premium Filipino employees receive for every hour worked between 10:00 PM and 6:00 AM, under Article 86 of the Labor Code.",
      "Use this calculator to find out how much you earn for your night hours, based on your hourly, daily, or monthly rate.",
    ],
    howItWorks: [
      "Establish your regular hourly rate. Daily rate ÷ 8 gives it directly; monthly salary ÷ working hours per month gives an approximation.",
      "Count the hours you actually worked between 10 PM and 6 AM (the maximum is 8 hours per night).",
      "Multiply your hourly rate by 10%, then by the number of night hours.",
      "The result is additional pay — on top of your normal wage for those hours.",
    ],
    formula: {
      summary: "Night differential = hourly rate × 10% × night hours worked",
      lines: [
        "Hourly rate = daily rate ÷ 8",
        "NSD per hour = hourly rate × 0.10",
        "Total NSD = NSD per hour × hours worked between 10 PM and 6 AM",
      ],
    },
    example: {
      scenario:
        "Angel works a 10 PM to 6 AM shift on a daily rate of ₱640, so all 8 hours are night hours.",
      steps: [
        "Hourly rate = ₱640 ÷ 8 = ₱80",
        "NSD per hour = ₱80 × 10% = ₱8",
        "Total NSD for 8 hours = ₱8 × 8 = ₱64",
        "Her pay for the shift = ₱640 (base) + ₱64 (NSD) = ₱704",
      ],
      answer: "Angel earns ₱64 in night differential for that shift.",
    },
    notes: [
      "This is a standard estimate under the Labor Code — your actual night differential depends on your employment agreement, company policy, or collective bargaining terms.",
      "The premium applies to every hour worked in the 10 PM–6 AM window — including overtime hours, where both premiums stack.",
      "Night differential is part of your wages and is included when computing overtime premiums and (for most employees) 13th month pay is calculated on basic salary only.",
      "Actual shift schedules vary; only hours truly worked inside the window count.",
      "Employees required to work night shifts on rest days or holidays receive the night differential on top of those day-type premiums.",
    ],
    faqs: [
      {
        q: "How much is night differential in the Philippines?",
        a: "An additional 10% of your hourly rate for each hour worked between 10:00 PM and 6:00 AM.",
      },
      {
        q: "Is night differential mandatory?",
        a: "Yes — Article 86 of the Labor Code requires night shift differential for covered employees. The recognized exceptions are government employees; retail or service establishments regularly employing not more than five workers; domestic or personal-service staff; managerial employees; and field personnel.",
      },
      {
        q: "Does night differential count as overtime?",
        a: "No. They are separate premiums. If your night hours are also overtime hours (beyond 8 hours that day), you are entitled to both.",
      },
      {
        q: "Is night differential taxable?",
        a: "Night differential is part of your compensation income and is generally taxable, but minimum wage earners are exempt from tax on their wages regardless.",
      },
    ],
  },

  "daily-hourly-salary": {
    intro: [
      "Converting between monthly, daily, and hourly pay helps you compare job offers, price freelance work, or check whether your payslip is correct.",
      "This calculator converts in any direction using the standard Philippine assumptions of 26 working days per month and an 8-hour workday — both of which you can adjust.",
    ],
    howItWorks: [
      "Choose whether the amount you are entering is a monthly, daily, or hourly rate.",
      "We derive the other two figures using your working-days and working-hours assumptions.",
      "Monthly → daily divides by working days per month (default 26). Daily → hourly divides by 8.",
      "Hourly → daily and daily → monthly multiply instead, walking back up the chain.",
    ],
    formula: {
      summary:
        "Daily = monthly ÷ working days · Hourly = daily ÷ working hours per day",
      lines: [
        "Daily rate = monthly salary ÷ 26 working days",
        "Hourly rate = daily rate ÷ 8 hours",
        "Monthly salary = daily rate × 26 working days",
        "If your employer uses 30 or 31 days, change the field to match.",
      ],
    },
    example: {
      scenario: "Paolo earns ₱30,000 per month and wants his daily and hourly rates.",
      steps: [
        "Daily rate = ₱30,000 ÷ 26 = ₱1,153.85",
        "Hourly rate = ₱1,153.85 ÷ 8 = ₱144.23",
        "Using a 30-day divisor instead: ₱30,000 ÷ 30 = ₱1,000/day",
      ],
      answer:
        "Paolo's rate is about ₱1,153.85 per day or ₱144.23 per hour under the 26-day assumption.",
    },
    notes: [
      "The 26-day divisor comes from 313 working days a year ÷ 12 months — the common private-sector practice. Some employers use 30 or 31 days; check your contract or payslip.",
      "These conversions use basic salary only. Overtime, premiums, and allowances are additional.",
      "For job offers, compare on the same basis: a high monthly figure with many required days may be worth less than a lower figure with standard hours.",
      "Daily-rate employees are generally entitled to holiday pay and 13th month pay based on the same daily rate.",
    ],
    faqs: [
      {
        q: "How do you convert monthly salary to daily?",
        a: "Divide the monthly salary by the number of working days your employer uses — 26 is the common private-sector standard: ₱26,000 ÷ 26 = ₱1,000 per day.",
      },
      {
        q: "What is the standard divisor for daily rate?",
        a: "Most Philippine employers use 26 days per month (313 working days ÷ 12). Wage orders and company policies may specify otherwise.",
      },
      {
        q: "How do I get my hourly rate from my daily rate?",
        a: "Divide your daily rate by 8: ₱800 ÷ 8 = ₱100 per hour. That hourly figure is the base for overtime and night differential premiums.",
      },
      {
        q: "Is the conversion exact?",
        a: "It is an estimate based on the divisors you enter. Actual payroll may round differently or include rest days and holidays in the computation.",
      },
    ],
  },

  sss: {
    intro: [
      "Your SSS contribution is based on your Monthly Salary Credit (MSC) — not your exact salary. SSS maps your pay to a bracket on its schedule, then applies the current 15% total rate: 5% from you and 10% from your employer.",
      "This calculator uses the schedule effective January 1, 2025 (in force for 2026) under RA 11199, including the Employees' Compensation (EC) share paid by employers.",
    ],
    howItWorks: [
      "Enter your monthly compensation used for the SSS estimate.",
      "We find the MSC bracket your compensation falls into — brackets step by ₱500, from a ₱5,000 floor to a ₱35,000 ceiling.",
      "Your share is 5% of the MSC. Your employer adds 10% plus a ₱10 or ₱30 EC amount.",
      "Any MSC above ₱20,000 is credited to the Mandatory Provident Fund (MPF) at the same rates.",
    ],
    formula: {
      summary: "Employee share = MSC × 5% · Employer share = MSC × 10% + EC",
      lines: [
        "MSC = bracket of your salary on the SSS schedule (₱5,000–₱35,000)",
        "Employee share = MSC × 5%",
        "Employer share = MSC × 10% + EC (₱10 below MSC ₱15,000, ₱30 otherwise)",
        "Total remitted = MSC × 15% + EC",
      ],
    },
    example: {
      scenario: "Liza earns ₱22,400 per month.",
      steps: [
        "₱22,400 falls in the ₱22,250–₱22,749.99 range → MSC = ₱22,500",
        "Employee share = ₱22,500 × 5% = ₱1,125",
        "Employer share = ₱22,500 × 10% = ₱2,250, plus ₱30 EC = ₱2,280",
        "Total remitted = ₱1,125 + ₱2,280 = ₱3,405",
      ],
      answer: "Liza's SSS deduction is ₱1,125 per month.",
    },
    notes: [
      "The 15% rate is the final step of the increases mandated by RA 11199; the ₱5,000–₱35,000 MSC range applies for 2025 and 2026.",
      "Contributions are computed on the MSC, so your actual deduction changes only when your salary crosses a bracket.",
      "The portion of MSC above ₱20,000 goes to the MPF (MySSS Pension Booster) — a separate provident benefit paid on top of your retirement pension.",
      "Self-employed, voluntary, and OFW members pay the full 15% themselves instead of splitting with an employer.",
      "A month with no basic salary paid (for example, an unpaid leave month) has no employee contribution to compute — the minimum MSC applies only to salaries actually paid.",
      "Always confirm posted contributions in your My.SSS account — this calculator cannot access your SSS records.",
    ],
    faqs: [
      {
        q: "How much is the SSS contribution for a ₱20,000 salary?",
        a: "The MSC is ₱20,000: you pay ₱1,000 (5%), your employer pays ₱2,000 (10%), for ₱3,000 total plus ₱30 EC — ₱3,030 remitted.",
      },
      {
        q: "What is the maximum SSS contribution?",
        a: "At the ₱35,000 MSC ceiling: ₱1,750 employee share, ₱3,500 employer share, plus ₱30 EC — ₱5,280 per month in total.",
      },
      {
        q: "Why is my deduction not exactly 5% of my salary?",
        a: "Because contributions use the Monthly Salary Credit bracket, not your exact salary. A ₱22,400 salary uses the ₱22,500 MSC.",
      },
      {
        q: "Did SSS contributions increase for 2026?",
        a: "No new increase applies for 2026. The 15% rate and ₱5,000–₱35,000 MSC range effective January 1, 2025 remain in force.",
      },
    ],
  },

  philhealth: {
    intro: [
      "PhilHealth premiums for employed members are shared equally: 5% of your monthly basic salary, split 2.5% for you and 2.5% for your employer, under the Universal Health Care Act (RA 11223).",
      "The computation is bounded by an income floor of ₱10,000 and a ceiling of ₱100,000 — so monthly premiums range from ₱500 to ₱5,000. PhilHealth confirmed the 5% rate applies for 2026.",
    ],
    howItWorks: [
      "Enter your monthly basic salary.",
      "If your salary is below ₱10,000, the computation uses the ₱10,000 floor. Above ₱100,000, it stops at the ₱100,000 ceiling.",
      "The 5% premium is computed on that base.",
      "For employed members, the premium is split equally: 2.5% employee, 2.5% employer.",
    ],
    formula: {
      summary: "Premium = base × 5%, where base is clamped between ₱10,000 and ₱100,000",
      lines: [
        "Contribution base = min(max(salary, ₱10,000), ₱100,000)",
        "Total premium = base × 5%",
        "Employee share = total premium ÷ 2 (2.5% of base)",
        "Employer share = total premium ÷ 2 (2.5% of base)",
      ],
    },
    example: {
      scenario: "Carlo earns ₱30,000 per month as a regular employee.",
      steps: [
        "Contribution base = ₱30,000 (within floor and ceiling)",
        "Total premium = ₱30,000 × 5% = ₱1,500",
        "Employee share = ₱1,500 ÷ 2 = ₱750",
        "Employer share = ₱1,500 ÷ 2 = ₱750",
      ],
      answer: "Carlo's monthly PhilHealth deduction is ₱750.",
    },
    notes: [
      "The 5% rate is the final scheduled step under RA 11223 and is confirmed to continue for 2026.",
      "Self-employed, voluntary, and OFW direct contributors pay the full 5% themselves — there is no employer to split with.",
      "Premiums are not investments — they buy case-rate-based health coverage, not savings.",
      "Kasambahays earning ₱5,000 or below have the employer shoulder the full premium.",
      "A month with no basic salary paid (for example, an unpaid leave month) has no employee premium to compute — enter your actual salary.",
      "Your payslip should generally reflect the applicable PhilHealth schedule for your membership category. Confirm discrepancies with your employer or PhilHealth.",
    ],
    faqs: [
      {
        q: "How much is PhilHealth for a ₱25,000 salary?",
        a: "Total premium ₱1,250 (5% of ₱25,000) — ₱625 employee share and ₱625 employer share.",
      },
      {
        q: "What is the maximum PhilHealth contribution?",
        a: "₱5,000 per month total at the ₱100,000 ceiling — ₱2,500 from the employee and ₱2,500 from the employer.",
      },
      {
        q: "Is there a minimum contribution?",
        a: "Yes — ₱500 per month total (₱250 each), which is 5% of the ₱10,000 income floor. The floor applies to salaries from ₱1 up to ₱10,000; a ₱0 salary has no deduction to compute.",
      },
      {
        q: "Did the PhilHealth rate increase for 2026?",
        a: "No. PhilHealth announced the premium rate remains at 5% for 2026, the final scheduled adjustment under the UHC Law.",
      },
    ],
  },

  "pag-ibig": {
    intro: [
      "Pag-IBIG (HDMF) savings are small but useful: they fund your housing loan eligibility and multi-purpose loans. Employees contribute 1% of the fund salary when monthly compensation is ₱1,500 or below, and 2% otherwise — and the fund salary itself is capped at ₱10,000, so the most an employee pays is ₱200 per month.",
      "Your employer separately pays 2% of the same fund salary — up to ₱200 — so up to ₱400 in total is credited to your account each month.",
    ],
    howItWorks: [
      "Enter your monthly compensation.",
      "The fund salary is your compensation capped at ₱10,000.",
      "Employees earning ₱1,500 or below contribute 1%; everyone else contributes 2%.",
      "Your employer also pays 2% of the same fund salary.",
    ],
    formula: {
      summary: "Employee share = fund salary × 2% (1% if compensation ≤ ₱1,500)",
      lines: [
        "Fund salary = min(monthly compensation, ₱10,000)",
        "Employee share = fund salary × 2% — or × 1% if compensation ≤ ₱1,500 (max ₱200)",
        "Employer share = fund salary × 2% (max ₱200)",
        "Total monthly savings = employee + employer (max ₱400)",
      ],
    },
    example: {
      scenario: "Bea earns ₱18,000 per month.",
      steps: [
        "Fund salary = min(₱18,000, ₱10,000) = ₱10,000",
        "Employee share = ₱10,000 × 2% = ₱200",
        "Employer share = ₱10,000 × 2% = ₱200",
        "Total credited monthly = ₱400",
      ],
      answer: "Bea's Pag-IBIG deduction is ₱200 per month — the maximum.",
    },
    notes: [
      "The ₱10,000 Maximum Fund Salary comes from HDMF Circular No. 460, effective February 2024 and still in force for 2026.",
      "Even if you earn more than ₱10,000, your mandatory contribution stays at ₱200 — you may make voluntary savings in addition to your mandatory contribution.",
      "Pag-IBIG loans and housing programs require consistent contributions; gaps can affect eligibility.",
      "MP2 Savings is a separate, voluntary program with higher dividends — it is not included here.",
      "Pag-IBIG membership and contribution rules vary by membership category. This calculator is intended for standard employee mandatory contributions.",
    ],
    faqs: [
      {
        q: "How much is Pag-IBIG for a ₱25,000 salary?",
        a: "₱200 from you and ₱200 from your employer — the ₱10,000 fund-salary cap already applies at that level.",
      },
      {
        q: "What is the maximum Pag-IBIG contribution?",
        a: "₱200 employee + ₱200 employer = ₱400 per month for the mandatory savings. You may make voluntary savings in addition to your mandatory contribution.",
      },
      {
        q: "Why is my Pag-IBIG only ₱200 when I earn more?",
        a: "Because contributions are based on the ₱10,000 Maximum Fund Salary, not your full salary. 2% of ₱10,000 is ₱200.",
      },
      {
        q: "Do part-time or kasambahay employees contribute?",
        a: "Yes. For kasambahays (household workers) under HDMF Circular No. 460, the mandatory monthly savings is shouldered entirely by the employer while the fund salary is below ₱5,000 — 3% if the fund salary is ₱1,500 or below, and 4% if it is above ₱1,500 but below ₱5,000. At ₱5,000 or above, the usual employee and employer sharing applies. This calculator follows the standard employee mandatory savings and does not compute kasambahay savings separately.",
      },
    ],
  },

  "income-tax": {
    intro: [
      "Filipino employees pay income tax through withholding — your employer deducts it from your salary each payroll period using the BIR's graduated table. Under the TRAIN Law, your first ₱250,000 of annual taxable income is exempt.",
      "This calculator estimates your annual income tax and monthly withholding from your gross pay, contributions, and 13th month pay, using the rates in effect from January 1, 2023 onwards.",
    ],
    howItWorks: [
      "Enter your monthly gross compensation and your monthly employee contributions (SSS + PhilHealth + Pag-IBIG).",
      "Enter your total 13th month pay and other benefits for the year — the first ₱90,000 is tax-exempt.",
      "We annualize everything, subtract contributions and exempt benefits to get taxable income.",
      "The TRAIN graduated rate is applied, and the annual tax is divided by 12 for the estimated monthly withholding.",
    ],
    formula: {
      summary:
        "Tax = graduated rates applied to (annual gross − contributions + taxable benefits)",
      lines: [
        "Annual gross = monthly gross × 12",
        "Taxable benefits = max(0, annual benefits − ₱90,000)",
        "Taxable income = annual gross − annual contributions + taxable benefits",
        "Annual tax = TRAIN bracket computation on taxable income",
        "Monthly withholding ≈ annual tax ÷ 12",
      ],
    },
    example: {
      scenario:
        "Ramon earns ₱40,000 monthly, pays ₱2,450 in contributions, and receives ₱40,000 of 13th month pay.",
      steps: [
        "Annual gross = ₱40,000 × 12 = ₱480,000",
        "Annual contributions = ₱2,450 × 12 = ₱29,400",
        "13th month ₱40,000 is fully exempt (below ₱90,000)",
        "Taxable income = ₱480,000 − ₱29,400 = ₱450,600",
        "Tax = ₱22,500 + 20% × (₱450,600 − ₱400,000) = ₱32,620",
        "Monthly withholding ≈ ₱32,620 ÷ 12 = ₱2,718.33",
      ],
      answer: "Ramon's estimated monthly withholding tax is ₱2,718.33.",
    },
    notes: [
      "These are the TRAIN-law rates effective January 1, 2023 and onwards, which continue to apply to 2026 income.",
      "Your employer's actual withholding uses the BIR table per payroll period and may differ slightly from annual ÷ 12, especially with bonuses.",
      "Minimum wage earners and employees whose total annual taxable income does not exceed ₱250,000 pay no income tax.",
      "De minimis benefits (rice, medical, clothing allowances under BIR rules) are separate from the ₱90,000 13th-month ceiling.",
      "This is an estimate for compensation income only — it does not cover business income, mixed income, or non-resident aliens.",
    ],
    faqs: [
      {
        q: "What salary is taxable in the Philippines?",
        a: "Annual taxable income above ₱250,000. For a monthly-paid employee, that is roughly gross compensation above ₱20,833 per month after contributions.",
      },
      {
        q: "How much is withholding tax on a ₱30,000 salary?",
        a: "It depends on your contributions and benefits. Example: ₱30,000/month with ₱1,500 contributions gives annual taxable income of ₱342,000 → ₱13,800/year → about ₱1,150/month.",
      },
      {
        q: "Is 13th month pay taxed?",
        a: "13th month pay and other benefits are exempt up to ₱90,000 per year. Beyond that, the excess is added to your taxable income.",
      },
      {
        q: "Why is my monthly tax different from annual tax ÷ 12?",
        a: "For a steady monthly salary the BIR monthly withholding table works out to about annual tax ÷ 12. Differences appear with bonuses, 13th month pay, de minimis benefits, or mid-year pay changes — your employer annualizes each payroll period, and any gap is trued up at year-end on Form 2316.",
      },
    ],
  },

  loan: {
    intro: [
      "A loan calculator shows the real cost of borrowing before you sign anything: your monthly amortization, total interest, and total amount repaid.",
      "This calculator uses the standard amortization formula banks and lending companies use for personal, auto, and housing loans with equal monthly payments.",
    ],
    howItWorks: [
      "Enter the loan amount (principal), the annual interest rate, and the term.",
      "We convert the annual rate to a monthly rate and the term to months.",
      "The amortization formula spreads principal and interest across equal monthly payments.",
      "Total interest is everything you pay above the principal.",
    ],
    formula: {
      summary:
        "M = P × i ÷ (1 − (1 + i)⁻ⁿ), where i is the monthly rate and n the number of months",
      lines: [
        "i = annual rate ÷ 12 (e.g. 12% ÷ 12 = 1% = 0.01)",
        "n = number of monthly payments",
        "M = P × i ÷ (1 − (1 + i)^-n)",
        "Total repaid = M × n · Total interest = M × n − P",
        "At 0% interest: M = P ÷ n",
      ],
    },
    example: {
      scenario: "A ₱500,000 loan at 12% per year for 5 years (60 months).",
      steps: [
        "Monthly rate i = 0.12 ÷ 12 = 0.01",
        "M = 500,000 × 0.01 ÷ (1 − 1.01⁻⁶⁰) ≈ ₱11,122.22",
        "Total repaid = ₱11,122.22 × 60 = ₱667,333.43",
        "Total interest = ₱667,333.43 − ₱500,000 = ₱167,333.43",
      ],
      answer: "Monthly amortization is about ₱11,122.22, with ₱167,333.43 of interest.",
    },
    notes: [
      "Actual loan payments may include processing fees, insurance, and fire/mortgage insurance that this calculator does not include.",
      "Banks may compute interest daily or use add-on methods; ask your lender which method applies.",
      "A shorter term or lower rate reduces total interest — compare total cost, not just the monthly payment.",
      "Paying extra principal (if your loan allows) shortens the term and saves interest.",
      "For home loans, check if the rate is fixed for a period then re-prices — your amortization can change later.",
    ],
    faqs: [
      {
        q: "How is monthly amortization computed?",
        a: "Using the formula M = P × i ÷ (1 − (1 + i)⁻ⁿ) — the standard amortization equation for equal monthly payments.",
      },
      {
        q: "How much interest will I pay on a car loan?",
        a: "For ₱800,000 at 8% over 5 years: about ₱173,266.93 of interest (₱973,266.93 total). Enter your exact figures above for your own numbers.",
      },
      {
        q: "Is it better to shorten my loan term?",
        a: "Usually yes for total cost: a 3-year term pays far less interest than a 5-year term at the same rate — but the monthly payment is higher.",
      },
      {
        q: "Why does my lender's figure differ slightly?",
        a: "Rounding conventions, payment dates, fees, and daily interest calculations vary by institution. Small differences are normal.",
      },
    ],
  },

  interest: {
    intro: [
      "Whether you are saving or borrowing, interest determines how fast money grows — or how expensive debt becomes.",
      "Choose simple interest (interest only on the original amount) or compound interest (interest also earns interest) and see the final amount over any term.",
    ],
    howItWorks: [
      "Enter the principal, the annual interest rate, and the term.",
      "Simple interest multiplies principal × rate × time once.",
      "Compound interest applies the rate repeatedly — annually, quarterly, monthly, or daily — and each round adds to the balance that earns the next round.",
      "The difference between the two grows quickly over long terms.",
    ],
    formula: {
      summary: "Simple: A = P(1 + rt) · Compound: A = P(1 + r/n)^(nt)",
      lines: [
        "Simple interest I = P × r × t (r as decimal, t in years)",
        "Final amount A = P + I",
        "Compound amount A = P × (1 + r/n)^(n×t)",
        "n = compounding periods per year (12 = monthly)",
      ],
    },
    example: {
      scenario:
        "₱100,000 at 6% per year for 5 years — simple versus monthly compounding.",
      steps: [
        "Simple: I = ₱100,000 × 0.06 × 5 = ₱30,000 → A = ₱130,000",
        "Compound (monthly): A = 100,000 × (1 + 0.06/12)^(12×5) ≈ ₱134,885.02",
        "Compounding earns ₱4,885.02 more over the same 5 years",
      ],
      answer:
        "Monthly compounding grows the balance to about ₱134,885 — ₱4,885 more than simple interest.",
    },
    notes: [
      "Banks typically quote savings rates as annual rates and compound monthly or daily; loans may compound monthly.",
      "For deposits, check the effective annual rate (APY/EIR) to compare accounts fairly.",
      "Interest earned is taxable in the Philippines (20% final withholding tax on bank interest for individuals), which this calculator does not deduct.",
      "Small rate differences matter a lot over decades — that is the power of compounding.",
    ],
    faqs: [
      {
        q: "What is the difference between simple and compound interest?",
        a: "Simple interest is computed only on the original principal. Compound interest is computed on the principal plus previously earned interest, so the balance grows faster.",
      },
      {
        q: "How much is the interest on ₱50,000 at 6% for 1 year?",
        a: "Simple interest gives ₱3,000. With monthly compounding you would earn about ₱3,083.89.",
      },
      {
        q: "How often do banks compound interest?",
        a: "Most Philippine savings accounts compound monthly or daily. Time deposits often quote a rate for a fixed term.",
      },
      {
        q: "Is bank interest taxable?",
        a: "Yes — interest from Philippine bank deposits is subject to a 20% final withholding tax for individuals.",
      },
    ],
  },

  discount: {
    intro: [
      "Need the sale price fast? Enter the original price and the discount percentage to see exactly what you pay and what you save.",
      "This is a generic percentage discount calculator. A 20% rate is the figure used for senior citizen and PWD discounts, but this tool only does the percentage math — eligibility and VAT rules are set by law.",
    ],
    howItWorks: [
      "Enter the original price of the item.",
      "Enter the discount percentage — 10%, 15%, and 20% are the most common.",
      "We multiply the price by the rate to get your savings, then subtract.",
      "The per-₱100 figure gives you a quick mental check while shopping.",
    ],
    formula: {
      summary: "You pay = price × (1 − discount rate)",
      lines: [
        "Savings = price × rate ÷ 100",
        "Final price = price − savings",
        "Quick check: pay ₱(100 − rate) for every ₱100 of original price",
      ],
    },
    example: {
      scenario: "A ₱1,500 jacket is on sale at 20% off.",
      steps: [
        "Savings = ₱1,500 × 20% = ₱300",
        "You pay = ₱1,500 − ₱300 = ₱1,200",
        "Quick check: 100 − 20 = ₱80 per ₱100 → ₱1,200",
      ],
      answer: "You pay ₱1,200 and save ₱300.",
    },
    notes: [
      "Senior citizens and PWDs are entitled to a 20% discount on eligible goods and services, plus VAT exemption on covered items — this calculator only does the percentage math and does not decide eligibility.",
      "Sale prices ('50% off') are calculated on the original price unless the store says otherwise.",
      "For installment purchases, the discount usually applies to the cash price — check whether interest is added afterward.",
      "Some promos exclude specific brands or items; the shelf price is still the mathematical base here.",
    ],
    faqs: [
      {
        q: "How do I calculate 20% off?",
        a: "Multiply the price by 0.20 to get the savings, then subtract: ₱2,500 × 0.20 = ₱500 off → you pay ₱2,000.",
      },
      {
        q: "What is the senior citizen discount in the Philippines?",
        a: "20% off the selling price on eligible goods and services, plus VAT exemption, under RA 9994 (expanded senior benefits) and related laws.",
      },
      {
        q: "Does the discount apply to the VAT-inclusive price?",
        a: "For seniors and PWDs, eligible items are VAT-exempt first, then the 20% discount applies to the net price — this calculator does not model VAT.",
      },
      {
        q: "How do I reverse a discount to find the original price?",
        a: "Divide the sale price by (1 − rate): ₱840 at 20% off → ₱840 ÷ 0.80 = ₱1,050 original price.",
      },
    ],
  },

  installment: {
    intro: [
      "Installment plans make big purchases manageable — but the extra cost is easy to miss. This calculator shows your monthly amortization and the true total cost before you commit.",
      "It supports both methods used in the Philippines: add-on interest (common in retail and '0%' promo conversions) and amortized/reducing-balance (how banks compute loans).",
    ],
    howItWorks: [
      "Enter the item price, down payment, interest rate, and number of monthly payments.",
      "Add-on interest charges the rate on the full financed amount upfront, then splits everything into equal payments.",
      "Amortized interest charges each month on the remaining balance — so you pay less total interest than add-on for the same rate.",
      "We compare your total paid against the original price to show the real markup.",
    ],
    formula: {
      summary:
        "Add-on: monthly = (financed + financed × rate × months) ÷ months",
      lines: [
        "Amount financed = price − down payment",
        "Add-on interest = financed × annual rate × months ÷ 12 ÷ 100",
        "Monthly (add-on) = (financed + add-on interest) ÷ months",
        "Monthly (amortized) = financed × i ÷ (1 − (1 + i)⁻ⁿ), i = rate ÷ 12",
        "Total paid = monthly × months + down payment",
      ],
    },
    example: {
      scenario:
        "A ₱30,000 appliance with ₱5,000 down, 12 monthly payments, 12% add-on rate.",
      steps: [
        "Financed = ₱30,000 − ₱5,000 = ₱25,000",
        "Add-on interest = ₱25,000 × 12% × 12 ÷ 12 = ₱3,000",
        "Monthly = (₱25,000 + ₱3,000) ÷ 12 = ₱2,333.33",
        "Total paid = ₱2,333.33 × 12 + ₱5,000 = ₱33,000",
      ],
      answer:
        "₱2,333.33 per month, ₱3,000 of interest, ₱33,000 total — 10% above the sticker price.",
    },
    notes: [
      "Add-on interest is almost always more expensive than the same rate amortized — compare both methods above for the same rate.",
      "'0%' installment promos usually mean the interest is already included in the price or paid by the merchant; confirm the cash price.",
      "Missed installment payments usually incur penalties and can affect your credit record with the Credit Information Corporation.",
      "Retail installment rates are often quoted per month or as a flat add-on rate — make sure you enter the annual equivalent.",
      "Always read the truth-in-lending disclosure: it must show the total cost and annual percentage rate.",
    ],
    faqs: [
      {
        q: "How is installment monthly amortization computed?",
        a: "For add-on: (financed amount + total add-on interest) ÷ number of months. For amortized: the standard loan formula on the reducing balance.",
      },
      {
        q: "What is the difference between add-on and amortized interest?",
        a: "Add-on charges interest on the original financed amount for the whole term. Amortized charges interest only on the shrinking balance — so add-on costs more at the same rate.",
      },
      {
        q: "How much will I really pay for a ₱50,000 item on installment?",
        a: "Example: ₱10,000 down, 12% add-on, 12 months → ₱4,800 interest, ₱3,733.33 per month, ₱54,800 total cost.",
      },
      {
        q: "Are '0%' installment plans really free?",
        a: "Usually yes for the stated schedule — merchants pay a fee to the card issuer. Watch for processing fees or higher cash prices.",
      },
    ],
  },
};
