import { expect } from "vitest";
import type {
  CalcOutcome,
  CalculatorEngine,
  FieldValues,
  ResultLine,
} from "@/lib/types";
import { defaultRawValues, validateFields } from "@/lib/utils/validate";

/** The engine's field defaults, parsed and validated exactly as the UI does. */
export function defaultValues(engine: CalculatorEngine): FieldValues {
  const raw = defaultRawValues(engine.fields);
  const result = validateFields(engine.fields, raw);
  if (!result.ok) {
    throw new Error(`Default values invalid: ${JSON.stringify(result.errors)}`);
  }
  return result.values;
}

/** Defaults with specific fields replaced. */
export function valuesWith(
  engine: CalculatorEngine,
  overrides: FieldValues,
): FieldValues {
  return { ...defaultValues(engine), ...overrides };
}

export function expectOk(outcome: CalcOutcome): ResultLine[] {
  expect(outcome.ok, outcome.ok === false ? outcome.error : "").toBe(true);
  if (!outcome.ok) throw new Error("unreachable");
  return outcome.lines;
}

export function expectError(outcome: CalcOutcome, message: string): void {
  expect(outcome.ok).toBe(false);
  if (outcome.ok) throw new Error("unreachable");
  expect(outcome.error).toBe(message);
}

export function valueOf(lines: ResultLine[], label: string): string {
  const line = lines.find((l) => l.label === label);
  if (!line) {
    throw new Error(
      `No line labeled "${label}". Got: ${lines.map((l) => l.label).join(" | ")}`,
    );
  }
  return line.value;
}

/** The single result line flagged `emphasis`. */
export function emphasisValue(lines: ResultLine[]): string {
  const line = lines.find((l) => l.emphasis);
  if (!line) throw new Error("No emphasized result line.");
  return line.value;
}
