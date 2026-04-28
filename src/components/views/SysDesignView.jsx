import { useState } from "react";
import { Chip } from "../ui";
import { CONFIDENCE_META } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import styles from "../../styles/views.module.css";
import ui from "../../styles/ui.module.css";

export default function SysDesignView({ notes, onAdd, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={onAdd} className={ui.btnPrimary} style={{ padding: "8px 16px", fontSize: 12 }}>
          + Topic
        </button>
      </div>

      <div className={styles.sysGrid}>
        {notes.map((n) => {
          const conf = CONFIDENCE_META[n.confidence] || CONFIDENCE_META.Learning;
          const isOpen = expanded === n.id;

          return (
            <div
              key={n.id}
              className={isOpen ? styles.sysCardActive : styles.sysCard}
              onClick={() => setExpanded(isOpen ? null : n.id)}
            >
              <div className={styles.sysCardTitle}>{n.topic}</div>
              <div className={styles.sysCardMeta}>
                <Chip label={n.confidence || "Learning"} color={conf.color} bg={conf.bg} small />
                {n.date && <span className={styles.sysCardMetaDate}>{formatDate(n.date)}</span>}
              </div>
              {isOpen && (
                <div>
                  <div className={styles.sysCardNotes}>{n.notes || "No notes yet."}</div>
                  <div className={styles.sysCardActions}>
                    <button className={ui.btnSmall} onClick={(e) => { e.stopPropagation(); onEdit(n); }}>
                      Edit
                    </button>
                    <button className={ui.btnDanger} onClick={(e) => { e.stopPropagation(); onDelete(n.id); }}>
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {notes.length === 0 && (
          <div className={styles.emptyState}>No topics yet — add your first system design study ⬡</div>
        )}
      </div>
    </div>
  );
}
