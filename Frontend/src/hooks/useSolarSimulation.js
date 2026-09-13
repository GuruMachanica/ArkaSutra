import { useState, useMemo } from 'react';

export function useSolarSimulation() {
  const [latitude, setLatitude] = useState(35.68);
  const [timeOfDay, setTimeOfDay] = useState(12.0);
  const [season, setSeason] = useState('summer');
  const [scenePreset, setScenePreset] = useState('commercial');
  const [shadingMode, setShadingMode] = useState('realistic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelTilt, setPanelTilt] = useState(25);
  const [meshStats, setMeshStats] = useState({ totalRooftopArea: 210.0, panelsCount: 120 });

  const { elevation, azimuth, baseIrradiance } = useMemo(() => {
    const phi = ((latitude || 35.68) * Math.PI) / 180;
    const deltaDeg = season === 'summer' ? 23.45 : season === 'equinox' ? 0.0 : -23.45;
    const delta = (deltaDeg * Math.PI) / 180;
    const H = ((timeOfDay - 12.0) * 15 * Math.PI) / 180;

    const sinElev = Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H);
    const elevRad = Math.asin(Math.max(-1, Math.min(1, sinElev)));
    const elevDeg = Math.max(0, (elevRad * 180) / Math.PI);

    let azimDeg = 180;
    if (elevDeg > 0.01) {
      const y = -Math.cos(delta) * Math.sin(H);
      const x = Math.sin(delta) * Math.cos(phi) - Math.cos(delta) * Math.sin(phi) * Math.cos(H);
      azimDeg = (Math.atan2(y, x) * 180) / Math.PI;
      if (azimDeg < 0) azimDeg += 360;
    }

    const baseIrr = elevDeg > 0 ? Math.round(1050 * Math.sin(elevRad)) : 0;
    return { elevation: elevDeg, azimuth: azimDeg, baseIrradiance: baseIrr };
  }, [timeOfDay, season, latitude]);

  return {
    latitude, setLatitude,
    timeOfDay, setTimeOfDay, season, setSeason,
    scenePreset, setScenePreset, shadingMode, setShadingMode,
    isPlaying, setIsPlaying, panelTilt, setPanelTilt,
    meshStats, setMeshStats, elevation, azimuth, baseIrradiance
  };
}
