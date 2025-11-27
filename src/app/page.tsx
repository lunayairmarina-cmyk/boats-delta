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
import YachtAppSection from "@/components/YachtAppSection";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";


const partnerLogos = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  label: "Logoipsum",
}));

export default function Home() {
  const { t, language } = useLanguage();
  const [heroBgImages, setHeroBgImages] = useState<string[]>(["/api/images/slug/ocean-sunrise"]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardImageId, setCardImageId] = useState<string | null>(null);
  const [logoImageId, setLogoImageId] = useState<string | null>(null);

  // Preload hero background image for better LCP
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/api/images/slug/ocean-sunrise';
    link.fetchPriority = 'high';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Fetch the latest image URLs
  useEffect(() => {
    const updateImages = async () => {
      try {
        // Fetch hero banner images (hero-home section)
        const bannerResponse = await fetch("/api/admin/images?section=hero-home", {
          cache: 'no-store',
        });
        if (bannerResponse.ok) {
          const bannerImages = await bannerResponse.json();
          if (Array.isArray(bannerImages) && bannerImages.length > 0) {
            // Sort by order (API already sorts, but ensure it's correct)
            const sortedImages = bannerImages.sort((a: any, b: any) => {
              const orderA = a.metadata?.order || 0;
              const orderB = b.metadata?.order || 0;
              return orderA - orderB;
            });
            // Use all banner images in order
            const imageUrls = sortedImages
              .map((img: any) => img._id ? `/api/images/${img._id}` : null)
              .filter((url: string | null) => url !== null) as string[];
            if (imageUrls.length > 0) {
              setHeroBgImages(imageUrls);
            } else {
              // Fallback to ocean-sunrise if hero-home doesn't exist yet
              const fallbackResponse = await fetch("/api/admin/images?slug=ocean-sunrise", {
                cache: 'no-store',
              });
              if (fallbackResponse.ok) {
                const fallbackImages = await fallbackResponse.json();
                const fallbackImage = Array.isArray(fallbackImages) && fallbackImages.length > 0 ? fallbackImages[0] : null;
                if (fallbackImage?._id) {
                  setHeroBgImages([`/api/images/${fallbackImage._id}`]);
                }
              }
            }
          } else {
            // Fallback to ocean-sunrise if hero-home doesn't exist yet
            const fallbackResponse = await fetch("/api/admin/images?slug=ocean-sunrise", {
              cache: 'no-store',
            });
            if (fallbackResponse.ok) {
              const fallbackImages = await fallbackResponse.json();
              const fallbackImage = Array.isArray(fallbackImages) && fallbackImages.length > 0 ? fallbackImages[0] : null;
              if (fallbackImage?._id) {
                setHeroBgImages([`/api/images/${fallbackImage._id}`]);
              }
            }
          }
        }

        // Fetch experience section images (card image and logo)
        const experienceResponse = await fetch("/api/admin/images?section=experience-section", {
          cache: 'no-store',
        });
        if (experienceResponse.ok) {
          const experienceImages = await experienceResponse.json();
          // Find ocean-sunrise image for card (should be in experience-section)
          const cardImage = experienceImages.find((img: any) => 
            img.metadata?.slug === 'ocean-sunrise' || 
            (img.metadata?.section === 'experience-section' && !img.metadata?.slug?.includes('logo'))
          );
          if (cardImage?._id) {
            setCardImageId(cardImage._id);
          } else if (experienceImages.length > 0) {
            // Fallback: use first non-logo image if ocean-sunrise not found
            const nonLogoImage = experienceImages.find((img: any) => 
              !img.metadata?.slug?.includes('logo') && !img.filename?.toLowerCase().includes('logo')
            );
            if (nonLogoImage?._id) {
              setCardImageId(nonLogoImage._id);
            }
          }
          // Find logo image
          const logoImage = experienceImages.find((img: any) => 
            img.metadata?.slug === 'lm-logo' || 
            img.filename?.toLowerCase().includes('logo')
          );
          if (logoImage?._id) {
            setLogoImageId(logoImage._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };
    updateImages();
    
    // Re-fetch every 30 seconds to check for updates
    const interval = setInterval(updateImages, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (heroBgImages.length <= 1) return;
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBgImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [heroBgImages.length]);

  return (
    <main className={styles.page}>
      <div className={styles.hero} data-animate-on-load>
        <div className={styles.heroSlider}>
          {heroBgImages.map((imageUrl, index) => (
            <div
              key={index}
              className={`${styles.heroSlide} ${index === currentSlide ? styles.active : ''}`}
              style={{
                backgroundImage: `linear-gradient(145deg, rgba(1, 6, 18, 0.85), rgba(9, 30, 58, 0.55)), url(${imageUrl})`,
              }}
            />
          ))}
        </div>
        {heroBgImages.length > 1 && (
          <div className={styles.sliderIndicators}>
            {heroBgImages.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        <section className={styles.heroContent}>
          <span className={styles.heroBrand}>{t('hero.brand')}</span>
          <h1 className={styles.heroTitle}>{t('hero.subtitle')}</h1>
          <p
            className={`${styles.heroCopy} ${
              language === 'en' ? styles.heroCopyEnglish : ''
            }`}
          >
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

      <section className={styles.experienceSection} data-animate-on-scroll>
        <div className={styles.experienceCard}>
          <article className={styles.arabicCopy}>
            <p className={styles.arabicTitle}>{t('about.title')}</p>
            <p>
              {t('about.description')}
            </p>
          </article>

          <div className={styles.cardMedia}>
            <Image
              src={cardImageId ? `/api/images/${cardImageId}` : "/api/images/slug/ocean-sunrise"}
              alt="Luxury yacht seating overlooking the sea"
              width={300}
              height={400}
              className={styles.cardImage}
              sizes="(max-width: 768px) 100vw, 300px"
              loading="lazy"
            />
          </div>

          <div className={styles.logoStack}>
            <Image
              src={logoImageId ? `/api/images/${logoImageId}` : "/LM Logo.svg"}
              alt="Lunier Marina Logo"
              width={120}
              height={48}
              className={styles.logoImage}
              sizes="120px"
              loading="lazy"
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

      <YachtAppSection />
      <CommitmentShowcase />
      <TestimonialsSection />
      <ContactSection />
      <FaqSection />
    </main>
  );
}
