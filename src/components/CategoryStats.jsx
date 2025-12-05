
import { CATEGORIES } from "../data/Constants";

export default function CategoryStats({
    categoryCounts
}) {
  return (  
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", fontSize: "14px" }}>
    {CATEGORIES.map((c) => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.8 }}>
        <img src={c.icon} width={20} height={20} alt={c.label} />
        <span>{categoryCounts[c.id] || 0}</span>
        </div>
    ))}
    </div>
);}