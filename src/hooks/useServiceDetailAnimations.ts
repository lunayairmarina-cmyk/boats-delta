"use client";

import { MutableRefObject, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type AnimationRefs = {
    headerRef: MutableRefObject<HTMLElement | null>;
    imagesRef: MutableRefObject<HTMLElement | null>;
    descriptionRef: MutableRefObject<HTMLElement | null>;
    benefitsRef: MutableRefObject<HTMLElement | null>;
    relatedRef: MutableRefObject<HTMLElement | null>;
    dir: 'ltr' | 'rtl';
};

type SectionConfig = {
    ref: MutableRefObject<HTMLElement | null>;
    selector: string;
    from: gsap.TweenVars;
    to?: gsap.TweenVars;
};

export function useServiceDetailAnimations({
    headerRef,
    imagesRef,
    descriptionRef,
    benefitsRef,
    relatedRef,
    dir,
}: AnimationRefs) {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            if (headerRef.current) {
                const headerElements = headerRef.current.querySelectorAll('[data-animate="heading"]');
                const heroMedia = headerRef.current.querySelector('[data-animate="hero-media"]');
                const heroStats = headerRef.current.querySelectorAll('[data-animate="hero-stat"]');

                gsap.set([headerElements, heroMedia, heroStats], { opacity: 0, y: 50 });

                const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                tl.to(headerElements, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.08,
                })
                    .to(
                        heroMedia,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                        },
                        '-=0.4'
                    )
                    .to(
                        heroStats,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            stagger: 0.1,
                        },
                        '-=0.5'
                    );
            }

            const sections: SectionConfig[] = [
                {
                    ref: imagesRef,
                    selector: '[data-animate="images"]',
                    from: { opacity: 0, y: 60 },
                },
                {
                    ref: descriptionRef,
                    selector: '[data-animate="description"]',
                    from: { opacity: 0, y: 60 },
                },
                {
                    ref: benefitsRef,
                    selector: '[data-animate="benefit-card"]',
                    from: { opacity: 0, y: 80, rotationX: 10 },
                },
                {
                    ref: relatedRef,
                    selector: '[data-animate="related-card"]',
                    from: { opacity: 0, x: dir === 'rtl' ? 80 : -80, scale: 0.95 },
                },
            ];

            sections.forEach(({ ref, selector, from }) => {
                if (!ref.current) {
                    return;
                }

                const targets = ref.current.querySelectorAll(selector);
                if (!targets.length) {
                    return;
                }

                gsap.set(targets, from);

                ScrollTrigger.create({
                    trigger: ref.current,
                    start: 'top 85%',
                    once: true,
                    onEnter: () => {
                        gsap.to(targets, {
                            opacity: 1,
                            x: 0,
                            y: 0,
                            rotationX: 0,
                            scale: 1,
                            duration: 0.9,
                            stagger: 0.12,
                            ease: 'power3.out',
                        });
                    },
                });
            });
        });

        return () => {
            ctx.revert();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [headerRef, imagesRef, descriptionRef, benefitsRef, relatedRef, dir]);
}













