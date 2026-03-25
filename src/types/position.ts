export const POSITION_STATUSES = ['active', 'rejected', 'offer', 'accepted'] as const;
export type PositionStatus = typeof POSITION_STATUSES[number];

export interface PositionCompany {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  title: string;
  description: string | null;
  vacancy_url: string | null;
  status: PositionStatus;
  company_id: number;
  user_id: number;
}

export interface PositionWithCompany extends Position {
  company: PositionCompany;
}

export interface CreatePositionData {
  title: string;
  company_id: number;
  description?: string;
  vacancy_url?: string;
  status?: PositionStatus;
}

export interface UpdatePositionData {
  title?: string;
  description?: string;
  vacancy_url?: string;
  status?: PositionStatus;
}
