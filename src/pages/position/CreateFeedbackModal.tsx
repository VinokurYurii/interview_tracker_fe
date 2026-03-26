import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Feedback, FeedbackType } from '../../types/interview-stage.ts';
import { FEEDBACK_TYPES, FEEDBACK_TYPE_LABELS } from '../../types/interview-stage.ts';
import { createFeedback } from '../../lib/interview-stages-api.ts';
import { ApiError } from '../../lib/api-client.ts';
import styles from './CreateFeedbackModal.module.css';

interface CreateFeedbackModalProps {
  positionId: number;
  stageId: number;
  existingTypes: FeedbackType[];
  onCreated: (feedback: Feedback) => void;
  onClose: () => void;
}

export function CreateFeedbackModal({ positionId, stageId, existingTypes, onCreated, onClose }: CreateFeedbackModalProps) {
  const availableTypes = FEEDBACK_TYPES.filter((t) => !existingTypes.includes(t));
  const [feedbackType, setFeedbackType] = useState<FeedbackType | ''>(availableTypes.length === 1 ? availableTypes[0] : '');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!feedbackType) return;

    setError('');
    setIsSubmitting(true);

    try {
      const feedback = await createFeedback(positionId, stageId, {
        feedback_type: feedbackType,
        content,
      });
      onCreated(feedback);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create feedback');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>New Feedback</h2>
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
            <label className="form-label" htmlFor="feedback-type">Type *</label>
            <select
              id="feedback-type"
              className={`form-input ${styles.select}`}
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value as FeedbackType)}
              required
              autoFocus
            >
              {availableTypes.length > 1 && <option value="" disabled>Select type</option>}
              {availableTypes.map((type) => (
                <option key={type} value={type}>{FEEDBACK_TYPE_LABELS[type]}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="feedback-content">Content *</label>
            <textarea
              id="feedback-content"
              className={`form-input ${styles.textarea}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Add Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
