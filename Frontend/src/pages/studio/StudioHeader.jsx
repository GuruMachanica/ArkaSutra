import React from "react";
import { ArrowLeft, Globe, Search, Bot } from "lucide-react";
import { CAMERA_PRESETS } from "./studioConstants";

export default function StudioHeader({ onBackToHome, topologyName, activeCamPreset, onCamPresetChange, activeLocation, onOpenSearch, isAgentOpen, onToggleAgent }) {
  const pillStyle = { display: "flex", alignItems: "center", background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "14px", fontFamily: "monospace" };

  return (
    <header style={{ position: "absolute", top: "14px", left: "16px", right: "16px", zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "none" }}>
      {/* Left: Back & Tag */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", pointerEvents: "auto" }}>
        <button onClick={onBackToHome} style={{ ...pillStyle, gap: "8px", color: "#ffffff", padding: "8px 16px", fontSize: "0.8rem", cursor: "pointer", fontWeight: 700 }}>
          <ArrowLeft size={14} color="#f59e0b" /><span>BACK</span>
        </button>
        <div style={{ ...pillStyle, gap: "8px", padding: "6px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#f59e0b", fontSize: "0.72rem", fontWeight: 700 }}><Globe size={13} /><span>LOD2:</span></div>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f8fafc" }}>{topologyName}</div>
        </div>
      </div>

      {/* Center: Camera Switcher */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(9, 13, 22, 0.85)", backdropFilter: "blur(16px)", border: "1px solid rgba(255, 255, 255, 0.14)", padding: "4px 6px", borderRadius: "9999px", pointerEvents: "auto" }}>
        {CAMERA_PRESETS.map((p) => (
          <button key={p.id} onClick={() => onCamPresetChange(p.id)} style={{ padding: "6px 12px", borderRadius: "9999px", border: "none", background: activeCamPreset === p.id ? "#f59e0b" : "transparent", color: activeCamPreset === p.id ? "#000000" : "#94a3b8", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", fontFamily: "monospace" }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Right: Sat Search Pill & AI Agent */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", pointerEvents: "auto" }}>
        <button onClick={onOpenSearch} title="Search any global city" style={{ ...pillStyle, gap: "8px", border: "1px solid rgba(56, 189, 248, 0.35)", padding: "7px 14px", fontSize: "0.75rem", color: "#38bdf8", cursor: "pointer" }}>
          <Search size={13} color="#38bdf8" />
          <span>{activeLocation.label || `${activeLocation.lat}°, ${activeLocation.lon}°`}</span>
          <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", fontSize: "0.65rem", padding: "2px 6px", borderRadius: "6px", fontWeight: 700 }}>SAT LIVE</span>
        </button>
        <button onClick={onToggleAgent} style={{ ...pillStyle, gap: "6px", border: isAgentOpen ? "1px solid #f59e0b" : "1px solid rgba(245, 158, 11, 0.4)", background: isAgentOpen ? "rgba(245, 158, 11, 0.2)" : "rgba(15, 23, 42, 0.85)", padding: "7px 12px", fontSize: "0.75rem", color: "#f59e0b", cursor: "pointer", fontWeight: 700 }}>
          <Bot size={14} color="#f59e0b" /><span>AI AGENT</span>
        </button>
      </div>
    </header>
  );
}
