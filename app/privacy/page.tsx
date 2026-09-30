import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ComputePH privacy policy: no accounts, calculations run in your browser, and your financial inputs are never stored.",
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
          No accounts
        </h2>
        <p>
          ComputePH has no user accounts, no advertising trackers, and no
          scripts that follow you across other websites.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">Analytics</h2>
        <p>
          To understand how the site is used, ComputePH uses two analytics
          tools: Vercel Web Analytics and Microsoft Clarity. They collect
          basic usage data such as which pages are visited, approximate
          country, device type (mobile or desktop), referring site, and
          interactions on the page such as clicks and scrolls. Microsoft
          Clarity can also record visits so that we can replay them to find
          confusing or broken parts of the site, and it may set a first-party
          cookie to keep a session together.
        </p>
        <p>
          The amounts, salaries, and other values you type into the
          calculators are processed in your browser as described above, and
          Microsoft Clarity masks everything entered into input fields before
          any data is sent to its servers, so your entries do not appear in
          session recordings. Neither tool is used to identify you personally
          or to show you advertisements.
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
