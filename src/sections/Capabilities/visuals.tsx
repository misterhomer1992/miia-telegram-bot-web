import { Icon } from "~/components/Icon/Icon";
import styles from "./visuals.module.css";

/* ─── Card 01: Smart conversations — model chips ─────────── */
export function VisualChat() {
  return (
    <div className={styles.modelChips}>
      <span className={`${styles.modelChip} ${styles.active}`}>
        <span className={styles.swatch}></span>
        <span>GPT · routed</span>
      </span>
      <span className={styles.modelChip}>
        <span className={styles.swatch} style={{ background: "var(--amber)" }}></span>
        <span>Gemini</span>
      </span>
      <span className={styles.modelChip}>
        <span className={styles.swatch} style={{ background: "#a78bfa" }}></span>
        <span>Grok</span>
      </span>
      <span className={`${styles.modelChip} ${styles.dashed}`}>
        auto-select
      </span>
    </div>
  );
}

/* ─── Card 02: Image generation — 4 gradient tiles + + ──── */
export function VisualImage() {
  return (
    <div className={styles.imgPreviewGrid}>
      <div className={`${styles.imgTile} ${styles.t1}`}></div>
      <div className={`${styles.imgTile} ${styles.t2}`}></div>
      <div className={`${styles.imgTile} ${styles.t3}`}></div>
      <div className={`${styles.imgTile} ${styles.t4}`}>
        <span className={styles.plus}>+</span>
      </div>
    </div>
  );
}

/* ─── Card 03: Voice — 20 animated waveform bars ─────────── */
export function VisualVoice() {
  return (
    <div className={styles.voiceWave}>
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className={styles.bar}
          style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}

/* ─── Card 04: Documents — PDF stack + search w/ cursor ───── */
export function VisualDocs() {
  return (
    <div className={styles.docStack}>
      <div className={`${styles.doc} ${styles.highlight}`}></div>
      <div className={styles.doc}></div>
      <div className={styles.docSearch}>
        <Icon name="search" />
        find clause 3.2
        <span className={styles.cursor}></span>
      </div>
    </div>
  );
}

/* ─── Card 05: Vision — mock image with bounding boxes ──────  */
export function VisualVision() {
  return (
    <div className={styles.visionFrame}>
      <div className={styles.visionImg}>
        <div className={styles.bbox}></div>
        <div className={styles.bbox2}></div>
      </div>
    </div>
  );
}

/* ─── Card 06: Links & video — YouTube row + amber summary ── */
export function VisualLinks() {
  return (
    <>
      <div className={`${styles.urlRow} ${styles.yt}`}>
        <div className={styles.ytMark}></div>
        <span>youtube.com/watch?v=…&nbsp;&nbsp;·&nbsp;&nbsp;42:18</span>
      </div>
      <div className={styles.urlSummary}>
        Summary: the speaker argues three points about distributed systems, with a
        counter-argument starting at 18:42…
      </div>
    </>
  );
}

/* ─── Card 07: Threads — 3-item thread list, first active ─── */
export function VisualThreads() {
  return (
    <div className={styles.threads}>
      <div className={`${styles.thread} ${styles.active}`}>
        <div className={styles.ring}></div>
        <div className={styles.name}>Work · product strategy</div>
        <div className={styles.count}>142 msgs</div>
      </div>
      <div className={styles.thread}>
        <div className={styles.ring} style={{ background: "var(--amber)" }}></div>
        <div className={styles.name}>Recipes · weeknight dinners</div>
        <div className={styles.count}>38 msgs</div>
      </div>
      <div className={styles.thread}>
        <div className={styles.ring} style={{ background: "#a78bfa" }}></div>
        <div className={styles.name}>Research · neural nets</div>
        <div className={styles.count}>221 msgs</div>
      </div>
    </div>
  );
}

export const visuals = [
  VisualChat,
  VisualImage,
  VisualVoice,
  VisualDocs,
  VisualVision,
  VisualLinks,
  VisualThreads,
] as const;
