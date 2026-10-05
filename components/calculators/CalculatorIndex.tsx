"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { searchCalculators } from "@/lib/search";
import { CATEGORIES, type CategoryId } from "@/lib/registry";
import { trackEvent } from "@/lib/analytics";
import CalculatorCard from "@/components/ui/CalculatorCard";
import SearchField from "@/components/ui/SearchField";
import { CARD_ICONS } from "@/components/calculators/cardIcons";
import {
  ArrowIcon,
  BankIcon,
  BriefcaseIcon,
  CalculatorIcon,
  CoinsIcon,
} from "@/components/home/homeIcons";

export type IndexItem = {
  slug: string;
  name: string;
  summary: string;
  category: CategoryId;
  usesRules?: boolean;
};

type IconComp = React.ComponentType<{ className?: string }>;

const SUGGESTIONS = ["13th month", "SSS", "overtime", "loan", "discount"];

const PLACEHOLDER_LONG =
  "Search calculators… (e.g. 13th month, SSS, loan)";
const PLACEHOLDER_SHORT = "Search calculators...";

const CATEGORY_UI: Record<
  CategoryId,
  {
    icon: IconComp;
    chip: string;
    /** Decorative panel illustration (mockup's left-column art). */
    art: { src: string; w: number; h: number };
  }
> = {
  work: {
    icon: BriefcaseIcon,
    chip: "bg-royal-strong text-white",
    art: { src: "/images/cat-work.png", w: 1530, h: 1028 },
  },
  government: {
    icon: BankIcon,
    chip: "bg-navy text-white",
    art: { src: "/images/cat-government.png", w: 1654, h: 951 },
  },
  money: {
    icon: CoinsIcon,
    chip: "bg-brand text-navy",
    art: { src: "/images/cat-money.png", w: 1880, h: 836 },
  },
};

export default function CalculatorIndex({ items }: { items: IndexItem[] }) {
  const [query, setQuery] = useState("");
  const [only, setOnly] = useState<CategoryId | null>(null);
  // Concise placeholder on narrow screens; the longer example stays on
  // desktop. Starts short so server HTML and the first client render match.
  const [placeholder, setPlaceholder] = useState(PLACEHOLDER_SHORT);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () =>
      setPlaceholder(mq.matches ? PLACEHOLDER_LONG : PLACEHOLDER_SHORT);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return searchCalculators(q, 20).map((meta) => ({
      slug: meta.slug,
      name: meta.name,
      summary: meta.summary,
      category: meta.category,
      usesRules: meta.usesRules,
    }));
  }, [query]);

  // Fire `search_used` once per mount on the first non-empty query.
  const searchTracked = useRef(false);
  useEffect(() => {
    if (results !== null && !searchTracked.current) {
      searchTracked.current = true;
      trackEvent("search_used");
    }
  }, [results]);

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    list: items.filter((i) => i.category === cat.id),
  })).filter((g) => g.list.length > 0);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView();
  };

  /** Applies a fixed suggestion term (never user-typed text). */
  const applySuggestion = (s: string) => {
    setQuery(s);
    trackEvent("popular_clicked", { term: s });
  };

  const go = () => scrollTo(results ? "results-heading" : "browse");

  /** "View all" isolates one category; clicking it again brings back every
   *  panel. */
  const toggleCategory = (id: CategoryId) => {
    if (only === id) {
      setOnly(null);
      scrollTo("browse");
    } else {
      setOnly(id);
      trackEvent("category_selected", { category: id });
      const anchor = CATEGORIES.find((c) => c.id === id)?.anchor;
      if (anchor) requestAnimationFrame(() => scrollTo(anchor));
    }
  };

  const chipCls =
    "rounded-full border border-line bg-white px-4 py-2 text-base font-medium text-navy transition-colors hover:border-royal hover:text-royal-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal sm:py-1.5";

  const visible = only ? grouped.filter((g) => g.cat.id === only) : grouped;

  return (
    <div>
      <div className="xl:pl-10">
        <div className="max-w-2xl">
          <SearchField
            id="index-search"
            value={query}
            onChange={setQuery}
            placeholder={placeholder}
            onGo={go}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2.5 xl:pl-10">
        <span className="mr-1 shrink-0 text-base text-ink-muted">
          Popular:
        </span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => applySuggestion(s)}
            className={chipCls}
          >
            {s}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        {results
          ? `${results.length} calculator${results.length === 1 ? "" : "s"} found`
          : ""}
      </p>

      {results ? (
        <section aria-label="Search results" className="mt-9">
          <h2 id="results-heading" className="text-2xl font-bold text-navy">
            {results.length === 0
              ? "No matches"
              : `${results.length} calculator${results.length === 1 ? "" : "s"} found`}
          </h2>
          {results.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-line bg-mist p-6">
              <p className="text-lg font-semibold text-navy">
                No calculator matched “{query.trim()}”.
              </p>
              <p className="mt-1 text-base text-ink-muted">
                Try one of the popular searches above, or a keyword like:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => applySuggestion(s)}
                    className={chipCls}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => {
                const CardIcon = CARD_ICONS[item.slug] ?? CalculatorIcon;
                return (
                  <li key={item.slug}>
                    <CalculatorCard
                      size="lg"
                      slug={item.slug}
                      name={item.name}
                      summary={item.summary}
                      icon={<CardIcon className="h-5 w-5" />}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : (
        <div id="browse">
          {visible.map(({ cat, list }) => {
            const ui = CATEGORY_UI[cat.id];
            const Icon = ui.icon;
            const isolated = only === cat.id;
            return (
              <section
                key={cat.id}
                id={cat.anchor}
                data-browse-section
                aria-label={cat.name}
                className="mt-6 rounded-3xl bg-mist p-5 sm:p-6 lg:p-7"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
                  <div>
                    <div className="flex items-start gap-4">
                      <span
                        aria-hidden="true"
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${ui.chip}`}
                      >
                        <Icon className="h-7 w-7" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-navy">
                          {cat.name}
                        </h2>
                        <p className="mt-2 text-base leading-6 text-ink-muted">
                          {cat.description}
                        </p>
                        <button
                          type="button"
                          aria-pressed={isolated}
                          onClick={() => toggleCategory(cat.id)}
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-base font-semibold text-ink shadow-sm transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal"
                        >
                          {isolated ? "Return" : "View all"}
                          <ArrowIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <Image
                      src={ui.art.src}
                      alt=""
                      aria-hidden="true"
                      width={ui.art.w}
                      height={ui.art.h}
                      sizes="320px"
                      className="mt-6 hidden h-auto w-full max-w-[300px] select-none lg:block"
                    />
                  </div>
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {list.map((item) => {
                      const CardIcon = CARD_ICONS[item.slug] ?? CalculatorIcon;
                      return (
                        <li key={item.slug}>
                          <CalculatorCard
                            size="lg"
                            slug={item.slug}
                            name={item.name}
                            summary={item.summary}
                            icon={<CardIcon className="h-5 w-5" />}
                            iconChip={ui.chip}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
