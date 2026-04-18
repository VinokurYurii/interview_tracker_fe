import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthUser } from '../../features/auth/useAuthUser.ts';
import { useSetPageTitle } from '../../features/page-title/useSetPageTitle.ts';
import { ApiError } from '../../lib/api-client.ts';
import { ResumeList } from './ResumeList.tsx';
import { Notifications } from './Notifications.tsx';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  useSetPageTitle('Profile');

  const { user, updateUser } = useAuthUser();
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasChanges = firstName !== user.first_name || lastName !== user.last_name;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await updateUser({ first_name: firstName, last_name: lastName });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.leftColumn}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="first-name">First Name</label>
              <input
                id="first-name"
                className="form-input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="last-name">Last Name</label>
              <input
                id="last-name"
                className="form-input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <span className="form-label">Email</span>
              <span className={styles.emailValue}>{user.email}</span>
            </div>

            <button
              type="submit"
              className="btn primary"
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>My Resumes</h2>
          <ResumeList />
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Notifications</h2>
          <Notifications />
        </div>
      </div>
    </div>
  );
}
