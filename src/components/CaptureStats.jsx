
import { CAPTURE_LEVELS } from "../data/Constants";

export default function CategoryStats({
    captureCounts
}) {
  return (  
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
          {CAPTURE_LEVELS.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.8 }}>
              <img src={c.icon} width={20} height={20} alt={c.label} />
              <span>{captureCounts[c.id] || 0}</span>
            </div>
          ))}
        </div>
);}