"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { validateFeedbackInput } from "@/lib/forms";
import { submitFeedbackToWeb3Forms } from "@/lib/web3forms";

type Status = "idle" | "loading" | "success" | "error";

const INPUT_CLASSES =
  "w-full rounded-lg border border-line bg-white px-3.5 text-base text-navy placeholder:text-ink-muted focus:border-royal focus:outline-2 focus:outline-offset-2 focus:outline-royal";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [emailError, setEmailError] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ?? "";
  const hasKey =
    Boolean(accessKey) && accessKey !== "your-web3forms-access-key";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessageError("");
    setEmailError("");
    setStatusMessage("");

    const botcheck = Boolean(
      (
        event.currentTarget.elements.namedItem(
          "botcheck",
        ) as HTMLInputElement | null
      )?.checked,
    );

    const validation = validateFeedbackInput(message, email);
    if (!validation.ok) {
      setMessageError(validation.errors.message ?? "");
      setEmailError(validation.errors.email ?? "");
      setStatus("idle");
      if (validation.errors.message) messageRef.current?.focus();
      else emailRef.current?.focus();
      return;
    }

    setStatus("loading");
    const result = await submitFeedbackToWeb3Forms({
      accessKey,
      message: validation.value.message,
      email: validation.value.email,
      botcheck,
    });

    if (!result.ok) {
      setStatus("error");
      setStatusMessage(result.error);
      return;
    }

    setStatus("success");
    setStatusMessage(
      "Thanks — your feedback was sent. We read every message.",
    );
    setMessage("");
    setEmail("");
  }

  return (
    <section
      id="feedback"
      aria-labelledby="feedback-heading"
      className="scroll-mt-28 bg-white"
    >
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 sm:py-14 lg:px-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-line bg-mist p-5 sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
            <div className="min-w-0 text-center lg:self-start">
              <p className="mx-auto mb-2 flex w-fit rounded-full border-4 border-dotted border-royal/30 px-3.5 py-1.5 text-sm font-semibold uppercase tracking-[0.16em] text-royal-strong">
                Feedback
              </p>
              <h2
                id="feedback-heading"
                className="text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl"
              >
                Tell us what to improve.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-lg leading-8 text-ink-muted">
                Found a bug, a confusing result, or have an idea? Send it to our
                inbox.
              </p>
              <p className="mt-3 text-base font-medium text-navy">
                Feedback never subscribes you to the Money Brief.
              </p>
            </div>

            <form onSubmit={submit} noValidate data-clarity-mask="true" className="min-w-0">
              <label
                htmlFor="feedback-message"
                className="block text-sm font-semibold text-navy"
              >
                Message
              </label>
              <textarea
                ref={messageRef}
                id="feedback-message"
                name="message"
                required
                maxLength={5000}
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                aria-invalid={messageError ? true : undefined}
                aria-describedby={
                  messageError ? "feedback-message-error" : undefined
                }
                placeholder="What should we fix or build next?"
                className={`${INPUT_CLASSES} mt-2 min-h-32 resize-y py-3 leading-7`}
              />
              <p
                id="feedback-message-error"
                className="mt-1.5 min-h-5 text-sm font-medium text-red-700"
              >
                {messageError}
              </p>

              <label
                htmlFor="feedback-email"
                className="mt-2 block text-sm font-semibold text-navy"
              >
                Email <span className="font-normal text-ink-muted">(optional)</span>
              </label>
              <input
                ref={emailRef}
                id="feedback-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={
                  emailError ? "feedback-email-error" : undefined
                }
                placeholder="you@example.com"
                className={`${INPUT_CLASSES} mt-2 h-12`}
              />
              <p
                id="feedback-email-error"
                className="mt-1.5 min-h-5 text-sm font-medium text-red-700"
              >
                {emailError}
              </p>

              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <Button
                type="submit"
                disabled={status === "loading"}
                aria-busy={status === "loading"}
                className="mt-4 w-full sm:w-auto"
              >
                {status === "loading" ? "Sending feedback..." : "Send feedback"}
              </Button>

              {!hasKey && process.env.NODE_ENV === "development" ? (
                <p className="mt-3 rounded-lg border border-brand/60 bg-brand-soft px-3 py-2 text-xs leading-5 text-navy">
                  Local setup: add{" "}
                  <code className="break-words font-mono">
                    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
                  </code>{" "}
                  to <code className="font-mono">.env.local</code> to test live
                  feedback delivery.
                </p>
              ) : null}

              <p className="mt-2 text-xs leading-5 text-ink-muted">
                Sent via Web3Forms.{" "}
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
                {status === "success" || status === "error"
                  ? statusMessage
                  : ""}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
