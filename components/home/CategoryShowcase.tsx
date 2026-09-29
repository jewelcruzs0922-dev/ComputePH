import CategoryCard from "@/components/ui/CategoryCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/registry";

export default function CategoryShowcase() {
  return (
    <section aria-labelledby="categories-heading" className="bg-mist">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 lg:px-14">
        <SectionHeading
          id="categories-heading"
          eyebrow="Browse by category"
          title={
            <>
              Find the right calculator
              <br />
              for your needs.
            </>
          }
          action={{ href: "/calculators", label: "Explore all" }}
        />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
