import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateConverter(str: string, maxLen: number) {
  if (str.length > maxLen) {
    return str.substring(0, maxLen).split(" ").slice(0, -1).join(" ") + "...";
  }
  return str;
}

export function capitalize(str: string) {
  return String(str[0]).toUpperCase() + String(str).slice(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

export function buildQueryString(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map<[string, string]>(([k, v]) => [k, String(v)]);
  const query = new URLSearchParams(entries).toString();
  return query ? `?${query}` : "";
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
