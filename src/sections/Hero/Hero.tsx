import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";
import { Trans } from "~/i18n/Trans";
import { useT } from "~/i18n/useT";
import { useTelegramUrl } from "~/hooks/useTelegramUrl";
import { PhonePreview } from "./PhonePreview";
import styles from "./Hero.module.css";

export function Hero() {
  const { t } = useT();
  const botUrl = useTelegramUrl();
  return (
    <section className={styles.section}>
      <div className={`wrap ${styles.grid}`}>
        <div>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            {t("hero.eyebrow")}
          </div>
          <h1 className={styles.title}>
            <Trans>{t("hero.title.line1")}</Trans>
            <br />
            <Trans>{t("hero.title.line2")}</Trans>
          </h1>
          <p className={styles.lede}>{t("hero.lede")}</p>
          <div className={styles.ctaRow}>
            <Button href={botUrl} external variant="primary">
              <Icon name="paperPlane" />
              {t("hero.cta.primary")}
            </Button>
            <Button href="#capabilities" variant="ghost">
              {t("hero.cta.ghost")}
            </Button>
          </div>
          <div className={styles.meta}>{t("hero.meta")}</div>
        </div>
        <PhonePreview />
      </div>
    </section>
  );
}
