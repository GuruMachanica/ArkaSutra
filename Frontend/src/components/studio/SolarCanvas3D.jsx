import React, { useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { useThreeScene } from "./canvas/useThreeScene";
import { useSunLighting } from "./canvas/useSunLighting";
import { useCanvasInteraction } from "./canvas/useCanvasInteraction";
import { useProceduralWorld } from "./canvas/useProceduralWorld";
import { useRoofRaycaster } from "./canvas/useRoofRaycaster";

const CAMERA_PRESETS = [
  { id: "orbit", pos: [52, 36, 58], target: [0, 4, 0] },
  { id: "top", pos: [0, 110, 0.01], target: [0, 0, 0] },
  { id: "close", pos: [16, 20, 16], target: [0, 9, 0] },
  { id: "street", pos: [44, 4.2, 44], target: [0, 5, 0] }
];

const SolarCanvas3D = forwardRef((props, ref) => {
  const {
    elevation = 55, azimuth = 180, shadingMode = "realistic",
    scenePreset = "commercial", onMeshStatsUpdate, panelTilt = 25,
    onCamPresetChange, cloudCover = 15, cityBuildings = null, onSelectRoof = null
  } = props;

  const mountRef = useRef(null);
  const { sceneRef, cameraRef, rendererRef, sunLightRef, sunSphereRef, modelsGroupRef } = useThreeScene(mountRef);

  useImperativeHandle(ref, () => ({
    setCameraPreset: (presetId) => {
      const preset = CAMERA_PRESETS.find(p => p.id === presetId);
      if (preset && cameraRef.current) {
        cameraRef.current.position.set(...preset.pos);
        cameraRef.current.lookAt(new THREE.Vector3(...preset.target));
      }
    }
  }));

  useSunLighting({ elevation, azimuth, cloudCover, sunLightRef, sunSphereRef, sceneRef });
  useCanvasInteraction({ mountRef, cameraRef, rendererRef, sceneRef, onCamPresetChange });
  useProceduralWorld({ modelsGroupRef, scenePreset, shadingMode, panelTilt, cityBuildings, onMeshStatsUpdate });
  useRoofRaycaster({ mountRef, cameraRef, modelsGroupRef, onSelectRoof });

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%", height: "100%", position: "absolute",
        top: 0, left: 0, overflow: "hidden", cursor: "grab"
      }}
    />
  );
});

SolarCanvas3D.displayName = "SolarCanvas3D";
export default SolarCanvas3D;
