"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Button } from "@/components/ui/Button";
import {
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_SETTINGS_EVENT,
  parseAnalyticsConsent,
  type AnalyticsConsentChoice,
} from "@/lib/consent";
import Clarity from "./Clarity";

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState<AnalyticsConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const load = window.setTimeout(() => {
      try {
        setChoice(
          parseAnalyticsConsent(localStorage.getItem(ANALYTICS_CONSENT_KEY)),
        );
      } catch {
        setChoice(null);
      }
      setReady(true);
    }, 0);

    const openSettings = () => setSettingsOpen(true);
    const syncChoice = () => {
      try {
        setChoice(
          parseAnalyticsConsent(localStorage.getItem(ANALYTICS_CONSENT_KEY)),
        );
      } catch {
        setChoice(null);
      }
    };

    window.addEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
    window.addEventListener("storage", syncChoice);
    return () => {
      window.clearTimeout(load);
      window.removeEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
      window.removeEventListener("storage", syncChoice);
    };
  }, []);

  function decide(next: AnalyticsConsentChoice) {
    const hadChoice = choice !== null;
    try {
      localStorage.setItem(ANALYTICS_CONSENT_KEY, next);
    } catch {
      // The banner can still be dismissed for this page view.
    }
    setChoice(next);
    setSettingsOpen(false);
    if (hadChoice) window.location.reload();
  }

  if (!ready) return null;

  return (
    <>
      {choice === "granted" ? (
        <>
          <Analytics />
          <Clarity />
        </>
      ) : null}

      {choice === null || settingsOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
          <div
            role="region"
            aria-label="Analytics consent"
            className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-4 shadow-[0_14px_40px_rgba(15,61,115,0.18)] sm:p-5"
          >
            <p className="text-sm font-semibold text-navy">
              Optional analytics
            </p>
            <p className="mt-1 text-sm leading-6 text-ink-muted">
              We use Vercel Analytics and Microsoft Clarity to understand how
              the site is used. They load only if you allow them. Calculator
              inputs and results are excluded from session recordings.{" "}
              <Link
                href="/privacy"
                className="font-medium text-royal-strong underline underline-offset-4 hover:text-navy"
              >
                Privacy Policy
              </Link>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => decide("granted")}>Allow analytics</Button>
              <Button variant="secondary" onClick={() => decide("denied")}>
                Decline
              </Button>
              {choice !== null ? (
                <Button variant="text" onClick={() => setSettingsOpen(false)}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
