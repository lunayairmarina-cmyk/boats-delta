"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";
import { useLanguage } from "@/context/LanguageContext";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    brand: "facebook",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M22.675 0H1.325C.593 0 0 .6 0 1.333v21.334C0 23.4.593 24 1.325 24h11.498v-9.294H9.69v-3.62h3.133V8.414c0-3.11 1.893-4.81 4.659-4.81 1.325 0 2.463.1 2.795.144v3.24h-1.918c-1.505 0-1.797.72-1.797 1.768v2.27h3.59l-.468 3.62h-3.122V24h6.117C23.407 24 24 23.4 24 22.667V1.333C24 .6 23.407 0 22.675 0Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    brand: "instagram",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="6"
          ry="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    brand: "linkedin",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4.5 3.5a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6ZM2.5 9.1h4V21h-4V9.1Zm6.5 0h3.8v1.6h.1c.5-.9 1.8-1.9 3.6-1.9C20 8.8 21.5 11 21.5 14.4V21h-4v-6c0-1.4 0-3.3-2-3.3-2 0-2.3 1.5-2.3 3.2V21h-4V9.1Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    brand: "twitter",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 3h4.2l3.7 5.6L15.3 3h4.2l-5.9 8.5L19.9 21h-4.2l-4.1-6.2L7.5 21H3.3l6.2-9.2L4 3Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Snapchat",
    href: "https://snapchat.com",
    brand: "snapchat",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5c2.6 0 4.6 1.9 4.6 4.5 0 1.4-.3 2.7-.3 2.7s.1.7.9 1.3c.8.6 1.9.7 1.9.7v2.1c-.8.2-1.7.5-2.1.9-.5.4-.5.8-.4 1.2 0 0 .8.9 1.9 1l-.4 1.9c-1.1-.1-2.2-.5-3-.9-.7-.3-1.1-.1-1.7.1-.6.2-1.5.5-2.5.5s-1.9-.3-2.5-.5c-.6-.2-1-.4-1.7-.1-.8.3-1.9.8-3 .9l-.4-1.9c1.1-.1 1.9-1 1.9-1 .1-.4.1-.8-.4-1.2-.4-.4-1.3-.7-2.1-.9v-2.1s1.1-.1 1.9-.7.9-1.3.9-1.3-.3-1.3-.3-2.7C7.4 4.4 9.4 2.5 12 2.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://whatsapp.com",
    brand: "whatsapp",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12.04 2C6.59 2 2.13 6.3 2.13 11.62c0 2.13.78 4.08 2.08 5.64L3 22l4.93-1.6c1.27.41 2.64.63 4.1.63 5.45 0 9.91-4.3 9.91-9.62C21.94 6.3 17.49 2 12.04 2Zm5.64 12.92c-.24.67-1.38 1.27-1.9 1.34-.49.07-1.11.1-1.79-.11-.41-.13-.94-.3-1.62-.58-2.85-1.19-4.7-3.97-4.84-4.15-.14-.19-1.16-1.55-1.16-2.95 0-1.41.74-2.1 1-2.39.24-.27.64-.4 1.03-.4.12 0 .23 0 .33.01.29.02.43.03.62.48.24.58.82 2.01.89 2.16.07.15.12.33.04.52-.07.19-.11.31-.21.48-.1.17-.22.38-.32.51-.11.13-.23.27-.1.51.12.24.5.81 1.07 1.32.74.66 1.36.86 1.6.97.24.11.38.09.52-.05.14-.15.6-.69.76-.93.16-.24.32-.2.55-.12.22.07 1.4.67 1.64.79.24.12.4.18.46.28.05.1.05.64-.19 1.31Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.copyBlock}>
          <div className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx}>★</span>
            ))}
          </div>
          <p className={styles.scriptTitle}>{t('footer.readyTitle')}</p>
          <div className={styles.logoContainer}>
            <Image
              src="/LM Logo.svg"
              alt="Lunier Marina Logo"
              width={200}
              height={80}
              className={styles.logoImage}
            />
          </div>
          <p className={styles.subtitle}>
            {t('footer.slogan')}
          </p>
          <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            <p>{t('footer.address')}</p>
            <p dir="ltr">{t('footer.phone')}</p>
            <p>{t('footer.email')}</p>
          </div>
          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialCard}
                data-brand={social.brand}
                aria-label={social.name}
              >
                <span className={styles.socialIcon}>{social.icon}</span>
                <span className={styles.visuallyHidden}>{social.name}</span>
              </Link>
            ))}
          </div>
          <Link href="/contact" className={styles.ctaBtn}>
            <span>{t('nav.connect')}</span>
            <span aria-hidden="true">➝</span>
          </Link>
        </div>

        <button type="button" className={styles.arrowBtn} aria-label="Next">
          ➝
        </button>

        <ul className={styles.linkList}>
          <li><a href="https://seaexpertis.com/" target="_blank" rel="noopener noreferrer">Sea Expertis</a></li>
          <li><a href="https://boatpro.club/" target="_blank" rel="noopener noreferrer">Boat Pro</a></li>
        </ul>
      </div>
    </footer>
  );
}


