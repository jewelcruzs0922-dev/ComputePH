export const MAX_EMAIL_LENGTH = 254;
export const MAX_FEEDBACK_MESSAGE = 5000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(email: string): boolean {
  return (
    email.length > 0 &&
    email.length <= MAX_EMAIL_LENGTH &&
    EMAIL_PATTERN.test(email)
  );
}

export function validateEmail(value: unknown):
  | { ok: true; email: string }
  | { ok: false; error: string } {
  const email = normalizeEmail(value);
  if (!email) return { ok: false, error: "Enter your email address." };
  if (!isValidEmail(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  return { ok: true, email };
}

export type FeedbackInput = {
  message: string;
  email?: string;
};

export function validateFeedbackInput(
  messageValue: unknown,
  emailValue: unknown,
):
  | { ok: true; value: FeedbackInput }
  | { ok: false; errors: { message?: string; email?: string } } {
  const message =
    typeof messageValue === "string" ? messageValue.trim() : "";
  const email = normalizeEmail(emailValue);

  const errors: { message?: string; email?: string } = {};
  if (!message) errors.message = "Enter a feedback message.";
  else if (message.length > MAX_FEEDBACK_MESSAGE) {
    errors.message = `Keep feedback under ${MAX_FEEDBACK_MESSAGE.toLocaleString(
      "en-PH",
    )} characters.`;
  }
  if (email && !isValidEmail(email)) {
    errors.email = "Enter a valid email address, or leave this blank.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { message, ...(email ? { email } : {}) } };
}
