import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ComputePH is an independent Filipino-focused calculator website for salary, contributions, taxes, and loans — free, private, and easy to understand.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-navy">
        About ComputePH
      </h1>

      <div className="mt-6 space-y-6 text-base leading-7 text-ink-muted">
        <p>
          ComputePH is a free calculator website for everyday life in the
          Philippines. It covers salary conversions, 13th month pay, overtime
          and night differential, SSS, PhilHealth, Pag-IBIG, income tax, loans,
          interest, discounts, and installment plans.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          How it works
        </h2>
        <p>
          Every calculator shows its inputs, the formula it uses, a worked
          example, and the official rules behind it — with sources and effective
          dates where government rates apply. Calculations run in your browser;
          nothing you type is sent to a server or stored.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          What we are not
        </h2>
        <p>
          ComputePH is independent. We are not affiliated with, endorsed by, or
          operated by SSS, PhilHealth, Pag-IBIG Fund, the Bureau of Internal
          Revenue, DOLE, or any government agency. Results are estimates for
          information only and may differ from official calculations or your
          individual circumstances — confirm important figures with your
          payslip, official records, or the relevant agency.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">Why it exists</h2>
        <p>
          Payroll rules in the Philippines are practical but rarely explained in
          plain language. ComputePH is built to answer the small, frequent
          questions — fast, without sign-up, and without turning finances into a
          sales pitch.
        </p>
      </div>
    </div>
  );
}
