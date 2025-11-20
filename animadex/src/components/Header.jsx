import React from 'react';
import { CATEGORIES, CAPTURE_LEVELS } from '../data/constants';


export default function Header({ query, setQuery, categoryFilter, setCategoryFilter, captureFilter, setCaptureFilter, openAddForm }) {
return (
<div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-3">
<input className="border p-2 rounded flex-1" placeholder="Search names or locations" value={query} onChange={e => setQuery(e.target.value)} />
<select className="border p-2 rounded" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
<option value="">All categories</option>
{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
</select>
<select className="border p-2 rounded" value={captureFilter} onChange={e => setCaptureFilter(e.target.value)}>
<option value="">All capture levels</option>
{CAPTURE_LEVELS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
</select>
<button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={openAddForm}>+ Add</button>
</div>
);
}