import type { CSSProperties } from "react";
import type { Locale } from "~/i18n/config";

const WRAPPER_STYLE: CSSProperties = {
  display: "inline-block",
  width: 22,
  height: 16,
  borderRadius: 3,
  overflow: "hidden",
  boxShadow: "0 0 0 1px rgba(255,255,255,.08)",
  flexShrink: 0,
};

const STRIPE_STYLES: Record<"uk" | "pl", CSSProperties> = {
  uk: { background: "linear-gradient(180deg, #0057B7 50%, #FFD700 50%)" },
  pl: { background: "linear-gradient(180deg, #fff 50%, #DC143C 50%)" },
};

function UnionJack() {
  return (
    <svg
      viewBox="0 0 60 30"
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ display: "block" }}
    >
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export function Flag({ locale }: { locale: Locale }) {
  if (locale === "en") {
    return (
      <span aria-hidden="true" style={WRAPPER_STYLE}>
        <UnionJack />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{ ...WRAPPER_STYLE, ...STRIPE_STYLES[locale] }}
    />
  );
}
