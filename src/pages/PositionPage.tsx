import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { PositionWithCompany } from '../types/position.ts';
import { POSITION_STATUSES } from '../types/position.ts';
import { getPosition, updatePosition } from '../lib/positions-api.ts';
import { usePositions } from '../features/positions/usePositions.ts';
import styles from './PositionPage.module.css';

function InlineEdit({
  value,
  onSave,
  as = 'input',
}: {
  value: string;
  onSave: (value: string) => void;
  as?: 'input' | 'textarea';
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function save() {
    setIsEditing(false);
    if (draft !== value) {
      onSave(draft);
    }
  }

  function cancel() {
    setDraft(value);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && as === 'input') {
      save();
    } else if (e.key === 'Escape') {
      cancel();
    }
  }

  if (!isEditing) {
    return (
      <span
        className={styles.editableValue}
        onClick={() => setIsEditing(true)}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(true)}
        role="button"
      >
        {value || <span className={styles.placeholder}>Click to edit</span>}
      </span>
    );
  }

  const Tag = as;
  return (
    <Tag
      className={`form-input ${styles.inlineInput}`}
      value={draft}
      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={handleKeyDown}
      autoFocus
      rows={as === 'textarea' ? 3 : undefined}
    />
  );
}

export function PositionPage() {
  const { id } = useParams<{ id: string }>();
  const { updatePositionInList } = usePositions();
  const [position, setPosition] = useState<PositionWithCompany | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getPosition(Number(id))
      .then((data) => {
        if (!cancelled) {
          setPosition(data);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setPosition(null);
          setError(err.message || 'Failed to load position');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  async function handleFieldSave(field: string, value: string) {
    if (!position) return;
    try {
      const updated = await updatePosition(position.id, { [field]: value });
      setPosition(updated);
      if (field === 'title') {
        updatePositionInList(position.id, { title: value });
      }
    } catch {
      // Revert will happen via the position state not changing
    }
  }

  async function handleStatusChange(value: string) {
    if (!position) return;
    try {
      const updated = await updatePosition(position.id, { status: value as PositionWithCompany['status'] });
      setPosition(updated);
    } catch {
      // Keep current state on error
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error || !position) {
    return <div className={styles.error}>{error || 'Position not found'}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1>
          <InlineEdit
            value={position.title}
            onSave={(v) => handleFieldSave('title', v)}
          />
        </h1>
        <span className={styles.companyName}>{position.company.name}</span>
      </div>

      <div className={styles.card}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>Status</div>
          <select
            className={`form-input ${styles.statusSelect}`}
            value={position.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {POSITION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <div className={styles.fieldLabel}>Description</div>
          <InlineEdit
            value={position.description ?? ''}
            onSave={(v) => handleFieldSave('description', v)}
            as="textarea"
          />
        </div>

        <div className={styles.field}>
          <div className={styles.fieldLabel}>Vacancy URL</div>
          <InlineEdit
            value={position.vacancy_url ?? ''}
            onSave={(v) => handleFieldSave('vacancy_url', v)}
          />
        </div>
      </div>
    </div>
  );
}
