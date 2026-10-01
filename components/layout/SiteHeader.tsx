"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/registry";

const PRIMARY_LINKS = [
  { href: "/calculators", label: "Calculators" },
  ...CATEGORIES.map((c) => ({
    href: `/calculators#${c.anchor}`,
    label: c.name === "Government & Contributions" ? "Government" : c.name,
  })),
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [hash, setHash] = useState("");

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const isActive = (href: string) =>
    href === "/calculators"
      ? pathname === "/calculators" && hash === ""
      : pathname + hash === href;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-navy focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 w-full max-w-[1680px] items-center gap-4 px-4 sm:h-16 sm:px-6 lg:px-14">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
          aria-label="ComputePH home"
        >
          <Image
            src="/images/logo-computeph.png"
            alt=""
            width={2172}
            height={724}
            quality={90}
            sizes="(min-width: 640px) 144px, 132px"
            className="h-11 w-auto sm:h-12"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex md:ml-10 lg:ml-16"
        >
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative rounded px-3 py-2 text-[0.8125rem] xl:text-[0.9062rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${
                isActive(link.href)
                  ? "font-semibold text-royal-strong"
                  : "text-ink hover:text-royal-strong"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-2 -bottom-1 h-[3px] rounded bg-brand"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-navy transition-colors hover:bg-mist md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="border-t border-line bg-white px-4 pb-4 md:hidden"
        >
          <ul className="divide-y divide-line">
            {PRIMARY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`flex min-h-12 items-center text-[0.9375rem] font-medium ${
                    isActive(link.href) ? "text-royal-strong" : "text-navy"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
