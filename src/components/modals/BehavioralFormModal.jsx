import { useState, useEffect } from "react";
import { Modal, Field } from "../ui";
import { BEHAVIORAL_CATEGORIES } from "../../utils/constants";
import { uid } from "../../utils/helpers";
import ui from "../../styles/ui.module.css";

const BLANK = { title: "", category: BEHAVIORAL_CATEGORIES[0], situation: "", task: "", action: "", result: "" };

export default function BehavioralFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(BLANK);
  useEffect(() => { setForm(initial || BLANK); }, [initial, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Story" : "New STAR Story"}>
      <Field label="Title">
        <input className={ui.input} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Led cross-team data migration" />
      </Field>
      <Field label="Category">
        <select className={ui.select} value={form.category} onChange={(e) => set("category", e.target.value)}>
          {BEHAVIORAL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      {["situation", "task", "action", "result"].map((k) => (
        <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
          <textarea className={ui.textarea} style={{ minHeight: 50 }} value={form[k]} onChange={(e) => set(k, e.target.value)} />
        </Field>
      ))}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className={ui.btnSecondary} onClick={onClose}>Cancel</button>
        <button className={ui.btnPrimary} onClick={() => { onSave({ ...form, id: form.id || uid() }); onClose(); }}>Save</button>
      </div>
    </Modal>
  );
}
