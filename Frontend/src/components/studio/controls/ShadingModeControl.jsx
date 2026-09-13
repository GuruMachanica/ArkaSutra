import React from "react";
import { Layers } from "lucide-react";

const SHADING_MODES = [
  { id: "realistic", label: "Realistic" },
  { id: "heatmap", label: "Solar Heatmap" },
  { id: "occlusion", label: "Shadow Occlusion" },
  { id: "wireframe", label: "CAD Wireframe" }
];

export default function ShadingModeControl({ shadingMode, setShadingMode }) {
  return (
    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, marginBottom: "8px" }}>
        <Layers size={14} color="#10b981" /> Ray-Tracing Shader Mode
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {SHADING_MODES.map((m) => {
          const active = shadingMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setShadingMode(m.id)}
              style={{
                padding: "8px",
                borderRadius: "10px",
                border: active ? "1px solid #10b981" : "1px solid rgba(255, 255, 255, 0.08)",
                background: active ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.02)",
                color: active ? "#10b981" : "#94a3b8",
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: "pointer"
              }}>
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
