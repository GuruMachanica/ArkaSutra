import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import topologiesData from "../../datasets/topologies_dataset.json";

const CAMERA_PRESETS = [
  { id: "orbit", label: "Neighborhood 3D", pos: [52, 36, 58], target: [0, 4, 0] },
  { id: "top", label: "City Map (2D)", pos: [0, 110, 0.01], target: [0, 0, 0] },
  { id: "close", label: "Rooftop Zoom", pos: [16, 20, 16], target: [0, 9, 0] },
  { id: "street", label: "Street Level", pos: [44, 4.2, 44], target: [0, 5, 0] }
];

const SolarCanvas3D = forwardRef(({
  elevation = 55,
  azimuth = 180,
  shadingMode = "realistic",
  scenePreset = "commercial",
  onMeshStatsUpdate,
  panelTilt = 25,
  activeCamPreset = "orbit",
  onCamPresetChange
}, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const sunLightRef = useRef(null);
  const sunSphereRef = useRef(null);
  const modelsGroupRef = useRef(null);
  const solarPanelsRef = useRef([]);

  useImperativeHandle(ref, () => ({
    setCameraPreset: (presetId) => {
      const preset = CAMERA_PRESETS.find(p => p.id === presetId);
      if (preset && cameraRef.current) {
        cameraRef.current.position.set(...preset.pos);
        cameraRef.current.lookAt(new THREE.Vector3(...preset.target));
      }
    }
  }));

  // 1. Scene, Camera, WebGL Renderer
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.005);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2500);
    camera.position.set(52, 36, 58);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1c1917, 0.9);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 5.0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 2.0;
    sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -90;
    sunLight.shadow.camera.right = 90;
    sunLight.shadow.camera.top = 90;
    sunLight.shadow.camera.bottom = -90;
    sunLight.shadow.bias = -0.00025;
    sunLight.shadow.radius = 1.4;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const sunGeo = new THREE.SphereGeometry(3.6, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd159 });
    const sunSphere = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunSphere);
    sunSphereRef.current = sunSphere;

    const groundGeo = new THREE.PlaneGeometry(320, 320);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f141c,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(320, 160, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    let isDragging = false;
    let isPanning = false;
    let previousMousePosition = { x: 0, y: 0 };
    let theta = Math.PI / 4.2;
    let phi = Math.PI / 4.8;
    let radius = 84;
    let target = new THREE.Vector3(0, 4, 0);

    const updateCameraPos = () => {
      camera.position.x = target.x + radius * Math.sin(theta) * Math.cos(phi);
      camera.position.y = target.y + radius * Math.sin(phi);
      camera.position.z = target.z + radius * Math.cos(theta) * Math.cos(phi);
      camera.lookAt(target);
    };
    updateCameraPos();

    const onMouseDown = (e) => {
      if (e.button === 0) isDragging = true;
      if (e.button === 2) isPanning = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (isDragging) {
        theta -= deltaX * 0.0045;
        phi = Math.max(0.06, Math.min(Math.PI / 2 - 0.03, phi + deltaY * 0.0045));
        updateCameraPos();
      } else if (isPanning) {
        const panSpeed = 0.055;
        target.x -= deltaX * panSpeed;
        target.z -= deltaY * panSpeed;
        updateCameraPos();
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      isPanning = false;
    };

    const onWheel = (e) => {
      radius = Math.max(10, Math.min(220, radius + e.deltaY * 0.04));
      updateCameraPos();
    };

    const onContextMenu = (e) => e.preventDefault();

    currentMount.addEventListener("mousedown", onMouseDown);
    currentMount.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    currentMount.addEventListener("wheel", onWheel, { passive: true });

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      currentMount.removeEventListener("mousedown", onMouseDown);
      currentMount.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      currentMount.removeEventListener("wheel", onWheel);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 2. Solar Ray Tracing & Celestial Arc Coordinates
  useEffect(() => {
    if (!sunLightRef.current || !sunSphereRef.current || !sceneRef.current) return;

    const radElev = (elevation * Math.PI) / 180;
    const radAzim = (azimuth * Math.PI) / 180;
    const dist = 88;

    const x = dist * Math.cos(radElev) * Math.sin(radAzim);
    const y = Math.max(1.8, dist * Math.sin(radElev));
    const z = dist * Math.cos(radElev) * Math.cos(radAzim);

    sunLightRef.current.position.set(x, y, z);
    sunSphereRef.current.position.set(x * 1.05, y * 1.05, z * 1.05);

    if (elevation < 12) {
      sceneRef.current.background = new THREE.Color(0x180c06);
      sceneRef.current.fog.color = new THREE.Color(0x180c06);
      sunLightRef.current.color.setHex(0xff4400);
      sunLightRef.current.intensity = 2.4;
    } else if (elevation < 32) {
      sceneRef.current.background = new THREE.Color(0x0c1524);
      sceneRef.current.fog.color = new THREE.Color(0x0c1524);
      sunLightRef.current.color.setHex(0xff9922);
      sunLightRef.current.intensity = 3.8;
    } else {
      sceneRef.current.background = new THREE.Color(0x080d1a);
      sceneRef.current.fog.color = new THREE.Color(0x080d1a);
      sunLightRef.current.color.setHex(0xfffaed);
      sunLightRef.current.intensity = 5.2;
    }
  }, [elevation, azimuth]);

  // 3. Dense Procedural Real-World Architecture Generator
  useEffect(() => {
    if (!modelsGroupRef.current) return;
    const group = modelsGroupRef.current;

    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    solarPanelsRef.current = [];

    const getBuildingMat = (color = 0x334155, roughness = 0.65, metalness = 0.25) => {
      if (shadingMode === "heatmap") return new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5, metalness: 0.2 });
      if (shadingMode === "occlusion") return new THREE.MeshStandardMaterial({ color: 0x242424, roughness: 0.95 });
      if (shadingMode === "wireframe") return new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true });
      return new THREE.MeshStandardMaterial({ color, roughness, metalness });
    };

    const glassCurtainMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.85
    });

    const asphaltRoadMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.95,
      metalness: 0.05
    });

    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
      metalness: 0.1
    });

    const roadMarkingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.9
    });

    const getSolarPanelMat = () => {
      if (shadingMode === "heatmap") {
        return new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.7 });
      }
      if (shadingMode === "occlusion") return new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      if (shadingMode === "wireframe") return new THREE.MeshBasicMaterial({ color: 0xfbbf24, wireframe: true });
      return new THREE.MeshStandardMaterial({
        color: 0x050c18,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.35,
        roughness: 0.1,
        metalness: 0.92
      });
    };

    const addDetailedTree = (x, z, scale = 1.0) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25 * scale, 0.38 * scale, 2.2 * scale, 8),
        new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 })
      );
      trunk.position.set(x, 1.1 * scale, z);
      trunk.castShadow = true;
      group.add(trunk);

      const f1 = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.4 * scale, 1),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
      );
      f1.position.set(x, 2.6 * scale, z);
      f1.castShadow = true;
      group.add(f1);

      const f2 = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.0 * scale, 1),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.85 })
      );
      f2.position.set(x, 3.4 * scale, z);
      f2.castShadow = true;
      group.add(f2);
    };

    const addDetailedVehicle = (x, z, rotY = 0, color = 0x3b82f6) => {
      const carGroup = new THREE.Group();
      carGroup.position.set(x, 0, z);
      carGroup.rotation.y = rotY;

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(3.8, 0.85, 1.8),
        new THREE.MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.8 })
      );
      body.position.y = 0.55;
      body.castShadow = true;
      carGroup.add(body);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.65, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.95 })
      );
      cabin.position.set(-0.2, 1.25, 0);
      cabin.castShadow = true;
      carGroup.add(cabin);

      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
      [[-1.2, 0.9], [1.2, 0.9], [-1.2, -0.9], [1.2, -0.9]].forEach(([wx, wz]) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 12), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.35, wz);
        wheel.castShadow = true;
        carGroup.add(wheel);
      });

      group.add(carGroup);
    };

    const addStreetlight = (x, z, rotY = 0) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.14, 5.5, 8),
        getBuildingMat(0x64748b, 0.4, 0.7)
      );
      pole.position.set(x, 2.75, z);
      pole.castShadow = true;
      group.add(pole);

      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.12, 0.12),
        getBuildingMat(0x64748b, 0.4, 0.7)
      );
      arm.position.set(x + 0.5 * Math.cos(rotY), 5.4, z + 0.5 * Math.sin(rotY));
      arm.rotation.y = rotY;
      group.add(arm);

      const lamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, 0.2),
        new THREE.MeshBasicMaterial({ color: 0xfffbeb })
      );
      lamp.position.set(x + 1.0 * Math.cos(rotY), 5.3, z + 1.0 * Math.sin(rotY));
      group.add(lamp);
    };

    const addRoad = (centerX, centerZ, width, length, isHorizontal = true) => {
      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(isHorizontal ? length : width, isHorizontal ? width : length),
        asphaltRoadMat
      );
      road.position.set(centerX, 0.03, centerZ);
      road.rotation.x = -Math.PI / 2;
      road.receiveShadow = true;
      group.add(road);

      const curb1 = new THREE.Mesh(
        new THREE.BoxGeometry(isHorizontal ? length : 1.2, 0.2, isHorizontal ? 1.2 : length),
        sidewalkMat
      );
      curb1.position.set(
        isHorizontal ? centerX : centerX - width / 2 - 0.6,
        0.1,
        isHorizontal ? centerZ - width / 2 - 0.6 : centerZ
      );
      curb1.receiveShadow = true;
      group.add(curb1);

      const curb2 = new THREE.Mesh(
        new THREE.BoxGeometry(isHorizontal ? length : 1.2, 0.2, isHorizontal ? 1.2 : length),
        sidewalkMat
      );
      curb2.position.set(
        isHorizontal ? centerX : centerX + width / 2 + 0.6,
        0.1,
        isHorizontal ? centerZ + width / 2 + 0.6 : centerZ
      );
      curb2.receiveShadow = true;
      group.add(curb2);

      const segCount = Math.floor(length / 4);
      for (let i = 0; i < segCount; i++) {
        const mark = new THREE.Mesh(
          new THREE.PlaneGeometry(isHorizontal ? 2.0 : 0.25, isHorizontal ? 0.25 : 2.0),
          roadMarkingMat
        );
        const offset = -length / 2 + i * 4 + 2;
        mark.position.set(
          isHorizontal ? centerX + offset : centerX,
          0.04,
          isHorizontal ? centerZ : centerZ + offset
        );
        mark.rotation.x = -Math.PI / 2;
        group.add(mark);
      }
    };

    const addSolarArray = (startX, startZ, rows, cols, panelW, panelD, roofY, baseTiltRad = 0) => {
      const activeTilt = baseTiltRad !== 0 ? baseTiltRad : (panelTilt * Math.PI) / 180;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const panelGeo = new THREE.BoxGeometry(panelW, 0.12, panelD);
          const panelMesh = new THREE.Mesh(panelGeo, getSolarPanelMat());
          panelMesh.position.set(
            startX + c * (panelW + 0.32),
            roofY + 0.2 + Math.sin(activeTilt) * (r * panelD * 0.4),
            startZ + r * (panelD + 0.32)
          );
          panelMesh.rotation.x = activeTilt;
          panelMesh.castShadow = true;
          panelMesh.receiveShadow = true;
          group.add(panelMesh);
          solarPanelsRef.current.push(panelMesh);

          const strut = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.35, 6),
            getBuildingMat(0x94a3b8, 0.3, 0.8)
          );
          strut.position.set(panelMesh.position.x, roofY + 0.1, panelMesh.position.z);
          group.add(strut);
        }
      }
    };

    const topo = topologiesData.topologies[scenePreset] || topologiesData.topologies.commercial;

    // =========================================================================
    // 1. COMMERCIAL TECH & LOGISTICS CAMPUS (Massive Expansion)
    // =========================================================================
    if (scenePreset === "commercial") {
      addRoad(0, 32, 10, 160, true);
      addRoad(-42, 0, 9, 110, false);
      addRoad(46, 0, 9, 110, false);
      addRoad(0, -42, 8, 160, true);

      // Main HQ Building (Multi-tiered Corporate Tower)
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(26, 18, 22), getBuildingMat(0x0f172a));
      b1.position.set(-12, 9, -4);
      b1.castShadow = true;
      b1.receiveShadow = true;
      group.add(b1);

      const glass1 = new THREE.Mesh(new THREE.BoxGeometry(26.3, 14, 22.3), glassCurtainMat);
      glass1.position.set(-12, 10, -4);
      group.add(glass1);

      // Chiller Units
      [[-20, 3], [-4, 3], [-20, -9], [-4, -9]].forEach(([hx, hz]) => {
        const hvac = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 3), getBuildingMat(0x64748b));
        hvac.position.set(hx, 19, hz);
        hvac.castShadow = true;
        group.add(hvac);
      });

      addSolarArray(-22, -12, 8, 8, 2.0, 1.4, 18.3);

      // Logistics Distribution Wing
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(24, 10, 26), getBuildingMat(0x1e293b));
      b2.position.set(18, 5, -4);
      b2.castShadow = true;
      b2.receiveShadow = true;
      group.add(b2);

      const glass2 = new THREE.Mesh(new THREE.BoxGeometry(24.3, 6, 26.3), glassCurtainMat);
      glass2.position.set(18, 6, -4);
      group.add(glass2);

      addSolarArray(8, -15, 8, 6, 2.0, 1.5, 10.3);

      // Skybridge
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(8, 2.8, 3.5), glassCurtainMat);
      bridge.position.set(3, 8.5, -4);
      group.add(bridge);

      // R&D Innovation Hub
      const b3 = new THREE.Mesh(new THREE.BoxGeometry(20, 14, 16), getBuildingMat(0x1e293b));
      b3.position.set(-12, 7, -28);
      b3.castShadow = true;
      b3.receiveShadow = true;
      group.add(b3);

      addSolarArray(-18, -34, 5, 6, 2.0, 1.4, 14.3);

      // Data Center Facility
      const b4 = new THREE.Mesh(new THREE.BoxGeometry(22, 11, 16), getBuildingMat(0x0f172a));
      b4.position.set(18, 5.5, -28);
      b4.castShadow = true;
      b4.receiveShadow = true;
      group.add(b4);

      addSolarArray(10, -34, 4, 7, 2.0, 1.4, 11.3);

      // 6 Photovoltaic Carports
      [-28, -18, -8, 4, 14, 24].forEach((cpX) => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 3.5, 8), getBuildingMat(0x94a3b8));
        pole.position.set(cpX, 1.75, 18);
        pole.castShadow = true;
        group.add(pole);

        const canopy = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.15, 6.4), getSolarPanelMat());
        canopy.position.set(cpX, 3.6, 18);
        canopy.rotation.x = -0.22;
        canopy.castShadow = true;
        canopy.receiveShadow = true;
        group.add(canopy);

        addDetailedVehicle(cpX, 18, 1.57, [0xef4444, 0x3b82f6, 0xffffff, 0x10b981, 0xf59e0b, 0x8b5cf6][Math.abs(cpX) % 6]);
      });

      // Driving Traffic
      addDetailedVehicle(14, 32, 0, 0xf59e0b);
      addDetailedVehicle(-18, 32, Math.PI, 0x3b82f6);
      addDetailedVehicle(-42, 10, 1.57, 0xef4444);
      addDetailedVehicle(46, -10, -1.57, 0x10b981);

      // Plaza Water Fountain & Trees
      const fountain = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.8, 0.8, 16), getBuildingMat(0x475569));
      fountain.position.set(3, 0.4, 6);
      group.add(fountain);

      const water = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 0.7, 16), waterMat);
      water.position.set(3, 0.5, 6);
      group.add(water);

      for (let tx = -38; tx <= 42; tx += 10) {
        addDetailedTree(tx, 26, 1.1);
        addDetailedTree(tx, -38, 1.2);
        addStreetlight(tx, 28, Math.PI / 2);
      }
    }

    // =========================================================================
    // 2. METROPOLITAN HIGH-RISE DISTRICT (16 Skyscraper Towers)
    // =========================================================================
    else if (scenePreset === "highrise") {
      addRoad(0, 0, 12, 180, true);
      addRoad(0, 0, 12, 180, false);
      addRoad(0, 52, 9, 180, true);
      addRoad(0, -52, 9, 180, true);
      addRoad(52, 0, 9, 180, false);
      addRoad(-52, 0, 9, 180, false);

      const skyscrapers = [
        { x: -24, z: -24, w: 16, d: 16, h: 54, color: 0x0f172a, glassH: 46, crown: true },
        { x: 24, z: -24, w: 14, d: 14, h: 44, color: 0x1e293b, glassH: 38, heli: true },
        { x: -24, z: 24, w: 15, d: 15, h: 48, color: 0x334155, glassH: 42, heli: true },
        { x: 24, z: 24, w: 16, d: 16, h: 58, color: 0x0f172a, glassH: 50, crown: true },
        { x: -48, z: -24, w: 12, d: 12, h: 32, color: 0x1e293b, glassH: 26 },
        { x: 48, z: -24, w: 13, d: 13, h: 36, color: 0x334155, glassH: 30 },
        { x: -48, z: 24, w: 12, d: 12, h: 28, color: 0x1e293b, glassH: 22 },
        { x: 48, z: 24, w: 14, d: 14, h: 34, color: 0x0f172a, glassH: 28 },
        { x: -24, z: -48, w: 13, d: 13, h: 38, color: 0x334155, glassH: 32 },
        { x: 24, z: -48, w: 12, d: 12, h: 30, color: 0x1e293b, glassH: 24 },
        { x: -24, z: 48, w: 14, d: 14, h: 36, color: 0x0f172a, glassH: 30 },
        { x: 24, z: 48, w: 13, d: 13, h: 40, color: 0x334155, glassH: 34 },
        { x: -48, z: -48, w: 11, d: 11, h: 24, color: 0x1e293b, glassH: 18 },
        { x: 48, z: -48, w: 11, d: 11, h: 26, color: 0x0f172a, glassH: 20 },
        { x: -48, z: 48, w: 10, d: 10, h: 22, color: 0x334155, glassH: 16 },
        { x: 48, z: 48, w: 12, d: 12, h: 28, color: 0x1e293b, glassH: 22 }
      ];

      skyscrapers.forEach((t) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(t.w, t.h, t.d), getBuildingMat(t.color));
        b.position.set(t.x, t.h / 2, t.z);
        b.castShadow = true;
        b.receiveShadow = true;
        group.add(b);

        const g = new THREE.Mesh(new THREE.BoxGeometry(t.w + 0.25, t.glassH, t.d + 0.25), glassCurtainMat);
        g.position.set(t.x, t.h / 2, t.z);
        group.add(g);

        addSolarArray(t.x - t.w / 2 + 1.8, t.z - t.d / 2 + 1.8, 3, 3, 2.0, 1.5, t.h + 0.2);

        if (t.heli) {
          const pad = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.0, 0.2, 16), getBuildingMat(0xffd159));
          pad.position.set(t.x, t.h + 0.15, t.z);
          group.add(pad);
        }

        if (t.crown) {
          const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.5, 12, 8), getBuildingMat(0xffffff, 0.2, 0.9));
          spire.position.set(t.x, t.h + 6, t.z);
          spire.castShadow = true;
          group.add(spire);

          const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
          beacon.position.set(t.x, t.h + 12.2, t.z);
          group.add(beacon);
        }
      });

      // Skybridges
      const sb1 = new THREE.Mesh(new THREE.BoxGeometry(16, 3.2, 3.0), glassCurtainMat);
      sb1.position.set(0, 32, -24);
      group.add(sb1);

      const sb2 = new THREE.Mesh(new THREE.BoxGeometry(16, 3.2, 3.0), glassCurtainMat);
      sb2.position.set(0, 36, 24);
      group.add(sb2);

      // Heavy Traffic Flow
      addDetailedVehicle(-36, 0, 1.57, 0xef4444);
      addDetailedVehicle(18, 0, 1.57, 0x3b82f6);
      addDetailedVehicle(0, -32, 0, 0xf59e0b);
      addDetailedVehicle(0, 36, Math.PI, 0x10b981);
      addDetailedVehicle(36, 52, 1.57, 0xffffff);
      addDetailedVehicle(-24, -52, -1.57, 0x9333ea);

      // Plazas & Streetlights
      [-40, -20, 20, 40].forEach((px) => {
        addStreetlight(px, 8, 0);
        addStreetlight(px, -8, Math.PI);
        addDetailedTree(px, 12, 1.0);
        addDetailedTree(px, -12, 1.0);
      });
    }

    // =========================================================================
    // 3. SUBURBAN RESIDENTIAL VILLAGE (16 Detailed Eco-Villas)
    // =========================================================================
    else if (scenePreset === "residential") {
      addRoad(0, 0, 8.5, 160, true);
      addRoad(-46, 0, 7.5, 90, false);
      addRoad(46, 0, 7.5, 90, false);
      addRoad(0, 42, 7.5, 160, true);
      addRoad(0, -42, 7.5, 160, true);

      const villageHomes = [
        // North Row 1
        { x: -34, z: -18, roofRot: 0, wallColor: 0x334155, roofColor: 0x991b1b },
        { x: -18, z: -18, roofRot: 0, wallColor: 0x1e293b, roofColor: 0x0f172a },
        { x: 0, z: -18, roofRot: 0, wallColor: 0x334155, roofColor: 0x1e3a8a },
        { x: 18, z: -18, roofRot: 0, wallColor: 0x1e293b, roofColor: 0x991b1b },
        { x: 34, z: -18, roofRot: 0, wallColor: 0x334155, roofColor: 0x0f172a },
        // South Row 1
        { x: -34, z: 18, roofRot: Math.PI, wallColor: 0x1e293b, roofColor: 0x0f172a },
        { x: -18, z: 18, roofRot: Math.PI, wallColor: 0x334155, roofColor: 0x1e3a8a },
        { x: 0, z: 18, roofRot: Math.PI, wallColor: 0x1e293b, roofColor: 0x991b1b },
        { x: 18, z: 18, roofRot: Math.PI, wallColor: 0x334155, roofColor: 0x0f172a },
        { x: 34, z: 18, roofRot: Math.PI, wallColor: 0x1e293b, roofColor: 0x1e3a8a },
        // Outer Rows
        { x: -28, z: -58, roofRot: 0, wallColor: 0x334155, roofColor: 0x991b1b },
        { x: 0, z: -58, roofRot: 0, wallColor: 0x1e293b, roofColor: 0x0f172a },
        { x: 28, z: -58, roofRot: 0, wallColor: 0x334155, roofColor: 0x1e3a8a },
        { x: -28, z: 58, roofRot: Math.PI, wallColor: 0x1e293b, roofColor: 0x991b1b },
        { x: 0, z: 58, roofRot: Math.PI, wallColor: 0x334155, roofColor: 0x0f172a },
        { x: 28, z: 58, roofRot: Math.PI, wallColor: 0x1e293b, roofColor: 0x1e3a8a }
      ];

      villageHomes.forEach((home) => {
        const homeGroup = new THREE.Group();
        homeGroup.position.set(home.x, 0, home.z);
        homeGroup.rotation.y = home.roofRot;

        const base = new THREE.Mesh(new THREE.BoxGeometry(10.5, 4.5, 10.5), getBuildingMat(home.wallColor));
        base.position.y = 2.25;
        base.castShadow = true;
        base.receiveShadow = true;
        homeGroup.add(base);

        const door = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 0.2), getBuildingMat(0x3e2723));
        door.position.set(0, 1.2, 5.3);
        homeGroup.add(door);

        const win1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 0.2), glassCurtainMat);
        win1.position.set(-3.0, 2.4, 5.3);
        homeGroup.add(win1);

        const win2 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.5, 0.2), glassCurtainMat);
        win2.position.set(3.0, 2.4, 5.3);
        homeGroup.add(win2);

        const roof = new THREE.Mesh(new THREE.ConeGeometry(8.5, 4.2, 4), getBuildingMat(home.roofColor));
        roof.position.y = 6.4;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        roof.receiveShadow = true;
        homeGroup.add(roof);

        const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.6, 0.9), getBuildingMat(0x78350f));
        chimney.position.set(2.4, 6.8, 1.6);
        chimney.castShadow = true;
        homeGroup.add(chimney);

        addSolarArray(home.x - 3.2, home.z + (home.roofRot === 0 ? 1.6 : -1.6), 2, 3, 1.8, 1.3, 5.5, -0.42);

        const pool = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.3, 3.4), waterMat);
        pool.position.set(home.x + 0.6, 0.15, home.z - 8.2);
        group.add(pool);

        group.add(homeGroup);
      });

      // Driveway Cars
      addDetailedVehicle(-34, -10, 0, 0xef4444);
      addDetailedVehicle(0, -10, 0, 0x3b82f6);
      addDetailedVehicle(34, -10, 0, 0xffffff);
      addDetailedVehicle(-18, 10, Math.PI, 0x10b981);
      addDetailedVehicle(18, 10, Math.PI, 0xf59e0b);
      addDetailedVehicle(0, 0, 1.57, 0x9333ea);

      // Village Trees & Green Belts
      for (let tx = -44; tx <= 44; tx += 8) {
        addDetailedTree(tx, -30, 1.15);
        addDetailedTree(tx, 30, 1.2);
        addStreetlight(tx, -6, Math.PI / 2);
      }
    }

    // =========================================================================
    // 4. UTILITY SOLAR TRACKER MATRIX & SUBSTATION (64 Tracker Arrays)
    // =========================================================================
    else {
      addRoad(0, 0, 9, 160, true);
      addRoad(0, 0, 9, 120, false);

      // 8x8 Tracker Matrix Grid
      for (let x = -48; x <= 48; x += 13) {
        if (Math.abs(x) < 5) continue;
        for (let z = -42; z <= 42; z += 11) {
          if (Math.abs(z) < 5) continue;

          const tube = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 7.2, 8),
            getBuildingMat(0x64748b, 0.3, 0.8)
          );
          tube.rotation.z = Math.PI / 2;
          tube.position.set(x, 1.5, z);
          tube.castShadow = true;
          group.add(tube);

          [-2.8, 0, 2.8].forEach((px) => {
            const leg = new THREE.Mesh(
              new THREE.CylinderGeometry(0.12, 0.15, 1.5, 8),
              getBuildingMat(0x94a3b8, 0.3, 0.8)
            );
            leg.position.set(x + px, 0.75, z);
            leg.castShadow = true;
            group.add(leg);
          });

          const panel = new THREE.Mesh(
            new THREE.BoxGeometry(7.2, 0.14, 4.6),
            getSolarPanelMat()
          );
          panel.position.set(x, 1.75, z);
          panel.rotation.x = -((panelTilt * Math.PI) / 180);
          panel.castShadow = true;
          panel.receiveShadow = true;
          group.add(panel);
          solarPanelsRef.current.push(panel);
        }
      }

      // Central High-Voltage Substation Complex
      const subGroup = new THREE.Group();
      subGroup.position.set(0, 0, 48);

      const subPad = new THREE.Mesh(new THREE.BoxGeometry(22, 0.4, 16), getBuildingMat(0x475569));
      subPad.position.y = 0.2;
      subGroup.add(subPad);

      [-6, 6].forEach((tx) => {
        const transformer = new THREE.Mesh(new THREE.BoxGeometry(5, 4.5, 5), getBuildingMat(0x1e293b));
        transformer.position.set(tx, 2.5, 0);
        transformer.castShadow = true;
        subGroup.add(transformer);
      });

      const gantry = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 1.2), getBuildingMat(0x94a3b8, 0.3, 0.8));
      gantry.position.set(0, 4.5, -4.5);
      gantry.castShadow = true;
      subGroup.add(gantry);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 14, 8), getBuildingMat(0xffffff));
      mast.position.set(-24, 7, 48);
      mast.castShadow = true;
      group.add(mast);

      const anemometer = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      anemometer.position.set(-24, 14.2, 48);
      group.add(anemometer);

      addDetailedVehicle(-8, 0, 1.57, 0xf59e0b);
      addDetailedVehicle(8, 0, 1.57, 0xffffff);

      group.add(subGroup);
    }

    if (onMeshStatsUpdate) {
      onMeshStatsUpdate({
        totalRooftopArea: topo.totalRoofArea,
        panelsCount: topo.pvPanelCount,
        systemCapacityKwp: topo.systemCapacityKwp,
        annualGenerationKwh: topo.annualGenerationKwh,
        annualSavingsUsd: topo.annualSavingsUsd,
        co2OffsetTons: topo.co2OffsetTons,
        location: topo.location,
        climateZone: topo.climateZone,
        annualGhi: topo.annualGhi,
        name: topo.name
      });
    }
  }, [scenePreset, shadingMode, panelTilt]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />

      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        zIndex: 10,
        background: "rgba(9, 13, 22, 0.8)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "8px 16px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        color: "#94a3b8",
        pointerEvents: "none",
        fontFamily: "monospace"
      }}>
        <strong style={{ color: "#f59e0b" }}>Left-Click:</strong> Orbit • <strong style={{ color: "#f59e0b" }}>Right-Click:</strong> Pan • <strong style={{ color: "#f59e0b" }}>Scroll:</strong> Zoom
      </div>
    </div>
  );
});

export default SolarCanvas3D;
