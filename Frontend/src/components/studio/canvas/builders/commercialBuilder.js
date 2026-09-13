import * as THREE from "three";

export function buildCommercial(group, materials, panelTilt, solarPanelsRef) {
  const { getBuildingMat, glassCurtainMat, pvFrameMat, pvPanelMat, carportRoofMat } = materials;

  const mainHq = new THREE.Mesh(new THREE.BoxGeometry(28, 16, 24), getBuildingMat(0x1e293b, 0.4, 0.4));
  mainHq.position.set(-6, 8, -4);
  mainHq.castShadow = true;
  mainHq.receiveShadow = true;
  group.add(mainHq);

  const glassFacade = new THREE.Mesh(new THREE.BoxGeometry(28.2, 12, 1.2), glassCurtainMat);
  glassFacade.position.set(-6, 8, 7.6);
  group.add(glassFacade);

  const warehouse = new THREE.Mesh(new THREE.BoxGeometry(32, 8, 20), getBuildingMat(0x334155, 0.7, 0.2));
  warehouse.position.set(28, 4, -4);
  warehouse.castShadow = true;
  warehouse.receiveShadow = true;
  group.add(warehouse);

  // Solar arrays on warehouse flat roof
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 8; c++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 1.6), pvPanelMat);
      panel.position.set(16 + c * 3.4, 8.3, -10 + r * 3.2);
      panel.rotation.x = (panelTilt * Math.PI) / 180;
      panel.castShadow = true;
      group.add(panel);
      solarPanelsRef.current.push(panel);
    }
  }

  // 4 Solar Carport Canopies
  for (let i = 0; i < 4; i++) {
    const cpX = -20 + i * 10;
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), pvFrameMat);
    leg1.position.set(cpX, 2, 22);
    group.add(leg1);
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 5), carportRoofMat);
    canopy.position.set(cpX, 4.2, 22);
    canopy.rotation.x = -0.15;
    canopy.castShadow = true;
    group.add(canopy);
  }
}
