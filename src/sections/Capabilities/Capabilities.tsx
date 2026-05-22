import { Trans } from "~/i18n/Trans";
import { useT } from "~/i18n/useT";
import styles from "./Capabilities.module.css";
import { visuals } from "./visuals";

const SPANS = [3, 3, 2, 2, 2, 3, 3] as const;

type Cap = { num: string; title: string; body: string };
type CapData = { kicker: string; title: string; sub: string; items: Cap[] };

export function Capabilities() {
  const { t } = useT();
  const data = t("caps", { returnObjects: true }) as CapData;
  return (
    <section className={styles.section} id="capabilities">
      <div className="wrap">
        <div className={styles.head}>
          <div className={styles.kicker}>{data.kicker}</div>
          <h2 className={styles.title}>
            <Trans>{data.title}</Trans>
          </h2>
          <p className={styles.sub}>{data.sub}</p>
        </div>
        <div className={styles.grid}>
          {data.items.map((cap, i) => {
            const Visual = visuals[i];
            return (
              <div className={styles.card} data-span={SPANS[i]} key={i}>
                <div className={styles.num}>{cap.num}</div>
                <h3 className={styles.cardTitle}>
                  <Trans>{cap.title}</Trans>
                </h3>
                <p className={styles.body}>{cap.body}</p>
                <div className={styles.visual}>{Visual ? <Visual /> : null}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
