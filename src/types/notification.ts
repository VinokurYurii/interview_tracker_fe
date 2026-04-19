export type NotifiableType = 'Position' | 'InterviewStage';

export interface Notification {
  id: number;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  notifiable_id: number;
  notifiable_type: NotifiableType;
  metadata: { position_id?: number };
}
