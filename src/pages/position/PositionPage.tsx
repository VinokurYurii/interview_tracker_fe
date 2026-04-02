import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { PositionWithCompany } from '../../types/position.ts';
import { getPosition, updatePosition } from '../../lib/positions-api.ts';
import { usePositions } from '../../features/positions/usePositions.ts';
import { useSetPageTitle } from '../../features/page-title/useSetPageTitle.ts';
import { InlineEdit } from '../../components/InlineEdit.tsx';
import { PositionCard } from './PositionCard.tsx';
import { InterviewStages } from './InterviewStages.tsx';
import styles from './PositionPage.module.css';

export function PositionPage() {
  const { id } = useParams<{ id: string }>();
  const { updatePositionInList } = usePositions();
  const [position, setPosition] = useState<PositionWithCompany | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

      <PositionCard
        position={position}
        onFieldSave={handleFieldSave}
        onStatusChange={handleStatusChange}
      />

      <InterviewStages positionId={position.id} />
    </div>
  );
}
