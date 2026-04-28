import { useState, useEffect } from "react";
import { Modal, Field, CustomCheck } from "../ui";
import { STAGES } from "../../utils/constants";
import { uid } from "../../utils/helpers";
import ui from "../../styles/ui.module.css";

const BLANK = {
  company: "", role: "", stage: "Wishlist", priority: "Medium",
  appliedDate: "", notes: "", url: "", contact: "",
  hasReferral: false, referralContact: "",
};

export default function AppFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(BLANK);
  useEffect(() => { setForm(initial || BLANK); }, [initial, open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Application" : "New Application"}>
      <Field label="Company">
        <input className={ui.input} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Stripe" />
      </Field>
      <Field label="Role">
        <input className={ui.input} value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Applied AI Intern" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Stage">
          <select className={ui.select} value={form.stage} onChange={(e) => set("stage", e.target.value)}>
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select className={ui.select} value={form.priority} onChange={(e) => set("priority", e.target.value)}>
            {["High", "Medium", "Low"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Applied Date">
        <input className={ui.input} type="date" value={form.appliedDate} onChange={(e) => set("appliedDate", e.target.value)} />
      </Field>
      <Field label="Job URL">
        <input className={ui.input} value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Contact / Recruiter">
        <input className={ui.input} value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="Name or email" />
      </Field>

      {/* Referral section */}
      <div style={{
        padding: "14px 16px", background: "var(--purple-soft)", borderRadius: 14,
        marginBottom: 14, border: "1.5px solid rgba(139,108,246,0.13)",
      }}>
        <div style={{ marginBottom: form.hasReferral ? 12 : 0 }}>
          <CustomCheck
            checked={form.hasReferral}
            onChange={(e) => set("hasReferral", e.target.checked)}
            color="var(--purple)"
            label="I have a referral ★"
          />
        </div>
        {form.hasReferral && (
          <input
            className={ui.input}
            style={{ background: "#fff" }}
            value={form.referralContact}
            onChange={(e) => set("referralContact", e.target.value)}
            placeholder="Referral name, team, or email"
          />
        )}
      </div>

      <Field label="Notes">
        <textarea className={ui.textarea} value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </Field>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className={ui.btnSecondary} onClick={onClose}>Cancel</button>
        <button className={ui.btnPrimary} onClick={() => { onSave({ ...form, id: form.id || uid() }); onClose(); }}>
          Save
        </button>
      </div>
    </Modal>
  );
}
