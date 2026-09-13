import * as THREE from "three";

export function buildEnvironment(group, materials) {
  const { asphaltRoadMat, sidewalkMat, roadMarkingMat, treeTrunkMat, treeFoliageMat } = materials;

  // Main Boulevard Asphalt Road
  const road = new THREE.Mesh(new THREE.PlaneGeometry(16, 260), asphaltRoadMat);
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0.04, 0);
  road.receiveShadow = true;
  group.add(road);

  // Sidewalks
  [-9, 9].forEach((swX) => {
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 260), sidewalkMat);
    sw.rotation.x = -Math.PI / 2;
    sw.position.set(swX, 0.06, 0);
    sw.receiveShadow = true;
    group.add(sw);
  });

  // Dashed lane markings
  for (let z = -120; z <= 120; z += 12) {
    const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 4), roadMarkingMat);
    mark.rotation.x = -Math.PI / 2;
    mark.position.set(0, 0.06, z);
    group.add(mark);
  }

  // Trees along roadside
  const treeCoords = [
    [-14, -40], [-14, -10], [-14, 20], [-14, 50],
    [14, -40], [14, -10], [14, 20], [14, 50]
  ];
  treeCoords.forEach(([tx, tz]) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3.5), treeTrunkMat);
    trunk.position.set(tx, 1.75, tz);
    trunk.castShadow = true;
    group.add(trunk);

    const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2), treeFoliageMat);
    foliage.position.set(tx, 4.5, tz);
    foliage.castShadow = true;
    group.add(foliage);
  });
}
