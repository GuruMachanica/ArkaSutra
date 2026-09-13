import { useEffect } from "react";
import * as THREE from "three";

export function useCanvasInteraction({ mountRef, cameraRef, rendererRef, sceneRef, onCamPresetChange }) {
  useEffect(() => {
    const mount = mountRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    if (!mount || !camera || !renderer || !scene) return;

    let isDragging = false;
    let isPanning = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = new THREE.Spherical().setFromVector3(camera.position);
    let target = new THREE.Vector3(0, 4, 0);

    const onMouseDown = (e) => {
      if (e.button === 0) isDragging = true;
      if (e.button === 2) isPanning = true;
      prevMouse = { x: e.clientX, y: e.clientY };
      if (onCamPresetChange) onCamPresetChange(null);
    };

    const onMouseMove = (e) => {
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      if (isDragging) {
        spherical.theta -= dx * 0.005;
        spherical.phi = Math.max(0.08, Math.min(Math.PI / 2 - 0.05, spherical.phi - dy * 0.005));
        camera.position.setFromSpherical(spherical).add(target);
        camera.lookAt(target);
      } else if (isPanning) {
        const panSpeed = 0.06;
        const right = new THREE.Vector3().crossVectors(camera.up, camera.getWorldDirection(new THREE.Vector3())).normalize();
        target.addScaledVector(right, dx * panSpeed);
        target.y += dy * panSpeed;
        camera.position.setFromSpherical(spherical).add(target);
        camera.lookAt(target);
      }
    };

    const onMouseUp = () => { isDragging = false; isPanning = false; };
    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(8, Math.min(220, spherical.radius + e.deltaY * 0.06));
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
      if (onCamPresetChange) onCamPresetChange(null);
    };
    const onContextMenu = (e) => e.preventDefault();

    mount.addEventListener("mousedown", onMouseDown);
    mount.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    mount.addEventListener("wheel", onWheel, { passive: false });

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousedown", onMouseDown);
      mount.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("wheel", onWheel);
    };
  }, [mountRef, cameraRef, rendererRef, sceneRef, onCamPresetChange]);
}
