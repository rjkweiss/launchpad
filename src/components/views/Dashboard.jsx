import { StatCard } from "../ui";
import { STAGES, STAGE_META, DIFFICULTY, DIFF_META } from "../../utils/constants";
import styles from "../../styles/views.module.css";

export default function Dashboard({ data }) {
  const { applications: apps, dsaProblems: dsa, sysDesignNotes: sys, behavioralStories: beh } = data;

  const active = apps.filter((a) => !["Rejected", "Offer"].includes(a.stage)).length;
  const referrals = apps.filter((a) => a.hasReferral).length;

  const topicCounts = {};
  dsa.forEach((p) => { topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1; });
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  dsa.forEach((p) => { diffCounts[p.difficulty] = (diffCounts[p.difficulty] || 0) + 1; });

  const reviewCount = dsa.filter((p) => p.needsReview).length;
  const last7 = dsa.filter((p) => (Date.now() - new Date(p.date).getTime()) < 7 * 86400000).length;

  return (
    <div>
      {/* Stat cards */}
      <div className={styles.dashStats}>
        <StatCard label="Applications" value={apps.length} color="var(--purple)" emoji="◈" />
        <StatCard label="Active Pipeline" value={active} color="var(--blue)" emoji="◫" />
        <StatCard label="Referrals" value={referrals} color="var(--lavender)" emoji="★" />
        <StatCard label="DSA Solved" value={dsa.length} color="var(--green)" emoji="⟐" />
        <StatCard label="This Week" value={last7} color="var(--yellow)" emoji="⚡" />
        <StatCard label="Need Review" value={reviewCount} color="var(--pink)" emoji="↻" />
        <StatCard label="Sys Design" value={sys.length} color="var(--coral)" emoji="⬡" />
        <StatCard label="STAR Stories" value={beh.length} color="var(--yellow)" emoji="◉" />
      </div>

      <div className={styles.dashGrid}>
        {/* Difficulty spread */}
        <div className={styles.dashPanel}>
          <div className={styles.dashPanelTitle}>DSA Difficulty Spread</div>
          {DIFFICULTY.map((d) => {
            const pct = dsa.length > 0 ? (diffCounts[d] / dsa.length) * 100 : 0;
            const m = DIFF_META[d];
            return (
              <div key={d} className={styles.dashBarRow}>
                <div className={styles.dashBarHeader}>
                  <span className={styles.dashBarLabel} style={{ color: m.color }}>{d}</span>
                  <span className={styles.dashBarCount}>{diffCounts[d]}</span>
                </div>
                <div className={styles.dashBarTrack}>
                  <div
                    className={styles.dashBarFill}
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${m.color}, ${m.color}cc)` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top topics */}
        <div className={styles.dashPanel}>
          <div className={styles.dashPanelTitle}>Top DSA Topics</div>
          {topTopics.map(([topic, count]) => {
            const max = topTopics[0]?.[1] || 1;
            return (
              <div key={topic} className={styles.dashBarRow}>
                <div className={styles.dashBarHeader}>
                  <span style={{ color: "var(--text)", fontWeight: 600 }}>{topic}</span>
                  <span className={styles.dashBarCount}>{count}</span>
                </div>
                <div className={styles.dashBarTrack}>
                  <div
                    className={styles.dashBarFill}
                    style={{
                      width: `${(count / max) * 100}%`,
                      background: "linear-gradient(90deg, var(--purple), var(--lavender))",
                    }}
                  />
                </div>
              </div>
            );
          })}
          {topTopics.length === 0 && (
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>No problems logged yet</div>
          )}
        </div>

        {/* Pipeline overview */}
        <div className={styles.dashPanelFull}>
          <div className={styles.dashPanelTitle}>Pipeline Overview</div>
          <div className={styles.dashPipelineRow}>
            {STAGES.map((s) => {
              const count = apps.filter((a) => a.stage === s).length;
              const meta = STAGE_META[s];
              return (
                <div
                  key={s}
                  className={styles.dashPipelineCell}
                  style={{ background: meta.bg, border: `1.5px solid ${meta.color}22` }}
                >
                  <div className={styles.dashPipelineValue} style={{ color: meta.color }}>{count}</div>
                  <div className={styles.dashPipelineLabel}>{s}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
