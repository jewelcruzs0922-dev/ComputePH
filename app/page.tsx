import type { Metadata } from "next";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCalculators from "@/components/home/PopularCalculators";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      inLanguage: "en-PH",
    },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_TAGLINE,
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSection />
      <PopularCalculators />
      <CategoryShowcase />
      <HowItWorks />
    </>
  );
}
