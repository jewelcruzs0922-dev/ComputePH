import Link from "next/link";
import HeroMedia from "@/components/home/HeroMedia";

export default function HeroSection() {
  return (
    <section
      className="relative z-30 isolate overflow-hidden -mt-[5rem] pt-[5rem] sm:-mt-[5.75rem] sm:pt-[5.75rem]"
      style={{
        background:
          "linear-gradient(108deg,#f7fbff 0%,#eef5fd 48%,#e4eefc 100%)",
      }}
    >
      {/* Full-bleed background artwork. */}
      <div className="absolute inset-0">
        <HeroMedia priority sizes="100vw" className="absolute inset-0 scale-[1.01] blur-[1px]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(10,32,74,0.55)_0%,rgba(10,32,74,0)_16%,rgba(10,32,74,0)_84%,rgba(10,32,74,0.55)_100%)] shadow-[inset_0_0_140px_rgba(4,16,32,0.4)]"
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1680px] items-center justify-center px-4 py-14 sm:px-6 sm:py-16 lg:min-h-[600px] lg:px-14 lg:py-20">
        <div className="mx-auto w-full max-w-[1000px] text-center">
          <h1 className="text-[2.1rem] font-extrabold leading-[1.1] tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5),0_10px_40px_rgba(0,0,0,0.65)] sm:text-5xl lg:text-[3.6rem] xl:text-[4.4rem]">
            <span className="block">What do you need</span>{" "}
            <span className="block text-white">
              to{" "}
              <span className="relative inline-block text-royal">
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
          <div className="mt-7 flex justify-center">
            <Link
              href="/calculators"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-white bg-white/20 px-8 text-lg font-semibold text-white transition-colors hover:border-brand hover:bg-brand hover:text-navy hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Browse calculators
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
