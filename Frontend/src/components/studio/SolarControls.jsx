import React from "react";
import { FileSpreadsheet } from "lucide-react";
import TimeControl from "./controls/TimeControl";
import SeasonControl from "./controls/SeasonControl";
import TopologyControl from "./controls/TopologyControl";
import ShadingModeControl from "./controls/ShadingModeControl";
import TiltControl from "./controls/TiltControl";

export default function SolarControls(props) {
  const {
    timeOfDay, setTimeOfDay, season, setSeason,
    scenePreset, setScenePreset, shadingMode, setShadingMode,
    elevation, azimuth, isPlaying, setIsPlaying,
    panelTilt, setPanelTilt
  } = props;

  const handleExportCsv = () => {
    let csv = "Hour,Solar_Elevation_Deg,Solar_Azimuth_Deg,ClearSky_GHI_W_m2\n";
    for (let h = 6.0; h <= 19.0; h += 0.5) {
      const hd = h - 12.0;
      const maxElev = season === "summer" ? 72 : season === "equinox" ? 50 : 28;
      const elev = Math.max(0, maxElev * Math.cos((hd / 6.5) * (Math.PI / 2)));
      const azim = 180 + (hd / 6.5) * 85;
      const irr = Math.round(1000 * Math.sin((elev * Math.PI) / 180));
      csv += `${h.toFixed(1)},${elev.toFixed(1)},${azim.toFixed(1)},${irr}\n`;
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
      gap: "14px",
      maxHeight: "82vh",
      overflowY: "auto",
      boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: "0.68rem", fontFamily: "monospace", color: "#f59e0b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            CELESTIAL TRAJECTORY
          </span>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>Sun Trajectory Engine</h2>
        </div>
        <button
          onClick={handleExportCsv}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "#10b981", padding: "6px 12px", borderRadius: "10px",
            fontSize: "0.72rem", cursor: "pointer", fontWeight: 700
          }}>
          <FileSpreadsheet size={13} /> Export CSV
        </button>
      </div>

      <TimeControl
        timeOfDay={timeOfDay} setTimeOfDay={setTimeOfDay}
        isPlaying={isPlaying} setIsPlaying={setIsPlaying}
        elevation={elevation} azimuth={azimuth}
      />
      <SeasonControl season={season} setSeason={setSeason} />
      <TopologyControl scenePreset={scenePreset} setScenePreset={setScenePreset} />
      <ShadingModeControl shadingMode={shadingMode} setShadingMode={setShadingMode} />
      <TiltControl panelTilt={panelTilt} setPanelTilt={setPanelTilt} />
    </div>
  );
}
