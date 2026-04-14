import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price in cents to a localized string.
 * Uses EU locale (es-ES) for EUR, en-US for USD.
 * e.g. 2030 cents EUR → "20,30 €", 150000 cents → "1.500,00 €"
 */
export function formatPrice(cents: number, currency: "EUR" | "USD" = "EUR"): string {
  const value = cents / 100;
  const locale = currency === "EUR" ? "de-DE" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with locale-aware thousands separators (no currency symbol).
 * e.g. 150000 → "150.000" (EUR) or "150,000" (USD)
 */
export function formatNumber(n: number, currency: "EUR" | "USD" = "EUR"): string {
  const locale = currency === "EUR" ? "de-DE" : "en-US";
  return new Intl.NumberFormat(locale).format(n);
}
