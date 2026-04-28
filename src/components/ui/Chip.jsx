import styles from "../../styles/ui.module.css";

export default function Chip({ label, color, bg, small }) {
  return (
    <span
      className={`${styles.chip} ${small ? styles.chipSmall : ""}`}
      style={{
        background: bg || undefined,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {label}
    </span>
  );
}
