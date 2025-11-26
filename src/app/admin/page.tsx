"use client";

import { useState } from 'react';
import ImageManager from '@/components/admin/ImageManager';
import ServiceManager from '@/components/admin/ServiceManager';
import MigrationHelper from '@/components/admin/MigrationHelper';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'images' | 'services' | 'migrate'>('services');
    const { language, dir } = useLanguage();
    const copy = language === 'ar'
        ? { services: 'الخدمات', images: 'مكتبة الصور', migrate: 'ترحيل الصور' }
        : { services: 'Services', images: 'Image Library', migrate: 'Migrate Images' };

    return (
        <div className={styles.wrapper} style={{ direction: dir }}>
            <div className={styles.tabs}>
                <button
                    onClick={() => setActiveTab('services')}
                    className={`${styles.tabButton} ${activeTab === 'services' ? styles.tabButtonActive : ''}`}
                >
                    {copy.services}
                </button>
                <button
                    onClick={() => setActiveTab('images')}
                    className={`${styles.tabButton} ${activeTab === 'images' ? styles.tabButtonActive : ''}`}
                >
                    {copy.images}
                </button>
                <button
                    onClick={() => setActiveTab('migrate')}
                    className={`${styles.tabButton} ${activeTab === 'migrate' ? styles.tabButtonActive : ''}`}
                >
                    {copy.migrate}
                </button>
            </div>

            <div className={styles.panel}>
                {activeTab === 'services' && <ServiceManager />}
                {activeTab === 'images' && <ImageManager />}
                {activeTab === 'migrate' && <MigrationHelper />}
            </div>
        </div>
    );
}
