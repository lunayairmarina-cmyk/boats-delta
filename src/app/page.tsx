"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommitmentShowcase from "@/components/CommitmentShowcase";
import RelationshipSection from "@/components/RelationshipSection";
import ServicesList from "@/components/ServicesList";

import VideoSection from "@/components/VideoSection";
import styles from "./page.module.css";
import { useLanguage } from "@/context/LanguageContext";

interface HeroMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  order: number;
  poster?: string;
}

export default function Home() {
  const { t, language } = useLanguage();
  const [heroMedia, setHeroMedia] = useState<HeroMediaItem[]>([{ id: 'default', url: '/api/images/slug/ocean-sunrise', type: 'image', order: 0 }]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardImageId, setCardImageId] = useState<string | null>(null);
  const [logoImageId, setLogoImageId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Preload hero background image for better LCP
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/api/images/slug/ocean-sunrise';
    link.fetchPriority = 'high';
    document.head.appendChild(link);

    // Also preload the hero video for instant playback
    const videoLink = document.createElement('link');
    videoLink.rel = 'preload';
    videoLink.as = 'video';
    videoLink.href = '/لونيير%20.mp4';
    videoLink.fetchPriority = 'high';
    document.head.appendChild(videoLink);

    return () => {
      document.head.removeChild(link);
      if (document.head.contains(videoLink)) {
        document.head.removeChild(videoLink);
      }
    };
  }, []);

  // Fetch the latest media URLs (images and videos)
  useEffect(() => {
    const updateMedia = async () => {
      try {
        const mediaItems: HeroMediaItem[] = [];

        // Fetch hero banner images (hero-home section)
        const bannerResponse = await fetch("/api/admin/images?section=hero-home", {
          cache: 'no-store',
        });
        if (bannerResponse.ok) {
          const bannerImages = await bannerResponse.json();
          if (Array.isArray(bannerImages)) {
            bannerImages.forEach((img: { _id?: string; metadata?: { order?: number } }) => {
              if (img._id) {
                mediaItems.push({
                  id: img._id,
                  url: `/api/images/${img._id}`,
                  type: 'image',
                  order: img.metadata?.order || 0,
                });
              }
            });
          }
        }

        // Fetch hero banner videos (hero-home section)
        const videoResponse = await fetch("/api/admin/videos?section=hero-home", {
          cache: 'no-store',
        });
        if (videoResponse.ok) {
          const heroVideos = await videoResponse.json();
          if (Array.isArray(heroVideos)) {
            heroVideos.forEach((vid: { _id?: string; metadata?: { order?: number; slug?: string; poster?: string } }) => {
              if (vid._id) {
                const slug = vid.metadata?.slug;
                mediaItems.push({
                  id: vid._id,
                  url: `/api/videos/${vid._id}`,
                  type: 'video',
                  order: slug === 'hero-lonier-video' ? -1000 : (vid.metadata?.order || 0),
                  poster: vid.metadata?.poster ? `/api/images/${vid.metadata.poster}` : undefined,
                });
              }
            });
          }
        }

        // If the priority hero video is missing from the API, add a static fallback
        const hasPriorityHero = mediaItems.some(
          (item) => item.type === 'video' && item.order === -1000
        );
        if (!hasPriorityHero) {
          mediaItems.unshift({
            id: 'hero-lonier-video-static',
            url: `/لونيير%20.mp4`,
            type: 'video',
            order: -1000,
          });
        }

        // Sort by order
        mediaItems.sort((a, b) => a.order - b.order);

        if (mediaItems.length > 0) {
          setHeroMedia(mediaItems);
        } else {
          // Fallback to ocean-sunrise if no hero media exists
          const fallbackResponse = await fetch("/api/admin/images?slug=ocean-sunrise", {
            cache: 'no-store',
          });
          if (fallbackResponse.ok) {
            const fallbackImages = await fallbackResponse.json();
            const fallbackImage = Array.isArray(fallbackImages) && fallbackImages.length > 0 ? fallbackImages[0] : null;
            if (fallbackImage?._id) {
              setHeroMedia([{
                id: fallbackImage._id,
                url: `/api/images/${fallbackImage._id}`,
                type: 'image',
                order: 0,
              }]);
            }
          }
        }

        // Fetch experience section images (card image and logo)
        const experienceResponse = await fetch("/api/admin/images?section=experience-section", {
          cache: 'no-store',
        });
        if (experienceResponse.ok) {
          const experienceImages = await experienceResponse.json();
          const cardImage = experienceImages.find((img: { metadata?: { slug?: string; section?: string } }) =>
            img.metadata?.slug === 'ocean-sunrise' ||
            (img.metadata?.section === 'experience-section' && !img.metadata?.slug?.includes('logo'))
          );
          if (cardImage?._id) {
            setCardImageId(cardImage._id);
          } else if (experienceImages.length > 0) {
            const nonLogoImage = experienceImages.find((img: { metadata?: { slug?: string }; filename?: string }) =>
              !img.metadata?.slug?.includes('logo') && !img.filename?.toLowerCase().includes('logo')
            );
            if (nonLogoImage?._id) {
              setCardImageId(nonLogoImage._id);
            }
          }
          const logoImage = experienceImages.find((img: { metadata?: { slug?: string }; filename?: string }) =>
            img.metadata?.slug === 'lm-logo' ||
            img.filename?.toLowerCase().includes('logo')
          );
          if (logoImage?._id) {
            setLogoImageId(logoImage._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch media:', error);
      }
    };
    updateMedia();

    // Re-fetch every 30 seconds to check for updates
    const interval = setInterval(updateMedia, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle video playback when slide changes
  const handleSlideChange = useCallback((newIndex: number) => {
    // Pause all videos
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Play video if current slide is a video
    const currentMedia = heroMedia[newIndex];
    if (currentMedia?.type === 'video') {
      const videoEl = videoRefs.current[currentMedia.id];
      if (videoEl) {
        videoEl.play().catch(() => {
          // Autoplay may be blocked, that's okay
        });
      }
    }

    setCurrentSlide(newIndex);
  }, [heroMedia]);

  // Ensure the first slide (especially hero video) starts playing once media is ready
  useEffect(() => {
    if (heroMedia.length > 0) {
      handleSlideChange(0);
    }
  }, [heroMedia, handleSlideChange]);

  // Auto-rotate slides
  useEffect(() => {
    if (heroMedia.length <= 1) return;

    const currentMedia = heroMedia[currentSlide];

    // For videos, wait for them to end before changing
    if (currentMedia?.type === 'video') {
      const videoEl = videoRefs.current[currentMedia.id];
      if (videoEl) {
        const handleEnded = () => {
          handleSlideChange((currentSlide + 1) % heroMedia.length);
        };
        videoEl.addEventListener('ended', handleEnded);
        return () => videoEl.removeEventListener('ended', handleEnded);
      }
    }

    // For images, use timeout
    const slideInterval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % heroMedia.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [heroMedia, currentSlide, handleSlideChange]);

  return (
    <main className={styles.page}>
      <div className={styles.hero} data-animate-on-load>
        <div className={styles.heroSlider}>
          {heroMedia.map((media, index) => (
            <div
              key={media.id}
              className={`${styles.heroSlide} ${index === currentSlide ? styles.active : ''}`}
            >
              {media.type === 'video' ? (
                <video
                  ref={(el) => { videoRefs.current[media.id] = el; }}
                  className={styles.heroVideo}
                  src={media.url}
                  autoPlay
                  muted
                  playsInline
                  loop={false}
                  preload="auto"
                  poster={media.poster}
                  // @ts-expect-error fetchpriority is valid but not in React types yet
                  fetchpriority={index === 0 ? "high" : "auto"}
                  onLoadedData={(e) => {
                    // Start playing as soon as enough data is available
                    const video = e.currentTarget;
                    if (index === currentSlide) {
                      video.play().catch(() => { });
                    }
                  }}
                />
              ) : (
                <div
                  className={styles.heroImageBg}
                  style={{
                    backgroundImage: `linear-gradient(145deg, rgba(1, 6, 18, 0.85), rgba(9, 30, 58, 0.55)), url(${media.url})`,
                  }}
                />
              )}
              {media.type === 'video' && (
                <div className={styles.heroVideoOverlay} />
              )}
            </div>
          ))}
        </div>
        {heroMedia.length > 1 && (
          <div className={styles.sliderIndicators}>
            {heroMedia.map((media, index) => (
              <button
                key={media.id}
                className={`${styles.indicator} ${index === currentSlide ? styles.active : ''} ${media.type === 'video' ? styles.videoIndicator : ''}`}
                onClick={() => handleSlideChange(index)}
                aria-label={`Go to slide ${index + 1}${media.type === 'video' ? ' (video)' : ''}`}
              />
            ))}
          </div>
        )}
        <section className={styles.heroContent}>
          <span className={`${styles.heroBrand} ${language === 'ar' ? styles.heroBrandArabic : ''}`}>{t('hero.brand')}</span>
          <h1 className={styles.heroTitle}>{t('hero.subtitle')}</h1>
          <p
            className={`${styles.heroCopy} ${language === 'en' ? styles.heroCopyEnglish : ''
              }`}
          >
            {t('hero.description')}
          </p>
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
              width={600}
              height={240}
              className={styles.logoImage}
              sizes="600px"
              loading="lazy"
            />
          </div>
        </div>

        <p className={styles.trustCopy}>
          {t('partnerships.subtitle')}
        </p>
      </section>

      <VideoSection />

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
