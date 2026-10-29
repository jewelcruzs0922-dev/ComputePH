import Image from "next/image";
import CalculatorCard from "@/components/ui/CalculatorCard";
import Container from "@/components/ui/Container";
import { CARD_ICONS } from "@/components/calculators/cardIcons";
import {
  BankIcon,
  BriefcaseIcon,
  CalculatorIcon,
  CoinsIcon,
} from "@/components/home/homeIcons";
import {
  calculatorsByCategory,
  getCategory,
  type CategoryId,
} from "@/lib/registry";

const CATEGORY_UI = {
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

export default function CategoryPage({ categoryId }: { categoryId: CategoryId }) {
  const category = getCategory(categoryId);
  const items = calculatorsByCategory(categoryId);
  const { Icon, image } = CATEGORY_UI[categoryId];

  return (
    <Container className="pb-10 pt-3 sm:pb-14 sm:pt-4">
      <section className="relative overflow-hidden rounded-[2rem] bg-navy text-white">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-cover"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,32,74,0.96)_0%,rgba(10,32,74,0.78)_52%,rgba(10,32,74,0.3)_100%)]"
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-20 pt-32 text-center sm:px-10 sm:pb-28 sm:pt-40">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-8xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-xl text-xl leading-8 text-white/85 sm:text-2xl sm:leading-9">
            {category.description}
          </p>

          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-lg font-semibold text-navy">
            <Icon className="h-4 w-4" />
            {items.length} calculators
          </span>
        </div>
      </section>

      <h2 className="mt-20 text-center text-5xl font-bold tracking-tight text-navy sm:text-6xl">
        Choose a calculator
      </h2>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const CardIcon = CARD_ICONS[item.slug] ?? CalculatorIcon;
          return (
            <li key={item.slug}>
              <CalculatorCard
                size="lg"
                slug={item.slug}
                name={item.name}
                summary=""
                icon={<CardIcon className="h-12 w-12" />}
                centerHeader
                hideArrow
                bareIcon
                thickBorder
              />
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
