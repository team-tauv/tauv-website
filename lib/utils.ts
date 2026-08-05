import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind sınıflarını birleştirir ve çakışanları temizler.
 * cn("px-2", "px-4") -> "px-4"  (son yazan kazanır)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
