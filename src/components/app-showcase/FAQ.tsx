'use client';

import React, { useState } from 'react';
import styles from './FAQ.module.css';
import MobileFloatingCard from './MobileFloatingCard';
import { useLanguage } from '@/context/LanguageContext';

export default function FAQ() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: t('appPage.faq.items.q1.question'),
            a: t('appPage.faq.items.q1.answer')
        },
        {
            q: t('appPage.faq.items.q2.question'),
            a: t('appPage.faq.items.q2.answer')
        },
        {
            q: t('appPage.faq.items.q3.question'),
            a: t('appPage.faq.items.q3.answer')
        }
    ];

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.container} id="faq-section">
            {/* Mobile Floating Cards */}
            <MobileFloatingCard section="faq" position="left" />
            <MobileFloatingCard section="faq" position="right" />

            <div className={styles.contentWrapper}>
                <h2 className={styles.title}>{t('appPage.faq.title')}</h2>
                <div className={styles.list}>
                    {faqs.map((faq, index) => (
                        <div key={index} className={styles.item}>
                            <button
                                className={`${styles.question} ${openIndex === index ? styles.open : ''}`}
                                onClick={() => toggle(index)}
                            >
                                {faq.q}
                                <span className={styles.icon}>▼</span>
                            </button>
                            <div className={`${styles.answer} ${openIndex === index ? styles.open : ''}`}>
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
