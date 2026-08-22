"use client";

import { useEffect, useState } from "react";

type GalaxyComponent = typeof import("./Galaxy")["default"];

export default function DeferredGalaxy() {
  const [Galaxy, setGalaxy] = useState<GalaxyComponent | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void import("./Galaxy").then((module) => {
        if (!cancelled) setGalaxy(() => module.default);
      });
    };

    const idleId = "requestIdleCallback" in window
      ? window.requestIdleCallback(load, { timeout: 900 })
      : window.setTimeout(load, 350);

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, []);

  if (!Galaxy) return <div className="hero-galaxy-fallback" aria-hidden="true" />;

  return (
    <Galaxy
      focal={[0.62, 0.46]}
      rotation={[0.98, 0.04]}
      starSpeed={0.32}
      density={0.86}
      hueShift={190}
      speed={0.7}
      glowIntensity={0.72}
      saturation={0.24}
      twinkleIntensity={0.52}
      rotationSpeed={0.035}
      repulsionStrength={1.35}
      transparent
    />
  );
}
