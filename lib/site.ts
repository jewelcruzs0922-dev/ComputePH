export const SITE_NAME = "ComputePH";

/**
 * Canonical origin used for metadata, canonical URLs, Open Graph, JSON-LD,
 * the sitemap, and robots.txt.
 *
 * NEXT_PUBLIC_SITE_URL is the single control point:
 * - Set it to your real production domain origin only
 *   (e.g. https://your-domain.com). Trailing slashes are normalized away;
 *   sub-paths, query strings, and fragments are rejected with a clear
 *   error, as are non-http(s) values.
 * - Required on ALL Vercel deployments (Production, Preview, and
 *   Development) — the build fails with an explicit error when it is
 *   missing there, and the value must be an HTTPS URL.
 * - Local development falls back to http://localhost:3000 when unset.
 * - Local production builds (not on Vercel) fall back to the documented
 *   default origin below and print a warning, so `npm run build` still
 *   works offline; real deployments must set the variable.
 */
const DOCUMENTED_DEFAULT_ORIGIN = "https://computeph.vercel.app";

/** Validates and normalizes a site URL. Throws with a clear message when invalid. */
export function normalizeSiteUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SITE_URL: "${raw}". Expected an absolute URL such as https://your-domain.com`,
    );
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(
      `Invalid NEXT_PUBLIC_SITE_URL: "${raw}". Only http(s) URLs are allowed.`,
    );
  }
  if (url.search || url.hash) {
    throw new Error(
      `Invalid NEXT_PUBLIC_SITE_URL: "${raw}". Do not include a query string or fragment.`,
    );
  }
  const path = url.pathname.replace(/\/+$/, "");
  if (path !== "") {
    throw new Error(
      `Invalid NEXT_PUBLIC_SITE_URL: "${raw}". Use the origin only (e.g. https://your-domain.com) — sub-paths are not supported.`,
    );
  }
  return url.origin;
}

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw !== undefined && raw.trim() !== "") {
    const normalized = normalizeSiteUrl(raw);
    if (process.env.VERCEL && !normalized.startsWith("https:")) {
      throw new Error(
        `NEXT_PUBLIC_SITE_URL must be an HTTPS URL on Vercel deployments; got "${raw}".`,
      );
    }
    return normalized;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is required on Vercel deployments. Set it in Vercel → Project Settings → Environment Variables for Production, Preview, and Development (e.g. https://your-domain.com).",
    );
  }

  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  console.warn(
    "[site] NEXT_PUBLIC_SITE_URL is not set — using the documented default " +
      `${DOCUMENTED_DEFAULT_ORIGIN}. Set NEXT_PUBLIC_SITE_URL before deploying.`,
  );
  return DOCUMENTED_DEFAULT_ORIGIN;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_TAGLINE =
  "Simple calculators for everyday life in the Philippines.";

export const SITE_DESCRIPTION =
  "Free Filipino-focused calculators for salary, 13th month pay, overtime, SSS, PhilHealth, Pag-IBIG, income tax, loans, discounts, and more. Fast and private.";

export const SITE_LOCALE = "en_PH";
