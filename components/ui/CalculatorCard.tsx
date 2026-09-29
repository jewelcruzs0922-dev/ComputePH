import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/home/homeIcons";

type Props = {
  slug: string;
  name: string;
  summary: string;
  icon?: React.ReactNode;
  badge?: string;
  featured?: boolean;
  /** Card surface tint: white (default), butter yellow, or light blue. */
  tone?: "plain" | "yellow" | "blue";
  /** Where the trailing arrow sits: below the copy, or beside it. */
  align?: "start" | "end";
  /** Photo revealed on the right edge, matching the featured card treatment. */
  imageSrc?: string;
  /** Override the heading size for a single surface (default: base size). */
  titleSizeClass?: string;
  /** Type scale: sm = compact rows (home/related), lg = directory cards with large, readable type. */
  size?: "sm" | "lg";
  /** Override the icon chip colors (e.g. match the category panel header). */
  iconChip?: string;
};

/**
 * The single calculator card used on the homepage, the calculator index, and
 * related-calculator rows so every surface speaks the same visual language.
 */
export default function CalculatorCard({
  slug,
  name,
  summary,
  icon,
  badge,
  featured = false,
  tone = "plain",
  align = "start",
  imageSrc,
  titleSizeClass = "text-[0.9375rem]",
  size = "sm",
  iconChip,
}: Props) {
  const lg = size === "lg";
  const yellow = featured || tone === "yellow";
  const blue = !yellow && tone === "blue";
  const hasTopRow = Boolean(icon || badge);
  const iconChipCls =
    iconChip ??
    (yellow
      ? "bg-white text-navy"
      : blue
        ? "bg-white text-royal-strong"
        : "bg-azure text-royal");
  const arrow = (extra = "") => (
    <span
      aria-hidden="true"
      className={[
        "flex shrink-0 items-center justify-center rounded-full transition-colors",
        lg ? "h-11 w-11" : "h-9 w-9",
        yellow
          ? "bg-white text-navy group-hover:bg-brand"
          : blue
            ? "bg-white text-royal-strong group-hover:bg-royal group-hover:text-white"
            : "bg-azure text-royal group-hover:bg-royal group-hover:text-white",
        extra,
      ].join(" ")}
    >
      <ArrowIcon className={lg ? "h-5 w-5" : "h-4 w-4"} />
    </span>
  );

  return (
    <Link
      href={`/calculators/${slug}`}
      className={[
        "group relative flex h-full flex-col overflow-hidden transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal",
        lg ? "rounded-2xl p-5 sm:p-6" : "rounded-xl p-4",
        yellow
          ? "border border-brand/50 bg-brand-soft shadow-[0_1px_2px_rgba(15,61,115,0.06)] hover:shadow-[0_10px_24px_rgba(15,61,115,0.12)]"
          : blue
            ? "border border-royal/25 bg-azure shadow-[0_1px_2px_rgba(15,61,115,0.05)] hover:border-royal/50 hover:shadow-[0_10px_24px_rgba(15,61,115,0.12)]"
            : "border border-line bg-white shadow-[0_1px_2px_rgba(15,61,115,0.04)] hover:border-royal/40 hover:shadow-[0_10px_24px_rgba(15,61,115,0.10)]",
      ].join(" ")}
    >
      {imageSrc && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 block w-[46%]"
          style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0 100%)" }}
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(min-width: 1024px) 240px, 160px"
            className="object-cover"
          />
        </span>
      )}

      <div className="relative z-10 flex h-full flex-col">
        {hasTopRow && (
          <span className="flex items-start justify-between gap-3">
            {icon ? (
              <span
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full",
                  iconChipCls,
                ].join(" ")}
              >
                {icon}
              </span>
            ) : (
              <span />
            )}
            {badge && (
              <span className="rounded-full bg-brand px-2.5 py-1 text-[0.6875rem] font-semibold text-navy">
                {badge}
              </span>
            )}
          </span>
        )}
        {lg ? (
          <>
            <span
              className={[
                "text-xl font-bold leading-7 text-navy group-hover:underline",
                hasTopRow ? "mt-4" : "",
              ].join(" ")}
            >
              {name}
            </span>
            <span className="mt-2 flex flex-1 items-end justify-between gap-3">
              <span className="text-base leading-6 text-ink-muted">
                {summary}
              </span>
              {arrow()}
            </span>
          </>
        ) : (
          <>
            <span
              className={[
                titleSizeClass,
                "font-bold text-navy group-hover:underline",
                hasTopRow ? "mt-4" : "",
              ].join(" ")}
            >
              {name}
            </span>

            {align === "end" ? (
              <span
                className={`mt-1.5 flex flex-1 items-end justify-between gap-2 ${
                  imageSrc ? "max-w-[56%]" : ""
                }`}
              >
                <span className="flex-1 text-[0.7188rem] leading-[1rem] text-ink-muted">
                  {summary}
                </span>
                {arrow("mb-0.5")}
              </span>
            ) : (
              <>
                <span
                  className={`mt-1.5 flex-1 text-[0.7188rem] leading-[1rem] text-ink-muted ${
                    imageSrc ? "max-w-[60%]" : ""
                  }`}
                >
                  {summary}
                </span>
                {arrow("mt-3")}
              </>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
