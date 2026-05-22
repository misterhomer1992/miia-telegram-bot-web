declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
  initialized = true;
}

export function pageview(path: string, locale: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id) return;
  window.gtag("event", "page_view", { page_path: path, page_location: window.location.href, language: locale });
}

type EventName = "open_telegram" | "theme_toggle" | "lang_switch";

export function event(name: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
