"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./VideoSection.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function VideoSection() {
    const { t, dir } = useLanguage();
    const [videoId, setVideoId] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch("/api/videos?section=homepage-video", {
                    cache: 'no-store',
                });
                if (response.ok) {
                    const videos = await response.json();
                    if (Array.isArray(videos) && videos.length > 0) {
                        const video = videos[0];
                        setVideoId(video._id);
                        setVideoUrl(`/api/videos/${video._id}`);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch video:', error);
            }
        };

        fetchVideo();
    }, []);

    if (!videoUrl) {
        return null;
    }

    return (
        <section className={styles.videoSection} dir={dir}>
            <div className={styles.videoContainer}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={t('video.title') || 'Company video'}
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </section>
    );
}



















