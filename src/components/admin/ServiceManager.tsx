"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import styles from './ServiceManager.module.css';
import { useLanguage } from '@/context/LanguageContext';

const MAX_GALLERY_ITEMS = 4;

type GalleryItem = {
    fileId?: string;
    caption?: string;
    captionAr?: string;
};

type BenefitItem = {
    title?: string;
    titleAr?: string;
    description?: string;
    descriptionAr?: string;
    icon?: string;
};

type CopyShape = {
    headerTitle: string;
    addButton: string;
    confirmDelete: string;
    stats: {
        gallery: (count: number) => string;
        features: (count: number) => string;
        benefits: (count: number) => string;
    };
    modal: {
        eyebrowNew: string;
        eyebrowEdit: string;
        newTitle: string;
        editTitle: string;
        closeLabel: string;
    };
    fields: {
        titleEn: string;
        descEn: string;
        titleAr: string;
        descAr: string;
        price: string;
        priceAr: string;
        primaryImage: string;
    };
    helpers: {
        imageRequired: string;
        primaryImage: string;
    };
    gallery: {
        title: string;
        description: string;
        empty: (limit: number) => string;
        add: string;
        captionEn: string;
        captionAr: string;
        noImage: string;
        previewAlt: string;
        fileSelected: string;
    };
    features: {
        title: string;
        description: string;
        add: string;
        empty: string;
        placeholderEn: string;
        placeholderAr: string;
    };
    benefits: {
        title: string;
        description: string;
        add: string;
        empty: string;
        titleEn: string;
        titleAr: string;
        descEn: string;
        descAr: string;
        remove: string;
    };
    relatedServices: {
        title: string;
        description: string;
        empty: string;
        placeholder: string;
        selected: (count: number) => string;
    };
    actions: {
        remove: string;
        cancel: string;
        save: string;
        saving: string;
    };
    errors: {
        primaryImage: string;
        generic: string;
    };
};

const TEXT: Record<string, CopyShape> = {
    en: {
        headerTitle: 'Services Management',
        addButton: 'Add New Service',
        confirmDelete: 'Are you sure you want to delete this service?',
        stats: {
            gallery: (count: number) => `${count} gallery ${count === 1 ? 'item' : 'items'}`,
            features: (count: number) => `${count} ${count === 1 ? 'feature' : 'features'}`,
            benefits: (count: number) => `${count} ${count === 1 ? 'benefit' : 'benefits'}`,
        },
        modal: {
            eyebrowNew: 'Create new service',
            eyebrowEdit: 'Update existing service',
            newTitle: 'New Service',
            editTitle: 'Edit Service',
            closeLabel: 'Close dialog',
        },
        fields: {
            titleEn: 'Title (English)',
            descEn: 'Description (English)',
            titleAr: 'Title (Arabic)',
            descAr: 'Description (Arabic)',
            price: 'Price (Optional)',
            priceAr: 'Price (Arabic)',
            primaryImage: 'Primary Service Image',
        },
        helpers: {
            imageRequired: 'Required for new services.',
            primaryImage: 'Please upload a primary service image.',
        },
        gallery: {
            title: 'Gallery',
            description: 'Show up to four detail shots that appear on the public detail page.',
            empty: (limit: number) =>
                `No gallery images yet. Add up to ${limit} slots to showcase the service experience.`,
            add: 'Add Image',
            captionEn: 'Caption (English)',
            captionAr: 'التسمية التوضيحية (عربي)',
            noImage: 'No image selected',
            previewAlt: 'Gallery preview',
            fileSelected: 'New image selected',
        },
        features: {
            title: 'Key Features',
            description: 'Supports the Key Features list shown on the detail page.',
            add: 'Add Feature',
            empty: 'No features yet. Use the button above to highlight key selling points.',
            placeholderEn: 'Feature (English)',
            placeholderAr: 'الميزة (عربي)',
        },
        benefits: {
            title: 'Benefits',
            description: 'Displayed in the value section so visitors see tangible outcomes.',
            add: 'Add Benefit',
            empty: 'Add at least one benefit to replace the placeholder copy on the detail page.',
            titleEn: 'Title (EN)',
            titleAr: 'العنوان (AR)',
            descEn: 'Description (EN)',
            descAr: 'الوصف (AR)',
            remove: 'Remove Benefit',
        },
        relatedServices: {
            title: 'Related Services',
            description: 'Select up to 4 services to display as related on this service page.',
            empty: 'No related services selected. Click the dropdown to add related services.',
            placeholder: 'Select related services...',
            selected: (count: number) => `${count} service${count === 1 ? '' : 's'} selected`,
        },
        actions: {
            remove: 'Remove',
            cancel: 'Cancel',
            save: 'Save Service',
            saving: 'Saving…',
        },
        errors: {
            primaryImage: 'Please upload a primary service image.',
            generic: 'Failed to save service. Please try again.',
        },
    },
    ar: {
        headerTitle: 'إدارة الخدمات',
        addButton: 'إضافة خدمة جديدة',
        confirmDelete: 'هل أنت متأكد من حذف هذه الخدمة؟',
        stats: {
            gallery: (count: number) => `${count} صورة في المعرض`,
            features: (count: number) => `${count} ميزة`,
            benefits: (count: number) => `${count} فائدة`,
        },
        modal: {
            eyebrowNew: 'إنشاء خدمة جديدة',
            eyebrowEdit: 'تعديل خدمة حالية',
            newTitle: 'خدمة جديدة',
            editTitle: 'تعديل الخدمة',
            closeLabel: 'إغلاق النافذة',
        },
        fields: {
            titleEn: 'العنوان (بالإنجليزية)',
            descEn: 'الوصف (بالإنجليزية)',
            titleAr: 'العنوان (بالعربية)',
            descAr: 'الوصف (بالعربية)',
            price: 'السعر (اختياري)',
            priceAr: 'السعر (بالعربية)',
            primaryImage: 'الصورة الرئيسية للخدمة',
        },
        helpers: {
            imageRequired: 'مطلوب للخدمات الجديدة.',
            primaryImage: 'يرجى رفع الصورة الرئيسية للخدمة.',
        },
        gallery: {
            title: 'المعرض',
            description: 'أضف حتى أربع صور توضيحية تظهر في صفحة الخدمة.',
            empty: (limit: number) => `لا توجد صور حالياً. يمكنك إضافة حتى ${limit} صور لإبراز الخدمة.`,
            add: 'إضافة صورة',
            captionEn: 'التسمية التوضيحية (بالإنجليزية)',
            captionAr: 'التسمية التوضيحية (بالعربية)',
            noImage: 'لم يتم اختيار صورة',
            previewAlt: 'معاينة المعرض',
            fileSelected: 'تم اختيار صورة جديدة',
        },
        features: {
            title: 'المزايا الرئيسية',
            description: 'تظهر هذه العناصر في قسم المزايا في صفحة الخدمة.',
            add: 'إضافة ميزة',
            empty: 'لا توجد مزايا بعد. استخدم الزر لإضافة أبرز النقاط.',
            placeholderEn: 'الميزة (بالإنجليزية)',
            placeholderAr: 'الميزة (بالعربية)',
        },
        benefits: {
            title: 'الفوائد',
            description: 'يتم عرض هذه الفوائد في قسم القيمة المضافة.',
            add: 'إضافة فائدة',
            empty: 'أضف فائدة واحدة على الأقل لاستبدال النص الافتراضي.',
            titleEn: 'العنوان (بالإنجليزية)',
            titleAr: 'العنوان (بالعربية)',
            descEn: 'الوصف (بالإنجليزية)',
            descAr: 'الوصف (بالعربية)',
            remove: 'حذف الفائدة',
        },
        relatedServices: {
            title: 'الخدمات ذات الصلة',
            description: 'اختر ما يصل إلى 4 خدمات لعرضها كخدمات ذات صلة في هذه الصفحة.',
            empty: 'لم يتم اختيار خدمات ذات صلة. انقر على القائمة المنسدلة لإضافة خدمات.',
            placeholder: 'اختر الخدمات ذات الصلة...',
            selected: (count: number) => `${count} خدمة مختارة`,
        },
        actions: {
            remove: 'حذف',
            cancel: 'إلغاء',
            save: 'حفظ الخدمة',
            saving: 'جارٍ الحفظ…',
        },
        errors: {
            primaryImage: 'يرجى رفع الصورة الرئيسية للخدمة.',
            generic: 'تعذر حفظ الخدمة. يرجى المحاولة مرة أخرى.',
        },
    },
} as const;

interface Service {
    _id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    image: string;
    price?: string;
    priceAr?: string;
    gallery?: GalleryItem[];
    features?: string[];
    featuresAr?: string[];
    benefits?: BenefitItem[];
    relatedServices?: string[];
}

type EditableService = Partial<Service>;

export default function ServiceManager() {
    const { language, dir } = useLanguage();
    const copy: CopyShape = TEXT[language];
    const [services, setServices] = useState<Service[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<EditableService>(createEmptyService());
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([]);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const res = await fetch('/api/admin/services');
        if (res.ok) {
            const data = await res.json();
            console.log('Fetched services from API:', data);
            setServices(data);
        }
    };

    const openModal = (service?: Service) => {
        const shaped = createEmptyService(service);
        console.log('Opening modal with service:', service);
        console.log('Shaped service gallery:', shaped.gallery);
        setCurrentService(shaped);
        setImageFile(null);
        setGalleryFiles(new Array(shaped.gallery?.length ?? 0).fill(null));
        setFormError(null);
        setIsEditing(true);
    };

    const closeModal = () => {
        setIsEditing(false);
        setCurrentService(createEmptyService());
        setImageFile(null);
        setGalleryFiles([]);
        setFormError(null);
    };

    const uploadFile = async (file: File, section: 'services-primary' | 'services-gallery') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('section', section);
        formData.append('category', 'services');

        const uploadRes = await fetch('/api/admin/upload-image', {
            method: 'POST',
            body: formData,
        });

        if (!uploadRes.ok) {
            throw new Error('Failed to upload image');
        }

        const uploadJson = await uploadRes.json();
        return uploadJson.fileId as string;
    };

    const resolveMainImage = async () => {
        if (imageFile) {
            return uploadFile(imageFile, 'services-primary');
        }
        return currentService.image;
    };

    const resolveGallery = async () => {
        const gallery = currentService.gallery ?? [];
        console.log('Resolving gallery, current gallery:', gallery);
        console.log('Gallery files to upload:', galleryFiles);

        if (gallery.length === 0) {
            console.log('No gallery items, returning empty array');
            return [];
        }

        const resolved = await Promise.all(
            gallery.map(async (slot, index) => {
                let fileId = slot.fileId;

                // If there's a new file to upload, upload it
                if (galleryFiles[index]) {
                    console.log(`Uploading new file for gallery slot ${index}`);
                    fileId = await uploadFile(galleryFiles[index]!, 'services-gallery');
                    console.log(`Uploaded, got fileId: ${fileId}`);
                }

                // Validate that we have a fileId (either existing or newly uploaded)
                if (!fileId || fileId === '') {
                    console.error(`Gallery slot ${index} has no image (fileId: ${fileId})`);
                    throw new Error(`Gallery item ${index + 1} requires an image. Please upload an image or remove the empty slot.`);
                }

                return {
                    fileId,
                    caption: slot.caption ?? '',
                    captionAr: slot.captionAr ?? '',
                    order: index,
                };
            })
        );

        console.log('Resolved gallery:', resolved);
        return resolved;
    };

    const sanitizeFeatures = () => {
        const featuresEn = currentService.features ?? [];
        const featuresAr = currentService.featuresAr ?? [];
        console.log('Sanitizing features - EN:', featuresEn, 'AR:', featuresAr);

        const count = Math.max(featuresEn.length, featuresAr.length);
        const en: string[] = [];
        const ar: string[] = [];

        for (let i = 0; i < count; i++) {
            const enValue = (featuresEn[i] ?? '').trim();
            const arValue = (featuresAr[i] ?? '').trim();
            if (enValue || arValue) {
                en.push(enValue);
                ar.push(arValue);
            }
        }

        console.log('Sanitized features - EN:', en, 'AR:', ar);
        return { en, ar };
    };

    const sanitizeBenefits = () => {
        console.log('Sanitizing benefits, current benefits:', currentService.benefits);

        const sanitized = (currentService.benefits ?? [])
            .map((benefit) => ({
                title: benefit.title?.trim() ?? '',
                titleAr: benefit.titleAr?.trim() ?? '',
                description: benefit.description?.trim() ?? '',
                descriptionAr: benefit.descriptionAr?.trim() ?? '',
                icon: benefit.icon?.trim(),
            }))
            .filter((benefit) => benefit.title || benefit.titleAr || benefit.description || benefit.descriptionAr);

        console.log('Sanitized benefits:', sanitized);
        return sanitized;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setFormError(null);

        try {
            const url = currentService._id
                ? `/api/admin/services/${currentService._id}`
                : '/api/admin/services';
            const method = currentService._id ? 'PUT' : 'POST';

            const imageId = await resolveMainImage();
            if (!imageId) {
                setFormError(copy.errors.primaryImage);
                setLoading(false);
                return;
            }

            const gallery = await resolveGallery();
            const { en: features, ar: featuresAr } = sanitizeFeatures();
            const benefits = sanitizeBenefits();

            const payload = {
                title: currentService.title,
                titleAr: currentService.titleAr,
                description: currentService.description,
                descriptionAr: currentService.descriptionAr,
                price: currentService.price,
                priceAr: currentService.priceAr,
                image: imageId,
                gallery,
                features,
                featuresAr,
                benefits,
                relatedServices: Array.isArray(currentService.relatedServices) ? currentService.relatedServices : [],
            };

            console.log('Submitting service payload:', JSON.stringify(payload, null, 2));

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                console.error('Server error:', errorData);
                throw new Error(errorData.error || 'Failed to save service');
            }

            const result = await res.json();
            console.log('Service saved successfully:', result);

            closeModal();
            fetchServices();
        } catch (error: unknown) {
            console.error('Submit error:', error);
            setFormError(error instanceof Error ? error.message : copy.errors.generic);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(copy.confirmDelete)) return;

        try {
            const res = await fetch(`/api/admin/services/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setServices((prev) => prev.filter((service) => service._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const galleryItems = currentService.gallery ?? [];
    const featurePairs = useMemo(() => {
        const en = currentService.features ?? [];
        const ar = currentService.featuresAr ?? [];
        const length = Math.max(en.length, ar.length);
        return Array.from({ length }).map((_, index) => ({
            en: en[index] ?? '',
            ar: ar[index] ?? '',
        }));
    }, [currentService.features, currentService.featuresAr]);

    const benefitItems = currentService.benefits ?? [];
    const isEditingExisting = Boolean(currentService._id);
    const modalEyebrow = isEditingExisting ? copy.modal.eyebrowEdit : copy.modal.eyebrowNew;
    const modalTitleText = isEditingExisting ? copy.modal.editTitle : copy.modal.newTitle;

    return (
        <div className={styles.container} dir={dir} data-dir={dir}>
            <div className={styles.header}>
                <h3 className={styles.headerTitle}>{copy.headerTitle}</h3>
                <button className={styles.primaryButton} onClick={() => openModal()}>
                    {copy.addButton}
                </button>
            </div>

            {isEditing && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div>
                                <p className={styles.modalEyebrow}>{modalEyebrow}</p>
                                <h4 className={styles.modalTitle}>{modalTitleText}</h4>
                            </div>
                            <button
                                aria-label={copy.modal.closeLabel}
                                className={styles.closeButton}
                                onClick={closeModal}
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formScrollArea}>
                                {formError && <div className={styles.formError}>{formError}</div>}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{copy.fields.titleEn}</label>
                                    <input
                                        className={styles.input}
                                        onChange={(event) =>
                                            setCurrentService({ ...currentService, title: event.target.value })
                                        }
                                        required
                                        type="text"
                                        value={currentService.title || ''}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{copy.fields.descEn}</label>
                                    <textarea
                                        className={styles.textarea}
                                        onChange={(event) =>
                                            setCurrentService({ ...currentService, description: event.target.value })
                                        }
                                        required
                                        value={currentService.description || ''}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{copy.fields.titleAr}</label>
                                    <input
                                        className={styles.input}
                                        onChange={(event) =>
                                            setCurrentService({ ...currentService, titleAr: event.target.value })
                                        }
                                        required
                                        style={{ direction: 'rtl', textAlign: 'right' }}
                                        type="text"
                                        value={currentService.titleAr || ''}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{copy.fields.descAr}</label>
                                    <textarea
                                        className={styles.textarea}
                                        onChange={(event) =>
                                            setCurrentService({ ...currentService, descriptionAr: event.target.value })
                                        }
                                        required
                                        style={{ direction: 'rtl', textAlign: 'right' }}
                                        value={currentService.descriptionAr || ''}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>{copy.fields.price}</label>
                                        <input
                                            className={styles.input}
                                            onChange={(event) =>
                                                setCurrentService({ ...currentService, price: event.target.value })
                                            }
                                            type="text"
                                            value={currentService.price || ''}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>{copy.fields.priceAr}</label>
                                        <input
                                            className={styles.input}
                                            onChange={(event) =>
                                                setCurrentService({ ...currentService, priceAr: event.target.value })
                                            }
                                            style={{ direction: 'rtl', textAlign: 'right' }}
                                            type="text"
                                            value={currentService.priceAr || ''}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{copy.fields.primaryImage}</label>
                                    <input
                                        accept="image/*"
                                        className={styles.input}
                                        onChange={(event) => {
                                            setFormError(null);
                                            setImageFile(event.target.files?.[0] ?? null);
                                        }}
                                        type="file"
                                    />
                                    {imageFile && <span className={styles.fileName}>{imageFile.name}</span>}
                                    {!currentService._id && !imageFile && (
                                        <span className={styles.helperText}>{copy.helpers.imageRequired}</span>
                                    )}
                                </div>

                                <section className={styles.sectionCard}>
                                    <SectionHeader
                                        actionLabel={copy.gallery.add}
                                        description={copy.gallery.description}
                                        disabled={galleryItems.length >= MAX_GALLERY_ITEMS}
                                        onAction={() => {
                                            if (galleryItems.length >= MAX_GALLERY_ITEMS) return;
                                            const nextGallery = [...galleryItems, { fileId: '', caption: '', captionAr: '' }];
                                            setCurrentService({ ...currentService, gallery: nextGallery });
                                            setGalleryFiles([...galleryFiles, null]);
                                        }}
                                        title={copy.gallery.title}
                                    />
                                    {galleryItems.length === 0 && (
                                        <p className={styles.helperText}>{copy.gallery.empty(MAX_GALLERY_ITEMS)}</p>
                                    )}
                                    <div className={styles.galleryGrid}>
                                        {galleryItems.map((item, index) => (
                                            <div className={styles.gallerySlot} key={`gallery-${index}`}>
                                                <div className={styles.galleryPreview}>
                                                    {galleryFiles[index] ? (
                                                        <span className={styles.fileName}>
                                                            {galleryFiles[index]?.name || copy.gallery.fileSelected}
                                                        </span>
                                                    ) : item.fileId ? (
                                                        <Image
                                                            alt={copy.gallery.previewAlt}
                                                            className={styles.galleryImage}
                                                            fill
                                                            sizes="200px"
                                                            src={`/api/images/${item.fileId}`}
                                                        />
                                                    ) : (
                                                        <span className={styles.helperText}>{copy.gallery.noImage}</span>
                                                    )}
                                                </div>
                                                <input
                                                    accept="image/*"
                                                    className={styles.input}
                                                    onChange={(event) => {
                                                        setFormError(null);
                                                        const next = [...galleryFiles];
                                                        next[index] = event.target.files?.[0] ?? null;
                                                        setGalleryFiles(next);
                                                    }}
                                                    type="file"
                                                />
                                                <input
                                                    className={styles.input}
                                                    onChange={(event) => {
                                                        const next = [...galleryItems];
                                                        next[index] = { ...next[index], caption: event.target.value };
                                                        setCurrentService({ ...currentService, gallery: next });
                                                    }}
                                                    placeholder={copy.gallery.captionEn}
                                                    type="text"
                                                    value={item.caption ?? ''}
                                                />
                                                <input
                                                    className={styles.input}
                                                    onChange={(event) => {
                                                        const next = [...galleryItems];
                                                        next[index] = { ...next[index], captionAr: event.target.value };
                                                        setCurrentService({ ...currentService, gallery: next });
                                                    }}
                                                    placeholder={copy.gallery.captionAr}
                                                    style={{ direction: 'rtl', textAlign: 'right' }}
                                                    type="text"
                                                    value={item.captionAr ?? ''}
                                                />
                                                <button
                                                    className={styles.inlineDanger}
                                                    onClick={() => {
                                                        const nextGallery = galleryItems.filter((_, idx) => idx !== index);
                                                        const nextFiles = galleryFiles.filter((_, idx) => idx !== index);
                                                        setCurrentService({ ...currentService, gallery: nextGallery });
                                                        setGalleryFiles(nextFiles);
                                                    }}
                                                    type="button"
                                                >
                                                    {copy.actions.remove}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <section className={styles.sectionCard}>
                                    <SectionHeader
                                        actionLabel={copy.features.add}
                                        description={copy.features.description}
                                        onAction={() => {
                                            const en = [...(currentService.features ?? []), ''];
                                            const ar = [...(currentService.featuresAr ?? []), ''];
                                            setCurrentService({ ...currentService, features: en, featuresAr: ar });
                                        }}
                                        title={copy.features.title}
                                    />

                                    {featurePairs.length === 0 && (
                                        <p className={styles.helperText}>{copy.features.empty}</p>
                                    )}
                                    <div className={styles.featureList}>
                                        {featurePairs.map((feature, index) => (
                                            <div className={styles.featureRow} key={`feature-${index}`}>
                                                <input
                                                    className={styles.input}
                                                    onChange={(event) => {
                                                        const next = [...(currentService.features ?? [])];
                                                        next[index] = event.target.value;
                                                        setCurrentService({ ...currentService, features: next });
                                                    }}
                                                    placeholder={copy.features.placeholderEn}
                                                    type="text"
                                                    value={feature.en}
                                                />
                                                <input
                                                    className={styles.input}
                                                    onChange={(event) => {
                                                        const next = [...(currentService.featuresAr ?? [])];
                                                        next[index] = event.target.value;
                                                        setCurrentService({ ...currentService, featuresAr: next });
                                                    }}
                                                    placeholder={copy.features.placeholderAr}
                                                    style={{ direction: 'rtl', textAlign: 'right' }}
                                                    type="text"
                                                    value={feature.ar}
                                                />
                                                <button
                                                    className={styles.inlineDanger}
                                                    onClick={() => {
                                                        const nextEn = (currentService.features ?? []).filter(
                                                            (_, idx) => idx !== index
                                                        );
                                                        const nextAr = (currentService.featuresAr ?? []).filter(
                                                            (_, idx) => idx !== index
                                                        );
                                                        setCurrentService({
                                                            ...currentService,
                                                            features: nextEn,
                                                            featuresAr: nextAr,
                                                        });
                                                    }}
                                                    type="button"
                                                >
                                                    {copy.actions.remove}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className={styles.sectionCard}>
                                    <SectionHeader
                                        actionLabel={copy.benefits.add}
                                        description={copy.benefits.description}
                                        onAction={() => {
                                            const next = [
                                                ...(currentService.benefits ?? []),
                                                { title: '', titleAr: '', description: '', descriptionAr: '' },
                                            ];
                                            setCurrentService({ ...currentService, benefits: next });
                                        }}
                                        title={copy.benefits.title}
                                    />

                                    {benefitItems.length === 0 && (
                                        <p className={styles.helperText}>{copy.benefits.empty}</p>
                                    )}

                                    <div className={styles.benefitList}>
                                        {benefitItems.map((benefit, index) => (
                                            <div className={styles.benefitEditorCard} key={`benefit-${index}`}>
                                                <div className={styles.formRow}>
                                                    <div className={styles.formGroup}>
                                                        <label className={styles.label}>{copy.benefits.titleEn}</label>
                                                        <input
                                                            className={styles.input}
                                                            onChange={(event) => updateBenefit(index, 'title', event.target.value)}
                                                            type="text"
                                                            value={benefit.title ?? ''}
                                                        />
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label className={styles.label}>{copy.benefits.titleAr}</label>
                                                        <input
                                                            className={styles.input}
                                                            onChange={(event) =>
                                                                updateBenefit(index, 'titleAr', event.target.value)
                                                            }
                                                            style={{ direction: 'rtl', textAlign: 'right' }}
                                                            type="text"
                                                            value={benefit.titleAr ?? ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.formRow}>
                                                    <div className={styles.formGroup}>
                                                        <label className={styles.label}>{copy.benefits.descEn}</label>
                                                        <textarea
                                                            className={styles.textarea}
                                                            onChange={(event) =>
                                                                updateBenefit(index, 'description', event.target.value)
                                                            }
                                                            value={benefit.description ?? ''}
                                                        />
                                                    </div>
                                                    <div className={styles.formGroup}>
                                                        <label className={styles.label}>{copy.benefits.descAr}</label>
                                                        <textarea
                                                            className={styles.textarea}
                                                            onChange={(event) =>
                                                                updateBenefit(index, 'descriptionAr', event.target.value)
                                                            }
                                                            style={{ direction: 'rtl', textAlign: 'right' }}
                                                            value={benefit.descriptionAr ?? ''}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    className={styles.inlineDanger}
                                                    onClick={() => {
                                                        const next = benefitItems.filter((_, idx) => idx !== index);
                                                        setCurrentService({ ...currentService, benefits: next });
                                                    }}
                                                    type="button"
                                                >
                                                    {copy.benefits.remove}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Related Services Section */}
                                <section className={styles.sectionCard}>
                                    <div className={styles.sectionHeaderRow}>
                                        <div>
                                            <h5 className={styles.sectionTitleSm}>{copy.relatedServices.title}</h5>
                                            <p className={styles.helperText}>{copy.relatedServices.description}</p>
                                        </div>
                                    </div>

                                    <div className={styles.relatedServicesSelector}>
                                        <select
                                            className={styles.select}
                                            onChange={(event) => {
                                                const selectedId = event.target.value;
                                                if (!selectedId) return;

                                                const current = currentService.relatedServices || [];
                                                if (current.length >= 4) return;
                                                if (!current.includes(selectedId)) {
                                                    setCurrentService({
                                                        ...currentService,
                                                        relatedServices: [...current, selectedId],
                                                    });
                                                }
                                                event.target.value = '';
                                            }}
                                            disabled={(currentService.relatedServices?.length ?? 0) >= 4}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>{copy.relatedServices.placeholder}</option>
                                            {services
                                                .filter((s) => s._id !== currentService._id)
                                                .filter((s) => !(currentService.relatedServices ?? []).includes(s._id))
                                                .map((s) => (
                                                    <option key={s._id} value={s._id}>
                                                        {s.title} / {s.titleAr}
                                                    </option>
                                                ))}
                                        </select>

                                        {(currentService.relatedServices?.length ?? 0) > 0 && (
                                            <p className={styles.helperText}>
                                                {copy.relatedServices.selected(currentService.relatedServices?.length ?? 0)}
                                            </p>
                                        )}

                                        {(currentService.relatedServices?.length ?? 0) === 0 && (
                                            <p className={styles.helperText}>{copy.relatedServices.empty}</p>
                                        )}

                                        <div className={styles.relatedServicesList}>
                                            {(currentService.relatedServices ?? []).map((relatedId) => {
                                                const relatedService = services.find((s) => s._id === relatedId);
                                                // Even if not found in current list (rare), show the ID so user can delete it
                                                const displayName = relatedService ? `${relatedService.title}` : `Unknown Service (${relatedId})`;

                                                return (
                                                    <div key={relatedId} className={styles.relatedServiceTag}>
                                                        <span>{displayName}</span>
                                                        <button
                                                            type="button"
                                                            className={styles.removeTag}
                                                            onClick={() => {
                                                                const updated = (currentService.relatedServices ?? []).filter(
                                                                    (id) => id !== relatedId
                                                                );
                                                                setCurrentService({
                                                                    ...currentService,
                                                                    relatedServices: updated,
                                                                });
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className={styles.formActions}>
                                <button className={styles.secondaryButton} onClick={closeModal} type="button">
                                    {copy.actions.cancel}
                                </button>
                                <button className={styles.submitButton} disabled={loading} type="submit">
                                    {loading ? copy.actions.saving : copy.actions.save}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.cards}>
                {services.map((service) => (
                    <div className={styles.card} key={service._id}>
                        <div className={styles.thumb}>
                            {service.image && (
                                <Image
                                    alt={service.title}
                                    className={styles.thumbImage}
                                    fill
                                    sizes="120px"
                                    src={`/api/images/${service.image}`}
                                />
                            )}
                        </div>
                        <div className={styles.details}>
                            <h4 className={styles.serviceTitle}>{service.title}</h4>
                            <p className={styles.description}>{service.description}</p>
                            <h4 className={styles.serviceTitle}>{service.titleAr}</h4>
                            <p className={`${styles.description} ${styles.rtlText}`}>{service.descriptionAr}</p>
                            {service.price && <p className={styles.price}>{service.price}</p>}
                            {service.priceAr && <p className={`${styles.price} ${styles.rtlText}`}>{service.priceAr}</p>}
                            <div className={styles.metaRow}>
                                <span>{copy.stats.gallery(service.gallery?.length ?? 0)}</span>
                                <span>{copy.stats.features(service.features?.length ?? 0)}</span>
                                <span>{copy.stats.benefits(service.benefits?.length ?? 0)}</span>
                            </div>
                        </div>
                        <div className={styles.cardActions}>
                            <button
                                className={`${styles.cardButton} ${styles.editButton}`}
                                onClick={() => openModal(service)}
                                type="button"
                            >
                                Edit
                            </button>
                            <button
                                className={`${styles.cardButton} ${styles.deleteButton}`}
                                onClick={() => handleDelete(service._id)}
                                type="button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    function updateBenefit(index: number, field: keyof BenefitItem, value: string) {
        const next = [...(currentService.benefits ?? [])];
        next[index] = { ...next[index], [field]: value };
        setCurrentService({ ...currentService, benefits: next });
    }
}

function createEmptyService(service?: Service): EditableService {
    // Ensure relatedServices are strings (handles ObjectId serialization from MongoDB)
    const relatedServiceIds = (service?.relatedServices ?? []).map((id) =>
        typeof id === 'object' && id !== null ? String(id) : id
    );

    return {
        ...(service ?? {}),
        gallery: service?.gallery?.slice(0, MAX_GALLERY_ITEMS) ?? [],
        features: service?.features ?? [],
        featuresAr: service?.featuresAr ?? [],
        benefits: service?.benefits ?? [],
        relatedServices: relatedServiceIds,
    };
}

type SectionHeaderProps = {
    title: string;
    description: string;
    actionLabel: string;
    disabled?: boolean;
    onAction: () => void;
};

function SectionHeader({ title, description, actionLabel, disabled, onAction }: SectionHeaderProps) {
    return (
        <div className={styles.sectionHeaderRow}>
            <div>
                <h5 className={styles.sectionTitleSm}>{title}</h5>
                <p className={styles.helperText}>{description}</p>
            </div>
            <button className={styles.inlineButton} disabled={disabled} onClick={onAction} type="button">
                {actionLabel}
            </button>
        </div>
    );
}
