import React, { useRef, useState } from "react";
import gearIcon from "../assets/icons/gear.png"; 

export default function AdminMenu({ downloadEntries, loadBackup }) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Gear button with icon */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer"
        }}
        title="Admin actions"
      >
        <img src={gearIcon} 
        alt="Admin menu" 
        width={24} 
        height={24} />
      </button>

      {/* Popup menu */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 1000,
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button
            onClick={downloadEntries}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#4b4b4bff",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Download Backup
          </button>

          <button
            onClick={handleUploadClick}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#f59e0b",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Upload Backup
          </button>

          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={loadBackup}
          />
        </div>
      )}
    </div>
  );
}
