import { useEffect } from "react";
import { useMatches } from "react-router";
import type { MetaFunction } from "react-router";
import { setupI18n, resources, type Locale } from "~/i18n/config";
import { SITE_URL } from "~/lib/constants";
import { Capabilities } from "~/sections/Capabilities/Capabilities";
import { FinalCTA } from "~/sections/FinalCTA/FinalCTA";
import { Footer } from "~/sections/Footer/Footer";
import { Hero } from "~/sections/Hero/Hero";
import { HowItWorks } from "~/sections/HowItWorks/HowItWorks";
import { Nav } from "~/sections/Nav/Nav";
import { WhyMiia } from "~/sections/WhyMiia/WhyMiia";

export const meta: MetaFunction = (args) => {
  const id = args.matches[args.matches.length - 1]?.id ?? "";
  const locale = id === "landing-uk" ? "uk" : id === "landing-pl" ? "pl" : "en";
  const t = resources[locale].translation as { meta: { title: string; description: string } };
  const path = locale === "en" ? "/" : `/${locale}/`;
  const url = `${SITE_URL}${path}`;
  const ogImage = `${SITE_URL}/og-image.png`;

  return [
    { title: t.meta.title },
    { name: "description", content: t.meta.description },
    { property: "og:title", content: t.meta.title },
    { property: "og:description", content: t.meta.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImage },
    { property: "og:locale", content: locale === "uk" ? "uk_UA" : locale === "pl" ? "pl_PL" : "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: t.meta.title },
    { name: "twitter:description", content: t.meta.description },
    { name: "twitter:image", content: ogImage },
    { tagName: "link", rel: "canonical", href: url },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: `${SITE_URL}/` },
    { tagName: "link", rel: "alternate", hrefLang: "uk", href: `${SITE_URL}/uk/` },
    { tagName: "link", rel: "alternate", hrefLang: "pl", href: `${SITE_URL}/pl/` },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/` },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Miia",
        url: SITE_URL,
        inLanguage: locale,
      },
    },
  ];
};

function localeFromRouteId(id: string): Locale {
  if (id === "landing-uk") return "uk";
  if (id === "landing-pl") return "pl";
  return "en";
}

export default function Landing() {
  const matches = useMatches();
  const routeMatch = matches[matches.length - 1];
  const locale = localeFromRouteId(routeMatch?.id ?? "");

  // Sync init so prerendered HTML contains the correct language
  setupI18n(locale);

  useEffect(() => {
    setupI18n(locale);
  }, [locale]);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <WhyMiia />
        <Capabilities />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
