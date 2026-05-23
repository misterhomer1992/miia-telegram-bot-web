import { Link, useMatches } from "react-router";
import logoUrl from "~/assets/miia-logo.jpg?w=72&format=webp&imagetools";
import logoFallback from "~/assets/miia-logo.jpg?w=72&format=jpg&imagetools";
import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";
import { LangSwitcher } from "~/components/LangSwitcher/LangSwitcher";
import { ThemeToggle } from "~/components/ThemeToggle/ThemeToggle";
import { localeFromRouteId } from "~/i18n/route";
import { useT } from "~/i18n/useT";
import { useTelegramUrl } from "~/hooks/useTelegramUrl";
import { event } from "~/lib/analytics";
import styles from "./Nav.module.css";

export function Nav() {
  const { t } = useT();
  const botUrl = useTelegramUrl();
  const matches = useMatches();
  const locale = localeFromRouteId(matches[matches.length - 1]?.id ?? "");
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const contactHref = locale === "en" ? "/contact" : `/${locale}/contact`;
  return (
    <nav className={styles.nav}>
      <div className={`wrap ${styles.inner}`}>
        <Link to={homeHref} className={styles.brand} aria-label={t("nav.brand")}>
          <picture>
            <source srcSet={logoUrl} type="image/webp" />
            <img
              src={logoFallback}
              alt=""
              className={styles.brandLogo}
              width="36"
              height="36"
            />
          </picture>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{t("nav.brand")}</span>
            <span className={styles.brandSub}>{t("nav.brandSub")}</span>
          </span>
        </Link>
        <div className={styles.links}>
          <a href="#capabilities" className={styles.linkItem}>
            {t("nav.links.capabilities")}
          </a>
          <a href="#how" className={styles.linkItem}>
            {t("nav.links.how")}
          </a>
          <Link to={contactHref} className={styles.linkItem}>
            {t("nav.links.contact")}
          </Link>
        </div>
        <div className={styles.right}>
          <ThemeToggle />
          <LangSwitcher />
          <Button href={botUrl} external onClick={() => event("open_telegram", { surface: "nav" })} className={styles.cta}>
            <span className={styles.ctaLabel}>{t("nav.openInTelegram")}</span>
            <Icon name="arrowExternal" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
