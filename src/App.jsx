import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import EntryForm from './components/EntryForm';
import { sampleEntries } from './data/SampleEntries';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc,setDoc  } from "firebase/firestore";
import { db, auth } from "./firebase"; 
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";




export default function App() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [captureFilter, setCaptureFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const adminDoc = await getDoc(doc(db, "admins", u.uid));
          setIsAdmin(adminDoc.exists());
        } catch (err) {
          console.error("Error checking admin status:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    async function loadEntries() {
      try {
        const querySnapshot = await getDocs(collection(db, "entries"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setEntries(data);
        } else {
          setEntries(sampleEntries);
        }
      } catch (err) {
        console.error("Error loading entries:", err);
        setEntries(sampleEntries);
      }
    }
    loadEntries();

    return () => unsubscribe();
  }, []);

  function downloadEntries() {
    const dataStr = JSON.stringify(entries, null, 2); // formaté joliment
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

const [backupProgress, setBackupProgress] = useState({
  uploading: false,
  uploaded: 0,
  total: 0
});

 async function loadBackup(e) {
  if (!user || !isAdmin) {
    alert("Only admins can load backups");
    return;
  }

  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const backupEntries = JSON.parse(reader.result);

      if (!Array.isArray(backupEntries)) {
        alert("Invalid backup file format");
        return;
      }

      setBackupProgress({ uploading: true, uploaded: 0, total: backupEntries.length });

      for (let i = 0; i < backupEntries.length; i++) {
        const entry = backupEntries[i];
        const entryRef = entry.id ? doc(db, "entries", entry.id) : null;

        if (entry.id) {
          const existing = await getDoc(entryRef);
          const { id, ...payloadWithoutId } = entry;
          if (existing.exists()) {
            await updateDoc(entryRef, payloadWithoutId);
          } else {
            await setDoc(entryRef, payloadWithoutId);
          }
        } else {
          const { id, ...payloadWithoutId } = entry;
          await addDoc(collection(db, "entries"), payloadWithoutId);
        }

        setBackupProgress(prev => ({ ...prev, uploaded: prev.uploaded + 1 }));
      }

      // Reload entries
      const querySnapshot = await getDocs(collection(db, "entries"));
      setEntries(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setBackupProgress({ uploading: false, uploaded: 0, total: 0 });
      alert("Backup loaded successfully!");
    } catch (err) {
      console.error("Failed to load backup:", err);
      alert("Failed to load backup. Check console for details.");
      setBackupProgress({ uploading: false, uploaded: 0, total: 0 });
    }
  };
  reader.readAsText(file);
}



  function openAddForm() {
    if (!user || !isAdmin) {
      alert("Only admins can add entries");
      return;
    }
    setEditing({
      id: null,
      image: '',
      latin: '',
      english: '',
      french: '',
      japanese: '',
      category: 'bird',
      locations: [],
      capture: 'photo',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
      infoLink: '', 
    });
    setIsFormOpen(true);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function onEdit(entry) {
    if (!user || !isAdmin) {
      alert("Only admins can edit entries");
      return;
    }
    setEditing({ ...entry });
    setIsFormOpen(true);
  }

  async function onDelete(id) {
    if (!user || !isAdmin) {
      alert("Only admins can delete entries");
      return;
    }
    if (!confirm("Delete?")) return;
    try {
      await deleteDoc(doc(db, "entries", id));
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
    if (!user || !isAdmin) {
      alert("Only admins can save entries");
      return;
    }

    const payload = { ...editing };

    try {
      if (!payload.id) {
        const { id, ...payloadWithoutId } = payload;
        const docRef = await addDoc(collection(db, "entries"), payloadWithoutId);
        const newEntry = { ...payloadWithoutId, id: docRef.id };
        setEntries(prev => [newEntry, ...prev]);
      } else {
        const { id, ...payloadWithoutId } = payload;
        const docRef = doc(db, "entries", payload.id);
        await updateDoc(docRef, payloadWithoutId);
        setEntries(prev => prev.map(e => (e.id === payload.id ? payload : e)));
      }

      setIsFormOpen(false);
      setEditing(null);
    } catch (err) {
      console.error("Failed to save entry:", err);
    }
  }

  const filtered = entries.filter(e => {
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      [e.latin, e.english, e.french, e.japanese, ...(e.locations || [])]
        .join(' ')
        .toLowerCase()
        .includes(q);
    const matchesCategory = !categoryFilter || e.category === categoryFilter;
    const matchesCapture = !captureFilter || e.capture === captureFilter;
    return matchesQuery && matchesCategory && matchesCapture;
  });

  const categoryCounts = {};
  filtered.forEach(e => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
  });

  const captureCounts = {};
  filtered.forEach(e => {
    captureCounts[e.capture] = (captureCounts[e.capture] || 0) + 1;
  });

  const provider = new GoogleAuthProvider();
  const login = () => signInWithPopup(auth, provider).catch(console.error);
  const logout = () => signOut(auth).catch(console.error);

  return (
  <div
    style={{
    width: "100vw",           // <- use 100% instead of 100vw
      minHeight: "100vh",
    boxSizing: "border-box",  // <- include padding in width calculation
      backgroundColor: "#5a1a1aff",   
    }}
  >{backupProgress.uploading && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
    }}
  >
    <div
      style={{
        backgroundColor: "#1e5882ff",
        padding: "24px",
        borderRadius: "12px",
        width: "400px",
        boxSizing: "border-box",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>Uploading Backup</h2>
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: `${(backupProgress.uploaded / backupProgress.total) * 100}%`,
            height: "100%",
            backgroundColor: "#2563eb",
            transition: "width 0.2s",
          }}
        />
      </div>
      <div>
        {backupProgress.uploaded} / {backupProgress.total} entries uploaded
      </div>
    </div>
  </div>
)}

   {/* Sticky banner */}
      {isBannerVisible && (
        <div style={{ 
          position: "sticky", 
          top: 0, 
          zIndex: 1000,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",        // fills the container minus padding
          padding: "16px 100px",
          boxSizing: "border-box",
           }}>
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
            downloadEntries = {downloadEntries}
            loadBackup = {loadBackup}
          />
        </div>
      )}

      {/* Show banner button */}
{!isBannerVisible && (
  <div
    style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      width: "100%",
      padding: "8px",
      textAlign: "center",
      boxSizing: "border-box",
    }}
  >
    <button
      onClick={() => setIsBannerVisible(true)}
      style={{
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#2563eb",
        color: "white",
        fontWeight: "bold",
      }}
    >
      Show Banner
    </button>
  </div>
)}



{/* MAIN CONTENT */}
<div
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
    boxSizing: "border-box",
  }}
>
  {/* Cards, forms, footer */}
</div>

    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",        // fills the container minus padding
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          Léandre's Animadex
        </h1>

        <div>
          {user ? (
            <>
              <span style={{ marginRight: "8px" }}>
                {user.displayName} {isAdmin && "(Admin)"}
              </span>

              <button
                onClick={logout}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={login}
              style={{
                padding: "6px 12px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* GRID SYSTEM */}
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "32px",
    justifyItems: "center",
    boxSizing: "border-box",  // <- add this
    overflowX: "hidden", // <- prevent horizontal scroll
  }}
>
        {/* NEW ENTRY FORM */}
        {editing && editing.id === null && (
          <div
            style={{
              gridColumn: "1 / -1", // full row
            }}
          >
            <EntryForm
              editing={editing}
              setEditing={setEditing}
              onSubmit={handleSubmit}
              onCancel={() => setEditing(null)}
              handleImageUpload={handleImageUpload}
            />
          </div>
        )}

        {/* CARDS */}
        {filtered.map((e) => (
          <React.Fragment key={e.id}>
            <Card entry={e} onEdit={onEdit} onDelete={onDelete} />

            {/* EDIT FORM BELOW CARD */}
            {editing && editing.id === e.id && (
              <div style={{ gridColumn: "1 / -1" }}>
                <EntryForm
                  editing={editing}
                  setEditing={setEditing}
                  onSubmit={handleSubmit}
                  onCancel={() => setEditing(null)}
                  handleImageUpload={handleImageUpload}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "32px",
          fontSize: "0.85rem",
          color: "#6b7280",
        }}
      >
        You reached the end of the animadex: Now please go outside and find new species!
      </footer>
    </div>
  </div>
);

}
