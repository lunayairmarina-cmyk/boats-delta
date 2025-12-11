'use client';

import React, { useState, useEffect } from 'react';
import { Montserrat, Open_Sans } from 'next/font/google';
import styles from './app.module.css';
import Hero from '../../components/app-showcase/Hero';
import FeatureSection from '../../components/app-showcase/FeatureSection';
import FAQ from '../../components/app-showcase/FAQ';
import ContactForm from '../../components/app-showcase/ContactForm';
import SectionSeparator from '../../components/app-showcase/SectionSeparator';
import { useLanguage } from '@/context/LanguageContext';

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-heading',
    display: 'swap',
});

const openSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});

export default function AppShowcasePage() {
    const { t, language } = useLanguage();
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        // Show overlay after 3 seconds
        const timer = setTimeout(() => {
            setShowOverlay(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleCloseOverlay = () => {
        setShowOverlay(false);
    };

    return (
        <div className={`${styles.container} ${montserrat.variable} ${openSans.variable}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Static Development Banner */}
            <div className={styles.developmentBannerWrapper}>
                <div className={styles.developmentBanner} role="status" aria-live="polite">
                    <div className={styles.developmentBannerContent}>
                        <span className={styles.developmentBadge}>{t('appPage.overlay.comingSoon')}</span>
                        <div className={styles.developmentText}>
                            <strong>{t('appPage.overlay.titlePrefix')}</strong>
                            <span className={styles.textGold}> {t('appPage.overlay.titleSuffix')}</span>
                        </div>
                        <p className={styles.developmentSubtext}>{t('appPage.overlay.subtitle')}</p>
                    </div>
                </div>
            </div>

            {/* Coming Soon Overlay - appears after delay */}
            {showOverlay && (
                <div className={styles.comingSoonOverlay}>
                    <div className={styles.comingSoonContent}>
                        <button
                            className={styles.closeButton}
                            onClick={handleCloseOverlay}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                        <span className={styles.comingSoonBadge}>{t('appPage.overlay.comingSoon')}</span>
                        <h2 className={styles.comingSoonTitle}>
                            {t('appPage.overlay.titlePrefix')}<br />
                            <span className={styles.textGold}>{t('appPage.overlay.titleSuffix')}</span>
                        </h2>
                        <p className={styles.comingSoonSubtitle}>
                            {t('appPage.overlay.subtitle')}
                        </p>
                        <div className={styles.comingSoonFeatures}>
                            <div className={styles.comingSoonFeature}>
                                <span className={styles.comingSoonCheckmark}>✓</span>
                                {t('appPage.overlay.features.monitoring')}
                            </div>
                            <div className={styles.comingSoonFeature}>
                                <span className={styles.comingSoonCheckmark}>✓</span>
                                {t('appPage.overlay.features.checklists')}
                            </div>
                            <div className={styles.comingSoonFeature}>
                                <span className={styles.comingSoonCheckmark}>✓</span>
                                {t('appPage.overlay.features.tracking')}
                            </div>
                        </div>
                        <a href="/contact" className={styles.comingSoonCta}>
                            {t('appPage.overlay.cta')}
                            <span className={styles.comingSoonArrow}>{language === 'ar' ? '←' : '→'}</span>
                        </a>
                    </div>
                </div>
            )}

            <main>
                <Hero />

                <SectionSeparator />

                {/* Main App Benefits Title Section */}
                <div className={styles.benefitsSection}>
                    <h2 className={styles.benefitsTitle}>{t('appPage.benefits.title')}</h2>
                </div>

                <SectionSeparator />

                <div id="features" style={{ position: 'relative', zIndex: 2 }}>
                    <FeatureSection
                        number="01"
                        title={t('appPage.features.tankLevels.title')}
                        description={t('appPage.features.tankLevels.description')}
                        variant="tankLevels"
                        lightBg={true}
                    />

                    <SectionSeparator />

                    <FeatureSection
                        number="02"
                        title={t('appPage.features.checklist.title')}
                        description={t('appPage.features.checklist.description')}
                        variant="checklist"
                        reversed={true}
                    />

                    <SectionSeparator />

                    <FeatureSection
                        number="03"
                        title={t('appPage.features.services.title')}
                        description={t('appPage.features.services.description')}
                        variant="services"
                        lightBg={true}
                    />
                </div>

                <SectionSeparator />

                <FAQ />

                <SectionSeparator />

                <ContactForm />
            </main>
        </div>
    );
}
