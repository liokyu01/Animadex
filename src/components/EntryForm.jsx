import React from "react";

export default function EntryForm({ entry, onChange, onSave, onCancel }) {
  const handleFieldChange = (field, value) => {
    onChange({ ...entry, [field]: value });
  };

  const handleLocationChange = (index, field, value) => {
    const updatedLocations = entry.locations.map((loc, i) =>
      i === index ? { ...loc, [field]: value } : loc
    );
    onChange({ ...entry, locations: updatedLocations });
  };

  const addLocation = () => {
    onChange({
      ...entry,
      locations: [...entry.locations, { country: "", region: "", subRegion: "" }]
    });
  };

  const removeLocation = (index) => {
    const updatedLocations = entry.locations.filter((_, i) => i !== index);
    onChange({ ...entry, locations: updatedLocations });
  };

  return (
    <div className="entry-form">
      <h2>{entry.id ? "Edit Entry" : "New Entry"}</h2>

      {/* Example of your normal fields */}
      <label>Latin name</label>
      <input
        type="text"
        value={entry.latin}
        onChange={(e) => handleFieldChange("latin", e.target.value)}
      />

      <label>French name</label>
      <input
        type="text"
        value={entry.french}
        onChange={(e) => handleFieldChange("french", e.target.value)}
      />

      <label>English name</label>
      <input
        type="text"
        value={entry.english}
        onChange={(e) => handleFieldChange("english", e.target.value)}
      />

      {/* ------------------ LOCATIONS ------------------ */}
      <h3>Locations</h3>

      {entry.locations.map((loc, index) => (
        <div key={index} className="location-block" style={{ border: "1px solid #ccc", padding: 8, marginBottom: 8 }}>
          <label>Country</label>
          <input
            type="text"
            value={loc.country}
            onChange={(e) => handleLocationChange(index, "country", e.target.value)}
          />

          <label>Region</label>
          <input
            type="text"
            value={loc.region}
            onChange={(e) => handleLocationChange(index, "region", e.target.value)}
          />

          <label>Sub-region</label>
          <input
            type="text"
            value={loc.subRegion}
            onChange={(e) => handleLocationChange(index, "subRegion", e.target.value)}
          />

          <button
            type="button"
            onClick={() => removeLocation(index)}
            style={{ marginTop: 4, backgroundColor: "#c55", color: "white" }}
          >
            Remove location
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addLocation}
        style={{ marginBottom: 20, backgroundColor: "#5c5", color: "white" }}
      >
        + Add location
      </button>

      {/* ------------------ ACTIONS ------------------ */}
      <div style={{ marginTop: 20 }}>
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
