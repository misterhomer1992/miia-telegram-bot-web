import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";
import { Trans } from "~/i18n/Trans";
import { useT } from "~/i18n/useT";
import { useTelegramUrl } from "~/hooks/useTelegramUrl";
import styles from "./FinalCTA.module.css";

export function FinalCTA() {
  const { t } = useT();
  const botUrl = useTelegramUrl();
  return (
    <section className={styles.section}>
      <div className={styles.orbBlue} aria-hidden="true" />
      <div className={styles.orbAmber} aria-hidden="true" />
      <div className="wrap">
        <div className={styles.inner}>
          <h2 className={styles.title}>
            <Trans>{t("cta.title")}</Trans>
          </h2>
          <p className={styles.lede}>{t("cta.lede")}</p>
          <Button href={botUrl} external variant="primary">
            <Icon name="paperPlane" />
            {t("cta.button")}
          </Button>
        </div>
      </div>
    </section>
  );
}
