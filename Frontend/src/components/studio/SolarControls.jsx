import React, { useEffect } from "react";
import { Clock, Calendar, Layers, Box, Building, Home, Grid, Play, Pause, Sliders, FileSpreadsheet } from "lucide-react";

const SCENE_PRESETS = [
  { id: "commercial", label: "Commercial", icon: Building },
  { id: "highrise", label: "High-Rise", icon: Building },
  { id: "residential", label: "Residential", icon: Home },
  { id: "farm", label: "Solar Matrix", icon: Grid }
];

const SHADING_MODES = [
  { id: "realistic", label: "Realistic" },
  { id: "heatmap", label: "Solar Heatmap" },
  { id: "occlusion", label: "Shadow Occlusion" },
  { id: "wireframe", label: "CAD Wireframe" }
];

const SEASONS = [
  { id: "summer", label: "Summer Solstice (Jun 21)", maxElev: 72 },
  { id: "equinox", label: "Equinox (Mar/Sep)", maxElev: 50 },
  { id: "winter", label: "Winter Solstice (Dec 21)", maxElev: 28 }
];

const SolarControls = ({
  timeOfDay,
  setTimeOfDay,
  season,
  setSeason,
  scenePreset,
  setScenePreset,
  shadingMode,
  setShadingMode,
  elevation,
  azimuth,
  isPlaying,
  setIsPlaying,
  panelTilt,
  setPanelTilt
}) => {
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeOfDay((prev) => {
        const next = prev + 0.08;
        return next > 19.0 ? 6.0 : next;
      });
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

  const handleExportCsv = () => {
    let csv = "Hour,Time,Solar_Elevation_Deg,Solar_Azimuth_Deg,ClearSky_GHI_W_m2\n";
    for (let h = 6.0; h <= 19.0; h += 0.5) {
      const hd = h - 12.0;
      const maxElev = season === "summer" ? 72 : season === "equinox" ? 50 : 28;
      const elev = Math.max(0, maxElev * Math.cos((hd / 6.5) * (Math.PI / 2)));
      const azim = 180 + (hd / 6.5) * 85;
      const irr = Math.round(1000 * Math.sin((elev * Math.PI) / 180));
      csv += `${h.toFixed(1)},${formatTime(h)},${elev.toFixed(1)},${azim.toFixed(1)},${irr}\n`;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `SunMap_Hourly_Irradiance_${season}.csv`;
    link.click();
  };

  return (
    <div style={{
      background: "rgba(15, 23, 42, 0.85)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderRadius: "24px",
      padding: "20px",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      maxHeight: "82vh",
      overflowY: "auto",
      boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: "0.68rem", fontFamily: "monospace", color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", fontWeight: 700 }}>
            CELESTIAL TRAJECTORY
          </span>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
            Sun Trajectory Engine
          </h2>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "10px",
            border: isPlaying ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.1)",
            background: isPlaying ? "#f59e0b" : "rgba(255, 255, 255, 0.05)",
            color: isPlaying ? "#000000" : "#f8fafc",
            fontWeight: 700,
            fontSize: "0.75rem",
            cursor: "pointer",
            fontFamily: "monospace"
          }}>
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          <span>{isPlaying ? "PAUSE" : "PLAY CYCLE"}</span>
        </button>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "8px", fontFamily: "monospace" }}>
          <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} color="#f59e0b" /> TIME OF DAY</span>
          <span style={{ color: "#f59e0b", fontWeight: 700 }}>{formatTime(timeOfDay)}</span>
        </div>
        <input
          type="range"
          min="6.0"
          max="19.0"
          step="0.1"
          value={timeOfDay}
          onChange={(e) => {
            setIsPlaying(false);
            setTimeOfDay(parseFloat(e.target.value));
          }}
          style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontFamily: "monospace", textAlign: "center" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <span style={{ color: "#64748b", fontSize: "0.68rem", display: "block" }}>ELEVATION</span>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff" }}>{elevation.toFixed(1)}°</span>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "10px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
          <span style={{ color: "#64748b", fontSize: "0.68rem", display: "block" }}>AZIMUTH</span>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff" }}>{azimuth.toFixed(1)}°</span>
        </div>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "8px", fontFamily: "monospace" }}>
          <span style={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}><Sliders size={14} color="#f59e0b" /> PV PANEL TILT</span>
          <span style={{ color: "#ffffff", fontWeight: 700 }}>{panelTilt}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="45"
          step="1"
          value={panelTilt}
          onChange={(e) => setPanelTilt(parseInt(e.target.value))}
          style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "monospace" }}>SOLAR POSITION PRESET</span>
        {SEASONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSeason(s.id)}
            style={{
              padding: "8px 12px",
              borderRadius: "10px",
              border: season === s.id ? "1px solid rgba(245, 158, 11, 0.5)" : "1px solid rgba(255, 255, 255, 0.06)",
              background: season === s.id ? "rgba(245, 158, 11, 0.15)" : "rgba(255, 255, 255, 0.02)",
              color: season === s.id ? "#fbbf24" : "#94a3b8",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "monospace"
            }}>
            <span>{s.label}</span>
            <span style={{ opacity: 0.7 }}>Peak: {s.maxElev}°</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "monospace" }}>3D ARCHITECTURAL TOPOLOGY</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {SCENE_PRESETS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setScenePreset(p.id)}
                style={{
                  padding: "8px",
                  borderRadius: "10px",
                  border: scenePreset === p.id ? "1px solid #ffffff" : "1px solid rgba(255, 255, 255, 0.06)",
                  background: scenePreset === p.id ? "#ffffff" : "rgba(255, 255, 255, 0.02)",
                  color: scenePreset === p.id ? "#000000" : "#94a3b8",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "monospace"
                }}>
                <Icon size={14} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "monospace" }}>RENDER &amp; SHADING MODE</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {SHADING_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setShadingMode(m.id)}
              style={{
                padding: "8px",
                borderRadius: "10px",
                border: shadingMode === m.id ? "1px solid #f59e0b" : "1px solid rgba(255, 255, 255, 0.06)",
                background: shadingMode === m.id ? "#f59e0b" : "rgba(255, 255, 255, 0.02)",
                color: shadingMode === m.id ? "#000000" : "#94a3b8",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "monospace"
              }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleExportCsv}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "10px",
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
          fontSize: "0.75rem",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "monospace",
          marginTop: "4px"
        }}>
        <FileSpreadsheet size={14} color="#f59e0b" />
        <span>EXPORT HOURLY DATA (.CSV)</span>
      </button>
    </div>
  );
};

export default SolarControls;
