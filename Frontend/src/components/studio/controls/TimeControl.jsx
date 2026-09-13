import React, { useEffect } from "react";
import { Clock, Play, Pause } from "lucide-react";

export default function TimeControl({ timeOfDay, setTimeOfDay, isPlaying, setIsPlaying, elevation, azimuth }) {
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeOfDay((prev) => (prev + 0.08 > 19.0 ? 6.0 : prev + 0.08));
    }, 40);
    return () => clearInterval(interval);
  }, [isPlaying, setTimeOfDay]);

  const formatTime = (h) => {
    const hours = Math.floor(h);
    const minutes = Math.floor((h - hours) * 60);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const padMin = minutes < 10 ? "0" + minutes : minutes;
    return `${displayHours}:${padMin} ${period}`;
  };

  return (
    <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "14px", borderRadius: "16px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>
          <Clock size={14} color="#f59e0b" /> Diurnal Arc Time
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#f59e0b", fontWeight: 700 }}>
            {formatTime(timeOfDay)}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#f59e0b",
              borderRadius: "8px",
              padding: "4px 8px",
              cursor: "pointer"
            }}>
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>
      </div>

      <input
        type="range" min="6.0" max="19.0" step="0.1" value={timeOfDay}
        onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.72rem", color: "#64748b", fontFamily: "monospace" }}>
        <span>Solar Elev: <strong style={{ color: "#ffffff" }}>{elevation.toFixed(1)}°</strong></span>
        <span>Azimuth: <strong style={{ color: "#ffffff" }}>{azimuth.toFixed(1)}°</strong></span>
      </div>
    </div>
  );
}
