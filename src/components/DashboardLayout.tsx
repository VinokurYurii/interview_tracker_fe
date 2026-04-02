import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth.ts';
import { usePositions } from '../features/positions/usePositions.ts';
import { PositionsProvider } from '../features/positions/PositionsContext.tsx';
import { PageTitleProvider } from '../features/page-title/PageTitleProvider.tsx';
import { usePageTitle } from '../features/page-title/usePageTitle.ts';
import { ThemeToggleSwitch } from './ThemeToggleSwitch.tsx';
import { CreatePositionModal } from './CreatePositionModal.tsx';
import styles from './DashboardLayout.module.css';

function DashboardLayoutInner() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { title } = usePageTitle();
  const { positions } = usePositions();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
          <Link to="/home" className={styles.logo}>
            <div className={styles.logoIcon}>IT</div>
            <span className={styles.logoText}>Interview Tracker</span>
          </Link>

          <nav className={styles.navSection}>
            <div className={styles.navLabel}>Positions</div>

            <button
              className={styles.createPositionBtn}
              onClick={() => setShowCreateModal(true)}
            >
              <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Position
            </button>

            {positions.map((position) => (
              <NavLink
                key={position.id}
                to={`/positions/${position.id}`}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <div className={styles.positionInfo}>
                  <span className={styles.positionTitle}>{position.title}</span>
                  <span className={styles.positionCompany}>
                    {position.company.name}
                  </span>
                </div>
              </NavLink>
            ))}
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
          <header className={styles.contentHeader}>
            <h1 className={styles.pageTitle}>{title}</h1>
            <Link to="/profile" className={styles.userLink}>
              {user?.first_name} {user?.last_name}
            </Link>
          </header>
          <Outlet />
        </main>
      </div>

      {showCreateModal && (
        <CreatePositionModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}

export function DashboardLayout() {
  return (
    <PositionsProvider>
      <PageTitleProvider>
        <DashboardLayoutInner />
      </PageTitleProvider>
    </PositionsProvider>
  );
}
