import { createContext } from 'react';
import type { Resume } from '../../types/resume.ts';

export interface ResumesContextValue {
  resumes: Resume[];
  isLoading: boolean;
  addResume: (resume: Resume) => void;
  updateResumeInList: (id: number, updated: Resume) => void;
  removeResume: (id: number) => void;
}

export const ResumesContext = createContext<ResumesContextValue | null>(null);
