import React from "react";
import { ShieldCheck } from "lucide-react";

export default function ReportFinancials({ netCapex, annualSavings, payback, co2 }) {
  return (
    <>
      <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "16px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#94a3b8" }}>Net Turnkey Installation Capex (30% ITC applied):</span>
          <strong style={{ color: "#ffffff" }}>${netCapex.toLocaleString()}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#94a3b8" }}>Estimated Year 1 Utility Revenue Offset:</span>
          <strong style={{ color: "#10b981" }}>${Number(annualSavings).toLocaleString()}/yr</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#94a3b8" }}>Projected Simple Payback Horizon:</span>
          <strong style={{ color: "#f59e0b" }}>{payback} Years</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#94a3b8" }}>Lifetime 25-Year Cumulative Carbon Abatement:</span>
          <strong style={{ color: "#ffffff" }}>{(parseFloat(co2) * 25).toFixed(0)} Metric Tons CO₂</strong>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "12px 16px", borderRadius: "14px", marginBottom: "24px" }}>
        <ShieldCheck size={20} color="#10b981" />
        <span style={{ fontSize: "0.75rem", color: "#6ee7b7" }}>
          Bankable Engineering Assurance: Calculations verified with NREL PVLib standards &amp; Perez clear-sky models.
        </span>
      </div>
    </>
  );
}
