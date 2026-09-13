import * as THREE from "three";

export function buildHighrise(group, materials, panelTilt, solarPanelsRef) {
  const { getBuildingMat, glassCurtainMat, pvPanelMat, roofEdgeMat } = materials;

  const towers = [
    { x: -16, z: -16, w: 12, d: 12, h: 42, col: 0x1e293b },
    { x: 16, z: -16, w: 14, d: 14, h: 54, col: 0x0f172a },
    { x: -16, z: 16, w: 14, d: 12, h: 36, col: 0x334155 },
    { x: 16, z: 16, w: 16, d: 16, h: 68, col: 0x0284c7 }
  ];

  towers.forEach((t) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), getBuildingMat(t.col, 0.3, 0.6));
    tower.position.set(t.x, t.h / 2, t.z);
    tower.castShadow = true;
    tower.receiveShadow = true;
    group.add(tower);

    // Glass curtain outer skin
    const glass = new THREE.Mesh(new THREE.BoxGeometry(t.w + 0.2, t.h - 4, t.d + 0.2), glassCurtainMat);
    glass.position.set(t.x, t.h / 2, t.z);
    group.add(glass);

    // Communications spire / Helipad
    if (t.h > 50) {
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.6, 12, 8), roofEdgeMat);
      spire.position.set(t.x, t.h + 6, t.z);
      spire.castShadow = true;
      group.add(spire);
    } else {
      // Rooftop solar array
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const panel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.5), pvPanelMat);
          panel.position.set(t.x - 3 + c * 3, t.h + 0.3, t.z - 3 + r * 3);
          panel.rotation.x = (panelTilt * Math.PI) / 180;
          panel.castShadow = true;
          group.add(panel);
          solarPanelsRef.current.push(panel);
        }
      }
    }
  });

  // Skybridge connecting 2 towers
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(20, 3.5, 4), glassCurtainMat);
  bridge.position.set(0, 32, -16);
  bridge.castShadow = true;
  group.add(bridge);
}
