"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RotatingBorderButton from "@/components/RotatingBorderButton";
import { useLanguage } from '@/context/LanguageContext';
import styles from './ServicesList.module.css'; // We'll create this CSS module

interface Service {
    _id: string;
    title: string;
    titleAr?: string;
    description: string;
    descriptionAr?: string;
    image: string;
    price?: string;
    priceAr?: string;
    slug?: string;
}

interface ServicesListProps {
    badge?: string;
    title?: string;
    subtitle?: string;
    showHeader?: boolean;
    compact?: boolean;
}

export default function ServicesList({
    badge = 'Our Services',
    title = 'Premium Yacht Services',
    subtitle = 'Comprehensive management and maintenance solutions for your vessel.',
    showHeader = true,
    compact = false,
}: ServicesListProps) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const { dir, language } = useLanguage();

    useEffect(() => {
        let isMounted = true;

        const fetchServices = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/services?lang=${language}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted) {
                        setServices(data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch services', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchServices();

        return () => {
            isMounted = false;
        };
    }, [language]);

    if (loading) {
        return <div className="py-20 text-center">Loading services...</div>;
    }

    if (services.length === 0) {
        return null; // Or a placeholder
    }

    const sectionClassName = compact
        ? `${styles.servicesSection} ${styles.compactSection}`
        : styles.servicesSection;

    const buttonLabel = language === 'ar' ? 'استفسر الآن' : 'Inquire Now';

    return (
        <section className={sectionClassName}>
            <div className={`${styles.container} ${compact ? styles.compactContainer : ''}`} style={{ direction: dir }}>
                {showHeader && (
                    <div className={styles.header}>
                        <p className={styles.badge}>{badge}</p>
                        <h2 className={styles.title}>{title}</h2>
                        <p className={styles.subtitle}>{subtitle}</p>
                    </div>
                )}

                <div className={styles.grid}>
                    {services.map((service) => {
                        const isArabic = language === 'ar';
                        const sanitizedTitle = service.title?.trim() ?? '';
                        const sanitizedTitleAr = service.titleAr?.trim() ?? '';
                        const sanitizedDescription = service.description?.trim() ?? '';
                        const sanitizedDescriptionAr = service.descriptionAr?.trim() ?? '';
                        const sanitizedPrice = service.price?.trim() ?? '';
                        const sanitizedPriceAr = service.priceAr?.trim() ?? '';

                        const displayTitle = isArabic
                            ? sanitizedTitleAr || sanitizedTitle
                            : sanitizedTitle || sanitizedTitleAr;
                        const displayDescription = isArabic
                            ? sanitizedDescriptionAr || sanitizedDescription
                            : sanitizedDescription || sanitizedDescriptionAr;
                        const displayPrice = isArabic
                            ? sanitizedPriceAr || sanitizedPrice
                            : sanitizedPrice || sanitizedPriceAr;

                        return (
                            <div
                                key={service._id}
                                className={styles.card}
                                style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                            >
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={`/api/images/${service.image}`}
                                        alt={displayTitle}
                                        fill
                                        className={styles.image}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className={styles.content}>
                                    <h3 className={styles.cardTitle}>{displayTitle}</h3>
                                    <p className={styles.cardDesc}>{displayDescription}</p>
                                    {displayPrice && <p className={styles.price}>{displayPrice}</p>}
                                    <div className={styles.actions}>
                                        <Link href="/contact" className={styles.link}>
                                            <RotatingBorderButton text={buttonLabel} />
                                        </Link>
                                        <Link
                                            href={`/services/${service.slug || service._id}`}
                                            className={styles.detailLink}
                                            aria-label={
                                                isArabic
                                                    ? `عرض تفاصيل ${displayTitle}`
                                                    : `View details for ${displayTitle}`
                                            }
                                        >
                                            {isArabic ? 'تفاصيل الخدمة' : 'View Details'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
