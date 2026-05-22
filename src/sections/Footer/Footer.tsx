import logoUrl from "~/assets/miia-logo.jpg?w=72&format=webp&imagetools";
import logoFallback from "~/assets/miia-logo.jpg?w=72&format=jpg&imagetools";
import { useT } from "~/i18n/useT";
import styles from "./Footer.module.css";

type FooterLink = { label: string; href: string };
type FooterCol = { title: string; links: FooterLink[] };

export function Footer() {
  const { t } = useT();
  const cols = t("footer.columns", { returnObjects: true }) as FooterCol[];
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} id="support">
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brandRow}>
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
            </div>
            <p className={styles.tagline}>{t("nav.brandSub")}</p>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <div className={styles.colTitle}>{col.title}</div>
              <ul className={styles.linkList}>
                {col.links.map((link, j) => (
                  <li key={j}>
                    {/* TODO: replace `#` placeholders with real destinations */}
                    <a href={link.href} className={styles.link}>
                      {link.label}
                      <span className={styles.arrow}>↗</span>
                    </a>
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
