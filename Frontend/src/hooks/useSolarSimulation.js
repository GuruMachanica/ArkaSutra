import { useState, useMemo } from 'react';

export function useSolarSimulation() {
  const [timeOfDay, setTimeOfDay] = useState(12.0);
  const [season, setSeason] = useState('summer');
  const [scenePreset, setScenePreset] = useState('commercial');
  const [shadingMode, setShadingMode] = useState('realistic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [panelTilt, setPanelTilt] = useState(25);
  const [meshStats, setMeshStats] = useState({ totalRooftopArea: 210.0, panelsCount: 120 });

  const { elevation, azimuth, baseIrradiance } = useMemo(() => {
    const maxElev = season === 'summer' ? 72 : season === 'equinox' ? 50 : 28;
    const hourDelta = timeOfDay - 12.0;
    const rawElev = Math.max(0, maxElev * Math.cos((hourDelta / 6.5) * (Math.PI / 2)));
    const rawAzim = 180 + (hourDelta / 6.5) * 85;
    const rad = (rawElev * Math.PI) / 180;
    const baseIrr = Math.round(1000 * Math.sin(rad));

    return { elevation: rawElev, azimuth: rawAzim, baseIrradiance: Math.max(0, baseIrr) };
  }, [timeOfDay, season]);

  return {
    timeOfDay, setTimeOfDay, season, setSeason,
    scenePreset, setScenePreset, shadingMode, setShadingMode,
    isPlaying, setIsPlaying, panelTilt, setPanelTilt,
    meshStats, setMeshStats, elevation, azimuth, baseIrradiance
  };
}
