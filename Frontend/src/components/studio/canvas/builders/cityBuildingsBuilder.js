import * as THREE from "three";

export function buildCityBuildings(group, cityBuildings, materials, solarPanelsRef, shadingMode = "realistic") {
  if (!cityBuildings || cityBuildings.length === 0) return;

  cityBuildings.forEach((bldg, bIdx) => {
    const pts = bldg.polygon;
    if (!pts || pts.length < 3) return;

    const height = Math.max(8, bldg.height || 16);
    const shape = new THREE.Shape();
    pts.forEach((pt, idx) => {
      // (pt[0], -pt[1]) ensures rotateX(-Math.PI / 2) maps correctly to +z in world space
      if (idx === 0) shape.moveTo(pt[0], -pt[1]);
      else shape.lineTo(pt[0], -pt[1]);
    });

    const extrudeSettings = { depth: height, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.3, steps: 1 };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.rotateX(-Math.PI / 2);

    const isHeatmap = shadingMode === "heatmap";
    const isWire = shadingMode === "wireframe";
    const isOcc = shadingMode === "occlusion";

    const hue = (bIdx * 45) % 360;
    const facadeColor = isHeatmap ? 0x1e293b : isOcc ? 0x18181b : new THREE.Color(`hsl(${hue}, 15%, 28%)`);
    const facadeMat = new THREE.MeshStandardMaterial({ color: facadeColor, roughness: 0.6, wireframe: isWire });
    const buildingMesh = new THREE.Mesh(geom, facadeMat);
    buildingMesh.castShadow = true;
    buildingMesh.receiveShadow = true;
    buildingMesh.userData = { isRoof: true, isBuilding: true, buildingName: bldg.name, osmId: bldg.osm_id, solar: bldg.solar };
    group.add(buildingMesh);

    // Interactive 3D Rooftop cap with irradiance thermal mapping in heatmap mode
    const roofGeom = new THREE.ShapeGeometry(shape);
    roofGeom.rotateX(-Math.PI / 2);
    const kwh = bldg.solar?.annual_generation_kwh || 50000;
    const heatColor = kwh > 70000 ? 0xef4444 : kwh > 45000 ? 0xf59e0b : 0x0284c7;
    const roofColor = isHeatmap ? heatColor : isOcc ? 0x27272a : 0x0284c7;
    const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.2, metalness: 0.85, side: THREE.DoubleSide, wireframe: isWire });
    const roofMesh = new THREE.Mesh(roofGeom, roofMat);
    roofMesh.position.set(0, height + 0.15, 0);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.userData = { isRoof: true, isBuilding: true, buildingName: bldg.name, osmId: bldg.osm_id, solar: bldg.solar };
    group.add(roofMesh);

    // Add angled Photovoltaic modules on the roof
    const cx = bldg.center.x, cz = bldg.center.z;
    const panelCols = Math.max(2, Math.min(6, Math.floor(Math.sqrt(bldg.roof_area_m2) / 4)));
    const pvMat = new THREE.MeshStandardMaterial({ color: isHeatmap ? 0xfbbf24 : 0x1e3a8a, roughness: 0.15, metalness: 0.95, wireframe: isWire });

    for (let r = 0; r < panelCols; r++) {
      for (let c = 0; c < panelCols; c++) {
        const px = cx - (panelCols * 1.6) / 2 + c * 1.8;
        const pz = cz - (panelCols * 1.4) / 2 + r * 1.6;
        const pvGeom = new THREE.BoxGeometry(1.5, 0.08, 1.2);
        const pvMesh = new THREE.Mesh(pvGeom, pvMat);
        pvMesh.position.set(px, height + 0.35, pz);
        pvMesh.rotation.x = THREE.MathUtils.degToRad(25); // 25 deg tilt toward South
        pvMesh.castShadow = true;
        pvMesh.userData = { isRoof: true, isBuilding: true, buildingName: bldg.name, osmId: bldg.osm_id, solar: bldg.solar };
        group.add(pvMesh);
      }
    }

    if (solarPanelsRef?.current) solarPanelsRef.current.push(roofMesh);
  });
}
