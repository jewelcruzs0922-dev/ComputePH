"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/lib/registry";
import SiteSearch from "@/components/layout/SiteSearch";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/calculators", label: "Calculators" },
  ...CATEGORIES.map((c) => ({
    href: `/calculators/${c.anchor}`,
    label: c.name === "Government & Contributions" ? "Government" : c.name,
  })),
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [hash, setHash] = useState("");
  const [hideHeader, setHideHeader] = useState(false);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!open && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, searchOpen]);

  useEffect(() => {
    const update = () => {
      setHash(window.location.hash);
      setOpen(false);
      setSearchOpen(false);
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const isActive = (href: string) =>
    href === "/calculators"
      ? pathname === "/calculators" && hash === ""
      : pathname + hash === href;

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return;
      setHideHeader(y > 80 && delta > 0);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-transform duration-300 ${hideHeader ? "-translate-y-full" : "translate-y-0"}`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-navy focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-4 py-2.5 sm:px-6 lg:px-14">
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="relative grid h-[3.75rem] grid-cols-[1fr_auto_1fr] items-center rounded-3xl border border-line bg-white px-2 shadow-[0_10px_30px_rgba(15,61,115,0.08)] sm:h-[4.5rem] sm:px-2.5">
            <button
              type="button"
              className="relative z-10 inline-flex h-11 w-11 justify-self-start items-center justify-center rounded-2xl bg-navy text-white transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal sm:h-12 sm:w-12"
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => {
                setOpen((v) => !v);
                setSearchOpen(false);
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
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

            <Link
              href="/"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  window.history.replaceState(null, "", "/");
                } else {
                  router.push("/", { scroll: true });
                  window.scrollTo({ top: 0, behavior: "auto" });
                }
              }}
              className="relative z-10 justify-self-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
              aria-label="ComputePH home"
            >
              <Image
                src="/images/logo-computeph.png"
                alt=""
                width={2172}
                height={724}
                quality={90}
                sizes="(min-width: 640px) 120px, 108px"
                className="h-14 w-auto sm:h-16"
              />
            </Link>

            <button
              type="button"
              className="relative z-10 inline-flex h-11 w-11 justify-self-end items-center justify-center rounded-2xl bg-navy text-white transition-colors hover:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal sm:h-12 sm:w-12"
              aria-expanded={searchOpen}
              aria-controls="site-search-panel"
              aria-label={searchOpen ? "Close search" : "Search"}
              onClick={() => {
                setSearchOpen((v) => !v);
                setOpen(false);
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {searchOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {open && (
            <nav
              id="site-nav"
              aria-label="Primary"
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-[0_12px_32px_rgba(15,61,115,0.14)] sm:right-auto sm:w-72"
            >
              <ul>
                {PRIMARY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        setOpen(false);
                        setSearchOpen(false);
                        if (
                          link.href === "/calculators" &&
                          pathname === "/calculators"
                        ) {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          window.history.replaceState(null, "", "/calculators");
                        }
                      }}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-royal-soft text-royal-strong"
                          : "text-navy hover:bg-mist"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {searchOpen && (
            <div
              id="site-search-panel"
              className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-line bg-white p-2 shadow-[0_12px_32px_rgba(15,61,115,0.14)] sm:left-auto sm:w-96"
            >
              <SiteSearch autoFocus />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
