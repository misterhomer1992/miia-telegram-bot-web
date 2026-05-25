import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "miia.theme";

// Derive the initial theme from the same source of truth as the inline
// boot script (see lib/inline-scripts.ts): an explicit stored choice wins,
// otherwise follow the OS, otherwise dark. We deliberately do NOT read the
// `data-theme` attribute here: on client-rendered routes (anything not in the
// prerender list, served via the SPA/rewrite shell) React reconciles <html>
// and drops the attribute the boot script set, so reading it back would
// incorrectly fall through to dark. Reading the underlying preference instead
// keeps every route in sync.
function readInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  }
  return "dark";
}

function hasUserOverride(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark";
  } catch {
    return false;
  }
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(readInitial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Until the user explicitly toggles, follow live OS color-scheme changes.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = (e: MediaQueryListEvent) => {
      if (hasUserOverride()) return;
      setTheme(e.matches ? "light" : "dark");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return [theme, toggle];
}
