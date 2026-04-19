import { useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Notification } from '../../types/notification.ts';
import { getNotificationUrl, getNotificationLinkLabel } from '../../lib/notifications-api.ts';
import styles from './NotificationItem.module.css';

interface Props {
  notification: Notification;
  onMarkRead: (id: number) => void;
}

export function NotificationItem({ notification, onMarkRead }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isUnread = notification.read_at === null;

  function toggleExpand() {
    const willOpen = !expanded;
    setExpanded(willOpen);
    if (willOpen && isUnread) {
      onMarkRead(notification.id);
    }
  }

  function handleRowKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExpand();
    }
  }

  function handleBangClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onMarkRead(notification.id);
  }

  return (
    <div className={styles.item}>
      <div
        role="button"
        tabIndex={0}
        className={styles.row}
        onClick={toggleExpand}
        onKeyDown={handleRowKeyDown}
        aria-expanded={expanded}
      >
        {isUnread && (
          <button
            type="button"
            className={styles.bang}
            title="Mark as read"
            aria-label="Mark as read"
            onClick={handleBangClick}
          >
            !
          </button>
        )}
        <span className={styles.title}>{notification.title}</span>
      </div>
      {expanded && (
        <div className={styles.body}>
          <div className={styles.bodyText}>{notification.body}</div>
          {(() => {
            const url = getNotificationUrl(notification);
            if (!url) return null;
            return (
              <Link to={url} className={styles.bodyLink}>
                {getNotificationLinkLabel(notification)}
              </Link>
            );
          })()}
        </div>
      )}
    </div>
  );
}
