// src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Card from "./components/Card";
import EntryForm from "./components/EntryForm";
import BackupModal from "./components/BackupModal";
import AdminMenu from "./components/AdminMenu";
import { sampleEntries } from "./data/SampleEntries";
import useAuth from "./hooks/useAuth";
import {
  fetchEntriesCollection,
  saveEntryToFirestore,
  deleteEntryFromFirestore,
  loadBackupToFirestore,
} from "./services/firestore";

export default function App() {
  const { user, isAdmin, login, logout } = useAuth();

  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [captureFilter, setCaptureFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const [selectedLanguage, setLanguage] = useState('latin');

  const [backupProgress, setBackupProgress] = useState({
    uploading: false,
    uploaded: 0,
    total: 0
  });

  // Load entries on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchEntriesCollection();
        setEntries(data.length ? data : sampleEntries);
      } catch (err) {
        console.error("Error loading entries:", err);
        setEntries(sampleEntries);
      }
    })();
  }, []);

  // --------------------
  // Backup functions
  // --------------------
  async function loadBackup(e) {
    if (!user || !isAdmin) {
      alert("Only admins can load backups");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    let backupEntries;
    try {
      backupEntries = JSON.parse(text);
      if (!Array.isArray(backupEntries)) throw new Error();
    } catch {
      alert("Invalid backup file format");
      return;
    }

    setBackupProgress({ uploading: true, uploaded: 0, total: backupEntries.length });

    try {
      await loadBackupToFirestore(backupEntries, (uploaded, total) => {
        setBackupProgress({ uploading: true, uploaded, total });
      });

      const refreshed = await fetchEntriesCollection();
      setEntries(refreshed);
      setBackupProgress({ uploading: false, uploaded: 0, total: 0 });
      alert("Backup loaded successfully!");
    } catch (err) {
      console.error("Failed to load backup:", err);
      setBackupProgress({ uploading: false, uploaded: 0, total: 0 });
      alert("Failed to load backup. Check console for details.");
    }
  }

  function downloadEntries() {
    const dataStr = JSON.stringify(entries, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `entries_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --------------------
  // Entry functions
  // --------------------
  function openAddForm() {
    if (!user || !isAdmin) { alert("Only admins can add entries"); return; }
    setEditing({
      id: null,
      image: '',
      latin: '',
      english: '',
      french: '',
      japanese: '',
      category: 'bird',
      locations: [{ country: "", region: "", subRegion: "" }],
      capture: 'photo',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
      infoLink: '',
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onEdit(entry) {
    if (!user || !isAdmin) { alert("Only admins can edit entries"); return; }
    setEditing({ ...entry });
    setIsFormOpen(true);
  }

  async function onDelete(id) {
    if (!user || !isAdmin) { alert("Only admins can delete entries"); return; }
    if (!confirm("Delete?")) return;
    try {
      await deleteEntryFromFirestore(id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditing(e => ({ ...e, image: reader.result }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !isAdmin) { alert("Only admins can save entries"); return; }

    try {
      const savedEntry = await saveEntryToFirestore(editing);
      setEntries(prev => {
        const exists = prev.find(e => e.id === savedEntry.id);
        if (exists) return prev.map(e => (e.id === savedEntry.id ? savedEntry : e));
        return [savedEntry, ...prev];
      });
      setIsFormOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("Failed to save entry:", err);
    }
  }

  // --------------------
  // Filtered entries
  // --------------------
const filtered = entries.filter(e => {
  const q = query.toLowerCase();

  // Convert each { country, region, subRegion } into a string
  const locationText = (e.locations || [])
    .map(loc => `${loc.country} ${loc.region} ${loc.subRegion}`)
    .join(" ");

  const matchesQuery = !query || [
    e.latin,
    e.english,
    e.french,
    e.japanese,
    locationText
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);

  const matchesCategory = !categoryFilter || e.category === categoryFilter;
  const matchesCapture  = !captureFilter || e.capture === captureFilter;

  return matchesQuery && matchesCategory && matchesCapture;
});

  const categoryCounts = {};
  filtered.forEach(e => categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1);

  const captureCounts = {};
  filtered.forEach(e => captureCounts[e.capture] = (captureCounts[e.capture] || 0) + 1);

  // --------------------
  // Render
  // --------------------
  return (
    <div style={{
       width: "100vw",
        minHeight: "100vh",
         boxSizing: "border-box",
          backgroundColor: "#5a1a1aff"
      }}>
      {/* Backup progress modal */}
      <BackupModal {...backupProgress} />

      {/* Sticky banner */}
      {isBannerVisible && (
        <div style={{
           position: "sticky",
           top: 0, 
           zIndex: 1000, 
           maxWidth: "1200px", 
           margin: "0 auto", 
           width: "100%", 
           padding: "16px 50px", 
           boxSizing: "border-box" }}>
          <Header
            query={query}
            setQuery={setQuery}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            captureFilter={captureFilter}
            setCaptureFilter={setCaptureFilter}
            openAddForm={openAddForm}
            categoryCounts={categoryCounts}
            captureCounts={captureCounts}
            setIsBannerVisible={setIsBannerVisible}
            selectedLanguage={selectedLanguage}
            setLanguage={setLanguage}
          />
        </div>
      )}

      {/* Show banner button */}
      {!isBannerVisible && (
        <div style={{ position: "sticky", top: 0, zIndex: 1000, width: "100%", padding: "8px", textAlign: "center", boxSizing: "border-box" }}>
          <button onClick={() => setIsBannerVisible(true)} style={{ padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", backgroundColor: "#2563eb", color: "white", fontWeight: "bold" }}>
            Show Banner
          </button>
        </div>
      )}

      {/* Header top bar */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", padding: "24px", boxSizing: "border-box",textAlign: "center" }}>
        <div style={{ display: "flex",
           justifyContent: "space-between", 
      flexDirection: "row",
           alignItems: "center",
            marginBottom: "16px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Léandre's Animadex</h1>
          <div>
            {user ? (
              <>
                <span style={{ marginRight: "8px" }}>
                  {user.displayName} {isAdmin && "(Admin)"}
                </span>
                {isAdmin && (
                  <AdminMenu
                    downloadEntries={downloadEntries}
                    loadBackup={loadBackup}
                  />
                  
                )}
                <button onClick={logout} 
                style={{ padding: "6px 12px",
                 backgroundColor: "#ef4444",
                  color: "white", border: "none",
                   borderRadius: "6px", 
                   cursor: "pointer" }}>
                    Logout</button>
              </>
            ) : (
              <button onClick={login} style={{ padding: "6px 12px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Login</button>
            )}
          </div>
        </div>

        {/* Grid system */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "32px", justifyItems: "center", boxSizing: "border-box", overflowX: "hidden" }}>
          {/* NEW ENTRY FORM */}
          {editing && editing.id === null && (
            <div style={{ gridColumn: "1 / -1" }}>
              <EntryForm editing={editing} setEditing={setEditing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} handleImageUpload={handleImageUpload} />
            </div>
          )}

          {/* CARDS */}
          {filtered.map(e => (
            <React.Fragment key={e.id}>
              <Card 
              entry={e}
              onEdit={onEdit} 
              onDelete={onDelete} 
              selectedLanguage={selectedLanguage}/>
              {editing && editing.id === e.id && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <EntryForm editing={editing} setEditing={setEditing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} handleImageUpload={handleImageUpload} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* FOOTER */}
        <footer style={{ marginTop: "32px", fontSize: "0.85rem", color: "#6b7280" }}>
          You reached the end of the animadex: Now please go outside and find new species!
        </footer>
      </div>
    </div>
  );
}
