"use client";

import { useEffect } from "react";
import CalculatorForm from "@/components/calculators/CalculatorForm";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { trackEvent } from "@/lib/analytics";

export default function CalculatorRunner({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent("calculator_viewed", { calculator: slug });
  }, [slug]);

  const engine = CALCULATOR_ENGINES[slug];
  if (!engine) return null;
  return (
    <CalculatorForm
      slug={slug}
      fields={engine.fields}
      calculate={engine.calculate}
    />
  );
}
