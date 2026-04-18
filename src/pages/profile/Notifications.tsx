import { useCallback, useEffect, useState } from 'react';
import type { Notification } from '../../types/notification.ts';
import { getNotifications, markNotificationRead } from '../../lib/notifications-api.ts';
import { useAuth } from '../../features/auth/useAuth.ts';
import { ApiError } from '../../lib/api-client.ts';
import { NotificationItem } from './NotificationItem.tsx';
import styles from './Notifications.module.css';

// TODO: when BE provides a stable enum for `notifiable_type`, add a click-to-navigate
// affordance that opens the related resource (position / interview stage / resume).

export function Notifications() {
  const { refreshUser, decrementUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const [data] = await Promise.all([getNotifications(), refreshUser()]);
      setNotifications(data);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    load();
  }, [load]);

  const handleMarkRead = useCallback(
    async (id: number) => {
      setActionError('');
      try {
        const updated = await markNotificationRead(id);
        setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
        decrementUnreadCount();
      } catch (err) {
        setActionError(err instanceof ApiError ? err.message : 'Failed to mark as read');
      }
    },
    [decrementUnreadCount],
  );

  if (isLoading) {
    return <div className={styles.status}>Loading...</div>;
  }

  if (loadError) {
    return (
      <div className={styles.errorBlock}>
        <div className={styles.errorText}>{loadError}</div>
        <button type="button" className="btn secondary" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  if (notifications.length === 0) {
    return <div className={styles.status}>No notifications yet.</div>;
  }

  return (
    <div className={styles.list}>
      {actionError && <div className={styles.errorText}>{actionError}</div>}
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={handleMarkRead}
        />
      ))}
    </div>
  );
}
