import type { CalcOutcome, ResultLine } from "@/lib/types";

function ResultRow({ line }: { line: ResultLine }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <span className="text-sm text-ink-muted">
        {line.label}
        {line.hint && (
          <span className="mt-0.5 block text-xs text-ink-muted">
            {line.hint}
          </span>
        )}
      </span>
      <span className="min-w-0 break-words text-right text-sm font-semibold tabular-nums text-navy">
        {line.value}
      </span>
    </div>
  );
}

/**
 * The result surface used by every calculator: a light-blue card with the
 * headline number on top and the per-line breakdown below.
 *
 * Deliberately NOT an aria-live region — the form announces completed
 * calculations through a dedicated polite live region instead, so screen
 * readers are not spammed while the user types.
 */
export default function ResultPanel({
  outcome,
  attempted,
  dirty,
}: {
  outcome: CalcOutcome | null;
  /** A Calculate attempt has happened (drives the prompt-to-calculate copy). */
  attempted: boolean;
  /** Inputs changed after the shown result was calculated. */
  dirty: boolean;
}) {
  return (
    <div className="rounded-2xl border border-royal/20 bg-azure p-5 sm:p-6">
      {outcome === null ? (
        <p className="text-base text-ink-muted">
          {attempted
            ? "Fix the highlighted fields to see your result."
            : "Enter your details and select Calculate to see your result."}
        </p>
      ) : outcome.ok === false ? (
        <p className="text-base font-medium text-navy">{outcome.error}</p>
      ) : outcome.lines.length === 0 ? (
        <p className="text-base text-ink-muted">
          Nothing to compute with these values yet.
        </p>
      ) : (
        <section
          id="result-panel"
          tabIndex={-1}
          aria-label="Result"
          className="focus:outline-none"
        >
          {outcome.lines
            .filter((line) => line.emphasis)
            .map((line) => (
              <div
                key={line.label}
                className="border-b border-royal/20 pb-4"
              >
                <p className="text-base font-bold text-navy">{line.label}</p>
                {line.hint && (
                  <p className="mt-1 text-sm leading-5 text-ink-muted">
                    {line.hint}
                  </p>
                )}
                <p className="mt-3 break-words text-3xl font-bold tabular-nums tracking-tight text-navy sm:text-4xl">
                  {line.value}
                </p>
              </div>
            ))}
          <div className="divide-y divide-royal/15">
            {outcome.lines
              .filter((line) => !line.emphasis)
              .map((line) => (
                <ResultRow key={line.label} line={line} />
              ))}
          </div>
          {dirty && (
            <p className="mt-4 border-t border-royal/20 pt-3 text-sm text-ink-muted">
              Inputs changed since this result was calculated — select
              Calculate to update.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
