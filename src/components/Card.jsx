import React from "react";
import { CATEGORIES, CAPTURE_LEVELS } from "../data/Constants";
import { darkenHex, lightenHex } from "../utils/utils";
import flagW from "../assets/flags/world.png";
import flagUK from "../assets/flags/uk.png";
import flagFR from "../assets/flags/fr.png";
import flagJP from "../assets/flags/jp.png";
import locationIcon from "../assets/icons/location.png";
import questionIcon from "../assets/icons/question.png";
import editIcon from "../assets/icons/edit.png";
import deleteIcon from "../assets/icons/delete.png";

export default function Card({ entry, onEdit, onDelete, selectedLanguage }) {
  const category = CATEGORIES.find(c => c.id === entry.category);
  const bgColor = category?.color || "#c91f1fff";
  const categoryIcon = category?.icon;
  const darkerBgColor = darkenHex(bgColor, 30);
  const lighterBgColor = lightenHex(bgColor, 30);
  const captureIcon = CAPTURE_LEVELS.find(c => c.label === entry.capture)?.icon;

  const names = {
    latin: entry.latin,
    french: entry.french,
    english: entry.english,
    japanese: entry.japanese,
  };

  const topName =
  selectedLanguage === "french"   ? entry.french :
  selectedLanguage === "english"  ? entry.english :
  selectedLanguage === "local" ? entry.japanese :
  entry.latin;

  const fullOrder = [
  { lang: "latin",    value: entry.latin,    flag: flagW }, 
  { lang: "english",  value: entry.english,  flag: flagUK },
  { lang: "french",   value: entry.french,   flag: flagFR },
  { lang: "local", value: entry.japanese, flag: flagJP },
];

let languageList;

if (selectedLanguage === "latin") {
  // Case 1 : latin selected → show everything except latin in top, keep below normal
  languageList = fullOrder.filter(l => l.lang !== "latin");
} else {
  // Case 2 : any other selected language
  languageList = [
    fullOrder.find(l => l.lang === "latin"), // latin ALWAYS first
    ...fullOrder.filter(l => l.lang !== "latin" && l.lang !== selectedLanguage),
  ];
}

  return (
    <div
      style={{
        borderRadius: "20px",
        border: "4px solid",
        borderColor: darkerBgColor,
        padding: "16px",
        backgroundColor: bgColor,
        width: "100%",
        boxSizing: "border-box", 
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        margin: "0 auto 32px", // add spacing between cards
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TOP BAR: Latin + Category Icon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          borderRadius: "12px",
          backgroundColor: lighterBgColor,
        }}
      >
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginLeft: "10px" }}>
          {topName}
        </h2>

        <img
          src={categoryIcon || questionIcon}
          width={32}
          height={32}
          style={{ borderRadius: "6px", marginRight: "10px" }}
        />
      </div>

      {/* IMAGE WRAPPER */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          borderRadius: "12px",
          marginBottom: "12px",
        }}
      >
        <img
          src={entry.image || questionIcon}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* OVERLAPPING capture level badge */}
        <img
          src={captureIcon || questionIcon}
          width={40}
          height={40}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(255,255,255,0.85)",
            padding: "4px",
            borderRadius: "6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        />
      </div>

      {/* LANGUAGE GROUP */}
      <div
        style={{
          backgroundColor: lighterBgColor,
          borderRadius: "10px",
          padding: "8px 12px",
          marginBottom: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          fontSize: "14px",
        }}
      >
        {languageList.map(item => (
          <div key={item.lang} style={{ display: "flex", alignItems: "center" }}>
            <img src={item.flag} width={20} height={20} style={{ marginRight: "8px" }} />
            <span>{item.value}</span>
          </div>
        ))}
        
        {/* <div style={{ display: "flex", alignItems: "center" }}>
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
        </div> */}
        
      </div>

      {/* LOCATIONS */}
      <div
        style={{
          marginTop: "8px",
          marginBottom: "12px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          backgroundColor: lighterBgColor,
          padding: "4px 8px",
          borderRadius: "8px",
        }}
      >
        <img src={locationIcon} width={18} height={18} style={{ marginRight: "8px" }} />
        <span>{entry.locations.join(", ")}</span>
      </div>

      {/* NOTES */}
      <div
        style={{
          marginTop: "10px",
          padding: "10px",
          borderRadius: "10px",
          backgroundColor: darkerBgColor,
          fontSize: "14px",
          lineHeight: "1.4",
        }}
      >
        {entry.notes}
      </div>

      {/* ACTION BUTTONS UNDER CARD */}
    <div
    style={{
        marginTop: "12px",
        display: "flex",
        gap: "16px",
        justifyContent: "center",
        paddingTop: "12px",
    }}
    >
    <button
        onClick={() => onEdit(entry)}
        style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        border: "3px solid #3b0a0a",
        backgroundColor: "#f7d438",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px",
        }}
    >
        <img src={editIcon} width={24} height={24} alt="Edit" />
    </button>

    <button
        onClick={() => onDelete(entry.id)}
        style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        border: "3px solid #3b0a0a",
        backgroundColor: "#e63939",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px",
        }}
    >
        <img src={deleteIcon} width={24} height={24} alt="Delete" />
    </button>

    <button
        onClick={() => {
        if (entry.infoLink) window.open(entry.infoLink, "_blank");
        }}
        style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        border: "3px solid #3b0a0a",
        backgroundColor: "#3b82f6", // blue for info
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px",
        }}
    >
        <img src={questionIcon} width={24} height={24} alt="Info" />
    </button>
    </div>

    </div>
  );
}
