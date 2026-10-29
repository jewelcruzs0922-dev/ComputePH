import type { Metadata } from "next";
import CategoryPage from "@/components/calculators/CategoryPage";

export const metadata: Metadata = {
  title: "Government & Contributions Calculators",
  description:
    "Free Philippine government contribution calculators for SSS, PhilHealth, Pag-IBIG, and income tax.",
  alternates: { canonical: "/calculators/government-contributions" },
};

export default function GovernmentContributionsPage() {
  return <CategoryPage categoryId="government" />;
}
