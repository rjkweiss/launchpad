import { useState } from "react";
import { Chip } from "../ui";
import styles from "../../styles/views.module.css";
import ui from "../../styles/ui.module.css";

const STAR_KEYS = ["situation", "task", "action", "result"];

export default function BehavioralView({ stories, onAdd, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={onAdd} className={ui.btnPrimary} style={{ padding: "8px 16px", fontSize: 12 }}>
          + Story
        </button>
      </div>

      {stories.map((s) => {
        const isOpen = expanded === s.id;
        return (
          <div
            key={s.id}
            className={isOpen ? styles.behCardActive : styles.behCard}
            onClick={() => setExpanded(isOpen ? null : s.id)}
          >
            <div className={styles.behCardHeader}>
              <div className={styles.behCardTitle}>{s.title}</div>
              <Chip label={s.category} color="var(--yellow)" bg="var(--yellow-soft)" small />
            </div>
            {isOpen && (
              <div style={{ marginTop: 14 }}>
                {STAR_KEYS.map((k) =>
                  s[k] ? (
                    <div key={k} className={styles.behStarBlock}>
                      <span className={styles.behStarLabel}>{k}</span>
                      <div className={styles.behStarText}>{s[k]}</div>
                    </div>
                  ) : null
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button className={ui.btnSmall} onClick={(e) => { e.stopPropagation(); onEdit(s); }}>
                    Edit
                  </button>
                  <button className={ui.btnDanger} onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}>
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {stories.length === 0 && (
        <div className={styles.emptyState}>No stories yet — bank your best STAR responses ◉</div>
      )}
    </div>
  );
}
