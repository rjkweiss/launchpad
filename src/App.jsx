import { useState, useEffect, useCallback, useRef } from "react";
import { Dashboard, KanbanBoard, DSAView, SysDesignView, BehavioralView } from "./components/views";
import { AppFormModal, DSAFormModal, SysDesignFormModal, BehavioralFormModal } from "./components/modals";
import { TABS } from "./utils/constants";
import { EMPTY_STATE, loadData, saveData, exportJSON, importJSON } from "./utils/storage";
import styles from "./styles/app.module.css";
import ui from "./styles/ui.module.css";
import "./styles/tokens.css";

export default function App() {
  const [data, setData] = useState(EMPTY_STATE);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    loadData().then((d) => {
      if (d) setData(d);
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((newData) => {
    setData(newData);
    saveData(newData);
  }, []);

  // ─── CRUD Helpers ───

  const upsert = (key, item) => {
    const list = data[key];
    const idx = list.findIndex((x) => x.id === item.id);
    const updated = idx >= 0
      ? list.map((x) => (x.id === item.id ? item : x))
      : [...list, item];
    persist({ ...data, [key]: updated });
  };

  const remove = (key, id) => {
    persist({ ...data, [key]: data[key].filter((x) => x.id !== id) });
  };

  // ─── Import / Export ───

  const handleExport = () => exportJSON(data);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importJSON(file);
      persist(imported);
    } catch (err) {
      alert(err.message);
    }
    e.target.value = "";
  };

  // ─── Modal openers ───

  const openNew = (type) => { setEditItem(null); setModal(type); };
  const openEdit = (type, item) => { setEditItem(item); setModal(type); };
  const closeModal = () => setModal(null);

  // ─── Loading ───

  if (!loaded) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.app}>
      <div className={styles.bgGradient} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.logo}>
              <span className={styles.logoGradient}>✦ LaunchPad</span>
            </h1>
            <div className={styles.tagline}>track · prep · launch</div>
          </div>
          <div className={styles.headerActions}>
            <button onClick={handleExport} className={ui.btnSecondary} style={{ padding: "7px 14px", fontSize: 11, borderRadius: 10 }}>
              ↓ Export
            </button>
            <button onClick={() => fileRef.current?.click()} className={ui.btnSecondary} style={{ padding: "7px 14px", fontSize: 11, borderRadius: 10 }}>
              ↑ Import
            </button>
            <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabBar}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={tab === t.id ? styles.tabActive : styles.tab}
            >
              <span className={styles.tabEmoji}>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {tab === "dashboard" && <Dashboard data={data} />}

          {tab === "pipeline" && (
            <div>
              <div className={styles.toolbarRight}>
                <button onClick={() => openNew("app")} className={ui.btnPrimary} style={{ padding: "10px 20px", fontSize: 13 }}>
                  + Application
                </button>
              </div>
              <KanbanBoard
                apps={data.applications}
                onMove={(id, stage) => {
                  const app = data.applications.find((a) => a.id === id);
                  if (app) upsert("applications", { ...app, stage });
                }}
                onEdit={(app) => openEdit("app", app)}
                onDelete={(id) => remove("applications", id)}
              />
            </div>
          )}

          {tab === "dsa" && (
            <DSAView
              problems={data.dsaProblems}
              onAdd={() => openNew("dsa")}
              onEdit={(p) => openEdit("dsa", p)}
              onDelete={(id) => remove("dsaProblems", id)}
            />
          )}

          {tab === "sysdesign" && (
            <SysDesignView
              notes={data.sysDesignNotes}
              onAdd={() => openNew("sys")}
              onEdit={(n) => openEdit("sys", n)}
              onDelete={(id) => remove("sysDesignNotes", id)}
            />
          )}

          {tab === "behavioral" && (
            <BehavioralView
              stories={data.behavioralStories}
              onAdd={() => openNew("beh")}
              onEdit={(s) => openEdit("beh", s)}
              onDelete={(id) => remove("behavioralStories", id)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AppFormModal open={modal === "app"} onClose={closeModal} initial={editItem} onSave={(item) => upsert("applications", item)} />
      <DSAFormModal open={modal === "dsa"} onClose={closeModal} initial={editItem} onSave={(item) => upsert("dsaProblems", item)} />
      <SysDesignFormModal open={modal === "sys"} onClose={closeModal} initial={editItem} onSave={(item) => upsert("sysDesignNotes", item)} />
      <BehavioralFormModal open={modal === "beh"} onClose={closeModal} initial={editItem} onSave={(item) => upsert("behavioralStories", item)} />
    </div>
  );
}
