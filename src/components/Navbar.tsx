"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useMobileMenuAnimations } from "@/hooks/useMobileMenuAnimations";
import { useDesktopNavbarAnimations } from "@/hooks/useDesktopNavbarAnimations";
import { Anchor, Ship, Wrench, ClipboardList, Users, Sparkles } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState(() => (typeof window !== "undefined" ? window.location.hash : ""));
    const { t, language, setLanguage, dir } = useLanguage();

    // Check if we're on a blog page (must be defined before hook calls)
    const isBlogPage = pathname.startsWith('/blog');

    const {
        overlayRef,
        drawerRef,
        closeButtonRef,
        menuItemsRef,
        languageButtonRef: mobileLanguageButtonRef,
        ctaButtonRef: mobileCtaButtonRef,
    } = useMobileMenuAnimations({
        menuOpen,
        isRTL: dir === "rtl",
    });

    const {
        navbarRef,
        logoRef,
        navLinksRef,
        languageButtonRef: desktopLanguageButtonRef,
        ctaButtonRef: desktopCtaButtonRef,
        menuContainerRef,
    } = useDesktopNavbarAnimations({
        scrolled,
        isRTL: dir === "rtl",
        isBlogPage,
    });
    const serviceItems = [
        {
            label: language === 'ar' ? 'إدارة اليخوت' : 'Yacht Management',
            subtitle: language === 'ar' ? 'إدارة شاملة 360°' : 'Complete 360° Management',
            href: "/services/yacht-boat-management",
            icon: <Anchor size={24} strokeWidth={1.5} />
        },
        {
            label: language === 'ar' ? 'خدمات المراسي' : 'Marina Services',
            subtitle: language === 'ar' ? 'تشغيل المراسي المتميز' : 'Premium Marina Operations',
            href: "/services/yacht-marina-management",
            icon: <Ship size={24} strokeWidth={1.5} />
        },
        {
            label: language === 'ar' ? 'الصيانة' : 'Maintenance',
            subtitle: language === 'ar' ? 'العناية الفنية المتخصصة' : 'Expert Technical Care',
            href: "/services/maintenance",
            icon: <Wrench size={24} strokeWidth={1.5} />
        },
        {
            label: language === 'ar' ? 'إدارة المشاريع' : 'Project Management',
            subtitle: language === 'ar' ? 'الإشراف على المشاريع البحرية' : 'Maritime Project Oversight',
            href: "/services/project_management",
            icon: <ClipboardList size={24} strokeWidth={1.5} />
        },
        {
            label: language === 'ar' ? 'القبطان والطاقم' : 'Captain & Crew',
            subtitle: language === 'ar' ? 'توظيف طاقم محترف' : 'Professional Crew Recruitment',
            href: "/services/captain_crew",
            icon: <Users size={24} strokeWidth={1.5} />
        },
        {
            label: language === 'ar' ? 'خدمات الكونسيرج' : 'Concierge',
            subtitle: language === 'ar' ? 'خدمات ضيافة فاخرة' : 'Luxury Hospitality Services',
            href: "/services/concierge",
            icon: <Sparkles size={24} strokeWidth={1.5} />
        },
    ];

    const navLinks = [
        { label: t('nav.home'), href: "/" },
        {
            label: t('nav.services'),
            href: "/services",
            isMegaMenu: true,
            children: serviceItems
        },
        { label: t('nav.about'), href: "/about" },
        { label: t('nav.blog'), href: "/blog" },
        { label: "App", href: "/app" },
        { label: t('nav.faq'), href: "/#faq" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const updateHash = () => {
            if (typeof window !== "undefined") {
                setCurrentHash(window.location.hash);
            }
        };
        updateHash();
        window.addEventListener("hashchange", updateHash);
        return () => window.removeEventListener("hashchange", updateHash);
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const handleNavLinkSelect = () => {
        setMenuOpen(false);
    };

    const handleServiceLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Close mobile menu if open
        setMenuOpen(false);
        // Let Next.js Link handle navigation, but ensure scroll to top
        router.push(href);
        // Scroll to top immediately
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    };

    useEffect(() => {
        if (typeof document === "undefined") return undefined;

        const { body, documentElement } = document;

        if (menuOpen) {
            body.style.overflow = "hidden";
            documentElement.style.overflow = "hidden";
        } else {
            body.style.overflow = "";
            documentElement.style.overflow = "";
        }

        return () => {
            body.style.overflow = "";
            documentElement.style.overflow = "";
        };
    }, [menuOpen]);

    const headerClassNames = [
        styles.navbar,
        isBlogPage ? styles.navbarBlogPage : "",
        scrolled || isBlogPage ? styles.navbarScrolled : "",
        menuOpen ? styles.navbarMenuOpen : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <header ref={navbarRef} className={headerClassNames} data-dir={dir}>
            <Link ref={logoRef} href="/" className={styles.brandMark}>
                <Image
                    src="/LM Mark.svg"
                    alt="Lunier Marina Monogram"
                    width={1000}
                    height={1000}
                    className={styles.logoImage}
                    priority
                />
            </Link>

            <nav ref={menuContainerRef} className={styles.menu}>
                {navLinks.map((link, index) => {
                    const [basePath, hashFragment] = link.href.split("#");
                    const isSectionLink = Boolean(hashFragment);
                    const targetHash = hashFragment ? `#${hashFragment}` : "";
                    const isActive = isSectionLink
                        ? pathname === basePath && currentHash === targetHash
                        : pathname === link.href;

                    if (link.children && link.isMegaMenu) {
                        return (
                            <div
                                key={link.href}
                                className={styles.menuItemWrapper}
                            >
                                <Link
                                    ref={(el) => {
                                        if (el) navLinksRef.current[index] = el;
                                    }}
                                    href={link.href}
                                    className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                                    onClick={handleNavLinkSelect}
                                >
                                    <span className={styles.menuItemText}>
                                        {link.label}
                                        <svg className={styles.dropdownArrow} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className={styles.menuItemUnderline} aria-hidden="true" />
                                    </span>
                                </Link>
                                <div className={styles.megaDropdown} data-dir={dir}>
                                    <div className={styles.megaDropdownBackground} />
                                    <div className={styles.megaDropdownContent}>
                                        <div className={styles.megaDropdownHeader}>
                                            <span className={styles.megaDropdownBadge}>
                                                {language === 'ar' ? 'خدماتنا المتميزة' : 'Premium Services'}
                                            </span>
                                            <h3 className={styles.megaDropdownTitle}>
                                                {language === 'ar' ? 'استكشف خدماتنا البحرية' : 'Explore Our Marine Services'}
                                            </h3>
                                        </div>
                                        <div className={styles.megaDropdownGrid}>
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={styles.megaDropdownCard}
                                                    onClick={(e) => handleServiceLinkClick(e, child.href)}
                                                >
                                                    <div className={styles.megaCardIcon}>
                                                        <span className={styles.megaCardIconEmoji}>{child.icon}</span>
                                                        <div className={styles.megaCardIconGlow} />
                                                    </div>
                                                    <div className={styles.megaCardContent}>
                                                        <h4 className={styles.megaCardTitle}>{child.label}</h4>
                                                        <p className={styles.megaCardSubtitle}>{child.subtitle}</p>
                                                    </div>
                                                    <div className={styles.megaCardArrow}>
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className={styles.megaDropdownFooter}>
                                            <Link href="/services" className={styles.megaDropdownViewAll} onClick={handleNavLinkSelect}>
                                                <span>{language === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}</span>
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.75 9H14.25M14.25 9L9 3.75M14.25 9L9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={link.href}
                            ref={(el) => {
                                if (el) navLinksRef.current[index] = el;
                            }}
                            href={link.href}
                            className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                            onClick={handleNavLinkSelect}
                        >
                            <span className={styles.menuItemText}>
                                {link.label}
                                <span className={styles.menuItemUnderline} aria-hidden="true" />
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.desktopActions}>
                <button
                    ref={desktopLanguageButtonRef}
                    onClick={toggleLanguage}
                    className={styles.languageButton}
                    aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
                >
                    <span className={styles.languageButtonText}>
                        {language === 'en' ? 'العربية' : 'English'}
                    </span>
                </button>
                <Link ref={desktopCtaButtonRef} href="/contact" className={styles.connectBtn}>
                    <span className={styles.connectBtnText}>{t('nav.connect')}</span>
                </Link>
            </div>

            {isBlogPage ? (
                <Link href="/" className={styles.blogBackLink} aria-label="Back to home">
                    <span aria-hidden="true">←</span>
                    {language === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
                </Link>
            ) : (
                <>
                    <button
                        type="button"
                        className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleActive : ""}`}
                        onClick={toggleMenu}
                        aria-expanded={menuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <div
                        ref={overlayRef}
                        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""} ${scrolled ? styles.mobileMenuScrolled : ""} ${isBlogPage ? styles.mobileMenuBlogPage : ""}`}
                        role="dialog"
                        aria-modal={menuOpen}
                        aria-label="Navigation menu"
                        onClick={toggleMenu}
                        data-dir={dir}
                    >
                        <div
                            ref={drawerRef}
                            className={styles.mobileMenuContent}
                            onClick={(event) => event.stopPropagation()}
                            data-dir={dir}
                        >
                            <button
                                ref={closeButtonRef}
                                type="button"
                                className={styles.mobileMenuClose}
                                onClick={toggleMenu}
                                aria-label={t('nav.close') || "Close menu"}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <nav className={styles.mobileMenuNav}>
                                {navLinks.map((link, index) => {
                                    const [basePath, hashFragment] = link.href.split("#");
                                    const isSectionLink = Boolean(hashFragment);
                                    const targetHash = hashFragment ? `#${hashFragment}` : "";
                                    const isActive = isSectionLink
                                        ? pathname === basePath && currentHash === targetHash
                                        : pathname === link.href;
                                    return (
                                        <Link
                                            key={`mobile-${link.href}`}
                                            ref={(el) => {
                                                if (el) menuItemsRef.current[index] = el;
                                            }}
                                            href={link.href}
                                            className={`${styles.mobileMenuItem} ${isActive ? styles.mobileMenuItemActive : ""}`}
                                            onClick={handleNavLinkSelect}
                                        >
                                            <span className={styles.mobileMenuItemText}>{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                            <button
                                ref={mobileLanguageButtonRef}
                                onClick={toggleLanguage}
                                className={styles.mobileLanguage}
                            >
                                {language === 'en' ? 'العربية' : 'English'}
                            </button>
                            <Link
                                ref={mobileCtaButtonRef}
                                href="/contact"
                                className={styles.mobileCta}
                                onClick={handleNavLinkSelect}
                            >
                                {t('nav.connect')}
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
