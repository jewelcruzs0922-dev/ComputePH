"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    src: "/images/hero-salary-professional.jpg",
    alt: "Professional reviewing notes beside a laptop in a bright modern office",
    label: "Work and salary",
  },
  {
    src: "/images/hero-government-building.jpg",
    alt: "Modern Philippine government service building with the national flag",
    label: "Government and contributions",
  },
  {
    src: "/images/hero-money-peso-desk.jpg",
    alt: "Philippine peso banknotes, coins, and a calculator on a light desk",
    label: "Money",
  },
];

const INTERVAL_MS = 4500;

/** Rotating hero artwork that crossfades between category photos. */
export default function HeroMedia({
  className = "relative",
  sizes,
  priority = false,
  decorative = false,
}: {
  className?: string;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  const [active, setActive] = useState(0);
  // Only the visible slide ships in the initial HTML; the upcoming slide is
  // mounted right after hydration and each following slide one rotation ahead,
  // so every crossfade still has its artwork ready in time.
  const [mounted, setMounted] = useState<number[]>([0]);
  const activeRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const preload = window.setTimeout(() => {
      setMounted((m) => (m.includes(1) ? m : [...m, 1]));
    }, 0);

    const id = window.setInterval(() => {
      if (document.hidden) return;
      const next = (activeRef.current + 1) % SLIDES.length;
      activeRef.current = next;
      setActive(next);
      const ahead = (next + 1) % SLIDES.length;
      setMounted((m) => (m.includes(ahead) ? m : [...m, ahead]));
    }, INTERVAL_MS);

    return () => {
      window.clearTimeout(preload);
      window.clearInterval(id);
    };
  }, []);

  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden={decorative || undefined}
    >
      {SLIDES.map((slide, i) =>
        mounted.includes(i) ? (
          <Image
            key={slide.src}
            src={slide.src}
            alt={decorative ? "" : slide.alt}
            fill
            quality={88}
            priority={priority && i === 0}
            sizes={sizes}
            className={`object-cover transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null,
      )}
    </div>
  );
}
