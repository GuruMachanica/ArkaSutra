import { useEffect, useRef } from "react";
import * as THREE from "three";

export function useSunLighting({ elevation, azimuth, cloudCover, sunLightRef, sunSphereRef, sceneRef }) {
  const sunArcRef = useRef(null);

  useEffect(() => {
    if (!sunLightRef.current || !sunSphereRef.current || !sceneRef.current) return;

    const radElev = (elevation * Math.PI) / 180;
    const radAzim = (azimuth * Math.PI) / 180;
    const dist = 185;

    const x = dist * Math.cos(radElev) * Math.sin(radAzim);
    const y = Math.max(1.8, dist * Math.sin(radElev));
    const z = dist * Math.cos(radElev) * Math.cos(radAzim);

    sunLightRef.current.position.set(x, y, z);
    sunSphereRef.current.position.set(x * 1.02, y * 1.02, z * 1.02);

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

    const cloudFactor = Math.max(0.20, 1.0 - (cloudCover / 100) * 0.75);
    sunLightRef.current.intensity *= cloudFactor;
    if (sunLightRef.current.shadow) {
      sunLightRef.current.shadow.radius = 1.2 + (cloudCover / 100) * 2.8;
    }

    if (!sunArcRef.current && sceneRef.current) {
      const pts = [];
      for (let a = 60; a <= 300; a += 4) {
        const radA = (a * Math.PI) / 180;
        const e = Math.max(0.02, Math.sin((a - 60) * (Math.PI / 240)) * Math.sin(radElev > 0 ? radElev : 0.8));
        pts.push(new THREE.Vector3(dist * Math.cos(e) * Math.sin(radA), dist * Math.sin(e), dist * Math.cos(e) * Math.cos(radA)));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.35 });
      const arc = new THREE.Line(geom, mat);
      sceneRef.current.add(arc);
      sunArcRef.current = arc;
    }

    return () => {
      if (sunArcRef.current && sceneRef.current) {
        sceneRef.current.remove(sunArcRef.current);
        sunArcRef.current.geometry.dispose();
        sunArcRef.current.material.dispose();
        sunArcRef.current = null;
      }
    };
  }, [elevation, azimuth, cloudCover, sunLightRef, sunSphereRef, sceneRef]);
}
