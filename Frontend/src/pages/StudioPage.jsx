import React, { useState, useRef, useEffect, useMemo } from "react";
import SolarCanvas3D from "../components/studio/SolarCanvas3D";
import SolarControls from "../components/studio/SolarControls";
import AnalyticsPanel from "../components/studio/AnalyticsPanel";
import { ArrowLeft, Globe, MapPin, Search, X, Loader2, Radio } from "lucide-react";
import topologiesData from "../datasets/topologies_dataset.json";
import { fetchLiveSatelliteData, searchGlobalLocations } from "../services/satelliteApi";

const CAMERA_PRESETS = [
  { id: "orbit", label: "Neighborhood 3D" },
  { id: "top", label: "City Map (2D)" },
  { id: "close", label: "Rooftop Zoom" },
  { id: "street", label: "Street Level" }
];

const PRESET_COORDS = {
  commercial: { lat: 50.1109, lon: 8.6821, label: "Frankfurt, Germany", name: "Apex Logistics Tech Park" },
  residential: { lat: 52.0116, lon: 4.3571, label: "Delft, Netherlands", name: "Zuid Eco-Residential" },
  highrise: { lat: 41.8781, lon: -87.6298, label: "Chicago, USA", name: "Summit Financial District" },
  utility: { lat: 35.0110, lon: -115.4734, label: "Mojave Desert, USA", name: "Solaris Single-Axis Farm" }
};

const QUICK_CITIES = [
  { name: "Tokyo", country: "Japan", lat: 35.6895, lon: 139.6917 },
  { name: "London", country: "UK", lat: 51.5074, lon: -0.1278 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777 }
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Active GPS Coordinates & Satellite State
  const initialCoords = PRESET_COORDS[scenePreset] || PRESET_COORDS.commercial;
  const [activeLocation, setActiveLocation] = useState(initialCoords);
  const [satelliteData, setSatelliteData] = useState(null);
  const [isLoadingSatellite, setIsLoadingSatellite] = useState(true);

  // Sync active location if scenePreset changes from outside
  useEffect(() => {
    if (PRESET_COORDS[scenePreset]) {
      setActiveLocation(PRESET_COORDS[scenePreset]);
    }
  }, [scenePreset]);

  // Fetch live satellite telemetry whenever activeLocation changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingSatellite(true);

    fetchLiveSatelliteData(activeLocation.lat, activeLocation.lon)
      .then((data) => {
        if (!isCancelled) {
          setSatelliteData(data);
          setIsLoadingSatellite(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.warn("Satellite fetch fallback:", err);
          setIsLoadingSatellite(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [activeLocation.lat, activeLocation.lon]);

  // Handle Geocoding Search
  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchGlobalLocations(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectCity = (city) => {
    setActiveLocation({
      lat: city.latitude,
      lon: city.longitude,
      label: `${city.name}, ${city.country || city.admin1 || ""}`,
      name: `${city.name} Solar Zone`
    });
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const currentTopology = topologiesData.topologies[scenePreset] || topologiesData.topologies.commercial;

  const handleCameraPresetChange = (presetId) => {
    setActiveCamPreset(presetId);
    if (canvasRef.current && canvasRef.current.setCameraPreset) {
      canvasRef.current.setCameraPreset(presetId);
    }
  };

  const cloudCoverPct = satelliteData?.current?.cloud_cover_pct ?? 15;

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
          cloudCover={cloudCoverPct}
        />

        {/* Master Studio HUD Top Bar (Clean 3-Zone Flexbox Layout) */}
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
          {/* Left Zone: Back Button & Dataset Tag */}
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

          {/* Right Zone: Geographic Coordinates & Satellite Search Trigger */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", pointerEvents: "auto" }}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              title="Click to search any global city or coordinates"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(15, 23, 42, 0.90)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                padding: "7px 14px",
                borderRadius: "14px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "#38bdf8",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}>
              <Search size={13} color="#38bdf8" />
              <span>{activeLocation.label || `${activeLocation.lat}° N, ${activeLocation.lon}° E`}</span>
              <span style={{
                background: "rgba(56, 189, 248, 0.15)",
                color: "#38bdf8",
                fontSize: "0.65rem",
                padding: "2px 6px",
                borderRadius: "6px",
                fontWeight: 700
              }}>
                SAT LIVE
              </span>
            </button>
          </div>
        </header>

        {/* Global Satellite City Search Dropdown Modal */}
        {searchOpen && (
          <div style={{
            position: "absolute",
            top: "70px",
            right: "16px",
            zIndex: 40,
            width: "360px",
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderRadius: "20px",
            padding: "16px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
            fontFamily: "monospace",
            color: "#ffffff"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#38bdf8", fontSize: "0.78rem", fontWeight: 700 }}>
                <Radio size={14} className="animate-pulse" />
                <span>GLOBAL SATELLITE SEARCH</span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city (e.g., Paris, Cairo, Tokyo)..."
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  color: "#ffffff",
                  fontSize: "0.78rem",
                  fontFamily: "monospace",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  background: "#38bdf8",
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 14px",
                  color: "#0f172a",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                {isSearching ? <Loader2 size={13} className="animate-spin" /> : "SEARCH"}
              </button>
            </form>

            {/* Quick Suggestions */}
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontSize: "0.68rem", color: "#64748b", display: "block", marginBottom: "6px" }}>
                QUICK SATELLITE PRESETS:
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {QUICK_CITIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleSelectCity({ latitude: c.lat, longitude: c.lon, name: c.name, country: c.country })}
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      color: "#94a3b8",
                      fontSize: "0.7rem",
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results List */}
            {searchResults.length > 0 && (
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "8px" }}>
                <span style={{ fontSize: "0.68rem", color: "#38bdf8", display: "block", marginBottom: "4px" }}>
                  RESULTS:
                </span>
                {searchResults.map((r) => (
                  <div
                    key={`${r.name}-${r.latitude}-${r.longitude}`}
                    onClick={() => handleSelectCity(r)}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(255, 255, 255, 0.02)",
                      marginBottom: "4px"
                    }}>
                    <div>
                      <strong style={{ color: "#ffffff", fontSize: "0.78rem" }}>{r.name}</strong>
                      <span style={{ color: "#64748b", fontSize: "0.7rem", marginLeft: "6px" }}>{r.country}</span>
                    </div>
                    <span style={{ color: "#38bdf8", fontSize: "0.68rem" }}>
                      {r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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

        {/* Right Floating Analytics Panel with Live Satellite Data */}
        <div style={{
          position: "absolute",
          top: "76px",
          right: "16px",
          zIndex: 20,
          width: "340px",
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 170px)"
        }}>
          <AnalyticsPanel
            irradiance={baseIrradiance}
            stats={{
              ...meshStats,
              name: activeLocation.name || meshStats.name,
              location: activeLocation.label || meshStats.location
            }}
            elevation={elevation}
            satelliteData={satelliteData}
            isLoadingSatellite={isLoadingSatellite}
          />
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
