export const ANALYTICS_CONSENT_KEY = "computeph.analytics-consent";
export const ANALYTICS_SETTINGS_EVENT = "computeph:analytics-settings";

export type AnalyticsConsentChoice = "granted" | "denied";

export function parseAnalyticsConsent(
  value: string | null,
): AnalyticsConsentChoice | null {
  return value === "granted" || value === "denied" ? value : null;
}
