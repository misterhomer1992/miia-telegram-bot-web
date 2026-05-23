import { Link, useMatches } from "react-router";
import logoUrl from "~/assets/miia-logo.jpg?w=72&format=webp&imagetools";
import logoFallback from "~/assets/miia-logo.jpg?w=72&format=jpg&imagetools";
import { localeFromRouteId } from "~/i18n/route";
import { useT } from "~/i18n/useT";
import styles from "./Footer.module.css";

type FooterLink = { label: string; href: string; external?: boolean };
type FooterCol = { title: string; links: FooterLink[] };

export function Footer() {
  const { t } = useT();
  const cols = t("footer.columns", { returnObjects: true }) as FooterCol[];
  const matches = useMatches();
  const locale = localeFromRouteId(matches[matches.length - 1]?.id ?? "");
  const homeHref = locale === "en" ? "/" : `/${locale}`;
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} id="support">
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link to={homeHref} className={styles.brandRow} aria-label={t("nav.brand")}>
              <picture>
                <source srcSet={logoUrl} type="image/webp" />
                <img
                  src={logoFallback}
                  alt=""
                  width="36"
                  height="36"
                  className={styles.brandLogo}
                />
              </picture>
              <span className={styles.brandText}>{t("nav.brand")}</span>
            </Link>
            <p className={styles.tagline}>{t("nav.brandSub")}</p>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div className={styles.colTitle}>{col.title}</div>
              <ul className={styles.linkList}>
                {col.links.map((link, j) => (
                  <li key={j}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>© {year} Miia</span>
          <span>{t("footer.tg")}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  const isInternal = link.href.startsWith("/") && !link.external;
  if (isInternal) {
    return (
      <Link to={link.href} className={styles.link}>
        {link.label}
      </Link>
    );
  }
  return (
    <a
      href={link.href}
      className={styles.link}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noopener noreferrer" : undefined}
    >
      {link.label}
      <span className={styles.arrow}>↗</span>
    </a>
  );
}
