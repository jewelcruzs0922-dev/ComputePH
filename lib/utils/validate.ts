import type {
  FieldDef,
  FieldValues,
  RawValues,
} from "@/lib/types";
import { formatNumber } from "@/lib/utils/money";

export type ValidationResult =
  | { ok: true; values: FieldValues }
  | { ok: false; errors: Record<string, string> };

/** Strips peso signs, percent signs, spaces and grouping commas. */
export function parseNumeric(raw: string): number | null {
  const cleaned = raw.replace(/[₱%,\s_]/g, "");
  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function defaultRawValues(defs: FieldDef[]): RawValues {
  const raw: RawValues = {};
  for (const def of defs) {
    if (def.kind === "number") {
      raw[def.name] =
        def.defaultValue !== undefined ? String(def.defaultValue) : "";
    } else {
      raw[def.name] = def.defaultValue;
    }
  }
  return raw;
}

/**
 * Initial/reset raw values for the form: options keep their defaults, but
 * personal amount fields start EMPTY so nobody mistakes a sample for their
 * own result. Labeled assumptions (flagged `assumption`) stay pre-filled;
 * examples are shown via placeholder text instead.
 */
export function formRawValues(defs: FieldDef[]): RawValues {
  const raw = defaultRawValues(defs);
  for (const def of defs) {
    if (def.kind === "number" && !def.assumption) raw[def.name] = "";
  }
  return raw;
}

function minMessage(def: Extract<FieldDef, { kind: "number" }>): string {
  if (def.messages?.min) return def.messages.min;
  const min = def.min as number;
  if (min === 0) return "Must be 0 or more.";
  if (min > 0 && min < 1) return "Enter an amount greater than 0.";
  return `Must be at least ${formatNumber(min, 0)}.`;
}

function maxMessage(def: Extract<FieldDef, { kind: "number" }>): string {
  if (def.messages?.max) return def.messages.max;
  return `Must be ${formatNumber(def.max as number, 0)} or less.`;
}

export function isVisible(
  def: FieldDef,
  raw: RawValues,
): boolean {
  if (!def.showIf) return true;
  return (raw[def.showIf.name] ?? "") === def.showIf.equals;
}

export function validateFields(
  defs: FieldDef[],
  raw: RawValues,
): ValidationResult {
  const errors: Record<string, string> = {};
  const values: FieldValues = {};

  for (const def of defs) {
    if (!isVisible(def, raw)) continue;
    const input = raw[def.name] ?? "";

    if (def.kind === "number") {
      const trimmed = input.trim();
      if (trimmed === "") {
        if (def.required !== false) {
          errors[def.name] = def.messages?.required ?? "Required.";
        }
        continue;
      }

      const n = parseNumeric(trimmed);
      if (n === null) {
        errors[def.name] = def.messages?.invalid ?? "Enter a valid number.";
        continue;
      }
      if (def.integer && !Number.isInteger(n)) {
        errors[def.name] = def.messages?.integer ?? "Enter a whole number.";
        continue;
      }
      if (def.min !== undefined && n < def.min) {
        errors[def.name] = minMessage(def);
        continue;
      }
      const dependentInteger = def.integerWhen?.find(
        (cond) => (raw[cond.field] ?? "") === cond.equals,
      );
      if (dependentInteger && !Number.isInteger(n)) {
        errors[def.name] = dependentInteger.message;
        continue;
      }
      const dependentMax = def.maxWhen?.find(
        (cond) =>
          (raw[cond.field] ?? "") === cond.equals && n > cond.value,
      );
      if (dependentMax) {
        errors[def.name] = dependentMax.message;
        continue;
      }
      if (def.max !== undefined && n > def.max) {
        errors[def.name] = maxMessage(def);
        continue;
      }
      if (def.lessThanField) {
        const other = parseNumeric(
          String(raw[def.lessThanField.name] ?? "").trim(),
        );
        if (other !== null && n >= other) {
          errors[def.name] = def.lessThanField.message;
          continue;
        }
      }
      values[def.name] = n;
      continue;
    }

    const value = input || def.defaultValue;
    const valid = def.options.some((o) => o.value === value);
    if (!valid) {
      errors[def.name] = "Choose a valid option.";
      continue;
    }
    values[def.name] = value;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, values };
}
