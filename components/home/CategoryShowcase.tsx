import CategoryCard from "@/components/ui/CategoryCard";
import { CATEGORIES } from "@/lib/registry";

export default function CategoryShowcase() {
  return (
    <section aria-labelledby="categories-heading" className="bg-mist">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 sm:px-6 lg:px-14">
        <h2
          id="categories-heading"
          className="text-center text-[2.25rem] font-bold tracking-tight text-navy sm:text-[2.75rem] xl:text-[3.25rem]"
        >
          Find the right calculator
          <br />
          for your needs.
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
