import Image from "next/image";
import Link from "next/link";
import {
  AlarmClockIcon,
  ArrowIcon,
  BanknoteIcon,
  HouseKeyIcon,
  IdCardIcon,
  PercentTagIcon,
  ReceiptIcon,
} from "@/components/home/homeIcons";

const ICONS = {
  "13th-month-pay": BanknoteIcon,
  "overtime-pay": AlarmClockIcon,
  sss: IdCardIcon,
  "income-tax": ReceiptIcon,
  loan: HouseKeyIcon,
  discount: PercentTagIcon,
} as const;

type Props = {
  slug: string;
  name: string;
  imageSrc: string;
  tone: "yellow" | "blue";
};

export default function PopularCalculatorCard({
  slug,
  name,
  imageSrc,
  tone,
}: Props) {
  const Icon = ICONS[slug as keyof typeof ICONS] ?? BanknoteIcon;

  return (
    <Link
      href={`/calculators/${slug}`}
      className={[
        "group flex h-full flex-col rounded-[1.75rem] p-4 shadow-[0_1px_2px_rgba(15,61,115,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,61,115,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal sm:p-5",
        tone === "yellow"
          ? "bg-brand-soft"
          : "bg-azure",
      ].join(" ")}
    >
      <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-line/30">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />
        <span className="pointer-events-none absolute bottom-4 left-4 z-10 inline-flex text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
          <Icon className="h-10 w-10 [stroke-width:1.5]" />
        </span>
      </span>

      <span className="flex flex-1 flex-col items-center px-2 pb-1 pt-5 text-center sm:px-3">
        <span className="text-xl font-bold leading-snug tracking-tight text-navy xl:text-[1.375rem]">
          {name}
        </span>
        <span className="mt-auto flex w-full justify-center pt-6">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand text-navy transition-colors group-hover:bg-brand-strong">
            <ArrowIcon className="h-6 w-6 [stroke-width:2.5] transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </span>
    </Link>
  );
}
