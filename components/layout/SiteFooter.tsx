import Link from "next/link";
import Image from "next/image";
import NewsletterNote from "@/components/layout/NewsletterNote";
import { SITE_NAME } from "@/lib/site";
import { CATEGORIES } from "@/lib/registry";

const QUICK_LINKS = [
  { href: "/calculators", label: "Calculators" },
  ...CATEGORIES.map((c) => ({
    href: `/calculators#${c.anchor}`,
    label:
      c.id === "government"
        ? "Government"
        : c.id === "money"
          ? "Money"
          : "Work & Salary",
  })),
];

const ABOUT_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 lg:px-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
          <div>
            <p className="flex items-center">
              <span className="inline-flex rounded-xl bg-white px-2.5 py-2">
                <Image
                  src="/images/logo-computeph.png"
                  alt="ComputePH"
                  width={2172}
                  height={724}
                  quality={90}
                  sizes="132px"
                  className="h-11 w-auto"
                />
              </span>
            </p>
            <p className="mt-3 max-w-[42ch] text-[0.8125rem] leading-6 text-azure">
              Simple calculators for everyday life in the Philippines.
            </p>
            <p className="mt-6 text-xs text-azure/80">
              © {year} {SITE_NAME}. All rights reserved.
            </p>
          </div>

          <nav aria-label="Quick links" className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">Quick Links</h2>
            <ul className="mt-3 space-y-1">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] text-azure transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="About" className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">About</h2>
            <ul className="mt-3 space-y-1">
              {ABOUT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] text-azure transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:border-l lg:border-white/10 lg:pl-8">
            <h2 className="text-sm font-semibold text-white">Stay Updated</h2>
            <p className="mt-3 max-w-[42ch] text-[0.8125rem] leading-6 text-azure">
              Useful tools, updates, and more for everyday life in the
              Philippines.
            </p>
            <NewsletterNote />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[0.6875rem] leading-4 text-azure/70">
            {SITE_NAME} is independent and not affiliated with SSS, PhilHealth,
            Pag-IBIG, BIR, DOLE, or any government agency. Results are estimates
            only — verify figures with the relevant agency.
          </p>
          <p className="mt-2 text-[0.6875rem] leading-4 text-azure/70">
            Photos via Wikimedia Commons: office by Mehdigroup1601 (CC BY-SA
            4.0); Malacanang New Executive Building and HSBC Building, Binondo
            by the National Historical Commission of the Philippines (public
            domain).
          </p>
        </div>
      </div>
    </footer>
  );
}
