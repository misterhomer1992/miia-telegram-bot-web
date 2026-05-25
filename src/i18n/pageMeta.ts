import type { MetaFunction } from "react-router";
import { resources } from "./config";
import { localeFromRouteId } from "./route";

type PageKey = "contact" | "changelog" | "privacy" | "terms" | "dataSecurity";

/**
 * Builds a `meta` export for a content page, giving it a localized `<title>`.
 * Each page is prerendered (see react-router.config.ts), so without this the
 * static HTML would ship with no title at all.
 */
export function pageMeta(key: PageKey): MetaFunction {
  return ({ matches }) => {
    const id = matches[matches.length - 1]?.id ?? "";
    const locale = localeFromRouteId(id);
    const title = resources[locale].translation.pages[key].title;
    return [{ title: `${title} — Miia` }];
  };
}
