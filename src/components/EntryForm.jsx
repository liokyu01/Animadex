import React, { useRef } from 'react';
import { CATEGORIES, CAPTURE_LEVELS } from '../data/Constants';

export default function EntryForm({ editing, setEditing, onSubmit, onCancel, handleImageUpload }) {
  const fileInputRef = useRef();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-xl space-y-3">
        <h2 className="text-xl font-bold">{editing.id ? 'Edit entry' : 'Add entry'}</h2>

        <input type="text" className="border p-2 rounded w-full" placeholder="Scientific name" value={editing.latin} onChange={e => setEditing({...editing, latin:e.target.value})} required />
        <input type="text" className="border p-2 rounded w-full" placeholder="English name" value={editing.english} onChange={e => setEditing({...editing, english:e.target.value})} required />
        <input type="text" className="border p-2 rounded w-full" placeholder="French name" value={editing.french} onChange={e => setEditing({...editing, french:e.target.value})} required />
        <input type="text" className="border p-2 rounded w-full" placeholder="Japanese name" value={editing.japanese} onChange={e => setEditing({...editing, japanese:e.target.value})} required />

        <select className="border p-2 rounded w-full" value={editing.category} onChange={e => setEditing({...editing, category:e.target.value})}>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>

        <select className="border p-2 rounded w-full" value={editing.capture} onChange={e => setEditing({...editing, capture:e.target.value})}>
          {CAPTURE_LEVELS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>

        <input type="text" className="border p-2 rounded w-full" placeholder="Locations (comma-separated)" value={editing.locations.join(", ")} onChange={e => setEditing({...editing, locations:e.target.value.split(',').map(x=>x.trim()).filter(x=>x)})} />
        <input type="date" className="border p-2 rounded w-full" value={editing.date} onChange={e => setEditing({...editing, date:e.target.value})} />
        <textarea className="border p-2 rounded w-full" placeholder="Notes" value={editing.notes} onChange={e => setEditing({...editing, notes:e.target.value})} />
        <input type="file" className="border p-2 rounded w-full" accept="image/*" ref={fileInputRef} onChange={e => handleImageUpload(e.target.files[0])} />

        {/* NEW INFO LINK FIELD */}
        <input
          type="url"
          className="border p-2 rounded w-full"
          placeholder="Info link (https://example.com)"
          value={editing.infoLink || ""}
          onChange={e => setEditing({...editing, infoLink: e.target.value})}
        />

        <div className="flex gap-2 pt-2 justify-end">
          <button type="button" className="px-3 py-2 bg-gray-300 rounded" onClick={onCancel}>Cancel</button>
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
}
