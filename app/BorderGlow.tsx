"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import "./BorderGlow.css";

type BorderGlowProps = {
  children: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
};

const positions = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const gradientKeys = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
const colorMap = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]) {
  const vars: Record<string, string> = {};
  gradientKeys.forEach((key, index) => {
    const color = colors[Math.min(colorMap[index], colors.length - 1)] ?? "#9bc8ff";
    vars[key] = `radial-gradient(at ${positions[index]}, ${color} 0px, transparent 50%)`;
  });
  vars["--gradient-base"] = `linear-gradient(${colors[0] ?? "#9bc8ff"} 0 100%)`;
  return vars;
}

function buildGlowVars(glowColor: string, intensity: number) {
  const [h = "205", s = "90%", l = "78%"] = glowColor.split(" ");
  const values = [100, 60, 50, 40, 30, 20, 10];
  const suffixes = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};
  values.forEach((opacity, index) => {
    vars[`--glow-color${suffixes[index]}`] = `hsl(${h} ${s.replace("%", "")}%, ${l.replace("%", "")}% / ${Math.min(opacity * intensity, 100)}%)`;
  });
  return vars;
}

function easeOutCubic(value: number) { return 1 - Math.pow(1 - value, 3); }
function easeInCubic(value: number) { return value * value * value; }

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }: { start?: number; end?: number; duration?: number; delay?: number; ease?: (value: number) => number; onUpdate: (value: number) => void; onEnd?: () => void }) {
  const begin = performance.now() + delay;
  const tick = () => {
    const progress = Math.min((performance.now() - begin) / duration, 1);
    onUpdate(start + (end - start) * ease(Math.max(progress, 0)));
    if (progress < 1) requestAnimationFrame(tick);
    else onEnd?.();
  };
  window.setTimeout(() => requestAnimationFrame(tick), delay);
}

export default function BorderGlow({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "205 90 78",
  backgroundColor = "#0b1720",
  borderRadius = 14,
  glowRadius = 30,
  glowIntensity = 0.82,
  coneSpread = 24,
  animated = false,
  colors = ["#7dd3fc", "#a78bfa", "#f0a6ca"],
  fillOpacity = 0.42,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const getCenter = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return [rect.width / 2, rect.height / 2] as const;
  }, []);
  const updatePointer = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const [cx, cy] = getCenter(card);
    const edge = Math.min(Math.max(Math.min(Math.abs(cx / (x - cx || Infinity)), Math.abs(cy / (y - cy || Infinity))) ** -1, 0), 1);
    const angle = (Math.atan2(y - cy, x - cx) * 180) / Math.PI + 90;
    card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
    card.style.setProperty("--cursor-angle", `${(angle < 0 ? angle + 360 : angle).toFixed(3)}deg`);
  }, [getCenter]);

  useEffect(() => {
    const card = cardRef.current;
    if (!animated || !card) return;
    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", "112deg");
    animateValue({ duration: 500, onUpdate: (value) => card.style.setProperty("--edge-proximity", `${value}`) });
    animateValue({ duration: 1400, end: 52, ease: easeInCubic, onUpdate: (value) => card.style.setProperty("--cursor-angle", `${112 + (450 - 112) * (value / 100)}deg`) });
    animateValue({ delay: 2200, duration: 1200, start: 100, end: 0, ease: easeInCubic, onUpdate: (value) => card.style.setProperty("--edge-proximity", `${value}`), onEnd: () => card.classList.remove("sweep-active") });
  }, [animated]);

  const style = {
    "--card-bg": backgroundColor,
    "--edge-sensitivity": edgeSensitivity,
    "--border-radius": `${borderRadius}px`,
    "--glow-padding": `${glowRadius}px`,
    "--cone-spread": coneSpread,
    "--fill-opacity": fillOpacity,
    ...buildGlowVars(glowColor, glowIntensity),
    ...buildGradientVars(colors),
  } as CSSProperties;

  return (
    <div ref={cardRef} onPointerMove={updatePointer} className={`border-glow-card ${className}`} style={style}>
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
