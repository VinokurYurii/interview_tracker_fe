import styles from './AuthBranding.module.css';

export function AuthBranding() {
  return (
    <div className={styles.branding}>
      <div className={styles.content}>
        <div className={styles.logo}>IT</div>
        <h1 className={styles.title}>Interview Tracker</h1>
        <p className={styles.subtitle}>
          Your personal hub for managing job applications, tracking interview stages, and organizing feedback
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            Track your interview pipeline
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            Organize feedback and notes
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1c1e" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            Monitor application progress
          </div>
        </div>
      </div>
    </div>
  );
}
