import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CalculatorRunner from "@/components/calculators/CalculatorRunner";
import { CALCULATOR_ENGINES } from "@/components/calculators/engines";
import { CARD_ICONS } from "@/components/calculators/cardIcons";
import CalculatorCard from "@/components/ui/CalculatorCard";
import Container from "@/components/ui/Container";
import FaqSection from "@/components/ui/FaqSection";
import InfoSection from "@/components/ui/InfoSection";
import SourceNotice from "@/components/ui/SourceNotice";
import { ArrowIcon } from "@/components/home/homeIcons";
import { CONTENT } from "@/lib/content";
import {
  CALCULATORS,
  getCalculator,
  relatedCalculators,
} from "@/lib/registry";
import { RULES_BY_SLUG } from "@/lib/rules";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { socialMetadata } from "@/lib/metadata";

const HOW_IT_WORKS_TITLES: Record<string, string[]> = {
  "13th-month-pay": [
    "Start with basic",
    "Divide by 12",
    "Exclude extras",
    "Handle changes",
  ],
};

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCalculator(slug);
  if (!meta) return {};
  const canonical = `/calculators/${meta.slug}`;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical },
    ...socialMetadata({
      title: meta.title,
      description: meta.description,
      path: canonical,
    }),
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const meta = getCalculator(slug);
  const content = CONTENT[slug];
  const engine = CALCULATOR_ENGINES[slug];
  if (!meta || !content || !engine) notFound();

  const rules = RULES_BY_SLUG[meta.slug];
  const related = relatedCalculators(meta, 3);
  const canonical = `${SITE_URL}/calculators/${meta.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: meta.title,
        description: meta.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: canonical,
        inLanguage: "en-PH",
        offers: { "@type": "Offer", price: "0", priceCurrency: "PHP" },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Calculators",
            item: `${SITE_URL}/calculators`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: meta.name,
            item: canonical,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: content.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <Container className="pt-5 pb-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="mt-3 text-center sm:mt-5">
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight text-navy sm:text-6xl sm:leading-tight">
          {meta.title}
        </h1>
      </header>

      <section
        aria-label={`${meta.name} calculator`}
        className="mt-6 sm:mt-8"
      >
        <CalculatorRunner slug={meta.slug} fields={engine.fields} />

        <div className="mx-auto mt-8 max-w-3xl text-center">
          {content.intro.map((paragraph, i) => (
            <p
              key={paragraph}
              className={`text-base leading-7 text-ink-muted${
                i === 0 ? "" : " mt-3"
              }`}
            >
              {paragraph}
            </p>
          ))}
          {meta.guide && (
            <p className="mt-4 text-sm leading-6">
              <Link
                href={meta.guide.href}
                className="font-medium text-royal-strong underline underline-offset-4 hover:text-navy max-lg:inline-block max-lg:py-2.5"
              >
                {meta.guide.label}
              </Link>
            </p>
          )}
        </div>

        <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-5 text-ink-muted">
          ComputePH is an independent calculator — results are estimates for
          informational purposes and may differ from official calculations or
          individual circumstances. Confirm important figures with your
          payslip, official records, or the relevant agency.
        </p>
      </section>

      <article className="mt-9 space-y-8 sm:mt-12 sm:space-y-10">
        <section>
          <h2 className="text-center text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            How this calculator works
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {content.howItWorks.map((step, index) => {
              const title =
                HOW_IT_WORKS_TITLES[meta.slug]?.[index] ?? `Step ${index + 1}`;
              return (
                <li key={step} className="relative">
                  <div className="flex h-full min-h-[190px] gap-4 rounded-[1.75rem] bg-brand-soft p-5 sm:p-6">
                    <span
                      aria-hidden="true"
                      className="text-5xl font-bold leading-none tracking-tight text-brand-strong"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col border-l border-dashed border-navy/20 pl-4">
                      <span className="text-xl font-bold tracking-tight text-navy">
                        {title}
                      </span>
                      <span className="mt-2 text-base leading-6 text-ink-muted">
                        {step}
                      </span>
                    </span>
                  </div>
                  {index < content.howItWorks.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute -right-7 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white xl:flex"
                    >
                      <ArrowIcon className="h-5 w-5" />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <InfoSection title="Formula">
              <p>{content.formula.summary}</p>
              <div className="rounded-lg border border-line bg-mist p-4 font-mono text-sm leading-6 text-navy">
                {content.formula.lines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </InfoSection>
          </div>
          <div className="rounded-2xl border border-brand/50 bg-brand-soft p-5 sm:p-6">
            <InfoSection title="Worked example">
              <p>{content.example.scenario}</p>
              <ol className="list-decimal space-y-2 pl-5 marker:font-medium marker:text-navy">
                {content.example.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="rounded-lg border border-brand/60 bg-white px-4 py-3 font-medium text-navy">
                {content.example.answer}
              </p>
            </InfoSection>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <InfoSection title="Important notes">
              <ul className="list-disc space-y-2.5 pl-5 marker:font-medium marker:text-navy">
                {content.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </InfoSection>
          </div>
          <div className="space-y-6">
            {rules && <SourceNotice {...rules} />}
            <FaqSection faqs={content.faqs} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-9 sm:mt-12">
          <h2 className="text-center text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Related calculators
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {related.map((item) => {
              const Icon = CARD_ICONS[item.slug];
              return (
                <CalculatorCard
                  key={item.slug}
                  slug={item.slug}
                  name={item.name}
                  summary={item.summary}
                  icon={Icon ? <Icon className="h-10 w-10" /> : undefined}
                  tile
                />
              );
            })}
          </div>
        </section>
      )}
    </Container>
  );
}
