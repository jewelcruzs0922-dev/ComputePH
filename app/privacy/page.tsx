import type { Metadata } from "next";
import { socialMetadata } from "@/lib/metadata";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "ComputePH privacy policy: no accounts, calculations run in your browser, and your financial inputs are never stored.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  ...socialMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/privacy",
  }),
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-navy">
        Privacy Policy
      </h1>

      <div className="mt-6 space-y-6 text-base leading-7 text-ink-muted">
        <p>
          ComputePH is operated by Jewel Cruz, an individual based in the Philippines. This policy
          explains what personal data we process, why, who receives it, how long
          we keep it, and the choices and rights you have.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Your calculations stay in your browser
        </h2>
        <p>
          All calculators run in your browser. We do not receive or store the
          amounts, salaries, or other values you enter as part of the
          calculation. If you allow analytics, the calculator, newsletter, and
          feedback areas are configured to be masked in Microsoft Clarity
          session recordings.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          No accounts
        </h2>
        <p>
          ComputePH has no user accounts and does not run its own advertising
          campaigns. Optional analytics load only with your consent, as
          described below.
        </p>
        <p>
          We process personal data in three situations: when you subscribe to
          the newsletter, when you choose to send feedback, and through optional
          analytics and standard technical logs. We do not ask for your name,
          postal address, or financial account details, and we ask you not to
          send sensitive financial information through the feedback form.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Newsletter subscriptions
        </h2>
        <p>
          If you subscribe to the ComputePH Money Brief, we collect the email
          address you submit and the consent you give. Brevo, our email
          provider, also records your confirmation status and related
          subscription records. We use this information only to send the
          double opt-in confirmation, deliver up to two newsletters per month,
          and manage your subscription and unsubscribe requests.
        </p>
        <p>
          We ask for your consent before adding you to the list, and the double
          opt-in email verifies that the address belongs to you. We do not use
          newsletter data for advertising or share it with anyone other than
          Brevo and its service providers. You can unsubscribe from any
          newsletter.
        </p>
        <p>
          We keep your subscription record until you unsubscribe or ask us to
          delete it. Brevo acts as our processor. Brevo&apos;s terms make us
          responsible for setting the retention period for contact data, and
          Brevo deletes or anonymizes data at the end of our contract. Brevo is
          based in France and may process data in the European Union and other
          countries under its own terms.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Community feedback
        </h2>
        <p>
          If you send feedback, we collect your message and, if you provide one,
          your email address. Web3Forms delivers the message to our inbox and
          adds the submitting device&apos;s IP address to the notification.
          Web3Forms also uses spam-filtering providers, CleanTalk and Akismet,
          which may receive your IP address and, if provided, your email address
          to assess the submission.
        </p>
        <p>
          We use feedback to respond to you and improve ComputePH. Sending
          feedback does not subscribe you to the Money Brief. Please do not
          include sensitive financial information.
        </p>
        <p>
          We process feedback on the basis of our legitimate interests in
          responding to you and improving ComputePH, balanced against your
          rights. You can object to this processing by emailing
          jewelcruzs0922@gmail.com.
        </p>
        <p>
          We keep feedback in our inbox only as long as needed to respond and
          improve ComputePH, and we delete it when it is no longer needed or
          when you ask us to delete it. That inbox retention is separate from
          Web3Forms&apos; own storage: Web3Forms retains submissions for up to
          three years by default and allows us to configure a shorter period; we
          may delete the inbox copy earlier. The feedback inbox is hosted by
          Google (Gmail).
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Service providers
        </h2>
        <p>
          Brevo processes newsletter subscriptions and email delivery on our
          behalf. Web3Forms processes feedback submissions and uses AWS,
          Cloudflare, Hetzner, CleanTalk, and Akismet as sub-processors. Vercel
          hosts the site, keeps technical logs, and provides Web Analytics.
          Microsoft provides Clarity analytics. Google hosts the feedback inbox.
        </p>
        <p>
          These providers may process data outside the Philippines under their
          own privacy and security terms. Brevo is based in France. Web3Forms
          operates from India and states that it uses Standard Contractual
          Clauses for transfers from the EEA, UK, and Switzerland. Vercel,
          Microsoft, and Google publish their own transfer terms.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Cookies and analytics choices
        </h2>
        <p>
          The ComputePH application does not set cookies by default and does
          not run its own advertising campaigns. Your analytics choice is stored in your
          browser&apos;s local storage under the key
          &ldquo;computeph.analytics-consent&rdquo; until you clear it or change
          your choice. We do not keep a server-side consent register.
        </p>
        <p>
          Vercel Web Analytics does not use cookies. It identifies a visitor
          with a hash derived from the request, and that session identifier is
          discarded after 24 hours. If you allow analytics, Microsoft Clarity
          may set first-party cookies &ldquo;_clck&rdquo; and
          &ldquo;_clsk&rdquo;, and Microsoft cookies such as CLID, ANONCHK, MR,
          SM, and MUID. Microsoft describes MUID as used for advertising, site
          analytics, and operational purposes; Clarity sets ANONCHK to 0 and
          does not use the ANID advertising cookie. You can decline analytics
          without losing access to any calculator, and you can change your
          choice later using &ldquo;Analytics settings&rdquo; in the footer.
        </p>
        <p>
          If you withdraw consent, analytics scripts stop loading on later page
          views. Cookies that Clarity already placed remain in your browser
          until they expire or you clear them.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">Analytics</h2>
        <p>
          ComputePH offers optional analytics using Vercel Web Analytics and
          Microsoft Clarity. They collect basic usage data such as pages
          visited, approximate location, device and browser type, referring
          site, and interactions such as clicks and scrolls. Clarity can record
          sessions so we can find confusing or broken parts of the site; the
          calculator, newsletter, and feedback areas are masked.
        </p>
        <p>
          Analytics scripts load only after you select &ldquo;Allow
          analytics&rdquo;. If you decline, neither tool loads. You can change
          or withdraw your choice at any time using &ldquo;Analytics
          settings&rdquo; in the footer.
        </p>
        <p>
          Clarity retains playback recordings for 30 days, and aggregated click
          and heatmap data, plus labeled or favorited sessions, for up to 9
          months. Vercel Web Analytics data is available on our current Vercel
          plan for one month. We do not use either tool to identify you
          personally or to target advertising.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Server logs
        </h2>
        <p>
          Like most websites, our hosting provider keeps standard technical
          logs such as IP address, time, and requested page for security and
          reliability. On our current Vercel plan, runtime logs are kept for one
          hour. These logs do not include anything you type into the
          calculators.
        </p>
        <p>
          We process these logs on the basis of our legitimate interests in
          keeping ComputePH secure, reliable, and protected from abuse,
          balanced against your rights. You can object by emailing
          jewelcruzs0922@gmail.com. We may continue to keep limited logs where
          we have compelling grounds or a legal obligation.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          External links
        </h2>
        <p>
          Pages link to official sources such as SSS, PhilHealth, Pag-IBIG, BIR,
          and DOLE. Those sites have their own privacy policies, which we do not
          control.
        </p>

        <h2 className="pt-2 text-xl font-semibold text-navy">
          Contact and your rights
        </h2>
        <p>
          ComputePH is operated by Jewel Cruz, an individual based in the Philippines. The operator is
          the personal information controller for the data described in this
          policy and handles privacy requests. Privacy contact:
          jewelcruzs0922@gmail.com.
        </p>
        <p>
          Subject to applicable law, you may request access to, correction of,
          or deletion or blocking of your personal data, object to its
          processing, or request data portability. To make a privacy request,
          email jewelcruzs0922@gmail.com. We may need to verify your identity
          before acting on a request and will respond within the period
          required by applicable law. You may also raise a concern with the
          National Privacy Commission at privacy.gov.ph.
        </p>
        <h2 className="pt-2 text-xl font-semibold text-navy">Changes</h2>
        <p>
          If this policy changes, the updated version will be published on this
          page with a revised date.
        </p>
        <p className="text-sm text-ink-muted">
          Last updated: October 29, 2026.
        </p>
      </div>
    </div>
  );
}
