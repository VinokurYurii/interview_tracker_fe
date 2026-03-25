import { Link } from 'react-router-dom';
import { ThemeToggleButton } from '../components/ThemeToggleButton.tsx';
import styles from './WelcomePage.module.css';

export function WelcomePage() {
  return (
    <div className={styles.page}>
      <ThemeToggleButton />
      <div className={styles.content}>
        <div className={styles.logo}>IT</div>
        <h1 className={styles.title}>Interview Tracker</h1>
        <p className={styles.subtitle}>
          Manage your job applications, track interview stages, and land your next role.
        </p>
        <div className={styles.actions}>
          <Link to="/login" className={styles.btnPrimary}>Sign In</Link>
          <Link to="/signup" className={styles.btnSecondary}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
