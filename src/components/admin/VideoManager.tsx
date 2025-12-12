"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './VideoManager.module.css';
import { useLanguage } from '@/context/LanguageContext';

interface GridFSFile {
    _id: string;
    filename: string;
    uploadDate: string;
    metadata?: {
        category?: string;
        section?: string;
        slug?: string;
        order?: number;
        language?: string;
        poster?: string; // Image ID for thumbnail
    };
}

type VideoVariant = {
    key: 'en' | 'ar';
    slug: string;
    language: string;
    label: string;
    fallbackSlugs?: string[];
};

const VIDEO_VARIANTS: VideoVariant[] = [
    {
        key: 'en',
        slug: 'homepage-video-en',
        language: 'en',
        label: 'Homepage Video (English)',
        fallbackSlugs: ['homepage-video'], // backward compatibility for existing uploads
    },
    {
        key: 'ar',
        slug: 'homepage-video-ar',
        language: 'ar',
        label: 'فيديو الصفحة الرئيسية (عربي)',
    },
];

export default function VideoManager() {
    const { language, dir } = useLanguage();
    const [videos, setVideos] = useState<GridFSFile[]>([]);
    const [videosBySlug, setVideosBySlug] = useState<Record<string, GridFSFile | null>>({});
    const [replacing, setReplacing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [replacingVideoId, setReplacingVideoId] = useState<string | null>(null);
    const [selectedVariantSlug, setSelectedVariantSlug] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploadingThumbnail, setUploadingThumbnail] = useState<string | null>(null);

    const copy = language === 'ar'
        ? {
            title: 'إدارة الفيديو',
            description: 'إدارة فيديو الصفحة الرئيسية لكل لغة (إنجليزي / عربي)',
            homepageVideoEn: 'فيديو الصفحة الرئيسية (إنجليزي)',
            homepageVideoAr: 'فيديو الصفحة الرئيسية (عربي)',
            selectVideo: 'اختر فيديو للاستبدال',
            replaceVideo: 'استبدال الفيديو',
            replacing: 'جاري الاستبدال…',
            uploadVideo: 'رفع فيديو جديد',
            uploading: 'جاري الرفع…',
            videosInSection: 'الفيديو في هذا القسم',
            noVideo: 'لا يوجد فيديو في هذا القسم بعد',
            updateNote: 'يمكنك رفع فيديو مخصص لكل لغة. في حال لم تقم برفع فيديو عربي سيستخدم الفيديو الإنجليزي كبديل.',
            thumbnail: 'صورة مصغرة (اختياري)',
            thumbnailDesc: 'صورة تظهر أثناء تحميل الفيديو',
            uploadThumbnail: 'رفع صورة مصغرة',
            removeThumbnail: 'إزالة الصورة',
            savingThumbnail: 'جاري الحفظ…',
        }
        : {
            title: 'Video Management',
            description: 'Manage homepage videos per language (English / Arabic)',
            homepageVideoEn: 'Homepage Video (English)',
            homepageVideoAr: 'Homepage Video (Arabic)',
            selectVideo: 'Select Video to Replace',
            replaceVideo: 'Replace Video',
            replacing: 'Replacing…',
            uploadVideo: 'Upload New Video',
            uploading: 'Uploading…',
            videosInSection: 'Video in this section',
            noVideo: 'No video in this section yet',
            updateNote: 'You can upload a dedicated video for each language. If Arabic is missing, the English video will be used as fallback.',
            thumbnail: 'Thumbnail (Optional)',
            thumbnailDesc: 'Image shown while video is loading',
            uploadThumbnail: 'Upload Thumbnail',
            removeThumbnail: 'Remove Thumbnail',
            savingThumbnail: 'Saving…',
        };

    const fetchVideos = useCallback(async () => {
        const res = await fetch(`/api/admin/videos?section=homepage-video`);
        if (res.ok) {
            const data = await res.json();
            setVideos(data);

            const lookup: Record<string, GridFSFile | null> = {};
            VIDEO_VARIANTS.forEach((variant) => {
                const match = data.find((file: GridFSFile) => {
                    const slug = file.metadata?.slug;
                    return slug === variant.slug || variant.fallbackSlugs?.includes(slug ?? '');
                });
                lookup[variant.slug] = match || null;
            });
            setVideosBySlug(lookup);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, variantSlug: string, videoId?: string) => {
        if (!e.target.files?.[0]) {
            setSelectedFile(null);
            setReplacingVideoId(null);
            setSelectedVariantSlug(null);
            return;
        }
        setSelectedFile(e.target.files[0]);
        setReplacingVideoId(videoId || null);
        setSelectedVariantSlug(variantSlug);
    };

    const handleReplace = async (videoId: string, variant: VideoVariant) => {
        if (!selectedFile || replacingVideoId !== videoId || selectedVariantSlug !== variant.slug) return;
        setReplacing(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch(`/api/admin/videos/${videoId}`, {
                method: 'PUT',
                body: formData,
            });
            if (res.ok) {
                setSelectedFile(null);
                setReplacingVideoId(null);
                await fetchVideos();
                const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
                fileInputs.forEach(input => input.value = '');
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to replace video');
            }
        } catch (error) {
            console.error('Replace failed', error);
            alert('Failed to replace video');
        } finally {
            setReplacing(false);
        }
    };

    const handleUpload = async (variant: VideoVariant) => {
        if (!selectedFile || selectedVariantSlug !== variant.slug) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('section', 'homepage-video');
        formData.append('category', 'homepage');
        formData.append('slug', variant.slug);
        formData.append('language', variant.language);

        try {
            const res = await fetch('/api/admin/videos', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setSelectedFile(null);
                setReplacingVideoId(null);
                await fetchVideos();
                const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
                fileInputs.forEach(input => input.value = '');
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to upload video');
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    const handleThumbnailUpload = async (videoId: string) => {
        if (!thumbnailFile) return;
        setUploadingThumbnail(videoId);

        try {
            // First upload the image
            const imageFormData = new FormData();
            imageFormData.append('file', thumbnailFile);
            imageFormData.append('section', 'video-thumbnails');
            imageFormData.append('category', 'videos');

            const uploadRes = await fetch('/api/admin/upload-image', {
                method: 'POST',
                body: imageFormData,
            });

            if (!uploadRes.ok) {
                throw new Error('Failed to upload thumbnail image');
            }

            const { fileId } = await uploadRes.json();

            // Now update the video metadata with the poster
            const updateRes = await fetch(`/api/admin/videos/${videoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ poster: fileId }),
            });

            if (updateRes.ok) {
                setThumbnailFile(null);
                await fetchVideos();
            } else {
                throw new Error('Failed to update video with thumbnail');
            }
        } catch (error) {
            console.error('Thumbnail upload failed', error);
            alert('Failed to upload thumbnail');
        } finally {
            setUploadingThumbnail(null);
        }
    };

    const handleRemoveThumbnail = async (videoId: string) => {
        setUploadingThumbnail(videoId);
        try {
            const updateRes = await fetch(`/api/admin/videos/${videoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ poster: null }),
            });

            if (updateRes.ok) {
                await fetchVideos();
            } else {
                throw new Error('Failed to remove thumbnail');
            }
        } catch (error) {
            console.error('Remove thumbnail failed', error);
            alert('Failed to remove thumbnail');
        } finally {
            setUploadingThumbnail(null);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    const renderVariantCard = (variant: VideoVariant, label: string) => {
        const currentVideo = videosBySlug[variant.slug];
        const isSelectedVariant = selectedVariantSlug === variant.slug;
        const hasPendingReplace = replacingVideoId && isSelectedVariant;

        return (
            <div className={styles.videoList} key={variant.slug}>
                <div className={styles.sectionSelector}>
                    <label className={styles.label}>{label}</label>
                    <p className={styles.updateNote}>{copy.updateNote}</p>
                </div>

                <div className={styles.listHeader}>
                    <h4 className={styles.panelTitle}>{copy.videosInSection}</h4>
                </div>

                {!currentVideo && (
                    <div className={styles.emptyState}>
                        <p>{copy.noVideo}</p>
                        <div className={styles.uploadGroup}>
                            <input
                                type="file"
                                id={`video-upload-${variant.slug}`}
                                className={styles.hiddenInput}
                                onChange={(e) => handleFileSelect(e, variant.slug)}
                                accept="video/*"
                            />
                            <label htmlFor={`video-upload-${variant.slug}`} className={styles.uploadLabel}>
                                {copy.uploadVideo}
                            </label>
                            {selectedFile && isSelectedVariant && !replacingVideoId && (
                                <button
                                    type="button"
                                    onClick={() => handleUpload(variant)}
                                    className={styles.uploadButton}
                                    disabled={uploading}
                                >
                                    {uploading ? copy.uploading : copy.uploadVideo}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {currentVideo && (
                    <div className={styles.videoCard}>
                        <div className={styles.videoPreview}>
                            <video
                                src={`/api/videos/${currentVideo._id}`}
                                controls
                                className={styles.videoThumbnail}
                                preload="auto"
                                poster={currentVideo.metadata?.poster ? `/api/images/${currentVideo.metadata.poster}` : undefined}
                            />
                        </div>
                        <div className={styles.videoInfo}>
                            <p className={styles.videoName}>{currentVideo.filename}</p>
                            <p className={styles.videoDate}>{formatDate(currentVideo.uploadDate)}</p>
                        </div>

                        {/* Thumbnail Section */}
                        <div className={styles.thumbnailSection}>
                            <label className={styles.thumbnailLabel}>{copy.thumbnail}</label>
                            <p className={styles.thumbnailDesc}>{copy.thumbnailDesc}</p>

                            {currentVideo.metadata?.poster ? (
                                <div className={styles.thumbnailPreview}>
                                    <Image
                                        src={`/api/images/${currentVideo.metadata.poster}`}
                                        alt="Video thumbnail"
                                        width={120}
                                        height={68}
                                        className={styles.thumbnailImage}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveThumbnail(currentVideo._id)}
                                        className={styles.removeThumbnailBtn}
                                        disabled={uploadingThumbnail === currentVideo._id}
                                    >
                                        {uploadingThumbnail === currentVideo._id ? copy.savingThumbnail : copy.removeThumbnail}
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.thumbnailUpload}>
                                    <input
                                        type="file"
                                        id={`thumbnail-${variant.slug}`}
                                        className={styles.hiddenInput}
                                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                                        accept="image/*"
                                    />
                                    <label htmlFor={`thumbnail-${variant.slug}`} className={styles.uploadLabel}>
                                        {copy.uploadThumbnail}
                                    </label>
                                    {thumbnailFile && (
                                        <button
                                            type="button"
                                            onClick={() => handleThumbnailUpload(currentVideo._id)}
                                            className={styles.uploadButton}
                                            disabled={uploadingThumbnail === currentVideo._id}
                                        >
                                            {uploadingThumbnail === currentVideo._id ? copy.savingThumbnail : copy.uploadThumbnail}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.videoActions}>
                            <div className={styles.replaceGroup}>
                                <input
                                    type="file"
                                    id={`file-replace-${variant.slug}`}
                                    className={styles.hiddenInput}
                                    onChange={(e) => handleFileSelect(e, variant.slug, currentVideo._id)}
                                    accept="video/*"
                                />
                                <label htmlFor={`file-replace-${variant.slug}`} className={styles.replaceLabel}>
                                    {copy.selectVideo}
                                </label>
                                {hasPendingReplace && selectedFile && (
                                    <button
                                        type="button"
                                        onClick={() => handleReplace(currentVideo._id, variant)}
                                        className={styles.replaceButton}
                                        disabled={replacing}
                                    >
                                        {replacing ? copy.replacing : copy.replaceVideo}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.container} dir={dir} data-dir={dir}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>{copy.title}</h3>
                    <p className={styles.subtitle}>{copy.description}</p>
                </div>
            </div>

            <div className={styles.content}>
                {VIDEO_VARIANTS.map((variant) =>
                    renderVariantCard(
                        variant,
                        variant.key === 'en'
                            ? copy.homepageVideoEn
                            : copy.homepageVideoAr,
                    ),
                )}
            </div>
        </div>
    );
}
































