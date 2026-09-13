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
    let downPos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      if (e.button === 0) downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e) => {
      if (e.button !== 0) return;
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist > 6) return; // Disregard camera drag rotations

      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children, true);
      const hit = intersects.find((h) => h.object.userData?.solar || h.object.userData?.isRoof);

      if (hit) {
        if (selectedMeshRef.current?.material?.emissive) {
          selectedMeshRef.current.material.emissive.setHex(0x000000);
        }
        selectedMeshRef.current = hit.object;
        if (hit.object.material?.emissive) {
          hit.object.material.emissive.setHex(0x38bdf8);
        }
        const data = hit.object.userData.solar || hit.object.userData;
        onSelectRoof({
          ...data,
          buildingName: hit.object.userData.buildingName || data.name || "Building Solar Array"
        });
      }
    };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointerup", onPointerUp);
    return () => {
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointerup", onPointerUp);
      if (selectedMeshRef.current?.material?.emissive) {
        selectedMeshRef.current.material.emissive.setHex(0x000000);
      }
    };
  }, [mountRef, cameraRef, modelsGroupRef, onSelectRoof]);
}
