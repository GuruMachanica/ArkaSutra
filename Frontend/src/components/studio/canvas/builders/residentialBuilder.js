import * as THREE from "three";

export function buildResidential(group, materials, panelTilt, solarPanelsRef) {
  const { getBuildingMat, chimneyMat, waterMat, pvPanelMat } = materials;

  const villaCoords = [
    [-24, -18], [-8, -18], [8, -18], [24, -18],
    [-24, 6], [-8, 6], [8, 6], [24, 6]
  ];

  villaCoords.forEach(([vx, vz], idx) => {
    const bldg = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 8), getBuildingMat(0xe2e8f0, 0.7, 0.1));
    bldg.position.set(vx, 2.5, vz);
    bldg.castShadow = true;
    bldg.receiveShadow = true;
    group.add(bldg);

    // Gabled roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(7, 3.2, 4), getBuildingMat(0x991b1b, 0.8, 0.1));
    roof.position.set(vx, 6.6, vz);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Chimney
    const ch = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.8), chimneyMat);
    ch.position.set(vx + 2.2, 7.2, vz + 1.2);
    ch.castShadow = true;
    group.add(ch);

    // Swimming pool for select villas
    if (idx % 2 === 0) {
      const pool = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 4), waterMat);
      pool.position.set(vx, 0.1, vz + 8);
      group.add(pool);
    }

    // Solar panels on South roof face
    for (let p = 0; p < 4; p++) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.2), pvPanelMat);
      panel.position.set(vx - 2.5 + p * 1.6, 6.2, vz + 1.8);
      panel.rotation.x = -0.45;
      panel.castShadow = true;
      group.add(panel);
      solarPanelsRef.current.push(panel);
    }
  });
}
