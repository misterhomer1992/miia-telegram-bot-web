import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { supportedLanguages, type Locale } from "~/i18n/config";
import { Icon } from "../Icon/Icon";
import { Flag } from "./Flag";
import styles from "./LangSwitcher.module.css";

const NATIVE: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
  pl: "Polski",
};

function pathForLocale(locale: Locale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

export function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const current = (i18n.language as Locale) || "en";

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function selectLocale(locale: Locale, e: React.MouseEvent) {
    e.preventDefault();
    try {
      localStorage.setItem("miia.lang", locale);
    } catch {
      // storage unavailable — ignore
    }
    setOpen(false);
    navigate(pathForLocale(locale));
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={`${styles.button}${open ? ` ${styles.buttonOpen}` : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Icon name="globe" />
        <span className={styles.label}>{current.toUpperCase()}</span>
        <span className={`${styles.chevron}${open ? ` ${styles.chevronOpen}` : ""}`}>
          <Icon name="chevronDown" />
        </span>
      </button>
      <div className={styles.menu} data-open={open} role="menu">
        {supportedLanguages.map((loc) => (
          <a
            key={loc}
            href={pathForLocale(loc)}
            className={styles.item}
            data-active={loc === current}
            onClick={(e) => selectLocale(loc, e)}
            role="menuitem"
          >
            <Flag locale={loc} />
            <span className={styles.itemMain}>
              <span className={styles.itemNative}>{NATIVE[loc]}</span>
              <span className={styles.itemEnglish}>{t(`lang.${loc}`)}</span>
            </span>
            <span className={styles.check}>
              <Icon name="checkmark" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
