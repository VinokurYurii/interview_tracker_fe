export const STAGE_TYPES = [
  'hr', 'screening', 'technical', 'live_coding', 'system_design',
  'take_home', 'client', 'managerial', 'final', 'offer',
] as const;
export type StageType = typeof STAGE_TYPES[number];

export const STAGE_STATUSES = ['planned', 'done', 'declined'] as const;
export type StageStatus = typeof STAGE_STATUSES[number];

export const FEEDBACK_TYPES = ['self_review', 'company'] as const;
export type FeedbackType = typeof FEEDBACK_TYPES[number];

export const STAGE_TYPE_LABELS: Record<StageType, string> = {
  hr: 'HR',
  screening: 'Screening',
  technical: 'Technical',
  live_coding: 'Live Coding',
  system_design: 'System Design',
  take_home: 'Take Home',
  client: 'Client',
  managerial: 'Managerial',
  final: 'Final',
  offer: 'Offer',
};

export const FEEDBACK_TYPE_LABELS: Record<FeedbackType, string> = {
  self_review: 'Self Review',
  company: 'Company',
};

export interface Feedback {
  id: number;
  feedback_type: FeedbackType;
  content: string;
  interview_stage_id: number;
}

export interface InterviewStage {
  id: number;
  stage_type: StageType;
  status: StageStatus;
  scheduled_at: string | null;
  calendar_link: string | null;
  notes: string | null;
  position_id: number;
  feedbacks: Feedback[];
}

export interface CreateInterviewStageData {
  stage_type: StageType;
  status?: StageStatus;
  scheduled_at?: string;
  calendar_link?: string;
  notes?: string;
}

export interface UpdateInterviewStageData {
  stage_type?: StageType;
  status?: StageStatus;
  scheduled_at?: string | null;
  calendar_link?: string | null;
  notes?: string | null;
}

export interface CreateFeedbackData {
  feedback_type: FeedbackType;
  content: string;
}

export interface UpdateFeedbackData {
  content: string;
}
