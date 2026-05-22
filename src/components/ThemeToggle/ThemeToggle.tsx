import { useTheme } from "~/hooks/useTheme";
import { Icon } from "../Icon/Icon";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const [, toggle] = useTheme();
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label="Toggle theme"
    >
      <span className={`${styles.icon} ${styles.iconSun}`}>
        <Icon name="sun" />
      </span>
      <span className={`${styles.icon} ${styles.iconMoon}`}>
        <Icon name="moon" />
      </span>
    </button>
  );
}
