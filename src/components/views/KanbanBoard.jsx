import { useState } from "react";
import { Chip } from "../ui";
import { STAGES, STAGE_META } from "../../utils/constants";
import { daysAgo } from "../../utils/helpers";
import styles from "../../styles/views.module.css";
import ui from "../../styles/ui.module.css";

export default function KanbanBoard({ apps, onMove, onEdit, onDelete }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  return (
    <div className={styles.kanbanRow}>
      {STAGES.map((stage) => {
        const meta = STAGE_META[stage];
        const items = apps.filter((a) => a.stage === stage);
        const isOver = dragOver === stage;

        return (
          <div
            key={stage}
            className={styles.kanbanCol}
            style={{
              background: isOver ? meta.bg : undefined,
              borderColor: isOver ? `${meta.color}66` : undefined,
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(stage); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => {
              if (dragging) {
                onMove(dragging, stage);
                setDragging(null);
                setDragOver(null);
              }
            }}
          >
            <div className={styles.kanbanColHeader}>
              <span className={styles.kanbanColEmoji}>{meta.emoji}</span>
              <span className={styles.kanbanColTitle} style={{ color: meta.color }}>
                {stage}
              </span>
              <span className={styles.kanbanColCount}>{items.length}</span>
            </div>

            {items.map((app) => (
              <div
                key={app.id}
                className={styles.kanbanCard}
                draggable
                onDragStart={() => setDragging(app.id)}
                onDragEnd={() => { setDragging(null); setDragOver(null); }}
                style={{ opacity: dragging === app.id ? 0.4 : 1 }}
              >
                <div className={styles.kanbanCardCompany}>{app.company}</div>
                <div className={styles.kanbanCardRole}>{app.role}</div>
                <div className={styles.kanbanCardMeta}>
                  {app.appliedDate && (
                    <span className={styles.kanbanCardDate}>{daysAgo(app.appliedDate)}</span>
                  )}
                  {app.priority && (
                    <Chip
                      label={app.priority}
                      color={
                        app.priority === "High" ? "var(--pink)" :
                        app.priority === "Medium" ? "var(--yellow)" : "var(--green)"
                      }
                      bg={
                        app.priority === "High" ? "var(--pink-soft)" :
                        app.priority === "Medium" ? "var(--yellow-soft)" : "var(--green-soft)"
                      }
                      small
                    />
                  )}
                  {app.hasReferral && (
                    <Chip label="★ Referred" color="var(--purple)" bg="var(--purple-soft)" small />
                  )}
                </div>
                {app.hasReferral && app.referralContact && (
                  <div className={styles.kanbanCardReferral}>via {app.referralContact}</div>
                )}
                <div className={styles.kanbanCardActions}>
                  <button className={ui.btnSmall} onClick={() => onEdit(app)}>Edit</button>
                  <button className={ui.btnDanger} onClick={() => onDelete(app.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
