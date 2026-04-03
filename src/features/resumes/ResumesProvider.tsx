import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Resume } from '../../types/resume.ts';
import { getResumes } from '../../lib/resumes-api.ts';
import { ResumesContext } from './resumes-context.ts';

export function ResumesProvider({ children }: { children: ReactNode }) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getResumes()
      .then((data) => {
        if (!cancelled) setResumes(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const addResume = useCallback((resume: Resume) => {
    setResumes((prev) => [...prev, resume]);
  }, []);

  const updateResumeInList = useCallback((id: number, updated: Resume) => {
    setResumes((prev) =>
      prev.map((r) => {
        if (r.id === id) return updated;
        if (updated.default && r.default) return { ...r, default: false };
        return r;
      })
    );
  }, []);

  const removeResume = useCallback((id: number) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <ResumesContext.Provider value={{ resumes, isLoading, addResume, updateResumeInList, removeResume }}>
      {children}
    </ResumesContext.Provider>
  );
}
