"use client";

import { ANALYTICS_SETTINGS_EVENT } from "@/lib/consent";

export default function AnalyticsSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT))}
      className="text-left text-[0.8125rem] text-azure transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand max-lg:inline-flex max-lg:min-h-11 max-lg:items-center"
    >
      Analytics settings
    </button>
  );
}
