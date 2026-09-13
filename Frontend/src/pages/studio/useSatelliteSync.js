import { useState, useEffect } from "react";
import { fetchLiveSatelliteData } from "../../services/satelliteApi";
import { PRESET_COORDS } from "./studioConstants";

export function useSatelliteSync(scenePreset) {
  const initial = PRESET_COORDS[scenePreset] || PRESET_COORDS.commercial;
  const [activeLocation, setActiveLocation] = useState(initial);
  const [satelliteData, setSatelliteData] = useState(null);
  const [isLoadingSatellite, setIsLoadingSatellite] = useState(true);

  useEffect(() => {
    if (PRESET_COORDS[scenePreset]) {
      setActiveLocation(PRESET_COORDS[scenePreset]);
    }
  }, [scenePreset]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingSatellite(true);

    fetchLiveSatelliteData(activeLocation.lat, activeLocation.lon)
      .then((data) => {
        if (!cancelled) {
          setSatelliteData(data);
          setIsLoadingSatellite(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoadingSatellite(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeLocation.lat, activeLocation.lon]);

  return { activeLocation, setActiveLocation, satelliteData, isLoadingSatellite };
}
