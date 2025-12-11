import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function CreditsModal({ open, onClose, isAdmin }) {
  const [text, setText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editBuffer, setEditBuffer] = useState("");

  useEffect(() => {
    if (!open) return;

    async function loadCredits() {
      try {
        const snap = await getDoc(doc(db, "credits", "main"));
        if (snap.exists()) {
          setText(snap.data().html);
        } else {
          setText("No credits found.");
        }
      } catch (err) {
        setText("Could not load credits.");
      }
    }

    loadCredits();
  }, [open]);

  if (!open) return null;

  // Detect if HTML exists
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(text);

  // Force external links to open in new tab
  const htmlWithNewTab =
    isHtml
      ? text.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
      : null;

  // Save the edited credits
  async function saveChanges() {
    await setDoc(doc(db, "credits", "main"), { html: editBuffer });
    setText(editBuffer);
    setEditMode(false);
  }

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

        {/* ---------- VIEW MODE ---------- */}
        {!editMode ? (
          isHtml ? (
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
          )
        ) : (
          /* ---------- EDIT MODE ---------- */
          <textarea
            value={editBuffer}
            onChange={(e) => setEditBuffer(e.target.value)}
            style={{
              display: "flex",
              width: "96%",
              minHeight: "300px",
              fontFamily: "monospace",
              fontSize: "14px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        )}

        {/* Buttons row */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {!editMode ? (
            <>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditBuffer(text);
                  setEditMode(true);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#4b5563",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>)}

              <button
                onClick={onClose}
                style={{
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
            </>
          ) : (
            <>
              <button
                onClick={saveChanges}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#059669",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Save
              </button>

              <button
                onClick={() => setEditMode(false)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
