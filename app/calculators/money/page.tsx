import type { Metadata } from "next";
import CategoryPage from "@/components/calculators/CategoryPage";

export const metadata: Metadata = {
  title: "Money Calculators",
  description:
    "Free Philippine money calculators for loans, interest, discounts, and installment plans.",
  alternates: { canonical: "/calculators/money" },
};

export default function MoneyPage() {
  return <CategoryPage categoryId="money" />;
}
