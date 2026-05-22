import type { CSSProperties } from "react";
import type { Locale } from "~/i18n/config";

// EN flag: layered gradients approximating the Union Jack (from prototype .flag-en)
// Base: blue field (#012169), white cross (horizontal + vertical), red diagonal stripe
// Note: the ::before pseudo diagonal is baked in as a third gradient layer here.
const FLAG_STYLES: Record<Locale, CSSProperties> = {
  en: {
    background: `
      linear-gradient(45deg, transparent 47%, #C8102E 47%, #C8102E 53%, transparent 53%),
      linear-gradient(180deg, transparent 46%, #fff 46%, #fff 54%, transparent 54%),
      linear-gradient(90deg, transparent 38%, #fff 38%, #fff 62%, transparent 62%),
      #012169
    `,
  },
  uk: {
    background: "linear-gradient(180deg, #0057B7 50%, #FFD700 50%)",
  },
  pl: {
    background: "linear-gradient(180deg, #fff 50%, #DC143C 50%)",
  },
};

export function Flag({ locale }: { locale: Locale }) {
  return (
    <span
      aria-hidden="true"
      style={{
        ...FLAG_STYLES[locale],
        display: "inline-block",
        width: 22,
        height: 16,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(255,255,255,.08)",
        flexShrink: 0,
      }}
    />
  );
}
