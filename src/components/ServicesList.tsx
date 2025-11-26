"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ServicesList.module.css';

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

                <div className={styles.servicesLayout}>
                    <div className={styles.contentSection}>
                        <div className={styles.contentBadge}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="12" width="3" height="6" fill="#0c4fad" rx="1"/>
                                <rect x="7" y="8" width="3" height="10" fill="#0c4fad" rx="1"/>
                                <rect x="12" y="4" width="3" height="14" fill="#0c4fad" rx="1"/>
                                <rect x="17" y="6" width="2" height="12" fill="#0c4fad" rx="1"/>
                            </svg>
                            <span>WITH US</span>
                        </div>
                        <h3 className={styles.contentTitle}>{title}</h3>
                        <p className={styles.contentDescription}>
                            {subtitle || "Integrate your favorite apps effortlessly, ensuring a smooth flow of information and reducing friction across your tech stack."}
                        </p>
                        <Link href="/contact" className={styles.knowMoreButton}>
                            <span className={styles.buttonText}>KNOW MORE</span>
                            <span className={styles.buttonArrow}>➝</span>
                        </Link>
                    </div>

                    <div className={styles.horizontalScroll}>
                        {services.map((service) => {
                            const isArabic = language === 'ar';
                            const sanitizedTitle = service.title?.trim() ?? '';
                            const sanitizedTitleAr = service.titleAr?.trim() ?? '';
                            const sanitizedDescription = service.description?.trim() ?? '';
                            const sanitizedDescriptionAr = service.descriptionAr?.trim() ?? '';

                            const displayTitle = isArabic
                                ? sanitizedTitleAr || sanitizedTitle
                                : sanitizedTitle || sanitizedTitleAr;
                            const displayDescription = isArabic
                                ? sanitizedDescriptionAr || sanitizedDescription
                                : sanitizedDescription || sanitizedDescriptionAr;

                            return (
                                <Link
                                    key={service._id}
                                    href={`/services/${service.slug || service._id}`}
                                    className={styles.card}
                                    style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                                >
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={`/api/images/${service.image}`}
                                            alt={displayTitle}
                                            fill
                                            className={styles.image}
                                            sizes="(max-width: 768px) 400px, 500px"
                                        />
                                    </div>
                                    <div className={styles.content}>
                                        <h3 className={styles.cardTitle}>{displayTitle}</h3>
                                        <p className={styles.cardDesc}>{displayDescription}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
