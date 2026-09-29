import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ComputePH privacy policy: no accounts, no tracking, calculations run in your browser, and your financial inputs are never stored.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-navy">
        Privacy Policy
      </h1>

      <div className="mt-6 space-y-6 text-base leading-7 text-ink-muted">
        <p>
          ComputePH is designed to collect as little about you as possible.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Your calculations stay in your browser
        </h2>
        <p>
          Amounts, salaries, and other values you enter into any calculator are
          processed in your browser. They are not uploaded, stored on our
          servers, or shared with anyone.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          No accounts, no tracking
        </h2>
        <p>
          ComputePH has no user accounts and does not use analytics, cookies,
          advertising trackers, or third-party scripts to follow you across the
          web.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Server logs
        </h2>
        <p>
          Like most websites, the hosting provider may keep standard technical
          logs (such as IP address, time, and requested page) for security and
          reliability. These logs do not include anything you type into the
          calculators.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          External links
        </h2>
        <p>
          Pages link to official sources such as SSS, PhilHealth, Pag-IBIG, BIR,
          and DOLE. Those sites have their own privacy policies, which we do not
          control.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">Changes</h2>
        <p>
          If this policy changes, the updated version will be published on this
          page with a revised date.
        </p>
      </div>
    </div>
  );
}
