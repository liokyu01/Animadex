import React from "react";
import { CATEGORIES, CAPTURE_LEVELS } from "../data/Constants";
import Filters from "./Filters";
import CategoryStats from "./CategoryStats";
import CaptureStats from "./CaptureStats";
import BannerButtons from "./BannerButtons";

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
  setIsBannerVisible
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
        <Filters
          query = {query}
          setQuery = {setQuery}
          categoryFilter = {categoryFilter}
          setCategoryFilter = {setCategoryFilter}
          captureFilter = {captureFilter}
          setCaptureFilter = {setCaptureFilter}
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
