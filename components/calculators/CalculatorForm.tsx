"use client";

import { useMemo, useState } from "react";
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
  calculate: (values: Record<string, number | string>) => CalcOutcome;
};

const FIELD_CLASSES =
  "h-12 w-full rounded-lg border bg-white text-base text-navy placeholder:text-ink-muted focus:border-royal focus:outline-2 focus:outline-offset-2 focus:outline-royal";

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
    <div className={def.wide ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={inputId}
        className="block text-base font-semibold text-navy"
      >
        {def.label}
      </label>
      {def.hint && (
        <p id={hintId} className="mt-1 text-sm leading-5 text-ink-muted">
          {def.hint}
        </p>
      )}
      <div className="relative mt-2">
        {def.prefix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center rounded-l-lg border-r border-line bg-mist text-sm text-ink-muted"
          >
            {def.prefix}
          </span>
        )}
        {def.suffix && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-lg border-l border-line bg-mist text-sm text-ink-muted"
          >
            {def.suffix}
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
          placeholder={def.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={[
            FIELD_CLASSES,
            def.prefix ? "pl-12" : "pl-3.5",
            def.suffix ? "pr-14" : "pr-3.5",
            error ? "border-red-600" : "border-line",
          ].join(" ")}
        />
      </div>
      {error && (
        <p
          id={errorId}
          className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700"
        >
          <span aria-hidden="true" className="mt-px font-bold">
            !
          </span>
          {error}
        </p>
      )}
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
    <div className={def.wide ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={inputId}
        className="block text-base font-semibold text-navy"
      >
        {def.label}
      </label>
      {def.hint && (
        <p id={hintId} className="mt-1 text-sm leading-5 text-ink-muted">
          {def.hint}
        </p>
      )}
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
    <fieldset className="sm:col-span-2">
      <legend className="text-base font-semibold text-navy">{def.label}</legend>
      {def.hint && (
        <p id={hintId} className="mt-1 text-sm leading-5 text-ink-muted">
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
            <span className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-royal/40 hover:text-navy peer-checked:border-royal-strong peer-checked:bg-royal-strong peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-royal">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function CalculatorForm({ slug, fields, calculate }: Props) {
  const [raw, setRaw] = useState<RawValues>(() => formRawValues(fields));
  const [blurred, setBlurred] = useState<Record<string, boolean>>({});
  // Explicit-calculation flow: the result only exists after Calculate.
  const [attempted, setAttempted] = useState(false);
  const [outcome, setOutcome] = useState<CalcOutcome | null>(null);
  const [dirty, setDirty] = useState(false);
  const [announcement, setAnnouncement] = useState("");

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
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      result = calculate(validation.values);
    } catch {
      result = {
        ok: false,
        error:
          "Something went wrong computing this result. Please check your inputs and try again.",
      };
    }

    setOutcome(result);
    setDirty(false);
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
        panel?.scrollIntoView({ block: "center" });
        panel?.focus();
      });
    } else {
      setAnnouncement(result.error);
    }
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <form
        className="grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6"
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

        <div className="flex flex-col gap-3 sm:col-span-2">
          <Button type="submit" className="w-full">
            <CalculatorIcon className="h-4 w-4" />
            Calculate
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={reset}>
            Reset fields
          </Button>
        </div>
      </form>

      <ResultPanel outcome={outcome} attempted={attempted} dirty={dirty} />
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
