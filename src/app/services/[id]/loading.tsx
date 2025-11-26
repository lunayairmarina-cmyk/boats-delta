import styles from '@/components/services/detail/ServiceDetail.module.css';

const shimmer = {
    background:
        'linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.18) 37%, rgba(255,255,255,0.08) 63%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.6s linear infinite',
};

export default function LoadingServiceDetail() {
    return (
        <div className={styles.page} aria-busy="true">
            <section className={`${styles.section} ${styles.heroSection}`}>
                <div className={styles.heroContent} style={{ gap: '24px' }}>
                    <div style={{ width: '140px', height: '32px', borderRadius: '999px', ...shimmer }} />
                    <div style={{ width: '80%', height: '48px', borderRadius: '12px', ...shimmer }} />
                    <div style={{ width: '100%', height: '80px', borderRadius: '20px', ...shimmer }} />
                    <div style={{ width: '60%', height: '20px', borderRadius: '12px', ...shimmer }} />
                </div>
                <div className={styles.heroMedia}>
                    <div style={{ width: '100%', height: '420px', borderRadius: '32px', ...shimmer }} />
                </div>
            </section>
        </div>
    );
}

