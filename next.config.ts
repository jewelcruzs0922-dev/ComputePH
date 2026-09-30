import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Least-permissive CSP that matches this app's actual resources:
// - Next.js App Router ships inline bootstrap/flight scripts, so script-src needs
//   'unsafe-inline' (a nonce CSP would force every SSG page to dynamic rendering).
// - React inline style attributes (clip-path etc.) require style-src 'unsafe-inline'.
// - Fonts: next/font Geist (self-hosted). Images: local /public + /_next/image only.
// - Vercel Web Analytics loads first-party (/_vercel/...); Microsoft Clarity is the
//   only third-party script (www.clarity.ms tag loader; stats POSTed to
//   www.clarity.ms / *.clarity.ms; beacons from c.clarity.ms / c.bing.com; heatmap
//   fonts as data: URLs — see https://learn.microsoft.com/clarity/setup-and-installation/clarity-csp).
// - 'unsafe-eval' only in development (React debugging); production stays strict.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.clarity.ms https://scripts.clarity.ms https://*.clarity.ms${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://*.clarity.ms https://c.bing.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.clarity.ms https://*.clarity.ms https://c.bing.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
  },
  // Defense-in-depth alongside frame-ancestors for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Remove the X-Powered-By header from production responses.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
