import type { Metadata } from "next";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCalculators from "@/components/home/PopularCalculators";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularCalculators />
      <CategoryShowcase />
      <HowItWorks />
    </>
  );
}
