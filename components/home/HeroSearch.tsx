"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { searchCalculators } from "@/lib/search";
import { getCategory } from "@/lib/registry";
import { ArrowIcon, SearchIcon } from "@/components/home/homeIcons";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

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
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      go();
    }
  }

  return (
    <div className="relative w-full">
      <label htmlFor="hero-search" className="sr-only">
        Search for a calculator
      </label>
      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-royal"
        >
          <SearchIcon className="h-5 w-5" />
        </span>
        <input
          id="hero-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          placeholder="Search for a calculator... (e.g. 13th month pay, SSS, loan)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          aria-describedby="hero-search-hint"
          className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-12 text-[0.9375rem] xl:h-14 xl:pr-16 xl:text-base shadow-[0_2px_10px_rgba(15,61,115,0.06)] placeholder:text-[0.8125rem] placeholder:text-ink-muted focus:border-royal focus:outline-2 focus:outline-offset-2 focus:outline-royal"
        />
        <button
          type="button"
          onClick={go}
          aria-label="Search"
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-navy transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal xl:right-2 xl:h-11 xl:w-11"
        >
          <ArrowIcon className="h-5 w-5" />
        </button>
      </div>
      <p id="hero-search-hint" className="sr-only">
        Start typing to filter calculators, then press Enter to open the top
        match.
      </p>

      <p aria-live="polite" className="sr-only">
        {query.trim().length === 0
          ? ""
          : `${results.length} calculator${results.length === 1 ? "" : "s"} found`}
      </p>

      {query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-3 max-h-[min(24rem,60vh)] overflow-y-auto rounded-lg border border-line bg-white shadow-[0_8px_24px_rgba(15,61,115,0.10)]">
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
