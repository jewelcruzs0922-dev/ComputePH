import { describe, expect, it } from "vitest";
import {
  isValidEmail,
  normalizeEmail,
  validateEmail,
  validateFeedbackInput,
} from "@/lib/forms";

describe("email validation", () => {
  it("normalizes whitespace and casing", () => {
    expect(normalizeEmail("  Juan@Example.COM ")).toBe("juan@example.com");
  });

  it("accepts normal addresses and rejects malformed input", () => {
    expect(isValidEmail("juan@example.com")).toBe(true);
    expect(isValidEmail("juan+alerts@example.ph")).toBe(true);
    expect(isValidEmail("juan@example")).toBe(false);
    expect(isValidEmail("@example.com")).toBe(false);
    expect(isValidEmail("juan @example.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  it("returns safe validation messages", () => {
    expect(validateEmail("")).toEqual({
      ok: false,
      error: "Enter your email address.",
    });
    expect(validateEmail("not-an-email")).toEqual({
      ok: false,
      error: "Enter a valid email address.",
    });
    expect(validateEmail(" Juan@Example.com ")).toEqual({
      ok: true,
      email: "juan@example.com",
    });
  });
});

describe("feedback validation", () => {
  it("requires a message", () => {
    const result = validateFeedbackInput("   ", "");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.message).toBe("Enter a feedback message.");
    }
  });

  it("allows feedback without an email", () => {
    const result = validateFeedbackInput("Please add a rent calculator.", "");
    expect(result).toEqual({
      ok: true,
      value: { message: "Please add a rent calculator." },
    });
  });

  it("includes a valid optional email", () => {
    const result = validateFeedbackInput(
      "The SSS result looked right.",
      " Reader@Example.com ",
    );
    expect(result).toEqual({
      ok: true,
      value: {
        message: "The SSS result looked right.",
        email: "reader@example.com",
      },
    });
  });

  it("rejects an invalid optional email without dropping the message", () => {
    const result = validateFeedbackInput("Hello", "not-an-email");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.email).toContain("valid email");
      expect(result.errors.message).toBeUndefined();
    }
  });

  it("rejects overly long messages", () => {
    const result = validateFeedbackInput("x".repeat(5001), "");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toContain("5,000");
  });
});
