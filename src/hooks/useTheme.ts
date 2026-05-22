import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

function readInitial(): Theme {
  if (typeof document === "undefined") return "dark";
  const ds = document.documentElement.dataset.theme;
  return ds === "light" ? "light" : "dark";
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(readInitial);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("miia.theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return [theme, toggle];
}
