import React from "react";
import { Zap, DollarSign, Leaf } from "lucide-react";

export default function MetricsGrid({ currentIrradiance, kwCapacity, annualKwh, annualSavings, co2Offset }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 12px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <span style={{ color: "#64748b", fontSize: "0.66rem", display: "block" }}>LIVE FLUX</span>
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f59e0b" }}>
            {currentIrradiance} <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>W/m²</span>
          </span>
        </div>

        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px 12px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <span style={{ color: "#64748b", fontSize: "0.66rem", display: "block" }}>SYSTEM SIZE</span>
          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>
            {kwCapacity} <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>kWp</span>
          </span>
        </div>
      </div>

      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        padding: "12px 14px",
        borderRadius: "14px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem" }}>
            <Zap size={13} color="#f59e0b" /> Annual Generation
          </span>
          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.85rem" }}>
            {Number(annualKwh).toLocaleString()} kWh
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem" }}>
            <DollarSign size={13} color="#10b981" /> Utility Bill Offset
          </span>
          <span style={{ color: "#10b981", fontWeight: 800, fontSize: "0.85rem" }}>
            ${Number(annualSavings).toLocaleString()} /yr
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem" }}>
            <Leaf size={13} color="#10b981" /> CO₂ Abatement
          </span>
          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "0.85rem" }}>
            {co2Offset} Tons /yr
          </span>
        </div>
      </div>
    </>
  );
}
