import styles from "../../styles/ui.module.css";

export default function CustomCheck({ checked, onChange, color, label }) {
  return (
    <label className={styles.checkboxWrap}>
      <div
        className={checked ? styles.checkboxBoxChecked : styles.checkboxBox}
        style={{
          borderColor: checked ? color : undefined,
          background: checked ? color : undefined,
        }}
      >
        {checked && "✓"}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.hiddenInput}
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  );
}
