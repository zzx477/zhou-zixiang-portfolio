"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./TargetCursor.css";

type TargetCursorProps = {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  cursorColor?: string;
  cursorColorOnTarget?: string;
};

export default function TargetCursor({
  targetSelector = ".cursor-target",
  spinDuration = 6,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  cursorColor = "#c7a5ff",
  cursorColorOnTarget = "#e7c4ff",
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLElement | null>(null);
  const lastPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 768;
    if (isTouch) return;

    const corners = Array.from(cursor.querySelectorAll<HTMLElement>(".target-cursor-corner"));
    const idlePositions = [{ x: -21, y: -21 }, { x: 7, y: -21 }, { x: 7, y: 7 }, { x: -21, y: 7 }];
    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) document.body.style.cursor = "none";

    const moveTo = (x: number, y: number) => {
      lastPoint.current = { x, y };
      gsap.to(cursor, { x, y, duration: 0.12, ease: "power3.out", overwrite: "auto" });
      const target = activeRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const positions = [
        { x: rect.left - x - 4, y: rect.top - y - 4 },
        { x: rect.right - x + 2, y: rect.top - y - 4 },
        { x: rect.right - x + 2, y: rect.bottom - y + 2 },
        { x: rect.left - x - 4, y: rect.bottom - y + 2 },
      ];
      corners.forEach((corner, index) => gsap.to(corner, { ...positions[index], duration: hoverDuration, ease: "power2.out", overwrite: "auto" }));
    };

    const resetTarget = () => {
      activeRef.current = null;
      corners.forEach((corner, index) => gsap.to(corner, { ...idlePositions[index], duration: 0.26, ease: "power3.out", overwrite: "auto" }));
      gsap.to(corners, { borderColor: cursorColor, duration: 0.16, overwrite: "auto" });
      gsap.to(dot, { backgroundColor: cursorColor, duration: 0.16, overwrite: "auto" });
      gsap.to(cursor, { scale: 1, duration: 0.2, overwrite: "auto" });
      spinState.angle = 0;
      corners.forEach((corner, index) => gsap.set(corner, { ...idlePositions[index], rotation: 0 }));
      cornerSpin.restart();
    };

    const onMove = (event: MouseEvent) => moveTo(event.clientX, event.clientY);
    const onOver = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest(targetSelector) as HTMLElement | null;
      if (!target || activeRef.current === target) return;
      cornerSpin.pause();
      activeRef.current = target;
      const rect = target.getBoundingClientRect();
      moveTo(lastPoint.current.x || event.clientX, lastPoint.current.y || event.clientY);
      const x = lastPoint.current.x || event.clientX;
      const y = lastPoint.current.y || event.clientY;
      const positions = [
        { x: rect.left - x - 4, y: rect.top - y - 4 },
        { x: rect.right - x + 2, y: rect.top - y - 4 },
        { x: rect.right - x + 2, y: rect.bottom - y + 2 },
        { x: rect.left - x - 4, y: rect.bottom - y + 2 },
      ];
      corners.forEach((corner, index) => gsap.to(corner, { ...positions[index], duration: hoverDuration, ease: "power2.out", overwrite: "auto" }));
      gsap.to(corners, { borderColor: cursorColorOnTarget, duration: 0.16, overwrite: "auto" });
      gsap.to(dot, { backgroundColor: cursorColorOnTarget, duration: 0.16, overwrite: "auto" });
      gsap.to(cursor, { scale: 1.08, duration: hoverDuration, ease: "power2.out", overwrite: "auto" });
    };
    const onOut = (event: MouseEvent) => {
      const target = activeRef.current;
      if (target && event.relatedTarget instanceof Node && !target.contains(event.relatedTarget)) resetTarget();
    };
    const onDown = (event: MouseEvent) => {
      gsap.to(dot, { scale: 0.55, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
      gsap.to(cursor, { scale: 0.88, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" });
      const target = (event.target as Element | null)?.closest(targetSelector) as HTMLElement | null;
      if (target) gsap.fromTo(target, { scale: 0.975 }, { scale: 1, duration: 0.42, ease: "back.out(2.4)", overwrite: "auto" });
    };
    const onResize = () => { if (!activeRef.current) return; moveTo(lastPoint.current.x, lastPoint.current.y); };

    gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2, xPercent: -50, yPercent: -50, rotation: 0 });
    corners.forEach((corner, index) => gsap.set(corner, { ...idlePositions[index], rotation: 0, backgroundColor: "transparent", transformOrigin: "center center" }));
    const spinState = { angle: 0 };
    const cornerSpin = gsap.to(spinState, { angle: 360, duration: spinDuration, ease: "none", repeat: -1, onUpdate: () => {
      corners.forEach((corner) => gsap.set(corner, { rotation: spinState.angle }));
    } });
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", onResize);
      cornerSpin.kill();
      corners.forEach((corner, index) => gsap.set(corner, { ...idlePositions[index], rotation: 0, backgroundColor: "transparent" }));
      document.body.style.cursor = originalCursor;
    };
  }, [cursorColor, cursorColorOnTarget, hideDefaultCursor, hoverDuration, spinDuration, targetSelector]);

  return (
    <div ref={cursorRef} className="target-cursor-wrapper" aria-hidden="true">
      <span ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <span className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <span className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <span className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <span className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>
  );
}
