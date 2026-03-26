import { useState } from 'react';
import type { FormEvent } from 'react';
import type { InterviewStage, StageType, StageStatus } from '../../types/interview-stage.ts';
import { STAGE_TYPES, STAGE_STATUSES, STAGE_TYPE_LABELS } from '../../types/interview-stage.ts';
import { createInterviewStage } from '../../lib/interview-stages-api.ts';
import { ApiError } from '../../lib/api-client.ts';
import styles from './CreateStageModal.module.css';

interface CreateStageModalProps {
  positionId: number;
  onCreated: (stage: InterviewStage) => void;
  onClose: () => void;
}

export function CreateStageModal({ positionId, onCreated, onClose }: CreateStageModalProps) {
  const [stageType, setStageType] = useState<StageType | ''>('');
  const [status, setStatus] = useState<StageStatus>('planned');
  const [scheduledAt, setScheduledAt] = useState('');
  const [calendarLink, setCalendarLink] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stageType) return;

    setError('');
    setIsSubmitting(true);

    try {
      const stage = await createInterviewStage(positionId, {
        stage_type: stageType,
        status,
        scheduled_at: scheduledAt || undefined,
        calendar_link: calendarLink || undefined,
        notes: notes || undefined,
      });
      onCreated(stage);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create stage');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>New Interview Stage</h2>
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
            <label className="form-label" htmlFor="stage-type">Stage Type *</label>
            <select
              id="stage-type"
              className={`form-input ${styles.select}`}
              value={stageType}
              onChange={(e) => setStageType(e.target.value as StageType)}
              required
              autoFocus
            >
              <option value="" disabled>Select stage type</option>
              {STAGE_TYPES.map((type) => (
                <option key={type} value={type}>{STAGE_TYPE_LABELS[type]}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="stage-status">Status</label>
            <select
              id="stage-status"
              className={`form-input ${styles.select}`}
              value={status}
              onChange={(e) => setStatus(e.target.value as StageStatus)}
            >
              {STAGE_STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="stage-scheduled">Scheduled At</label>
            <input
              id="stage-scheduled"
              className="form-input"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="stage-calendar">Calendar Link</label>
            <input
              id="stage-calendar"
              className="form-input"
              type="url"
              value={calendarLink}
              onChange={(e) => setCalendarLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="stage-notes">Notes</label>
            <textarea
              id="stage-notes"
              className={`form-input ${styles.textarea}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Stage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
