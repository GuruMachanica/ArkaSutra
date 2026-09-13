import * as THREE from "three";

export function createMaterials(shadingMode) {
  const getBuildingMat = (color = 0x334155, roughness = 0.65, metalness = 0.25) => {
    if (shadingMode === "heatmap") return new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, metalness: 0.2 });
    if (shadingMode === "occlusion") return new THREE.MeshStandardMaterial({ color: 0x242424, roughness: 0.95 });
    if (shadingMode === "wireframe") return new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true });
    return new THREE.MeshStandardMaterial({ color, roughness, metalness });
  };

  const glassCurtainMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8, roughness: 0.05, metalness: 0.95, transparent: true, opacity: 0.85
  });

  const asphaltRoadMat = new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.95, metalness: 0.05 });
  const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, metalness: 0.1 });
  const roadMarkingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.9 });
  const roofEdgeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
  const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const treeFoliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
  const pvFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
  const pvPanelMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.15, metalness: 0.9 });
  const carportRoofMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.3 });

  return {
    getBuildingMat, glassCurtainMat, asphaltRoadMat, sidewalkMat, roadMarkingMat,
    waterMat, roofEdgeMat, chimneyMat, treeTrunkMat, treeFoliageMat, pvFrameMat,
    pvPanelMat, carportRoofMat
  };
}
