import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import EntryForm from './components/EntryForm';
import { sampleEntries } from './data/SampleEntries';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [captureFilter, setCaptureFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    // Load entries from Firebase
    async function loadEntries() {
      try {
        const querySnapshot = await getDocs(collection(db, "entries"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setEntries(data);
        } else {
          // Optional: initialize with sample entries if Firebase empty
          setEntries(sampleEntries);
        }
      } catch (err) {
        console.error("Error loading entries:", err);
        setEntries(sampleEntries);
      }
    }
    loadEntries();
  }, []);

  function openAddForm() {
    setEditing({
      id: null,
      image: '',
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
    setEditing({ ...entry });
    setIsFormOpen(true);
  }

  async function onDelete(id) {
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
    const payload = { ...editing };

    try {
      if (!payload.id) {
        // Add new entry
        const docRef = await addDoc(collection(db, "entries"), payload);
        payload.id = docRef.id;
        setEntries(prev => [payload, ...prev]);
      } else {
        // Update existing
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Léandre's Animadex (Asia)</h1>

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
