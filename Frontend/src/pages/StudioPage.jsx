import React, { useState, useRef, useEffect } from "react";
import SolarCanvas3D from "../components/studio/SolarCanvas3D";
import SolarControls from "../components/studio/SolarControls";
import AnalyticsPanel from "../components/studio/AnalyticsPanel";
import topologiesData from "../datasets/topologies_dataset.json";
import StudioHeader from "./studio/StudioHeader";
import GlobalSearchModal from "./studio/GlobalSearchModal";
import { useSatelliteSync } from "./studio/useSatelliteSync";
import { useCityMapLoader } from "./studio/useCityMapLoader";
import { RoofInspectorHUD } from "../components/studio/analytics/RoofInspectorHUD";

export default function StudioPage(props) {
  const {
    timeOfDay, setTimeOfDay, season, setSeason, scenePreset, setScenePreset,
    shadingMode, setShadingMode, elevation, azimuth, baseIrradiance, meshStats,
    setMeshStats, onBackToHome, isPlaying, setIsPlaying, panelTilt, setPanelTilt,
    setLatitude
  } = props;

  const canvasRef = useRef(null);
  const [activeCamPreset, setActiveCamPreset] = useState("orbit");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedRoof, setSelectedRoof] = useState(null);

  const { activeLocation, setActiveLocation, satelliteData, isLoadingSatellite } = useSatelliteSync(scenePreset);
  const { cityData } = useCityMapLoader(activeLocation);

  useEffect(() => {
    if (activeLocation?.lat && setLatitude) setLatitude(activeLocation.lat);
  }, [activeLocation?.lat, setLatitude]);
  const currentTopology = topologiesData.topologies[scenePreset] || topologiesData.topologies.commercial;

  const handleCamPresetChange = (pId) => {
    setActiveCamPreset(pId);
    if (canvasRef.current?.setCameraPreset) canvasRef.current.setCameraPreset(pId);
  };

  const handleSelectCity = (city) => {
    setActiveLocation({ lat: city.latitude, lon: city.longitude, label: `${city.name}, ${city.country || city.admin1 || ""}`, name: `${city.name} Solar Zone` });
    setSelectedRoof(null);
    setSearchOpen(false);
  };

  const cloudCoverPct = satelliteData?.current?.cloud_cover_pct ?? 15;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", paddingTop: "76px", overflow: "hidden", userSelect: "none" }}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <SolarCanvas3D
          ref={canvasRef} elevation={elevation} azimuth={azimuth} shadingMode={shadingMode}
          scenePreset={scenePreset} onMeshStatsUpdate={setMeshStats} panelTilt={panelTilt}
          activeCamPreset={activeCamPreset} onCamPresetChange={handleCamPresetChange}
          cloudCover={cloudCoverPct} cityBuildings={cityData?.buildings} onSelectRoof={setSelectedRoof}
        />
        <StudioHeader
          onBackToHome={onBackToHome} topologyName={cityData?.source ? `${activeLocation.name || "Live City"} (3D GIS)` : currentTopology.name}
          activeCamPreset={activeCamPreset} onCamPresetChange={handleCamPresetChange}
          activeLocation={activeLocation} onOpenSearch={() => setSearchOpen(!searchOpen)}
        />
        <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} onSelectCity={handleSelectCity} />
        <RoofInspectorHUD roofData={selectedRoof} onClose={() => setSelectedRoof(null)} />

        <div style={{ position: "absolute", top: "76px", left: "16px", zIndex: 20, width: "380px", maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 170px)" }}>
          <SolarControls
            timeOfDay={timeOfDay} setTimeOfDay={setTimeOfDay} season={season} setSeason={setSeason}
            scenePreset={scenePreset} setScenePreset={setScenePreset} shadingMode={shadingMode} setShadingMode={setShadingMode}
            elevation={elevation} azimuth={azimuth} isPlaying={isPlaying} setIsPlaying={setIsPlaying} panelTilt={panelTilt} setPanelTilt={setPanelTilt}
          />
        </div>

        <div style={{ position: "absolute", top: "76px", right: "16px", zIndex: 20, width: "340px", maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 170px)" }}>
          <AnalyticsPanel
            irradiance={baseIrradiance} stats={{ ...meshStats, name: activeLocation.name || meshStats.name, location: activeLocation.label || meshStats.location }}
            elevation={elevation} satelliteData={satelliteData} isLoadingSatellite={isLoadingSatellite}
          />
        </div>
      </div>
    </div>
  );
}
