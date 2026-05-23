import { useMatches } from "react-router";
import { setupI18n } from "~/i18n/config";
import { localeFromRouteId } from "~/i18n/route";
import { useT } from "~/i18n/useT";
import { PageLayout } from "~/sections/PageLayout/PageLayout";

type Entry = { date: string; title: string; body: string };

export default function Changelog() {
  const matches = useMatches();
  const locale = localeFromRouteId(matches[matches.length - 1]?.id ?? "");
  setupI18n(locale);

  const { t } = useT();
  const entries = t("pages.changelog.entries", { returnObjects: true }) as Entry[];
  return (
    <PageLayout
      locale={locale}
      title={t("pages.changelog.title")}
      lede={t("pages.changelog.lede")}
    >
      {entries.map((entry, i) => (
        <article key={i}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.06em",
              color: "var(--text-3)",
              marginBottom: 6,
            }}
          >
            {entry.date}
          </div>
          <h2
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: 22,
              fontWeight: 500,
              margin: "0 0 8px",
            }}
          >
            {entry.title}
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>
            {entry.body}
          </p>
        </article>
      ))}
    </PageLayout>
  );
}
