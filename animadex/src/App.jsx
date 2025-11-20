// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import EntryForm from './components/EntryForm';
import { sampleEntries } from './data/SampleEntries';
import { STORAGE_KEY } from './data/Constants';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [captureFilter, setCaptureFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setEntries(JSON.parse(raw));
      } catch {
        setEntries(sampleEntries);
      }
    } else setEntries(sampleEntries);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

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

  function onDelete(id) {
    if (!confirm('Delete?')) return;
    setEntries(list => list.filter(e => e.id !== id));
  }

  function handleImageUpload(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditing(e => ({ ...e, image: reader.result }));
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...editing };
    if (!payload.id) payload.id = Math.random().toString(36).slice(2, 10);
    if (typeof payload.locations === 'string')
      payload.locations = payload.locations.split(',').map(x => x.trim());

    setEntries(prev => {
      const exists = prev.find(p => p.id === payload.id);
      return exists ? prev.map(p => (p.id === payload.id ? payload : p)) : [payload, ...prev];
    });

    setIsFormOpen(false);
    setEditing(null);
  }

  const filtered = entries.filter(e => {
    const q = query.toLowerCase();
    const matchesQuery = !query || [e.english, e.french, e.japanese, ...(e.locations || [])].join(' ').toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || e.category === categoryFilter;
    const matchesCapture = !captureFilter || e.capture === captureFilter;
    return matchesQuery && matchesCategory && matchesCapture;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Visual Pokédex</h1>

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
            onCancel={() => setIsFormOpen(false)}
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
