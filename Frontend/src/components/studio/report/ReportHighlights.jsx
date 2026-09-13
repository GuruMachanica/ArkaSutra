import React from "react";

export default function ReportHighlights({ kw, panels, annualKwh, stats }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
      <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <span style={{ color: "#64748b", fontSize: "0.72rem", display: "block" }}>RECOMMENDED SYSTEM CAPACITY</span>
        <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f59e0b" }}>{kw} kWp</span>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", display: "block" }}>{panels} Monocrystalline PV Modules</span>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <span style={{ color: "#64748b", fontSize: "0.72rem", display: "block" }}>ANNUAL CLEAN ENERGY GENERATION</span>
        <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10b981" }}>{Number(annualKwh).toLocaleString()} kWh/yr</span>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", display: "block" }}>GHI: {stats.annualGhi || 1285} kWh/m²/yr</span>
      </div>
    </div>
  );
}
