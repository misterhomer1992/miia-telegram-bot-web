import { useMatches } from "react-router";
import { Button } from "~/components/Button/Button";
import { setupI18n } from "~/i18n/config";
import { localeFromRouteId } from "~/i18n/route";
import { pageMeta } from "~/i18n/pageMeta";
import { useT } from "~/i18n/useT";
import { PageLayout } from "~/sections/PageLayout/PageLayout";

export const meta = pageMeta("contact");

const CONTACT_EMAIL = "miia.bot@atomicmail.io";

export default function Contact() {
  const matches = useMatches();
  const locale = localeFromRouteId(matches[matches.length - 1]?.id ?? "");
  setupI18n(locale);

  const { t } = useT();
  return (
    <PageLayout locale={locale} title={t("pages.contact.title")} lede={t("pages.contact.lede")}>
      <div>
        <p style={{ marginTop: 0, marginBottom: 4, fontSize: 14, color: "var(--text-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {t("pages.contact.emailLabel")}
        </p>
        <p style={{ fontSize: 22, margin: "0 0 20px" }}>
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--text)", textDecoration: "underline" }}>
            {CONTACT_EMAIL}
          </a>
        </p>
        <p style={{ marginTop: 0, marginBottom: 24, fontSize: 14, color: "var(--text-3)" }}>
          {t("pages.contact.emailNote")}
        </p>
        <Button href={`mailto:${CONTACT_EMAIL}`} external variant="primary">
          {t("pages.contact.cta")}
        </Button>
      </div>
    </PageLayout>
  );
}
