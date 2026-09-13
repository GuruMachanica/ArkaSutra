import React from "react";
import { X, Sun, Compass, Zap, DollarSign, Leaf } from "lucide-react";

export function RoofInspectorHUD({ roofData, onClose }) {
  if (!roofData) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "86px",
        left: "410px",
        zIndex: 40,
        width: "320px",
        background: "rgba(10, 15, 29, 0.94)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(56, 189, 248, 0.45)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.75), 0 0 20px rgba(56, 189, 248, 0.2)",
        borderRadius: "20px",
        padding: "16px",
        color: "#ffffff",
        fontFamily: "sans-serif"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px" }}>
        <div>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#38bdf8", display: "block" }}>
            ROOFTOP SOLAR AUDIT
          </span>
          <h3 style={{ fontSize: "0.92rem", fontWeight: 700, margin: "2px 0 0 0", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "230px" }}>
            {roofData.buildingName || roofData.name || "Identified Structure"}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "8px", padding: "4px 6px", color: "#94a3b8", cursor: "pointer" }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "12px", fontSize: "0.75rem" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "8px 10px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
            <Sun size={12} color="#f59e0b" /> Roof Area
          </div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, marginTop: "4px" }}>
            {roofData.area_m2 || roofData.roof_area_m2 || 380} m²
          </div>
          <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
            {roofData.usable_area_m2 || Math.round((roofData.area_m2 || roofData.roof_area_m2 || 380) * 0.7)} m² usable
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "8px 10px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
            <Compass size={12} color="#38bdf8" /> Orientation
          </div>
          <div style={{ fontSize: "0.95rem", fontWeight: 700, marginTop: "4px" }}>
            {roofData.tilt_deg ?? roofData.roof_tilt_deg ?? 25}° / {roofData.azimuth_deg ?? roofData.roof_azimuth_deg ?? 180}°
          </div>
          <div style={{ fontSize: "0.68rem", color: "#38bdf8" }}>
            {roofData.pv_capacity_kwp || 48} kWp PV
          </div>
        </div>
      </div>

      <div style={{ marginTop: "10px", background: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "14px", padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem" }}>
          <span style={{ color: "#cbd5e1", display: "flex", alignItems: "center", gap: "6px" }}>
            <Zap size={13} color="#f59e0b" /> Annual Harvest
          </span>
          <strong style={{ color: "#38bdf8", fontFamily: "monospace" }}>
            {(roofData.annual_generation_kwh || 54000).toLocaleString()} kWh
          </strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", marginTop: "6px" }}>
          <span style={{ color: "#cbd5e1", display: "flex", alignItems: "center", gap: "6px" }}>
            <DollarSign size={13} color="#10b981" /> Grid Savings
          </span>
          <strong style={{ color: "#10b981", fontFamily: "monospace" }}>
            ${(roofData.annual_savings_usd || 8640).toLocaleString()} / yr
          </strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", marginTop: "6px" }}>
          <span style={{ color: "#cbd5e1", display: "flex", alignItems: "center", gap: "6px" }}>
            <Leaf size={13} color="#34d399" /> CO₂ Offset
          </span>
          <strong style={{ color: "#e2e8f0", fontFamily: "monospace" }}>
            {roofData.co2_offset_tons || 20.8} tons/yr
          </strong>
        </div>
      </div>
    </div>
  );
}
