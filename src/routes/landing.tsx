import { useEffect } from "react";
import { useMatches } from "react-router";
import { setupI18n, type Locale } from "~/i18n/config";
import { Capabilities } from "~/sections/Capabilities/Capabilities";
import { FinalCTA } from "~/sections/FinalCTA/FinalCTA";
import { Footer } from "~/sections/Footer/Footer";
import { Hero } from "~/sections/Hero/Hero";
import { HowItWorks } from "~/sections/HowItWorks/HowItWorks";
import { Nav } from "~/sections/Nav/Nav";
import { WhyMiia } from "~/sections/WhyMiia/WhyMiia";

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
