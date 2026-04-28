import { useState, useEffect } from "react";
import { Modal, Field } from "../ui";
import { SYSDESIGN_TOPICS } from "../../utils/constants";
import { uid, todayISO } from "../../utils/helpers";
import ui from "../../styles/ui.module.css";

const BLANK = { topic: SYSDESIGN_TOPICS[0], confidence: "Learning", notes: "", date: todayISO() };

export default function SysDesignFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(BLANK);
  useEffect(() => { setForm(initial || { ...BLANK, date: todayISO() }); }, [initial, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Topic" : "New Sys Design Topic"}>
      <Field label="Topic">
        <select className={ui.select} value={form.topic} onChange={(e) => set("topic", e.target.value)}>
          {SYSDESIGN_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Confidence">
        <select className={ui.select} value={form.confidence} onChange={(e) => set("confidence", e.target.value)}>
          {["Learning", "Decent", "Confident"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Notes">
        <textarea className={ui.textarea} style={{ minHeight: 120 }} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Key concepts, tradeoffs, diagram notes..." />
      </Field>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className={ui.btnSecondary} onClick={onClose}>Cancel</button>
        <button className={ui.btnPrimary} onClick={() => { onSave({ ...form, id: form.id || uid() }); onClose(); }}>Save</button>
      </div>
    </Modal>
  );
}
