
export default function BannerButtons({
    openAddForm,
    setIsBannerVisible
}) {
  return (  
    <div style={{
          display: "flex",
          gap: "16px"
          }}>

        <button
          onClick={openAddForm}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add
        </button>
        
        {/* Hide Banner button on the right side */}
        <button
          onClick={() => setIsBannerVisible(false)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Hide Banner
        </button>
    </div>
  );}