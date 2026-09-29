/**
 * Shared calculator engine types.
 *
 * Calculation logic lives in `lib/calculators/*` as pure functions that are
 * completely independent from React. The UI only renders fields and results.
 */

export type FieldOption = { value: string; label: string };

type FieldBase = {
  name: string;
  label: string;
  hint?: string;
  /** Only render/validate this field while another field has this value. */
  showIf?: { name: string; equals: string };
};

export type NumberField = FieldBase & {
  kind: "number";
  /** Currency/number adornment shown inside the input. */
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number | "any";
  defaultValue?: number;
  /**
   * Keep this default pre-filled in the form. Only for clearly labeled
   * assumptions (e.g. 26 working days), never for personal amounts.
   */
  assumption?: boolean;
  integer?: boolean;
  /** Defaults to true. */
  required?: boolean;
  placeholder?: string;
  wide?: boolean;
  /**
   * Extra max limits that apply only while another field has a given value —
   * e.g. loan terms: 50 years max when the unit select is on "years".
   */
  maxWhen?: Array<{
    field: string;
    equals: string;
    value: number;
    message: string;
  }>;
  /**
   * Whole-number requirement that applies only while another field has a
   * given value — e.g. loan terms must be whole when the unit is "months",
   * but decimal years stay valid.
   */
  integerWhen?: Array<{
    field: string;
    equals: string;
    message: string;
  }>;
  /** The value must stay strictly below another numeric field's value. */
  lessThanField?: { name: string; message: string };
  messages?: {
    required?: string;
    invalid?: string;
    min?: string;
    max?: string;
    integer?: string;
  };
};

export type SelectField = FieldBase & {
  kind: "select";
  options: FieldOption[];
  defaultValue: string;
  wide?: boolean;
};

export type SegmentedField = FieldBase & {
  kind: "segmented";
  options: FieldOption[];
  defaultValue: string;
};

export type FieldDef = NumberField | SelectField | SegmentedField;

/** Raw strings as typed by the user, keyed by field name. */
export type RawValues = Record<string, string>;

/** Validated values passed into calculate(). */
export type FieldValues = Record<string, number | string>;

export type ResultLine = {
  label: string;
  /** Pre-formatted display string — never NaN/Infinity/undefined. */
  value: string;
  hint?: string;
  /** The headline result, rendered large. */
  emphasis?: boolean;
};

export type CalcOutcome =
  | { ok: true; lines: ResultLine[] }
  | { ok: false; error: string };

export type CalculatorEngine = {
  fields: FieldDef[];
  calculate: (values: FieldValues) => CalcOutcome;
};

export function asNumber(values: FieldValues, name: string): number {
  const v = values[name];
  return typeof v === "number" ? v : Number(v);
}

export function asString(values: FieldValues, name: string): string {
  const v = values[name];
  return typeof v === "string" ? v : String(v);
}
