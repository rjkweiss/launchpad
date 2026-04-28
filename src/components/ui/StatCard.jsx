import styles from "../../styles/ui.module.css";

export default function StatCard({ label, value, color, emoji }) {
  return (
    <div className={styles.statCard} style={{ borderBottom: `3px solid ${color}44` }}>
      <div className={styles.statCardEmoji} style={{ color }}>{emoji}</div>
      <div className={styles.statCardValue} style={{ color }}>{value}</div>
      <div className={styles.statCardLabel}>{label}</div>
    </div>
  );
}
