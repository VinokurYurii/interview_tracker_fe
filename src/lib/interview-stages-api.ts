import type {
  InterviewStage,
  Feedback,
  CreateInterviewStageData,
  UpdateInterviewStageData,
  CreateFeedbackData,
  UpdateFeedbackData,
} from '../types/interview-stage.ts';
import { apiClient } from './api-client.ts';

export async function getInterviewStages(positionId: number): Promise<InterviewStage[]> {
  const { data } = await apiClient<InterviewStage[]>(
    `/api/positions/${positionId}/interview_stages`,
  );
  return data;
}

export async function createInterviewStage(
  positionId: number,
  stageData: CreateInterviewStageData,
): Promise<InterviewStage> {
  const { data } = await apiClient<InterviewStage>(
    `/api/positions/${positionId}/interview_stages`,
    {
      method: 'POST',
      body: JSON.stringify({ interview_stage: stageData }),
    },
  );
  return data;
}

export async function updateInterviewStage(
  positionId: number,
  stageId: number,
  stageData: UpdateInterviewStageData,
): Promise<InterviewStage> {
  const { data } = await apiClient<InterviewStage>(
    `/api/positions/${positionId}/interview_stages/${stageId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ interview_stage: stageData }),
    },
  );
  return data;
}

export async function deleteInterviewStage(
  positionId: number,
  stageId: number,
): Promise<void> {
  await apiClient<null>(
    `/api/positions/${positionId}/interview_stages/${stageId}`,
    { method: 'DELETE' },
  );
}

export async function createFeedback(
  positionId: number,
  stageId: number,
  feedbackData: CreateFeedbackData,
): Promise<Feedback> {
  const { data } = await apiClient<Feedback>(
    `/api/positions/${positionId}/interview_stages/${stageId}/feedbacks`,
    {
      method: 'POST',
      body: JSON.stringify({ feedback: feedbackData }),
    },
  );
  return data;
}

export async function updateFeedback(
  positionId: number,
  stageId: number,
  feedbackId: number,
  feedbackData: UpdateFeedbackData,
): Promise<Feedback> {
  const { data } = await apiClient<Feedback>(
    `/api/positions/${positionId}/interview_stages/${stageId}/feedbacks/${feedbackId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ feedback: feedbackData }),
    },
  );
  return data;
}

export async function deleteFeedback(
  positionId: number,
  stageId: number,
  feedbackId: number,
): Promise<void> {
  await apiClient<null>(
    `/api/positions/${positionId}/interview_stages/${stageId}/feedbacks/${feedbackId}`,
    { method: 'DELETE' },
  );
}
