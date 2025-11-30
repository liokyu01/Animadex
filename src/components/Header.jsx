import React from "react";
import { CATEGORIES, CAPTURE_LEVELS } from "../data/Constants";

export default function Header({
  query,
  setQuery,
  categoryFilter,
  setCategoryFilter,
  captureFilter,
  setCaptureFilter,
  openAddForm,
  categoryCounts = {},
  captureCounts = {},
  setIsBannerVisible,
  downloadEntries ,
  loadBackup
}) {
  return (
    <div
      style={{
        backgroundColor: "#5a1a1aff",
        width: "100%",
        padding: "5px 12px 12px 12px",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        marginBottom: "0px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* FIRST ROW — Filters + Add button */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search names or locations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: "160px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={captureFilter}
          onChange={(e) => setCaptureFilter(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="">All capture levels</option>
          {CAPTURE_LEVELS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        <button
          onClick={openAddForm}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add
        </button>
      </div>

      {/* SECOND ROW — Category counts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", fontSize: "14px" }}>
        {CATEGORIES.map((c) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.8 }}>
            <img src={c.icon} width={20} height={20} alt={c.label} />
            <span>{categoryCounts[c.id] || 0}</span>
          </div>
        ))}
      </div>

      {/* THIRD ROW — Capture counts + Hide Banner button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          fontSize: "14px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
          {CAPTURE_LEVELS.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.8 }}>
              <img src={c.icon} width={20} height={20} alt={c.label} />
              <span>{captureCounts[c.id] || 0}</span>
            </div>
          ))}
        </div>

        {/* Hide Banner button on the right side */}
        <button
          onClick={() => setIsBannerVisible(false)}
          style={{
            padding: "4px 8px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: "#ef4444",
            color: "white",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          Hide Banner
        </button>
      </div>
    </div>
  );
}
