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

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ResumeAnalysis {
  content: string | null;
  status: AnalysisStatus;
  updated_at: string;
}

export interface ResumeDetail extends Resume {
  resume_analysis: ResumeAnalysis | null;
}
