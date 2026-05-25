import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";
import { Trans } from "~/i18n/Trans";
import { useT } from "~/i18n/useT";
import { useTelegramUrl } from "~/hooks/useTelegramUrl";
import { event } from "~/lib/analytics";
import styles from "./SubscriptionSuccess.module.css";

export function SubscriptionSuccess() {
  const { t } = useT();
  const botUrl = useTelegramUrl();
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.checkRing} aria-hidden="true">
          <svg className={styles.checkSvg} viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>

        <h1 className={styles.title}>
          <Trans>{t("success.title")}</Trans>
        </h1>
        <p className={styles.sub}>{t("success.sub")}</p>

        <Button
          href={botUrl}
          external
          variant="primary"
          onClick={() => event("open_telegram", { surface: "success" })}
        >
          <Icon name="paperPlane" />
          {t("success.cta")}
        </Button>

        <div className={styles.hint}>{t("success.hint")}</div>
      </div>
    </main>
  );
}
