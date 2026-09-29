export default function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1680px] px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}
