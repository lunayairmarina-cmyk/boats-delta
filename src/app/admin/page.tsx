"use client";

import { useRef, useState } from 'react';
import ImageManager from '@/components/admin/ImageManager';
import ServiceManager from '@/components/admin/ServiceManager';
import BlogManager from '@/components/admin/BlogManager';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

type TabKey = 'services' | 'blogs' | 'images';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabKey>('services');
    const { language, dir } = useLanguage();
    const copy = language === 'ar'
        ? { services: 'الخدمات', images: 'مكتبة الصور', blogs: 'المدونة' }
        : { services: 'Services', images: 'Image Library', blogs: 'Blog' };
    const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
        services: null,
        blogs: null,
        images: null,
    });

    const tabs: Array<{ key: TabKey; label: string }> = [
        { key: 'services', label: copy.services },
        { key: 'blogs', label: copy.blogs },
        { key: 'images', label: copy.images },
    ];

    const handleArrowNavigation = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const keys = ['ArrowRight', 'ArrowLeft'];
        if (!keys.includes(event.key)) {
            return;
        }

        event.preventDefault();
        const order: TabKey[] = ['services', 'blogs', 'images'];
        const currentIndex = order.indexOf(activeTab);
        const isRtl = dir === 'rtl';
        const delta = event.key === 'ArrowRight' ? (isRtl ? -1 : 1) : isRtl ? 1 : -1;
        const nextIndex = (currentIndex + delta + order.length) % order.length;
        const nextTab = order[nextIndex];

        setActiveTab(nextTab);
        tabRefs.current[nextTab]?.focus();
    };

    return (
        <div className={styles.wrapper} dir={dir}>
            <div className={styles.tabs} role="tablist" aria-orientation="horizontal" onKeyDown={handleArrowNavigation}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        ref={(element) => {
                            tabRefs.current[tab.key] = element;
                        }}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.key}
                        aria-controls={`${tab.key}-panel`}
                        tabIndex={activeTab === tab.key ? 0 : -1}
                        onClick={() => setActiveTab(tab.key)}
                        className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.panel} role="tabpanel" id={`${activeTab}-panel`}>
                {activeTab === 'services' && <ServiceManager />}
                {activeTab === 'blogs' && <BlogManager />}
                {activeTab === 'images' && <ImageManager />}
            </div>
        </div>
    );
}
