/**
 * Non-interactive footer note. The project has no newsletter service, so the
 * footer must not present an email input or imply that addresses are
 * collected. This is a plain static element (no client state, no form).
 */
export default function NewsletterNote() {
  return (
    <p className="mt-3 inline-flex max-w-[42ch] items-start gap-2 rounded-full border border-white/15 px-3.5 py-2 text-xs leading-5 text-azure">
      <span
        aria-hidden="true"
        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
      />
      Newsletter coming soon — we don&apos;t collect email addresses.
    </p>
  );
}
