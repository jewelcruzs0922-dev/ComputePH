"use client";

import { useEffect, useMemo } from "react";
import CalculatorForm from "@/components/calculators/CalculatorForm";
import type { CalculatorEngine, FieldDef, FieldValues } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

/**
 * One dynamic import per calculator.
 *
 * The form schema (`fields`) is handed in by the server component, so this
 * client module has no static dependency on any engine. Each entry below
 * becomes its own chunk, which means a calculator page downloads the engine it
 * renders instead of all twelve. The map itself pulls in no engine code.
 */
const ENGINE_LOADERS: Record<string, () => Promise<CalculatorEngine>> = {
  "13th-month-pay": () => import("@/lib/calculators/thirteenthMonth"),
  "overtime-pay": () => import("@/lib/calculators/overtime"),
  "night-differential": () => import("@/lib/calculators/nightDifferential"),
  "daily-hourly-salary": () => import("@/lib/calculators/salary"),
  sss: () => import("@/lib/calculators/sss"),
  philhealth: () => import("@/lib/calculators/philhealth"),
  "pag-ibig": () => import("@/lib/calculators/pagibig"),
  "income-tax": () => import("@/lib/calculators/incomeTax"),
  loan: () => import("@/lib/calculators/loan"),
  interest: () => import("@/lib/calculators/interest"),
  discount: () => import("@/lib/calculators/discount"),
  installment: () => import("@/lib/calculators/installment"),
};

/**
 * The engine only runs on an explicit Calculate click, so the request starts
 * as soon as the form mounts and is cached per slug. A user cannot reach the
 * button before the chunk has resolved in practice; awaiting it keeps the
 * click path correct either way and makes navigating between calculators free.
 */
const engineRequests = new Map<string, Promise<CalculatorEngine>>();

function requestEngine(slug: string): Promise<CalculatorEngine> {
  const cached = engineRequests.get(slug);
  if (cached) return cached;

  const load = ENGINE_LOADERS[slug];
  const request: Promise<CalculatorEngine> = load
    ? load()
    : Promise.reject(new Error(`No calculator engine for "${slug}"`));
  // Keep an unknown slug from surfacing as an unhandled rejection before a
  // caller attaches its handler.
  request.catch(() => undefined);
  engineRequests.set(slug, request);
  return request;
}

type Props = {
  slug: string;
  /** Field schema supplied by the server component — plain JSON, no functions. */
  fields: FieldDef[];
};

export default function CalculatorRunner({ slug, fields }: Props) {
  const engine = useMemo(() => requestEngine(slug), [slug]);

  useEffect(() => {
    trackEvent("calculator_viewed", { calculator: slug });
  }, [slug]);

  const calculate = (values: FieldValues) =>
    engine.then((resolved) => resolved.calculate(values));

  return <CalculatorForm slug={slug} fields={fields} calculate={calculate} />;
}
