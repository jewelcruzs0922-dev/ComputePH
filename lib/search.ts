import {
  CALCULATORS,
  type CalculatorMeta,
} from "@/lib/registry";

const FILLER = new Set([
  "a",
  "an",
  "and",
  "calc",
  "calculator",
  "calculators",
  "compute",
  "computeph",
  "for",
  "in",
  "mg",
  "my",
  "of",
  "ph",
  "philippines",
  "phillippines",
  "the",
  "to",
  "what",
  "with",
  "your",
]);

export function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(raw: string): string[] {
  return normalizeQuery(raw)
    .split(" ")
    .flatMap((part) => part.split("-"))
    .filter((t) => t.length > 0 && !FILLER.has(t));
}

function haystack(meta: CalculatorMeta): string {
  return normalizeQuery(
    [meta.name, ...meta.aliases, ...meta.keywords, meta.category, meta.summary].join(
      " ",
    ),
  );
}

function scoreMatch(tokens: string[], meta: CalculatorMeta): number {
  const name = normalizeQuery(meta.name);
  const hay = haystack(meta);
  let score = 0;
  for (const token of tokens) {
    if (name === token || name.startsWith(token)) {
      score += 6;
    } else if (new RegExp(`\\b${token}`).test(name)) {
      score += 5;
    } else if (new RegExp(`\\b${token}`).test(hay)) {
      score += 3;
    } else {
      return 0;
    }
  }
  const full = normalizeQuery(meta.name);
  if (full.startsWith(tokens.join(" "))) score += 4;
  if (tokens.length > 1 && tokens.every((t) => full.includes(t))) score += 3;
  return score;
}

/**
 * Small local search over the calculator index. Fast, dependency-free, and
 * tuned for natural queries like "13th month calculator" or "sss share".
 */
export function searchCalculators(
  rawQuery: string,
  limit = 8,
): CalculatorMeta[] {
  const tokens = tokenize(rawQuery);
  if (tokens.length === 0) return [];

  const scored: { meta: CalculatorMeta; score: number }[] = [];
  for (const meta of CALCULATORS) {
    const score = scoreMatch(tokens, meta);
    if (score > 0) scored.push({ meta, score });
  }

  if (scored.length === 0) {
    // Relaxed pass: any single token match keeps search forgiving.
    for (const meta of CALCULATORS) {
      const hay = haystack(meta);
      if (tokens.some((t) => t.length >= 2 && hay.includes(t))) {
        scored.push({ meta, score: 1 });
      }
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.meta);
}
