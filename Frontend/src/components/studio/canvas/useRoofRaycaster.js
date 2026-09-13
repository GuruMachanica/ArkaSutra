import { useEffect, useRef } from "react";
import * as THREE from "three";

export function useRoofRaycaster({ mountRef, cameraRef, modelsGroupRef, onSelectRoof }) {
  const selectedMeshRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const camera = cameraRef.current;
    const group = modelsGroupRef.current;
    if (!mount || !camera || !group || !onSelectRoof) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e) => {
      // Only handle left clicks without drags
      if (e.button !== 0) return;
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children, true);
      const roofHit = intersects.find((hit) => hit.object.userData?.isRoof);

      if (roofHit) {
        if (selectedMeshRef.current && selectedMeshRef.current.material) {
          selectedMeshRef.current.material.emissive?.setHex(0x000000);
        }
        selectedMeshRef.current = roofHit.object;
        if (roofHit.object.material?.emissive) {
          roofHit.object.material.emissive.setHex(0x38bdf8); // Glowing cyan accent
        }
        onSelectRoof({
          ...roofHit.object.userData.solar,
          buildingName: roofHit.object.userData.buildingName
        });
      }
    };

    mount.addEventListener("click", handleClick);
    return () => {
      mount.removeEventListener("click", handleClick);
      if (selectedMeshRef.current?.material?.emissive) {
        selectedMeshRef.current.material.emissive.setHex(0x000000);
      }
    };
  }, [mountRef, cameraRef, modelsGroupRef, onSelectRoof]);
}
