import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth.ts';
import { ThemeToggleSwitch } from '../components/ThemeToggleSwitch.tsx';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/welcome');
  }

  return (
    <>
      <button
        className={`${styles.mobileMenuToggle} ${sidebarOpen ? styles.active : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <div className={styles.hamburger}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.active : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className={styles.dashboard}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.active : ''}`}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>IT</div>
            <span className={styles.logoText}>Interview Tracker</span>
          </div>

          <nav className={styles.navSection}>
            <div className={styles.navLabel}>Main Menu</div>
            <a href="/home" className={`${styles.navItem} ${styles.navItemActive}`}>
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Dashboard
            </a>
          </nav>

          <div className={styles.sidebarFooter}>
            <ThemeToggleSwitch />
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.first_name}! Here's your interview overview.</p>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h2>Your dashboard is ready</h2>
            <p>Start by adding companies and positions to track your interviews.</p>
          </div>
        </main>
      </div>
    </>
  );
}
