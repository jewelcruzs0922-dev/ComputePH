/**
 * Philippine peso and number formatting with explicit, tested rounding.
 * Guarantees finite output — callers never see NaN or Infinity.
 */

const bigFormatters = new Map<number, Intl.NumberFormat>();

/** Intl formatters overflow beyond 1e15, where toFixed stops being reliable. */
function bigFormatter(decimals: number): Intl.NumberFormat {
  let formatter = bigFormatters.get(decimals);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    bigFormatters.set(decimals, formatter);
  }
  return formatter;
}

export function roundTo(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return 0;
  if (Math.abs(value) >= 1e15) return value;
  const exponentiated = Number(`${value}e${decimals}`);
  if (!Number.isFinite(exponentiated)) {
    return Math.round(value * 10 ** decimals) / 10 ** decimals;
  }
  const sign = exponentiated < 0 ? -1 : 1;
  const rounded = sign * Math.round(Math.abs(exponentiated));
  const result = Number(`${rounded}e-${decimals}`);
  return Number.isFinite(result) ? result : 0;
}

/** Groups thousands and fixes decimals: 25000 -> "25,000.00". */
export function formatNumber(value: number, decimals = 2): string {
  const n = roundTo(value, decimals);
  if (!Number.isFinite(n)) return (0).toFixed(decimals);
  if (Math.abs(n) >= 1e15) {
    return bigFormatter(decimals).format(n);
  }
  const sign = n < 0 ? "-" : "";
  const [int, frac] = Math.abs(n).toFixed(decimals).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimals > 0 ? `${sign}${grouped}.${frac}` : `${sign}${grouped}`;
}

/** ₱25,000.00 */
export function formatPeso(value: number, decimals = 2): string {
  const n = roundTo(value, decimals);
  if (n < 0) return `-\u20B1${formatNumber(-n, decimals)}`;
  return `\u20B1${formatNumber(n, decimals)}`;
}

/** 12.5% */
export function formatPercent(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

export function isValidAmount(value: number): boolean {
  return Number.isFinite(value);
}
