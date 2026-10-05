import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/registry";
import { RULES_BY_SLUG } from "@/lib/rules";
import { SITE_URL } from "@/lib/site";

/**
 * lastModified is only emitted when we have a reliable date: calculator pages
 * use the last-verified date of the official rules they follow. Guide pages
 * do the same for the rules they explain. Pages without a reliable content
 * date omit lastModified instead of pretending every build changed every page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // No trailing slash — matches the homepage canonical (metadataBase origin).
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/calculators`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...CALCULATORS.map((c) => {
      const rules = RULES_BY_SLUG[c.slug];
      return {
        url: `${SITE_URL}/calculators/${c.slug}`,
        ...(rules ? { lastModified: new Date(rules.lastUpdated) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    }),
    {
      url: `${SITE_URL}/guides/13th-month-pay-philippines`,
      lastModified: new Date(RULES_BY_SLUG["13th-month-pay"].lastUpdated),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
