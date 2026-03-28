import { useState, useEffect } from 'react';
import styles from './InlineEdit.module.css';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  as?: 'input' | 'textarea';
  placeholder?: string;
}

export function InlineEdit({ value, onSave, as = 'input', placeholder = 'Click to edit' }: InlineEditProps) {
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
        {value || <span className={styles.placeholder}>{placeholder}</span>}
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
      rows={as === 'textarea' ? Math.max(3, draft.split('\n').length) : undefined}
    />
  );
}
