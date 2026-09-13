import { useEffect, useRef } from "react";
import * as THREE from "three";

export function useThreeScene(mountRef) {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sunLightRef = useRef(null);
  const sunSphereRef = useRef(null);
  const modelsGroupRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.002);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2500);
    camera.position.set(52, 36, 58);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1c1917, 0.9);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 5.0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 5.0;
    sunLight.shadow.camera.far = 480;
    sunLight.shadow.camera.left = -140;
    sunLight.shadow.camera.right = 140;
    sunLight.shadow.camera.top = 140;
    sunLight.shadow.camera.bottom = -140;
    sunLight.shadow.bias = -0.00025;
    sunLight.shadow.radius = 1.4;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(6.5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffd159 }));
    scene.add(sunSphere);
    sunSphereRef.current = sunSphere;

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), new THREE.MeshStandardMaterial({ color: 0x0f141c, roughness: 0.95 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(320, 160, 0x1e293b, 0x0f172a);
    grid.position.y = 0.02;
    scene.add(grid);

    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    return () => {
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [mountRef]);

  return { sceneRef, cameraRef, rendererRef, sunLightRef, sunSphereRef, modelsGroupRef };
}
