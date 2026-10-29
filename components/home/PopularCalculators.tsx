import Link from "next/link";
import PopularCalculatorCard from "@/components/ui/PopularCalculatorCard";
import { getCalculator } from "@/lib/registry";

const POPULAR = [
  {
    slug: "13th-month-pay",
    imageSrc: "/images/popular-13th-pay-handoff.jpg",
  },
  {
    slug: "overtime-pay",
    imageSrc: "/images/popular-overtime-payment.jpg",
  },
  {
    slug: "sss",
    imageSrc: "/images/popular-sss-filling.jpg",
  },
  {
    slug: "income-tax",
    imageSrc: "/images/popular-income-tax-counting.jpg",
  },
  {
    slug: "loan",
    imageSrc: "/images/popular-loan-calculator.jpg",
  },
  {
    slug: "discount",
    imageSrc: "/images/popular-discount-sign.jpg",
  },
] as const;

export default function PopularCalculators() {
  const items = POPULAR.map((item) => ({
    ...item,
    meta: getCalculator(item.slug),
  })).filter((item) => item.meta);

  return (
    <section aria-labelledby="popular-heading" className="bg-white">
      <div className="mx-auto w-full max-w-[1680px] px-4 pb-10 pt-24 sm:px-6 lg:px-14">
        <h2
          id="popular-heading"
          className="text-center text-[2.5rem] font-bold tracking-tight text-navy sm:text-[3.25rem]"
        >
          Popular calculators
        </h2>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ slug, meta, imageSrc }) => (
            <li key={slug}>
              <PopularCalculatorCard
                slug={slug}
                name={meta!.name}
                imageSrc={imageSrc}
                tone="yellow"
              />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/calculators"
            className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-royal/35 px-6 text-sm font-semibold text-royal-strong transition-colors hover:border-royal/35 hover:text-navy hover:ring-2 hover:ring-royal/35 hover:ring-offset-2 hover:ring-offset-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
          >
            View all calculators
          </Link>
        </div>
      </div>
    </section>
  );
}
