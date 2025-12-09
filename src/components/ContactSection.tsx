"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import styles from "./ContactSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import {
  getMailHref,
  getPhoneHref,
  handlePhoneIntent,
  CONTACT_PHONE_DISPLAY,
  CONTACT_EMAIL,
} from "@/lib/contactInfo";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate form submission
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const phoneHref = getPhoneHref();
  const mailHref = getMailHref();
  const address = language === "ar" 
    ? "برج المرجان، طريق الأمير سلطان، حي الروضة، جدة"
    : "Al Murjan Tower, Prince Sultan Road, Al Rawdah District, Jeddah, Saudi Arabia";

  return (
    <section id="contact-form" className={styles.contactSection}>
      <div className={styles.contactInner}>
        <div className={styles.contactHeader}>
          <p className={styles.contactLabel}>{t('contact.title')}</p>
          <h2>{t('contact.title')}</h2>
          <p className={styles.contactSubtitle}>{t('contact.subtitle')}</p>
        </div>

        <div className={styles.contactContent}>
          {/* Visual + Contact Form */}
          <div className={styles.visualColumn}>
            <div className={styles.contactImage}>
              <Image
                src="/api/images/slug/contact-hero"
                alt={language === "ar" ? "اليخت في البحر مع طاقم الضيافة" : "Luxury yacht concierge preparing for guests"}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 540px"
                className={styles.contactImageMedia}
              />
            </div>

            <div className={styles.formWrapper}>
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formFields}>
                  <div className={styles.field}>
                    <label htmlFor="name">
                      <span className={styles.fieldLabel}>
                        {t('contact.first_name')}
                      </span>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('contact.placeholders.firstName')}
                        required
                        disabled={status === "submitting"}
                        aria-required="true"
                      />
                    </label>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email">
                      <span className={styles.fieldLabel}>
                        {t('contact.email')}
                      </span>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t('contact.placeholders.email')}
                        required
                        disabled={status === "submitting"}
                        aria-required="true"
                      />
                    </label>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="message">
                      <span className={styles.fieldLabel}>
                        {t('contact.interest')}
                      </span>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.placeholders.interest')}
                        rows={6}
                        required
                        disabled={status === "submitting"}
                        aria-required="true"
                      />
                    </label>
                  </div>
                </div>

                {/* Status Messages */}
                {status === "success" && (
                  <div className={styles.statusMessage} role="alert" aria-live="polite">
                    <svg
                      className={styles.statusIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>
                      {language === "ar"
                        ? "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً."
                        : "Message sent successfully! We'll get back to you soon."}
                    </span>
                  </div>
                )}

                {status === "error" && (
                  <div
                    className={`${styles.statusMessage} ${styles.statusError}`}
                    role="alert"
                    aria-live="assertive"
                  >
                    <svg
                      className={styles.statusIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <span>
                      {language === "ar"
                        ? "حدث خطأ. يرجى المحاولة مرة أخرى."
                        : "Something went wrong. Please try again."}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.contactSubmit}
                  disabled={status === "submitting" || status === "success"}
                  aria-busy={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      <span>
                        {language === "ar" ? "جاري الإرسال..." : "Sending..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{t('contact.send')}</span>
                      <span className={styles.submitArrow} aria-hidden="true">
                        ➝
                      </span>
                    </>
                  )}
                </button>

                <p className={styles.contactNote}>
                  <span className={styles.noteIcon} aria-hidden="true">
                    ⏱
                  </span>
                  {t('contact.note')}
                </p>
              </form>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className={styles.infoCard}>
            <div className={styles.infoCardContent}>
              <h3 className={styles.infoCardTitle}>
                {language === "ar" ? "معلومات التواصل" : "Get in Touch"}
              </h3>
              <p className={styles.infoCardDescription}>
                {language === "ar"
                  ? "نحن هنا لمساعدتك. تواصل معنا عبر أي من القنوات التالية."
                  : "We're here to help. Reach out through any of the channels below."}
              </p>

              <div className={styles.infoItems}>
                <a
                  href={phoneHref}
                  onClick={(e) => handlePhoneIntent(e)}
                  className={styles.infoItem}
                  aria-label={`${language === "ar" ? "اتصل بنا" : "Call us"}: ${CONTACT_PHONE_DISPLAY}`}
                >
                  <div className={styles.infoIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>
                      {language === "ar" ? "الهاتف" : "Phone"}
                    </span>
                    <span className={styles.infoValue}>{CONTACT_PHONE_DISPLAY}</span>
                  </div>
                </a>

                <a
                  href={mailHref}
                  className={styles.infoItem}
                  aria-label={`${language === "ar" ? "أرسل بريد إلكتروني" : "Send email"}: ${CONTACT_EMAIL}`}
                >
                  <div className={styles.infoIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>
                      {language === "ar" ? "البريد الإلكتروني" : "Email"}
                    </span>
                    <span className={styles.infoValue}>{CONTACT_EMAIL}</span>
                  </div>
                </a>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>
                      {language === "ar" ? "العنوان" : "Address"}
                    </span>
                    <span className={styles.infoValue}>{address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
