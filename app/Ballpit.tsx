"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type BallpitProps = {
  className?: string;
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: number[];
  ambientColor?: number;
  ambientIntensity?: number;
  lightIntensity?: number;
  minSize?: number;
  maxSize?: number;
  maxVelocity?: number;
};

/** A lightweight, self-contained Three.js ballpit for atmospheric section backgrounds. */
export function Ballpit({
  className = "",
  count = 96,
  gravity = 0.018,
  friction = 0.992,
  wallBounce = 0.92,
  followCursor = true,
  colors = [0x9da9ad, 0x5c7480, 0x9b6b56, 0x8da8ae],
  ambientColor = 0xdce7ea,
  ambientIntensity = 1.4,
  lightIntensity = 160,
  minSize = 0.16,
  maxSize = 0.42,
  maxVelocity = 0.12,
}: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const host = canvas.parentElement;
    if (!host) return;
    const interactionRoot = host.parentElement?.parentElement ?? host.parentElement ?? host;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 16);

    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    };
    const gl = (canvas.getContext("webgl2", contextAttributes) || canvas.getContext("webgl", contextAttributes)) as
      | WebGL2RenderingContext
      | WebGLRenderingContext
      | null;
    const precision = gl?.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (!gl || !precision) {
      canvas.style.display = "none";
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      canvas.style.display = "none";
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    scene.add(new THREE.AmbientLight(ambientColor, ambientIntensity));
    const keyLight = new THREE.PointLight(colors[0] ?? 0xffffff, lightIntensity, 30, 1.5);
    keyLight.position.set(0, 2, 7);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(colors[2] ?? 0xff8866, lightIntensity * 0.36, 24, 1.8);
    rimLight.position.set(-5, -1, 3);
    scene.add(rimLight);
    const fillLight = new THREE.PointLight(colors[1] ?? 0x88aabb, lightIntensity * 0.58, 26, 1.9);
    fillLight.position.set(4, -2, 4);
    scene.add(fillLight);

    const geometry = new THREE.SphereGeometry(1, 20, 14);
    // Keep each accent color visible even when browser WebGL lighting is reduced.
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.94,
    });
    const balls = new THREE.InstancedMesh(geometry, material, count);
    // Instances move beyond the base geometry bounds as they follow the pointer.
    balls.frustumCulled = false;
    balls.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(balls);

    const dummy = new THREE.Object3D();
    const positions = Array.from({ length: count }, (_, index) => ({
      x: index === 0 ? 0 : THREE.MathUtils.randFloatSpread(11),
      y: index === 0 ? 0 : THREE.MathUtils.randFloatSpread(5.6),
      z: THREE.MathUtils.randFloatSpread(2.4),
    }));
    const velocities = positions.map(() => ({
      x: THREE.MathUtils.randFloatSpread(0.035),
      y: THREE.MathUtils.randFloatSpread(0.035),
      z: THREE.MathUtils.randFloatSpread(0.02),
    }));
    const sizes = positions.map((_, index) => index === 0 ? maxSize * 1.22 : THREE.MathUtils.randFloat(minSize, maxSize));

    positions.forEach((_, index) => {
      balls.setColorAt(index, new THREE.Color(colors[index % Math.max(colors.length, 1)] ?? 0xffffff));
    });
    if (balls.instanceColor) balls.instanceColor.needsUpdate = true;

    const pointer = new THREE.Vector2();
    let pointerActive = false;
    const onPointerMove = (event: PointerEvent) => {
      const rect = interactionRoot.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointerActive = true;
      fallbackRef.current?.style.setProperty("--pointer-x", `${pointer.x * 22}px`);
      fallbackRef.current?.style.setProperty("--pointer-y", `${pointer.y * 16}px`);
    };
    const onPointerLeave = () => {
      pointerActive = false;
      fallbackRef.current?.style.setProperty("--pointer-x", "0px");
      fallbackRef.current?.style.setProperty("--pointer-y", "0px");
    };
    interactionRoot.addEventListener("pointermove", onPointerMove, { passive: true });
    interactionRoot.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    let frame = 0;
    let previous = performance.now();
    let isVisible = true;
    let isPageVisible = document.visibilityState === "visible";
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!isVisible || !isPageVisible) {
        previous = now;
        return;
      }
      const delta = Math.min((now - previous) / 16.67, 2);
      previous = now;

      const targetX = pointer.x * 5.2;
      const targetY = pointer.y * 2.8;
      for (let index = 0; index < count; index += 1) {
        const position = positions[index];
        const velocity = velocities[index];
        const radius = sizes[index];

        if (index === 0 && followCursor && pointerActive) {
          velocity.x += (targetX - position.x) * 0.018 * delta;
          velocity.y += (targetY - position.y) * 0.018 * delta;
        } else {
          velocity.y -= gravity * delta;
        }

        velocity.x *= Math.pow(friction, delta);
        velocity.y *= Math.pow(friction, delta);
        velocity.z *= Math.pow(friction, delta);
        const speed = Math.hypot(velocity.x, velocity.y, velocity.z);
        if (speed > maxVelocity) {
          const scale = maxVelocity / speed;
          velocity.x *= scale;
          velocity.y *= scale;
          velocity.z *= scale;
        }

        position.x += velocity.x * delta;
        position.y += velocity.y * delta;
        position.z += velocity.z * delta;

        const xLimit = 5.8 - radius;
        const yLimit = 3.15 - radius;
        const zLimit = 1.4 - radius;
        if (position.x < -xLimit || position.x > xLimit) {
          position.x = THREE.MathUtils.clamp(position.x, -xLimit, xLimit);
          velocity.x *= -wallBounce;
        }
        if (position.y < -yLimit || position.y > yLimit) {
          position.y = THREE.MathUtils.clamp(position.y, -yLimit, yLimit);
          velocity.y *= -wallBounce;
        }
        if (position.z < -zLimit || position.z > zLimit) {
          position.z = THREE.MathUtils.clamp(position.z, -zLimit, zLimit);
          velocity.z *= -wallBounce;
        }

        dummy.position.set(position.x, position.y, position.z);
        dummy.scale.setScalar(radius);
        dummy.rotation.set(position.y * 0.22, position.x * 0.22, position.z * 0.22);
        dummy.updateMatrix();
        balls.setMatrixAt(index, dummy.matrix);
      }
      balls.instanceMatrix.needsUpdate = true;
      keyLight.position.x += ((pointerActive ? targetX : 0) - keyLight.position.x) * 0.02;
      renderer.render(scene, camera);
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { rootMargin: "180px" });
    visibilityObserver.observe(host);
    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      interactionRoot.removeEventListener("pointermove", onPointerMove);
      interactionRoot.removeEventListener("pointerleave", onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [ambientColor, ambientIntensity, colors, count, followCursor, friction, gravity, lightIntensity, maxSize, maxVelocity, minSize, wallBounce]);

  const starCount = Math.min(Math.max(count, 56), 110);
  return (
    <div ref={fallbackRef} className={`ballpit-fallback ${className}`} aria-hidden="true">
      <span className="ballpit-fallback__planet ballpit-fallback__planet--primary"><span className="ballpit-fallback__planet-surface" /><span className="ballpit-fallback__planet-clouds" /></span>
      <span className="ballpit-fallback__planet ballpit-fallback__planet--secondary"><span className="ballpit-fallback__planet-surface" /><span className="ballpit-fallback__planet-clouds" /></span>
      <span className="ballpit-fallback__orbit ballpit-fallback__orbit--one" />
      <span className="ballpit-fallback__orbit ballpit-fallback__orbit--two" />
      {Array.from({ length: starCount }, (_, index) => {
        const x = (index * 47.3 + 8) % 100;
        const y = (index * 71.7 + 12) % 100;
        const size = 1 + ((index * 13) % 3);
        const color = colors[index % Math.max(colors.length, 1)] ?? 0xffffff;
        const hex = `#${color.toString(16).padStart(6, "0")}`;
        return (
          <span
            key={index}
            className="ballpit-fallback__star"
            style={{
              "--x": `${x}%`,
              "--y": `${y}%`,
              "--size": `${size}px`,
              "--star-color": hex,
              "--depth": `${0.14 + (index % 6) * 0.06}`,
              "--delay": `${(index % 11) * -0.55}s`,
            } as React.CSSProperties}
          />
        );
      })}
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

export default Ballpit;





