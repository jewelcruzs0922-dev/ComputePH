import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/registry";
import {
  ArrowIcon,
  BankIcon,
  BriefcaseIcon,
  CoinsIcon,
} from "@/components/home/homeIcons";

const CARDS = {
  work: {
    Icon: BriefcaseIcon,
    cardClass: "bg-navy-soft text-white",
    iconClass: "bg-white text-navy-soft",
    titleClass: "text-white",
    descClass: "text-white/85",
    arrowClass: "bg-white text-royal group-hover:bg-brand group-hover:text-navy",
    image: "/images/cat-work.jpg",
  },
  government: {
    Icon: BankIcon,
    cardClass: "bg-brand text-navy",
    iconClass: "bg-white text-navy",
    titleClass: "text-navy",
    descClass: "text-navy/80",
    arrowClass: "bg-white text-royal group-hover:bg-navy group-hover:text-white",
    image: "/images/cat-government.jpg",
  },
  money: {
    Icon: CoinsIcon,
    cardClass: "bg-azure text-navy",
    iconClass: "bg-white text-royal",
    titleClass: "text-navy",
    descClass: "text-navy/80",
    arrowClass: "bg-white text-royal group-hover:bg-royal group-hover:text-white",
    image: "/images/cat-money.jpg",
  },
} as const;

/** Large color-block category card with a curved photo reveal. */
export default function CategoryCard({ category }: { category: Category }) {
  const conf = CARDS[category.id as keyof typeof CARDS];
  const { Icon } = conf;
  return (
    <Link
      href={`/calculators#${category.anchor}`}
      className={`group relative flex min-h-[200px] flex-col overflow-hidden rounded-2xl p-4 xl:min-h-[240px] xl:p-6 transition-shadow hover:shadow-[0_14px_30px_rgba(15,61,115,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${conf.cardClass}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ clipPath: "ellipse(47% 64% at 100% 100%)" }}
      >
        <Image
          src={conf.image}
          alt=""
          fill
          sizes="(min-width: 768px) 300px, 100vw"
          className="object-cover"
        />
      </span>

      <span
        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${conf.iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className={`relative z-10 mt-4 max-w-[74%] text-lg font-bold xl:text-xl ${conf.titleClass}`}>
        {category.name}
      </h3>
      <p
        className={`relative z-10 mt-2 max-w-[55%] text-[0.7188rem] leading-[1rem] xl:max-w-[54%] xl:text-[0.8125rem] xl:leading-[1.1875rem] ${conf.descClass}`}
      >
        {category.description}
      </p>
      <span
        aria-hidden="true"
        className={`relative z-10 mt-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors ${conf.arrowClass}`}
      >
        <ArrowIcon className="h-4 w-4" />
      </span>
    </Link>
  );
}
