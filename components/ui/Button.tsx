import Link from "next/link";
import { ArrowIcon } from "@/components/home/homeIcons";

export type ButtonVariant = "primary" | "secondary" | "text";

export function buttonClasses(
  variant: ButtonVariant = "primary",
  className = "",
): string {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal disabled:cursor-not-allowed disabled:opacity-60";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-brand px-5 text-navy hover:bg-brand-strong active:bg-brand-strong",
    secondary:
      "border border-royal/35 bg-white px-5 text-royal-strong hover:border-royal hover:bg-royal-soft",
    text: "px-1 py-1 text-royal-strong hover:text-navy hover:underline",
  };
  return `${base} ${variants[variant]} ${className}`;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: { variant?: ButtonVariant } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses(variant, className)} {...rest} />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...rest
}: { variant?: ButtonVariant; className?: string } & Omit<
  React.ComponentProps<typeof Link>,
  "className"
>) {
  return (
    <Link className={buttonClasses(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

/** Text link with the trailing arrow used across section headings. */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-royal-strong transition-colors hover:text-navy hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal ${className}`}
    >
      {children}
      <ArrowIcon className="h-4 w-4" />
    </Link>
  );
}
