import { CATEGORIES, CAPTURE_LEVELS, NAMING_OPTION } from "../data/Constants";

export default function Filters({
  entries,
  query,
  setQuery,
  categoryFilter,
  setCategoryFilter,
  captureFilter,
  setCaptureFilter,
  selectedLanguage,
  setLanguage,
  filterCountry,
  setFilterCountry
}) {
    if (!entries || !Array.isArray(entries)) {
        return null;   // or return a loading state
    }
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        }}
      >

        {/* Name & location search */}
        <input
          type="text"
          placeholder="Search names or locations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: "160px",
            maxWidth: "200px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        {/* Country filter */}
        <select
          value={filterCountry}
          onChange={(e) => setFilterCountry(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="">All countries</option>

          {/* Dynamically extract countries from entry locations */}
          {[...new Set(entries.flatMap((e) => e.locations.map((l) => l.country)))]
            .filter(Boolean)
            .sort()
            .map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
        </select>

        {/* Category Filter */}
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

        {/* Capture Filter */}
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

        {/* Display Name Language */}
        <select
          value={selectedLanguage}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
          <option value="latin">Default (Scientific name)</option>
          {NAMING_OPTION.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
