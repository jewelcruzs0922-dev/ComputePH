import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Production deployments allow crawling; preview/development deployments
 * disallow it so staging URLs are never indexed alongside the production site.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction =
    !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";
  return {
    rules: { userAgent: "*", ...(isProduction ? { allow: "/" } : { disallow: "/" }) },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
