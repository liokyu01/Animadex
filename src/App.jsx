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
    // Listen to auth state
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

    // Load entries from Firebase
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
      id: `temp-${Date.now()}`, // temporary unique ID for React key
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
      if (payload.id.startsWith("temp-")) {
        // Add new entry
        const docRef = await addDoc(collection(db, "entries"), payload);
        payload.id = docRef.id; // Replace temp ID with Firebase ID
        setEntries(prev => [payload, ...prev]);
      } else {
        // Update existing entry
        const docRef = doc(db, "entries", payload.id);
        await updateDoc(docRef, payload);
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
      [e.latin,e.english, e.french, e.japanese, ...(e.locations || [])]
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Léandre's Animadex (Asia)</h1>
          <div>
            {user ? (
              <>
                <span className="mr-2">{user.displayName} {isAdmin && "(Admin)"}</span>
                <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={logout}>Logout</button>
              </>
            ) : (
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={login}>Login</button>
            )}
          </div>
        </div>

        <Header
          query={query}
          setQuery={setQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          captureFilter={captureFilter}
          setCaptureFilter={setCaptureFilter}
          openAddForm={openAddForm}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(e => (
            <Card key={e.id} entry={e} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>

        {isFormOpen && (
          <EntryForm
            editing={editing}
            setEditing={setEditing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditing(null);
            }}
            handleImageUpload={handleImageUpload}
          />
        )}

        <footer className="mt-8 text-sm text-gray-500">
          Tip: use this project to practice git — create a branch, add a new feature, open a pull request on GitHub.
        </footer>
      </div>
    </div>
  );
}
