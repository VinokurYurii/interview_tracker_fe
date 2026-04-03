import { useState } from 'react';
import { useResumes } from '../../features/resumes/useResumes.ts';
import { updateResume, deleteResume } from '../../lib/resumes-api.ts';
import { ApiError } from '../../lib/api-client.ts';
import { API_BASE_URL } from '../../config.ts';
import { InlineEdit } from '../../components/InlineEdit.tsx';
import { CreateResumeModal } from './CreateResumeModal.tsx';
import styles from './ResumeList.module.css';

export function ResumeList() {
  const { resumes, updateResumeInList, removeResume } = useResumes();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');

  async function handleSetDefault(id: number) {
    setError('');
    try {
      const updated = await updateResume(id, { default: true });
      updateResumeInList(id, updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to set default resume');
    }
  }

  async function handleRename(id: number, name: string) {
    setError('');
    try {
      const updated = await updateResume(id, { name });
      updateResumeInList(id, updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to rename resume');
    }
  }

  async function handleDelete(id: number) {
    setError('');
    setWarning('');
    try {
      const result = await deleteResume(id);
      if (result.deleted) {
        removeResume(id);
      } else if (result.warning && result.resume) {
        setWarning(result.warning);
        updateResumeInList(id, result.resume);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete resume');
    }
  }

  const hasMultiple = resumes.length > 1;

  return (
    <>
      <div>
        {error && <div className={styles.warning} style={{ color: 'var(--loss)' }}>{error}</div>}

        {resumes.length === 0 ? (
          <p className={styles.emptyState}>No resumes uploaded yet.</p>
        ) : (
          <div className={styles.resumeList}>
            {resumes.map((resume) => (
              <div key={resume.id} className={styles.resumeItem}>
                <div className={`${styles.resumeName} ${resume.default ? styles.resumeNameDefault : ''}`}>
                  <InlineEdit
                    value={resume.name}
                    onSave={(name) => handleRename(resume.id, name)}
                  />
                </div>
                <div className={styles.actions}>
                  {resume.file_url && (
                    <a
                      href={`${API_BASE_URL}${resume.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadLink}
                    >
                      Download
                    </a>
                  )}
                  {hasMultiple && !resume.default && (
                    <button
                      className={`${styles.actionBtn} ${styles.defaultBtn}`}
                      onClick={() => handleSetDefault(resume.id)}
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDelete(resume.id)}
                    disabled={resume.default}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {warning && <div className={styles.warning}>{warning}</div>}

        <button
          className={`btn primary ${styles.uploadBtn}`}
          onClick={() => setShowCreateModal(true)}
        >
          Upload Resume
        </button>
      </div>

      {showCreateModal && (
        <CreateResumeModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}
