import { useState, useEffect } from 'react';
import type { InterviewStage, FeedbackType, StageStatus } from '../../types/interview-stage.ts';
import { STAGE_TYPE_LABELS, STAGE_STATUSES, FEEDBACK_TYPE_LABELS } from '../../types/interview-stage.ts';
import {
  getInterviewStages,
  updateInterviewStage,
  deleteInterviewStage,
  updateFeedback,
  deleteFeedback,
} from '../../lib/interview-stages-api.ts';
import { InlineEdit } from '../../components/InlineEdit.tsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.tsx';
import { CreateStageModal } from './CreateStageModal.tsx';
import { CreateFeedbackModal } from './CreateFeedbackModal.tsx';
import styles from './InterviewStages.module.css';

type DeleteTarget =
  | { type: 'stage'; stageId: number }
  | { type: 'feedback'; stageId: number; feedbackId: number };

interface InterviewStagesProps {
  positionId: number;
}

export function InterviewStages({ positionId }: InterviewStagesProps) {
  const [stages, setStages] = useState<InterviewStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openStageIds, setOpenStageIds] = useState<Set<number>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFeedbackStageId, setCreateFeedbackStageId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  useEffect(() => {
    let cancelled = false;

    getInterviewStages(positionId)
      .then((data) => {
        if (!cancelled) setStages(data);
      })
      .catch(() => {
        // Silently fail — empty list shown
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [positionId]);

  function toggleAccordion(stageId: number) {
    setOpenStageIds((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  }

  function handleStageCreated(stage: InterviewStage) {
    setStages((prev) => [...prev, stage]);
    setOpenStageIds((prev) => new Set(prev).add(stage.id));
    setShowCreateModal(false);
  }

  async function handleStageFieldSave(stageId: number, field: string, value: string) {
    try {
      const updated = await updateInterviewStage(positionId, stageId, { [field]: value || null });
      setStages((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      // Keep current state on error
    }
  }

  async function handleStatusChange(stageId: number, value: string) {
    try {
      const updated = await updateInterviewStage(positionId, stageId, { status: value as StageStatus });
      setStages((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      // Keep current state on error
    }
  }

  function handleFeedbackCreated(stageId: number) {
    return (feedback: InterviewStage['feedbacks'][number]) => {
      setStages((prev) =>
        prev.map((s) =>
          s.id === stageId ? { ...s, feedbacks: [...s.feedbacks, feedback] } : s,
        ),
      );
      setCreateFeedbackStageId(null);
    };
  }

  async function handleFeedbackContentSave(stageId: number, feedbackId: number, content: string) {
    try {
      const updated = await updateFeedback(positionId, stageId, feedbackId, { content });
      setStages((prev) =>
        prev.map((s) =>
          s.id === stageId
            ? { ...s, feedbacks: s.feedbacks.map((f) => (f.id === updated.id ? updated : f)) }
            : s,
        ),
      );
    } catch {
      // Keep current state on error
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'stage') {
        await deleteInterviewStage(positionId, deleteTarget.stageId);
        setStages((prev) => prev.filter((s) => s.id !== deleteTarget.stageId));
      } else {
        await deleteFeedback(positionId, deleteTarget.stageId, deleteTarget.feedbackId);
        setStages((prev) =>
          prev.map((s) =>
            s.id === deleteTarget.stageId
              ? { ...s, feedbacks: s.feedbacks.filter((f) => f.id !== deleteTarget.feedbackId) }
              : s,
          ),
        );
      }
    } catch {
      // Keep current state on error
    } finally {
      setDeleteTarget(null);
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading stages...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Interview Stages</h2>
        <button className="btn primary" onClick={() => setShowCreateModal(true)}>
          + Add Stage
        </button>
      </div>

      {stages.length === 0 && (
        <p className={styles.empty}>No interview stages yet.</p>
      )}

      <div className={styles.accordion}>
        {stages.map((stage) => {
          const isOpen = openStageIds.has(stage.id);
          const existingFeedbackTypes = stage.feedbacks.map((f) => f.feedback_type) as FeedbackType[];

          return (
            <div key={stage.id} className={styles.accordionItem}>
              <div className={styles.accordionHeader} onClick={() => toggleAccordion(stage.id)}>
                <div className={styles.accordionLeft}>
                  <span className={styles.chevron}>{isOpen ? '\u25BE' : '\u25B8'}</span>
                  <span className={styles.stageType}>{STAGE_TYPE_LABELS[stage.stage_type]}</span>
                  <span className={`${styles.statusBadge} ${styles[`status_${stage.status}`]}`}>
                    {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                  </span>
                </div>
                <button
                  className={styles.trashBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ type: 'stage', stageId: stage.id });
                  }}
                  aria-label="Delete stage"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>

              {isOpen && (
                <div className={styles.accordionBody}>
                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Status</div>
                    <select
                      className={`form-input ${styles.statusSelect}`}
                      value={stage.status}
                      onChange={(e) => handleStatusChange(stage.id, e.target.value)}
                    >
                      {STAGE_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Scheduled At</div>
                    <InlineEdit
                      value={stage.scheduled_at ? new Date(stage.scheduled_at).toLocaleString() : ''}
                      onSave={(v) => handleStageFieldSave(stage.id, 'scheduled_at', v)}
                      placeholder="Click to set date"
                    />
                  </div>

                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Calendar Link</div>
                    <InlineEdit
                      value={stage.calendar_link ?? ''}
                      onSave={(v) => handleStageFieldSave(stage.id, 'calendar_link', v)}
                      placeholder="Click to add link"
                    />
                  </div>

                  <div className={styles.field}>
                    <div className={styles.fieldLabel}>Notes</div>
                    <InlineEdit
                      value={stage.notes ?? ''}
                      onSave={(v) => handleStageFieldSave(stage.id, 'notes', v)}
                      as="textarea"
                      placeholder="Click to add notes"
                    />
                  </div>

                  <div className={styles.feedbackSection}>
                    <div className={styles.feedbackHeader}>
                      <span className={styles.feedbackTitle}>Feedbacks</span>
                      {existingFeedbackTypes.length < 2 && (
                        <button
                          className={`btn ${styles.addFeedbackBtn}`}
                          onClick={() => setCreateFeedbackStageId(stage.id)}
                        >
                          + Add Feedback
                        </button>
                      )}
                    </div>

                    {stage.feedbacks.length === 0 && (
                      <p className={styles.noFeedbacks}>No feedbacks yet.</p>
                    )}

                    {stage.feedbacks.map((feedback) => (
                      <div key={feedback.id} className={styles.feedbackRow}>
                        <span className={styles.feedbackType}>
                          {FEEDBACK_TYPE_LABELS[feedback.feedback_type]}
                        </span>
                        <div className={styles.feedbackContent}>
                          <InlineEdit
                            value={feedback.content}
                            onSave={(v) => handleFeedbackContentSave(stage.id, feedback.id, v)}
                            as="textarea"
                          />
                        </div>
                        <button
                          className={styles.trashBtn}
                          onClick={() =>
                            setDeleteTarget({ type: 'feedback', stageId: stage.id, feedbackId: feedback.id })
                          }
                          aria-label="Delete feedback"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateStageModal
          positionId={positionId}
          onCreated={handleStageCreated}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {createFeedbackStageId !== null && (
        <CreateFeedbackModal
          positionId={positionId}
          stageId={createFeedbackStageId}
          existingTypes={
            stages
              .find((s) => s.id === createFeedbackStageId)
              ?.feedbacks.map((f) => f.feedback_type) as FeedbackType[] ?? []
          }
          onCreated={handleFeedbackCreated(createFeedbackStageId)}
          onClose={() => setCreateFeedbackStageId(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={
            deleteTarget.type === 'stage'
              ? 'Are you sure you want to delete this interview stage?'
              : 'Are you sure you want to delete this feedback?'
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
