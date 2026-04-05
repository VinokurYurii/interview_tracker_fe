import type { Resume, ResumeDetail, ResumeAnalysis } from '../types/resume.ts';
import { apiClient } from './api-client.ts';

export async function getResumes(): Promise<Resume[]> {
  const { data } = await apiClient<Resume[]>('/api/resumes');
  return data;
}

export async function createResume(name: string, file: File): Promise<Resume> {
  const formData = new FormData();
  formData.append('resume[name]', name);
  formData.append('resume[file]', file);

  const { data } = await apiClient<Resume>('/api/resumes', {
    method: 'POST',
    body: formData,
  });
  return data;
}

export interface UpdateResumeFields {
  name?: string;
  default?: boolean;
  file?: File;
}

export async function updateResume(id: number, fields: UpdateResumeFields): Promise<Resume> {
  const formData = new FormData();
  if (fields.name !== undefined) formData.append('resume[name]', fields.name);
  if (fields.default !== undefined) formData.append('resume[default]', String(fields.default));
  if (fields.file) formData.append('resume[file]', fields.file);

  const { data } = await apiClient<Resume>(`/api/resumes/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  return data;
}

export interface DeleteResumeResult {
  deleted: boolean;
  warning?: string;
  resume?: Resume;
}

export async function deleteResume(id: number): Promise<DeleteResumeResult> {
  const { data } = await apiClient<{ warning?: string; resume?: Resume } | null>(
    `/api/resumes/${id}`,
    { method: 'DELETE' },
  );

  if (data && data.warning) {
    return { deleted: false, warning: data.warning, resume: data.resume };
  }
  return { deleted: true };
}

export async function getResume(id: number): Promise<ResumeDetail> {
  const { data } = await apiClient<ResumeDetail>(`/api/resumes/${id}`);
  return data;
}

export async function generateAnalysis(id: number): Promise<ResumeAnalysis> {
  const { data } = await apiClient<ResumeAnalysis>(`/api/resumes/${id}/generate_analysis`, {
    method: 'POST',
  });
  return data;
}
