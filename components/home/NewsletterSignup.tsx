"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { isValidEmail } from "@/lib/forms";

type Status = "idle" | "loading" | "success" | "error";

const INPUT_CLASSES =
  "h-12 w-full rounded-lg border border-line bg-white px-3.5 text-base text-navy placeholder:text-ink-muted focus:border-royal focus:outline-2 focus:outline-offset-2 focus:outline-royal";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [consentError, setConsentError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError("");
    setConsentError("");
    setMessage("");

    const normalized = email.trim();
    if (!normalized) {
      setEmailError("Enter your email address.");
      setStatus("idle");
      emailRef.current?.focus();
      return;
    }
    if (!isValidEmail(normalized)) {
      setEmailError("Enter a valid email address.");
      setStatus("idle");
      emailRef.current?.focus();
      return;
    }
    if (!consent) {
      setConsentError("Please agree to receive the Money Brief.");
      setStatus("idle");
      consentRef.current?.focus();
      return;
    }

    const formData = new FormData(event.currentTarget);
    const website = String(formData.get("website") ?? "");

    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalized,
          consent: true,
          website,
        }),
      });
      const data: unknown = await response.json().catch(() => null);
      const ok =
        typeof data === "object" &&
        data !== null &&
        "ok" in data &&
        data.ok === true;
      const returnedMessage =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : "";
      const returnedError =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
          ? data.error
          : "";

      if (!response.ok || !ok) {
        setStatus("error");
        setMessage(
          returnedError ||
            "Newsletter signup is temporarily unavailable. Please try again later.",
        );
        return;
      }

      setStatus("success");
      setMessage(
        returnedMessage ||
          "Check your inbox to confirm your subscription to the Money Brief.",
      );
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage(
        "We couldn't reach the newsletter service. Check your connection and try again.",
      );
    }
  }

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="scroll-mt-28 bg-brand-soft"
    >
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 sm:py-14 lg:px-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] bg-navy p-5 shadow-[0_18px_50px_rgba(15,61,115,0.16)] sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10">
            <div className="min-w-0 text-center">
              <p className="mx-auto mb-2 flex w-fit rounded-full border-4 border-dotted border-brand/40 px-3.5 py-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-brand">
                ComputePH Money Brief
              </p>
              <h2
                id="newsletter-heading"
                className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
              >
                Practical money notes, twice a month.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-7 text-azure">
                Verified Philippine money updates, calculator picks, and new
                tools.
              </p>
            </div>

            <form
              onSubmit={submit}
              noValidate
              data-clarity-mask="true"
              className="relative rounded-2xl bg-white p-4 shadow-sm sm:p-5"
            >
              <label
                htmlFor="newsletter-email"
                className="block text-sm font-semibold text-navy"
              >
                Email address
              </label>
              <input
                ref={emailRef}
                id="newsletter-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={
                  emailError ? "newsletter-email-error" : undefined
                }
                placeholder="you@example.com"
                className={`${INPUT_CLASSES} mt-2`}
              />
              <p
                id="newsletter-email-error"
                className="mt-1.5 min-h-5 text-sm font-medium text-red-700"
              >
                {emailError}
              </p>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
              >
                <label htmlFor="newsletter-website">Website</label>
                <input
                  id="newsletter-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-ink-muted">
                <input
                  ref={consentRef}
                  type="checkbox"
                  name="consent"
                  required
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  aria-invalid={consentError ? true : undefined}
                  aria-describedby={
                    consentError ? "newsletter-consent-error" : undefined
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-royal-strong"
                />
                <span>
                  Send me the Money Brief twice a month. I can unsubscribe
                  anytime.
                </span>
              </label>
              <p
                id="newsletter-consent-error"
                className="mt-1 min-h-5 text-sm font-medium text-red-700"
              >
                {consentError}
              </p>

              <Button
                type="submit"
                disabled={status === "loading"}
                aria-busy={status === "loading"}
                className="mt-3 w-full"
              >
                {status === "loading" ? "Sending confirmation..." : "Subscribe"}
              </Button>

              <p className="mt-2 text-xs leading-5 text-ink-muted">
                We use Brevo for confirmation and delivery.{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-royal-strong underline underline-offset-4 hover:text-navy"
                >
                  Privacy Policy
                </Link>
              </p>

              <p
                role={status === "error" ? "alert" : "status"}
                aria-live={status === "error" ? "assertive" : "polite"}
                className={`mt-3 min-h-6 text-sm font-medium ${
                  status === "error" ? "text-red-700" : "text-royal-strong"
                }`}
              >
                {status === "success" || status === "error" ? message : ""}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
