import { useMatches } from "react-router";
import { setupI18n } from "~/i18n/config";
import { localeFromRouteId } from "~/i18n/route";
import { pageMeta } from "~/i18n/pageMeta";
import { useT } from "~/i18n/useT";
import { PageLayout, PageSection } from "~/sections/PageLayout/PageLayout";

export const meta = pageMeta("terms");

type Section = { heading: string; body: string };

export default function Terms() {
  const matches = useMatches();
  const locale = localeFromRouteId(matches[matches.length - 1]?.id ?? "");
  setupI18n(locale);

  const { t } = useT();
  const sections = t("pages.terms.sections", { returnObjects: true }) as Section[];
  return (
    <PageLayout locale={locale} title={t("pages.terms.title")} lede={t("pages.terms.lede")}>
      {sections.map((s, i) => (
        <PageSection key={i} heading={s.heading} body={s.body} />
      ))}
    </PageLayout>
  );
}
