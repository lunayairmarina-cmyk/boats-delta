"use client";

import Image from "next/image";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommitmentShowcase from "@/components/CommitmentShowcase";
import RelationshipSection from "@/components/RelationshipSection";
import ServicesList from "@/components/ServicesList";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";


const partnerLogos = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  label: "Logoipsum",
}));

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className={styles.page}>
      <div className={styles.hero}>


        <section className={styles.heroContent}>
          <p className={styles.eyeBrow}>{t('companyName')}</p>
          <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
          <p className={styles.heroCopy}>
            {t('hero.description')}
          </p>
          <div className={styles.heroActions}>
            <Link href="/contact" className={styles.primaryBtn}>
              {t('hero.cta_connect')} <span aria-hidden="true">➝</span>
            </Link>
            <Link href="/contact" className={styles.outlineBtn}>
              {t('hero.cta_know_more')}
            </Link>
          </div>
        </section>
      </div>

      <section className={styles.experienceSection}>
        <div className={styles.experienceCard}>
          <article className={styles.arabicCopy}>
            <p className={styles.arabicTitle}>{t('about.title')}</p>
            <p>
              {t('about.description')}
            </p>
          </article>

          <div className={styles.cardMedia}>
            <Image
              src="/api/images/slug/ocean-sunrise"
              alt="Luxury yacht seating overlooking the sea"
              width={600}
              height={800}
              className={styles.cardImage}
              priority={false}
            />
          </div>

          <div className={styles.logoStack}>
            <Image
              src="/LM Logo.svg"
              alt="Lunier Marina Logo"
              width={120}
              height={48}
              className={styles.logoImage}
            />
          </div>
        </div>

        <div className={styles.logosRow}>
          {partnerLogos.map((logo) => (
            <span key={logo.id}>{logo.label}</span>
          ))}
        </div>
        <p className={styles.trustCopy}>
          {t('partnerships.subtitle')}
        </p>
      </section>

      <RelationshipSection />

      <ServicesList
        badge={t('services.title')}
        title={t('services.management_title')}
        subtitle={t('services.management_desc')}
      />

      <CommitmentShowcase />
      <TestimonialsSection />
      <ContactSection />
      <FaqSection />
    </main>
  );
}
