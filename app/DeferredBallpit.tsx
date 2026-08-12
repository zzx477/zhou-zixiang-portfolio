"use client";

import { useEffect, useRef, useState } from "react";

type BallpitComponent = typeof import("./Ballpit")["default"];

const ballpitProps = {
  count: 84,
  gravity: 0.012,
  friction: 0.994,
  wallBounce: 0.94,
  followCursor: true,
  colors: [0xbfd9df, 0x7696a1, 0xd18a6a, 0xaeb9b7, 0x9bb7bd],
  ambientColor: 0xe7f2f3,
  ambientIntensity: 1.75,
  lightIntensity: 300,
  minSize: 0.14,
  maxSize: 0.36,
  maxVelocity: 0.1,
};

export default function DeferredBallpit() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [Component, setComponent] = useState<BallpitComponent | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const load = () => {
      void import("./Ballpit").then((module) => {
        if (!cancelled) setComponent(() => module.default);
      });
    };

    if (!("IntersectionObserver" in window)) {
      load();
      return () => { cancelled = true; };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      load();
    }, { rootMargin: "0px" });
    observer.observe(host);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={hostRef} className="deferred-ballpit">
      {Component ? <Component {...ballpitProps} /> : <div className="deferred-ballpit__fallback" aria-hidden="true" />}
    </div>
  );
}
