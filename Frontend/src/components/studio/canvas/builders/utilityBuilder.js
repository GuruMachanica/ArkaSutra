import * as THREE from "three";

export function buildUtility(group, materials, panelTilt, solarPanelsRef) {
  const { pvFrameMat, pvPanelMat, getBuildingMat } = materials;

  // 64-Tracker Single-Axis Solar Matrix (8 rows x 8 strings)
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const trackerX = -35 + c * 10;
      const trackerZ = -35 + r * 10;

      // Torque tube torque axle
      const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 7.5), pvFrameMat);
      axle.rotation.z = Math.PI / 2;
      axle.position.set(trackerX, 1.4, trackerZ);
      group.add(axle);

      // Support pillars
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.4), pvFrameMat);
      p1.position.set(trackerX - 2.8, 0.7, trackerZ);
      group.add(p1);
      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.4), pvFrameMat);
      p2.position.set(trackerX + 2.8, 0.7, trackerZ);
      group.add(p2);

      // PV Panel String on Tracker
      const panel = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.08, 2.2), pvPanelMat);
      panel.position.set(trackerX, 1.6, trackerZ);
      panel.rotation.x = (panelTilt * Math.PI) / 180;
      panel.castShadow = true;
      panel.receiveShadow = true;
      group.add(panel);
      solarPanelsRef.current.push(panel);
    }
  }

  // Central 33kV step-up substation
  const sub = new THREE.Mesh(new THREE.BoxGeometry(8, 4, 6), getBuildingMat(0x475569, 0.6, 0.4));
  sub.position.set(0, 2, 44);
  sub.castShadow = true;
  group.add(sub);
}
