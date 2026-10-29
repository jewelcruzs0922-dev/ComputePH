import type { Metadata } from "next";
import CategoryPage from "@/components/calculators/CategoryPage";

export const metadata: Metadata = {
  title: "Work & Salary Calculators",
  description:
    "Free Philippine work and salary calculators for 13th month pay, overtime, night differential, and daily or hourly pay.",
  alternates: { canonical: "/calculators/work-salary" },
};

export default function WorkSalaryPage() {
  return <CategoryPage categoryId="work" />;
}
