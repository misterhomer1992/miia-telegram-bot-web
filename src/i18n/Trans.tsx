import { Fragment, type ReactNode } from "react";
import styles from "./Trans.module.css";

const VARIANT: Record<string, "blue" | "amber" | "plain"> = {
  em1: "blue",
  em2: "amber",
  em3: "plain",
};

export function Trans({ children }: { children: string }) {
  const tokenRe = /<(em[123])>([^<]*)<\/\1>/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRe.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }
    const [, tagName, inner] = match;
    parts.push(
      <em key={key++} className={styles.em} data-variant={VARIANT[tagName!]}>
        {inner}
      </em>,
    );
    lastIndex = tokenRe.lastIndex;
  }
  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return <Fragment>{parts}</Fragment>;
}
