import { useState, useEffect, useRef, useCallback } from 'react';
import type { ResumeAnalysis } from '../types/resume.ts';
import { getResume, generateAnalysis } from '../lib/resumes-api.ts';
import { ApiError } from '../lib/api-client.ts';

const POLL_INTERVAL = 5000;
const STUCK_THRESHOLD = 5 * 60 * 1000;

function isActiveStatus(status: string): boolean {
  return status === 'pending' || status === 'processing';
}

function isStuck(analysis: ResumeAnalysis): boolean {
  if (!isActiveStatus(analysis.status)) return false;
  const elapsed = Date.now() - new Date(analysis.updated_at).getTime();
  return elapsed > STUCK_THRESHOLD;
}

export function useResumeAnalysis(resumeId: number, initialAnalysis: ResumeAnalysis | null) {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(initialAnalysis);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const analysisRef = useRef(analysis);

  useEffect(() => {
    analysisRef.current = analysis;
  }, [analysis]);

  useEffect(() => {
    setAnalysis(initialAnalysis);
  }, [initialAnalysis]);

  const shouldPoll = analysis !== null
    && isActiveStatus(analysis.status)
    && !isStuck(analysis);

  useEffect(() => {
    if (!shouldPoll) return;

    const interval = setInterval(async () => {
      const current = analysisRef.current;
      if (current && isStuck(current)) {
        clearInterval(interval);
        return;
      }

      try {
        const resume = await getResume(resumeId);
        setAnalysis(resume.resume_analysis);
      } catch {
        // Silently retry on next tick
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [resumeId, shouldPoll]);

  const generate = useCallback(async () => {
    setError('');
    setIsGenerating(true);
    try {
      const result = await generateAnalysis(resumeId);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to generate analysis');
    } finally {
      setIsGenerating(false);
    }
  }, [resumeId]);

  const retry = useCallback(() => {
    generate();
  }, [generate]);

  const stuck = analysis ? isStuck(analysis) : false;

  return { analysis, isGenerating, error, stuck, generate, retry };
}
