import { useAuth } from '../features/auth/useAuth.ts';
import { usePositions } from '../features/positions/usePositions.ts';
import { useSetPageTitle } from '../features/page-title/useSetPageTitle.ts';
import styles from './HomePage.module.css';

export function HomePage() {
  useSetPageTitle('Dashboard');
  const { user } = useAuth();
  const { positions } = usePositions();

  return (
    <>
      <div className={styles.pageHeader}>
        <p>Welcome back, {user?.first_name}! Here's your interview overview.</p>
      </div>

      {positions.length === 0 && (
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
          <p>Start by creating a position using the button in the sidebar.</p>
        </div>
      )}
    </>
  );
}
