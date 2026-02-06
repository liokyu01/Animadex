import React, { useRef } from "react";
import { CATEGORIES, CAPTURE_LEVELS } from "../data/Constants";

export default function EntryForm({
  editing,
  setEditing,
  onSubmit,
  onCancel,
  handleImageUpload
}) {
  const fileInputRef = useRef();

  // ---------- LOCATION HANDLERS ----------
  const handleLocationChange = (index, field, value) => {
    const updated = editing.locations.map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc
    );
    setEditing({ ...editing, locations: updated });
  };

  const addLocation = () => {
    setEditing({
      ...editing,
      locations: [...editing.locations, { country: "", region: "", subRegion: "" }]
    });
  };

  const removeLocation = (index) => {
    setEditing({
      ...editing,
      locations: editing.locations.filter((_, i) => i !== index)
    });
  };

  // ---------- BASIC STYLES ----------
  const fieldStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "6px",
  };

  const buttonStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  };
return (
  <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" }}>
    <form
      onSubmit={onSubmit}
      style={{
        background: "rgba(0,0,0,0.15)",
        padding: "20px",
        borderRadius: "10px",
        width: "100%",
        maxWidth: "1100px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",

        /* ---- GRID FIX ---- */
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        alignItems: "start",
      }}
    >
      {/* TITLE */}
      <h2
        style={{
          gridColumn: "1 / -1",
          fontSize: "22px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {editing.id ? "Edit entry" : "Add entry"}
      </h2>

      {/* LEFT COLUMN */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input type="text" style={fieldStyle} placeholder="Scientific name"
          required value={editing.latin}
          onChange={(e) => setEditing({ ...editing, latin: e.target.value })}
        />

        <input type="text" style={fieldStyle} placeholder="English name"
          required value={editing.english}
          onChange={(e) => setEditing({ ...editing, english: e.target.value })}
        />

        <input type="text" style={fieldStyle} placeholder="French name"
          required value={editing.french}
          onChange={(e) => setEditing({ ...editing, french: e.target.value })}
        />

        <input type="text" style={fieldStyle} placeholder="Local name"
          required value={editing.local}
          onChange={(e) => setEditing({ ...editing, local: e.target.value })}
        />

        <select
          style={fieldStyle}
          value={editing.category}
          onChange={(e) => setEditing({ ...editing, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        
        <input type="text" style={fieldStyle} placeholder="Family"
          required value={editing.family}
          onChange={(e) => setEditing({ ...editing, family: e.target.value })}
        />

        <select
          style={fieldStyle}
          value={editing.capture}
          onChange={(e) => setEditing({ ...editing, capture: e.target.value })}
        >
          {CAPTURE_LEVELS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* MIDDLE COLUMN */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input type="date" style={fieldStyle}
          value={editing.date}
          onChange={(e) => setEditing({ ...editing, date: e.target.value })}
        />

        <textarea
          style={{ ...fieldStyle, minHeight: "150px" }}
          placeholder="Notes"
          value={editing.notes}
          onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={fieldStyle}
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />

        <input
          type="url"
          style={fieldStyle}
          placeholder="Info link (https://example.com)"
          value={editing.infoLink || ""}
          onChange={(e) => setEditing({ ...editing, infoLink: e.target.value })}
        />
      </div>

      {/* RIGHT COLUMN (LOCATIONS) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {editing.locations.map((loc, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <input
              type="text"
              style={fieldStyle}
              placeholder="Country"
              value={loc.country}
              onChange={(e) => handleLocationChange(index, "country", e.target.value)}
            />

            <input
              type="text"
              style={fieldStyle}
              placeholder="Region"
              value={loc.region}
              onChange={(e) => handleLocationChange(index, "region", e.target.value)}
            />

            <input
              type="text"
              style={fieldStyle}
              placeholder="Sub-region"
              value={loc.subRegion}
              onChange={(e) => handleLocationChange(index, "subRegion", e.target.value)}
            />

            <button
              type="button"
              onClick={() => removeLocation(index)}
              style={{
                ...buttonStyle,
                background: "#d9534f",
                color: "white",
                alignSelf: "flex-start"
              }}
            >
              Remove location
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addLocation}
          style={{
            ...buttonStyle,
            background: "#4caf50",
            color: "white",
            alignSelf: "flex-start"
          }}
        >
          + Add location
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "10px"
        }}
      >
        <button type="button" onClick={onCancel} style={{ ...buttonStyle, background: "#ccc" }}>
          Cancel
        </button>

        <button type="submit" style={{ ...buttonStyle, background: "#1e40af", color: "white" }}>
          Save
        </button>
      </div>
    </form>
  </div>
);

}
