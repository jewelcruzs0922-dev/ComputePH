import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/registry";
import {
  ArrowIcon,
  BankIcon,
  BriefcaseIcon,
  CoinsIcon,
  PremiumBankIcon,
  WorkLaptopIcon,
  HandCoinIcon,
} from "@/components/home/homeIcons";

const CARDS = {
  work: {
    Icon: BriefcaseIcon,
    image: "/images/cat-work.jpg",
  },
  government: {
    Icon: BankIcon,
    image: "/images/cat-government.jpg",
  },
  money: {
    Icon: CoinsIcon,
    image: "/images/cat-money.jpg",
  },
} as const;

const DETAILED_ICONS = {
  work: WorkLaptopIcon,
  government: PremiumBankIcon,
  money: HandCoinIcon,
} as const;

export default function CategoryCard({
  category,
  iconAbove = false,
  number,
}: {
  category: Category;
  iconAbove?: boolean;
  number?: string;
}) {
  const conf = CARDS[category.id as keyof typeof CARDS];
  const Icon = iconAbove
    ? DETAILED_ICONS[category.id as keyof typeof DETAILED_ICONS]
    : conf.Icon;

  const card = (
    <Link
      href={`/calculators/${category.anchor}`}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] bg-navy shadow-[0_10px_30px_rgba(15,61,115,0.14)] transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-[0_20px_45px_rgba(15,61,115,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${
        iconAbove ? "min-h-[400px] xl:min-h-[480px]" : "min-h-[280px] xl:min-h-[320px]"
      }`}
    >
      <Image
        src={conf.image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,32,74,0.72)_0%,rgba(10,32,74,0.12)_36%,rgba(10,32,74,0.08)_58%,rgba(10,32,74,0.9)_100%)]"
      />

      {number && (
        <span className="absolute left-5 top-5 z-10 text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] sm:text-6xl">
          {number}
        </span>
      )}

      {!iconAbove && (
        <span className="relative z-10 flex items-start justify-between gap-3 p-5 sm:p-6">
          <span className="inline-flex items-center gap-2 pt-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-sm font-semibold tracking-tight sm:text-base">
              {category.name}
            </span>
          </span>
        </span>
      )}

      <span
        className={`relative z-10 mt-auto flex items-end justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 ${
          iconAbove ? "" : "bg-navy/55 backdrop-blur-[2px]"
        }`}
      >
        <span
          className={`max-w-[78%] text-white ${
            iconAbove
              ? "text-lg leading-8 sm:text-xl sm:leading-9"
              : "text-sm leading-5 sm:text-[0.9375rem] sm:leading-6"
          }`}
        >
          {category.description}
        </span>
        <span
          className={`inline-flex shrink-0 items-center justify-center rounded-full bg-brand text-navy transition-transform group-hover:translate-x-0.5 ${
            iconAbove ? "h-14 w-14" : "h-11 w-11"
          }`}
        >
          <ArrowIcon className={iconAbove ? "h-6 w-6" : "h-5 w-5"} />
        </span>
      </span>
    </Link>
  );

  if (!iconAbove) return card;

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 text-navy">
        <Icon className="h-28 w-28" />
      </span>
      <span className="mb-4 text-center text-2xl font-semibold text-navy sm:text-3xl">
        {category.name}
      </span>
      {card}
    </div>
  );
}
