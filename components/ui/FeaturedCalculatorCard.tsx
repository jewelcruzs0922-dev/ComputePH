import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/home/homeIcons";

type Props = {
  slug: string;
  name: string;
  summary: string;
  icon?: React.ReactNode;
  badge?: string;
  imageSrc: string;
};

/**
 * Cream hero card for the first popular calculator, with a diagonal photo
 * reveal on the right.
 */
export default function FeaturedCalculatorCard({
  slug,
  name,
  summary,
  icon,
  badge,
  imageSrc,
}: Props) {
  return (
    <Link
      href={`/calculators/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand/50 bg-brand-soft p-5 xl:p-7 shadow-[0_1px_2px_rgba(15,61,115,0.05)] transition-shadow hover:shadow-[0_10px_24px_rgba(15,61,115,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 block w-[52%]"
        style={{ clipPath: "polygon(45% 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 300px, 45vw"
          className="object-cover"
        />
      </span>

      <div className="relative z-10 flex h-full flex-col max-w-[58%]">
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-royal">
            {icon}
          </span>
        )}
        <span className="mt-4 text-[1.125rem] font-bold text-navy xl:text-[1.4375rem] group-hover:underline">
          {name}
        </span>
        <span className="mt-1.5 flex-1 text-[0.7188rem] leading-[1rem] xl:text-[0.8125rem] xl:leading-[1.1875rem] text-ink-muted">
          {summary}
        </span>
        <span
          aria-hidden="true"
          className="mt-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-navy transition-colors group-hover:bg-brand-strong"
        >
          <ArrowIcon className="h-4 w-4" />
        </span>
      </div>

      {badge && (
        <span className="absolute right-[36%] top-5 z-20 rounded-full bg-brand px-3 py-1 text-[0.6875rem] font-semibold text-navy xl:px-4 xl:text-[0.75rem] sm:right-[36%]">
          {badge}
        </span>
      )}
    </Link>
  );
}
