import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Company } from '../types/company.ts';
import { usePositions } from '../features/positions/usePositions.ts';
import { useResumes } from '../features/resumes/useResumes.ts';
import { createPosition } from '../lib/positions-api.ts';
import { getCompanies } from '../lib/companies-api.ts';
import { ApiError } from '../lib/api-client.ts';
import { CreateCompanyModal } from './CreateCompanyModal.tsx';
import styles from './CreatePositionModal.module.css';

interface CreatePositionModalProps {
  onClose: () => void;
}

export function CreatePositionModal({ onClose }: CreatePositionModalProps) {
  const { addPosition } = usePositions();
  const { resumes } = useResumes();
  const defaultResume = resumes.find((r) => r.default);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [title, setTitle] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [resumeId, setResumeId] = useState(defaultResume ? String(defaultResume.id) : '');
  const [description, setDescription] = useState('');
  const [vacancyUrl, setVacancyUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getCompanies()
      .then((data) => {
        if (!cancelled) setCompanies(data);
      })
      .catch(() => {
        // Silently fail — user can still create a new company
      });

    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const position = await createPosition({
        title,
        company_id: Number(companyId),
        description: description || undefined,
        vacancy_url: vacancyUrl || undefined,
        resume_id: resumeId ? Number(resumeId) : null,
      });
      addPosition(position);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create position');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCompanyChange(value: string) {
    if (value === '__new__') {
      setShowCompanyModal(true);
    } else {
      setCompanyId(value);
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2>New Position</h2>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="position-title">Title *</label>
              <input
                id="position-title"
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position-company">Company *</label>
              <select
                id="position-company"
                className={`form-input ${styles.select}`}
                value={companyId}
                onChange={(e) => handleCompanyChange(e.target.value)}
                required
              >
                <option value="" disabled>Select a company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
                <option value="__new__">+ Create new company</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position-resume">Resume</label>
              <select
                id="position-resume"
                className={`form-input ${styles.select}`}
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
              >
                <option value="">None</option>
                {defaultResume && (
                  <option value={defaultResume.id}>
                    {defaultResume.name} (default)
                  </option>
                )}
                {resumes.filter((r) => !r.default).map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position-description">Description</label>
              <textarea
                id="position-description"
                className={`form-input ${styles.textarea}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="position-vacancy-url">Vacancy URL</label>
              <input
                id="position-vacancy-url"
                className="form-input"
                type="url"
                value={vacancyUrl}
                onChange={(e) => setVacancyUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className={styles.actions}>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Position'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCompanyModal && (
        <CreateCompanyModal
          onClose={() => setShowCompanyModal(false)}
          onCreated={(company) => {
            setCompanies((prev) => [...prev, company]);
            setCompanyId(String(company.id));
            setShowCompanyModal(false);
          }}
        />
      )}
    </>
  );
}
