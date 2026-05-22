import { useT } from "~/i18n/useT";
import { Trans } from "~/i18n/Trans";
import styles from "./WhyMiia.module.css";

type WhyCard = { numeral: string; title: string; body: string };
type WhyData = { kicker: string; title: string; sub: string; cards: WhyCard[] };

export function WhyMiia() {
  const { t } = useT();
  const data = t("why", { returnObjects: true }) as WhyData;
  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.head}>
          <div className={styles.kicker}>{data.kicker}</div>
          <h2 className={styles.title}>
            <Trans>{data.title}</Trans>
          </h2>
          <p className={styles.sub}>{data.sub}</p>
        </div>
        <div className={styles.grid}>
          {data.cards.map((card, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.numeral}>{card.numeral}</div>
              <h3 className={styles.cardTitle}>
                <Trans>{card.title}</Trans>
              </h3>
              <p className={styles.body}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
