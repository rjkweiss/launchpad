import { useState, useEffect } from "react";
import { Modal, Field, CustomCheck } from "../ui";
import { DSA_TOPICS, DIFFICULTY } from "../../utils/constants";
import { uid, todayISO } from "../../utils/helpers";
import ui from "../../styles/ui.module.css";

const BLANK = {
  name: "", topic: DSA_TOPICS[0], difficulty: "Medium",
  timeMin: "", date: todayISO(), url: "", notes: "", needsReview: false,
  code: "", aiAnalysis: "", companyTags: [],
};

export default function DSAFormModal({ open, onClose, onSave, initial, knownCompanies }) {
  const [form, setForm] = useState(BLANK);
  const [tagInput, setTagInput] = useState("");
  useEffect(() => {
    // setForm(initial || { ...BLANK, date: todayISO() });
    setForm(initial ? { ...BLANK, ...initial, companyTags: initial.companyTags || [] } : { ...BLANK, date: todayISO() });
    setTagInput("");
  }, [initial, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addTag = (company) => {
    const trimmed = company.trim();
    if (trimmed && !form.companyTags.includes(trimmed)) {
      set("companyTags", [...form.companyTags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (company) => {
    set("companyTags", form.companyTags.filter((c) => c !== company));
  };

  // Filter suggestions based on input
  const suggestions = tagInput.trim()
    ? (knownCompanies || []).filter(
        (c) => c.toLowerCase().includes(tagInput.toLowerCase()) && !form.companyTags.includes(c)
      ).slice(0, 5)
    : [];

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

      {/* Company Tags */}
      <Field label="Company Tags">
        <div style={{ position: "relative" }}>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 12px",
            background: "var(--surface-alt)", border: "1.5px solid var(--border)",
            borderRadius: 10, minHeight: 42, alignItems: "center",
          }}>
            {form.companyTags.map((c) => (
              <span key={c} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: "var(--coral-soft)", color: "var(--coral)",
                border: "1px solid rgba(237,136,114,0.3)",
              }}>
                {c}
                <button
                  onClick={() => removeTag(c)}
                  style={{
                    background: "none", border: "none", color: "var(--coral)",
                    cursor: "pointer", padding: 0, fontSize: 13, fontWeight: 800, lineHeight: 1,
                  }}
                >×</button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder={form.companyTags.length === 0 ? "e.g. Google, Meta, Apple..." : "Add company..."}
              style={{
                border: "none", outline: "none", background: "transparent",
                flex: 1, minWidth: 100, fontSize: 13, fontFamily: "var(--font)",
                color: "var(--text)", padding: "2px 0",
              }}
            />
          </div>
          {/* Autocomplete dropdown */}
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
              background: "var(--surface)", border: "1.5px solid var(--border)",
              borderRadius: 10, marginTop: 4, boxShadow: "var(--shadow)", overflow: "hidden",
            }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => addTag(s)}
                  style={{
                    display: "block", width: "100%", padding: "8px 14px",
                    background: "transparent", border: "none", textAlign: "left",
                    fontSize: 13, color: "var(--text)", cursor: "pointer",
                    fontFamily: "var(--font)",
                  }}
                  onMouseEnter={(e) => { e.target.style.background = "var(--surface-alt)"; }}
                  onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </Field>

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
