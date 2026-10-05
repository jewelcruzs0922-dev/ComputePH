import { track } from "@vercel/analytics/react";

/**
 * Minimal custom-event helper for Vercel Web Analytics.
 *
 * Rules:
 * - Never pass user-entered values (salary, tax, names, emails, financial
 *   details). Only stable internal identifiers like a calculator slug,
 *   category id, or a fixed suggestion term may be sent.
 * - Analytics must never break the calculator experience — all failures are
 *   swallowed.
 * - Microsoft Clarity records sessions separately; no Clarity calls here.
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
): void {
  try {
    track(name, props);
  } catch {
    // no-op: analytics is best-effort
  }
}
