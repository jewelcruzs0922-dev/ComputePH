import { ArrowIcon } from "@/components/home/homeIcons";

const STEPS = [
  {
    n: 1,
    title: "Search",
    text: "Find the calculator you need in one or two words.",
  },
  {
    n: 2,
    title: "Calculate",
    text: "Enter your details and get instant results.",
  },
  {
    n: 3,
    title: "Result",
    text: "See a clear breakdown and explanation.",
  },
  {
    n: 4,
    title: "Understand",
    text: "Read FAQs, tips, and related tools if you need more info.",
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="bg-white">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 lg:px-14">
        <h2
          id="how-heading"
          className="text-center text-[2.625rem] font-bold tracking-tight text-navy xl:text-[3rem]"
        >
          How it works
        </h2>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              <div className="flex h-full gap-5 rounded-[1.75rem] bg-brand-soft p-6 sm:p-7">
                <span className="shrink-0 text-[2.5rem] font-bold leading-none tracking-tight text-brand-strong">
                  {String(step.n).padStart(2, "0")}
                </span>
                <span className="w-px shrink-0 self-stretch border-l border-dashed border-navy/25" />
                <div className="min-w-0">
                  <h3 className="text-xl font-bold leading-tight tracking-tight text-navy xl:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">
                    {step.text}
                  </p>
                </div>
              </div>

              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-[22px] top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white ring-4 ring-white xl:flex"
                >
                  <ArrowIcon className="h-5 w-5 [stroke-width:3]" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
