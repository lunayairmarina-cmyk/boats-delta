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
    const [video, setVideo] = useState<AdminVideo | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoReady, setVideoReady] = useState(false);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const resolve = (key: string, fallback: string) => {
        const val = t(key);
        if (!val || val === key || val.trim().toLowerCase() === key.toLowerCase()) {
            return fallback;
        }
        return val;
    };

    // Handle video ready state
    const handleCanPlay = useCallback(() => {
        setVideoReady(true);
    }, []);

    const handleError = useCallback(() => {
        setHasError(true);
        setVideoReady(false);
    }, []);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const slugPreferences =
                    language === "ar"
                        ? ["homepage-video-ar", "homepage-video-en", "homepage-video"]
                        : ["homepage-video-en", "homepage-video"];

                let found = false;

                for (const slug of slugPreferences) {
                    const response = await fetch(`/api/videos?slug=${slug}`, {
                        cache: "no-store",
                    });
                    if (response.ok) {
                        const videos: AdminVideo[] = await response.json();
                        if (Array.isArray(videos) && videos.length > 0) {
                            const v = videos[0];
                            setVideo(v);

                            // Use Cloudinary URL if available, otherwise fallback to local stream
                            if (v.metadata?.cloudinaryUrl) {
                                setVideoUrl(v.metadata.cloudinaryUrl);
                            } else {
                                setVideoUrl(`/api/videos/${v._id}`);
                            }

                            setHasError(false);
                            found = true;
                            break;
                        }
                    }
                }

                if (!found) {
                    setVideo(null);
                    setVideoUrl(null);
                    setHasError(true);
                }
            } catch (error) {
                console.error("Failed to fetch video:", error);
                setVideo(null);
                setVideoUrl(null);
                setHasError(true);
            }
        };

        fetchVideo();
    }, [language]);

    const heading = resolve("video.title", video?.metadata?.title || "Experience the Journey");
    const description = resolve(
        "video.description",
        video?.metadata?.description ||
        "Step on board and preview the level of service, craftsmanship, and attention to detail you can expect with our team."
    );
    const badgeText = resolve("video.badge", "Featured Video");
    const ctaPrimary = resolve("video.cta", "Discover More");
    const ctaSecondary = resolve("video.secondaryCta", "Talk to Us");
    const labelText = resolve("video.label", "Preview");
    const unavailableText = resolve("video.unavailable", "Video unavailable right now.");

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
                        {/* Show skeleton while loading */}
                        {!videoReady && !hasError && (
                            <div className={styles.skeleton} aria-hidden="true" />
                        )}

                        {/* Always render video element if we have a URL - let browser buffer it */}
                        {videoUrl && !hasError && (
                            <video
                                ref={videoRef}
                                className={`${styles.video} ${!videoReady ? styles.videoHidden : ''}`}
                                controls
                                playsInline
                                preload="auto"
                                poster={video?.metadata?.poster ? `/api/images/${video.metadata.poster}` : undefined}
                                aria-label={heading}
                                onCanPlay={handleCanPlay}
                                onError={handleError}
                            >
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}

                        {/* Show fallback on error */}
                        {hasError && (
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
























