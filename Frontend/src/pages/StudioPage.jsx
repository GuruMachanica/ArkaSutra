import React, { useState, useRef } from "react";
import SolarCanvas3D from "../components/studio/SolarCanvas3D";
import SolarControls from "../components/studio/SolarControls";
import AnalyticsPanel from "../components/studio/AnalyticsPanel";
import { ArrowLeft, Globe, MapPin, Camera } from "lucide-react";
import topologiesData from "../datasets/topologies_dataset.json";

const CAMERA_PRESETS = [
  { id: "orbit", label: "Neighborhood 3D" },
  { id: "top", label: "City Map (2D)" },
  { id: "close", label: "Rooftop Zoom" },
  { id: "street", label: "Street Level" }
];

const StudioPage = ({
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
  baseIrradiance,
  meshStats,
  setMeshStats,
  onBackToHome,
  isPlaying,
  setIsPlaying,
  panelTilt,
  setPanelTilt
}) => {
  const canvasRef = useRef(null);
  const [activeCamPreset, setActiveCamPreset] = useState("orbit");
  const currentTopology = topologiesData.topologies[scenePreset] || topologiesData.topologies.commercial;

  const handleCameraPresetChange = (presetId) => {
    setActiveCamPreset(presetId);
    if (canvasRef.current && canvasRef.current.setCameraPreset) {
      canvasRef.current.setCameraPreset(presetId);
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", paddingTop: "76px", overflow: "hidden", userSelect: "none" }}>
      {/* 3D WebGL Canvas Layer */}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <SolarCanvas3D
          ref={canvasRef}
          elevation={elevation}
          azimuth={azimuth}
          shadingMode={shadingMode}
          scenePreset={scenePreset}
          onMeshStatsUpdate={setMeshStats}
          panelTilt={panelTilt}
          activeCamPreset={activeCamPreset}
          onCamPresetChange={handleCameraPresetChange}
        />

        {/* Master Studio HUD Top Bar (Clean 3-Zone Flexbox Layout with ZERO overlap) */}
        <header style={{
          position: "absolute",
          top: "14px",
          left: "16px",
          right: "16px",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "none"
        }}>
          {/* Left Zone: Back Button & Compact Dataset Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", pointerEvents: "auto" }}>
            <button
              onClick={onBackToHome}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(9, 13, 22, 0.85)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "14px",
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                transition: "all 0.2s ease"
              }}>
              <ArrowLeft size={14} color="#f59e0b" />
              <span>BACK</span>
            </button>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "6px 12px",
              borderRadius: "14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              fontFamily: "monospace"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#f59e0b", fontSize: "0.72rem", fontWeight: 700 }}>
                <Globe size={13} />
                <span>LOD2:</span>
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f8fafc" }}>
                {currentTopology.name}
              </div>
            </div>
          </div>

          {/* Center Zone: Camera Viewport Switcher */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(9, 13, 22, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            padding: "4px 6px",
            borderRadius: "9999px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            pointerEvents: "auto"
          }}>
            {CAMERA_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleCameraPresetChange(p.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  border: "none",
                  background: activeCamPreset === p.id ? "#f59e0b" : "transparent",
                  color: activeCamPreset === p.id ? "#000000" : "#94a3b8",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "monospace"
                }}>
                {p.label}
              </button>
            ))}
          </div>

          {/* Right Zone: Geographic Coordinates Badge */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "7px 14px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#38bdf8",
            pointerEvents: "auto"
          }}>
            <MapPin size={12} />
            <span>{currentTopology.location}</span>
          </div>
        </header>

        {/* Left Floating Controls Panel */}
        <div style={{
          position: "absolute",
          top: "76px",
          left: "16px",
          zIndex: 20,
          width: "380px",
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 170px)"
        }}>
          <SolarControls
            timeOfDay={timeOfDay}
            setTimeOfDay={setTimeOfDay}
            season={season}
            setSeason={setSeason}
            scenePreset={scenePreset}
            setScenePreset={setScenePreset}
            shadingMode={shadingMode}
            setShadingMode={setShadingMode}
            elevation={elevation}
            azimuth={azimuth}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            panelTilt={panelTilt}
            setPanelTilt={setPanelTilt}
          />
        </div>

        {/* Right Floating Analytics Panel */}
        <div style={{
          position: "absolute",
          top: "76px",
          right: "16px",
          zIndex: 20,
          width: "360px",
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 170px)"
        }}>
          <AnalyticsPanel
            irradiance={baseIrradiance}
            stats={meshStats}
            elevation={elevation}
          />
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
