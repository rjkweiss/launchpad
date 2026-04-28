import { useState, useEffect } from "react";
import { Modal, Field, CustomCheck } from "../ui";
import { DSA_TOPICS, DIFFICULTY } from "../../utils/constants";
import { uid, todayISO } from "../../utils/helpers";
import ui from "../../styles/ui.module.css";

const BLANK = {
  name: "", topic: DSA_TOPICS[0], difficulty: "Medium",
  timeMin: "", date: todayISO(), url: "", notes: "", needsReview: false,
  code: "", aiAnalysis: "",
};

export default function DSAFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(BLANK);
  useEffect(() => { setForm(initial || { ...BLANK, date: todayISO() }); }, [initial, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Problem" : "Log Problem"}>
      <Field label="Problem Name">
        <input className={ui.input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Two Sum" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Topic">
          <select className={ui.select} value={form.topic} onChange={(e) => set("topic", e.target.value)}>
            {DSA_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Difficulty">
          <select className={ui.select} value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
            {DIFFICULTY.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Time (min)">
          <input className={ui.input} type="number" value={form.timeMin} onChange={(e) => set("timeMin", e.target.value)} />
        </Field>
        <Field label="Date">
          <input className={ui.input} type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        </Field>
      </div>

      <Field label="LeetCode URL">
        <input className={ui.input} value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://leetcode.com/..." />
      </Field>
      <Field label="Notes">
        <textarea className={ui.textarea} style={{ minHeight: 50 }} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Key insight, pattern, trick..." />
      </Field>

      <div style={{ marginBottom: 14 }}>
        <CustomCheck checked={form.needsReview} onChange={(e) => set("needsReview", e.target.checked)} color="var(--pink)" label="Needs Review" />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className={ui.btnSecondary} onClick={onClose}>Cancel</button>
        <button className={ui.btnPrimary} onClick={() => { onSave({ ...form, id: form.id || uid() }); onClose(); }}>Save</button>
      </div>
    </Modal>
  );
}
