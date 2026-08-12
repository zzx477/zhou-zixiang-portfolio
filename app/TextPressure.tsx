"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type TextPressureProps = {
  text?: string;
  fontFamily?: string;
  flex?: boolean;
  scale?: boolean;
  alpha?: boolean;
  stroke?: boolean;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  textColor?: string;
  strokeColor?: string;
  className?: string;
  minFontSize?: number;
};

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const attrValue = (value: number, maxDistance: number, min: number, max: number) => {
  const normalized = Math.max(0, Math.min(1, value / Math.max(maxDistance, 1)));
  return Math.max(min, max - max * normalized + min);
};

export default function TextPressure({
  text = "Hello",
  fontFamily = "\"Segoe UI Variable Display\", \"Microsoft YaHei UI\", \"PingFang SC\", ui-sans-serif, system-ui, sans-serif",
  flex = true,
  scale = false,
  alpha = false,
  stroke = false,
  width = true,
  weight = true,
  italic = true,
  textColor = "#ffffff",
  strokeColor = "#c6adff",
  className = "",
  minFontSize = 54,
}: TextPressureProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const spansRef = useRef<HTMLSpanElement[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const smoothPointer = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize);
  const [isVisible, setIsVisible] = useState(false);
  const chars = Array.from(text);

  const setSize = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const widthValue = root.getBoundingClientRect().width;
    const nextSize = Math.max(
      minFontSize,
      Math.min(widthValue / Math.max(chars.length * 0.96, 1), minFontSize * 2.45),
    );
    setFontSize(nextSize);
  }, [chars.length, minFontSize]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const center = () => {
      const rect = root.getBoundingClientRect();
      pointer.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      smoothPointer.current = { ...pointer.current };
    };
    const onMove = (event: MouseEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
    };
    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) pointer.current = { x: touch.clientX, y: touch.clientY };
    };

    center();
    setSize();
    window.addEventListener("resize", setSize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    let frame = 0;
    const animate = () => {
      smoothPointer.current.x += (pointer.current.x - smoothPointer.current.x) / 14;
      smoothPointer.current.y += (pointer.current.y - smoothPointer.current.y) / 14;
      const title = titleRef.current;
      if (title) {
        const titleRect = title.getBoundingClientRect();
        const maxDistance = Math.max(titleRect.width * 0.72, 240);
        spansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const centerPoint = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          const d = distance(smoothPointer.current, centerPoint);
          const pressure = Math.max(0, 1 - d / maxDistance);
          const fontWidth = width ? Math.round(82 + pressure * 58) : 100;
          const fontWeight = weight ? Math.round(360 + pressure * 470) : 420;
          const fontItalic = italic ? (pressure * 0.12).toFixed(2) : "0";
          const fontAlpha = alpha ? (0.56 + pressure * 0.44).toFixed(2) : "1";
          const scaleX = width ? (0.92 + pressure * 0.28).toFixed(3) : "1";
          const skew = italic ? (-pressure * 5).toFixed(2) : "0";
          const lift = (-pressure * 2.4).toFixed(2);
          span.style.fontVariationSettings = "'wdth' " + fontWidth + ", 'wght' " + fontWeight + ", 'ital' " + fontItalic;
          span.style.fontWeight = String(fontWeight);
          span.style.transform = "translate3d(0, " + lift + "px, 0) scaleX(" + scaleX + ") skewX(" + skew + "deg)";
          span.style.textShadow = pressure > 0.28 ? "0 0 30px rgba(199, 165, 255, " + (pressure * 0.25).toFixed(2) + ")" : "none";
          span.style.opacity = fontAlpha;
        });
      }
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [alpha, italic, setSize, weight, width]);

  return (
    <span
      ref={rootRef}
      className={"text-pressure-root " + className + (isVisible ? " is-visible" : "")}
      style={{ display: "block", width: "100%", height: "1.08em", color: textColor }}
    >
      <span
        ref={titleRef}
        className={"text-pressure-title" + (flex ? " text-pressure-title--flex" : "") + (stroke ? " text-pressure-title--stroke" : "")}
        style={{
          display: flex ? "flex" : "block",
          justifyContent: flex ? "flex-start" : undefined,
          alignItems: "baseline",
          width: "100%",
          fontFamily,
          fontSize,
          lineHeight: scale ? 1 : 0.98,
          transform: scale ? "scaleY(1.08)" : undefined,
          transformOrigin: "left center",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {chars.map((char, index) => (
          <span
            key={index}
            ref={(element) => { if (element) spansRef.current[index] = element; }}
            data-char={char}
            style={{
              display: "inline-block",
              color: stroke ? "transparent" : textColor,
              WebkitTextStroke: stroke ? "1px " + strokeColor : undefined,
              fontWeight: 420,
              letterSpacing: "-0.06em",
              willChange: "font-variation-settings, transform, opacity",
              transition: "color 180ms ease",
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}