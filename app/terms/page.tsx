import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for ComputePH: free calculators provided as-is for general information, not professional or official advice.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-navy">
        Terms of Service
      </h1>

      <div className="mt-6 space-y-6 text-base leading-7 text-ink-muted">
        <p>
          By using ComputePH you agree to these terms. If you do not agree,
          please do not use the site.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Estimates only
        </h2>
        <p>
          ComputePH provides free calculators for general information. Results
          are estimates based on the rules and figures published by the
          relevant agencies as of the dates shown on each page. They are not
          payroll advice, tax advice, legal advice, or an official computation
          by any government agency. Confirm important figures with your
          payslip, official records, or the relevant agency.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Availability
        </h2>
        <p>
          The site is provided as-is and as available. We work to keep
          calculations accurate and the site running, but we do not guarantee
          uninterrupted access or that every result will be free of error.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Your use of results
        </h2>
        <p>
          You are responsible for how you use any result shown on this site —
          including financial decisions, filings, and conversations with an
          employer.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">Fair use</h2>
        <p>
          Do not attempt to disrupt the site, scrape it at scale, or present
          ComputePH content as your own official service.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          External links
        </h2>
        <p>
          Links to official government and other websites are provided for
          convenience. We do not control their content or availability.
        </p>
      </div>
    </div>
  );
}
