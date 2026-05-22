import logoUrl from "~/assets/miia-logo.jpg?w=64&format=webp&imagetools";
import logoFallback from "~/assets/miia-logo.jpg?w=64&format=jpg&imagetools";
import { Icon } from "~/components/Icon/Icon";
import styles from "./PhonePreview.module.css";

export function PhonePreview() {
  return (
    <div className={styles.wrap} data-phone-theme="dark">
      <div className={`${styles.orb} ${styles.orbBlue}`} aria-hidden="true" />
      <div className={`${styles.orb} ${styles.orbAmber}`} aria-hidden="true" />
      <div className={styles.phone}>
        <div className={styles.header}>
          <picture>
            <source srcSet={logoUrl} type="image/webp" />
            <img
              src={logoFallback}
              alt=""
              className={styles.avatar}
              width="32"
              height="32"
            />
          </picture>
          <div className={styles.headerMain}>
            <div className={styles.name}>Miia</div>
            <div className={styles.status}>
              <span className={styles.statusDot} />
              online
            </div>
          </div>
          <span className={styles.menu} aria-hidden="true">⋮</span>
        </div>
        <div className={styles.messages}>
          <div className={`${styles.msg} ${styles.user}`} style={{ animationDelay: "0.2s" }}>
            Make me a hero image of a fox in a circuit forest, 16:9
          </div>
          <div className={`${styles.msg} ${styles.bot}`} style={{ animationDelay: "1.2s" }}>
            <div className={styles.tag}>image · gemini</div>
            <div>Generating at 1920×1080…</div>
            <div className={styles.imgStub} aria-hidden="true" />
          </div>
          <div className={`${styles.msg} ${styles.user}`} style={{ animationDelay: "2.4s" }}>
            Now read this PDF and summarize chapter 3
          </div>
          <div className={`${styles.msg} ${styles.bot}`} style={{ animationDelay: "3.4s" }}>
            <div className={styles.typing} aria-hidden="true">
              <span /><span /><span />
            </div>
          </div>
        </div>
        <div className={styles.compose}>
          <span className={styles.iconBtn}><Icon name="attachment" /></span>
          <span className={styles.placeholder}>Message Miia…</span>
          <span className={styles.iconBtn}><Icon name="mic" /></span>
          <span className={styles.send}><Icon name="arrowRight" /></span>
        </div>
      </div>
      <span className={`${styles.cornerLabel} ${styles.cornerTopLeft}`}>
        <span>01 · CHAT</span>
        <span className={styles.connectorLine} />
      </span>
      <span className={`${styles.cornerLabel} ${styles.cornerBottomRight}`}>
        <span className={styles.connectorLine} />
        <span>auto-model · gpt → gemini</span>
      </span>
    </div>
  );
}
