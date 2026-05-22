import { useT } from "~/i18n/useT";
import { Trans } from "~/i18n/Trans";
import styles from "./HowItWorks.module.css";

type Step = { label: string; title: string; body: string };
type HowData = { kicker: string; title: string; sub: string; steps: Step[] };

export function HowItWorks() {
  const { t } = useT();
  const data = t("how", { returnObjects: true }) as HowData;
  return (
    <section className={styles.section} id="how">
      <div className="wrap">
        <div className={styles.head}>
          <div className={styles.kicker}>{data.kicker}</div>
          <h2 className={styles.title}>
            <Trans>{data.title}</Trans>
          </h2>
          <p className={styles.sub}>{data.sub}</p>
        </div>
        <div className={styles.panel}>
          {data.steps.map((s, i) => (
            <div className={styles.step} key={i}>
              <div className={styles.label}>
                <span>{s.label}</span>
                <span className={styles.labelLine} />
              </div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.body}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
