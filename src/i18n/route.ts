import type { Locale } from "./config";

export function localeFromRouteId(id: string): Locale {
  if (id.endsWith("-uk")) return "uk";
  if (id.endsWith("-pl")) return "pl";
  return "en";
}
