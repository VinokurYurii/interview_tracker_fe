export interface Notification {
  id: number;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  notifiable_id: number;
  notifiable_type: string;
}
