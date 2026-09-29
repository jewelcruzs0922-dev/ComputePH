import CalculatorCard from "@/components/ui/CalculatorCard";
import FeaturedCalculatorCard from "@/components/ui/FeaturedCalculatorCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { getCalculator } from "@/lib/registry";
import {
  CalendarIcon,
  CalculatorIcon,
  ClockIcon,
  FileIcon,
  ShieldIcon,
  TagIcon,
} from "@/components/home/homeIcons";

const POPULAR = [
  { slug: "13th-month-pay", Icon: CalendarIcon },
  { slug: "overtime-pay", Icon: ClockIcon },
  { slug: "sss", Icon: ShieldIcon },
  { slug: "income-tax", Icon: FileIcon },
  { slug: "loan", Icon: CalculatorIcon },
  { slug: "discount", Icon: TagIcon },
] as const;

/** Photo matched to what each calculator actually computes. */
const CARD_IMAGES: Record<string, string> = {
  "overtime-pay": "/images/card-overtime.jpg",
  sss: "/images/card-sss.jpg",
  "income-tax": "/images/card-tax.jpg",
  loan: "/images/card-loan.jpg",
  discount: "/images/card-discount.jpg",
};

export default function PopularCalculators() {
  const items = POPULAR.map((p) => ({
    ...p,
    meta: getCalculator(p.slug),
  })).filter((p) => p.meta);

  const [featured, ...rest] = items;

  return (
    <section aria-labelledby="popular-heading" className="bg-white">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 lg:px-14">
        <SectionHeading
          id="popular-heading"
          eyebrow="Popular calculators"
          title="Quick access to what you need"
          action={{ href: "/calculators", label: "View all calculators" }}
        />

        <ul className="mt-6 grid gap-4 lg:grid-cols-[1.75fr_1fr_1fr]">
          <li>
            <FeaturedCalculatorCard
              slug={featured.slug}
              name={featured.meta!.name}
              summary={featured.meta!.summary}
              icon={<featured.Icon className="h-5 w-5" />}
              badge="Most Popular"
              imageSrc="/images/calc-document.jpg"
            />
          </li>
          {rest.slice(0, 2).map(({ slug, meta, Icon }) => (
            <li key={slug}>
              <CalculatorCard
                slug={slug}
                name={meta!.name}
                summary={meta!.summary}
                icon={<Icon className="h-5 w-5" />}
                tone="yellow"
                imageSrc={CARD_IMAGES[slug]}
                titleSizeClass="text-[1.0625rem] xl:text-[1.3125rem]"
              />
            </li>
          ))}
        </ul>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map(({ slug, meta, Icon }) => (
            <li key={slug}>
              <CalculatorCard
                slug={slug}
                name={meta!.name}
                summary={meta!.summary}
                icon={<Icon className="h-5 w-5" />}
                tone="blue"
                align="end"
                imageSrc={CARD_IMAGES[slug]}
                titleSizeClass="text-[1.0625rem] xl:text-[1.3125rem]"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
