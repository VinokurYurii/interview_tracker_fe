import { useContext } from 'react';
import { ResumesContext } from './resumes-context.ts';
import type { ResumesContextValue } from './resumes-context.ts';

export function useResumes(): ResumesContextValue {
  const context = useContext(ResumesContext);
  if (!context) {
    throw new Error('useResumes must be used within a ResumesProvider');
  }
  return context;
}
