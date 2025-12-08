import React, { useEffect, useState } from "react";

export default function CreditsModal({ open, onClose }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      fetch(import.meta.env.BASE_URL + "/credits.txt")
        .then((res) => res.text())
        .then((t) => setText(t))
        .catch(() => setText("Could not load credits.txt"));
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          width: "90%",
          maxWidth: "600px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          maxHeight: "80vh",
          overflowY: "auto",
          color: "black",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>Credits</h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: "14px",
            lineHeight: "1.4em"
          }}
        >
          {text}
        </pre>

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            background: "#1e40af",
            color: "white",
            cursor: "pointer"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
