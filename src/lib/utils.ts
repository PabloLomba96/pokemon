import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price in cents to a localized string.
 * Uses es-ES locale for EUR, en-US for USD.
 * e.g. 2030 cents EUR → "20,30 €"
 */
export function formatPrice(cents: number, currency: "EUR" | "USD" = "EUR"): string {
  const value = cents / 100;
  const locale = currency === "EUR" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with locale-aware thousands separators (no currency symbol).
 */
export function formatNumber(n: number, currency: "EUR" | "USD" = "EUR"): string {
  const locale = currency === "EUR" ? "es-ES" : "en-US";
  return new Intl.NumberFormat(locale).format(n);
}
