# ComputePH

Free Filipino-focused calculators for salary, government contributions, and money
decisions. Simple calculators for everyday life in the Philippines.

**Live:** https://computeph.vercel.app

Source: https://github.com/jewelcruzs0922-dev/ComputePH

## Stack

- Next.js 16 (App Router, Turbopack, every page prerendered at build)
- React 19 + TypeScript (strict)
- Tailwind CSS v4
- Vitest for unit tests (274 tests)

## Commands

```bash
npm run dev        # local development
npm run build      # production build (type-checks and prerenders all pages)
npm run start      # serve the production build
npm run lint       # ESLint
npm run test       # unit tests (vitest run)
npm run typecheck  # next typegen && tsc --noEmit
```

## Calculators

Work & Salary: 13th month pay, overtime, night differential, daily/hourly salary.

Government & Contributions: SSS, PhilHealth, Pag-IBIG, income tax.

Money: loan, interest, discount, installment.

## Architecture

- `lib/calculators/*` — pure TypeScript calculation engines (`fields` schema +
  `calculate()`), no React. UI-agnostic and fully unit-tested.
- `lib/rules/*` — the single source of truth for official rates, brackets, and
  multipliers, each with its source URL and verification date. Components must
  not hard-code government rates.
- `lib/content.ts` — explanatory page content (how it works, formula, example,
  notes, FAQs) per calculator.
- `lib/registry.ts` — calculator metadata that drives the homepage, directory,
  search, related links, and sitemap.
- `components/calculators/CalculatorForm.tsx` — one generic client form that
  renders any field schema and displays results.
- `app/calculators/[slug]/page.tsx` — static calculator pages with SEO
  metadata, canonical URLs, JSON-LD (SoftwareApplication, BreadcrumbList,
  FAQPage), official-rules block, and related calculators.

## Configuration

The site origin used for canonical URLs, Open Graph, the sitemap, robots.txt,
and JSON-LD comes from a single environment variable (resolved in
`lib/site.ts`):

```
NEXT_PUBLIC_SITE_URL=https://computeph.vercel.app
```

- **Required on Vercel deployments (Production, Preview, and Development)**
  — Vercel builds fail with a clear error if it is not set.
- Optional for local work: `npm run dev` falls back to
  `http://localhost:3000`; local production builds fall back to the
  documented default origin with a build-time warning.
- Values are validated (http(s) only, origin/root domain only — no query,
  fragment, or sub-path) and normalized (trailing slashes stripped) so every
  generated URL stays consistent.

See `.env.example` for the full format.

## Disclaimer

ComputePH is an independent calculator website, not affiliated with any
government agency. Results are estimates — verify important figures with the
relevant agency or a licensed professional.
