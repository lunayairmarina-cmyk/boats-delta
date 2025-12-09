import React, { useId } from 'react';
import styles from './SectionSeparator.module.css';

export default function SectionSeparator() {
    const id = useId();
    const gradientId1 = `goldGradient-${id}`;
    const gradientId2 = `goldGradientStrong-${id}`;

    return (
        <div className={styles.separator}>
            <svg
                className={styles.wave}
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id={gradientId1} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#BF953F" stopOpacity="0.15" />
                        <stop offset="50%" stopColor="#FCF6BA" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#B38728" stopOpacity="0.15" />
                    </linearGradient>
                    <linearGradient id={gradientId2} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#BF953F" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="#FCF6BA" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#B38728" stopOpacity="0.25" />
                    </linearGradient>
                </defs>
                {/* Main wave */}
                <path
                    d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z"
                    fill={`url(#${gradientId1})`}
                />
                {/* Secondary wave */}
                <path
                    d="M0,80 C300,40 600,100 900,70 C1200,40 1320,90 1440,70 L1440,120 L0,120 Z"
                    fill={`url(#${gradientId2})`}
                />
                {/* Accent line */}
                <path
                    d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60"
                    stroke="#BF953F"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.4"
                />
            </svg>
            <div className={styles.decorativeLine}></div>
        </div>
    );
}

