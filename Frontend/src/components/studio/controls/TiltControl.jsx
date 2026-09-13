import React from "react";
import { Sliders } from "lucide-react";

export default function TiltControl({ panelTilt, setPanelTilt }) {
  return (
    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>
          <Sliders size={14} color="#f59e0b" /> PV Tilt Pitch
        </span>
        <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#f59e0b", fontWeight: 700 }}>
          {panelTilt}°
        </span>
      </div>
      <input
        type="range" min="0" max="60" step="1" value={panelTilt}
        onChange={(e) => setPanelTilt(parseInt(e.target.value))}
        style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "0.68rem", color: "#64748b" }}>
        <span>0° (Flat Roof)</span>
        <span>Optimal (~30°)</span>
        <span>60° (Steep)</span>
      </div>
    </div>
  );
}
