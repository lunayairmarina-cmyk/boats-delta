"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./VideoSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface AdminVideo {
    _id: string;
    filename: string;
    metadata?: {
        title?: string;
        description?: string;
        poster?: string;
        section?: string;
        cloudinaryUrl?: string;
    };
}

export default function VideoSection() {
    const { t, dir, language } = useLanguage();

    // Separate state for AR and EN videos
    const [arVideo, setArVideo] = useState<{ video: AdminVideo, url: string } | null>(null);
    const [enVideo, setEnVideo] = useState<{ video: AdminVideo, url: string } | null>(null);

    // We treat the "active" video as the one matching current language, 
    // or fallback to EN if AR is missing, or whatever is available.
    // However, to solve the "reload" issue, we try to keep specific videos loaded.

    const [arReady, setArReady] = useState(false);
    const [enReady, setEnReady] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Refs to access video elements for control
    const arVideoRef = useRef<HTMLVideoElement>(null);
    const enVideoRef = useRef<HTMLVideoElement>(null);

    const resolve = (key: string, fallback: string) => {
        const val = t(key);
        if (!val || val === key || val.trim().toLowerCase() === key.toLowerCase()) {
            return fallback;
        }
        return val;
    };

    const fetchVideoBySlug = async (slugs: string[]) => {
        for (const slug of slugs) {
            try {
                const response = await fetch(`/api/videos?slug=${slug}`, { cache: "no-store" });
                if (response.ok) {
                    const videos: AdminVideo[] = await response.json();
                    if (Array.isArray(videos) && videos.length > 0) {
                        const v = videos[0];
                        const url = v.metadata?.cloudinaryUrl || `/api/videos/${v._id}`;
                        return { video: v, url };
                    }
                }
            } catch (e) {
                console.error(`Failed to fetch video slug ${slug}`, e);
            }
        }
        return null;
    };

    useEffect(() => {
        const initVideos = async () => {
            // Fetch AR preferred
            const arData = await fetchVideoBySlug(["homepage-video-ar"]);
            // Fetch EN preferred (fallback to generic 'homepage-video')
            const enData = await fetchVideoBySlug(["homepage-video-en", "homepage-video"]);

            setArVideo(arData);
            setEnVideo(enData);

            // If neither exists, error
            if (!arData && !enData) {
                setHasError(true);
            }
        };

        initVideos();
    }, []);

    // Pause the video that is being hidden
    useEffect(() => {
        if (language === 'ar' && arVideo) {
            // We are showing AR, so pause EN
            if (enVideoRef.current && !enVideoRef.current.paused) {
                enVideoRef.current.pause();
            }
        } else {
            // We are showing EN (or AR fallback not available), so pause AR
            if (arVideoRef.current && !arVideoRef.current.paused) {
                arVideoRef.current.pause();
            }
        }
    }, [language, arVideo, enVideo]);

    // Determine current active video data for TEXT/METADATA purposes
    // If language is AR and we have AR video, use AR. Else use EN.
    const activeVideoData = (language === 'ar' && arVideo) ? arVideo : (enVideo || arVideo);
    const activeVideo = activeVideoData?.video;

    const heading = resolve("video.title", activeVideo?.metadata?.title || "Experience the Journey");
    const description = resolve(
        "video.description",
        activeVideo?.metadata?.description ||
        "Step on board and preview the level of service, craftsmanship, and attention to detail you can expect with our team."
    );
    const badgeText = resolve("video.badge", "Featured Video");
    const ctaPrimary = resolve("video.cta", "Discover More");
    const ctaSecondary = resolve("video.secondaryCta", "Talk to Us");
    const labelText = resolve("video.label", "Preview");
    const unavailableText = resolve("video.unavailable", "Video unavailable right now.");

    // Helper to render a video player
    const renderVideo = (
        data: { video: AdminVideo, url: string } | null,
        isReady: boolean,
        setReady: (b: boolean) => void,
        isHidden: boolean,
        ref: React.RefObject<HTMLVideoElement | null>
    ) => {
        if (!data) return null;

        return (
            <video
                ref={ref}
                className={`${styles.video} ${(!isReady || isHidden) ? styles.videoHidden : ''}`}
                controls
                playsInline
                preload="auto"
                poster={data.video?.metadata?.poster ? `/api/images/${data.video.metadata.poster}` : undefined}
                aria-label={heading}
                onCanPlay={() => setReady(true)}
                onError={() => setHasError(true)}
                // We use style display to truly hide it from layout but keep it in DOM
                style={{ display: isHidden ? 'none' : 'block' }}
            >
                <source src={data.url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    };

    // Derived state for overall readiness (for skeleton)
    // If we are waiting for the *active* video to be ready.
    const isCurrentReady = (language === 'ar' && arVideo) ? arReady : enReady;
    // If we don't have the preferred video, we might be showing the other one, check that readiness
    const effectivelyReady = (language === 'ar' && arVideo) ? arReady : (enVideo ? enReady : arReady);

    return (
        <section className={styles.videoSection} dir={dir}>
            <div className={styles.inner}>
                <div className={styles.copy}>
                    <p className={styles.badge}>{badgeText}</p>
                    <h2 className={styles.title}>{heading}</h2>
                    <p className={styles.subtitle}>{description}</p>
                    <div className={styles.actions}>
                        <Link href="/about" className={styles.primaryButton}>
                            {ctaPrimary}
                        </Link>
                        <Link href="/contact" className={styles.secondaryButton}>
                            {ctaSecondary}
                        </Link>
                    </div>
                </div>

                <div className={styles.videoCard}>
                    <div className={styles.videoHeader}>
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                        <span className={styles.label}>{labelText}</span>
                    </div>

                    <div className={styles.videoFrame}>
                        {/* Show skeleton if the ACTIVE video isn't ready and we don't have an error */}
                        {!effectivelyReady && !hasError && (
                            <div className={styles.skeleton} aria-hidden="true" />
                        )}

                        {/* AR Video Player */}
                        {renderVideo(
                            arVideo,
                            arReady,
                            setArReady,
                            language !== 'ar', // Hidden if not AR
                            arVideoRef
                        )}

                        {/* EN Video Player */}
                        {renderVideo(
                            enVideo,
                            enReady,
                            setEnReady,
                            language === 'ar' && !!arVideo, // Hidden if AR and we have AR video
                            enVideoRef
                        )}

                        {/* Show fallback on error */}
                        {hasError && !arVideo && !enVideo && (
                            <div className={styles.fallback}>
                                <p>{unavailableText}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
























