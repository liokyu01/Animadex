// src/components/BackupModal.jsx
import React from "react";

export default function BackupModal({ uploading, uploaded, total }) {
  if (!uploading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "#1e5882ff",
          padding: "24px",
          borderRadius: "12px",
          width: "400px",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Uploading Backup</h2>
        <div
          style={{
            width: "100%",
            height: "20px",
            backgroundColor: "#fcfcfcff",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: `${(uploaded / total) * 100}%`,
              height: "100%",
              backgroundColor: "#2563eb",
              transition: "width 0.2s",
            }}
          />
        </div>
        <div style={{ fontWeight: "bold" }}>
          {uploaded} / {total} entries uploaded
        </div>
      </div>
    </div>
  );
}
