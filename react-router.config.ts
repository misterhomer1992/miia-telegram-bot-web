import type { Config } from "@react-router/dev/config";

const LOCALES = ["en", "uk", "pl"] as const;

// Every content page, in every locale. Keep this in sync with routes.ts.
// Prerendering each page (rather than letting it be client-rendered from the
// home index.html shell) means the browser receives the page's own correct
// HTML and React *hydrates* it — avoiding the layout/theme flash that happens
// when React discards the home shell and re-renders a different route.
const PAGES = ["contact", "changelog", "privacy", "terms", "data-security", "success-url"];

function prerenderPaths(): string[] {
  const paths = ["/", "/uk", "/pl"];
  for (const locale of LOCALES) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    for (const page of PAGES) paths.push(`${prefix}/${page}`);
  }
  return paths;
}

export default {
  ssr: false,
  prerender: prerenderPaths(),
  appDirectory: "src",
} satisfies Config;
