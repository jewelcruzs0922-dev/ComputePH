"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { searchCalculators } from "@/lib/search";
import { getCategory } from "@/lib/registry";
import { ArrowIcon, SearchIcon } from "@/components/home/homeIcons";

export default function SiteSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setQuery("");
  }

  const results = useMemo(() => {
    if (query.trim().length === 0) return [];
    return searchCalculators(query, 6);
  }, [query]);

  function go() {
    if (results.length > 0) {
      router.push(`/calculators/${results[0].slug}`);
    } else {
      router.push("/calculators");
    }
    setQuery("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      go();
    }
    if (e.key === "Escape") {
      setQuery("");
    }
  }

  return (
    <div className="relative w-full" role="search">
      <label htmlFor="site-search" className="sr-only">
        Search for a calculator
      </label>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-royal sm:left-5"
        >
          <SearchIcon className="h-5 w-5" />
        </span>
        <input
          id="site-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder="Search calculators..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          aria-describedby="site-search-hint"
          aria-controls="site-search-suggestions"
          className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-12 text-sm text-ink shadow-[0_2px_10px_rgba(15,61,115,0.06)] placeholder:text-ink-muted focus:border-royal focus:outline-2 focus:outline-offset-2 focus:outline-royal sm:h-12 sm:pl-11 sm:pr-14 sm:text-[0.9375rem]"
        />
        <button
          type="button"
          onClick={go}
          aria-label="Search"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-navy transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal sm:h-9 sm:w-9"
        >
          <ArrowIcon className="h-5 w-5" />
        </button>
      </div>
      <p id="site-search-hint" className="sr-only">
        Start typing to filter calculators, then press Enter to open the top
        match.
      </p>

      <p aria-live="polite" className="sr-only">
        {query.trim().length === 0
          ? ""
          : `${results.length} calculator${results.length === 1 ? "" : "s"} found`}
      </p>

      {query.trim().length > 0 && (
        <div
          id="site-search-suggestions"
          role="region"
          aria-label="Calculator suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(24rem,60vh)] overflow-y-auto rounded-xl border border-line bg-white shadow-[0_12px_32px_rgba(15,61,115,0.14)]"
        >
          {results.length === 0 ? (
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-navy">
                No calculators found.
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Try “SSS”, “loan”, “overtime”, or “13th month”.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["SSS", "loan", "overtime", "13th month"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-navy transition-colors hover:border-royal hover:text-royal-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/calculators/${item.slug}`}
                    onClick={() => setQuery("")}
                    className="block px-4 py-3 transition-colors hover:bg-mist"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-medium text-navy">{item.name}</span>
                      <span className="shrink-0 text-xs text-ink-muted">
                        {getCategory(item.category).name}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-muted">
                      {item.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
