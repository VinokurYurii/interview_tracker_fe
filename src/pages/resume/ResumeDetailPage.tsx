import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import type { ResumeDetail } from '../../types/resume.ts';
import { getResume, updateResume } from '../../lib/resumes-api.ts';
import { ApiError } from '../../lib/api-client.ts';
import { useResumes } from '../../features/resumes/useResumes.ts';
import { useSetPageTitle } from '../../features/page-title/useSetPageTitle.ts';
import { useResumeAnalysis } from '../../hooks/useResumeAnalysis.ts';
import { API_BASE_URL } from '../../config.ts';
import { InlineEdit } from '../../components/InlineEdit.tsx';
import styles from './ResumeDetailPage.module.css';

export function ResumeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { updateResumeInList } = useResumes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');

  useSetPageTitle(resume?.name || 'Resume');

  useEffect(() => {
    let cancelled = false;

    getResume(Number(id))
      .then((data) => {
        if (!cancelled) {
          setResume(data);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setResume(null);
          setError(err.message || 'Failed to load resume');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  const {
    analysis,
    isGenerating,
    error: analysisError,
    stuck,
    generate,
    retry,
  } = useResumeAnalysis(resume?.id ?? 0, resume?.resume_analysis ?? null);

  async function handleRename(name: string) {
    if (!resume) return;
    try {
      const updated = await updateResume(resume.id, { name });
      setResume({ ...resume, name: updated.name });
      updateResumeInList(resume.id, updated);
    } catch {
      // Keep current state on error
    }
  }

  async function handleFileReplace(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !resume) return;

    if (file.type !== 'application/pdf') {
      setFileError('Only PDF files are accepted');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must not exceed 10MB');
      return;
    }

    setFileError('');
    try {
      const updated = await updateResume(resume.id, { file });
      setResume({ ...resume, file_url: updated.file_url });
      updateResumeInList(resume.id, updated);
    } catch (err) {
      setFileError(err instanceof ApiError ? err.message : 'Failed to update file');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || !resume) {
    return <div className={styles.error}>{error || 'Resume not found'}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>
          <InlineEdit
            value={resume.name}
            onSave={handleRename}
          />
        </h1>
        <div className={styles.fileActions}>
          {resume.file_url && (
            <a
              href={`${API_BASE_URL}${resume.file_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadLink}
            >
              Download PDF
            </a>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileReplace}
            className={styles.hiddenInput}
          />
          <button
            className={styles.replaceBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            {resume.file_url ? 'Replace file' : 'Upload file'}
          </button>
          {fileError && <span className={styles.fileError}>{fileError}</span>}
        </div>
      </div>

      <div className={styles.analysisSection}>
        <h2 className={styles.analysisHeader}>AI Analysis</h2>

        {analysisError && (
          <div className={styles.analysisError}>{analysisError}</div>
        )}

        {!analysis && !isGenerating && (
          <button className="btn primary" onClick={generate}>
            Generate Analysis
          </button>
        )}

        {isGenerating && (
          <div className={styles.statusMessage}>Starting analysis...</div>
        )}

        {analysis?.status === 'pending' && !stuck && (
          <div className={styles.statusMessage}>Waiting in queue...</div>
        )}

        {analysis?.status === 'processing' && !stuck && (
          <div className={styles.statusMessage}>Analyzing your resume...</div>
        )}

        {analysis?.status === 'completed' && analysis.content && (
          <>
            <div className={styles.analysisContent}>
              <Markdown>{analysis.content}</Markdown>
            </div>
            <button className={`btn ${styles.regenerateBtn}`} onClick={retry}>
              Regenerate Analysis
            </button>
          </>
        )}

        {analysis?.status === 'failed' && (
          <>
            <div className={styles.retryMessage}>Analysis failed. Try again?</div>
            <button className="btn primary" onClick={retry}>
              Retry Analysis
            </button>
          </>
        )}

        {stuck && (
          <>
            <div className={styles.retryMessage}>Analysis seems stuck. Try again?</div>
            <button className="btn primary" onClick={retry}>
              Retry Analysis
            </button>
          </>
        )}
      </div>
    </div>
  );
}
