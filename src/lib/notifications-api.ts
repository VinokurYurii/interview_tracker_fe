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
