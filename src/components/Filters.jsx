
import { CATEGORIES, CAPTURE_LEVELS, COUNTRIES, NAMING_OPTION } from "../data/Constants";

export default function Filters({
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    captureFilter,
    setCaptureFilter,
    selectedLanguage,
    setLanguage
}) {
  return (    
    <div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        {/* Name & Location Filter */}
        <input
          type="text"
          placeholder="Search names or locations"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: "160px",
            maxWidth: "60px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        {/* Country Filter */}
        <select
            //value={captureFilter}
            //onChange={(e) => setCaptureFilter(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
            <option value="">Any country</option>
            {COUNTRIES.map((c) => (
            <option key={c.id} value={c.id}>
                {c.label}
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
        
        {/* Display option */}
        <select
            value={selectedLanguage}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        >
            <option value="">Default</option>
            {NAMING_OPTION.map((c) => (
            <option key={c.id} value={c.id}>
                {c.label}
            </option>
            ))}
        </select>

    </div> 
    </div>
);}