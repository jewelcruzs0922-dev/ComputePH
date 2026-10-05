import type { Metadata } from "next";
import Link from "next/link";
import SourceNotice from "@/components/ui/SourceNotice";
import { RULES_BY_SLUG } from "@/lib/rules";
import { SITE_URL } from "@/lib/site";

const PATH = "/guides/13th-month-pay-philippines";

export const metadata: Metadata = {
  title: "13th Month Pay in the Philippines: Rules and Proration",
  description:
    "How 13th month pay works in the Philippines: who receives it, the one-twelfth formula, proration, what counts as basic salary, and the December 24 deadline.",
  keywords: [
    "13th month pay",
    "13th month pay philippines",
    "13th month pay rules",
  ],
  alternates: { canonical: PATH },
};

const rules = RULES_BY_SLUG["13th-month-pay"];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE_URL}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "13th Month Pay Guide",
          item: `${SITE_URL}${PATH}`,
        },
      ],
    },
  ],
};

const linkClass =
  "font-medium text-royal-strong underline underline-offset-4 hover:text-navy";

export default function ThirteenthMonthGuidePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <h1 className="text-3xl font-bold tracking-tight text-navy">
        13th Month Pay in the Philippines
      </h1>

      <div className="mt-6 space-y-6 text-base leading-7 text-ink-muted">
        <p>
          13th month pay is a mandatory cash benefit for rank-and-file employees
          in the private sector. It equals one-twelfth of the basic salary you
          earned during the calendar year — and employers must pay it on or
          before December 24. This guide explains the rule in plain language,
          with the official sources behind it.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Who receives it?
        </h2>
        <p>
          All rank-and-file employees in the private sector who worked at least
          one month during the calendar year are entitled to it — regardless of
          position or employment status. Public-sector (government) employees
          are covered by a different pay system and are not covered by this
          rule.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          The basic formula
        </h2>
        <p>13th month pay is simply your total basic salary earned divided by 12:</p>
        <div className="rounded-lg border border-line bg-mist p-4 font-mono text-sm leading-6 text-navy">
          <div>Total basic salary = monthly basic salary × months worked</div>
          <div>13th month pay = total basic salary ÷ 12</div>
          <div>Full year example: (₱25,000 × 12) ÷ 12 = ₱25,000</div>
        </div>
        <p>
          The divisor is always 12, regardless of how many months you actually
          worked during the year.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          How proration works
        </h2>
        <p>
          If you worked only part of the year — a mid-year hire, a resignation,
          or a contract that ended — your 13th month pay is prorated
          automatically by the same formula: total basic salary earned in the
          year ÷ 12.
        </p>
        <ul className="list-disc space-y-2.5 pl-5 marker:font-medium marker:text-navy">
          <li>
            Six months at ₱20,000/month: (₱20,000 × 6) ÷ 12 = ₱10,000.
          </li>
          <li>
            Eight months at ₱25,000/month: (₱25,000 × 8) ÷ 12 = ₱16,666.67.
          </li>
          <li>
            If your salary changed during the year, use your average — total
            basic salary earned ÷ months worked — or compute each period
            separately and add the results.
          </li>
        </ul>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          What counts as basic salary?
        </h2>
        <p>
          Only basic salary is included. Overtime pay, night differential,
          holiday pay, profit sharing, and cash allowances are excluded — unless
          they form part of your basic salary by company practice or agreement.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          When must it be paid?
        </h2>
        <p>
          Payment is due on or before December 24. Employers may pay half before
          the regular school year opens and the remaining half on or before
          December 24. No request or application for exemption from payment, or
          for deferment of its payment, is accepted or allowed (DOLE Labor
          Advisory No. 16-2025). If it is not paid, you may file a complaint
          with the nearest DOLE Regional or Field Office.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">Tax note</h2>
        <p>
          13th month pay and other benefits are exempt from income tax up to
          ₱90,000 per calendar year. Anything above that amount is added to your
          taxable compensation — see the income tax calculator for an estimate.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Try the calculators
        </h2>
        <ul className="list-disc space-y-2.5 pl-5 marker:font-medium marker:text-navy">
          <li>
            <Link href="/calculators/13th-month-pay" className={linkClass}>
              13th Month Pay Calculator
            </Link>{" "}
            — estimate your 13th month pay from your monthly basic salary and
            months worked.
          </li>
          <li>
            <Link href="/calculators/daily-hourly-salary" className={linkClass}>
              Daily and Hourly Salary Calculator
            </Link>{" "}
            — convert your monthly salary to daily and hourly rates.
          </li>
          <li>
            <Link href="/calculators/income-tax" className={linkClass}>
              Income Tax Calculator
            </Link>{" "}
            — estimate withholding tax on compensation income.
          </li>
        </ul>

        <SourceNotice {...rules} />

        <p className="text-sm leading-6 text-ink-muted">
          ComputePH is an independent calculator and reference site — not a
          government agency. This guide summarizes the official sources listed
          above for general information; results are estimates, and you should
          confirm important figures with your payslip, official records, or the
          relevant agency.
        </p>
      </div>
    </div>
  );
}
