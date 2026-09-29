"use client";

import CalculatorForm from "@/components/calculators/CalculatorForm";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";

export default function CalculatorRunner({ slug }: { slug: string }) {
  const engine = CALCULATOR_ENGINES[slug];
  if (!engine) return null;
  return <CalculatorForm fields={engine.fields} calculate={engine.calculate} />;
}
