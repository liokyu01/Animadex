
import React, { useState, useEffect } from "react";
import { CATEGORIES, CAPTURE_LEVELS } from "../data/Constants";
import Filters from "./Filters";
import CategoryStats from "./CategoryStats";
import CaptureStats from "./CaptureStats";
import BannerButtons from "./BannerButtons";

import CreditsModal from "./CreditsModal";

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
  selectedLanguage,
  setLanguage,
  entries,
  filterCountry,
  setFilterCountry
}) {
const [showCredits, setShowCredits] = useState(false);

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
        <Filters
        
          query = {query}
          setQuery = {setQuery}
          categoryFilter = {categoryFilter}
          setCategoryFilter = {setCategoryFilter}
          captureFilter = {captureFilter}
          setCaptureFilter = {setCaptureFilter}
          selectedLanguage = {selectedLanguage}
          setLanguage = {setLanguage}
          entries={entries}
          filterCountry={filterCountry}
          setFilterCountry={setFilterCountry}
        />
      
      <CategoryStats
        categoryCounts={categoryCounts}
      />

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

        <button
        onClick={() => setShowCredits(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 14px",
          borderRadius: "6px",
          background: "#444",
          color: "white",
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        Credits
      </button>

      <CreditsModal open={showCredits} onClose={() => setShowCredits(false)} />

        <CaptureStats
        captureCounts = {captureCounts}
        />

        <BannerButtons
          openAddForm = {openAddForm}
          setIsBannerVisible= {setIsBannerVisible}
        />
      </div>
    </div>
  );
}
