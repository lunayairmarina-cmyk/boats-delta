"use client";

import Link from "next/link";
import Image from "next/image";
import RotatingBorderButton from "@/components/RotatingBorderButton";
import styles from "./RelationshipSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ContourPattern from "@/components/ContourPattern";

export default function RelationshipSection() {
    const { t } = useLanguage();
    const sectionRef = useRef<HTMLElement>(null);
    const whyWidgetRef = useRef<HTMLDivElement>(null);
    const dashboardWidgetRef = useRef<HTMLDivElement>(null);
    const barsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Animate Why Widget
            gsap.fromTo(whyWidgetRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: whyWidgetRef.current,
                        start: "top 80%",
                    }
                }
            );

            // Animate Dashboard Widget
            gsap.fromTo(dashboardWidgetRef.current,
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: dashboardWidgetRef.current,
                        start: "top 75%",
                    }
                }
            );

            // Animate Bars
            if (barsRef.current) {
                const bars = barsRef.current.children;
                gsap.fromTo(bars,
                    { scaleY: 0, transformOrigin: "bottom" },
                    {
                        scaleY: 1,
                        duration: 1.5,
                        stagger: 0.1,
                        ease: "elastic.out(1, 0.5)",
                        scrollTrigger: {
                            trigger: barsRef.current,
                            start: "top 85%",
                        }
                    }
                );
            }

            // Animate Heatmap dots
            const heatmapDots = document.querySelectorAll(`.${styles.metricHeatmap} span`);
            if (heatmapDots.length > 0) {
                gsap.fromTo(heatmapDots,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.5,
                        stagger: {
                            amount: 1,
                            grid: [4, 7],
                            from: "center"
                        },
                        ease: "back.out(1.7)",
                        scrollTrigger: {
                            trigger: `.${styles.metricHeatmap}`,
                            start: "top 85%",
                        }
                    }
                );
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className={styles.relationshipSection} ref={sectionRef}>
            {/* --- Widget 1: Why Choose --- */}
            <div className={styles.whyWidget} ref={whyWidgetRef}>
                <ContourPattern className={styles.contourBackground} opacity={0.4} />
                <div className={styles.whyText}>
                    <span className={styles.whyBadge}>
                        {t('why_choose_us.title')}
                    </span>
                    <h2>
                        {t('why_choose_us.experience_title')}
                    </h2>
                    <div className={styles.whyBody}>
                        <p>{t('why_choose_us.experience_desc')}</p>
                    </div>
                    <Link href="/contact" className={styles.conicButtonLink}>
                        <RotatingBorderButton text={t('hero.cta_know_more')} />
                    </Link>
                </div>

                <div className={styles.whyPhoto}>
                    <Image
                        src="/api/images/slug/relationship-crew"
                        alt="Professional yacht crew team at the marina"
                        width={520}
                        height={520}
                        className={styles.whyImage}
                        sizes="(max-width: 768px) 100vw, 520px"
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Widget 2: Relationship / Dashboard */}
            <div className={styles.dashboardWidget} ref={dashboardWidgetRef}>
                <ContourPattern className={styles.contourBackground} />
                <div className={styles.analyticsColumn}>
                    <div className={styles.serviceListCard}>
                        <div className={styles.serviceListHeader}>
                            <div className={styles.serviceListIcon}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <span>{t('relationship_section.badge')}</span>
                        </div>
                        <div className={styles.serviceListItems}>
                            {[
                                { name: "Bottom Paint", date: "Sep 15 2024", status: "warning" },
                                { name: "Engine Service", date: "Aug 14 2024", status: "danger" },
                                { name: "Drive Service", date: "No Due Date", status: "success" },
                                { name: "Generator Service", date: "Sep 15 2024", status: "danger" },
                                { name: "Seakeeper service", date: "Aug 10 2024", status: "warning" },
                                { name: "AC Service", date: "No Due Date", status: "success" },
                            ].map((service, index) => (
                                <div key={index} className={styles.serviceItem}>
                                    <div className={styles.serviceInfo}>
                                        <span className={styles.serviceLabel}>Service type</span>
                                        <span className={styles.serviceName}>{service.name}</span>
                                    </div>
                                    <div className={styles.serviceDate}>
                                        <span className={styles.serviceLabel}>Due date</span>
                                        <span className={`${styles.serviceStatus} ${styles[service.status]}`}>
                                            {service.date}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.serviceListFooter}>
                            <div className={styles.footerIcon}></div>
                            <div className={styles.footerIcon}></div>
                            <div className={styles.footerIcon}></div>
                            <div className={styles.footerIcon}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.relationshipCopy}>
                    <h3>
                        {t('relationship_section.title')}
                    </h3>
                    <svg width="60" height="10" viewBox="0 0 60 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.wavyLine}>
                        <path d="M1 5C1 5 5 1 10 1C15 1 15 9 20 9C25 9 25 1 30 1C35 1 35 9 40 9C45 9 45 1 50 1C55 1 59 5 59 5" stroke="#0f1f53" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <p>
                        {t('relationship_section.description')}
                    </p>
                    <Link href="/app" className={styles.conicButtonLink}>
                        <RotatingBorderButton text={t('hero.cta_know_more')} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
