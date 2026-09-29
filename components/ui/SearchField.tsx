import { ArrowIcon, SearchIcon } from "@/components/home/homeIcons";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  autoFocus?: boolean;
  /** Renders the yellow arrow button; scrolls to the results/browse section. */
  onGo?: () => void;
};

/** Shared calculator search input — blue border, strong blue focus. */
export default function SearchField({
  id,
  value,
  onChange,
  placeholder = "Search calculators…",
  label = "Search calculators",
  autoFocus = false,
  onGo,
}: Props) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-royal"
      >
        <SearchIcon className="h-5 w-5" />
      </span>
      <input
        id={id}
        type="search"
        inputMode="search"
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full rounded-full border border-line bg-white pl-11 text-base text-ink shadow-[0_2px_10px_rgba(15,61,115,0.06)] placeholder:text-ink-muted/70 focus:border-royal focus:outline-2 focus:outline-offset-2 focus:outline-royal xl:h-14 ${
          onGo ? "pr-12 xl:pr-16" : "pr-4"
        }`}
      />
      {onGo && (
        <button
          type="button"
          onClick={onGo}
          aria-label="Jump to results"
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-navy transition-colors hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal xl:right-2 xl:h-11 xl:w-11"
        >
          <ArrowIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
