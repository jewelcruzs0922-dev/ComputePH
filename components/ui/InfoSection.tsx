export default function InfoSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <h2 className="text-xl font-semibold tracking-tight text-navy">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-7 text-ink-muted">
        {children}
      </div>
    </section>
  );
}
