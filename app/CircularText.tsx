"use client";

import { useState } from "react";
import "./CircularText.css";

type HoverMode = "slowDown" | "speedUp" | "pause" | "goBonkers";
type CircularTextProps = {
  text: string;
  spinDuration?: number;
  onHover?: HoverMode;
  className?: string;
};

export default function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = "",
}: CircularTextProps) {
  const [hovered, setHovered] = useState(false);
  const letters = Array.from(text);
  const mode = hovered ? onHover : "idle";
  return (
    <div
      className={`circular-text circular-text--${mode} ${className}`}
      style={{ "--spin-duration": `${spinDuration}s`, "--letter-count": letters.length } as React.CSSProperties}
      aria-label={text}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="circular-text__core">AI / EDIT</span>
      {letters.map((letter, index) => {
        const angle = (360 / letters.length) * index;
        return (
          <span
            className="circular-text__letter"
            key={`${letter}-${index}`}
            style={{ "--angle": `${angle}deg` } as React.CSSProperties}
          >
            {letter === " " ? "·" : letter}
          </span>
        );
      })}
    </div>
  );
}
