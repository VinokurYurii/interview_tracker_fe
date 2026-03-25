import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Company } from '../types/company.ts';
import { createCompany } from '../lib/companies-api.ts';
import { ApiError } from '../lib/api-client.ts';
import styles from './CreateCompanyModal.module.css';

interface CreateCompanyModalProps {
  onClose: () => void;
  onCreated: (company: Company) => void;
}

export function CreateCompanyModal({ onClose, onCreated }: CreateCompanyModalProps) {
  const [name, setName] = useState('');
  const [siteLink, setSiteLink] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const company = await createCompany({
        name,
        site_link: siteLink || undefined,
      });
      onCreated(company);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create company');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>New Company</h2>
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
            <label className="form-label" htmlFor="company-name">Name *</label>
            <input
              id="company-name"
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company-site-link">Website</label>
            <input
              id="company-site-link"
              className="form-input"
              type="url"
              value={siteLink}
              onChange={(e) => setSiteLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
