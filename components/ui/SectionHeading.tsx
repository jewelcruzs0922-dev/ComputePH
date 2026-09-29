import { ArrowLink } from "@/components/ui/Button";

type Props = {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: { href: string; label: string };
  as?: "h1" | "h2";
  className?: string;
};

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  action,
  as = "h2",
  className = "",
}: Props) {
  const Heading = as;
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-2 ${className}`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-royal-strong xl:text-[0.7812rem]">
            {eyebrow}
          </p>
        )}
        <Heading
          id={id}
          className={[
            "font-bold tracking-tight text-navy",
            as === "h1"
              ? "text-3xl leading-tight sm:text-4xl"
              : "text-2xl sm:text-[1.5625rem] xl:text-[2.125rem]",
            eyebrow ? "mt-2" : "",
          ].join(" ")}
        >
          {title}
        </Heading>
        {description && (
          <p className="mt-3 text-base leading-7 text-ink-muted">
            {description}
          </p>
        )}
      </div>
      {action && <ArrowLink href={action.href}>{action.label}</ArrowLink>}
    </div>
  );
}
