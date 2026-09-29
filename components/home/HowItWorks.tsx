import SectionHeading from "@/components/ui/SectionHeading";
import {
  ArrowIcon,
  BulbIcon,
  CalculatorIcon,
  DocIcon,
  SearchIcon,
} from "@/components/home/homeIcons";

const STEPS = [
  {
    n: 1,
    title: "Search",
    text: "Find the calculator you need in one or two words.",
    Icon: SearchIcon,
  },
  {
    n: 2,
    title: "Calculate",
    text: "Enter your details and get instant results.",
    Icon: CalculatorIcon,
  },
  {
    n: 3,
    title: "Result",
    text: "See a clear breakdown and explanation.",
    Icon: DocIcon,
  },
  {
    n: 4,
    title: "Understand",
    text: "Read FAQs, tips, and related tools if you need more info.",
    Icon: BulbIcon,
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-white">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 lg:px-14">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="Get your result in 4 simple steps"
        />

        <ol className="mt-5 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="lg:border-l lg:border-line lg:px-6 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-base font-bold text-navy xl:h-11 xl:w-11 xl:text-lg">
                  {step.n}
                </span>
                <step.Icon className="h-6 w-6 text-royal xl:h-8 xl:w-8" />
                {i < STEPS.length - 1 && (
                  <ArrowIcon
                    aria-hidden="true"
                    className="ml-auto hidden h-5 w-5 text-royal/35 lg:block"
                  />
                )}
              </div>
              <h3 className="mt-4 text-[0.9375rem] font-bold text-navy xl:text-[1.0625rem] xl:text-[1.0625rem]">
                {step.title}
              </h3>
              <p className="mt-1.5 max-w-[34ch] text-[0.8125rem] leading-5 xl:text-[0.9062rem] xl:leading-6 text-ink-muted">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
