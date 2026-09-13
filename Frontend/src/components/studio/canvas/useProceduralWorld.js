import { useEffect, useRef } from "react";
import { createMaterials } from "./materials";
import { buildCommercial } from "./builders/commercialBuilder";
import { buildResidential } from "./builders/residentialBuilder";
import { buildHighrise } from "./builders/highriseBuilder";
import { buildUtility } from "./builders/utilityBuilder";
import { buildEnvironment } from "./builders/environmentBuilder";
import { buildCityBuildings } from "./builders/cityBuildingsBuilder";

export function useProceduralWorld({ modelsGroupRef, scenePreset, shadingMode, panelTilt, cityBuildings, onMeshStatsUpdate }) {
  const solarPanelsRef = useRef([]);

  useEffect(() => {
    if (!modelsGroupRef.current) return;
    const group = modelsGroupRef.current;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    solarPanelsRef.current = [];
    const materials = createMaterials(shadingMode);

    if (cityBuildings && cityBuildings.length > 0) {
      buildEnvironment(group, materials);
      buildCityBuildings(group, cityBuildings, materials, solarPanelsRef);
      const totalArea = cityBuildings.reduce((sum, b) => sum + (b.roof_area_m2 || 0), 0);
      const totalKwp = cityBuildings.reduce((sum, b) => sum + (b.solar?.pv_capacity_kwp || 0), 0);
      if (onMeshStatsUpdate) onMeshStatsUpdate({ totalRooftopArea: Math.round(totalArea), panelsCount: Math.round(totalKwp * 2.5), systemCapacityKwp: Math.round(totalKwp) });
      return;
    }

    if (scenePreset !== "utility") buildEnvironment(group, materials);
    if (scenePreset === "commercial") {
      buildCommercial(group, materials, panelTilt, solarPanelsRef);
      if (onMeshStatsUpdate) onMeshStatsUpdate({ totalRooftopArea: 820, panelsCount: 180, systemCapacityKwp: 72.0 });
    } else if (scenePreset === "residential") {
      buildResidential(group, materials, panelTilt, solarPanelsRef);
      if (onMeshStatsUpdate) onMeshStatsUpdate({ totalRooftopArea: 380, panelsCount: 96, systemCapacityKwp: 38.4 });
    } else if (scenePreset === "highrise") {
      buildHighrise(group, materials, panelTilt, solarPanelsRef);
      if (onMeshStatsUpdate) onMeshStatsUpdate({ totalRooftopArea: 640, panelsCount: 144, systemCapacityKwp: 57.6 });
    } else if (scenePreset === "utility" || scenePreset === "farm") {
      buildUtility(group, materials, panelTilt, solarPanelsRef);
      if (onMeshStatsUpdate) onMeshStatsUpdate({ totalRooftopArea: 1420, panelsCount: 384, systemCapacityKwp: 153.6 });
    }
  }, [modelsGroupRef, scenePreset, shadingMode, panelTilt, cityBuildings, onMeshStatsUpdate]);

  return { solarPanelsRef };
}
