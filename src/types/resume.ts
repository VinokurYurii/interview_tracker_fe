export interface Resume {
  id: number;
  name: string;
  default: boolean;
  file_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeRef {
  id: number;
  name: string;
}
