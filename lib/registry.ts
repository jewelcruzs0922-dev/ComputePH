export type CategoryId = "work" | "government" | "money";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  /** URL fragment used on the calculators directory page. */
  anchor: string;
};

export type CalculatorMeta = {
  /** Route: /calculators/[slug] */
  slug: string;
  /** Short display name, e.g. "13th Month Pay". */
  name: string;
  /** SEO/H1 title, e.g. "13th Month Pay Calculator Philippines". */
  title: string;
  category: CategoryId;
  /** One-liner shown on cards. */
  summary: string;
  /** Meta description. */
  description: string;
  /** SEO keywords (kept small and natural). */
  keywords: string[];
  /** Extra natural-language search phrases. */
  aliases: string[];
  /** Shown on the homepage "Popular" row. */
  popular?: boolean;
  /** True for calculators driven by government/official rules. */
  usesRules?: boolean;
  /** Preferred related-calculator slugs (shown first on the page). */
  related?: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "work",
    name: "Work & Salary",
    description:
      "Salary, overtime, night shift, and employee pay computations.",
    anchor: "work-salary",
  },
  {
    id: "government",
    name: "Government & Contributions",
    description:
      "SSS, PhilHealth, Pag-IBIG, and Philippine income tax estimates.",
    anchor: "government-contributions",
  },
  {
    id: "money",
    name: "Money",
    description: "Loans, interest, discounts, and installment plans.",
    anchor: "money",
  },
];

export const CALCULATORS: CalculatorMeta[] = [
  {
    slug: "13th-month-pay",
    name: "13th Month Pay",
    title: "13th Month Pay Calculator Philippines",
    category: "work",
    summary:
      "Compute your prorated 13th month pay from your basic monthly salary.",
    description:
      "Free 13th month pay calculator for the Philippines. Enter your monthly basic salary and months worked to get your estimated 13th month pay, plus how the formula works.",
    keywords: [
      "13th month pay",
      "13th month",
      "trece",
      "13 month pay philippines",
      "13th month pay formula",
    ],
    aliases: [
      "13th month calculator",
      "thirteenth month pay",
      "13th month pay computation",
      "13th month prorate",
    ],
    popular: true,
    usesRules: true,
    related: ["daily-hourly-salary", "overtime-pay", "income-tax"],
  },
  {
    slug: "overtime-pay",
    name: "Overtime Pay",
    title: "Overtime Pay Calculator Philippines",
    category: "work",
    summary:
      "Estimate overtime pay for ordinary days, rest days, and holidays.",
    description:
      "Free overtime pay calculator for the Philippines. Compute OT pay for ordinary days, rest days, special days, and regular holidays using DOLE overtime rates.",
    keywords: [
      "overtime pay",
      "overtime calculator",
      "OT pay philippines",
      "overtime rate",
      "do overtime",
    ],
    aliases: ["overtime computation", "ot calculator", "extra time pay"],
    popular: true,
    usesRules: true,
  },
  {
    slug: "night-differential",
    name: "Night Differential",
    title: "Night Differential Calculator Philippines",
    category: "work",
    summary:
      "Compute the 10% night shift premium for work between 10 PM and 6 AM.",
    description:
      "Free night differential calculator for the Philippines. Estimate the 10% night shift premium earned for hours worked between 10:00 PM and 6:00 AM.",
    keywords: [
      "night differential",
      "night shift premium",
      "night differential calculator",
      "10pm to 6am pay",
      "nd pay",
    ],
    aliases: ["night diff", "night differential pay", "graveyard shift pay"],
    usesRules: true,
  },
  {
    slug: "daily-hourly-salary",
    name: "Daily / Hourly Salary",
    title: "Daily and Hourly Salary Calculator Philippines",
    category: "work",
    summary:
      "Convert monthly salary to daily and hourly rates (and vice versa).",
    description:
      "Free daily and hourly salary calculator for the Philippines. Convert monthly pay to daily and hourly rates using standard working-day and working-hour assumptions.",
    keywords: [
      "daily salary calculator",
      "hourly rate philippines",
      "monthly to daily",
      "daily to hourly",
      "salary conversion",
    ],
    aliases: [
      "hourly salary calculator",
      "daily rate calculator",
      "monthly to hourly",
    ],
  },
  {
    slug: "sss",
    name: "SSS Contribution",
    title: "SSS Contribution Calculator Philippines",
    category: "government",
    summary:
      "Compute your monthly SSS employee and employer contribution shares.",
    description:
      "Free SSS contribution calculator for the Philippines. Estimate your monthly SSS employee share, employer share, and total contribution based on the current contribution schedule.",
    keywords: [
      "sss contribution",
      "sss calculator",
      "sss share",
      "sss monthly contribution",
      "social security system",
    ],
    aliases: ["sss employee share", "sss contribution table", "sss pagasa"],
    popular: true,
    usesRules: true,
  },
  {
    slug: "philhealth",
    name: "PhilHealth Contribution",
    title: "PhilHealth Contribution Calculator Philippines",
    category: "government",
    summary:
      "Estimate your PhilHealth premium share as an employed member.",
    description:
      "Free PhilHealth contribution calculator for the Philippines. Estimate your monthly PhilHealth premium, employee share, and employer share using the current premium rate.",
    keywords: [
      "philhealth contribution",
      "philhealth calculator",
      "philhealth premium",
      "phi health share",
    ],
    aliases: ["philhealth employee share", "philhealth premium calculator"],
    usesRules: true,
  },
  {
    slug: "pag-ibig",
    name: "Pag-IBIG Contribution",
    title: "Pag-IBIG Contribution Calculator Philippines",
    category: "government",
    summary:
      "Compute your monthly Pag-IBIG (HDMF) savings contribution.",
    description:
      "Free Pag-IBIG contribution calculator for the Philippines. Estimate your monthly Pag-IBIG fund salary, employee share, and employer share using current HDMF rules.",
    keywords: [
      "pag-ibig contribution",
      "pagibig calculator",
      "hdmf contribution",
      "pag-ibig monthly",
    ],
    aliases: ["pagibig share", "pag-ibig fund salary", "home development mutual fund"],
    usesRules: true,
  },
  {
    slug: "income-tax",
    name: "Philippine Income Tax",
    title: "Income Tax Calculator Philippines",
    category: "government",
    summary:
      "Estimate annual income tax and monthly withholding for compensation income.",
    description:
      "Free Philippine income tax calculator for compensation income. Estimate annual income tax and monthly withholding tax using the current TRAIN-law graduated rates.",
    keywords: [
      "income tax calculator",
      "withholding tax philippines",
      "bir tax calculator",
      "train tax",
      "annual income tax",
    ],
    aliases: [
      "withholding tax calculator",
      "monthly tax deduction",
      "tax table philippines",
    ],
    popular: true,
    usesRules: true,
  },
  {
    slug: "loan",
    name: "Loan Calculator",
    title: "Loan Calculator Philippines",
    category: "money",
    summary:
      "Estimate monthly amortization, total interest, and total repayment.",
    description:
      "Free loan calculator for the Philippines. Estimate monthly amortization, total interest, and total repayment for personal, auto, or housing loans.",
    keywords: [
      "loan calculator",
      "monthly amortization",
      "loan payment philippines",
      "amortization calculator",
    ],
    aliases: ["car loan calculator", "personal loan", "housing loan calculator"],
    popular: true,
    related: ["interest", "installment", "discount"],
  },
  {
    slug: "interest",
    name: "Interest Calculator",
    title: "Interest Calculator Philippines",
    category: "money",
    summary:
      "Compute simple or compound interest on savings and investments.",
    description:
      "Free interest calculator. Compute simple or compound interest, final amount, and how much you earn over a given period.",
    keywords: [
      "interest calculator",
      "simple interest",
      "compound interest",
      "savings interest",
    ],
    aliases: ["how much interest", "money growth", "deposit interest"],
  },
  {
    slug: "discount",
    name: "Discount Calculator",
    title: "Discount Calculator Philippines",
    category: "money",
    summary:
      "Find the sale price and savings from any percentage discount.",
    description:
      "Free discount calculator for the Philippines. Compute the final price and savings from any percentage discount, plus what you pay for every ₱100 of original price.",
    keywords: [
      "discount calculator",
      "sale price calculator",
      "percentage off",
    ],
    aliases: ["how much off", "price reduction", "20 percent discount"],
    popular: true,
    related: ["installment", "loan", "interest"],
  },
  {
    slug: "installment",
    name: "Installment Calculator",
    title: "Installment Calculator Philippines",
    category: "money",
    summary:
      "Break a purchase into monthly installments and see the true cost.",
    description:
      "Free installment calculator for the Philippines. Estimate monthly amortization, total interest or markup, and total cost for add-on or amortized installment plans.",
    keywords: [
      "installment calculator",
      "monthly installment philippines",
      "add-on interest",
      "deferred payment",
    ],
    aliases: ["payment plan", "installment plan", "0 interest installment"],
  },
];

const BY_SLUG = new Map(CALCULATORS.map((c) => [c.slug, c]));

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return BY_SLUG.get(slug);
}

export function getCategory(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}

export function calculatorsByCategory(id: CategoryId): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.category === id);
}

export function popularCalculators(): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.popular);
}

export function relatedCalculators(meta: CalculatorMeta, limit = 3): CalculatorMeta[] {
  if (meta.related) {
    const picked: CalculatorMeta[] = [];
    for (const slug of meta.related) {
      const found = BY_SLUG.get(slug);
      if (found && found.slug !== meta.slug && picked.length < limit) {
        picked.push(found);
      }
    }
    if (picked.length > 0) return picked;
  }
  return CALCULATORS.filter(
    (c) => c.category === meta.category && c.slug !== meta.slug,
  ).slice(0, limit);
}
