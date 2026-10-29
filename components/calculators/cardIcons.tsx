import {
  CalculatorIcon,
  CalendarIcon,
  CoinsIcon,
  SolarBillListIcon,
  SolarClockIcon,
  SolarGiftIcon,
  SolarHealthIcon,
  SolarHomeIcon,
  SolarMoneyRollIcon,
  SolarMoonStarsIcon,
  SolarShieldCheckIcon,
  TagIcon,
} from "@/components/home/homeIcons";

type IconComp = React.ComponentType<{ className?: string }>;

/** One icon per calculator so every card reads at a glance. */
export const CARD_ICONS: Record<string, IconComp> = {
  "13th-month-pay": SolarGiftIcon,
  "overtime-pay": SolarClockIcon,
  "night-differential": SolarMoonStarsIcon,
  "daily-hourly-salary": SolarMoneyRollIcon,
  sss: SolarShieldCheckIcon,
  philhealth: SolarHealthIcon,
  "pag-ibig": SolarHomeIcon,
  "income-tax": SolarBillListIcon,
  loan: CoinsIcon,
  interest: CalculatorIcon,
  discount: TagIcon,
  installment: CalendarIcon,
};
