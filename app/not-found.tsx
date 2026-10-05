import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { CALCULATORS } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Container className="py-14 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-royal-strong">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold leading-tight text-navy sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-6 text-ink-muted">
        The page you are looking for doesn&apos;t exist or may have moved. Try
        one of the calculators below, or head back to the homepage.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-brand px-6 py-3 text-base font-semibold text-ink shadow-sm transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
        >
          Go to homepage
        </Link>
        <Link
          href="/calculators"
          className="inline-flex items-center rounded-full border border-royal/35 bg-white px-6 py-3 text-base font-semibold text-royal-strong transition-colors hover:border-royal hover:bg-royal-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
        >
          Browse all calculators
        </Link>
      </div>

      <nav aria-label="All calculators" className="mt-10">
        <h2 className="text-lg font-semibold text-navy">
          All calculators
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {CALCULATORS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/calculators/${c.slug}`}
                className="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-navy transition-colors hover:border-royal hover:text-royal-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
