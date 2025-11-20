import React from 'react';
import { CATEGORIES, CAPTURE_LEVELS } from '../data/Constants';


export default function Card({ entry, onEdit, onDelete }) {
return (
<div className="bg-white rounded shadow overflow-hidden">
    <div className="flex flex-col md:flex-row"></div>
        <img
        src={entry.image || "https://via.placeholder.com/500"}
        alt={entry.english || ''}
        className="object-cover rounded w-full md:w-auto md:max-w-[40vw] flex-shrink-0"
        style={{ maxHeight: "33vh", maxWidth: "100vw" }}
        />
        <div className="p-4 flex-1">
        <h2 className="text-xl font-semibold"> {entry.latin}</h2>
        <p>🇬🇧 {entry.english}</p>
        <p>🇫🇷 {entry.french}</p>
        <p>🇯🇵 {entry.japanese}</p>
        <p className="text-gray-500">
        Category: {CATEGORIES.find(c => c.id === entry.category)?.label}
        </p>
        <p className="text-gray-500">
        Capture: {CAPTURE_LEVELS.find(c => c.id === entry.capture)?.label}
        </p>
        <p className="text-gray-500">Locations: {entry.locations.join(', ')}</p>
        <p className="text-gray-400 text-sm">{entry.date}</p>
        {entry.notes && <p className="text-gray-600 text-sm">📝 {entry.notes}</p>}
        <div className="flex gap-2 pt-2">
        <button className="px-3 py-1 bg-yellow-400 rounded" onClick={() => onEdit(entry)}>Edit</button>
        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => onDelete(entry.id)}>Delete</button>
        </div>
</div>
</div>
);
}