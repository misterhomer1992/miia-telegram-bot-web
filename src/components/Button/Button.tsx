import type { ReactNode, MouseEvent } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  external?: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  className?: string;
  "aria-label"?: string;
};

export function Button({
  children,
  variant = "primary",
  href,
  external,
  onClick,
  className,
  ...rest
}: ButtonProps) {
  const cls = [styles.button, className].filter(Boolean).join(" ");
  if (href) {
    return (
      <a
        href={href}
        data-variant={variant}
        className={cls}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" data-variant={variant} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
