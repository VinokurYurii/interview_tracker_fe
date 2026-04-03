import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { useResumes } from '../../features/resumes/useResumes.ts';
import { createResume } from '../../lib/resumes-api.ts';
import { ApiError } from '../../lib/api-client.ts';
import modalStyles from '../../components/CreatePositionModal.module.css';
import styles from './CreateResumeModal.module.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface CreateResumeModalProps {
  onClose: () => void;
}

export function CreateResumeModal({ onClose }: CreateResumeModalProps) {
  const { addResume } = useResumes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setFileError('Only PDF files are accepted');
      setFile(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFileError('File size must not exceed 10MB');
      setFile(null);
      return;
    }

    setFileError('');
    setFile(selected);

    if (!name.trim()) {
      setName(selected.name.replace(/\.pdf$/i, ''));
    }
  }

  function handleNameChange(value: string) {
    setName(value);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setError('');
    setIsSubmitting(true);

    try {
      const resume = await createResume(name, file);
      addResume(resume);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to upload resume');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={modalStyles.overlay} onClick={onClose}>
      <div className={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={modalStyles.header}>
          <h2>Upload Resume</h2>
          <button className={modalStyles.closeBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={modalStyles.error}>{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="resume-name">Name *</label>
            <input
              id="resume-name"
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">File (PDF) *</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <button
              type="button"
              className={`${styles.fileButton} ${file ? styles.fileSelected : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? file.name : 'Choose PDF file'}
            </button>
            {fileError && <div className={styles.fileError}>{fileError}</div>}
          </div>

          <div className={modalStyles.actions}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn primary"
              disabled={isSubmitting || !file || !name.trim()}
            >
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
