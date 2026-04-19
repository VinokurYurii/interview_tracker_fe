import type { Notification } from '../types/notification.ts';
import { apiClient } from './api-client.ts';

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await apiClient<Notification[]>('/api/notifications');
  return data;
}

export async function markNotificationRead(id: number): Promise<Notification> {
  const { data } = await apiClient<Notification>(
    `/api/notifications/${id}/mark_read`,
    { method: 'POST' },
  );
  return data;
}

export function getNotificationUrl(notification: Notification): string | null {
  switch (notification.notifiable_type) {
    case 'Position':
      return `/positions/${notification.notifiable_id}`;
    case 'InterviewStage': {
      const positionId = notification.metadata.position_id;
      if (!positionId) return null;
      return `/positions/${positionId}?stage=${notification.notifiable_id}`;
    }
  }
}

export function getNotificationLinkLabel(notification: Notification): string {
  switch (notification.notifiable_type) {
    case 'Position':
      return 'View Position';
    case 'InterviewStage':
      return 'View Interview Stage';
  }
}
