import type { RuleMeta } from "@/lib/rules";
import { ShieldIcon } from "@/components/home/homeIcons";

/**
 * Blue-tinted rules card. Makes the effective date and official source of a
 * government-driven calculator obvious without looking like a government site.
 */
export default function SourceNotice({
  effective,
  sources,
  lastUpdated,
}: Pick<RuleMeta, "effective" | "sources" | "lastUpdated">) {
  return (
    <section
      aria-labelledby="rules-heading"
      className="rounded-2xl border border-line bg-white p-5 sm:p-6"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-royal text-white"
        >
          <ShieldIcon className="h-5 w-5" />
        </span>
        <h2 id="rules-heading" className="text-base font-bold text-navy">
          Official rules used
        </h2>
      </div>

      {effective && (
        <p className="mt-3 text-sm text-navy">
          Rules effective:{" "}
          <strong className="font-semibold">{effective}</strong>
        </p>
      )}

      <ul className="mt-3 space-y-2">
        {sources.map((source) => (
          <li key={source.url} className="text-sm">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-royal-strong underline underline-offset-4 hover:text-navy"
            >
              {source.label}
            </a>
            {source.effective && (
              <span className="text-ink-muted"> — {source.effective}</span>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-ink-muted">
        Rules last verified {lastUpdated}.
      </p>
    </section>
  );
}
