/* ═══════════════════════════════════════════
   Persistence Layer
   
   Swap this file to switch between:
   - localStorage (default, single device)
   - Supabase (multi-device sync)
   ═══════════════════════════════════════════ */

const STORAGE_KEY = "launchpad-tracker-data";

export const EMPTY_STATE = {
  applications: [],
  dsaProblems: [],
  sysDesignNotes: [],
  behavioralStories: [],
};

export async function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Save failed:", e);
  }
}

export function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `launchpad-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        if (imported.applications && imported.dsaProblems) {
          resolve(imported);
        } else {
          reject(new Error("Invalid data structure"));
        }
      } catch {
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
