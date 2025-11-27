"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useMobileMenuAnimations } from "@/hooks/useMobileMenuAnimations";
import { useDesktopNavbarAnimations } from "@/hooks/useDesktopNavbarAnimations";

export default function Navbar() {
    const pathname = usePathname();
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

    const navLinks = [
        { label: t('nav.home'), href: "/" },
        { label: t('nav.services'), href: "/services" },
        { label: t('nav.about'), href: "/about" },
        { label: t('nav.blog'), href: "/blog" },
        { label: t('nav.reviews'), href: "/#reviews" },
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
                            <span className={styles.menuItemText}>{link.label}</span>
                            <span className={styles.menuItemUnderline} aria-hidden="true" />
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
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
