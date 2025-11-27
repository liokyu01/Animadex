import React from "react";
import { CATEGORIES, CAPTURE_LEVELS,iconHeight,iconWidth } from "../data/Constants";

import { darkenHex, lightenHex } from "../utils";  // adjust path if needed

// Example imports (replace with your real files)
import flagUK from "../assets/flags/uk.png";
import flagFR from "../assets/flags/fr.png";
import flagJP from "../assets/flags/jp.png";
import locationIcon from "../assets/icons/location.png";
import questionIcon from "../assets/icons/question.png";


export default function Card({ entry, onEdit, onDelete }) {
    const category = CATEGORIES.find(c => c.id === entry.category);
    const bgColor = category?.color || "#c91f1fff";
    const categoryIcon = category?.icon;
    const darkerBgColor = darkenHex(bgColor, 30); // slightly darker
    const lighterBgColor = lightenHex(bgColor, 30); // slightly lighter

  const captureIcon = CAPTURE_LEVELS.find(c => c.label === entry.capture)?.icon;

  return (
    <div
        style={{
        position: "relative",
        borderRadius: "20px",
        border: "4px solid",
        borderColor: darkerBgColor,
        padding: "16px",
        backgroundColor: bgColor,
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        margin: "0 auto",
  }}
>
      {/* TOP BAR: Latin + Category Icon */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        borderRadius: "12px",
        backgroundColor: lighterBgColor,
        }}>

        <h2 style={{ 
            fontSize: "22px", 
            fontWeight: "bold",
            marginLeft: "10px", 
            }}>
            {entry.latin}
        </h2>  

        <img
            src={categoryIcon||questionIcon}
            width={32}
            height={32}
            style={{ borderRadius: "6px",
            marginRight: "10px", }}
        />
      </div>

      {/* IMAGE WRAPPER */}
      <div style={{ 
  position: "relative", 
  width: "100%",
  aspectRatio: "1 / 1",          // Ensures a perfect square
  overflow: "hidden",
  borderRadius: "12px",
  marginBottom: "12px"
}}>
  <img
    src={entry.image||questionIcon}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  />

  {/* OVERLAPPING capture level badge */}
  <img
    src={captureIcon||questionIcon}
    width={40}
    height={40}
    style={{
      position: "absolute",
      bottom: "8px",
      right: "8px",
      background: "rgba(255,255,255,0.85)",
      padding: "4px",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
    }}
  />
</div>
{/* LANGUAGE GROUP */}
<div style={{
  backgroundColor: lighterBgColor,
  borderRadius: "10px",
  padding: "8px 12px",
  marginBottom: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",   // spacing between languages
  fontSize: "14px"
}}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <img src={flagUK} width={20} height={20} style={{ marginRight: "8px" }} />
    <span>{entry.english}</span>
  </div>

  <div style={{ display: "flex", alignItems: "center" }}>
    <img src={flagFR} width={20} height={20} style={{ marginRight: "8px" }} />
    <span>{entry.french}</span>
  </div>

  <div style={{ display: "flex", alignItems: "center" }}>
    <img src={flagJP} width={20} height={20} style={{ marginRight: "8px" }} />
    <span>{entry.japanese}</span>
  </div>
</div>


{/* LOCATIONS */}
<div style={{
  marginTop: "8px",
  marginBottom: "12px",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  backgroundColor: lighterBgColor,
  padding: "4px 8px",
  borderRadius: "8px"
}}>
  <img src={locationIcon} width={18} height={18} style={{ marginRight: "8px" }} />
  <span>{entry.locations.join(", ")}</span>
</div>


        {/* NOTES */}
<div style={{
  marginTop: "10px",
  padding: "10px",
  borderRadius: "10px",
  backgroundColor: darkerBgColor,
  fontSize: "14px",
  lineHeight: "1.4"
}}>
  {entry.notes}
</div>


{/* FLOATING ACTION BUTTONS */}
<div style={{
  position: "absolute",
  right: "-60px",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}}>
  
  {/* EDIT */}
  <button
    onClick={() => onEdit(entry)}
    style={{
      width: "48px",
      height: "48px",
      background: "#f7d438",
      borderRadius: "12px",
      border: "3px solid #3b0a0a",
      fontWeight: "bold",
      boxShadow: "0 3px 6px rgba(0,0,0,0.25)"
    }}
  >
    ✏️
  </button>

  {/* DELETE */}
  <button
    onClick={() => onDelete(entry.id)}
    style={{
      width: "48px",
      height: "48px",
      background: "#e63939",
      color: "white",
      borderRadius: "12px",
      border: "3px solid #3b0a0a",
      boxShadow: "0 3px 6px rgba(0,0,0,0.25)"
    }}
  >
    🗑️
  </button>

  {/* ADD NEW */}
  <button
    onClick={() => window.scrollTo(0, document.body.scrollHeight)}
    style={{
      width: "48px",
      height: "48px",
      background: "#4caf50",
      color: "white",
      borderRadius: "12px",
      border: "3px solid #3b0a0a",
      boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
      fontWeight: "bold"
    }}
  >
    ➕
  </button>

</div>
    </div>
  );
}
