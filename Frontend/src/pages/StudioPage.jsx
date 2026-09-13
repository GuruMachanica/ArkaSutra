import React, { useState, useRef } from "react";
import SolarCanvas3D from "../components/studio/SolarCanvas3D";
import SolarControls from "../components/studio/SolarControls";
import AnalyticsPanel from "../components/studio/AnalyticsPanel";
import topologiesData from "../datasets/topologies_dataset.json";
import StudioHeader from "./studio/StudioHeader";
import GlobalSearchModal from "./studio/GlobalSearchModal";
import { useSatelliteSync } from "./studio/useSatelliteSync";

export default function StudioPage(props) {
  const {
    timeOfDay, setTimeOfDay, season, setSeason,
    scenePreset, setScenePreset, shadingMode, setShadingMode,
    elevation, azimuth, baseIrradiance, meshStats, setMeshStats,
    onBackToHome, isPlaying, setIsPlaying, panelTilt, setPanelTilt
  } = props;

  const canvasRef = useRef(null);
  const [activeCamPreset, setActiveCamPreset] = useState("orbit");
  const [searchOpen, setSearchOpen] = useState(false);

  const { activeLocation, setActiveLocation, satelliteData, isLoadingSatellite } = useSatelliteSync(scenePreset);
  const currentTopology = topologiesData.topologies[scenePreset] || topologiesData.topologies.commercial;

  const handleCamPresetChange = (presetId) => {
    setActiveCamPreset(presetId);
    if (canvasRef.current?.setCameraPreset) canvasRef.current.setCameraPreset(presetId);
  };

  const handleSelectCity = (city) => {
    setActiveLocation({
      lat: city.latitude, lon: city.longitude,
      label: `${city.name}, ${city.country || city.admin1 || ""}`,
      name: `${city.name} Solar Zone`
    });
    setSearchOpen(false);
  };

  const cloudCoverPct = satelliteData?.current?.cloud_cover_pct ?? 15;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", paddingTop: "76px", overflow: "hidden", userSelect: "none" }}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <SolarCanvas3D
          ref={canvasRef}
          elevation={elevation} azimuth={azimuth}
          shadingMode={shadingMode} scenePreset={scenePreset}
          onMeshStatsUpdate={setMeshStats} panelTilt={panelTilt}
          activeCamPreset={activeCamPreset} onCamPresetChange={handleCamPresetChange}
          cloudCover={cloudCoverPct}
        />

        <StudioHeader
          onBackToHome={onBackToHome}
          topologyName={currentTopology.name}
          activeCamPreset={activeCamPreset}
          onCamPresetChange={handleCamPresetChange}
          activeLocation={activeLocation}
          onOpenSearch={() => setSearchOpen(!searchOpen)}
        />

        <GlobalSearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectCity={handleSelectCity}
        />

        <div style={{ position: "absolute", top: "76px", left: "16px", zIndex: 20, width: "380px", maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 170px)" }}>
          <SolarControls
            timeOfDay={timeOfDay} setTimeOfDay={setTimeOfDay}
            season={season} setSeason={setSeason}
            scenePreset={scenePreset} setScenePreset={setScenePreset}
            shadingMode={shadingMode} setShadingMode={setShadingMode}
            elevation={elevation} azimuth={azimuth}
            isPlaying={isPlaying} setIsPlaying={setIsPlaying}
            panelTilt={panelTilt} setPanelTilt={setPanelTilt}
          />
        </div>

        <div style={{ position: "absolute", top: "76px", right: "16px", zIndex: 20, width: "340px", maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 170px)" }}>
          <AnalyticsPanel
            irradiance={baseIrradiance}
            stats={{ ...meshStats, name: activeLocation.name || meshStats.name, location: activeLocation.label || meshStats.location }}
            elevation={elevation}
            satelliteData={satelliteData}
            isLoadingSatellite={isLoadingSatellite}
          />
        </div>
      </div>
    </div>
  );
}
