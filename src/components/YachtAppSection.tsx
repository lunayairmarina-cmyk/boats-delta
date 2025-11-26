"use client";

import styles from "./YachtAppSection.module.css";

export default function YachtAppSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <h1 className={styles.headline}>Manage Your Yacht Anytime, Anywhere.</h1>
          <p className={styles.description}>
            Experience seamless control over your vessel with our proprietary application. From crew scheduling to real-time expense tracking, everything is at your fingertips.
          </p>
          
          <div className={styles.featureButtons}>
            <button className={styles.featureButton}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" />
              </svg>
              Real-time Monitoring
            </button>
            <button className={styles.featureButton}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
                <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
              24/7 Support
            </button>
            <button className={styles.featureButton}>
              <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Booking Portal
            </button>
          </div>

          <button className={styles.downloadButton}>DOWNLOAD NOW</button>

          <div className={styles.appStoreButtons}>
            <button className={styles.appStoreButton}>
              <svg className={styles.appStoreIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 4.54 7.66 9.38 7.12c1.05-.07 2.05.37 3.08.42 1.03.05 2.09-.31 3.14-.26 1.32.05 2.42.49 3.33 1.39-2.8 1.69-2.35 5.09.48 6.13-.6 1.58-1.38 3.15-2.36 4.48zm-2.03-13.4c.58-.68.97-1.62.86-2.56-.83.05-1.84.57-2.43 1.28-.53.61-.99 1.59-.87 2.52.93.07 1.88-.49 2.44-1.24z"/>
              </svg>
              Download on the App Store
            </button>
            <button className={styles.appStoreButton}>
              <svg className={styles.appStoreIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              GET IT ON Google Play
            </button>
          </div>

          <div className={styles.testimonial}>
            <p className={styles.testimonialText}>
              "The most intuitive yacht management app I've ever used. It has completely streamlined our operations."
            </p>
            <p className={styles.testimonialAuthor}>- Captain Mark, M/Y Serenity</p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.phoneMockup}>
            <div className={styles.phoneScreen}>
              <div className={styles.phoneContent}>
                <div className={styles.phoneSection}>
                  <div className={styles.phoneHeader}>
                    <h3 className={styles.phoneTitle}>M/Y Serenity</h3>
                    <span className={styles.phoneStatus}>● Active</span>
                  </div>
                  <div className={styles.phoneCard}>
                    <p className={styles.phoneLabel}>Vessel Status</p>
                    <p className={styles.phoneValue}>All Systems Operational</p>
                  </div>
                  <div className={styles.phoneImage}>
                    <div className={styles.placeholderImage} style={{ background: 'linear-gradient(135deg, #0c4fad 0%, #084a9d 100%)' }}></div>
                  </div>
                </div>
                <div className={styles.phoneSection}>
                  <div className={styles.phoneCard}>
                    <p className={styles.phoneLabel}>Crew Schedule</p>
                    <p className={styles.phoneValue}>3 Active • 2 On Leave</p>
                  </div>
                  <div className={styles.phoneCard}>
                    <p className={styles.phoneLabel}>Next Maintenance</p>
                    <p className={styles.phoneValue}>Engine Service - Dec 15</p>
                  </div>
                  <div className={styles.phoneImage}>
                    <div className={styles.placeholderImage} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                  </div>
                </div>
                <div className={styles.phoneSection}>
                  <div className={styles.phoneCard}>
                    <p className={styles.phoneLabel}>Monthly Expenses</p>
                    <p className={styles.phoneValue}>$24,500 / $30,000</p>
                  </div>
                  <div className={styles.phoneImage}>
                    <div className={styles.placeholderImage} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

