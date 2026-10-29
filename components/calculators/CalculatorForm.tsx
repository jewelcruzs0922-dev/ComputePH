"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type {
  CalcOutcome,
  FieldDef,
  NumberField,
  RawValues,
  SegmentedField,
  SelectField,
} from "@/lib/types";
import {
  formRawValues,
  isVisible,
  validateFields,
} from "@/lib/utils/validate";
import { Button } from "@/components/ui/Button";
import ResultPanel from "@/components/calculators/ResultPanel";
import { CalculatorIcon } from "@/components/home/homeIcons";
import { trackEvent } from "@/lib/analytics";

type Props = {
  /** Calculator slug — used only as a non-sensitive analytics identifier. */
  slug?: string;
  fields: FieldDef[];
  /**
   * Runs on the explicit Calculate click. Returning a promise is supported so
   * the engine can be code-split; a plain synchronous result still works.
   */
  calculate: (
    values: Record<string, number | string>,
  ) => CalcOutcome | Promise<CalcOutcome>;
};

const FIELD_CLASSES =
  "h-12 w-full rounded-lg border bg-white text-lg text-navy placeholder:text-ink-muted focus:border-royal focus:outline-2 focus:outline-offset-2 focus:outline-royal";

function NumberInput({
  def,
  value,
  error,
  onChange,
  onBlur,
}: {
  def: NumberField;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const inputId = `field-${def.name}`;
  const hintId = def.hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={`flex h-full min-w-0 flex-col${def.wide ? " sm:col-span-2" : ""}`}
    >
      <label
        htmlFor={inputId}
        className="block text-xl font-semibold text-navy"
      >
        {def.label}
      </label>
      <div className="pt-1 sm:min-h-12">
        {def.hint && (
          <p id={hintId} className="text-base leading-6 text-ink-muted">
            {def.hint}
          </p>
        )}
      </div>
      <div className="mt-2">
        <div
          className={`flex h-12 items-center overflow-hidden rounded-lg border bg-white focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-royal ${
            error ? "border-red-600" : "border-line"
          }`}
        >
          {def.prefix && (
            <span
              aria-hidden="true"
              className={`flex h-full w-14 shrink-0 items-center justify-center border-r bg-mist text-base text-ink-muted ${
                error ? "border-red-600" : "border-line"
              }`}
            >
              {def.prefix}
            </span>
          )}
          <input
            id={inputId}
            type="number"
            inputMode={def.integer ? "numeric" : "decimal"}
            autoComplete="off"
            step={def.step ?? (def.integer ? 1 : "any")}
            min={def.min}
            max={def.max}
            required={def.required !== false}
            aria-required={def.required !== false ? true : undefined}
            placeholder={def.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            style={{ outline: "none" }}
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-3.5 text-lg text-navy placeholder:text-ink-muted"
          />
          {def.suffix && (
            <span
              aria-hidden="true"
              className={`flex h-full w-14 shrink-0 items-center justify-center border-l bg-mist text-base text-ink-muted ${
                error ? "border-red-600" : "border-line"
              }`}
            >
              {def.suffix}
            </span>
          )}
        </div>
        <p
          id={error ? errorId : undefined}
          className="mt-1.5 flex min-h-6 items-start gap-1.5 text-base font-medium text-red-700"
        >
          {error && (
            <>
              <span aria-hidden="true" className="mt-px font-bold">
                !
              </span>
              {error}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function SelectInput({
  def,
  value,
  onChange,
  onBlur,
}: {
  def: SelectField;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
}) {
  const inputId = `field-${def.name}`;
  const hintId = def.hint ? `${inputId}-hint` : undefined;
  return (
    <div
      className={`flex h-full min-w-0 flex-col${def.wide ? " sm:col-span-2" : ""}`}
    >
      <label
        htmlFor={inputId}
        className="block text-xl font-semibold text-navy"
      >
        {def.label}
      </label>
      <div className="pt-1 sm:min-h-12">
        {def.hint && (
          <p id={hintId} className="text-base leading-6 text-ink-muted">
            {def.hint}
          </p>
        )}
      </div>
      <div className="relative mt-2">
        <select
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-describedby={hintId}
          className={`${FIELD_CLASSES} appearance-none border-line px-3.5 pr-10`}
        >
          {def.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-muted"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function SegmentedInput({
  def,
  value,
  onChange,
}: {
  def: SegmentedField;
  value: string;
  onChange: (v: string) => void;
}) {
  const hintId = def.hint ? `field-${def.name}-hint` : undefined;
  return (
    <fieldset className="flex h-full min-w-0 flex-col sm:col-span-2">
      <legend className="text-xl font-semibold text-navy">{def.label}</legend>
      {def.hint && (
        <p id={hintId} className="mt-1 text-base leading-6 text-ink-muted">
          {def.hint}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {def.options.map((opt) => (
          <label key={opt.value} className="inline-flex">
            <input
              type="radio"
              name={def.name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-line bg-white px-4 py-2.5 text-base font-medium text-ink-muted transition-colors hover:border-royal/40 hover:text-navy peer-checked:border-royal-strong peer-checked:bg-royal-strong peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-royal">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const TALL_RESULT_SLUGS = new Set(["sss", "philhealth", "pag-ibig"]);

export default function CalculatorForm({ slug, fields, calculate }: Props) {
  const tallResultCard = Boolean(slug && TALL_RESULT_SLUGS.has(slug));
  const [raw, setRaw] = useState<RawValues>(() => formRawValues(fields));
  const [blurred, setBlurred] = useState<Record<string, boolean>>({});
  // Explicit-calculation flow: the result only exists after Calculate.
  const [attempted, setAttempted] = useState(false);
  const [outcome, setOutcome] = useState<CalcOutcome | null>(null);
  const [dirty, setDirty] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [compactResultHeight, setCompactResultHeight] = useState<number | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const resultContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showResult) return;

    const form = formRef.current;
    const result = resultContentRef.current;
    if (!form || !result) return;

    let lastWidth = result.getBoundingClientRect().width;

    const measure = () => {
      setCompactResultHeight(
        Math.ceil(
          Math.max(
            form.getBoundingClientRect().height,
            result.scrollHeight,
          ),
        ),
      );
    };

    const onResize = () => {
      const width = result.getBoundingClientRect().width;
      if (Math.abs(width - lastWidth) > 1) {
        lastWidth = width;
        measure();
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") measure();
    };

    const timer = window.setTimeout(measure, 0);
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", onVisible);
    const observer = new ResizeObserver(onResize);
    observer.observe(form);
    observer.observe(result);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", onVisible);
      observer.disconnect();
    };
  }, [showResult, outcome, dirty, fields]);

  const validation = useMemo(
    () => validateFields(fields, raw),
    [fields, raw],
  );

  function setField(name: string, value: string) {
    setRaw((prev) => ({ ...prev, [name]: value }));
    if (outcome !== null) setDirty(true);
  }

  function markBlurred(name: string) {
    setBlurred((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }

  function reset() {
    setRaw(formRawValues(fields));
    setBlurred({});
    setAttempted(false);
    setOutcome(null);
    setDirty(false);
    setAnnouncement("");
    setShowResult(false);
    setCompactResultHeight(null);
  }

  function toggleResult() {
    if (showResult) {
      setShowResult(false);
      setCompactResultHeight(null);
    } else {
      setShowResult(true);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);

    // Validation runs first — invalid input never calculates.
    if (!validation.ok) {
      const errored = Object.keys(validation.errors);
      setBlurred((prev) => {
        const next = { ...prev };
        for (const name of errored) next[name] = true;
        return next;
      });
      const firstError = errored[0];
      if (firstError) {
        document.getElementById(`field-${firstError}`)?.focus();
      }
      setOutcome(null);
      setAnnouncement("Fix the highlighted fields to calculate your result.");
      return;
    }

    // Never let an engine exception break the page — surface a readable message.
    let result: CalcOutcome;
    try {
      result = await calculate(validation.values);
    } catch {
      result = {
        ok: false,
        error:
          "Something went wrong computing this result. Please check your inputs and try again.",
      };
    }

    setOutcome(result);
    setDirty(false);
    setShowResult(true);
    if (result.ok) {
      if (slug) {
        trackEvent("calculation_completed", { calculator: slug });
      }
      const headline =
        result.lines.find((line) => line.emphasis) ?? result.lines[0];
      setAnnouncement(
        headline
          ? `Calculation complete. ${headline.label}: ${headline.value}.`
          : "Calculation complete.",
      );
      // Move focus/scroll to the result once React has committed it.
      requestAnimationFrame(() => {
        const panel = document.getElementById("result-panel");
        panel?.focus({ preventScroll: true });
      });
    } else {
      setAnnouncement(result.error);
    }
  }

  return (
    <div className="mx-auto max-w-4xl" data-clarity-mask="true">
      <div
        className={`relative overflow-hidden rounded-2xl shadow-sm transition-[min-height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] max-lg:min-h-[var(--result-height)] ${
          tallResultCard && showResult ? "lg:min-h-[780px]" : ""
        }`}
        style={
          showResult && compactResultHeight
            ? ({
                "--result-height": `${compactResultHeight}px`,
              } as CSSProperties)
            : undefined
        }
      >
        <form
          ref={formRef}
          className="grid gap-6 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2 sm:p-12"
          onSubmit={handleSubmit}
          noValidate
        >
        {fields
          .filter((def) => isVisible(def, raw))
          .map((def) => {
            const error =
              !validation.ok && blurred[def.name]
                ? validation.errors[def.name]
                : undefined;
            if (def.kind === "number") {
              return (
                <NumberInput
                  key={def.name}
                  def={def}
                  value={raw[def.name] ?? ""}
                  error={error}
                  onChange={(v) => setField(def.name, v)}
                  onBlur={() => markBlurred(def.name)}
                />
              );
            }
            if (def.kind === "select") {
              return (
                <SelectInput
                  key={def.name}
                  def={def}
                  value={raw[def.name] ?? def.defaultValue}
                  onChange={(v) => setField(def.name, v)}
                  onBlur={() => markBlurred(def.name)}
                />
              );
            }
            return (
              <SegmentedInput
                key={def.name}
                def={def}
                value={raw[def.name] ?? def.defaultValue}
                onChange={(v) => setField(def.name, v)}
              />
            );
          })}

        <div className="mt-6 flex min-w-0 flex-col gap-3 sm:col-span-2">
          <Button type="submit" className="relative w-full">
            <span className="relative inline-flex items-center text-lg">
              <CalculatorIcon className="absolute right-full top-1/2 mr-2 h-6 w-6 -translate-y-1/2" />
              Calculate
            </span>
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={reset}>
            <span className="relative inline-flex items-center text-lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="absolute right-full top-1/2 mr-2 h-6 w-6 -translate-y-1/2"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <path d="M3 4v5h5" />
              </svg>
              Reset fields
            </span>
          </Button>
        </div>
        </form>

        <div
          id="result-drawer"
          aria-hidden={!showResult}
          className={`absolute inset-0 z-20 shadow-[0_-18px_40px_rgba(15,61,115,0.14)] transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none ${
            showResult
              ? "translate-y-0"
              : "pointer-events-none translate-y-full"
          }`}
        >
          <div
            ref={resultContentRef}
            className="h-full overflow-y-auto rounded-2xl max-lg:overflow-hidden [&>div]:h-full"
          >
            <ResultPanel outcome={outcome} attempted={attempted} dirty={dirty} />
          </div>
        </div>
      </div>

      <div className="relative z-30 flex flex-col items-center">
        <button
          type="button"
          onClick={toggleResult}
          aria-expanded={showResult}
          aria-controls="result-drawer"
          aria-label={showResult ? "Hide result" : "Show result"}
          className="-mt-5 inline-flex aspect-square h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-navy bg-brand p-0 text-navy shadow-[0_4px_12px_rgba(15,61,115,0.18)] transition-all duration-300 hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`h-5 w-5 transition-transform duration-700 ${
              showResult ? "rotate-180" : ""
            }`}
          >
            <path d="M6 11.5l6-5 6 5" />
            <path d="M6 17.5l6-5 6 5" />
          </svg>
        </button>
        <span className="mt-1 text-sm font-semibold text-navy">Result</span>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
