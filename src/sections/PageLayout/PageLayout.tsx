import type { ReactNode } from "react";
import { Link } from "react-router";
import { Footer } from "~/sections/Footer/Footer";
import { Nav } from "~/sections/Nav/Nav";
import { useT } from "~/i18n/useT";
import type { Locale } from "~/i18n/config";
import styles from "./PageLayout.module.css";

function homeFor(locale: Locale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

type Props = {
  locale: Locale;
  title: string;
  lede?: string;
  children: ReactNode;
};

export function PageLayout({ locale, title, lede, children }: Props) {
  const { t } = useT();
  return (
    <>
      <Nav />
      <main>
        <section className={`wrap ${styles.page}`}>
          <Link to={homeFor(locale)} className={styles.back}>
            {t("pages.back")}
          </Link>
          <header className={styles.head}>
            <h1 className={styles.title}>{title}</h1>
            {lede ? <p className={styles.lede}>{lede}</p> : null}
          </header>
          <div className={styles.body}>{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function PageSection({ heading, body }: { heading: string; body: string }) {
  return (
    <div className={styles.section}>
      <h2>{heading}</h2>
      <p>{body}</p>
    </div>
  );
}
