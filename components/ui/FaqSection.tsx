type Faq = { q: string; a: string };

export default function FaqSection({
  faqs,
  title = "Frequently asked questions",
}: {
  faqs: readonly Faq[];
  title?: string;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-navy">{title}</h2>
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {faqs.map((faq) => (
          <details key={faq.q} className="group px-4 py-3.5 sm:px-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-navy marker:hidden [&::-webkit-details-marker]:hidden">
              {faq.q}
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-royal transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-2 text-base leading-7 text-ink-muted">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
