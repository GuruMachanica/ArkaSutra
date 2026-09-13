import React from "react";
import { Radio, Cloud, Sun, Wind } from "lucide-react";

export default function SatelliteCard({ satCurrent, cloudDerate }) {
  return (
    <div style={{
      background: "rgba(14, 165, 233, 0.08)",
      border: "1px solid rgba(56, 189, 248, 0.25)",
      padding: "12px",
      borderRadius: "14px",
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "0.72rem", fontWeight: 700 }}>
          <Radio size={13} className="animate-pulse" />
          <span>COPERNICUS / ERA5 FEED</span>
        </div>
        <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Zero-Key API</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f8fafc", fontSize: "0.75rem" }}>
          <Cloud size={13} color="#94a3b8" />
          <span>Cloud: <strong>{satCurrent?.cloud_cover_pct ?? 15}%</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f8fafc", fontSize: "0.75rem" }}>
          <Sun size={13} color="#f59e0b" />
          <span>Sky: <strong>{satCurrent?.sky_condition || "Clear"}</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f8fafc", fontSize: "0.75rem" }}>
          <span style={{ color: "#38bdf8", fontWeight: 700 }}>°C</span>
          <span>Temp: <strong>{satCurrent?.temperature_c ?? 21}°C</strong></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f8fafc", fontSize: "0.75rem" }}>
          <Wind size={13} color="#38bdf8" />
          <span>Wind: <strong>{satCurrent?.wind_speed_kmh ?? 12} km/h</strong></span>
        </div>
      </div>

      {satCurrent && (
        <div style={{
          fontSize: "0.68rem",
          color: "#38bdf8",
          borderTop: "1px solid rgba(56, 189, 248, 0.15)",
          paddingTop: "6px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <span>Atmospheric Attenuation:</span>
          <strong>{Math.round((1 - cloudDerate) * 100)}% Shading Loss</strong>
        </div>
      )}
    </div>
  );
}
