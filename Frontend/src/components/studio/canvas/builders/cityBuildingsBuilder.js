import * as THREE from "three";

export function buildCityBuildings(group, cityBuildings, materials, solarPanelsRef) {
  if (!cityBuildings || cityBuildings.length === 0) return;

  const facadeMat = typeof materials?.getBuildingMat === "function"
    ? materials.getBuildingMat(0x334155, 0.7, 0.2)
    : new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });

  const baseRoofMat = materials?.pvPanelMat || new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.85 });

  cityBuildings.forEach((bldg) => {
    const pts = bldg.polygon;
    if (!pts || pts.length < 3) return;

    const height = Math.max(5, bldg.height || 12);
    const shape = new THREE.Shape();

    pts.forEach((pt, idx) => {
      if (idx === 0) shape.moveTo(pt[0], -pt[1]);
      else shape.lineTo(pt[0], -pt[1]);
    });

    const extrudeSettings = { depth: height, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.rotateX(Math.PI / 2);

    const mesh = new THREE.Mesh(geom, facadeMat);
    mesh.position.set(0, 0, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    // Interactive roof surface mesh
    const roofGeom = new THREE.ShapeGeometry(shape);
    roofGeom.rotateX(Math.PI / 2);
    const roofMat = baseRoofMat.clone();
    roofMat.color = new THREE.Color("#0284c7");
    roofMat.roughness = 0.2;

    const roofMesh = new THREE.Mesh(roofGeom, roofMat);
    roofMesh.position.set(0, height + 0.05, 0);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;

    roofMesh.userData = {
      isRoof: true,
      buildingName: bldg.name,
      osmId: bldg.osm_id,
      solar: bldg.solar
    };

    group.add(roofMesh);
    if (solarPanelsRef?.current) {
      solarPanelsRef.current.push(roofMesh);
    }
  });
}
