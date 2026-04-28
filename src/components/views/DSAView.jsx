import { useState } from "react";
import { Chip } from "../ui";
import { DSA_TOPICS, DIFF_META } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import styles from "../../styles/views.module.css";
import ui from "../../styles/ui.module.css";

export default function DSAView({ problems, onAdd, onEdit, onDelete }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? problems : problems.filter((p) => p.topic === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className={styles.dsaToolbar}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={ui.select}
          style={{ width: "auto", padding: "8px 32px 8px 12px", fontSize: 12 }}
        >
          <option value="All">All Topics</option>
          {DSA_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className={styles.dsaCount}>{sorted.length} problems</span>
        <button
          onClick={onAdd}
          className={ui.btnPrimary}
          style={{ padding: "8px 16px", fontSize: 12, marginLeft: "auto" }}
        >
          + Problem
        </button>
      </div>

      <div className={styles.dsaTableWrap}>
        <table className={styles.dsaTable}>
          <thead>
            <tr>
              {["Problem", "Topic", "Diff", "Time", "Date", "Review", ""].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.id} className={i < sorted.length - 1 ? styles.dsaRowBorder : undefined}>
                <td>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className={styles.dsaProblemLink}>
                      {p.name}
                    </a>
                  ) : (
                    <span className={styles.dsaProblemName}>{p.name}</span>
                  )}
                </td>
                <td><Chip label={p.topic} color="var(--blue)" bg="var(--blue-soft)" small /></td>
                <td><Chip label={p.difficulty} color={DIFF_META[p.difficulty].color} bg={DIFF_META[p.difficulty].bg} small /></td>
                <td className={styles.dsaTime}>{p.timeMin ? `${p.timeMin}m` : "—"}</td>
                <td className={styles.dsaDate}>{formatDate(p.date)}</td>
                <td>{p.needsReview && <Chip label="Review" color="var(--pink)" bg="var(--pink-soft)" small />}</td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className={ui.btnSmall} onClick={() => onEdit(p)}>✎</button>
                    <button className={ui.btnDanger} onClick={() => onDelete(p.id)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.dsaEmpty}>
                  No problems logged yet — start grinding! ✦
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
