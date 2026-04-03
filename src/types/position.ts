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

export interface PositionResume {
  id: number;
  name: string;
}

export interface PositionWithCompany extends Position {
  company: PositionCompany;
  resume: PositionResume | null;
}

export interface CreatePositionData {
  title: string;
  company_id: number;
  description?: string;
  vacancy_url?: string;
  status?: PositionStatus;
  resume_id?: number | null;
}

export interface UpdatePositionData {
  title?: string;
  description?: string;
  vacancy_url?: string;
  status?: PositionStatus;
  resume_id?: number | null;
}
