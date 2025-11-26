"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import styles from './ImageManager.module.css';
import { useLanguage } from '@/context/LanguageContext';

type ImageSection =
    | 'hero-home'
    | 'experience-section'
    | 'why-choose-us'
    | 'testimonials'
    | 'partner-logos'
    | 'about-page'
    | 'contact-page'
    | 'general';

interface GridFSFile {
    _id: string;
    filename: string;
    uploadDate: string;
    metadata?: {
        category?: string;
        section?: ImageSection;
        slug?: string;
        order?: number;
    };
}

export default function ImageManager() {
    const { language } = useLanguage();
    const [activeSection, setActiveSection] = useState<ImageSection>('hero-home');
    const [images, setImages] = useState<GridFSFile[]>([]);
    const [replacing, setReplacing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [replacingImageId, setReplacingImageId] = useState<string | null>(null);
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

    const isHeroSection = activeSection === 'hero-home';

    const sections = {
        en: {
            'hero-home': { label: 'Hero Banner (Main Slider)', group: 'Homepage' },
            'experience-section': { label: 'Experience Section (ocean-sunrise)', group: 'Homepage' },
            'why-choose-us': { label: 'Why Choose Us (relationship-crew)', group: 'Homepage' },
            'testimonials': { label: 'Testimonial Avatars (portrait-vip-1 to 12)', group: 'Homepage' },
            'partner-logos': { label: 'Partner/Client Logos', group: 'Homepage' },
            'about-page': { label: 'About Page Images', group: 'About Page' },
            'contact-page': { label: 'Contact Page Images', group: 'Contact Page' },
            'general': { label: 'General/Other Images', group: 'Other' },
        },
        ar: {
            'hero-home': { label: 'البانر الرئيسي (السلايدر)', group: 'الصفحة الرئيسية' },
            'experience-section': { label: 'قسم التجربة (ocean-sunrise)', group: 'الصفحة الرئيسية' },
            'why-choose-us': { label: 'لماذا تختارنا (relationship-crew)', group: 'الصفحة الرئيسية' },
            'testimonials': { label: 'صور الشهادات (portrait-vip-1 إلى 12)', group: 'الصفحة الرئيسية' },
            'partner-logos': { label: 'شعارات الشركاء/العملاء', group: 'الصفحة الرئيسية' },
            'about-page': { label: 'صور صفحة من نحن', group: 'صفحة من نحن' },
            'contact-page': { label: 'صور صفحة الاتصال', group: 'صفحة الاتصال' },
            'general': { label: 'صور عامة/أخرى', group: 'أخرى' },
        }
    };

    const copy = language === 'ar'
        ? {
            title: 'إدارة الصور',
            description: 'تحديث صور الموقع حسب الأقسام (لا يمكن إضافة أو حذف الصور)',
            section: 'القسم',
            selectImage: 'اختر صورة للاستبدال',
            replaceImage: 'استبدال الصورة',
            replacing: 'جاري الاستبدال…',
            imagesInSection: 'الصور في هذا القسم',
            noImages: 'لا توجد صور في هذا القسم بعد',
            moveUp: 'تحريك لأعلى',
            moveDown: 'تحريك لأسفل',
            order: 'الترتيب:',
            slide: 'الشريحة',
            heroHint: 'استخدم أزرار التحريك لضبط ترتيب الشرائح في الصفحة',
            updateNote: 'ملاحظة: يمكنك فقط تحديث الصور الموجودة. لا يمكن إضافة أو حذف الصور.',
        }
        : {
            title: 'Image Management',
            description: 'Update website images by section (add and delete are disabled)',
            section: 'Section',
            selectImage: 'Select Image to Replace',
            replaceImage: 'Replace Image',
            replacing: 'Replacing…',
            imagesInSection: 'Images in this section',
            noImages: 'No images in this section yet',
            moveUp: 'Move Up',
            moveDown: 'Move Down',
            order: 'Order:',
            slide: 'Slide',
            heroHint: 'Use move buttons to adjust the order of slides on the site',
            updateNote: 'Note: You can only update existing images. Adding and deleting images is disabled.',
        };

    const orderedImages = useMemo(() => {
        return [...images].sort((a, b) => {
            const orderA = typeof a.metadata?.order === 'number' ? a.metadata.order : new Date(a.uploadDate).getTime();
            const orderB = typeof b.metadata?.order === 'number' ? b.metadata.order : new Date(b.uploadDate).getTime();
            return orderA - orderB;
        });
    }, [images]);

    const fetchImages = useCallback(async () => {
        const res = await fetch(`/api/admin/images?section=${activeSection}`);
        if (res.ok) {
            const data = await res.json();
            setImages(data);
        }
    }, [activeSection]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, imageId: string) => {
        if (!e.target.files?.[0]) {
            setSelectedFile(null);
            setReplacingImageId(null);
            return;
        }
        setSelectedFile(e.target.files[0]);
        setReplacingImageId(imageId);
    };

    const handleReplace = async (imageId: string) => {
        if (!selectedFile || replacingImageId !== imageId) return;
        setReplacing(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch(`/api/admin/images/${imageId}`, {
                method: 'PUT',
                body: formData,
            });
            if (res.ok) {
                setSelectedFile(null);
                setReplacingImageId(null);
                await fetchImages();
                // Reset file input
                const fileInputs = document.querySelectorAll<HTMLInputElement>('input[type="file"]');
                fileInputs.forEach(input => input.value = '');
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to replace image');
            }
        } catch (error) {
            console.error('Replace failed', error);
            alert('Failed to replace image');
        } finally {
            setReplacing(false);
        }
    };

    const handleReorder = useCallback(async (currentIndex: number, direction: 'up' | 'down') => {
        if (!isHeroSection) return;
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= orderedImages.length) return;

        const reordered = [...orderedImages];
        const [moved] = reordered.splice(currentIndex, 1);
        reordered.splice(targetIndex, 0, moved);

        const updates = reordered.map((file, index) => ({
            id: file._id,
            order: (index + 1) * 100,
        }));

        setImages(
            reordered.map((file, index) => ({
                ...file,
                metadata: { ...file.metadata, order: updates[index].order },
            }))
        );

        setIsUpdatingOrder(true);
        try {
            await Promise.all(
                updates.map((item) =>
                    fetch(`/api/admin/images/${item.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ order: item.order }),
                    })
                )
            );
        } finally {
            setIsUpdatingOrder(false);
            await fetchImages();
        }
    }, [isHeroSection, orderedImages, fetchImages]);

    const groupedSections = useMemo(() => {
        const sectionData = sections[language];
        const groups: Record<string, Array<{ key: ImageSection; label: string }>> = {};

        Object.entries(sectionData).forEach(([key, value]) => {
            if (!groups[value.group]) {
                groups[value.group] = [];
            }
            groups[value.group].push({ key: key as ImageSection, label: value.label });
        });

        return groups;
    }, [language, sections]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>{copy.title}</h3>
                    <p className={styles.subtitle}>{copy.description}</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.imagesList}>
                    <div className={styles.sectionSelector}>
                        <label className={styles.label}>{copy.section}</label>
                        <select
                            className={styles.select}
                            value={activeSection}
                            onChange={(e) => setActiveSection(e.target.value as ImageSection)}
                        >
                            {Object.entries(groupedSections).map(([group, items]) => (
                                <optgroup key={group} label={group}>
                                    {items.map(({ key, label }) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <p className={styles.updateNote}>{copy.updateNote}</p>
                    </div>
                    <div className={styles.listHeader}>
                        <h4 className={styles.panelTitle}>{copy.imagesInSection}</h4>
                        {isHeroSection && orderedImages.length > 1 && (
                            <p className={styles.heroHint}>{copy.heroHint}</p>
                        )}
                    </div>

                    {orderedImages.length === 0 && (
                        <p className={styles.emptyState}>{copy.noImages}</p>
                    )}

                    <div className={styles.imageGrid}>
                        {orderedImages.map((img, index) => {
                            const slug = img.metadata?.slug;
                            return (
                                <div key={img._id} className={styles.imageCard}>
                                    <div className={styles.imagePreview}>
                                        <Image
                                            src={`/api/images/${img._id}`}
                                            alt={img.filename}
                                            fill
                                            className={styles.thumbnail}
                                            sizes="300px"
                                        />
                                    </div>
                                    <div className={styles.imageInfo}>
                                        <p className={styles.imageName}>{img.filename}</p>
                                        <p className={styles.imageDate}>{formatDate(img.uploadDate)}</p>
                                        {slug && <p className={styles.imageSlug}>slug: {slug}</p>}
                                        {isHeroSection && (
                                            <p className={styles.imageOrder}>
                                                {copy.slide} {index + 1} • {copy.order} {img.metadata?.order ?? '—'}
                                            </p>
                                        )}
                                    </div>
                                    <div className={styles.imageActions}>
                                        {isHeroSection && orderedImages.length > 1 && (
                                            <div className={styles.orderButtons}>
                                                <button
                                                    type="button"
                                                    className={styles.orderButton}
                                                    disabled={index === 0 || isUpdatingOrder}
                                                    onClick={() => handleReorder(index, 'up')}
                                                    aria-label={copy.moveUp}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.orderButton}
                                                    disabled={index === orderedImages.length - 1 || isUpdatingOrder}
                                                    onClick={() => handleReorder(index, 'down')}
                                                    aria-label={copy.moveDown}
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                        )}
                                        <div className={styles.replaceGroup}>
                                            <input
                                                type="file"
                                                id={`file-replace-${img._id}`}
                                                className={styles.hiddenInput}
                                                onChange={(e) => handleFileSelect(e, img._id)}
                                                accept="image/*"
                                            />
                                            <label htmlFor={`file-replace-${img._id}`} className={styles.replaceLabel}>
                                                {copy.selectImage}
                                            </label>
                                            {replacingImageId === img._id && selectedFile && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReplace(img._id)}
                                                    className={styles.replaceButton}
                                                    disabled={replacing}
                                                >
                                                    {replacing ? copy.replacing : copy.replaceImage}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
