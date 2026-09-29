import {
  CalculatorIcon,
  CalendarIcon,
  ClockIcon,
  CoinsIcon,
  FileIcon,
  HeartIcon,
  HouseIcon,
  MoonIcon,
  ShieldIcon,
  TagIcon,
} from "@/components/home/homeIcons";

type IconComp = React.ComponentType<{ className?: string }>;

/** One icon per calculator so every card reads at a glance. */
export const CARD_ICONS: Record<string, IconComp> = {
  "13th-month-pay": CalendarIcon,
  "overtime-pay": ClockIcon,
  "night-differential": MoonIcon,
  "daily-hourly-salary": CalculatorIcon,
  sss: ShieldIcon,
  philhealth: HeartIcon,
  "pag-ibig": HouseIcon,
  "income-tax": FileIcon,
  loan: CoinsIcon,
  interest: CalculatorIcon,
  discount: TagIcon,
  installment: CalendarIcon,
};
