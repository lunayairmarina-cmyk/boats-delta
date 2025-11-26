import Link from 'next/link';
import { ReactNode } from 'react';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className={styles.shell}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.sidebarTitle}>Admin Panel</h1>
                </div>
                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navLink}>
                        Dashboard
                    </Link>
                    <Link href="/" className={`${styles.navLink} ${styles.navLinkSecondary}`}>
                        View Site
                    </Link>
                </nav>
                <div className={styles.sidebarFooter}>
                    <button className={styles.logout}>
                        Logout
                    </button>
                </div>
            </aside>

            <div className={styles.main}>
                <header className={styles.topBar}>
                    <h2 className={styles.topBarTitle}>Dashboard Overview</h2>
                    <div className={styles.userMeta}>
                        <span className={styles.userEmail}>admin@example.com</span>
                        <div className={styles.userBadge}>
                            A
                        </div>
                    </div>
                </header>

                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
