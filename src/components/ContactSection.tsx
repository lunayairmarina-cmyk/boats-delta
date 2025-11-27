"use client";

import styles from "./ContactSection.module.css";
import { useLanguage } from "@/context/LanguageContext";

const countryCodes = ["+1", "+33", "+44", "+971", "+966"];

export default function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact-form" className={styles.contactSection}>
      <div className={styles.contactInner}>
        <div className={styles.contactHeader}>
          <p className={styles.contactLabel}>{t('contact.title')}</p>
          <h2>{t('contact.title')}</h2>
          <p>{t('contact.subtitle')}</p>
        </div>

        <form className={styles.contactForm}>
          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>{t('contact.first_name')}</span>
              <input
                type="text"
                name="firstName"
                placeholder={t('contact.placeholders.firstName')}
              />
            </label>

            <label className={styles.field}>
              <span>{t('contact.last_name')}</span>
              <input
                type="text"
                name="lastName"
                placeholder={t('contact.placeholders.lastName')}
              />
            </label>

            <label className={styles.field}>
              <span>{t('contact.email')}</span>
              <input
                type="email"
                name="email"
                placeholder={t('contact.placeholders.email')}
              />
            </label>

            <label className={styles.field}>
              <span>{t('contact.phone')}</span>
              <div className={styles.phoneField}>
                <span className={styles.flagBadge} aria-hidden="true">
                  🇺🇸
                </span>
                <select name="countryCode" aria-label="Country code">
                  {countryCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder={t('contact.placeholders.phone')}
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>{t('contact.company')}</span>
              <input
                type="text"
                name="company"
                placeholder={t('contact.placeholders.company')}
              />
            </label>

            <label className={styles.field}>
              <span>{t('contact.availability')}</span>
              <input type="date" name="availability" className={styles.dateInput} />
            </label>
          </div>

          <label className={styles.field}>
            <span>{t('contact.interest')}</span>
            <textarea
              name="interest"
              rows={4}
              placeholder={t('contact.placeholders.interest')}
            />
          </label>

          <button type="submit" className={styles.contactSubmit}>
            <span>{t('contact.send')}</span>
            <span className={styles.submitArrow} aria-hidden="true">
              ➝
            </span>
          </button>

          <p className={styles.contactNote}>
            <span className={styles.noteIcon} aria-hidden="true">
              ⏱
            </span>
            {t('contact.note')}
          </p>
        </form>
      </div>
    </section>
  );
}

