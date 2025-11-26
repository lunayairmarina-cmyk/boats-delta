import Link from "next/link";
import styles from "./FaqSection.module.css";
import { useLanguage } from "@/context/LanguageContext";

const faqKeys = [
  { id: "1", questionKey: "faq.items.1.question", answerKey: "faq.items.1.answer" },
  { id: "2", questionKey: "faq.items.2.question", answerKey: "faq.items.2.answer" },
  { id: "3", questionKey: "faq.items.3.question", answerKey: "faq.items.3.answer" },
  { id: "4", questionKey: "faq.items.4.question", answerKey: "faq.items.4.answer" },
  { id: "5", questionKey: "faq.items.5.question", answerKey: "faq.items.5.answer" },
];

export default function FaqSection() {
  const { t } = useLanguage();

  return (
    <section id="faq" className={styles.faqSection}>
      <div className={styles.faqInner}>
        <div className={styles.faqHeader}>
          <p className={styles.faqLabel}>{t("faq.label")}</p>
          <h2>{t("faq.title")}</h2>
          <p>{t("faq.description")}</p>
        </div>

        <div className={styles.faqBody}>
          <div className={styles.faqCta}>
            <Link href="/contact" className={styles.faqContactBtn}>
              {t("faq.cta")}
            </Link>
          </div>

          <div className={styles.faqListWrapper}>
            {faqKeys.map((faq) => (
              <details key={faq.id} className={styles.faqItem}>
                <summary>
                  <span className={styles.faqIndex}>{faq.id}</span>
                  <span className={styles.faqQuestion}>{t(faq.questionKey)}</span>
                  <span className={styles.faqIcon} aria-hidden="true">
                    ⌄
                  </span>
                </summary>
                <p className={styles.faqAnswer}>{t(faq.answerKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

