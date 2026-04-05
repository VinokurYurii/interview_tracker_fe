import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PositionWithCompany } from '../../types/position.ts';
import { getPosition, updatePosition, deletePosition } from '../../lib/positions-api.ts';
import { usePositions } from '../../features/positions/usePositions.ts';
import { useSetPageTitle } from '../../features/page-title/useSetPageTitle.ts';
import { InlineEdit } from '../../components/InlineEdit.tsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.tsx';
import { PositionCard } from './PositionCard.tsx';
import { InterviewStages } from './InterviewStages.tsx';
import styles from './PositionPage.module.css';

export function PositionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updatePositionInList, removePosition } = usePositions();
  const [position, setPosition] = useState<PositionWithCompany | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useSetPageTitle(position ? `${position.title} — ${position.company.name}` : 'Position');

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

  async function handleResumeChange(resumeId: number | null) {
    if (!position) return;
    try {
      const updated = await updatePosition(position.id, { resume_id: resumeId });
      setPosition(updated);
    } catch {
      // Keep current state on error
    }
  }

  async function handleDelete() {
    if (!position) return;
    try {
      await deletePosition(position.id);
      removePosition(position.id);
      navigate('/home');
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
        <div className={styles.pageHeaderTop}>
          <h1>
            <InlineEdit
              value={position.title}
              onSave={(v) => handleFieldSave('title', v)}
            />
          </h1>
          <button
            className={`btn danger ${styles.deleteBtn}`}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </button>
        </div>
        <span className={styles.companyName}>{position.company.name}</span>
      </div>

      <PositionCard
        position={position}
        onFieldSave={handleFieldSave}
        onStatusChange={handleStatusChange}
        onResumeChange={handleResumeChange}
      />

      <InterviewStages positionId={position.id} />

      {showDeleteConfirm && (
        <ConfirmDialog
          message={`Delete "${position.title}"? This will also delete all interview stages and feedback.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
