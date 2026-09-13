import React from "react";
import { Building, Home, Grid } from "lucide-react";

const SCENE_PRESETS = [
  { id: "commercial", label: "Commercial", icon: Building },
  { id: "highrise", label: "High-Rise", icon: Building },
  { id: "residential", label: "Residential", icon: Home },
  { id: "farm", label: "Solar Matrix", icon: Grid }
];

export default function TopologyControl({ scenePreset, setScenePreset }) {
  return (
    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
      <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: "8px" }}>
        Architectural Topologies
      </span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {SCENE_PRESETS.map((p) => {
          const Icon = p.icon;
          const active = scenePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setScenePreset(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 10px",
                borderRadius: "10px",
                border: active ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.08)",
                background: active ? "rgba(245, 158, 11, 0.15)" : "rgba(255, 255, 255, 0.02)",
                color: active ? "#f59e0b" : "#94a3b8",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer"
              }}>
              <Icon size={14} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
