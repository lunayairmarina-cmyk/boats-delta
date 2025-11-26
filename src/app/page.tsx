"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [heroBgImage, setHeroBgImage] = useState("/api/images/slug/ocean-sunrise");

  // Fetch the latest image URL with cache busting
  useEffect(() => {
    const updateHeroImage = async () => {
      try {
        const response = await fetch("/api/images/slug/ocean-sunrise", { 
          method: 'HEAD',
          cache: 'no-store' 
        });
        if (response.ok) {
          const lastModified = response.headers.get('Last-Modified');
          const timestamp = lastModified ? new Date(lastModified).getTime() : Date.now();
          setHeroBgImage(`/api/images/slug/ocean-sunrise?v=${timestamp}`);
        }
      } catch (error) {
        console.error('Failed to fetch hero image:', error);
      }
    };
    updateHeroImage();
  }, []);

  return (
    <main className={styles.page}>
      <div 
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(145deg, rgba(1, 6, 18, 0.85), rgba(9, 30, 58, 0.55)), url(${heroBgImage})`,
        }}
      >


        <section className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('hero.subtitle')}</h1>
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
        showHeader={false}
      />

      <CommitmentShowcase />
      <TestimonialsSection />
      <ContactSection />
      <FaqSection />
    </main>
  );
}
