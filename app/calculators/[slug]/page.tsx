import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CalculatorRunner from "@/components/calculators/CalculatorRunner";
import { CARD_ICONS } from "@/components/calculators/cardIcons";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CalculatorCard from "@/components/ui/CalculatorCard";
import Container from "@/components/ui/Container";
import FaqSection from "@/components/ui/FaqSection";
import InfoSection from "@/components/ui/InfoSection";
import SourceNotice from "@/components/ui/SourceNotice";
import {
  BankIcon,
  BriefcaseIcon,
  CoinsIcon,
} from "@/components/home/homeIcons";
import { CONTENT } from "@/lib/content";
import {
  CALCULATORS,
  getCategory,
  getCalculator,
  relatedCalculators,
  type CategoryId,
} from "@/lib/registry";
import { RULES_BY_SLUG } from "@/lib/rules";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** Header pill icon + decorative header art per category (mockup layout). */
const CATEGORY_ART: Record<
  CategoryId,
  { src: string; w: number; h: number; Icon: typeof BriefcaseIcon }
> = {
  work: { src: "/images/cat-work.png", w: 1530, h: 1028, Icon: BriefcaseIcon },
  government: {
    src: "/images/cat-government.png",
    w: 1654,
    h: 951,
    Icon: BankIcon,
  },
  money: { src: "/images/cat-money.png", w: 1880, h: 836, Icon: CoinsIcon },
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
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: "/images/social-card.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ["/images/social-card.png"],
    },
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const meta = getCalculator(slug);
  const content = CONTENT[slug];
  if (!meta || !content) notFound();

  const category = getCategory(meta.category);
  const rules = RULES_BY_SLUG[meta.slug];
  const related = relatedCalculators(meta, 3);
  const canonical = `${SITE_URL}/calculators/${meta.slug}`;
  const art = CATEGORY_ART[meta.category];
  const CatIcon = art.Icon;

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
    <Container className="py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Calculators", href: "/calculators" },
          { label: meta.name },
        ]}
      />

      <header className="mt-5 xl:grid xl:grid-cols-[max-content_auto] xl:justify-start xl:items-start xl:gap-16">
        <div className="max-w-3xl">
          <Link
            href={`/calculators/#${category.anchor}`}
            className="inline-flex items-center gap-2 rounded-full border border-royal/30 bg-royal-soft px-3.5 py-1.5 text-sm font-semibold text-royal-strong transition-colors hover:border-royal"
          >
            <CatIcon className="h-4 w-4" />
            {category.name}
          </Link>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
            {meta.title}
          </h1>
          {content.intro.map((paragraph, i) => (
            <p
              key={paragraph}
              className={`max-w-2xl text-base leading-7 text-ink-muted${i === 0 ? " mt-3" : " mt-2"}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
        <Image
          src={art.src}
          alt=""
          aria-hidden="true"
          width={art.w}
          height={art.h}
          sizes="(min-width: 1536px) 360px, 300px"
          className="mt-1 hidden h-auto w-[420px] select-none xl:block 2xl:w-[520px]"
        />
      </header>

      <section
        aria-label={`${meta.name} calculator`}
        className="mt-8"
      >
        <CalculatorRunner slug={meta.slug} />
        <p className="mt-4 max-w-4xl text-xs leading-5 text-ink-muted">
          ComputePH is an independent calculator — results are estimates for
          informational purposes and may differ from official calculations or
          individual circumstances. Confirm important figures with your
          payslip, official records, or the relevant agency.
        </p>
      </section>

      <article className="mt-12 space-y-10">
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-navy">
            How this calculator works
          </h2>
          <ol className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.howItWorks.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-base font-bold text-navy"
                >
                  {index + 1}
                </span>
                <span className="text-base font-medium leading-6 text-navy">
                  {step}
                </span>
              </li>
            ))}
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
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight text-navy">
            Related calculators
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => {
              const Icon = CARD_ICONS[item.slug];
              return (
                <CalculatorCard
                  key={item.slug}
                  slug={item.slug}
                  name={item.name}
                  summary={item.summary}
                  icon={Icon ? <Icon className="h-5 w-5" /> : undefined}
                />
              );
            })}
          </div>
        </section>
      )}
    </Container>
  );
}
