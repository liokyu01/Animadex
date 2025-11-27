import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import EntryForm from './components/EntryForm';
import { sampleEntries } from './data/SampleEntries';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
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
    });
    setIsFormOpen(true);
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
  >
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
          Léandre's Animadex (Asia)
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

      {/* FILTER HEADER */}
      <Header
        query={query}
        setQuery={setQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        captureFilter={captureFilter}
        setCaptureFilter={setCaptureFilter}
        openAddForm={openAddForm}
      />

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
