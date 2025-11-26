"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import type { ServiceDetailResponse, LocalizedText } from '@/lib/service-detail';
import { useServiceDetailAnimations } from '@/hooks/useServiceDetailAnimations';
import ServiceHeader from './ServiceHeader';
import ServiceImages from './ServiceImages';
import ServiceDescription from './ServiceDescription';
import ServiceBenefits from './ServiceBenefits';
import RelatedServices from './RelatedServices';
import styles from './ServiceDetail.module.css';

type ServiceDetailClientProps = {
    initialData: ServiceDetailResponse;
    serviceId: string;
};

type FetchState = 'idle' | 'loading' | 'refreshing' | 'error';

const pickLocale = (language: 'ar' | 'en', value: LocalizedText) => (language === 'ar' ? value.ar : value.en);

const ServiceDetailClient = ({ initialData, serviceId }: ServiceDetailClientProps) => {
    const { language, dir } = useLanguage();
    const [data, setData] = useState<ServiceDetailResponse>(initialData);
    const [fetchState, setFetchState] = useState<FetchState>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const latestDataRef = useRef<ServiceDetailResponse>(initialData);
    const controllerRef = useRef<AbortController | null>(null);

    const headerRef = useRef<HTMLElement | null>(null);
    const imagesRef = useRef<HTMLElement | null>(null);
    const descriptionRef = useRef<HTMLElement | null>(null);
    const benefitsRef = useRef<HTMLElement | null>(null);
    const relatedRef = useRef<HTMLElement | null>(null);

    useServiceDetailAnimations({
        headerRef,
        imagesRef,
        descriptionRef,
        benefitsRef,
        relatedRef,
        dir,
    });

    useEffect(() => {
        latestDataRef.current = data;
    }, [data]);

    const fetchLatest = useCallback(async () => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        const hasExistingData = Boolean(latestDataRef.current?.service);
        setFetchState(hasExistingData ? 'refreshing' : 'loading');
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/services/${serviceId}`, {
                cache: 'no-store',
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch service detail: ${response.status}`);
            }

            const payload = (await response.json()) as ServiceDetailResponse;
            setData(payload);
            latestDataRef.current = payload;
            setFetchState('idle');
        } catch (error) {
            if (controller.signal.aborted) {
                return;
            }
            console.error(error);
            setFetchState('error');
            setErrorMessage(
                language === 'ar'
                    ? 'تعذر تحديث بيانات الخدمة. حاول مرة أخرى.'
                    : 'Unable to refresh the service detail. Please try again.'
            );
        }
    }, [serviceId, language]);

    useEffect(() => {
        fetchLatest();
        return () => {
            controllerRef.current?.abort();
        };
    }, [fetchLatest]);

    const service = data.service;

    const gallery = useMemo(
        () =>
            service.gallery.map((item) => ({
                id: item.id,
                url: item.url,
                caption: pickLocale(language, item.caption),
            })),
        [service.gallery, language]
    );

    const benefits = useMemo(
        () =>
            service.benefits.map((benefit) => ({
                id: benefit.id,
                icon: benefit.icon ?? null,
                title: pickLocale(language, benefit.title),
                description: pickLocale(language, benefit.description),
            })),
        [service.benefits, language]
    );

    const features = useMemo(() => {
        const localizedFeatures = language === 'ar' ? service.features.ar : service.features.en;
        if (localizedFeatures.length > 0) {
            return localizedFeatures;
        }
        return language === 'ar' ? service.features.en : service.features.ar;
    }, [service.features, language]);

    const relatedServices = useMemo(
        () =>
            data.relatedServices.map((related) => ({
                id: related.id,
                slug: related.slug,
                title: pickLocale(language, related.title),
                description: pickLocale(language, related.description),
                image: related.image,
                price:
                    language === 'ar'
                        ? related.priceAr ?? related.price
                        : related.price ?? related.priceAr,
            })),
        [data.relatedServices, language]
    );

    const heroPrice =
        language === 'ar'
            ? service.priceAr ?? service.price
            : service.price ?? service.priceAr;

    const heroStats = useMemo(() => {
        const categoryLabel = language === 'ar' ? 'الفئة' : 'Category';
        const galleryLabel = language === 'ar' ? 'صور المعرض' : 'Gallery items';
        const benefitsLabel = language === 'ar' ? 'الفوائد' : 'Benefits';
        return [
            {
                label: galleryLabel,
                value: `${Math.max(gallery.length, service.mainImage ? 1 : 0)}`,
            },
            {
                label: benefitsLabel,
                value: `${benefits.length || 1}+`,
            },
            {
                label: categoryLabel,
                value: service.category ?? (language === 'ar' ? 'مخصص' : 'Custom'),
            },
        ];
    }, [gallery.length, benefits.length, service.category, service.mainImage, language]);

    return (
        <div className={styles.page} dir={dir}>
            {(fetchState === 'refreshing' || fetchState === 'error') && (
                <div
                    className={`${styles.statusBanner} ${
                        fetchState === 'error' ? styles.statusBannerError : ''
                    }`}
                    role={fetchState === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                >
                    <span>
                        {fetchState === 'refreshing'
                            ? language === 'ar'
                                ? 'يتم تحديث البيانات مباشرة...'
                                : 'Refreshing live data...'
                            : errorMessage}
                    </span>
                    {fetchState === 'error' && (
                        <button type="button" onClick={fetchLatest}>
                            {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                        </button>
                    )}
                </div>
            )}

                    <ServiceHeader
                ref={headerRef}
                title={pickLocale(language, service.title)}
                description={pickLocale(language, service.description)}
                longDescription={pickLocale(language, service.longDescription)}
                        price={heroPrice}
                mainImage={service.mainImage}
                stats={heroStats}
                language={language}
                dir={dir}
            />

            <ServiceImages
                ref={imagesRef}
                mainImage={service.mainImage}
                gallery={gallery}
                language={language}
                dir={dir}
            />

            <ServiceDescription
                ref={descriptionRef}
                description={pickLocale(language, service.description)}
                longDescription={pickLocale(language, service.longDescription)}
                features={features}
                language={language}
                dir={dir}
            />

            <ServiceBenefits ref={benefitsRef} benefits={benefits} language={language} dir={dir} />

            <RelatedServices ref={relatedRef} services={relatedServices} language={language} dir={dir} />
        </div>
    );
};

export default ServiceDetailClient;

