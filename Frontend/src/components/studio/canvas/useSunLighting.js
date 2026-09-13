import { useEffect } from "react";
import * as THREE from "three";

export function useSunLighting({ elevation, azimuth, cloudCover, sunLightRef, sunSphereRef, sceneRef }) {
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

    const cloudFactor = Math.max(0.20, 1.0 - (cloudCover / 100) * 0.75);
    sunLightRef.current.intensity *= cloudFactor;
    if (sunLightRef.current.shadow) {
      sunLightRef.current.shadow.radius = 1.2 + (cloudCover / 100) * 2.8;
    }
  }, [elevation, azimuth, cloudCover, sunLightRef, sunSphereRef, sceneRef]);
}
