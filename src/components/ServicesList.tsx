"use client";

import { useState, useEffect, useMemo } from 'react';
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
    category?: string;
    order?: number;
}

interface ServicesListProps {
    badge?: string;
    title?: string;
    subtitle?: string;
    showHeader?: boolean;
    compact?: boolean;
}

interface GroupedServices {
    mainService: Service;
    subServices: Service[];
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

    // Group services by category
    const groupedServices = useMemo(() => {
        const mainCategories = ['yacht-boat-management', 'marina-club-management'];
        const groups: GroupedServices[] = [];

        mainCategories.forEach((category) => {
            // Find main service (has slug matching category)
            const mainService = services.find(
                (s) => s.category === category && s.slug === category
            );

            // Find all sub-services with this category (but different slug)
            const subServices = services
                .filter(
                    (s) => s.category === category && s.slug && s.slug !== category
                )
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

            if (mainService) {
                groups.push({
                    mainService,
                    subServices,
                });
            } else if (subServices.length > 0) {
                // If no main service found, use first sub-service as main
                groups.push({
                    mainService: subServices[0],
                    subServices: subServices.slice(1),
                });
            }
        });

        // If no grouped services found, return all services as flat list
        if (groups.length === 0) {
            return services.map((s) => ({ mainService: s, subServices: [] }));
        }

        return groups;
    }, [services]);

    if (loading) {
        return <div className="py-20 text-center">Loading services...</div>;
    }

    if (services.length === 0) {
        return null; // Or a placeholder
    }

    const sectionClassName = compact
        ? `${styles.servicesSection} ${styles.compactSection}`
        : styles.servicesSection;

    const isArabic = language === 'ar';

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

                <div className={styles.servicesMainLayout}>
                    <div className={styles.servicesContentArea}>
                        {/* Render each group completely before moving to the next */}
                        {groupedServices.map((group, groupIndex) => {
                            const mainTitle = (isArabic
                                ? group.mainService.titleAr || group.mainService.title
                                : group.mainService.title || group.mainService.titleAr) || '';
                            const mainDescription = (isArabic
                                ? group.mainService.descriptionAr || group.mainService.description
                                : group.mainService.description || group.mainService.descriptionAr) || '';

                            return (
                                <div key={group.mainService._id} className={styles.serviceGroup}>
                                    {/* Main Service Card */}
                                    <div className={styles.mainServicesRow}>
                                        <Link
                                            href={`/services/${group.mainService.slug || group.mainService._id}`}
                                            className={styles.mainServiceCard}
                                            style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                                        >
                                            <div className={styles.imageWrapper}>
                                                <Image
                                                    src={`/api/images/${group.mainService.image}`}
                                                    alt={mainTitle}
                                                    fill
                                                    className={styles.image}
                                                    sizes="(max-width: 768px) 400px, 500px"
                                                />
                                            </div>
                                            <div className={styles.content}>
                                                <h3 className={styles.cardTitle}>{mainTitle}</h3>
                                                <p className={styles.cardDesc}>{mainDescription}</p>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Sub Services Grid for this group */}
                                    {group.subServices.length > 0 && (
                                        <div className={styles.subServicesGrid}>
                                            {group.subServices.map((subService) => {
                                                const subTitle = (isArabic
                                                    ? subService.titleAr || subService.title
                                                    : subService.title || subService.titleAr) || '';
                                                const subDescription = (isArabic
                                                    ? subService.descriptionAr || subService.description
                                                    : subService.description || subService.descriptionAr) || '';

                                                return (
                                                    <Link
                                                        key={subService._id}
                                                        href={`/services/${subService.slug || subService._id}`}
                                                        className={styles.subServiceCard}
                                                        style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                                                    >
                                                        <div className={styles.subServiceImageWrapper}>
                                                            <Image
                                                                src={`/api/images/${subService.image}`}
                                                                alt={subTitle}
                                                                fill
                                                                className={styles.subServiceImage}
                                                                sizes="(max-width: 768px) 200px, 250px"
                                                            />
                                                        </div>
                                                        <div className={styles.subServiceContent}>
                                                            <h4 className={styles.subServiceTitle}>{subTitle}</h4>
                                                            <p className={styles.subServiceDesc}>{subDescription}</p>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Side Cards */}
                    <div className={styles.contentCardsWrapper}>
                        <div className={styles.contentSection}>
                            <div className={styles.contentBadge}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M10 1.5 12.4 7l5.6.4-4.3 3.7 1.3 5.4L10 13.8 5 16.5l1.3-5.4L2 7.4 7.6 7 10 1.5Z"
                                        fill="#0c4fad"
                                    />
                                </svg>
                                <span>{badge}</span>
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
                        <div className={styles.contentSection}>
                            <div className={styles.contentBadge}>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M10 2c1.9 0 3.7.7 5 2a7 7 0 0 1-5 11.5A7 7 0 0 1 5 4c1.3-1.3 3.1-2 5-2Zm0 1.8a5.2 5.2 0 0 0-3.7 1.5A5.2 5.2 0 0 0 10 14.4 5.2 5.2 0 0 0 13.7 5.3 5.2 5.2 0 0 0 10 3.8Zm0 2.2a1 1 0 0 1 1 1v1.2l.9.5a1 1 0 0 1-.9 1.8l-1.6-.8A1 1 0 0 1 9 9.7V7a1 1 0 0 1 1-1Z"
                                        fill="#0c4fad"
                                    />
                                </svg>
                                <span>WITH US</span>
                            </div>
                            <h3 className={styles.contentTitle}>BOAT PRO</h3>
                            <p className={styles.contentDescription}>
                                {isArabic ? "نحن نقدم حلاً متكاملاً لإدارة يختك أو قاربك، يغطي جميع الجوانب التشغيلية والفنية والمالية. من الإشراف على الطاقم والصيانة الدورية إلى إدارة الميزانية والامتثال للقوانين البحرية، نحن نتولى كل شيء. يمكنك أيضًا اختيار نهج وحدوي (Modular approach) يتيح لك اختيار الخدمات التي تحتاجها فقط." : subtitle || "Integrate your favorite apps effortlessly, ensuring a smooth flow of information and reducing friction across your tech stack."}
                            </p>
                            <Link href="/contact" className={styles.knowMoreButton}>
                                <span className={styles.buttonText}>KNOW MORE</span>
                                <span className={styles.buttonArrow}>➝</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
