"use client";

import { useState } from 'react';
import ImageManager from '@/components/admin/ImageManager';
import ServiceManager from '@/components/admin/ServiceManager';
import BlogManager from '@/components/admin/BlogManager';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'images' | 'services' | 'blogs'>('services');
    const { language, dir } = useLanguage();
    const copy = language === 'ar'
        ? { services: 'الخدمات', images: 'مكتبة الصور', blogs: 'المدونة' }
        : { services: 'Services', images: 'Image Library', blogs: 'Blog' };

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
                    onClick={() => setActiveTab('blogs')}
                    className={`${styles.tabButton} ${activeTab === 'blogs' ? styles.tabButtonActive : ''}`}
                >
                    {copy.blogs}
                </button>
                <button
                    onClick={() => setActiveTab('images')}
                    className={`${styles.tabButton} ${activeTab === 'images' ? styles.tabButtonActive : ''}`}
                >
                    {copy.images}
                </button>
            </div>

            <div className={styles.panel}>
                {activeTab === 'services' && <ServiceManager />}
                {activeTab === 'blogs' && <BlogManager />}
                {activeTab === 'images' && <ImageManager />}
            </div>
        </div>
    );
}
