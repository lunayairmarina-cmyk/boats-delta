"use client";

import Link from "next/link";
import Image from "next/image";
import RotatingBorderButton from "@/components/RotatingBorderButton";
import styles from "./RelationshipSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
            {/* Widget 1: Why Choose */}
            <div className={styles.whyWidget} ref={whyWidgetRef}>
                <div className={styles.whyText}>
                    <p className={styles.whyBadge}>{t('why_choose_us.title')}</p>
                    <h2>
                        {t('why_choose_us.experience_title')}
                    </h2>
                    <p className={styles.whyBody}>
                        {t('why_choose_us.experience_desc')}
                    </p>
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
                <div className={styles.analyticsColumn}>
                    <div className={styles.metricPrimary}>
                        <header>
                            <p>{t('dashboard.title')}</p>
                            <strong>{t('dashboard.efficiency')}</strong>
                        </header>
                        <div className={styles.barChart} ref={barsRef}>
                            <div className={styles.bar} style={{ height: "40%" }}></div>
                            <div className={styles.bar} style={{ height: "70%" }}></div>
                            <div className={styles.bar} style={{ height: "50%" }}></div>
                            <div className={styles.bar} style={{ height: "85%" }}></div>
                            <div className={styles.bar} style={{ height: "60%" }}></div>
                        </div>
                    </div>
                    <div className={styles.metricHeatmap}>
                        {Array.from({ length: 28 }).map((_, i) => (
                            <span
                                key={i}
                                style={{ opacity: i % 3 === 0 || i % 5 === 0 ? 1 : 0.3 }}
                            ></span>
                        ))}
                    </div>
                    <div className={styles.metricSignal}>
                        <div className={styles.signalLine}>
                            <div className={styles.signalDot}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.relationshipCopy}>
                    <p className={styles.relationshipBadge}>
                        {t('why_choose_us.service_title')}
                    </p>
                    <h3>
                        {t('why_choose_us.service_title')}
                    </h3>
                    <p>
                        {t('why_choose_us.service_desc')}
                    </p>
                    <Link href="/contact" className={styles.conicButtonLink}>
                        <RotatingBorderButton text={t('hero.cta_know_more')} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
