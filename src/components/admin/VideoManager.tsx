"use client";

import { useState, useEffect, useCallback } from 'react';
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
    };
}

export default function VideoManager() {
    const { language, dir } = useLanguage();
    const [videos, setVideos] = useState<GridFSFile[]>([]);
    const [replacing, setReplacing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [replacingVideoId, setReplacingVideoId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const copy = language === 'ar'
        ? {
            title: 'إدارة الفيديو',
            description: 'إدارة فيديو الصفحة الرئيسية (يمكن استبدال الفيديو فقط)',
            homepageVideo: 'فيديو الصفحة الرئيسية',
            selectVideo: 'اختر فيديو للاستبدال',
            replaceVideo: 'استبدال الفيديو',
            replacing: 'جاري الاستبدال…',
            uploadVideo: 'رفع فيديو جديد',
            uploading: 'جاري الرفع…',
            videosInSection: 'الفيديو في هذا القسم',
            noVideo: 'لا يوجد فيديو في هذا القسم بعد',
            updateNote: 'ملاحظة: يمكنك استبدال الفيديو الموجود أو رفع فيديو جديد إذا لم يكن هناك فيديو.',
        }
        : {
            title: 'Video Management',
            description: 'Manage homepage video (can only replace existing video)',
            homepageVideo: 'Homepage Video',
            selectVideo: 'Select Video to Replace',
            replaceVideo: 'Replace Video',
            replacing: 'Replacing…',
            uploadVideo: 'Upload New Video',
            uploading: 'Uploading…',
            videosInSection: 'Video in this section',
            noVideo: 'No video in this section yet',
            updateNote: 'Note: You can replace the existing video or upload a new one if no video exists.',
        };

    const fetchVideos = useCallback(async () => {
        const res = await fetch(`/api/admin/videos?section=homepage-video`);
        if (res.ok) {
            const data = await res.json();
            setVideos(data);
        }
    }, []);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, videoId?: string) => {
        if (!e.target.files?.[0]) {
            setSelectedFile(null);
            setReplacingVideoId(null);
            return;
        }
        setSelectedFile(e.target.files[0]);
        setReplacingVideoId(videoId || null);
    };

    const handleReplace = async (videoId: string) => {
        if (!selectedFile || replacingVideoId !== videoId) return;
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

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('section', 'homepage-video');
        formData.append('category', 'homepage');
        formData.append('slug', 'homepage-video');

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

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    const currentVideo = videos.length > 0 ? videos[0] : null;

    return (
        <div className={styles.container} dir={dir} data-dir={dir}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>{copy.title}</h3>
                    <p className={styles.subtitle}>{copy.description}</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.videoList}>
                    <div className={styles.sectionSelector}>
                        <label className={styles.label}>{copy.homepageVideo}</label>
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
                                    id="video-upload-new"
                                    className={styles.hiddenInput}
                                    onChange={(e) => handleFileSelect(e)}
                                    accept="video/*"
                                />
                                <label htmlFor="video-upload-new" className={styles.uploadLabel}>
                                    {copy.uploadVideo}
                                </label>
                                {selectedFile && !replacingVideoId && (
                                    <button
                                        type="button"
                                        onClick={handleUpload}
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
                                    preload="metadata"
                                />
                            </div>
                            <div className={styles.videoInfo}>
                                <p className={styles.videoName}>{currentVideo.filename}</p>
                                <p className={styles.videoDate}>{formatDate(currentVideo.uploadDate)}</p>
                            </div>
                            <div className={styles.videoActions}>
                                <div className={styles.replaceGroup}>
                                    <input
                                        type="file"
                                        id={`file-replace-${currentVideo._id}`}
                                        className={styles.hiddenInput}
                                        onChange={(e) => handleFileSelect(e, currentVideo._id)}
                                        accept="video/*"
                                    />
                                    <label htmlFor={`file-replace-${currentVideo._id}`} className={styles.replaceLabel}>
                                        {copy.selectVideo}
                                    </label>
                                    {replacingVideoId === currentVideo._id && selectedFile && (
                                        <button
                                            type="button"
                                            onClick={() => handleReplace(currentVideo._id)}
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
            </div>
        </div>
    );
}








