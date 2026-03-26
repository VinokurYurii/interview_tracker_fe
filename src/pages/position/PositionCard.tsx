import type { PositionWithCompany } from '../../types/position.ts';
import { POSITION_STATUSES } from '../../types/position.ts';
import { InlineEdit } from '../../components/InlineEdit.tsx';
import styles from './PositionCard.module.css';

interface PositionCardProps {
  position: PositionWithCompany;
  onFieldSave: (field: string, value: string) => void;
  onStatusChange: (value: string) => void;
}

export function PositionCard({ position, onFieldSave, onStatusChange }: PositionCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.field}>
        <div className={styles.fieldLabel}>Status</div>
        <select
          className={`form-input ${styles.statusSelect}`}
          value={position.status}
          onChange={(e) => onStatusChange(e.target.value)}
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
          onSave={(v) => onFieldSave('description', v)}
          as="textarea"
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>Vacancy URL</div>
        <InlineEdit
          value={position.vacancy_url ?? ''}
          onSave={(v) => onFieldSave('vacancy_url', v)}
        />
      </div>
    </div>
  );
}
