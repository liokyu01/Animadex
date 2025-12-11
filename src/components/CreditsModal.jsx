import React, { useEffect, useState } from "react";

export default function CreditsModal({ open, onClose }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!open) return;

    const path = import.meta.env.BASE_URL + "/credits.txt"; 
    fetch(path)
      .then((res) => res.text())
      .then((t) => setText(t))
      .catch(() => setText("Could not load credits.txt"));
  }, [open]);

  if (!open) return null;

  // Detect if content contains ANY HTML tag
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(text);

  // If HTML: force links to open in new tab
  const htmlWithNewTab =
    isHtml
      ? text.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
      : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "10px",
          color: "black",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>Credits</h2>

        {isHtml ? (
          <div
            style={{
              fontSize: "14px",
              lineHeight: "1.4em",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: htmlWithNewTab }}
          />
        ) : (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              lineHeight: "1.4em",
            }}
          >
            {text}
          </pre>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            background: "#1e40af",
            color: "white",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
