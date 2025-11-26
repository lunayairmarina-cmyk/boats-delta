"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentHash, setCurrentHash] = useState(() => (typeof window !== "undefined" ? window.location.hash : ""));
    const { t, language, setLanguage } = useLanguage();

    const navLinks = [
        { label: t('nav.home'), href: "/" },
        { label: t('nav.services'), href: "/services" },
        { label: t('nav.about'), href: "/about" },
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
        scrolled ? styles.navbarScrolled : "",
        menuOpen ? styles.navbarMenuOpen : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <header className={headerClassNames}>
            <Link href="/" className={styles.brandMark}>
                <Image
                    src="/LM Mark.svg"
                    alt="Lunier Marina Monogram"
                    width={1000}
                    height={1000}
                    className={styles.logoImage}
                    priority
                />
            </Link>

            <nav className={styles.menu}>
                {navLinks.map((link) => {
                    const [basePath, hashFragment] = link.href.split("#");
                    const isSectionLink = Boolean(hashFragment);
                    const targetHash = hashFragment ? `#${hashFragment}` : "";
                    const isActive = isSectionLink
                        ? pathname === basePath && currentHash === targetHash
                        : pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                            onClick={handleNavLinkSelect}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.desktopActions}>
                <button onClick={toggleLanguage} className={styles.menuItem} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}>
                    {language === 'en' ? 'العربية' : 'English'}
                </button>
                <Link href="/contact" className={styles.connectBtn}>
                    {t('nav.connect')}
                </Link>
            </div>

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
                className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""} ${scrolled ? styles.mobileMenuScrolled : ""}`}
                role="dialog"
                aria-modal="false"
                onClick={toggleMenu}
            >
                <div className={styles.mobileMenuContent} onClick={(event) => event.stopPropagation()}>
                    <nav>
                        {navLinks.map((link) => {
                            const [basePath, hashFragment] = link.href.split("#");
                            const isSectionLink = Boolean(hashFragment);
                            const targetHash = hashFragment ? `#${hashFragment}` : "";
                            const isActive = isSectionLink
                                ? pathname === basePath && currentHash === targetHash
                                : pathname === link.href;
                            return (
                                <Link
                                    key={`mobile-${link.href}`}
                                    href={link.href}
                                    className={`${styles.mobileMenuItem} ${isActive ? styles.mobileMenuItemActive : ""}`}
                                    onClick={handleNavLinkSelect}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <button onClick={toggleLanguage} className={styles.mobileLanguage}>
                        {language === 'en' ? 'العربية' : 'English'}
                    </button>
                    <Link href="/contact" className={styles.mobileCta}>
                        {t('nav.connect')}
                    </Link>
                </div>
            </div>
        </header>
    );
}
