import type { Metadata } from "next";
import Image from "next/image";
import CategoryCard from "@/components/ui/CategoryCard";
import Container from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/registry";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { socialMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Calculator Categories",
  description:
    "Browse ComputePH calculator categories for work and salary, government contributions, and money.",
  alternates: { canonical: "/calculators" },
  ...socialMetadata({
    title: "Calculator Categories",
    description:
      "Browse ComputePH calculator categories for work and salary, government contributions, and money.",
    path: "/calculators",
  }),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${SITE_NAME} calculator categories`,
  url: `${SITE_URL}/calculators`,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: CATEGORIES.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.name,
      url: `${SITE_URL}/calculators/${category.anchor}`,
    })),
  },
};

export default function CalculatorsPage() {
  return (
    <Container className="pt-6 pb-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[360px] min-w-0 overflow-hidden rounded-[2rem] sm:min-h-[440px] lg:min-h-[560px]">
          <Image
            src="/images/calculators-hero-money.jpg"
            alt="Hands counting stacks of Philippine peso banknotes"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-center rounded-[2rem] bg-brand px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <h1
            aria-label="Find the Right Calculator for Your Needs"
            className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-navy sm:text-6xl lg:text-[4.5rem]"
          >
            Find the <span>Right Calculator</span> for Your Needs
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-navy/55 sm:text-xl sm:leading-9">
            Choose a category to see only the calculators that belong to it.
            Start with work and salary, government contributions, or money.
          </p>
        </div>
      </section>

      <h2 className="mt-16 mb-8 text-center text-4xl font-bold tracking-tight text-navy sm:mt-24 sm:text-5xl lg:mt-32">
        Browse by Category
      </h2>

      <div className="grid gap-12 lg:mx-auto lg:w-[72%]">
        {CATEGORIES.map((category, index) =>
          category.id === "government" ? (
            <div
              key={category.id}
              className="relative isolate py-8 before:absolute before:inset-x-[-1rem] before:-inset-y-6 before:-z-10 before:bg-[#edf4fc] sm:before:inset-x-[-1.5rem] lg:before:left-1/2 lg:before:right-auto lg:before:w-screen lg:before:-translate-x-1/2"
            >
              <CategoryCard
                category={category}
                iconAbove
                number={String(index + 1).padStart(2, "0")}
              />
            </div>
          ) : (
            <CategoryCard
              key={category.id}
              category={category}
              iconAbove
              number={String(index + 1).padStart(2, "0")}
            />
          ),
        )}
      </div>
    </Container>
  );
}
