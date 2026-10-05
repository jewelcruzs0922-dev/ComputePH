import type { Metadata } from "next";
import Image from "next/image";
import CalculatorIndex from "@/components/calculators/CalculatorIndex";
import Container from "@/components/ui/Container";
import { CALCULATORS } from "@/lib/registry";

export const metadata: Metadata = {
  title: "All Calculators",
  description:
    "Browse every free ComputePH calculator — salary, overtime, 13th month pay, SSS, PhilHealth, Pag-IBIG, income tax, loans, interest, discounts, and installments.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsPage() {
  const items = CALCULATORS.map((c) => ({
    slug: c.slug,
    name: c.name,
    summary: c.summary,
    category: c.category,
    usesRules: c.usesRules,
  }));

  return (
    <Container className="pt-6 pb-10 sm:py-14">
      <div className="relative">
        <Image
          src="/images/calc-hero.png"
          alt=""
          aria-hidden="true"
          width={1406}
          height={1119}
          priority
          sizes="(min-width: 1600px) 500px, 30vw"
          className="pointer-events-none absolute right-14 top-0 hidden w-[30%] max-w-[500px] select-none lg:block xl:w-[35%]"
        />

        <h1 className="mt-1.5 text-3xl font-bold leading-[1.1] tracking-tight text-navy sm:mt-3 sm:text-4xl sm:leading-[1.15] md:text-5xl xl:pl-10 xl:text-[3.4rem] 2xl:text-6xl">
          <span className="block text-brand">Find the Right Calculator</span>
          <span className="block text-royal-strong">for Your Needs</span>
        </h1>

        <p className="mt-3 max-w-[34rem] text-base leading-6 text-ink-muted sm:mt-4 sm:text-xl sm:leading-8 xl:pl-10">
          From salary and government contributions to loans, discounts, and
          more — ComputePH has you covered.
        </p>

        <div className="mt-6 sm:mt-8">
          <CalculatorIndex items={items} />
        </div>
      </div>
    </Container>
  );
}
