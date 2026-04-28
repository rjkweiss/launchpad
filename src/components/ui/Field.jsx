import styles from "../../styles/ui.module.css";

export default function Field({ label, children }) {
  return (
    <div className={styles.fieldWrapper}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}
