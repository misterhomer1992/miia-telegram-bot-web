import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import uk from "./locales/uk.json";
import pl from "./locales/pl.json";

export const supportedLanguages = ["en", "uk", "pl"] as const;
export type Locale = (typeof supportedLanguages)[number];

export const defaultLocale: Locale = "en";

export const resources = {
  en: { translation: en },
  uk: { translation: uk },
  pl: { translation: pl },
} as const;

let initialized = false;
export function setupI18n(locale: Locale = defaultLocale) {
  if (!initialized) {
    i18n.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: defaultLocale,
      interpolation: { escapeValue: false },
      returnNull: false,
    });
    initialized = true;
  } else if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  return i18n;
}

export default i18n;
