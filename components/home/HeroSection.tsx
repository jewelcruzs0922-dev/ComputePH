import Link from "next/link";
import HeroMedia from "@/components/home/HeroMedia";
import HeroSearch from "@/components/home/HeroSearch";

const SUGGESTIONS = [
  { label: "13th month pay", href: "/calculators/13th-month-pay" },
  { label: "SSS", href: "/calculators/sss" },
  { label: "Income tax", href: "/calculators/income-tax" },
  { label: "Loan", href: "/calculators/loan" },
  { label: "Overtime", href: "/calculators/overtime-pay" },
];

export default function HeroSection() {
  return (
    <section
      className="relative z-30 isolate"
      style={{
        background:
          "linear-gradient(108deg,#f7fbff 0%,#eef5fd 48%,#e4eefc 100%)",
      }}
    >
      {/* Full-bleed background artwork with a light scrim for contrast. */}
      <div className="absolute inset-0">
        <HeroMedia priority sizes="100vw" className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f7fbff_0%,rgba(247,251,255,0.86)_34%,rgba(247,251,255,0.45)_66%,rgba(247,251,255,0.08)_100%)] sm:bg-[linear-gradient(to_right,#f7fbff_0%,rgba(247,251,255,0.72)_26%,rgba(247,251,255,0.28)_58%,rgba(247,251,255,0.05)_100%)] lg:bg-[linear-gradient(to_right,#f7fbff_0%,rgba(247,251,255,0.86)_24%,rgba(247,251,255,0.32)_52%,rgba(247,251,255,0)_60%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(247,251,255,0.04)_0%,rgba(247,251,255,0)_18%,rgba(247,251,255,0)_88%,#f7fbff_100%)] lg:bg-[linear-gradient(to_bottom,rgba(247,251,255,0.1)_0%,rgba(247,251,255,0)_25%,rgba(247,251,255,0)_74%,#f7fbff_100%)]"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1680px] items-center px-4 py-10 sm:px-6 sm:py-12 lg:min-h-[620px] lg:px-14 lg:py-16">
        <div className="w-full lg:max-w-[54%]">
          <h1 className="text-[2.1rem] font-extrabold leading-[1.1] tracking-tight text-navy sm:text-4xl lg:text-[3.15rem] xl:text-[3.85rem]">
            <span className="block">What do you need</span>{" "}
            <span className="block text-royal">
              to{" "}
              <span className="relative inline-block">
                calculate?
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 16"
                  preserveAspectRatio="none"
                  fill="none"
                  className="absolute -bottom-[0.16em] left-[10%] h-[0.26em] w-[92%] overflow-visible"
                >
                  <path
                    d="M6 12C58 4 138 2.5 194 7"
                    stroke="#f2d467"
                    strokeWidth="11"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h1>

          <p className="mt-3 max-w-[430px] text-[0.9375rem] leading-6 lg:max-w-[500px] lg:text-[1.0625rem] lg:leading-7 xl:max-w-[560px] xl:text-[1.25rem] xl:leading-8 text-ink">
            Accurate and easy-to-use calculators for your salary, taxes,
            contributions, loans, discounts and more — built for the
            Philippines.
          </p>

          <div className="mt-7">
            <HeroSearch />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="mr-1 text-[0.6875rem] font-semibold text-navy">
              Popular searches:
            </span>
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-full border border-royal/20 bg-royal-soft px-2.5 py-1 text-[0.6875rem] font-medium text-royal-strong transition-colors hover:border-royal hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
