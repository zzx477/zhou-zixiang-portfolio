"use client";

import { useDrag } from "@use-gesture/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./DomeGallery.css";
import { publicPath } from "./public-paths";

export type DomeImage = {
  src: string;
  alt: string;
  position?: string;
};

type DomeGalleryProps = {
  images: DomeImage[];
  className?: string;
  fit?: number;
  minRadius?: number;
  maxRadius?: number;
  dragSensitivity?: number;
  dragDampening?: number;
  grayscale?: boolean;
};

type Rotation = { x: number; y: number };

const galleryThumbnail = (src: string) => {
  const normalized = src.replace(/\/gallery\/([^/]+)\.(?:png|jpe?g)$/i, "/gallery/thumbs/$1.webp");
  return publicPath(normalized);
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function DomeGallery({
  images,
  className = "",
  fit = 1.8,
  minRadius = 580,
  maxRadius = 840,
  dragSensitivity = 0.18,
  dragDampening = 0.92,
  grayscale = false,
}: DomeGalleryProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<Rotation>({ x: -5, y: 0 });
  const inertiaFrame = useRef<number | null>(null);
  const [rotation, setRotation] = useState<Rotation>(() => ({ x: -5, y: 0 }));
  const [stageSize, setStageSize] = useState({ width: 1200, height: 720 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const stopInertia = useCallback(() => {
    if (inertiaFrame.current !== null) {
      cancelAnimationFrame(inertiaFrame.current);
      inertiaFrame.current = null;
    }
  }, []);

  const updateRotation = useCallback((next: Rotation) => {
    rotationRef.current = next;
    setRotation(next);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setStageSize({ width, height });
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => stopInertia(), [stopInertia]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const radius = clamp(stageSize.width / Math.max(fit, 0.1), minRadius, maxRadius);
  const columns = clamp(Math.round(stageSize.width / 95), 16, 20);
  const rows = 3;
  const tile = clamp(((Math.PI * 2 * radius) / columns) * 0.68, 132, 178);



  const cells = useMemo(() => Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const theta = (column / columns) * 360 - 180 + (row === 1 ? 10 : 0);
    const phi = -22 + row * 22;
    return { index, theta, phi, image: images[index % images.length] };
  }), [columns, images, rows]);

  const bind = useDrag(({ active, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], memo }) => {
    const origin = memo ?? rotationRef.current;
    if (active) {
      stopInertia();
      updateRotation({
        x: clamp(origin.x - my * dragSensitivity, -24, 24),
        y: origin.y + mx * dragSensitivity,
      });
    } else {
      let speedX = vx * dx * 9.5;
      let speedY = vy * dy * 7.5;
      const glide = () => {
        speedX *= dragDampening;
        speedY *= dragDampening;
        if (Math.abs(speedX) < 0.02 && Math.abs(speedY) < 0.02) {
          inertiaFrame.current = null;
          return;
        }
        updateRotation({
          x: clamp(rotationRef.current.x - speedY, -24, 24),
          y: rotationRef.current.y + speedX,
        });
        inertiaFrame.current = requestAnimationFrame(glide);
      };
      if (vx > 0.01 || vy > 0.01) {
        stopInertia();
        inertiaFrame.current = requestAnimationFrame(glide);
      }
    }
    return origin;
  }, {
    filterTaps: true,
    pointer: { touch: true },
    threshold: 5,
  });

  if (!images.length) return null;

  const selected = selectedIndex === null ? null : images[selectedIndex % images.length];

  return (
    <div className={`dome-gallery ${grayscale ? "dome-gallery--mono" : ""} ${className}`}>
      <div
        {...bind()}
        ref={stageRef}
        className="dome-gallery__stage"
        aria-label="可拖拽浏览的作品照片画廊"
      >
        <div className="dome-gallery__ambient" aria-hidden="true" />
        <div
          className="dome-gallery__orbit"
          style={{ transform: `translateZ(${-radius * 0.38}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          {cells.map((cell) => (
            <button
              className="dome-gallery__tile"
              key={cell.index}
              type="button"
              aria-label={`查看：${cell.image.alt}`}
              onClick={() => setSelectedIndex(cell.index % images.length)}
              style={{
                width: tile,
                height: tile * 1.08,
                transform: `translate(-50%, -50%) rotateY(${cell.theta}deg) rotateX(${cell.phi}deg) translateZ(${radius}px)`,
              }}
            >
              <img
                src={galleryThumbnail(cell.image.src)}
                alt=""
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                draggable={false}
                style={{ objectPosition: cell.image.position }}
                onError={(event) => {
                  const image = event.currentTarget;
                  if (image.dataset.fallbackApplied) return;
                  image.dataset.fallbackApplied = "true";
                  image.src = cell.image.src;
                }}
              />
              <span className="dome-gallery__tile-label">{String((cell.index % images.length) + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <p className="dome-gallery__hint"><span>DRAG TO EXPLORE</span><i /> <span>CLICK TO FOCUS</span></p>
      </div>

      {selected && (
        <div className="dome-gallery__lightbox" role="dialog" aria-modal="true" aria-label={selected.alt} onClick={() => setSelectedIndex(null)}>
          <button className="dome-gallery__close" type="button" aria-label="关闭照片预览" onClick={() => setSelectedIndex(null)}>ESC ×</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={selected.src} alt={selected.alt} decoding="async" style={{ objectPosition: selected.position }} />
            <figcaption>{selected.alt}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
