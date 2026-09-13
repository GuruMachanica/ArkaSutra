import React from "react";
import { Calendar } from "lucide-react";

const SEASONS = [
  { id: "summer", label: "Summer Solstice (Jun 21)" },
  { id: "equinox", label: "Equinox (Mar/Sep)" },
  { id: "winter", label: "Winter Solstice (Dec 21)" }
];

export default function SeasonControl({ season, setSeason }) {
  return (
    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, marginBottom: "8px" }}>
        <Calendar size={14} color="#38bdf8" /> Seasonal Orbit
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
        {SEASONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSeason(s.id)}
            style={{
              padding: "8px 4px",
              borderRadius: "10px",
              border: season === s.id ? "1px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
              background: season === s.id ? "rgba(56, 189, 248, 0.15)" : "rgba(255, 255, 255, 0.02)",
              color: season === s.id ? "#38bdf8" : "#94a3b8",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer"
            }}>
            {s.id.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
