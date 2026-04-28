import { useState } from "react";
import { Chip, StatCard } from "../ui";
import { DSA_TOPICS, DIFF_META } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";
import styles from "../../styles/views.module.css";
import ui from "../../styles/ui.module.css";

/* ─── AI Code Analysis ─── */
async function analyzeCode(problem) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 1000,
      messages: [{ role: "user", content: `You are a senior SWE reviewing a DSA solution. Be concise and specific. Use markdown.\n\nProblem: ${problem.name}\nTopic: ${problem.topic}\nDifficulty: ${problem.difficulty}\n${problem.timeMin ? `Solve time: ${problem.timeMin} minutes` : ""}\n${problem.notes ? `Student notes: ${problem.notes}` : ""}\n\nCode:\n\`\`\`\n${problem.code}\n\`\`\`\n\nProvide analysis:\n## Complexity\nTime and space complexity.\n\n## What's Good\n1-2 things done well.\n\n## Improvements\n1-2 concrete optimizations. Show short code snippets if helpful.\n\n## Alternative Approach\nOne different algorithm/pattern with tradeoffs.\n\n## Rating\nOptimal / Good / Needs Work — one-line justification.` }]
    })
  });
  const data = await resp.json();
  return data.content?.map(b => b.text || "").join("\n") || "Analysis unavailable.";
}

/* ─── Markdown Renderer ─── */
function SimpleMarkdown({ text }) {
  return <div>{text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h3 key={i} className={styles.mdH3}>{line.slice(3)}</h3>;
    if (line.startsWith("# ")) return <h2 key={i} className={styles.mdH2}>{line.slice(2)}</h2>;
    if (line.startsWith("```")) return null;
    if (line.startsWith("- ")) return <div key={i} className={styles.mdBullet}><span className={styles.mdBulletDot}>•</span>{line.slice(2)}</div>;
    if (line.startsWith("**") && line.endsWith("**")) return <div key={i} className={styles.mdBold}>{line.slice(2, -2)}</div>;
    if (line.match(/^`[^`]+`$/)) return <code key={i} className={styles.mdCodeBlock}>{line.slice(1, -1)}</code>;
    if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
    const html = line.replace(/`([^`]+)`/g, '<code style="background:#EEEAF6;padding:2px 6px;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:12px">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return <div key={i} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: html }} />;
  })}</div>;
}

/* ─── Detail Panel ─── */
function DSADetailPanel({ problem, onSave, onClose }) {
  const [code, setCode] = useState(problem.code || "");
  const [notes, setNotes] = useState(problem.notes || "");
  const [analysis, setAnalysis] = useState(problem.aiAnalysis || "");
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { onSave({ ...problem, code, notes, aiAnalysis: analysis }); setSaved(true); setTimeout(() => setSaved(false), 1500); };
  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setAnalyzing(true); setActiveTab("analysis");
    try { const result = await analyzeCode({ ...problem, code, notes }); setAnalysis(result); onSave({ ...problem, code, notes, aiAnalysis: result }); }
    catch { setAnalysis("Failed to analyze. Check your connection and try again."); }
    setAnalyzing(false);
  };

  const dm = DIFF_META[problem.difficulty] || DIFF_META.Medium;
  const tabs = [{ id: "code", label: "Code", icon: "⟐" }, { id: "notes", label: "Notes", icon: "✎" }, { id: "analysis", label: "AI Review", icon: "✦" }];

  return (
    <div className={styles.detailPanel}>
      <div className={styles.detailHeader}>
        <div className={styles.detailHeaderLeft}>
          <span className={styles.detailTitle}>{problem.name}</span>
          <Chip label={problem.topic} color="var(--blue)" bg="var(--blue-soft)" small />
          <Chip label={problem.difficulty} color={dm.color} bg={dm.bg} small />
          {problem.timeMin && <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>{problem.timeMin}m</span>}
          {(problem.companyTags || []).map(c => <Chip key={c} label={c} color="var(--coral)" bg="var(--coral-soft)" small />)}
        </div>
        <div className={styles.detailHeaderActions}>
          <button onClick={handleSave} className={ui.btnSmall} style={saved ? { color: "var(--green)", borderColor: "var(--green)" } : undefined}>{saved ? "✓ Saved" : "Save"}</button>
          <button onClick={onClose} className={ui.btnSmall}>Close</button>
        </div>
      </div>
      <div className={styles.detailTabs}>
        {tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} className={activeTab === t.id ? styles.detailTabActive : styles.detailTab}>
          <span style={{ marginRight: 4 }}>{t.icon}</span>{t.label}
          {t.id === "analysis" && analysis && <span style={{ marginLeft: 4, width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />}
        </button>)}
      </div>
      <div className={styles.detailContent}>
        {activeTab === "code" && <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Solution Code</span>
            <button onClick={handleAnalyze} disabled={analyzing || !code.trim()} className={ui.btnPrimary} style={{ padding: "7px 16px", fontSize: 11, opacity: (analyzing || !code.trim()) ? 0.5 : 1, cursor: (analyzing || !code.trim()) ? "not-allowed" : "pointer" }}>{analyzing ? "Analyzing..." : "✦ AI Review"}</button>
          </div>
          <textarea value={code} onChange={e => setCode(e.target.value)} placeholder={"# Paste your solution here\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i"} className={styles.codeEditor}
            onKeyDown={e => { if (e.key === "Tab") { e.preventDefault(); const s = e.target.selectionStart; const end = e.target.selectionEnd; setCode(code.substring(0, s) + "    " + code.substring(end)); setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 4; }, 0); } }} />
        </div>}
        {activeTab === "notes" && <div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 10 }}>Problem Notes & Approach</span>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder={"What was your approach?\nWhat pattern did you recognize?\nWhat tripped you up?\nKey takeaway for next time..."} className={ui.input} style={{ minHeight: 250, resize: "vertical", lineHeight: 1.7 }} />
        </div>}
        {activeTab === "analysis" && <div>
          {analyzing ? <div className={styles.aiSpinner}><div className={styles.spinner} /><span style={{ color: "var(--text-muted)", fontSize: 13 }}>Claude is reviewing your code...</span></div>
            : analysis ? <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.8 }}><SimpleMarkdown text={analysis} /></div>
              : <div className={styles.aiEmpty}><span className={styles.aiEmptyIcon}>✦</span><span style={{ color: "var(--text-muted)", fontSize: 13 }}>Paste your code and click "AI Review" to get analysis</span></div>}
        </div>}
      </div>
    </div>
  );
}

/* ─── Analytics ─── */
function DSAAnalytics({ problems }) {
  const weeks = []; for (let w = 7; w >= 0; w--) { const start = new Date(); start.setDate(start.getDate() - (w + 1) * 7); const end = new Date(); end.setDate(end.getDate() - w * 7); weeks.push({ label: `W${8 - w}`, count: problems.filter(p => { const d = new Date(p.date); return d >= start && d < end; }).length }); }
  const maxWeek = Math.max(...weeks.map(w => w.count), 1);
  const topicStats = {}; DSA_TOPICS.forEach(t => { topicStats[t] = { count: 0, totalTime: 0, easy: 0, med: 0, hard: 0, reviews: 0 }; });
  problems.forEach(p => { const s = topicStats[p.topic]; if (!s) return; s.count++; if (p.timeMin) s.totalTime += Number(p.timeMin); if (p.difficulty === "Easy") s.easy++; if (p.difficulty === "Medium") s.med++; if (p.difficulty === "Hard") s.hard++; if (p.needsReview) s.reviews++; });
  const activeTops = Object.entries(topicStats).filter(([, s]) => s.count > 0).sort((a, b) => b[1].count - a[1].count);
  const timed = problems.filter(p => p.timeMin).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-20);
  const maxTime = Math.max(...timed.map(p => Number(p.timeMin)), 1);
  const months = {}; problems.forEach(p => { const m = p.date?.slice(0, 7); if (!m) return; if (!months[m]) months[m] = { easy: 0, med: 0, hard: 0, total: 0 }; months[m][p.difficulty === "Easy" ? "easy" : p.difficulty === "Medium" ? "med" : "hard"]++; months[m].total++; });
  const monthKeys = Object.keys(months).sort();
  const dateSet = new Set(problems.map(p => p.date)); let streak = 0; const today = new Date(); for (let i = 0; i < 365; i++) { const d = new Date(today); d.setDate(d.getDate() - i); if (dateSet.has(d.toISOString().slice(0, 10))) streak++; else break; }
  const avgTime = timed.length > 0 ? Math.round(timed.reduce((s, p) => s + Number(p.timeMin), 0) / timed.length) : 0;
  const panel = { background: "var(--surface)", borderRadius: 14, padding: 20, border: "1.5px solid var(--border)", boxShadow: "var(--shadow)" };
  const pTitle = { fontSize: 11, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 };

  return <div>
    <div className={styles.analyticsStats}>
      <StatCard label="Total Solved" value={problems.length} color="var(--purple)" emoji="⟐" />
      <StatCard label="Current Streak" value={`${streak}d`} color="var(--coral)" emoji="🔥" />
      <StatCard label="Avg Solve Time" value={avgTime ? `${avgTime}m` : "—"} color="var(--blue)" emoji="⏱" />
      <StatCard label="Need Review" value={problems.filter(p => p.needsReview).length} color="var(--pink)" emoji="↻" />
      <StatCard label="Topics Covered" value={activeTops.length} color="var(--green)" emoji="◈" />
    </div>
    <div className={styles.analyticsGrid}>
      <div style={panel}><div style={pTitle}>Weekly Solve Rate</div>
        <div className={styles.barChartRow}>{weeks.map((w, i) => <div key={i} className={styles.barChartCol}><span className={styles.barChartValue}>{w.count}</span><div style={{ width: "100%", maxWidth: 36, height: `${Math.max((w.count / maxWeek) * 90, 4)}px`, background: w.count > 0 ? "linear-gradient(180deg, var(--purple), var(--lavender))" : "var(--surface-alt)", borderRadius: 6, transition: "height 0.4s ease" }} /><span className={styles.barChartLabel}>{w.label}</span></div>)}</div>
      </div>
      <div style={panel}><div style={pTitle}>Solve Time Trend</div>
        {timed.length >= 2 ? <div style={{ position: "relative", height: 120 }}><svg width="100%" height="120" viewBox={`0 0 ${timed.length * 30} 120`} preserveAspectRatio="none" style={{ overflow: "visible" }}><defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--blue)" stopOpacity="0.3" /><stop offset="100%" stopColor="var(--blue)" stopOpacity="0.02" /></linearGradient></defs><path d={`M0,${110 - (Number(timed[0].timeMin) / maxTime) * 90} ` + timed.map((p, i) => `L${i * 30},${110 - (Number(p.timeMin) / maxTime) * 90}`).join(" ") + ` L${(timed.length - 1) * 30},110 L0,110 Z`} fill="url(#areaGrad)" /><polyline points={timed.map((p, i) => `${i * 30},${110 - (Number(p.timeMin) / maxTime) * 90}`).join(" ")} fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />{timed.map((p, i) => <circle key={i} cx={i * 30} cy={110 - (Number(p.timeMin) / maxTime) * 90} r="3.5" fill="var(--surface)" stroke="var(--blue)" strokeWidth="2" />)}</svg></div>
          : <div style={{ color: "var(--text-muted)", fontSize: 12, textAlign: "center", padding: 40 }}>Log 2+ timed problems to see trends</div>}
      </div>
      <div style={{ ...panel, gridColumn: "1 / -1" }}><div style={pTitle}>Topic Mastery</div>
        <div className={styles.topicGrid}>{activeTops.map(([topic, s]) => { const avgT = s.totalTime > 0 ? Math.round(s.totalTime / s.count) : null; const intensity = Math.min(s.count / 8, 1); return <div key={topic} className={styles.topicCard} style={{ background: `rgba(139,108,246,${0.04 + intensity * 0.12})`, border: `1px solid rgba(139,108,246,${0.1 + intensity * 0.15})` }}><div className={styles.topicCardHeader}><span className={styles.topicCardName}>{topic}</span><span className={styles.topicCardCount}>{s.count}</span></div><div className={styles.topicCardChips}><Chip label={`E${s.easy}`} color="var(--green)" bg="var(--green-soft)" small /><Chip label={`M${s.med}`} color="var(--yellow)" bg="var(--yellow-soft)" small /><Chip label={`H${s.hard}`} color="var(--pink)" bg="var(--pink-soft)" small />{avgT && <span className={styles.topicCardAvg}>~{avgT}m</span>}{s.reviews > 0 && <Chip label={`${s.reviews}↻`} color="var(--pink)" bg="var(--pink-soft)" small />}</div></div>; })}{activeTops.length === 0 && <div className={styles.emptyState}>Solve problems to see topic mastery</div>}</div>
      </div>
      {/* Company Prep */}
      {(() => {
        const companyStats = {};
        problems.forEach(p => {
          (p.companyTags || []).forEach(c => {
            if (!companyStats[c]) companyStats[c] = { count: 0, easy: 0, med: 0, hard: 0, topics: new Set() };
            companyStats[c].count++;
            if (p.difficulty === "Easy") companyStats[c].easy++;
            if (p.difficulty === "Medium") companyStats[c].med++;
            if (p.difficulty === "Hard") companyStats[c].hard++;
            companyStats[c].topics.add(p.topic);
          });
        });
        const companySorted = Object.entries(companyStats).sort((a, b) => b[1].count - a[1].count);
        if (companySorted.length === 0) return null;
        const maxC = companySorted[0]?.[1].count || 1;
        return (
          <div style={{ ...panel, gridColumn: "1 / -1" }}>
            <div style={pTitle}>Company Prep</div>
            <div className={styles.topicGrid}>
              {companySorted.map(([company, s]) => {
                const intensity = Math.min(s.count / 10, 1);
                return (
                  <div key={company} className={styles.topicCard} style={{
                    background: `rgba(237,136,114,${0.04 + intensity * 0.12})`,
                    border: `1px solid rgba(237,136,114,${0.1 + intensity * 0.15})`,
                  }}>
                    <div className={styles.topicCardHeader}>
                      <span className={styles.topicCardName}>{company}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--coral)" }}>{s.count}</span>
                    </div>
                    <div className={styles.topicCardChips}>
                      <Chip label={`E${s.easy}`} color="var(--green)" bg="var(--green-soft)" small />
                      <Chip label={`M${s.med}`} color="var(--yellow)" bg="var(--yellow-soft)" small />
                      <Chip label={`H${s.hard}`} color="var(--pink)" bg="var(--pink-soft)" small />
                      <span className={styles.topicCardAvg}>{s.topics.size} topics</span>
                    </div>
                    {/* Mini bar */}
                    <div style={{ marginTop: 8, height: 5, background: "var(--surface-alt)", borderRadius: 3 }}>
                      <div style={{
                        height: "100%", width: `${(s.count / maxC) * 100}%`,
                        background: "linear-gradient(90deg, var(--coral), var(--pink))",
                        borderRadius: 3, transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
      {monthKeys.length > 0 && <div style={{ ...panel, gridColumn: "1 / -1" }}><div style={pTitle}>Monthly Difficulty Progression</div>
        <div className={styles.monthlyRow}>{monthKeys.map(m => { const d = months[m]; const maxM = Math.max(...Object.values(months).map(x => x.total), 1); const h = (d.total / maxM) * 110; return <div key={m} className={styles.monthlyCol}><span className={styles.barChartValue}>{d.total}</span><div className={styles.monthlyStack}><div style={{ height: (d.hard / d.total) * h, background: "var(--pink)" }} /><div style={{ height: (d.med / d.total) * h, background: "var(--yellow)" }} /><div style={{ height: (d.easy / d.total) * h, background: "var(--green)" }} /></div><span className={styles.barChartLabel}>{m.slice(5)}/{m.slice(2, 4)}</span></div>; })}</div>
        <div className={styles.monthlyLegend}>{[["Easy", "var(--green)"], ["Medium", "var(--yellow)"], ["Hard", "var(--pink)"]].map(([l, c]) => <div key={l} className={styles.legendItem}><div className={styles.legendDot} style={{ background: c }} />{l}</div>)}</div>
      </div>}
    </div>
  </div>;
}

/* ─── Main DSA View ─── */
export default function DSAView({ problems, onAdd, onEdit, onDelete, onUpdate }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [subTab, setSubTab] = useState("list");
  const filtered = filter === "All" ? problems : problems.filter(p => p.topic === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  const selectedProblem = selected ? problems.find(p => p.id === selected) : null;

  if (selectedProblem) return <DSADetailPanel problem={selectedProblem} onSave={onUpdate} onClose={() => setSelected(null)} />;

  return <div>
    <div className={styles.dsaSubTabs}>
      {[{ id: "list", label: "Problem Log" }, { id: "analytics", label: "Analytics" }].map(t => <button key={t.id} onClick={() => setSubTab(t.id)} className={subTab === t.id ? styles.dsaSubTabActive : styles.dsaSubTab}>{t.label}</button>)}
    </div>
    {subTab === "analytics" && <DSAAnalytics problems={problems} />}
    {subTab === "list" && <>
      <div className={styles.dsaToolbar}>
        <select value={filter} onChange={e => setFilter(e.target.value)} className={ui.select} style={{ width: "auto", padding: "8px 32px 8px 12px", fontSize: 12 }}><option value="All">All Topics</option>{DSA_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}</select>
        <span className={styles.dsaCount}>{sorted.length} problems</span>
        <button onClick={onAdd} className={ui.btnPrimary} style={{ padding: "8px 16px", fontSize: 12, marginLeft: "auto" }}>+ Problem</button>
      </div>
      <div className={styles.dsaTableWrap}>
        <table className={styles.dsaTable}><thead><tr>{["Problem", "Topic", "Diff", "Companies", "Time", "Date", "Code", "Review", ""].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{sorted.map((p, i) => <tr key={p.id} className={`${i < sorted.length - 1 ? styles.dsaRowBorder : ""} ${styles.dsaRowClickable}`} onClick={() => setSelected(p.id)}>
            <td>{p.url ? <a href={p.url} target="_blank" rel="noreferrer" className={styles.dsaProblemLink} onClick={e => e.stopPropagation()}>{p.name}</a> : <span className={styles.dsaProblemName}>{p.name}</span>}</td>
            <td><Chip label={p.topic} color="var(--blue)" bg="var(--blue-soft)" small /></td>
            <td><Chip label={p.difficulty} color={DIFF_META[p.difficulty].color} bg={DIFF_META[p.difficulty].bg} small /></td>
            <td><div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{(p.companyTags || []).map(c => <Chip key={c} label={c} color="var(--coral)" bg="var(--coral-soft)" small />)}</div></td>
            <td className={styles.dsaTime}>{p.timeMin ? `${p.timeMin}m` : "—"}</td>
            <td className={styles.dsaDate}>{formatDate(p.date)}</td>
            <td><div style={{ display: "flex", gap: 3 }}>{p.code && <Chip label="✓" color="var(--green)" bg="var(--green-soft)" small />}{p.aiAnalysis && <Chip label="AI" color="var(--purple)" bg="var(--purple-soft)" small />}</div></td>
            <td>{p.needsReview && <Chip label="Review" color="var(--pink)" bg="var(--pink-soft)" small />}</td>
            <td><div style={{ display: "flex", gap: 4 }}><button className={ui.btnSmall} style={{ color: "var(--purple)", borderColor: "rgba(139,108,246,0.27)", background: "var(--purple-soft)" }} onClick={e => { e.stopPropagation(); setSelected(p.id); }}>View</button><button className={ui.btnSmall} onClick={e => { e.stopPropagation(); onEdit(p); }}>✎</button><button className={ui.btnDanger} onClick={e => { e.stopPropagation(); onDelete(p.id); }}>✕</button></div></td>
          </tr>)}{sorted.length === 0 && <tr><td colSpan={9} className={styles.dsaEmpty}>No problems logged yet — start grinding! ✦</td></tr>}</tbody>
        </table>
      </div>
    </>}
  </div>;
}
